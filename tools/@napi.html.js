/*/
    OVERVIEW:
    Generate a HTML file from a Markdown file.
/*/
//@ts-check

// node tools/@napi.md.js --apifiles spec/napi/*.yaml
// https://opis.io/json-schema/2.x/multiple-subschemas.html

import Fs from 'fs'
import Path from 'path'
import Yaml from 'yaml'

import { fromMarkdown } from 'mdast-util-from-markdown'
import { directive } from 'micromark-extension-directive'
import { toHast, all } from 'mdast-util-to-hast'
import { toHtml } from 'hast-util-to-html'
import { frontmatter } from 'micromark-extension-frontmatter'
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter'
import { toString } from 'mdast-util-to-string'

import { ROOT_DIR } from '../tools/lib.js'
import { isMain, requireArgumentList, requireArgument } from './lib/cmd.js'
import { changeDestination, writeFile } from './lib/io.js'


/**
    @typedef {import ('mdast').Root} Root
    @typedef {import ('mdast').Code} Code
    @typedef {import ('mdast').Heading} Heading
    @typedef {import ('mdast').Literal} Literal

    @typedef {import ('hast').Element} Element
    @typedef {import ('hast').Properties} Properties

    @typedef {Record <string, {
        url: string,
        ids: string[]
    }>} MenuDescription
*/


if (isMain (import.meta)) main ()
export async function main ()
{
    const mdfiles = requireArgumentList ('--mdfiles')
    const outdir  = requireArgument ('--outdir')

    /** @type {MenuDescription} */
    const menudesc = {}

    await Promise.all (mdfiles.map (async path => 
    {
        var mdast = fromMarkdown (Fs.readFileSync (path), {
            extensions: [directive (), frontmatter (['yaml'])],
            mdastExtensions: [frontmatterFromMarkdown (['yaml'])]
        })

        /** @type {string[]} */
        const ids = []
        var title = 'Neutralino'

        /** @type {import ('hast').Root} */ // @ts-ignore
        const hast = toHast (mdast, {
            allowDangerousHtml: false,
            handlers: {
                /**
                 * @param {Heading} node 
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
                /**
                 * @param {Literal} node 
                 * @returns 
                 */
                yaml: (h, node) =>
                {
                    const matter = Yaml.parse (node.value)
                    title = matter.title
                    return h (node.position, 'h1', [{ type: 'text', value: title }])
                }
            }
        })
        
        const outfile = changeDestination (path, outdir, '.html')
        menudesc[title] = {
            ids,
            url: '/' + Path.relative (ROOT_DIR, outfile).replace (/\\/g, '/')
        }

        const html = toHtml (hast)
        writeFile (outfile, html)
    }))
    
    writeFile (Path.join (outdir, 'sidebar.js'), 'export default ' + JSON.stringify (menudesc, null, 2))
}

