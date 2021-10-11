/*/
    OVERVIEW:
    Create Markdown files from API files.

    USAGE:

    ```bash
    node makeme api.md --apis <path[]> --outdir <path> [--watch]
    ```

    - `--apis` Input OpenAPI files in JSON or YAML format.

    - `--outdir` Output directory.

    FOR_NEUTRALINO:

    Generate site Markdown files:
    
    ```bash
    node makeme api.md  --apis spec/api/*.yaml  --outdir site/docs/api
    ```
    
    WARNING:

    Wildcard `*` must be resolved by the terminal.
/*/

//@ts-check

import Path from 'path'
import chokidar from 'chokidar'
import { toMd as schemaToMd } from './@schema.md.js'
import {
    __dirname,
    hasArgument, requireArgument, requireArgumentList,
    changeDestination, readYamlFile, writeFile
} from './lib.js'


export function main ()
{
    const apifiles = requireArgumentList ('--apis').map (path => Path.resolve (path))
    const outdir   = Path.resolve (requireArgument ('--outdir'))

    console.log ()
    console.log ('## Apis -> Markdowns')

    build (apifiles, outdir)

    if (hasArgument ('--watch') === false)
        return
    
    const watcher = chokidar.watch (apifiles, { persistent: true, depth: 0 })
    watcher.on ('ready', () =>
    {
        watcher.on ('change', recompute)
        watcher.on ('add', recompute)
    })
    
    function recompute (path)
    {
        try {
            build ([path], outdir)
        } catch (error) {
            console.error (error)
        }
    }
}

/**
    @param {string[]} apifiles
    @param {string} outdir
*/
function build (apifiles, outdir)
{
    return Promise.all (apifiles.map (async path =>
    {
        const doc = await readYamlFile (path)
        const content = formatDoc (doc)
        const outfile = changeDestination (path, outdir, '.md')
        
        writeFile (outfile, content)
    }))
} 


/**
    @param {import ('./lib').OADocument} doc
*/
const formatDoc = (doc) => `---
title: ${doc.info.title}
---

${doc.info.description}

${Object.values (doc.paths).map (p => p.get || p.post).map ((op) => `
## ${op.summary}

${op.description}

${(() =>
{
    /** @type {any} */
    var request = op.requestBody
    if (request == null || request.content == null) return ''

    request = request.content['application/json']
    if (request == null) return ''

    return '### Parameters\n\n' + schemaToMd (request.schema, 3)
}) ()}

${(() =>
{
    /** @type {any} */
    var response = (op.responses ? op.responses[200] : null)
    if (response == null || response.content == null) return ''

    response = response.content['application/json']
    if (response == null) return ''

    return '### Return\n\n' + schemaToMd (response.schema, 3)
}) ()}

`).join ('')}`;/*formatDoc*/
