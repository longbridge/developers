import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getRegionConfig } from '../docs/.vitepress/region-utils'

// Simple capitalize function to replace lodash
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// List of file paths to ignore
const ignoredFiles: string[] = ['changelog.md']

interface MarkdownInfo {
  title: string
  slug: string
  description: string
}

interface DirectoryStructure {
  sections: Record<string, DirectoryStructure>
  links: MarkdownInfo[]
}

interface FrontMatter {
  title?: string
  slug?: string
  [key: string]: any
}

/**
 * Extract title, slug and description from Markdown file
 * @param filePath - Markdown file path
 * @param rootDir - Root directory path
 * @returns Object containing title, slug and description
 */
function extractMarkdownInfo(filePath: string, rootDir: string): MarkdownInfo {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent) as { data: FrontMatter; content: string }

    // Extract title
    const title = data.title || path.basename(filePath, path.extname(filePath))
    // Extract slug and ensure correct format (starts with / and ends with .md)
    // Extract description
    let description = ''
    // Try to find content after the first heading as description
    const headingMatch = content.match(/^#\s+(.+)$/m)
    if (headingMatch && headingMatch[0]) {
      const headingIndex = content.indexOf(headingMatch[0])
      const afterHeading = content.substring(headingIndex + headingMatch[0].length).trim()
      const nextParagraph = afterHeading.split('\n\n')[0]?.trim() || ''
      description = nextParagraph
    } else {
      // If no heading found, use the first few sentences of content
      description = content.split('\n\n')[0]?.trim() || ''
    }

    // If description is too long, truncate it
    if (description.length > 200) {
      description = description.substring(0, 147) + '...'
    }

    const slug = `/${path.relative(rootDir, filePath)}`

    return { title, slug, description }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error)
    return { title: path.basename(filePath), slug: path.relative(rootDir, filePath), description: '' }
  }
}

function shouldIgnoreFile(filePath: string): boolean {
  return (
    ignoredFiles.some((ignoredFile) => filePath.endsWith(ignoredFile)) ||
    filePath === 'index.md' ||
    filePath === 'sdk.md' ||
    filePath.startsWith('zh-CN') ||
    filePath.startsWith('zh-HK')
  )
}

/**
 * Recursively traverse directory and generate Markdown link list
 * @param dir - Directory to traverse
 * @param rootDir - Root directory path
 * @returns Object containing directory structure and links
 */
function traverseDirectory(dir: string, rootDir: string): DirectoryStructure {
  const result: DirectoryStructure = {
    sections: {},
    links: [],
  }

  const files = fs.readdirSync(dir)

  for (const file of files) {
    const fullPath = path.join(dir, file)
    const relativePath = path.relative(rootDir, fullPath)
    const stat = fs.statSync(fullPath)

    if (shouldIgnoreFile(relativePath)) {
      // Skip ignored files
      continue
    }

    if (stat.isDirectory()) {
      // Process subdirectory
      const dirName = capitalize(path.basename(fullPath))

      result.sections[dirName] = traverseDirectory(fullPath, rootDir)
    } else if (stat.isFile() && path.extname(file) === '.md') {
      // Process Markdown file
      const { title, slug, description } = extractMarkdownInfo(fullPath, rootDir)
      result.links.push({ title, slug, description })
    }
  }

  return result
}

/**
 * Generate Markdown link list
 * @param structure - Directory structure and links
 * @returns Formatted Markdown link list
 */
const llmsSiteHost = getRegionConfig()?.siteHostname || 'https://open.longbridge.com'

function generateMarkdownList(structure: DirectoryStructure): string {
  let output = ''

  // Add links for current directory
  for (const link of structure.links) {
    output += `- [${link.title}](${llmsSiteHost}${link.slug})\n`
  }

  // Add links for subdirectories
  for (const [section, content] of Object.entries(structure.sections)) {
    if (content.links.length === 0) {
      continue
    }

    output += `\n## ${section}\n\n`
    output += generateMarkdownList(content)
  }

  return output
}

/**
 * Generate full content file with all markdown files
 */
function generateLLMSFullTxt(): void {
  const rootDir = path.join(process.cwd(), 'docs/.vitepress/dist')

  try {
    if (!fs.existsSync(rootDir)) {
      console.error(`Directory does not exist: ${rootDir}`)
      return
    }

    let fullContent = '# Longbridge Developers Documentation'

    // Function to recursively process all markdown files
    function processDirectory(dir: string, indent = ''): void {
      const files = fs.readdirSync(dir)
      const relativePath = path.relative(rootDir, dir)

      // Process files first, then directories for better organization
      // First pass: process markdown files
      for (const file of files) {
        const fullPath = path.join(dir, file)
        const stat = fs.statSync(fullPath)

        if (shouldIgnoreFile(relativePath)) {
          // Skip ignored files
          continue
        }

        if (stat.isFile() && path.extname(file) === '.md') {
          const fileContent = fs.readFileSync(fullPath, 'utf8')
          const { data, content } = matter(fileContent) as { data: FrontMatter; content: string }

          // Add file title as heading
          const fileName = path.basename(file, '.md')
          const title = data.title || capitalize(fileName)

          fullContent += `\n\n${indent}# ${title}\n\n`
          fullContent += content.trim()
        }
      }

      // Second pass: process directories
      for (const file of files) {
        const fullPath = path.join(dir, file)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
          const dirName = capitalize(path.basename(fullPath))
          fullContent += `\n\n${indent}## ${dirName}\n`
          processDirectory(fullPath, indent + '#')
        }
      }
    }

    // Start processing from the en directory
    processDirectory(rootDir)

    // Write to llms-full.txt
    fs.writeFileSync(path.join(process.cwd(), 'docs/.vitepress/dist', 'llms-full.txt'), fullContent)
    console.log('--> Generated llms-full.txt with all markdown content')
  } catch (error) {
    console.error('Error generating full content file:', error)
  }
}

function generateLLMSTxt(): void {
  const rootDir = path.join(process.cwd(), 'docs/.vitepress/dist')

  try {
    if (!fs.existsSync(rootDir)) {
      console.error(`Directory does not exist: ${rootDir}`)
      return
    }

    let content = ''
    const structure = traverseDirectory(rootDir, rootDir)
    const markdownList = generateMarkdownList(structure)

    // Extract content from index.md
    let introContent = fs.readFileSync(path.join(__dirname, './llms-intro.md'), 'utf8')

    content = `${introContent}\n\n## SDK \n\n${markdownList}`

    // write to llms.txt
    fs.writeFileSync(path.join(process.cwd(), 'docs/.vitepress/dist', 'llms.txt'), content)
    console.log('--> Generated llms.txt with fast markdown content')
  } catch (error) {
    console.error('Error processing directory:', error)
  }
}

/**
 * Main function
 */
function main(): void {
  generateLLMSTxt()
  generateLLMSFullTxt()
}

main()
