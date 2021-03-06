/*/
    OVERVIEW:
    Generate a Markdown file from a NAPI file.

    ARGS:
    - `--napis  <file...>`  Input NAPIs in JSON or YAML format.
    - `--outdir <dir>`      Output directory.
    - `--watch`

    DETAILS:
    This command is used to create the Markdown source files.
    - https://neutralino.js.org/docs/configuration/neutralino.config.md
    - https://neutralino.js.org/docs/api/*.md
    
    **Note:** The output file name is different than the existing.
    - currently: `neutralino.config.json.md`
    - output: `neutralino.config.schema.md`
/*/

/// <reference path="./types.d.ts" />
//@ts-check

import chokidar from 'chokidar'
import { NapiDocument, getObjectKeys } from './lib/napi.js'
import { readYamlFile, changeDestination, writeFile } from './lib/io.js'
import { isMain, hasArgument, requireArgumentList, requireArgument } from '../tools/lib/cmd.js'

import { unified } from 'unified'
import RemarkStringify from 'remark-stringify'
import RemarkFrontmatter from 'remark-frontmatter'


if (isMain (import.meta))
    main ()

export function main ()
{
    const apifiles = requireArgumentList ('--napis')
    const outdir    = requireArgument ('--outdir')
    const processor = unified()
        .use (RemarkFrontmatter)
        .use (RemarkStringify, {
            bullet: '*',
            fence: '`',
            fences: true,
            incrementListMarker: false,
            listItemIndent: 'one',
            tightDefinitions: true
        })

    generate ()

    if (hasArgument ('--watch') === false)
        return

    const watcher = chokidar.watch (apifiles, { persistent: true, depth: 0 })
    watcher.on ('ready', () =>
    {
        watcher.on ('change', generate)
        watcher.on ('add', generate)
    })
    
    function generate ()
    {
        apifiles.map (async path => 
        {
            const doc = new NapiDocument (path, await readYamlFile (path, false))
            // @ts-ignore
            const content = processor.stringify (createMdast (doc))
            writeFile (changeDestination (path, outdir, '.md'), content)
        })
    }
}

//-----------------------------------------------------------------------------
// Node Builders
//-----------------------------------------------------------------------------
// help: https://opis.io/json-schema/2.x/multiple-subschemas.html


import { fromMarkdown } from 'mdast-util-from-markdown'
import {
    root,
    text,
    strong,
    inlineCode,
    paragraph,
    heading,
    list,
    listItem,
    html
} from 'mdast-builder'

/**
    @typedef {import ('unist').Node} UnistNode
    @typedef {import ('mdast').Root} Root
*/


/**
 * @param {NapiDocument} doc
 * @returns {Root}
 */
export function createMdast (doc)
{
    const ast = root ([
        // @ts-ignore,
        { type: 'yaml', value: 'title: ' + doc.fields.$namespace },
        paragraph (fromMarkdown (doc.fields.description || '<!-- NO DESCRIPTION -->', 'utf8').children)
    ])
    const out = ast.children

    for (var key in doc.roots)
    {
        var item = doc.roots[key]

        out.push (
            heading (2, text (key)),
            ...createDescription (doc, item)
        )

        if (item.params)
        {
            out.push (
                heading (3, text ('Parameters')),
                ...createSchemaItem  (doc, undefined, doc.getRef (item.params))
            )
        }

        if (item.result)
        {
            out.push (
                heading (3, text ('Return')),
                ...createSchemaItem  (doc, undefined, doc.getRef (item.result))
            )
        }
    }

    // @ts-ignore
    // mdast-builder has bad type annotation support.
    // It only returns Unist types and not Mdast types.
    return ast 
}

/**
 * @param {NapiDocument} doc
 * @param {string|undefined} key
 * @param {SchemaItem} item
 * @returns {UnistNode[]}
 */
