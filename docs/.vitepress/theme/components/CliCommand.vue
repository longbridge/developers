<template>
  <div class="language-bash vp-adaptive-theme cli-command-block">
    <button class="cli-copy-btn" :class="{ copied }" @click="copyCommand"></button>
    <span class="lang">bash</span>
    <pre class="shiki shiki-themes github-light github-dark vp-code"><code ref="codeRef"><slot /></code></pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const codeRef = ref<HTMLElement | null>(null)
const copied = ref(false)

function copyCommand() {
  const text = (codeRef.value?.innerText ?? '').trim()
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}
</script>

<style scoped>
.cli-command-block {
  margin: 16px 0;
}

.cli-command-block pre {
  margin: 0;
}

/* Normalize markdown-wrapped <p> tags inside the code area */
.cli-command-block pre :deep(p) {
  margin: 0;
  display: block;
}

/* Mirror VitePress .copy button styles */
.cli-copy-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  background-color: var(--vp-code-copy-code-bg);
  opacity: 0;
  cursor: pointer;
  background-image: var(--vp-icon-copy);
  background-position: 50%;
  background-size: 20px;
  background-repeat: no-repeat;
  border: none;
  transition: opacity 0.25s;
}

.cli-command-block:hover .cli-copy-btn,
.cli-copy-btn:focus {
  opacity: 1;
}

.cli-copy-btn.copied {
  background-image: var(--vp-icon-copied);
}
</style>
