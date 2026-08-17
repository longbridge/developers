import { readFileSync, existsSync } from 'node:fs'
import Path, { resolve, join } from 'node:path'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

// 获取文件的 slug
function getFileSlug(filePath: string): string | null {
  const fullPath = resolve(join(dirname(fileURLToPath(import.meta.url)), '..', filePath))

  if (!existsSync(fullPath)) {
    return null
  }

  try {
    const content = readFileSync(fullPath, 'utf-8')
    const { data: frontmatter } = matter(content)

    return frontmatter['slug'] || null
  } catch (error) {
    console.error('Error reading file:', filePath, error)
    return null
  }
}

export const rewriteMarkdownPath = (path: string) => {
  /** hack path route */
  let np = path

  if (/^(en|zh-CN|zh-HK)\/docs\/index\.md/.test(path)) {
    np = path.replace('docs/index.md', 'docs.md')
  }

  //首先尝试读取文件的 slug 字段
  const slug = getFileSlug(path)

  if (slug) {
    // 如果存在 slug，重写为 /{locale}/docs/{slug}.md 的形式
    const localeMatch = path.match(/^(en|zh-CN|zh-HK)\//)
    if (localeMatch) {
      const locale = localeMatch[1]
      /**
       * 如果是 slug / 开头，则是绝对路径，需要直接替换为 /{locale}/docs/{slug}.md 的形式
       * 如果 slug 不是 / 开头，则是相对路径，则是相对原目录，替换文件名，类似 alias 的用法
       */

      if (slug.startsWith('/')) {
        const cleanSlug = slug.startsWith('/') ? slug.substring(1) : slug
        np = `${locale}/docs/${cleanSlug}.md`
      } else {
        const dirname = Path.dirname(path)
        np = `${dirname}/${slug}.md`
      }
    } else {
      // 如果没有匹配到语言，使用默认处理
      np = slug + '.md'
    }
  }

  if (np.includes('en')) {
    np = np.replace('en/', '')
  }

  return np
}
