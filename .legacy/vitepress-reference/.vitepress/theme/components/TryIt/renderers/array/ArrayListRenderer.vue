<template>
  <fieldset v-if="control.visible" :class="styles.arrayList.root">
    <legend :class="styles.arrayList.legend">
      <label :class="['text-sm font-medium text-gray-900 dark:text-gray-100']">
        {{ control.label }}
      </label>
      <span
        v-if="control.required"
        class="required-badge inline-flex items-center px-2 py-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-red-100/50 dark:bg-red-400/10 text-red-600 dark:text-red-300 font-medium whitespace-nowrap">
        required
      </span>
      <span v-if="type" class="field-type text-xs text-gray-500 dark:text-gray-400 font-mono px-1.5 py-0.5">
        {{ `${control.schema.type}[]` }}
      </span>
    </legend>
    <div class="field-description text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2 vp-doc">
      <div v-html="control.description"></div>
    </div>
    <div
      v-for="(element, index) in control.data"
      :key="`${control.path}-${index}`"
      :class="styles.arrayList.itemWrapper">
      <array-list-element
        initiallyExpanded
        :type="control.schema.type"
        :move-up="moveUp?.(control.path, index)"
        :move-up-enabled="control.enabled && index > 0"
        :move-down="moveDown?.(control.path, index)"
        :move-down-enabled="control.enabled && index < control.data.length - 1"
        :delete-enabled="control.enabled && !minItemsReached"
        :delete="removeItems?.(control.path, [index])"
        :label="childLabelForIndex(index)"
        :styles="styles">
        <dispatch-renderer
          :schema="control.schema"
          :uischema="childUiSchema"
          :path="composePaths(control.path, `${index}`)"
          :enabled="control.enabled"
          :renderers="control.renderers"
          :cells="control.cells" />
      </array-list-element>
    </div>
    <!-- <div v-if="noData" :class="styles.arrayList.noData">
      {{ translations.noDataMessage }}
    </div> -->

    <button
      type="button"
      :disabled="!control.enabled || (appliedOptions.restrict && maxItemsReached)"
      @click="addButtonClick"
      :class="[
        'flex text-sm  w-fit items-center py-1 px-2 hover:bg-gray-50 dark:hover:bg-white/[0.03] border border-gray-200/70 dark:border-white/10 rounded-lg border-solid text-sm py-1 px-2 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5 focus:border-gray-300 dark:focus:border-gray-500 focus:ring-gray-300 dark:focus:ring-gray-500 transition-all duration-200',
        styles.arrayList.addButton,
      ]">
      <span class="text-gray-600 dark:text-gray-200 inline-flex items-center gap-x-1.5">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 1V11M1 6H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <span class="">Add an item</span>
      </span>
    </button>
  </fieldset>
</template>

<script lang="ts">
import {
  composePaths,
  createDefaultValue,
  JsonFormsRendererRegistryEntry,
  rankWith,
  ControlElement,
  schemaTypeIs,
  Resolve,
  JsonSchema,
  JsonFormsSubStates,
  arrayDefaultTranslations,
  getArrayTranslations,
  defaultJsonFormsI18nState,
} from '@jsonforms/core'
import { defineComponent, inject } from 'vue'
import { DispatchRenderer, rendererProps, useJsonFormsArrayControl, RendererProps } from '@jsonforms/vue'
import { useVanillaArrayControl } from '../util'
import ArrayListElement from './ArrayListElement.vue'

const controlRenderer = defineComponent({
  name: 'ArrayListRenderer',
  components: {
    ArrayListElement,
    DispatchRenderer,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVanillaArrayControl(useJsonFormsArrayControl(props))
  },
  computed: {
    noData(): boolean {
      return !this.control.data || this.control.data.length === 0
    },
    arraySchema(): JsonSchema | undefined {
      return Resolve.schema(this.schema, this.control.uischema.scope, this.control.rootSchema)
    },
    maxItemsReached(): boolean | undefined {
      return (
        this.arraySchema !== undefined &&
        this.arraySchema.maxItems !== undefined &&
        this.control.data !== undefined &&
        this.control.data.length >= this.arraySchema.maxItems
      )
    },
    minItemsReached(): boolean | undefined {
      return (
        this.arraySchema !== undefined &&
        this.arraySchema.minItems !== undefined &&
        this.control.data !== undefined &&
        this.control.data.length <= this.arraySchema.minItems
      )
    },
    translations(): any {
      const jsonforms = inject<JsonFormsSubStates>('jsonforms')
      return getArrayTranslations(
        jsonforms?.i18n?.translate ?? defaultJsonFormsI18nState.translate,
        arrayDefaultTranslations,
        this.control.i18nKeyPrefix,
        this.control.label
      )
    },
  },
  methods: {
    composePaths,
    createDefaultValue,
    addButtonClick() {
      this.addItem(this.control.path, createDefaultValue(this.control.schema, this.control.rootSchema))()
    },
  },
})

export default controlRenderer
</script>
