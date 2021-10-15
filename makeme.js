
//@ts-check

import Fs from 'fs'
import Path from 'path'
import { fileURLToPath }  from 'url'
import { getScriptsFrom, getScript, CMD_PREFIX, CMD_EXT } from './tools/lib/cmd.js'

//@ts-ignore
export const __dirname  = Path.dirname (fileURLToPath (import.meta.url))

const CMD_DIR = './tools/'
const cmdname = process.argv[2]

if (cmdname == null || cmdname === 'help') {
    help ()
} else {
    main (cmdname)
}

/**
 *  @param {string} cmdname
 */
async function main (cmdname)
{
    const cmdpath = CMD_DIR + CMD_PREFIX + cmdname + CMD_EXT

    if (Fs.existsSync (cmdpath) == false)
    {
        console.error ('###')
        console.error ('Command not found: ' + process.argv[2])
        console.error ('###')
        process.exit (1)
    }
    try
    {
        //process.argv[2] = cmdpath
        const cmd = await import (cmdpath)
        cmd.main ()
    }
    catch (error)
    {
        console.log (error)
        console.log ()
        console.log ('For help, type: node makeme help readme')
    }
}

function help ()
{
    if (process.argv [3]) {
        helpof (process.argv[3])
        process.exit ()
    }

    const scripts = getScriptsFrom (Path.resolve (CMD_DIR))

    var max = 0
    const table = []
    for (var script of scripts)
    {
        const block = script.sections.find (b => b.title === 'OVERVIEW')
        table.push ([script.name, block ? block.content : ''])
        if (script.name.length > max) max = script.name.length
    }

    for (var row of table)
    {
        console.log (row[0] + ' '.repeat (max - row[0].length), ' ', row[1])
    }
}

/**
 *  @param {string} cmdname
 */
function helpof (cmdname)
{
    const script = getScript (Path.resolve (CMD_DIR, CMD_PREFIX + cmdname + CMD_EXT))

    for (var section of script.sections)
    {
        if (section.title === '_') continue

        console.log ()
        console.log (section.title)
        console.log (section.content)
    }
    console.log ()
}