
//@ts-check

import Path from 'path'
import { execSync } from 'child_process'
import { ROOT_DIR, __dirname} from './lib.js'
import { isMain, hasArgument, CommandLineError } from './lib/cmd.js'

if (isMain (import.meta)) main ()
export function main ()
{
    start ()
}

function start ()
{
    const setPm = (name) => {
        if (pm !== null) throw new CommandLineError ('Cannot use multiple package managers')
        pm = name
    }

    var pm = null
    if (hasArgument ('--npm')) pm = 'npm'
    if (hasArgument ('--yarn')) setPm ('yarn')
    if (hasArgument ('--pnpm')) setPm ('pnpm')
    if (!pm) pm = 'npm'

    const sitedir = Path.join (ROOT_DIR, 'site')
    const cmd = pm + ' start' 
    
    console.log (cmd)
    execSync (cmd, {
        env: process.env,
        cwd: sitedir,
        stdio: [process.stdin, process.stdout, process.stderr]
    })
}

