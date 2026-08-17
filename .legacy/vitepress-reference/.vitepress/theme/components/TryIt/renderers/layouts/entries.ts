import {
  JsonFormsRendererRegistryEntry,
  rankWith,
  isLayout,
  uiTypeIs,
  and,
  isCategorization,
  categorizationHasCategory,
  optionIs,
} from '@jsonforms/core'
import LayoutRenderer from './LayoutRenderer.vue'
import GroupRenderer from './GroupRenderer.vue'
import CategorizationRenderer from './CategorizationRenderer.vue'
import CategorizationStepperRenderer from './CategorizationStepperRenderer.vue'

export const layoutRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: LayoutRenderer,
  tester: rankWith(1, isLayout),
}

export const groupRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: GroupRenderer,
  tester: rankWith(2, and(isLayout, uiTypeIs('Group'))),
}

export const categorizationEntry: JsonFormsRendererRegistryEntry = {
  renderer: CategorizationRenderer,
  tester: rankWith(2, and(isCategorization, categorizationHasCategory)),
}

export const categorizationStepperEntry: JsonFormsRendererRegistryEntry = {
  renderer: CategorizationStepperRenderer,
  tester: rankWith(3, and(isCategorization, categorizationHasCategory, optionIs('variant', 'stepper'))),
}