function createSchemaItem  (doc, key, item, headingLevel = 3)
{
    /** @type {UnistNode[]} */
    const out = []

    /** @param {string} ref */
    const refname = (ref) => ref.substring (2) // "#/..."

    if ('oneOf' in item)
    {
        out.push (paragraph ([
            text ('One of '), ...formatHumanSequence (item.oneOf.map (sub => {
                return strong (inlineCode (refname (sub.$ref)))
            })),
        ]))

        item.oneOf.forEach ((sub, i) => {
            var subkey = refname (sub.$ref)
            var subitem = doc.getRef (sub)
            out.push (...createSchemaItem (doc, subkey, subitem, headingLevel+1))
        })
    }
    else if ('anyOf' in item)
    {
        out.push (paragraph ([
            text ('Any of'), ...formatHumanSequence (item.anyOf.map (sub => text (refname (sub.$ref)))),
        ]))

        item.anyOf.forEach ((sub, i) => {
            var subkey = refname (sub.$ref)
            var subitem = doc.getRef (sub)
            out.push (...createSchemaItem (doc, subkey, subitem, headingLevel+1))
        })
    }
    else if ('properties' in item)
    {
        if (key) out.push (
            heading (headingLevel, text (key)),
            paragraph (createDescription (doc, item))
        )
        out.push (...createObjectProperties (doc, item))
    }
    else
    {
        throw new Error (item)
    }

    return out
}

/**
 * @param {NapiDocument} doc
 * @param {TypeObject} item
 * @returns {UnistNode[]}
 */
function createObjectProperties (doc, item)
{
    /** @type {UnistNode[]} */
    const out = []

    const props = item.properties
    const args = getObjectKeys (item)

    /** @type {Record <string, SchemaItem>} */
    const subSchemas = {}

    if (args.required) out.push (
        paragraph (strong (text ('required'))),
        list ("unordered", args.required.map (key => format (key, props[key])))
    )

    if (args.optional) out.push (
        paragraph (strong (text ('Optional'))),
        list ("unordered", args.optional.map (key => format (key, props[key])))
    )
    
    for (var key in subSchemas) {
        out.push (...createSchemaItem (doc, key, subSchemas[key], 4))
    }

    return out

    /**
    * @param {string} key
    * @param {Schema} item 
    */
    function format (key, item)
    {
        // oneOf and anyOf are previously captured in pushSchemaItem
        if ('$ref' in item)
        {
            if (item.$ref.startsWith ('#/'))
                subSchemas[item.$ref.substring (2)] = doc.getRef (item)
        }
        else if ('type' in item && item.type === 'array' && '$ref' in item.items)
        {
            if (item.items.$ref.startsWith ('#/'))
                subSchemas[item.items.$ref.substring (2)] = doc.getRef (item.items)
        }
        return listItem (paragraph ([inlineCode (key + ': ' + formatTsType (item)), text (' '), ...createDescription (doc, item)]))
    }
}

/**
 * @param {NapiDocument} doc
 * @param {SchemaItem|RequestItem|MethodItem|Schema} item 
 * @returns {UnistNode[]}
 */
function createDescription (doc, item)
{
    if ('$ref' in item)
        return createDescription (doc, doc.getRef (item))
    
    if ('anyOf' in item)
        return [paragraph ([
            text ('any of '), ...item.anyOf.map (item => text (formatTsType (item)))
        ])]
    
    if ('oneOf' in item)
        return [paragraph ([
            text ('one of '), ...item.oneOf.map (item => text (formatTsType (item)))
        ])]
    
    return item.description
        ? fromMarkdown (item.description, 'utf8').children
        : [paragraph (html ('<!-- NO DESCRIPTION -->'))]
}


//-----------------------------------------------------------------------------
// String Utilities
//-----------------------------------------------------------------------------


/**
 * Take a list of words and return the literal enumeration.
 * With `['a', 'b', 'b']` the return value is `a, b, or c`
 * @param {import ('unist').Node[]} nodes 
 * @returns {import ('unist').Node[]}
 */
function formatHumanSequence (nodes, sep = ', ', or = ' or ')
{
    const out = []
    for (var i = 0; i < nodes.length-2; i++) out.push (nodes[i], text (sep))
    out.push (nodes[i++], text (or), nodes[i])
    return out
}


/**
 * @param {Schema} item 
 * @returns {string}
 */
function formatTsType (item)
{
    if ('$ref' in item)
        return item.$ref.substring (2) // "#/..."

    if ('anyOf' in item)
        return 'Array <' + item.anyOf.map (item => formatTsType (item)).join ('|') + '>'
    
    if ('oneOf' in item)
        return item.oneOf.map (item => formatTsType (item)).join ('|')

    switch (item.type)
    {
    case 'array':
        return formatTsType (item.items) + '[]'
    case 'integer':
        return 'number'
    default:
        return item.type //.substring (5) // "json:..."
    }
}
