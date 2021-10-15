/*/
    OVERVIEW:
    Generate a Typescript definition file from API files.

    ARGS:
    - `--napis   <file...>` Input NAPIs in JSON or YAML format.
    - `--outfile <file>`    TypeScript definition output file.
    - `--watch`

    DETAILS:
    This command is used to create the `neutralino.messages.d.ts`
    file to add type checking to the client API's `request` function.
/*/

/// <reference path="./types.d.ts" />
//@ts-check

import Path from 'path'
import chokidar from 'chokidar'
import { NapiDocument, splitRefPath } from './lib/napi.js'
import { readYamlFile, writeFile } from './lib/io.js'
import { visitObject } from './lib/obj.js'
import { isMain, hasArgument, requireArgument, requireArgumentList } from '../tools/lib/cmd.js'

/**
    @typedef {
        ReturnType <typeof splitRefPath> &
        { doc: NapiDocument }
    } ExternalDoc 
*/


if (isMain (import.meta))
    main ()

export async function main ()
{
    const apifiles = requireArgumentList ('--napis').map (path => Path.resolve (path))
    const outfile  = requireArgument ('--outfile')

    const apidocs = await Promise.all (apifiles.map (
        async path => new NapiDocument (path, await readYamlFile(path, false))
    ))

    generate ()

    if (hasArgument ('--watch') === false)
        return

    const watcher = chokidar.watch (apifiles, { persistent: true, depth: 0 })
    watcher.on ('ready', () =>
    {
        watcher.on ('change', generate)
        watcher.on ('add', generate)
    })
    
    async function generate () {
        writeFile (outfile, await formatApis (apidocs))
    }
}


//------------------------------------------------------------------------------
// Code Generators
//------------------------------------------------------------------------------


/**
 * @param {NapiDocument[]} apidocs
 */
async function formatApis (apidocs)
{    
    /** @param {string} path */
    const moduleName = (path) => {
        let name = Path.basename (path.substring (0, path.lastIndexOf ('.')))
        return name[0].toUpperCase () + name.substring (1)
    }

    /** @type {ExternalDoc[]} */
    const externals = []
    const contents = await Promise.all (
        apidocs.map (async doc =>
        {
            const content = await formatModule (moduleName (doc.path), doc)
            externals.push (...(await getExternalNapis (doc)))
            return content
        })
    )

    var requests = 'export type Requests = ' + apidocs.map (
        doc => moduleName (doc.path) + '.Requests'
    ).join (' & ')

    const externdts = await Promise.all (
        externals.map (entry => formatModule ("'" + entry.fspath + "'", entry.doc))
    )

    return '\n' + requests + '\n\n' + contents.join ('\n\n') + '\n\n' + externdts
}

/**
 * @param {string} name 
 * @param {NapiDocument} doc 
 */
async function formatModule (name, doc)
{
    const def = '$ref' in doc.fields
              ? 'export default ' + doc.fields.$ref.substring (2) + ';\n' // '#/...'
              : ''

    return 'declare module ' + name + ' {\n\n'
         + formatModuleRequests (doc) + '\n'
         + formatModuleTypes (doc) + '\n'
         + def
         + '};/*' + name + '*/'
}

/**
 * @param {NapiDocument} doc 
 */
function formatModuleRequests (doc)
{
    var ns = Path.basename (doc.path.substring (0, doc.path.lastIndexOf ('.') + 1))

    /** @param {string} ref */
    const refname = (ref) => ref.substring (2) // "#/..."

    /** @param {string} txt */
    const quote = (txt) => "'" + txt + "'"

    const nl1 = ' '.repeat (3)
    const nl2 = nl1.repeat (2)
    
    var arr = ['export type Requests = {']

    for (var key in doc.roots)
    {
        var item = doc.roots[key]
        if (item.type === 'js:method') continue

        arr.push (nl1 + '[' + quote (ns + key) + ']: {')

        if (item.description) arr.push (
            nl2 + '/**',
            ... item.description.split ('\n').map (line => nl2 + ' * ' + line),
            nl2 + ' */'
        )
        arr.push (nl2 + 'method: ' + quote (item.type.substring (5)) + ',')

        if (item.params)
            arr.push (nl2 + 'params: ' + refname (item.params.$ref) + ',')
        else
            arr.push (nl2 + 'params: void,')

        if (item.result)
            arr.push (nl2 + 'result: ' + refname (item.result.$ref) + ',')
        else
            arr.push (nl2 + 'result: void,')

        arr.push (nl1 + '}')
    }

    arr.push ('}')
    
    return arr.join ('\n')
}

