/*/
    OVERVIEW:
    Convert a JSON API file to a Typescript definition file

    USAGE:

    ```bash
    node makeme api.dts  --api <path>  --outfile <path>
    ```

    - `--api` OpenAPI JSON input file
    - `--outfile` TypeScript definition output file

    FOR_NEUTRALINO:

    This command is used to create the `neutralino.messages.d.ts` file to add type checking to the client API's `request` function.
    
    ```bash
    node makeme api.dts  --api out/neutralino.messages.json  --outfile out/neutralino.messages.d.ts
    ```

    `neutralino.messages.d.ts` must be copied to the same directory as `request.ts`.
/*/

//@ts-check

import Path from 'path'
import { execSync } from 'child_process'
import { __dirname, requireArgument, writeFile } from './lib.js'


export function main ()
{
    const apifile = Path.resolve (requireArgument ('--api'))
    const outfile = Path.resolve (requireArgument ('--outfile'))

    console.log ()
    console.log ('## Typescript definition files')

    writeDts (apifile, outfile)
}


function template (content)
{ 
return `
// This file is automatically generated from the Neutralino v2 specification.

type Paths
    = keyof paths extends \`/__nativeMethod_\${infer P}\` ? P
    : never

type NativePath <P extends Paths> = \`/__nativeMethod_\${P}\`

type GetRequestMethods <P extends Paths>
    = keyof paths[NativePath <P>]

type GetOptions <P extends Paths, T extends GetRequestMethods <P>>
    = paths[NativePath <P>][T] extends {
        requestBody: {
            content: { ["application/json"]: any }
        }
    }
    ? paths[NativePath <P>][T]["requestBody"]["content"]["application/json"]
    : never

type GetResponse <P extends Paths, T extends GetRequestMethods <P>>
    = paths[NativePath <P>][T] extends {
        responses: {
            '200': { content: { ["application/json"]: any } }
        }
    }
    ? paths[NativePath <P>][T]["responses"]['200']["content"]["application/json"]
    : never

${content}`
}/*template*/


/**
    @param {string} apifile  Absolute path of JSON API.
    @param {string} outfile   Absolute path of the output file.
*/
export async function writeDts (apifile, outfile)
{
    try
    {
        // openapi-typescript cannot be imported as an ES module `import ots from 'openapi-typescript'`
        // So A sub-process is used.
        const out = execSync ('npx openapi-typescript ' + apifile, { encoding: 'utf8', cwd: __dirname })

        writeFile (outfile, template (out))
    }
    catch (err)
    {
        console.error (err)
        process.exit (1)
    }
}

