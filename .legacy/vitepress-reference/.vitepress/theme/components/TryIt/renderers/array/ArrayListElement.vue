<template>
  <div :class="styles.arrayList.item">
    <div
      :class="[
        styles.arrayList.itemLabel,
        'mt-4.5 rounded-full h-5 w-5 flex items-center justify-center bg-gray-100 dark:bg-white/10 text-xs font-sans font-medium text-gray-900 dark:text-gray-300',
      ]">
      {{ label }}
    </div>
    <div class="w-full">
      <div @click="expandClicked" v-if="!isPrimitiveType">{{ type }}</div>
      <div :class="contentClasses">
        <slot></slot>
      </div>
    </div>
    <div :class="toolbarClasses">
      <template v-if="supportMove">
        <button :disabled="!moveUpEnabled" :class="styles.arrayList.itemMoveUp" type="button" @click="moveUpClicked">
          ↑
        </button>
        <button
          :disabled="!moveDownEnabled"
          :class="styles.arrayList.itemMoveDown"
          type="button"
          @click="moveDownClicked">
          ↓
        </button>
      </template>
      <DeleteButton :enabled="deleteEnabled" :style-class="styles.arrayList.itemDelete" :on-delete="deleteClicked" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { classes, Styles } from '../styles'
import DeleteButton from './DeleteButton.vue'

const listItem = defineComponent({
  name: 'ArrayListElement',
  components: {
    DeleteButton,
  },
  props: {
    type: {
      required: true,
      type: String,
    },
    initiallyExpanded: {
      required: false,
      type: Boolean,
      default: false,
    },
    label: {
      required: false,
      type: String,
      default: '',
    },
    moveUpEnabled: {
      required: false,
      type: Boolean,
      default: true,
    },
    moveDownEnabled: {
      required: false,
      type: Boolean,
      default: true,
    },
    moveUp: {
      required: false,
      type: Function,
      default: undefined,
    },
    moveDown: {
      required: false,
      type: Function,
      default: undefined,
    },
    deleteEnabled: {
      required: false,
      type: Boolean,
      default: true,
    },
    delete: {
      required: false,
      type: Function,
      default: undefined,
    },
    styles: {
      required: true,
      type: Object as PropType<Styles>,
    },
    supportMove: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expanded: this.initiallyExpanded,
    }
  },
  computed: {
    contentClasses(): string {
      return classes`${this.styles.arrayList.itemContent} ${this.expanded && this.styles.arrayList.itemExpanded}`
    },
    toolbarClasses(): string {
      return classes`${this.styles.arrayList.itemToolbar} ${this.expanded && this.styles.arrayList.itemExpanded}`
    },
    isPrimitiveType(): boolean {
      return ['string', 'number', 'boolean'].includes(this.type)
    },
  },
  methods: {
    expandClicked(): void {
      this.expanded = !this.expanded
    },
    moveUpClicked(event: Event): void {
      event.stopPropagation()
      this.moveUp?.()
    },
    moveDownClicked(event: Event): void {
      event.stopPropagation()
      this.moveDown?.()
    },
    deleteClicked(): void {
      this.delete?.()
    },
  },
})

export default listItem
</script>