/**
 * @param {NapiDocument} doc
 */
function formatModuleTypes (doc)
{
    var str = ''
    for (var key in doc.schemas)
    {
        var sch = doc.schemas[key]
        str += formatDescription (sch) + '\n' + 'export type ' + key + ' = ' + formatType (doc, sch) + ';\n'
    }
    return str
}

/**
 * @param {Schema} sch 
 */
function formatDescription (sch, level = 0)
{
    if ('$ref' in sch)
    {
        return ''
    }
    else if ('oneOf' in sch)
    {
        return ''
    }
    else if ('anyOf' in sch)
    {
        return ''
    }
    else if ('allOf' in sch)
    {
        return ''
    }

    const nl = ' '.repeat (level*4)

    var str = ''

    if (sch.description)
        str += sch.description.trim ().split ('\n').map (line => nl + ' * ' + line).join ('\n') + '\n'

    if (sch.deprecated)
        str += nl + ' * @deprecated \n'
        
    return str === '' ? '' : nl + '/**\n' + str + nl + ' */'
}

/**
 * @param {NapiDocument} doc
 * @param {Schema} sch 
 * @returns {string}
 */
function formatType (doc, sch, level = 0)
{
    /** @param {string} ref */
    const refname = (ref) => 
    {
        if (ref.startsWith ('#/'))
            return ref.substring (2)

        const parts = splitRefPath (ref)
        const comps = parts.getJsonComponents ()
        return comps.length === 0
             ? 'import (\'' + parts.fspath + '\').default'
             : 'import (\'' + parts.fspath + '\').' + comps.join ('.')
    }

    if ('oneOf' in sch)
    {
        // union |
        return sch.oneOf.map (item => refname (item.$ref)).join (' | ')
    }
    else if ('anyOf' in sch)
    {
        return 'never /*anyOf NOT YIET IMPLEMENTED*/'
    }
    else if ('allOf' in sch)
    {
        // intersection &
        return 'never /*allOf NOT YIET IMPLEMENTED*/'
    }
    else if ('$ref' in sch)
    {
        return refname (sch.$ref) 
    }
    else if (sch.type === 'object')
    {
        const nl1 = ' '.repeat (level*4)
        level++
        const nl2 = ' '.repeat (level*4)

        var str = '{\n'

        const optional = sch.required
                       ? (k) => sch.required.includes (k) ? '' : '?'
                       : () => ''
        
        for (var key in sch.properties)
        {
            var item = sch.properties[key]
            str += formatDescription (item, level) + '\n'
                +  nl2 + key + optional (key) + ': ' + formatType (doc, item, level) + ';\n'
        }
        
        return str + nl1 + '}'
    }
    else
    {
        switch (sch.type)
        {
        case 'array':
            return 'Array <' + formatType (doc, sch.items, level) + '>'
        case 'integer':
            return 'number'
        default:
            return sch.type
        }
    }
}

/**
 * @param {NapiDocument} doc
 * @param {boolean} [recursive]
 */
async function getExternalNapis (doc, recursive = false)
{
    /** @type {ExternalDoc[]} */
    const out = []

    const todo = [doc]

    while (doc = todo.pop())
    {
        for (var key in doc.schemas)
        {
            await visitObject (
                doc.schemas[key],
                /** @param {Schema} sch */
                sch => '$ref' in sch,
                /** @param {Ref} sch */
                async sch =>
                {
                    if (sch.$ref.startsWith ('#')) return
                    var parts = splitRefPath (sch.$ref)
                    var path  = Path.isAbsolute (parts.fspath)
                              ? parts.fspath
                              : Path.resolve (Path.dirname (doc.path), parts.fspath)
                    var entry = {
                        ...parts,
                        doc: new NapiDocument (path, await readYamlFile (path, false))
                    }
                    out.push (entry)
                    if (recursive) todo.push (entry.doc)
                }
            )
        }
    }

    return out
}
