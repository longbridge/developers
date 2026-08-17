import type MarkdownItAsync from 'markdown-it'
import container from 'markdown-it-container'
interface ContainerOptions {
  marker?: string
  validate?: (params: string) => boolean
  render?: (tokens: any[], idx: number, options: any, env: any, renderer: any) => string
}

export function tipContainerPlugin(md: MarkdownItAsync) {
  const containers = ['tip', 'warning', 'danger', 'info', 'caution', 'success']
  containers.forEach((name) => {
    md.use(container, name, {
      render: (tokens: any[], idx: number) => {
        const token = tokens[idx]
        const info = token.info.trim().slice(name.length).trim()
        if (token.nesting === 1) {
          const title = info || name.charAt(0).toUpperCase() + name.slice(1)
          const escapedTitle = title
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
          return `<TipContainer type="${name}" title="${escapedTitle}">\n`
        } else {
          return '</TipContainer>\n'
        }
      },
    })
  })
}

export function createContainer(md: MarkdownItAsync, name: string, options: ContainerOptions) {
  const min_markers = 3
  const marker_str = options.marker || ':'
  const marker_char = marker_str.charCodeAt(0)
  const marker_len = marker_str.length
  const validate = options.validate || defaultValidate
  const render = options.render || defaultRender

  function defaultValidate(params: string) {
    return params.trim().split(' ', 2)[0] === name
  }

  function defaultRender(tokens: any[], idx: number, _options: any, env: any, renderer: any) {
    // Add your default render logic here if needed
    if (tokens[idx].nesting === 1) {
      tokens[idx].attrJoin('class', name)
    }
    return renderer.renderToken(tokens, idx, _options)
  }

  function ruleBlock(state: any, start: number, end: number, silent: boolean) {
    let pos, nextLine, marker_count, markup, params, token
    let old_parent, old_line_max
    let auto_closed = false
    let startLine = start

    // Check out the first character quickly, which should filter out most of non-containers
    if (marker_char !== state.src.charCodeAt(start)) {
      return false
    }

    // Check out the rest of the marker string
    for (pos = start + 1; pos <= end; pos++) {
      if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
        break
      }
    }

    marker_count = Math.floor((pos - start) / marker_len)

    if (marker_count < min_markers) {
      return false
    }
    pos -= (pos - start) % marker_len

    markup = state.src.slice(start, pos)
    params = state.src.slice(pos, state.eMarks[startLine])

    if (!validate(params)) {
      return false
    }

    // Since start is found, we can report success here in validation mode
    if (silent) {
      return true
    }

    // Search for end of block
    nextLine = startLine

    for (;;) {
      nextLine++
      if (nextLine >= end) {
        // Reached end of input without finding a closing marker, treat as an unclosed block
        break
      }

      pos = state.bMarks[nextLine] + state.tShift[nextLine]
      const max = state.eMarks[nextLine]

      if (pos < max && state.sCount[nextLine] < state.blkIndent) {
        // Non-empty line with negative indent should stop the block
        break
      }

      if (marker_char !== state.src.charCodeAt(pos)) {
        continue
      }

      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        // Closing fence should be indented less than 4 spaces
        continue
      }

      pos = state.skipSpaces(pos)

      // Check out the rest of the marker string
      for (pos = state.bMarks[nextLine] + state.tShift[nextLine]; pos <= max; pos++) {
        if (marker_str[(pos - (state.bMarks[nextLine] + state.tShift[nextLine])) % marker_len] !== state.src[pos]) {
          break
        }
      }

      // Found!
      auto_closed = true
      break
    }

    old_parent = state.parentType
    old_line_max = state.lineMax
    state.parentType = 'container'

    state.lineMax = nextLine

    token = state.push('container_' + name + '_open', 'div', 1)
    token.markup = markup
    token.block = true
    token.info = params
    token.map = [startLine, nextLine]

    state.md.block.tokenize(state, startLine + 1, nextLine)

    token = state.push('container_' + name + '_close', 'div', -1)
    token.markup = state.src.slice(start, pos)
    token.block = true

    state.parentType = old_parent
    state.lineMax = old_line_max
    state.line = nextLine + (auto_closed ? 1 : 0)

    return true
  }

  md?.block?.ruler.before('fence', 'container_' + name, ruleBlock, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  })
  if (md?.renderer) {
    md.renderer.rules['container_' + name + '_open'] = render
    md.renderer.rules['container_' + name + '_close'] = render
  }
}
