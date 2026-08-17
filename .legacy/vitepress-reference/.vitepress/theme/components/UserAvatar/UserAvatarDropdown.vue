<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

interface DropdownItem {
  title: string
  href?: string
  icon?: string
  onClick?: () => void
  separator?: boolean
}

interface Props {
  list: DropdownItem[]
  align?: 'start' | 'end'
  side?: 'top' | 'bottom'
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  align: 'end',
  side: 'bottom',
  open: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const dropdownRef = ref<HTMLElement>()

const alignmentClasses = computed(() => {
  let classes = 'dropdown-menu'

  if (props.side === 'top') {
    classes += ' dropdown-menu-top'
  } else {
    classes += ' dropdown-menu-bottom'
  }

  if (props.align === 'start') {
    classes += ' dropdown-menu-start'
  } else {
    classes += ' dropdown-menu-end'
  }

  return classes
})

const handleItemClick = (item: DropdownItem) => {
  if (item.onClick) {
    item.onClick()
  } else if (item.href) {
    window.location.href = item.href
  }
  emit('update:open', false)
}

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    emit('update:open', false)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('update:open', false)
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div ref="dropdownRef" class="dropdown-container">
    <Transition
      enter-active-class="dropdown-enter-active"
      enter-from-class="dropdown-enter-from"
      enter-to-class="dropdown-enter-to"
      leave-active-class="dropdown-leave-active"
      leave-from-class="dropdown-leave-from"
      leave-to-class="dropdown-leave-to">
      <div :class="alignmentClasses" role="menu" aria-orientation="vertical">
        <template v-for="(item, index) in props.list" :key="index">
          <hr v-if="item.separator" class="dropdown-separator" />
          <button v-else type="button" class="dropdown-item" role="menuitem" @click="handleItemClick(item)">
            <div v-if="item.icon" :class="item.icon" class="dropdown-item-icon" />
            <span class="dropdown-item-text">{{ item.title }}</span>
          </button>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-container {
  position: relative;
  display: block;
  padding-top: 8px;
}

.dropdown-menu {
  z-index: 50;
  border-radius: 12px;
  padding: 12px;
  min-width: 128px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
  transition: background-color 0.5s;
  max-height: calc(100vh - var(--vp-nav-height));
  overflow-y: auto;
}

.dropdown-menu-top {
  bottom: 100%;
  margin-bottom: 8px;
}

.dropdown-menu-bottom {
  top: 100%;
}

.dropdown-menu-start {
  left: 0;
}

.dropdown-menu-end {
  right: 0;
}

.dropdown-separator {
  margin: 8px -12px;
  height: 1px;
  border: none;
  background-color: var(--vp-c-divider);
}

.dropdown-item {
  position: relative;
  display: flex;
  width: 100%;
  cursor: pointer;
  user-select: none;
  align-items: center;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.4;
  color: var(--vp-c-text-1);
  background: transparent;
  border: none;
  outline: none;
  transition: all 0.25s;
  white-space: nowrap;
}

.dropdown-item:hover,
.dropdown-item:focus {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-soft);
}

.dropdown-item:disabled {
  pointer-events: none;
  opacity: 0.5;
}

.dropdown-item-icon {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.dropdown-item-text {
  flex-grow: 1;
}

/* 过渡动画 */
.dropdown-enter-active {
  transition: all 0.1s ease-out;
}

.dropdown-enter-from {
  transform: scale(0.95);
  opacity: 0;
}

.dropdown-enter-to {
  transform: scale(1);
  opacity: 1;
}

.dropdown-leave-active {
  transition: all 0.075s ease-in;
}

.dropdown-leave-from {
  transform: scale(1);
  opacity: 1;
}

.dropdown-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>
