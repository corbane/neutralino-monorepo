
//@ts-check

import Fs   from 'fs'
import Path from 'path'
import Url  from 'url'
import Yaml from 'yaml'
import Json from '@apidevtools/json-schema-ref-parser'

/**
    @typedef {import ('openapi-types').OpenAPIV3.Document <PathItemObject>} OADocument
    @typedef {import ('openapi-types').OpenAPIV3.PathItemObject} PathItemObject
    @typedef {import ('openapi-types').OpenAPIV3.RequestBodyObject} Request
    @typedef {import ('openapi-types').OpenAPIV3.ResponseObject} Response
    @typedef {import ('openapi-types').OpenAPIV3.SchemaObject} Schema
*/

//@ts-ignore
export const __dirname  = Path.dirname (Url.fileURLToPath (import.meta.url))

export const ROOT_DIR  = Path.join (__dirname, '..')
export const API_DIR   = Path.join (ROOT_DIR, 'spec', 'api')
