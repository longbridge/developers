<template>
  <control-wrapper v-bind="controlWrapper" :styles="styles" :is-focused="isFocused" :applied-options="appliedOptions">
    <input
      :id="control.id + '-input'"
      :class="styles.control.input"
      :value="control.data"
      :disabled="!control.enabled"
      :autofocus="appliedOptions.focus"
      :type="appliedOptions.type || 'text'"
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
import { ControlElement, JsonFormsRendererRegistryEntry, rankWith, isStringControl } from '@jsonforms/core'
import { defineComponent } from 'vue'
import { rendererProps, useJsonFormsControl, RendererProps } from '@jsonforms/vue'
import { default as ControlWrapper } from './ControlWrapper.vue'
import { useVanillaControl } from '../util'

const controlRenderer = defineComponent({
  name: 'StringControlRenderer',
  components: {
    ControlWrapper,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVanillaControl(useJsonFormsControl(props), (target) => target.value || undefined)
  },
})

export default controlRenderer
</script>
