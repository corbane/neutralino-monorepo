
/// <reference path="../types.d.ts" />
//@ts-check

import Fs from 'fs'
import Path from 'path'
import Yaml from 'yaml'

/**
    @typedef {{
        resolve?: (item: string, doc: NapiDocument) => string | SchemaItem | Ref
    }} NapiOptions
*/

export class NapiDocument
{
    /** @type {string} */
    path

    /** @type {Record <string, string>} */
    fields = {}

    /** @type {Record <string, RequestItem|MethodItem>} */
    roots = {}

    /** @type {Record <string, SchemaItem>} */
    schemas = {}

    /** @type {Record <string, NapiDocument>} */
    externals = {}

    /** @type {NapiOptions} */
    options

    /**
     * @param {string} path 
     * @param {Napi} api 
     * @param {NapiOptions} options
     */
    constructor (path, api, options = {})
    {
        this.path = path
        this.options = options
            
        for (var key in api)
        {
            var item = api[key]
            if (typeof item === 'string')
            {
                this.fields[key] = item
            }
            else if (
                'anyOf' in item ||
                'oneOf' in item ||
                item.type === 'object'
            ) {
                this.schemas[key] = item
            }
            else if (item.type === 'http:get' || item.type === 'http:post')
            {
                this.roots[key] = item
            }
            else if (item.type === 'js:method')
            {
                this.roots[key] = item
            }
            else if (item.type === 'js:event')
            {
                throw new Error ('Not yiet implemented: js:event')
            }
            else
            {
                throw new Error ('Unknown item type')
            }
        }
    }

    /**
     * @param {string | Ref} item 
     * @returns {SchemaItem}
     */
    getRef (item)
    {
        /** @type {string | Ref | SchemaItem} */
        var ref = typeof item === 'string' ? item : item.$ref

        var out = this.tryGetRef (ref)
        if (out) return out

        ref = this.options.resolve
            ? this.options.resolve (ref, this)
            : item
        
        if (typeof ref === 'string') {/**/}
        else if ('$ref' in ref) ref = ref.$ref
        else return ref

        var out = this.tryGetRef (ref)
        if (out) return out

        const keypath = getFsPath (ref)
        const abspath = Path.isAbsolute (keypath) ? keypath : Path.join (Path.dirname (this.path), keypath)
        const subdoc  = this.externals[keypath] = new NapiDocument (abspath, Yaml.parse (Fs.readFileSync (abspath, { encoding: 'utf8' })), this.options)

        var out = subdoc.getRef (getJsonPath (ref))
        if (out == null) throw new Error (
            'JSON reference "' + (typeof item === 'string' ? item : item.$ref) + '" not found\n' +
            'in document ' + this.path
        )

        return out
    }

    /**
     * @param {string} ref
     * @returns {undefined|SchemaItem}
     */
    tryGetRef (ref)
    {
        if (ref === '#')
            return '$ref' in this.fields
                 ? this.schemas[this.fields.$ref.substring (2)]
                 : undefined

        if (ref.substring (0, 2) === '#/')
            return this.schemas[ref.substring (2)]
        
        if (ref in this.externals)
            return this.externals[ref].tryGetRef (getJsonPath (ref))

        return undefined
    }
}

/** @param {string} ref */
function getFsPath (ref)
{
    if (ref.endsWith ('#')) {
        return ref.substring (0, ref.length - 1)
    } else {
        var i = ref.indexOf ('#/')
        return i < 0 ? ref : ref.substring (0, i)
    }
}

/** @param {string} ref */
function getJsonPath (ref)
{
    var i = ref.indexOf ('#/')
    return i < 0 ? '#' : ref.substring (i)
}

/** @param {string} ref */
export function splitRefPath (ref)
{
    return {
        fspath: getFsPath (ref),
        jsonpath: getJsonPath (ref),
        getJsonComponents () {
            return this.jsonpath === '#'
                 ? []
                 : this.jsonpath.startsWith ('#/')
                 ? this.jsonpath.substring (2).split ('/')
                 : this.jsonpath.split ('/')
        }
    }
}


/**
 * @param {TypeObject} item 
 */
export function getObjectKeys (item)
{
    const keys = Object.keys (item.properties)
    const required = item.required

    if (required == null ||
        required.length === 0
    ) return {
        required: null,
        optional: keys.length ? keys : null
    }

    for (var i = 0; i < keys.length; i++)
    {
        var key = keys[i]
        if (required.includes (key))
            keys.splice (i--, 1)
    }

    return {
        required: item.required, 
        optional: keys.length ? keys : null 
    }
}


/**
 * There is no function signature overload for a call to the server.
 * This method ensures that the parameters are not of type `OneOf`, `AnyOf`
 * @param {SchemaItem} params 
 * @returns {asserts params is TypeObject}
 */
export function ensureParamsAsObject (params)
{
    if ('properties' in params)
        return

    throw new Error (
        'The "params" fields must be an object.\n' +
        'They cannot be an intersection or union of multiple subtypes (`oneof`, `allof`, `anyof`).'
    )
}