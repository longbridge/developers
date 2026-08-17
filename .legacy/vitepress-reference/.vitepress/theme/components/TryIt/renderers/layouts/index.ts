import { layoutRendererEntry, groupRendererEntry, categorizationEntry, categorizationStepperEntry } from './entries'

export const layoutRenderers = [
  layoutRendererEntry,
  groupRendererEntry,
  categorizationEntry,
  categorizationStepperEntry,
]

export { default as LayoutRenderer } from './LayoutRenderer.vue'
export { default as GroupRenderer } from './GroupRenderer.vue'
export { default as CategorizationRenderer } from './CategorizationRenderer.vue'
export { default as CategorizationStepperRenderer } from './CategorizationStepperRenderer.vue'
