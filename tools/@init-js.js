/*/
    OVERVIEW:
    Initialize Node packages
/*/

//@ts-check

import { execSync } from 'child_process'
import { ROOT_DIR, hasArgument, CommandLineError, getArguments } from './lib.js'


/** @type {import ('child_process').ExecSyncOptionsWithBufferEncoding} */
const options = { cwd: ROOT_DIR, env: process.env, stdio: [process.stdin, process.stdout, process.stderr] }

export function main ()
{
    var pm = null
    if (hasArgument ('--npm')) {
        pm = 'npm'
    }
    if (hasArgument ('--yarn')) {
        if (pm !== null) throw new CommandLineError ('Cannot use multiple package managers')
        pm = 'yarn'
    }
    if (hasArgument ('--pnpm')) {
        if (pm !== null) throw new CommandLineError ('Cannot use multiple package managers')
        pm = 'pnpm'
    }

    const flags = getArguments ()

    if (pm)
        flags.splice (flags.indexOf ('--' + pm), 1)
    else
        pm = 'npm'

	run (`cd client &&  ${pm} install ${flags}`)
	run (`cd site   &&  ${pm} install ${flags}`)
	run (`cd tools  &&  ${pm} install ${flags}`)
    
    // if this package is not a root dependency, Docusaurus fails to build
    // ${pm} install url-loader
}

function run (command)
{
    console.log (command)
    execSync (command, options)
}