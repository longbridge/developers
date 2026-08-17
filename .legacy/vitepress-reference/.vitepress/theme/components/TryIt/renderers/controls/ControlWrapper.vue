<template>
  <div v-if="visible" :id="id" class="control-wrapper flex gap-2 md:gap-6 flex-col md:flex-row">
    <!-- 左侧：字段信息区域 -->
    <div class="field-info flex-1 min-w-0">
      <!-- 字段标题行 -->
      <div class="field-header mb-2">
        <div class="flex items-center gap-2 mb-1">
          <label :for="id + '-input'" class="field-label text-sm font-medium" style="color: var(--vp-c-text-1)">
            {{ label }}
          </label>
          <span v-if="type" class="field-type text-xs font-mono px-1.5 py-0.5" style="color: var(--vp-c-text-2)">
            {{ type }}
          </span>
          <span
            v-if="showAsterisk"
            class="required-badge inline-flex items-center px-2 py-1 text-xs font-semibold px-2 py-0.5 rounded-md font-medium whitespace-nowrap required-style">
            required
          </span>
          <span v-else class="optional-badge text-xs font-medium optional-style"> optional </span>
        </div>
      </div>

      <!-- 描述信息 -->
      <div
        v-if="showDescription && description"
        class="field-description text-sm leading-relaxed mb-2 vp-doc description-style">
        <div v-html="description"></div>
      </div>

      <!-- 错误信息 -->
      <!-- <div v-if="errors" class="field-errors text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded px-3 py-2">
          {{ errors }}
        </div> -->
    </div>

    <!-- 右侧：输入控件区域 -->
    <div class="control-input-wrapper flex-shrink-0 flex-1 max-w-80">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { isDescriptionHidden } from '@jsonforms/core'
import { defineComponent, PropType } from 'vue'
import { Styles } from '../styles'
import { Options } from '../util'

export default defineComponent({
  name: 'ControlWrapper',
  props: {
    id: {
      required: true,
      type: String,
    },
    description: {
      required: false as const,
      type: String,
      default: undefined,
    },
    errors: {
      required: false as const,
      type: String,
      default: undefined,
    },
    label: {
      required: false as const,
      type: String,
      default: undefined,
    },
    type: {
      required: false as const,
      type: String,
      default: undefined,
    },
    appliedOptions: {
      required: false as const,
      type: Object as PropType<Options>,
      default: undefined,
    },
    visible: {
      required: false as const,
      type: Boolean,
      default: true,
    },
    required: {
      required: false as const,
      type: Boolean,
      default: false,
    },
    isFocused: {
      required: false as const,
      type: Boolean,
      default: false,
    },
    styles: {
      required: true,
      type: Object as PropType<Styles>,
    },
  },
  computed: {
    showDescription(): boolean {
      return !isDescriptionHidden(
        this.visible,
        this.description,
        this.isFocused,
        !!this.appliedOptions?.showUnfocusedDescription
      )
    },
    showAsterisk(): boolean {
      return this.required && !this.appliedOptions?.hideRequiredAsterisk
    },
  },
})
</script>

<style scoped>
.required-style {
  color: var(--vp-c-danger-1);
  background-color: var(--vp-c-danger-soft);
}

.optional-style {
  color: var(--vp-c-text-3);
}

.description-style {
  color: var(--vp-c-text-2);
}
</style>
