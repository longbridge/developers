import { JsonFormsRendererRegistryEntry, rankWith, schemaTypeIs } from '@jsonforms/core'
import ArrayListRenderer from './ArrayListRenderer.vue'

export const arrayListRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: ArrayListRenderer,
  tester: rankWith(2, schemaTypeIs('array')),
}
