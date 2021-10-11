# Neutralino devtools

Various tools to make Neutralino API dependencies consistent.

**NOTE** 

These script can use:
- wildcards `*` in path patterns
- sequential commands with `&&`
- parallel commands with `&`
- shebang `#!`

If like me you don't have a LINUX compatible terminal, a simple way is to use [Git bash](https://git-scm.com/downloads).
## Command overview

command | overview
--- | ---
[`api.json`](#apijson) | Bundle API JSON or YAML files into a single JSON file
[`api.md`](#apimd) | Create Markdown files from API files.
[`api.ts.def`](#apitsdef) | Convert a JSON API file to a Typescript definition file
[`api.ts`](#apits) | Compile the js client library
[`init-git`](#init-git) | Initialize Git submodules
[`init-js`](#init-js) | Initialize Node packages
[`readme`](#readme) | Generate this `README.md`
[`schema.json`](#schemajson) | Convert a JSON/YAML schema to a flattened JSON schema
[`schema.md`](#schemamd) | Convert a JSON/YAML schema to a Markdown file
[`testapp`](#testapp) | Initialize the Neutralino test application

## `api.json`

Bundle API JSON or YAML files into a single JSON file

**DETAILS**

This command is a pre-process before the other tools.

OpenApi files are YAML files that support JSON references for easy writing, but some tools do not support this. \
For this reason it is necessary to flatten the references and make sure that they do not contain cyclic references

**USAGE**

```bash
node makeme api.json --apis <path[]> --outfile <path>
```

- `--apis` Input OpenAPI files in JSON or YAML format.
- `--outfile` Output JSON file

**FOR NEUTRALINO**

```bash
node makeme api.json --apis spec/api/*.yaml --outfile out/neutralino.messages.json
```

> The `api.ts.def` command and the test application need this file.

**WARNING**

Wildcard `*` must be resolved by the terminal.


[<sub>top</sub>](#command-overview)

## `api.md`

Create Markdown files from API files.

**USAGE**

```bash
node makeme api.md --apis <path[]> --outdir <path> [--watch]
```

- `--apis` Input OpenAPI files in JSON or YAML format.

- `--outdir` Output directory.

**FOR NEUTRALINO**

Generate site Markdown files:

```bash
node makeme api.md  --apis spec/api/*.yaml  --outdir site/docs/api
```

**WARNING**

Wildcard `*` must be resolved by the terminal.


[<sub>top</sub>](#command-overview)

## `api.ts.def`

Convert a JSON API file to a Typescript definition file

**USAGE**

```bash
node makeme api.dts  --api <path>  --outfile <path>
```

- `--api` OpenAPI JSON input file
- `--outfile` TypeScript definition output file

**FOR NEUTRALINO**

This command is used to create the `neutralino.messages.d.ts` file to add type checking to the client API's `request` function.

```bash
node makeme api.dts  --api out/neutralino.messages.json  --outfile out/neutralino.messages.d.ts
```

`neutralino.messages.d.ts` must be copied to the same directory as `request.ts`.


[<sub>top</sub>](#command-overview)

## `api.ts`

Compile the js client library

**WORK IN PROGRESS**

- `neutralino.js.map` is not generated in dev mode.
- Add a function to move the .js.map files while keeping the references to the sources.


[<sub>top</sub>](#command-overview)

## `init-git`

Initialize Git submodules

**DESCRIPTION**

Run the `git clone` command to download the Neutralino repositories in the following directories.

- `v2-client-specification` in `spec`
- `neutralinojs` in `server`
- `neutralino.js` in `client`
- `neutralinojs.github.io` in `site`


[<sub>top</sub>](#command-overview)

## `init-js`

Initialize Node packages


[<sub>top</sub>](#command-overview)

## `readme`

Generate this `README.md`

**USAGE**

```bash
node makeme readme --cmddir <path> --intro wpath> --outfile <path> [--watch]
```

**FOR NEUTRALINO**

```bash
node makeme readme --cmddir ./tools --intro tools/INTRO.md --outfile ./README.md
```


[<sub>top</sub>](#command-overview)

## `schema.json`

Convert a JSON/YAML schema to a flattened JSON schema

**USAGE**

> `node makeme schema.json --schemas <path[]>  --outdir <path>`

**FOR NEUTRALINO**

This command is used to create the `neutralino.config.schema.json` file.

> `node tools/cmd-json-schema.js  --schemas spec/models/*.schema.yaml  --outdir out/`

This allows you to have a completion when editing the `neutralino.config.json` file. \
Only if the IDE supports this feature and if `neutralino.config.json` has a `$schema` field like:

```json
{
    "$schema"         : "<DIR>/neutralino.config.schema.json",
    "applicationId"   : "js.neutralino.sample",
    ...
}
```

The actual value of `<DIR>` must be defined, the schema can be, for example:
- served by the site `https://neutralino.js.org/v2/neutralino.config.schema.json`
- or included in the resource directory `./resources/neutralino.config.schema.json`


[<sub>top</sub>](#command-overview)

## `schema.md`

Convert a JSON/YAML schema to a Markdown file

**WORK IN PROGRESS**



**USAGE**

> `node make-md-schemas --schemas <path[]> --outdir <path>`

**FOR NEUTRALINO**

This command is used to create the [neutralino.config.json](https://neutralino.js.org/docs/configuration/neutralino.config.json) markdown page.

> `node make-md-schemas --schemas ./models/neutralino.config.schema.yaml --outdir site/docs/configuration/`

**NOTE**

The output file name is different than the existing.
- currently: `neutralino.config.json.md`
- output: `neutralino.config.schema.md`


[<sub>top</sub>](#command-overview)

## `testapp`

Initialize the Neutralino test application

**WORK IN PROGRESS**



**FOR NEUTRALINO**

```bash
node makeme testapp
```


[<sub>top</sub>](#command-overview)

