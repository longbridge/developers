/**
 * Astro integration: prebuild-skills
 *
 * astro:build:done 时 clone longbridge/skills 到 .data/skills，并把 zip 产物写进
 * dist/skill/。产出清单与 `.github/workflows/pack-skills.yml` **逐个对齐**：
 *
 *   skills.zip            仓库根整包（历史 URL，保留）
 *   longbridge-all.zip    skills/ 子目录整包
 *   <skill>.zip           skills/ 下每个技能目录各一个
 *
 * 为什么要对齐：Cloudflare Pages 的每次部署是**全量不可变快照**，不能增量往里加
 * 文件。pack-skills.yml 若单独 `wrangler pages deploy`，会把整站覆盖成只剩 zip。
 * 所以 zip 必须随文档构建一起进 dist，由同一次部署带上去。（方案 §15.7）
 *
 * 依赖 PATH 上的 `git` 与 `zip`；任一步失败只告警不中断构建。
 */

import type { AstroIntegration } from 'astro'
import { execFileSync, spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const SKILLS_REPO = 'https://github.com/longbridge/skills'
const DATA_DIR = path.resolve('.data')
const SKILLS_DIR = path.join(DATA_DIR, 'skills')
/** 技能目录在仓库的 skills/ 子目录下，不是仓库根 */
const SKILLS_SUBDIR = path.join(SKILLS_DIR, 'skills')
const DIST_SKILL_DIR = path.resolve('dist', 'skill')

function isCommandAvailable(cmd: string): boolean {
  return spawnSync(cmd, ['--version'], { stdio: 'ignore' }).status === 0
}

/** 写一个 zip；先删旧文件，否则 zip 会往已有归档里追加而不是重建 */
function writeZip(outFile: string, cwd: string, args: string[]): void {
  fs.rmSync(outFile, { force: true })
  execFileSync('zip', ['-r', '-q', outFile, ...args], { cwd, stdio: 'pipe' })
}

export function prebuildSkills(): AstroIntegration {
  return {
    name: 'prebuild-skills',
    hooks: {
      'astro:build:done': async () => {
        if (!isCommandAvailable('git') || !isCommandAvailable('zip')) {
          console.warn('[prebuild-skills] 缺少 git 或 zip — 跳过')
          return
        }

        fs.mkdirSync(DATA_DIR, { recursive: true })
        try {
          if (fs.existsSync(path.join(SKILLS_DIR, '.git'))) {
            execFileSync('git', ['-C', SKILLS_DIR, 'pull', '--ff-only', '--quiet'], { stdio: 'pipe' })
          } else {
            fs.rmSync(SKILLS_DIR, { recursive: true, force: true })
            execFileSync('git', ['clone', '--depth', '1', '--quiet', SKILLS_REPO, SKILLS_DIR], { stdio: 'pipe' })
          }
        } catch (err) {
          console.warn(`[prebuild-skills] git 失败(${err instanceof Error ? err.message : err}) — 跳过 zip`)
          return
        }

        fs.mkdirSync(DIST_SKILL_DIR, { recursive: true })
        const written: string[] = []

        // 仓库根整包。-x '.git/*' 是必须的：不排除会把 380KB+ 的 packfile 打进
        // 公开下载包（实测线上这份 858KB 里 45 个条目是 .git）。原始设计有这个
        // 排除，实现时丢了。
        try {
          writeZip(path.join(DIST_SKILL_DIR, 'skills.zip'), SKILLS_DIR, ['.', '-x', '.git/*'])
          written.push('skills.zip')
        } catch (err) {
          console.warn(`[prebuild-skills] skills.zip 失败(${err instanceof Error ? err.message : err})`)
        }

        if (!fs.existsSync(SKILLS_SUBDIR)) {
          console.warn(`[prebuild-skills] 未找到 ${SKILLS_SUBDIR} — 跳过分技能 zip`)
          return
        }

        try {
          writeZip(path.join(DIST_SKILL_DIR, 'longbridge-all.zip'), SKILLS_SUBDIR, ['.'])
          written.push('longbridge-all.zip')
        } catch (err) {
          console.warn(`[prebuild-skills] longbridge-all.zip 失败(${err instanceof Error ? err.message : err})`)
        }

        for (const entry of fs.readdirSync(SKILLS_SUBDIR, { withFileTypes: true })) {
          if (!entry.isDirectory()) continue
          try {
            writeZip(path.join(DIST_SKILL_DIR, `${entry.name}.zip`), SKILLS_SUBDIR, [entry.name])
            written.push(`${entry.name}.zip`)
          } catch (err) {
            console.warn(`[prebuild-skills] ${entry.name}.zip 失败(${err instanceof Error ? err.message : err})`)
          }
        }

        console.log(`[prebuild-skills] 写出 ${written.length} 个 zip → dist/skill/`)
      },
    },
  }
}
