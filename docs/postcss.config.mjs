import tailwindcss from '@tailwindcss/postcss'

// Wrap @tailwindcss/postcss so it only processes files that contain
// `@import "tailwindcss"`. This prevents it from interfering with
// UnoCSS's @apply handling in Vue SFC <style> blocks.
const twPlugin = tailwindcss()

function gatedTailwind() {
  const inner = typeof twPlugin === 'function' ? twPlugin() : twPlugin
  return {
    postcssPlugin: 'gated-tailwindcss',
    prepare(result) {
      const css = result.root.toString()
      // Only run Tailwind if the file imports tailwindcss
      if (!css.includes('@import "tailwindcss"') && !css.includes("@import 'tailwindcss'")) {
        return {}
      }
      if (inner.prepare) {
        return inner.prepare(result)
      }
      return inner
    },
  }
}
gatedTailwind.postcss = true

export default {
  plugins: [gatedTailwind],
}
