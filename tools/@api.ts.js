/*/
    node build.mjs

    OVERVIEW:
    Compile the js client library

    WORK_IN_PROGRESS:
    - `neutralino.js.map` is not generated in dev mode.
    - Add a function to move the .js.map files while keeping the references to the sources.
/*/

//@ts-check

import Path from 'path'
import { execSync } from 'child_process'
import { ROOT_DIR, __dirname, getArguments } from './lib.js'

export function main ()
{
    compile ()
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

