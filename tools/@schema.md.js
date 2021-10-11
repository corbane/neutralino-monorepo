/*/
    OVERVIEW:
    Convert a JSON/YAML schema to a Markdown file

    WORK_IN_PROGRESS:

    USAGE:
    > `node make-md-schemas --schemas <path[]> --outdir <path>`

    FOR_NEUTRALINO:
    This command is used to create the [neutralino.config.json](https://neutralino.js.org/docs/configuration/neutralino.config.json) markdown page.
    
    > `node make-md-schemas --schemas ./models/neutralino.config.schema.yaml --outdir site/docs/configuration/`

    NOTE:
    The output file name is different than the existing.
    - currently: `neutralino.config.json.md`
    - output: `neutralino.config.schema.md`
/*/

//@ts-check

import Fs from 'fs'
import Path from 'path'
import { __dirname, requireArgument, requireArgumentList, changeDestination } from './lib.js'
import { readYamlFile } from './lib.js'

/**
    @typedef {import ('json-schema').JSONSchema7} JSONSchema7
    @typedef {import ('json-schema').JSONSchema7Definition} JSONSchema7Definition
*/


export function main ()
{
    const schfiles = requireArgumentList ('--schemas').map (path => Path.resolve (path))
    const outdir   = Path.resolve (requireArgument ('--outfile'))
    
    schfiles.forEach (async path =>
    {
        const yaml = await readYamlFile (path)
        const content = toMd (yaml)
        const outfile = changeDestination (path, outdir, '.md')
        
        console.log ('Write ' + outfile)
        Fs.writeFileSync (outfile, content)
    })
}


// #region Unsupported features

/**
    @param {JSONSchema7Definition} obj
    @returns {asserts obj is JSONSchema7}
*/
function _ensureSchemaDefinition (obj)
{
    if (obj == null || typeof obj !== 'object' || Array.isArray (obj) ) throw 'JSONSchema7Definition'
}

/** 
    @param {JSONSchema7Definition | JSONSchema7Definition[]} obj
    @returns {asserts obj is JSONSchema7Definition}
    @link https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.4
*/
function _ensureNotSchemaDefinitionArray (obj)
{
    if (Array.isArray (obj) ) throw 'Feature not yet implemented: Schema.items as array'
}

/**
    @template {{ $ref?: any }} T
    @param {T} obj
    @returns {asserts obj is Omit <T, "$ref">}
*/
function _ensureNot$Ref (obj)
{
    if ('$ref' in obj) throw (
        'References are not supported.\n' +
        'Before running this script, you must flatten the schema and verify that the references are not circular.'
    )
}

/**
    @param {string | string[]} type
    @returns {asserts type is string}
    @link https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.1
 */
function _ensureNotTypeArray (type)
{
    if (Array.isArray (type)) throw 'Feature not yet implemented: Schema.type as array'
}

// #endregion


// #region Utilities

/** @param {{ description?: string }} obj */
function _description (obj)
{
    return obj.description
         ? obj.description.replace ('\n', '\n  ')
         : '<!-- NO DESCRIPTION -->'
}

/** @param {number} level */
function _incLevel (level)
{
    return level >= 6 ? 6 : level + 1
}

// #endregion


// #region Generators
// Adaptation of https://github.com/saibotsivad/json-schema-to-markdown/tree/master/test/markdown

/**
    @param {JSONSchema7} schema 
    @param {number} [level] 
    @returns 
 */
export function toMd (schema, level = 1)
{
    /** @type {string[]} */
    var out = []

    var subSchemaTypes = Object.keys (schema.definitions || {}).reduce (function (map, subSchemaTypeName)
    {
        map['#/definitions/' + subSchemaTypeName] = subSchemaTypeName
        return map
    }, {})

    // if (schema.title)
    //     out.push (octothorpes + ' ' + schema.title)

    if (schema.type === 'object')
    {
        if (schema.description)
            out.push (_description (schema))
        
        generatePropertySection (level, '', schema, subSchemaTypes).forEach (section => { out = out.concat (section) })
    }
    else
    {
        out = out.concat (propertySection (level, undefined, false, schema, subSchemaTypes));
    }

    if (schema.definitions)
    {
        out.push (
            '---',
            '#'.repeat (level) + ' Sub Schemas',
            'The schema defines the following additional types:'
        )

        Object.entries (schema.definitions).forEach (([name, schema]) =>
        {
            if (typeof schema !== 'object') return

            out.push (
                '#'.repeat (level) + '# `' + name + '` (' + schema.type + ')',
                '  ' + _description (schema)
            )
            
            if (schema.type === 'object')
            {
                if (schema.properties)
                    out.push ('Properties of the `' + name + '` object:')
            }

            generatePropertySection (_incLevel (level), '', schema, subSchemaTypes)
                .forEach (section => { out = out.concat (section) })
        })
    }

    return out.filter (line => line != null ).join('\n\n')
}

/**
    @param {number} level
    @param {string} path 
    @param {JSONSchema7} schema 
    @param {Record <string, JSONSchema7>} subSchemas 
    @returns {string[]}
 */
