/*/
    OVERVIEW:
    Initialize Node packages

    USAGE:
    * `[packages_manager = --npm]` Can be oneof `--npm`, `--yarn` or `--pnpm`
    * `[flags...]`                 Flags are passed to the package manager and depend on which one you choose.
/*/
//@ts-check

import { execSync } from 'child_process'
import { ROOT_DIR } from './lib.js'
import { hasArgument, CommandLineError, getArguments, isMain } from './lib/cmd.js'


/** @type {import ('child_process').ExecSyncOptionsWithBufferEncoding} */
const options = { cwd: ROOT_DIR, env: process.env, stdio: [process.stdin, process.stdout, process.stderr] }

if (isMain (import.meta)) main ()
export function main ()
{
    const setPm = (name) => {
        if (pm !== null) throw new CommandLineError ('Cannot use multiple package managers')
        pm = name
    }
    
    var pm = null
    if (hasArgument ('--npm')) pm = 'npm'
    if (hasArgument ('--yarn')) setPm ('yarn')
    if (hasArgument ('--pnpm')) setPm ('pnpm')

    const flags = getArguments ()

    if (pm)
        flags.splice (flags.indexOf ('--' + pm), 1)
    else
        pm = 'npm'

	run (`cd client &&  ${pm} install ${flags}`)
	run (`cd site   &&  ${pm} install ${flags}`)
	run (`cd tools  &&  ${pm} install ${flags}`)
}

function run (command)
{
    console.log (command)
    execSync (command, options)
}