/*/
    OVERVIEW:
    Generate a HTML file from a Markdown file.
/*/

/// <reference path="./types.d.ts" />
//@ts-check

// node tools/@napi.md.js --apifiles spec/napi/*.yaml
// https://opis.io/json-schema/2.x/multiple-subschemas.html

import Fs from 'fs'
import Path from 'path'
import Yaml from 'yaml'
import chokidar from 'chokidar'

import { toHast, all } from 'mdast-util-to-hast'
import { toHtml } from 'hast-util-to-html'
import { toString } from 'mdast-util-to-string'

import { ROOT_DIR } from '../tools/lib.js'
import { isMain, hasArgument, requireArgumentList, requireArgument } from './lib/cmd.js'
import { changeDestination, writeFile } from './lib/io.js'
import { NapiDocument } from './lib/napi.js'


if (isMain (import.meta))
    main ()

export async function main ()
{
    const apifiles = requireArgumentList ('--napis')
    const outdir  = requireArgument ('--outdir')

    await generate ()

    if (hasArgument ('--watch') === false)
        return

    const watcher = chokidar.watch (apifiles, { persistent: true, depth: 0 })
    watcher.on ('ready', () =>
    {
        watcher.on ('change', generate)
        watcher.on ('add', generate)
    })
    
    async function generate ()
    {
        /** 
         * @typedef {{
         *     url: string,
         *     ids: string[]
         * }} PageDescription
         * 
         * @type {Record <string, PageDescription>}
         */
        const menudesc = {}
    
        await Promise.all (apifiles.map (async path => 
        {
            const outpath = changeDestination (path, outdir, '.html')
            const outdata = napiToHtml (new NapiDocument (
                path,
                Yaml.parse (Fs.readFileSync (path, { encoding: 'utf8' }))
            ))

            menudesc[outdata.matter.title] = {
                ids: outdata.anchors,
            // TODO be able to configure a custom root path.
                url: '/' + Path.relative (ROOT_DIR, outpath).replace (/\\/g, '/')
            }

            writeFile (outpath, outdata.html)
        }))
        
        writeFile (
            Path.join (outdir, 'sidebar.js'),
            '// !!! This file is generate by a script, do not modify it. !!!\n' +
            'export default ' + JSON.stringify (menudesc, null, 2)
        )
    }
}


//------------------------------------------------------------------------------
// Code Generators
//------------------------------------------------------------------------------

import { createMdast } from './@napi.md.js'
import { zhastToHast, ZNode, toZTree } from './lib/znode.js'

/**
 * @typedef {import ('mdast').Root} MdastRoot
 * @typedef {import ('mdast').Content} MdastContent
 * @typedef {import ('mdast').Heading} MdastHeading
 * @typedef {import ('mdast').Literal} MdastLiteral
 *
 * @typedef {import ('hast').Element} HastElement
 * @typedef {import ('hast').Root} HastRoot
 */

/**
 * @param {NapiDocument} doc
 */
export function napiToHtml (doc)
{
    const mdast = createMdast (doc)

    /** @type {string[]} */
    const ids = []

    /** @type {Record <string, any> & { title?: string }} */
    var matter = null

    var hast = toHast (mdast, {
        allowDangerousHtml: false,
        handlers:
        {
            /**
             * @param {MdastLiteral} node 
             */
            yaml: (h, node) =>
            {
                matter = Yaml.parse (node.value)
                return h (node.position, 'h1', [{ type: 'text', value: matter.title }])
            },
            /**
             * @param {MdastHeading} node 
             */
            heading: (h, node) =>
            {
                if (node.depth === 2) {
                    var id = toString (node)
                    ids.push (id)
                    return h (node.position, 'h' + node.depth, { id }, all (h, node))
                }
                return h (node.position, 'h' + node.depth, all (h, node))
            },
        }
    })

    
    const htags = ["h1", "h2", "h3", "h4", "h5", "h6"]
    var ztree = toZTree (hast, el =>
    {
        if ('tagName' in el) {
            const idx = htags.indexOf (el['tagName'])
            return idx == -1 ? null : idx + 1
        }
        return null
    })
    
    return {
        matter: matter || {},
        anchors: ids,
        html: '<!-- !!! This file is generate by a script, do not modify it. !!! -->\n'
            + toHtml ({
                type: 'root',
                position: mdast.position,
                // children: zhastToHast (HastToZTree (hast))
                children: ztree.children.map (c => c instanceof ZNode ? zhastToHast (c) : c)
            })
    }
}
