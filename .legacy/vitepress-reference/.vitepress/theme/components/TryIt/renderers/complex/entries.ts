import {
  JsonFormsRendererRegistryEntry,
  rankWith,
  isObjectControl,
  isOneOfControl,
  uiTypeIs,
  and,
  schemaMatches,
  hasType,
  schemaSubPathMatches,
  JsonSchema,
} from '@jsonforms/core'
import ObjectRenderer from './ObjectRenderer.vue'
import OneOfRenderer from './OneOfRenderer.vue'
import EnumArrayRenderer from './EnumArrayRenderer.vue'

export const objectRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: ObjectRenderer,
  tester: rankWith(2, isObjectControl),
}

export const oneOfRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: OneOfRenderer,
  tester: rankWith(3, isOneOfControl),
}

const hasOneOfItems = (schema: JsonSchema): boolean =>
  schema.oneOf !== undefined &&
  schema.oneOf.length > 0 &&
  (schema.oneOf as JsonSchema[]).every((entry: JsonSchema) => {
    return entry.const !== undefined
  })

const hasEnumItems = (schema: JsonSchema): boolean => schema.type === 'string' && schema.enum !== undefined

export const enumArrayRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: EnumArrayRenderer,
  tester: rankWith(
    5,
    and(
      uiTypeIs('Control'),
      and(
        schemaMatches(
          (schema) => hasType(schema, 'array') && !Array.isArray(schema.items) && schema.uniqueItems === true
        ),
        schemaSubPathMatches('items', (schema) => {
          return hasOneOfItems(schema) || hasEnumItems(schema)
        })
      )
    )
  ),
}
