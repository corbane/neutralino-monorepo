
// 'ts-json-schema-generator' needs an esm file, we are remapping the types in the global scope.

type JSONSchema4 = import ('json-schema').JSONSchema4

type Napi        = import ('./lib/neu-api').Napi
type Schema      = import ('./lib/neu-api').Schema
type RequestItem = import ('./lib/neu-api').RequestItem
type MethodItem  = import ('./lib/neu-api').MethodItem
type SchemaItem  = import ('./lib/neu-api').SchemaItem
type EventItem   = import ('./lib/neu-api').EventItem
type Ref         = import ('./lib/neu-api').Ref
type SubSchema   = import ('./lib/neu-api').SubSchema
type TypeObject  = import ('./lib/neu-api').TypeObject

type AnyItem = MethodItem|EventItem|RequestItem|SchemaItem
