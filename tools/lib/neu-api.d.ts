
//------------------------------------------------------------------------------
// API simplification
//------------------------------------------------------------------------------

export type Napi = {
  $namespace   : string
  $description : string
} & {
  [key: string]: Item
}

type Item
  = string
  | MethodItem
  | RequestItem
  | EventItem
  | SchemaItem

type ShareItem = {
  description?: string
}

type RequestItem = ShareItem & {
  type: "http:post"|"http:get"
  /**
   * Reference to an item in the file.
   * Should never be an intersection or union of several subtypes, `oneof`, `allof`, `anyof`.
   */
  params?: Ref
  result?: Ref
}

type MethodItem = ShareItem & {
  type: "js:method"
  /**
   * Reference to an item in the file.
   * Should never be an intersection or union of several subtypes, `oneof`, `allof`, `anyof`.
   */
  params?: Ref
  result?: Ref
}

type EventItem = ShareItem & {
  type: "js:event"
  data: Ref
}

type SchemaItem = AnyOf | OneOf | TypeObject


//------------------------------------------------------------------------------
// JSON schema simplification
// https://json-schema.org/understanding-json-schema/reference/
//------------------------------------------------------------------------------

export type Root = Ref & {
    [key: string]: Schema
}

export type Schema = Type | TypeObject | SubSchema

export type SubSchema =  /*  AllOf | */ AnyOf | OneOf
export type AnyOf = { anyOf: Ref[] }
export type OneOf = { oneOf: Ref[] }

export type Type
  = Ref
  | TypeArray
  | TypeNull
  | TypeBoolean
  | TypeNumeric
  | TypeString

/**
 * Reference to an item in the file
 */
export type Ref = {
  $ref: string
}

type Shared = {
  description ?: string
  $comment    ?: string
  deprecated  ?: boolean
}

export type TypeObject = Shared & {
  type        : "object"
  properties  : { [key: string]: Schema }
  required   ?: string[]
}

export type TypeArray = Shared & {
  type         : "array"
  items        : Type
  minItems    ?: number
  maxItems    ?: number
  uniqueItems ?: boolean
} & (
  { default   ?: unknown[],
    enum      ?: unknown[][] } |
  { const     ?: unknown[] } 
)

export type TypeNull = Shared & {
  type: "null"
}

export type TypeBoolean = Shared & {
  type       : "boolean"
} & (
  { default ?: boolean,
    enum    ?: boolean[] } |
  { const   ?: boolean } 
)

export type TypeNumeric = Shared & {
  type        : "integer"|"number"
  multipleOf ?: number
  minimum    ?: number
  maximum    ?: number
} & (
  { default ?: number,
    enum    ?: string[] } |
  { const   ?: string }
)

export type TypeString = Shared & {
  type       : "string"
  minLength ?: number
  maxLength ?: number
  pattern   ?: string
} & (
  { default   ?: string,
    enum      ?: string[] } |
  { const     ?: string }
)

