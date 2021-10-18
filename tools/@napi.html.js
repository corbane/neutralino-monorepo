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

    /**
     * @type {{
     *  [path: string]: ReturnType <typeof napiToHtml> & { outpath: string }
     * }}
     */
    const outdata = {}

    await generateHtml (apifiles).then (() => generateSidebarJs ())

    if (hasArgument ('--watch') === false)
        return

    const watcher = chokidar.watch (apifiles, { persistent: true, depth: 0 })
    watcher.on ('ready', () =>
    {
        watcher.on ('change', (path) => generateHtml ([path]).then (() => generateSidebarJs ()))
        // watcher.on ('add', () => generateHtml ().then (() => generateSidebarJs ()))
    })
    
    /**
     * @param {string[]} apifiles 
     */
    async function generateHtml (apifiles)
    {
        await Promise.all (apifiles.map (async path => 
        {
            const outpath = changeDestination (path, outdir, '.html')
            const data = napiToHtml (new NapiDocument (
                path,
                Yaml.parse (Fs.readFileSync (path, { encoding: 'utf8' }))
            ))

            outdata[path] = Object.assign (data, { outpath })

            writeFile (
                outpath,
                '<!-- !!! This file is generate by a script, do not modify it. !!! -->\n' +
                data.html
            )
        }))
    }

    function generateSidebarJs ()
    {
        /** 
         * @typedef {{
         *      url: string,
         *      ids: string[]
         *      matter: Record <string, string>
         * }} PageDescription
         * 
         * @type {Record <string, PageDescription>}
         */
        const menudesc = {}
    
        for (var path of apifiles)
        {
            var page = outdata[path]
            menudesc[page.matter.title] = {
                ids: page.anchors,
            // TODO be able to configure a custom root path.
                url: '/' + Path.relative (ROOT_DIR, page.outpath).replace (/\\/g, '/'),
                matter: page.matter
            }
        }
        
        writeFile (
            Path.join (outdir, 'sidebar.js'),
            '// !!! This file is generate by a script, do not modify it. !!!\n' +
            '// Generated on ' + new Date ().toUTCString () + '\n' +
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
                return undefined // h (node.position, 'h1', [{ type: 'text', value: matter.title }])
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

    
    const htags = [/*"h1",*/ "h2", "h3", "h4", "h5", "h6"]
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
        html: toHtml ({
                type: 'root',
                position: mdast.position,
                // children: zhastToHast (HastToZTree (hast))
                children: ztree.children.map (c => c instanceof ZNode ? zhastToHast (c) : c).flat ()
            })
    }
}
