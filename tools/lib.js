
//@ts-check

import Fs   from 'fs'
import Path from 'path'
import Url  from 'url'
import Yaml from 'yaml'
import Json from '@apidevtools/json-schema-ref-parser'

/**
    @typedef {import ('openapi-types').OpenAPIV3.Document <PathItemObject>} OADocument
    @typedef {import ('openapi-types').OpenAPIV3.PathItemObject} PathItemObject
    @typedef {import ('openapi-types').OpenAPIV3.RequestBodyObject} Request
    @typedef {import ('openapi-types').OpenAPIV3.ResponseObject} Response
    @typedef {import ('openapi-types').OpenAPIV3.SchemaObject} Schema
*/

//@ts-ignore
export const __dirname  = Path.dirname (Url.fileURLToPath (import.meta.url))

export const ROOT_DIR  = Path.join (__dirname, '..')
export const API_DIR   = Path.join (ROOT_DIR, 'spec', 'api')

export const CMD_PREFIX = '@'
export const CMD_EXT = '.js'
export const CMD_TITLE_REGEX = /^[ \t]*([_A-Z]+):[ \t]*$/gm


/**
 * @param {string} name
 */
export function isMain (name)
{
    var basename = Path.basename (process.argv[1])
    return basename === CMD_PREFIX + name + CMD_EXT || basename === CMD_PREFIX + name
}


// #region Command line utilities

// https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
const FBG_RESET = '\x1b[0m'
const FG_RED    = '\x1b[31m'
const FG_GREEN  = '\x1b[32m'
const FG_BLUE   = '\x1b[34m'
const BG_GREEN  = '\x1b[42m'


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

function red (message)
{
    return FG_RED + message + FBG_RESET
}

function blue (message)
{
    return FG_BLUE + message + FBG_RESET
}

class CommandLineError extends Error
{
    constructor (message) { super (FG_RED + message + FBG_RESET) }
}

// #endregion


// #region File System Utilities

/**
 * @param {string} path 
 * @param {string} targetdir 
 * @param {`.${string}`} ext
 */
export function changeDestination (path, targetdir, ext)
{
    var i = path.lastIndexOf ('.')
    
    return Path.join (
        targetdir,
        Path.basename (path.substring (0, i) + ext)
    )
}

/**
 * @param {string} filepath 
 * @param {boolean} [flatten]
 *     If set to `true`, `$ref` fields are replaced by the content of its reference.
 *     This is necessary because some tools do not support external references.
 * @returns {Promise <object>}
 */
export function readYamlFile (filepath, flatten = true)
{
    if (flatten)
    {
        return new Promise ((resolve, reject) =>
        {
            return Json.dereference (
                filepath,
                { dereference: { circular: false } },
                (err, sch) => { if (err) reject (err) ; resolve (sch) }
            )
        })
        
    }
    else
    {
        return Promise.resolve (Yaml.parse (Fs.readFileSync (filepath, 'utf8')))
    }
}

/**
 * 
 * @param {string} filepath 
 * @param {string} content 
 */
export function writeFile (filepath, content, overrides = true, mkdir = true)
{
    if (!overrides && Fs.existsSync (filepath) === false) {
        throw new Error (red ('File already exists: ') + FBG_RESET + filepath)
    }

    if (mkdir) {
        var dir = Path.dirname (filepath)
        if (Fs.existsSync (dir) === false)
            Fs.mkdirSync (dir, { recursive: true })
    }

    console.log ('[' + new Date ().toLocaleTimeString() + ']', BG_GREEN, 'Write:', FBG_RESET, filepath)
    Fs.writeFileSync (filepath, content, { encoding: 'utf8' })
}

// #endregion


// #region Command script utilities

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

// #endregion


// #region String utilities

/**
 * @param {string[]} lines 
 * @param {number} tabSize
 */
export function trimIndents (lines, tabSize = 2)
{
    /** @param {string} chars */
    const indentLength = (chars) =>
    {
        var n = 0
        for (var c = 0; c < chars.length; c++)
        {
            switch (chars.charCodeAt (c))
            {
            case 9: /*\t*/
                n += tabSize
                break
            case 32: /*' '*/
                n++
                break
            default:
                return n
            }
        }
    }

    /** @param {string} chars @param {number} indent */
    const unindent = (chars, indent) =>
    {
        var n = 0
        for (var c = 0; c < chars.length; c++)
        {
            switch (chars.charCodeAt (c))
            {
            case 9: /*\t*/
                n += tabSize
                break
            case 32: /*' '*/
                n++
                break
            default:
                return chars.substring (n)
            }

            if (n === indent)
                return chars.substring (n)
        }
        return chars
    }

    const count = lines.length
    var indent = 0

    // get the indent of the first non-empty line
    for (var l = 0; l < count; l++)
    {
        var chars = lines[l].trimStart ()
        if (chars == '') continue

        indent = indentLength (lines[l])
        break
    }

    for (var l = 0; l < count; l++)
    {
        lines[l] = unindent (lines[l], indent)
        // if (geIndentLength (lines[l]) >= indent)
        //     lines[l] = lines[l].substring (indent)
    }

    return lines
}


/** 
 * @param {string} chars
 */
export function removeDuplicateEmptyLine (chars)
{
    const lines = chars.split ('\n')
    const count = lines.length

    /** @type {string[]} */
    const out = new Array (count)
    var end = 0

    var prev = false
    for (var l = 0; l < count; l++)
    {
        var chars = lines[l]
        if (chars.trim () == '')
        {
            if (!prev) {
                prev = true
                out[end++] = chars
                
            }
        }
        else
        {
            prev = false
            out[end++] = chars
        }
    }

    out.length = end
    return out.join ('\n')
}

// #endregion
