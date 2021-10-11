/*/
    OVERVIEW:
    Bundle API JSON or YAML files into a single JSON file

    DETAILS:

    This command is a pre-process before the other tools.

    OpenApi files are YAML files that support JSON references for easy writing, but some tools do not support this. \
    For this reason it is necessary to flatten the references and make sure that they do not contain cyclic references

    USAGE:

    ```bash
    node makeme api.json --apis <path[]> --outfile <path>
    ```

    - `--apis` Input OpenAPI files in JSON or YAML format.
    - `--outfile` Output JSON file

    FOR_NEUTRALINO:

    ```bash
    node makeme api.json --apis spec/api/*.yaml --outfile out/neutralino.messages.json
    ```
    
    > The `api.ts.def` command and the test application need this file.

    WARNING:

    Wildcard `*` must be resolved by the terminal.
/*/

//@ts-check

import Path from 'path'
import chokidar from 'chokidar'
import {
    ROOT_DIR, __dirname,
    requireArgument, requireArgumentList, hasArgument
} from './lib.js'
import {  readYamlFile, writeFile } from './lib.js'

/**
    @typedef {import ('./lib').OADocument} OADocument
*/

export function main ()
{
    const apifiles = requireArgumentList ('--apis').map (path => Path.resolve (path))
    const outfile   = Path.resolve (requireArgument ('--outfile'))

    console.log ()
    console.log ('## Apis -> Json api')

    writeFlattenApis (apifiles, outfile)

    if (hasArgument ('--watch') === false)
        return
    
    const watcher = chokidar.watch (apifiles, { persistent: true, depth: 0 })
    watcher.on ('ready', () =>
    {
        watcher.on ('change', recompute)
        watcher.on ('add', recompute)
    })
    
    function recompute ()
    {
        try {
            writeFlattenApis (apifiles, outfile)
        } catch (error) {
            console.error (error)
        }
    }
}


/**
 *  Merge a set of APIs. This function deferences the `$ref` contained in the APIs.
 *  @param {string[]} yamlfiles  Absolute paths to input YAML files.
 *  @param {string}   outpath    Absolute path of the output JSON file.
 */
export async function writeFlattenApis (yamlfiles, outpath)
{
    if (yamlfiles == null || yamlfiles.length === 0)
        return

    /** @type {OADocument} */
    const api = await readYamlFile (Path.join (__dirname, 'api.yaml'))

    for (var path of yamlfiles)
    {
        /** @type {OADocument} */
        var nsapi = await readYamlFile (path)

        var duplicates = []
        
        if (nsapi.paths && getDuplicates (api.paths, nsapi.paths, duplicates))
        {
            console.error (`Duplicate keys in ${Path.relative (ROOT_DIR, path)}'#/paths`, duplicates)
            process.exit (1)
        }

        Object.assign (api.paths, nsapi.paths)
    }
    
    writeFile (outpath, JSON.stringify (api, null, 2))

    /** @param {object} A  @param {object} B  @param {string[]} out */
    function getDuplicates (A, B, out)
    {
        const keysA = Object.getOwnPropertyNames (A)
        const keysB = Object.getOwnPropertyNames (B)
        for (var k of keysA) {
            if (keysB.includes (k)) out.push (k)
        }
        return out.length > 0
    }
}
