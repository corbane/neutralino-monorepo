
//@ts-check

import Fs   from 'fs'
import Path from 'path'
import Url  from 'url'

import { trimIndents } from './str.js'


export const CMD_PREFIX = '@'
export const CMD_EXT = '.js'
export const CMD_TITLE_REGEX = /^[ \t]*([_A-Z]+):[ \t]*$/gm


/**
 * @param {{ url: string}} meta
 */
export function isMain (meta)
{
    /** @param {string} path */
    const removeExt = (path) => path.endsWith (CMD_EXT) ? path.substring (0, path.length - CMD_EXT.length) : path

    var path = removeExt (Url.fileURLToPath (meta.url))
    var cmdfile = Path.basename (process.argv[1]) === 'makeme' ? process.argv[2] : process.argv[1]
    return removeExt (Path.resolve (cmdfile)) === path
}


//------------------------------------------------------------------------------
// Console Utilities
//------------------------------------------------------------------------------


// https://en.wikipedia.org/wiki/ANSI_escape_code#Colors

function red (message)
{
    return '\x1b[31m' + message + '\x1b[0m'
}


//------------------------------------------------------------------------------
// Argument Utilities
//------------------------------------------------------------------------------


export function getArguments ()
{
    return process.argv[2].startsWith ('-')
         ? process.argv.slice (2)
         : process.argv.slice (3)
}

/**
 * @param {`-${string}`} name
 */
export function hasArgument (name)
{
    return process.argv.indexOf (name) > 0
}

/**
 * @param {`--${string}`} name
 */
export function requireArgument (name)
{
    const i = process.argv.indexOf (name) + 1

    if (i === 0) 
        throw new CommandLineError ('You must define the argument ' + name)
    if (i === process.argv.length)
        throw new CommandLineError ('You must set the value for the argument ' + name)
        
    return process.argv[i]
}

/**
 * @param {`--${string}`} name
 */
export function optionalArgument (name)
{
    const i = process.argv.indexOf (name) + 1
    return i === 0 ? undefined : process.argv[i]
}

/**
 * @param {`--${string}`} name
 */
export function requireArgumentList (name)
{
    const args = process.argv
    const i = args.indexOf (name) + 1

    if (i === 0) 
        throw new CommandLineError ('You must define the argument ' + name)
    if (i === process.argv.length)
        throw new CommandLineError ('You must set the values for the argument ' + name)

    const count = args.length
    for (var end = i; end < count; end++) if (args[end].startsWith ('--')) break

    if (i === end) 
        throw new CommandLineError ('You must set the values for the argument ' + name)

    return args.slice (i, end)
}

export class CommandLineError extends Error
{
    constructor (message) {
        console.error (red (message))
        super (message)
    }
}


//------------------------------------------------------------------------------
// Command script utilities
//------------------------------------------------------------------------------

/**
    @typedef {object} Script
    @property {string} path
    @property {string} name
    @property {Section[]} sections

    @typedef {object} Section
    @property {string} title
    @property {string} content
*/

/**
 * @param {string} dirpath
 */
export function getScriptsFrom (dirpath)
{
    /**
        @type {Script[]}
    */
    const out = []

    var dir = Fs.opendirSync (dirpath)
    for (;;)
    {
        var e = dir.readSync ()
        if (!e) break

        if (e.isFile () &&
            e.name.startsWith (CMD_PREFIX) &&
            e.name.endsWith (CMD_EXT)
        ) {
            out.push ({
                path: Path.join (dirpath, e.name),
                name: e.name.substring (CMD_PREFIX.length, e.name.length - CMD_EXT.length),
                sections: undefined
            })
        }
    }
    dir.close ()

    for (var script of out)
    {
        const content = Fs.readFileSync (script.path, { encoding: 'utf8' })
        script.sections = getScriptHeader (content.split ('\n'))
    }

    return out.sort ((a, b) => a > b ? -1 : a > b ? 1 : 0)
}

/**
 * @param {string} path 
 * @returns {Script}
 */
export function getScript (path)
{
    const content = Fs.readFileSync (path, { encoding: 'utf8' })
    
    var name = Path.basename (path)
    if (name.startsWith (CMD_PREFIX)) name = name.substring (CMD_PREFIX.length)
    if (name.endsWith (CMD_EXT)) name = name.substring (0, name.length - CMD_EXT.length)

    return {
        name,
        path,
        sections: getScriptHeader (content.split ('\n'))
    }
}

/**
 * @param {string[]} lines
 */
export function getScriptHeader (lines)
{
    const count = lines.length
    if (count === 0) return undefined

    /** @type {Section[]} */
    const out = []
    const stack = []

    var l = lines[0].startsWith ('#!') ? 1 : 0
    var title = '_'

    while (l < count) if (lines[l++].startsWith ('/*/')) break
    while (l < count)
    {
        var chars = lines[l++]

        var m = CMD_TITLE_REGEX.exec (chars)
        if (m != null)
        {
            out.push ({
                title: title,
                content: trimIndents (stack).join ('\n').trim ()
            })
            title = m[1].replace (/_/g, ' ')
            stack.length = 0
        }
        else
        {
            stack.push (chars)
        }

        if (lines[l].startsWith ('/*/'))
        {
            out.push ({
                title: title,
                content: trimIndents (stack).join ('\n').trim ()
            })
            break
        }
    }
    
    return out
}
