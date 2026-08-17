export { default as ObjectRenderer } from './ObjectRenderer.vue'
export { default as OneOfRenderer } from './OneOfRenderer.vue'
export { default as EnumArrayRenderer } from './EnumArrayRenderer.vue'

import { objectRendererEntry, oneOfRendererEntry, enumArrayRendererEntry } from './entries'

export const complexRenderers = [objectRendererEntry, oneOfRendererEntry, enumArrayRendererEntry]
