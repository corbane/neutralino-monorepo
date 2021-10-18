
//@ts-check


import Path from 'path'
import Url  from 'url'

export const __dirname  = Path.dirname (Url.fileURLToPath (import.meta.url))
export const ROOT_DIR  = Path.join (__dirname, '..')

