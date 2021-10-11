/*/
    OVERVIEW:
    Generate this `README.md`

    USAGE:

    ```bash
    node makeme readme --cmddir <path> --intro wpath> --outfile <path> [--watch]
    ```

    FOR_NEUTRALINO:

    ```bash
    node makeme readme --cmddir ./tools --intro tools/INTRO.md --outfile ./README.md
    ```
/*/

//@ts-check

import Fs from 'fs'
import Path from 'path'
import chokidar from 'chokidar'
import {
    optionalArgument, requireArgument, hasArgument,
    getScriptsFrom,
    writeFile
} from './lib.js'

/**
    @typedef {import ('./lib').Script} Script
*/


export function main ()
{
    const cmddir  = Path.resolve (requireArgument ('--cmddir'))
    const intro   = optionalArgument ('--intro')
    const outfile = Path.resolve (requireArgument ('--outfile'))
    
    writeReadme (cmddir, intro, outfile)

    if (hasArgument ('--watch') == false)
        return

    const watcher = chokidar.watch (cmddir, { persistent: true, depth: 0 })
    watcher.on ('ready', () =>
    {
        watcher.on ('change', recompute)
        watcher.on ('add', recompute)
    })

    function recompute () {
        try { writeReadme (cmddir, intro, outfile) }
        catch (error) { console.log (error) }
    }
}

/**
    @param {string} cmddir 
    @param {string} intro 
    @param {string} outfile 
*/
function writeReadme (cmddir, intro, outfile)
{
    const scripts = getScriptsFrom (cmddir)
    const arr = scripts.reduce (
        (arr, script) => (arr.push (...command (script), '\n[<sub>top</sub>](#command-overview)\n'), arr),
        [...commandTable (scripts), '']
    )
    
    const head = intro ? Fs.readFileSync (Path.resolve (intro), { encoding: 'utf8' }) : ''
    writeFile (outfile, head + template (arr.join ('\n')))
}

/**
    @param {string} content 
*/
function template (content)
{
return /*md*/`
## Command overview

${content}
`}/*template*/


/** @param {Script[]} scripts */
function commandTable (scripts)
{
    const link = (text) => '[`' + text + '`](#' + text.replace (/[\.]/g, '') + ')'
    return [
        'command | overview',
        '--- | ---',
        ...scripts.map (script =>
        {
            const block = script.sections.find (b => b.title === 'OVERVIEW')
            return link (script.name) + ' | ' +  (block ? block.content : '')
        })
    ]
}

/** @param {Script} script */
function command (script)
{
    const arr = ['## `' + script.name + '`', '']
    
    var block = script.sections.find (b => b.title === 'OVERVIEW')
    if (block) arr.push (block.content, '')

    for (block of script.sections)
    {
        if (block.title!== 'OVERVIEW' &&
            block.title!== '_'
        ) arr.push (
            '**' + block.title + '**\n',
            block.content,
            '',
        )
    }

    return arr
}
