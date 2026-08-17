<template>
  <control-wrapper v-bind="controlWrapper" :styles="styles" :is-focused="isFocused" :applied-options="appliedOptions">
    <input
      :id="control.id + '-input'"
      type="number"
      :step="step"
      :class="styles.control.input"
      :value="control.data"
      :disabled="!control.enabled"
      :autofocus="appliedOptions.focus"
      :placeholder="
        appliedOptions.placeholder || $t('theme_components_tryit_renderers_controls_stringcontrolrenderer_3')
      "
      @change="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false" />
  </control-wrapper>
</template>

<script lang="ts">
import 'vue-i18n'
import { ControlElement, JsonFormsRendererRegistryEntry, rankWith, isNumberControl } from '@jsonforms/core'
import { defineComponent } from 'vue'
import { rendererProps, useJsonFormsControl, RendererProps } from '@jsonforms/vue'
import { default as ControlWrapper } from './ControlWrapper.vue'
import { useVanillaControl } from '../util'

const controlRenderer = defineComponent({
  name: 'NumberControlRenderer',
  components: {
    ControlWrapper,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVanillaControl(useJsonFormsControl(props), (target) =>
      target.value === '' ? undefined : Number(target.value)
    )
  },
  computed: {
    step(): number {
      const options: any = this.appliedOptions
      return options.step ?? 0.1
    },
  },
})

export default controlRenderer
</script>
