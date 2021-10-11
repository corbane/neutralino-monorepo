/*/
    OVERVIEW:
    Convert a JSON/YAML schema to a flattened JSON schema

    USAGE:
    > `node makeme schema.json --schemas <path[]>  --outdir <path>`

    FOR_NEUTRALINO:
    This command is used to create the `neutralino.config.schema.json` file.

    > `node tools/cmd-json-schema.js  --schemas spec/models/*.schema.yaml  --outdir out/`

    This allows you to have a completion when editing the `neutralino.config.json` file. \
    Only if the IDE supports this feature and if `neutralino.config.json` has a `$schema` field like:

    ```json
    {
        "$schema"         : "<DIR>/neutralino.config.schema.json",
        "applicationId"   : "js.neutralino.sample",
        ...
    }
    ```

    The actual value of `<DIR>` must be defined, the schema can be, for example:
    - served by the site `https://neutralino.js.org/v2/neutralino.config.schema.json`
    - or included in the resource directory `./resources/neutralino.config.schema.json`
/*/

//@ts-check

import Fs from 'fs'
import Path from 'path'
import { __dirname, requireArgument, requireArgumentList, changeDestination } from './lib.js'
import {  readYamlFile } from './lib.js'

/**
    @typedef {import ('./lib').OADocument} OADocument
*/


export function main ()
{
    const schfiles = requireArgumentList ('--schemas').map (path => Path.resolve (path))
    const outdir   = Path.resolve (requireArgument ('--outdir'))

    console.log ()
    console.log ('## Schemas -> Json schemas')

    writeJsonSchemas (schfiles, outdir)
}


/**
    @param {string[]} yamlfiles  Absolute paths to input YAML files.
    @param {string}   outdir     Absolute directory to write the output file.
 */
export async function writeJsonSchemas (yamlfiles, outdir)
{
    var outpaths = yamlfiles.map (path => changeDestination ( path, outdir,'.json'))
    for (var i = 0; i < yamlfiles.length; i++)
    {
        writeJsonFile (outpaths[i], Object.assign (
            {
                '$schema': 'http://json-schema.org/draft-07/schema',
                id: 'https://github.com/neutralinojs/v2-client-specification'
            },
            await readYamlFile (yamlfiles[i])
        ))
    }
    return outpaths
}


/**
    Write an object as a JSON string
    @param {string} filepath 
    @param {object} obj 
*/
function writeJsonFile (filepath, obj)
{
    console.log ('Write', filepath)
    Fs.writeFileSync (filepath, JSON.stringify (obj, null, 2), { encoding: 'utf8' })
}
