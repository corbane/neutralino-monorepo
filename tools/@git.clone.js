/*/
    OVERVIEW:
    Initialize Git submodules

    ARGS:
    * No args

    DETAILS:
    Run the `git clone` command to download the Neutralino repositories in the following directories.

    - `neutralinojs` in `server`
    - `neutralino.js` in `client`
    - `neutralinojs.github.io` in `site`
/*/
//@ts-check

/**
    @command
 
    Initialize Git submodules
    
    @arg {string}  apis    -a <file...>   = api/*.yaml  YAML/JSON Napi files
    @arg {string}  outdir  -d <directory> = out/json/   Output directory where write the generated files
    @arg {boolean} [watch] -w

    @description

    Run the `git clone` command to download the Neutralino repositories in the following directories.

    - `v2-client-specification` in `spec`
    - `neutralinojs` in `server`
    - `neutralino.js` in `client`
    - `neutralinojs.github.io` in `site`
*/
function test (apis, outdir, watch)
{

}

//@ts-check

import Fs from 'fs'
import Path from 'path'
import { execSync } from 'child_process'
import { ROOT_DIR } from './lib.js'
import { isMain } from './lib/cmd.js'


if (isMain (import.meta))
    main ()

export function main ()
{
    const co = 'https://github.com/corbane'
    const ne = 'https://github.com/neutralinojs'

    gitClone (co + '/neutralino.js.git'          , Path.join (ROOT_DIR, 'client'))
    gitClone (ne + '/neutralinojs.git'           , Path.join (ROOT_DIR, 'server'))
    gitClone (ne + '/neutralinojs.github.io.git' , Path.join (ROOT_DIR, 'site'))
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
