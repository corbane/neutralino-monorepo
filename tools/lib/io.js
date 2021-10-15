
//@ts-check

import Fs   from 'fs'
import Path from 'path'
import Url  from 'url'
import Yaml from 'yaml'
import Json from '@apidevtools/json-schema-ref-parser'


//------------------------------------------------------------------------------
// File System Utilities
//------------------------------------------------------------------------------


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
        throw new Error (red ('File already exists: ') + filepath)
    }

    if (mkdir) {
        var dir = Path.dirname (filepath)
        if (Fs.existsSync (dir) === false)
            Fs.mkdirSync (dir, { recursive: true })
    }

    console.log (
        '[' + new Date ().toLocaleTimeString() + ']',
        blackOnGreen (' Write: '),
        filepath
    )
    Fs.writeFileSync (filepath, content, { encoding: 'utf8' })
}

//------------------------------------------------------------------------------
// Console Utilities
//------------------------------------------------------------------------------

// https://en.wikipedia.org/wiki/ANSI_escape_code#Colors

function red (message)
{
    return '\x1b[31m' + message + '\x1b[0m'
}
function blackOnGreen (message)
{
    return '\x1b[30m\x1b[42m' + message + '\x1b[0m'
}
