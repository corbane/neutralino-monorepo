/*/
    OVERVIEW:
    Generate a JSON Schema File from a NAPI File.

    ARGS:
    - `--napis  <file...>` Input NAPIs in JSON or YAML format.
    - `--outdir <path>`    Output directory.
    - `--watch`

    DETAILS:
    This command is used to create the `neutralino.config.schema.json` file.

    This allows you to have a completion when editing the `neutralino.config.json` file.
    Only if the IDE supports this feature and if `neutralino.config.json` has a `$schema` field like:

    ```json
    {
        "$schema"         : "<DIR>/neutralino.config.schema.json",
        "applicationId"   : "js.neutralino.sample",
        ...
    }
    ```

    The actual value of `<DIR>` must be defined, the schema can be, for example:
    - served by the site like `https://neutralino.js.org/v2/neutralino.config.schema.json`
    - or included in the resource directory `./resources/neutralino.config.schema.json`
/*/

/// <reference path="./types.d.ts" />
//@ts-check

import Path from 'path'
import chokidar from 'chokidar'
import { NapiDocument, splitRefPath } from './lib/napi.js'
import { readYamlFile, changeDestination, writeFile } from './lib/io.js'
import { visitObject } from './lib/obj.js'
import { isMain, hasArgument, requireArgumentList, requireArgument } from '../tools/lib/cmd.js'


if (isMain (import.meta))
    main ()

export async function main ()
{
    const apifiles = requireArgumentList ('--napis').map (path => Path.resolve (path))
    const outdir   = requireArgument ('--outdir')

    const apidocs = await Promise.all (
        apifiles.map (async path => new NapiDocument (path, await readYamlFile (path, false))
    ))

    generate ()

    if (hasArgument ('--watch') === false)
        return

    const watcher = chokidar.watch (apifiles, { persistent: true, depth: 0 })
    watcher.on ('ready', () =>
    {
        watcher.on ('change', generate)
        watcher.on ('add', generate)
    })
    
    function generate ()
    {
        return Promise.all (apidocs.map (async doc =>
        {
            const outpath = changeDestination (doc.path, outdir, '.json')
            writeFile (outpath, JSON.stringify (await napiToJsonSchema (doc), null, ' '.repeat (3)))
            return outpath
        }))
    }
}


//------------------------------------------------------------------------------
// Generator
//------------------------------------------------------------------------------


/**
 * @param {NapiDocument} doc 
 * @param {string} [title] 
 */
async function napiToJsonSchema (doc, title)
{
    /** @type {Record <string, JSONSchema4>} */
    const definitions = {}
    for (var key in doc.schemas)
    {
        /** @type {import ('json-schema').JSONSchema4} */
        var sch = doc.schemas[key]
        sch.title = key
        definitions[key] = sch
    }

    /** @type {JSONSchema4} */
    const out = {
        $schema: 'http://json-schema.org/draft-04/schema#',
        definitions
    }

    if (title) 
        out.title = title

    if ('$ref' in doc.fields)
        out.$ref = doc.fields.$ref

    return await visitObject (
        out,
        /** @param {JSONSchema4} obj */
        (obj) => '$ref' in obj,
        /** @param {JSONSchema4} obj */
        (obj) =>
        {
            var ref = obj.$ref
            if (typeof ref !== 'string') return

            if (ref.startsWith ('#/')) {
                obj.$ref = '#/definitions/' + ref.substring (2)
                return
            }

            var parts = splitRefPath (ref)
            if (parts.fspath.endsWith ('.yaml'))
                obj.$ref = parts.fspath.substring (0, parts.fspath.length - 4) + 'json'
        }
    )
}
