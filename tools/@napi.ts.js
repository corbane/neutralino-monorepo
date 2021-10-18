/*/
    OVERVIEW:
    Compile the js client library

    WORK_IN_PROCESS:

    ARGS:
    * `[flags...]`

    TODO:
    - `neutralino.js.map` is not generated in dev mode.
    - Add a function to move the .js.map files while keeping the references to the sources.
/*/

//@ts-check

import Path from 'path'
import { execSync } from 'child_process'
import { ROOT_DIR, __dirname} from './lib.js'
import { readYamlFile } from './lib/io.js'
import { getArguments, requireArgumentList, isMain } from './lib/cmd.js'
import { NapiDocument, getObjectKeys, ensureParamsAsObject, splitRefPath } from './lib/napi.js'
import { formatType } from './@napi.dts.js'

if (isMain (import.meta))
    main ()
    
export function main ()
{
    const apifiles = requireArgumentList ('--napis')

    return Promise
        .all (apifiles.map (async path => 
        {
            const doc = await new NapiDocument (path, await readYamlFile (path, false))
            const content = formatNapi (doc)
            console.log (content)
        }))
    //compile ()
}

function compile ()
{
    const clientdir = Path.join (ROOT_DIR, 'client')
    const cmd = 'node ' + Path.join (clientdir, 'build.mjs') + ' ' + getArguments ().join (' ')

    console.log (cmd)
    execSync (cmd, {
        env: process.env,
        cwd: clientdir,
        stdio: [process.stdin, process.stdout, process.stderr]
    })
}


//------------------------------------------------------------------------------
// Generators
//------------------------------------------------------------------------------



const templateFunc = (name, paramNames, optionsTypeName) =>
paramNames
? `export function ${name} (${paramNames.join (', ')} ${optionsTypeName ? ', options: ' + optionsTypeName : ''})`
: `export function ${name} (${optionsTypeName ? 'options: ' + optionsTypeName : ''})`
/*template*/



/**
 * @param {NapiDocument} doc 
 */
function formatNapi (doc)
{
    /** @type {string[]} */
    const out = []

    for (var key in doc.roots)
    {
        var item = doc.roots[key]
        
        if (item.type !== 'http:get' && item.type !== 'http:post')
            continue

        if (item.params)
        {
            const pname = splitRefPath (item.params.$ref).jsonpath.substring (2)
            const params = doc.getRef (item.params)
            ensureParamsAsObject (params)
    
            const fnkeys = getObjectKeys (params)

            if (fnkeys.optional) out.push (
                formatOptionsInterface (doc, pname, params, fnkeys.optional)
            )
        }
    }

    return out.join ('\n')
}


/**
 * @param {NapiDocument} doc 
 * @param {TypeObject} sch 
 * @param {string[]} keys 
 */
function formatOptionsInterface (doc, name, sch, keys)
{
    /** @type {string[]} */
    const out = []

    for (var k of keys) {
        out.push (k + ': ' + formatType (doc, sch.properties[k]))
    }

    return 'export interface ' + name + ' {\n'
            + '   ' + out.join (',\n   ') + '\n'
            + '};\n'
}
