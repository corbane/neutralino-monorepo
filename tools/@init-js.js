/*/
    OVERVIEW:
    Initialize Node packages
/*/

//@ts-check

const NPM_CMD = 'pnpm'
const PNPM_FLAG = '--offline'

import { execSync } from 'child_process'
import { ROOT_DIR, isMain } from './lib.js'

/**
    @typedef {import ('child_process').ExecSyncOptionsWithBufferEncoding} ExecSyncOptionsWithBufferEncoding
*/

export function main ()
{
    /** @type {ExecSyncOptionsWithBufferEncoding} */
    const options = { cwd: ROOT_DIR, env: process.env, stdio: [process.stdin, process.stdout, process.stderr] }

	execSync (`cd client &&  ${NPM_CMD} install ${PNPM_FLAG}`, options)
	execSync (`cd site   &&  ${NPM_CMD} install ${PNPM_FLAG}`, options)
	execSync (`cd tools  &&  ${NPM_CMD} install ${PNPM_FLAG}`, options)
    
    // #	if this package is not a root dependency, Docusaurus fails to build
    // ${NPM_CMD} install url-loader
}
