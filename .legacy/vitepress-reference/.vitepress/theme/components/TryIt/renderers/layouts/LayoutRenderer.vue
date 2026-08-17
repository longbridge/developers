<template>
  <div v-if="layout.visible" :class="layoutClassObject.root">
    <div
      v-for="(element, index) in layout.uischema.elements"
      :key="`${layout.path}-${index}`"
      :class="layoutClassObject.item">
      <dispatch-renderer
        :schema="layout.schema"
        :uischema="element"
        :path="layout.path"
        :enabled="layout.enabled"
        :renderers="layout.renderers"
        :cells="layout.cells" />
    </div>
  </div>
</template>

<script lang="ts">
import { Layout } from '@jsonforms/core'
import { defineComponent } from 'vue'
import { DispatchRenderer, rendererProps, useJsonFormsLayout, RendererProps } from '@jsonforms/vue'
import { useVanillaLayout } from '../util'

const layoutRenderer = defineComponent({
  name: 'LayoutRenderer',
  components: {
    DispatchRenderer,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    return useVanillaLayout(useJsonFormsLayout(props))
  },
  computed: {
    layoutClassObject(): any {
      return this.layout.direction === 'row' ? this.styles.horizontalLayout : this.styles.verticalLayout
    },
  },
})

export default layoutRenderer
</script>
