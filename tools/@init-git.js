/*/
    OVERVIEW:
    Initialize Git submodules

    DESCRIPTION:
    Run the `git clone` command to download the Neutralino repositories in the following directories.

    - `v2-client-specification` in `spec`
    - `neutralinojs` in `server`
    - `neutralino.js` in `client`
    - `neutralinojs.github.io` in `site`
/*/

//@ts-check

import Fs from 'fs'
import Path from 'path'
import { execSync } from 'child_process'
import { ROOT_DIR } from './lib.js'


export function main ()
{
    gitClone ('https://github.com/corbane/v2-client-specification.git' , Path.join (ROOT_DIR, 'spec'))
    gitClone ('https://github.com/corbane/neutralino.js.git'           , Path.join (ROOT_DIR, 'client'))
    gitClone ('https://github.com/corbane/neutralinojs.git'            , Path.join (ROOT_DIR, 'server'))
    gitClone ('https://github.com/corbane/neutralinojs.github.io.git'  , Path.join (ROOT_DIR, 'site'))
}


/**
    @param {string} repo - Url of the repository
    @param {string} dir  - Absolute path to the target directory
*/
function gitClone (repo, dir)
{
    if (Fs.existsSync (dir)) {
        console.error ('### Destination path "' + dir + '" already exists')
        return
    }

    execSync ('git clone ' + repo + ' ' + dir, {
        env: process.env,
        stdio: [process.stdin, process.stdout, process.stderr]
    })
}