function generatePropertySection (level, path, schema, subSchemas)
{
    if (schema.properties)
    {
        return Object.entries (schema.properties).map (([key, prop]) =>
        {
            _ensureSchemaDefinition (prop)

            return propertySection (
                _incLevel (level),
                path ? key = path + '.' + key : key,
                schema.required && schema.required.indexOf (key) >= 0,
                prop,
                subSchemas
            )
        })
        .flat ()
    }
    else if (schema.oneOf)
    {
        var types = schema.oneOf.map (innerSchema =>
        {
            // @ts-ignore   _validateSchemaDefinition (innerSchema)
            return '`' + (innerSchema.title || innerSchema.type || schema.type) + '`'
        })
        
        return [
            'This property must be one of ' + types.splice (0, types.length - 1).join (', ') + ' or ' + types[0],
            ...schema.oneOf.map (innerSchema =>
            {
                _ensureSchemaDefinition (innerSchema)
            
                return [
                    '#'.repeat (_incLevel (level)) + ' `' + (innerSchema.title || innerSchema.type || schema.type) + '`',
                    ...generatePropertySection (
                        _incLevel (level),
                        path,
                        innerSchema,
                        subSchemas
                    )
                ]
            }).flat ()
        ]
    }
    else
    {
        return []
    }
}

/**
    @param {number} level
    @param {string} name 
    @param {boolean} isRequired 
    @param {JSONSchema7} schema 
    @param {Record <string, JSONSchema7>} subSchemas 
    @returns 
 */
function propertySection (level, name, isRequired, schema, subSchemas)
{
    _ensureNotTypeArray (schema.type)

    var text = [
        propertyTitle (level, name, schema.type, isRequired, schema.enum != null),
        '  ' + _description (schema)
    ]

    if (schema.type === 'object')
    {
        if (schema.properties)
        {
            // text.push('Properties of the `' + name + '` object:')
            generatePropertySection (level, name, schema, subSchemas).forEach (section => { text = text.concat(section) })
        }
    }
    else if (schema.type === 'array')
    {
        _ensureNotSchemaDefinitionArray (schema.items)
        _ensureSchemaDefinition (schema.items)
        _ensureNot$Ref (schema.items)

        var itemsType = schema.items && schema.items.type


        if (itemsType && name)
        {
            text.push ('  The object is an array with all elements of the type `' + itemsType + '`.')
        }
        else if (itemsType)
        {
            text.push ('  The schema defines an array with all elements of the type `' + itemsType + '`.')
        }
        else
        {
            var validationItems = []

            if (schema.items.allOf)
            {
                text.push ('  The elements of the array must match *all* of the following properties:')
                validationItems = schema.items.allOf
            } 
            else if (schema.items.anyOf)
            {
                text.push ('  The elements of the array must match *at least one* of the following properties:')
                validationItems = schema.items.anyOf
            } 
            else if (schema.items.oneOf)
            {
                text.push ('  The elements of the array must match *exactly one* of the following properties:')
                validationItems = schema.items.oneOf
            } 
            else if (schema.items.not)
            {
                throw new Error ('Not yiet implemented: Schema.not')
                // text.push ('  The elements of the array must *not* match the following properties:')
                // validationItems = schema.items.not // !!!! `not` is not a array !!!!
            }

            validationItems.forEach (item => {
                text = text.concat (propertySection (level, item.title, false, item, subSchemas))
            })
        }

        if (itemsType === 'object')
        {
            text.push('  The array object has the following properties:')
            generatePropertySection (level, name, schema.items, subSchemas)
                .forEach (section => { text = text.concat (section) })
        }
    }
    else if (schema.oneOf)
    {
        text.push (
            '  The object must be one of the following types:',
            ...schema.oneOf.map (oneOf => '  * `' + subSchemas[oneOf['$ref']] + '`')
        )
    }

    if (schema.enum)
    {
        text.push (
            '  This element must be one of the following enum values:',
            ...schema.enum.map (enumItem => '  * `' + enumItem + '`')
        )
    }

    if (schema.default !== undefined)
    {
        if (schema.default === null || ["boolean", "number", "string"].indexOf(typeof schema.default) !== -1)
        {
            text.push('  Default: `' + JSON.stringify(schema.default) + '`')
        }
        else
        {
            text.push (
                '  Default: ```',
                '  ' + JSON.stringify(schema.default, null, 2),
                '  ```'
            )
        }
    }

    var restrictions = propertyRestrictions (schema)

    if (restrictions)
    {
        text.push (
            '  Additional restrictions:',
            restrictions
        )
    }

    return text
}

/**
    @param {number} level 
    @param {string} elementName 
    @param {string} elementType 
    @param {boolean} isRequired 
    @param {boolean} isEnum 
    @param {string} [example] 
    @returns 
*/
function propertyTitle (level, elementName, elementType, isRequired, isEnum, example)
{
    var out = '- ' + '#'.repeat (level)

    if (elementName)
        out += ' `' + elementName + '`'
    
    if (elementType || isRequired)
    {
        out += ' ('
        if (elementType) out += elementType
        if (isEnum)      out += ', enum'
        if (isRequired)  out += ', required'
        out += ')'
    }

    if (example)
        out += ' eg: `' + example + '`'
    
    return out
}

function propertyRestrictions (schema)
{
    /** @param {keyof JSONSchema7} key */
    const generate = (key, text) => schema[key]
                                  ? '* ' + text + ': `' + schema[key] + '`'
                                  : null

    return [
        generate ('minimum', 'Minimum'),
        generate ('maximum', 'Maximum'),
        generate ('pattern', 'Regex pattern'),
        generate ('minItems', 'Minimum items'),
        generate ('uniqueItems', 'Unique items')
    ].filter(text => text != null).join('\n')
}

// #endregion
