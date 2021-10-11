/*/
    OVERVIEW:
    Initialize the Neutralino test application

    WORK_IN_PROGRESS:

    USAGE:

    ```bash
    node makeme test.app
    ```
/*/

//@ts-check

import { execSync } from 'child_process'
import { ROOT_DIR } from './lib.js'

/**
 * @type {import ('child_process').ExecSyncOptionsWithBufferEncoding}
 */
const options = { cwd: ROOT_DIR, env: process.env, stdio: [process.stdin, process.stdout, process.stderr] }


export function main ()
{
    // `cp -ru`  Copy directories recursively only when the source file is newer
    run ('cp -ru  server/bin                  .')
    run ('cp -ru  server/bin/resources/icons  ./test')
    run ('cp -ru  server/bin/resources/js     ./test')

    // `rm -r` remove directories and their contents
    run ('rm -r   bin/resources')
}

function run (command)
{
    console.log (command)
    execSync (command, options)
}