/**
 * Astro integration: prebuild-skills
 *
 * Runs at astro:build:done hook. Clones the longbridge/skills repository
 * to .data/skills and zips it to dist/skill/skills.zip.
 *
 * Requirements:
 *   - `git` binary available on PATH
 *   - `zip` binary available on PATH
 *
 * On failure (clone error, missing binaries, etc.), logs a warning and
 * continues — the build is not aborted.
 */

import type { AstroIntegration } from 'astro'
import { execSync, spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const SKILLS_REPO = 'https://github.com/longbridge/skills'
const DATA_DIR = path.resolve('.data')
const SKILLS_DIR = path.join(DATA_DIR, 'skills')
const DIST_SKILL_DIR = path.resolve(path.join('dist', 'skill'))
const ZIP_OUTPUT = path.join(DIST_SKILL_DIR, 'skills.zip')

function isCommandAvailable(cmd: string): boolean {
  const result = spawnSync(cmd, ['--version'], { stdio: 'ignore' })
  return result.status === 0
}

export function prebuildSkills(): AstroIntegration {
  return {
    name: 'prebuild-skills',
    hooks: {
      'astro:build:done': async () => {
        console.log('[prebuild-skills] starting skills zip generation…')

        // Check required binaries
        if (!isCommandAvailable('git')) {
          console.warn('[prebuild-skills] `git` not found on PATH — skipping')
          return
        }
        if (!isCommandAvailable('zip')) {
          console.warn('[prebuild-skills] `zip` not found on PATH — skipping')
          return
        }

        // Ensure .data/ exists
        fs.mkdirSync(DATA_DIR, { recursive: true })

        // Clone or pull the skills repo
        try {
          if (fs.existsSync(path.join(SKILLS_DIR, '.git'))) {
            console.log('[prebuild-skills] skills repo exists, pulling latest…')
            execSync('git -C .data/skills pull --ff-only --quiet', { stdio: 'pipe' })
          } else {
            console.log('[prebuild-skills] cloning skills repo…')
            // Remove partial clone if any
            if (fs.existsSync(SKILLS_DIR)) {
              fs.rmSync(SKILLS_DIR, { recursive: true, force: true })
            }
            execSync(`git clone --depth 1 --quiet "${SKILLS_REPO}" "${SKILLS_DIR}"`, { stdio: 'pipe' })
          }
          console.log('[prebuild-skills] skills repo ready')
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          console.warn(`[prebuild-skills] git operation failed (${message}) — skipping zip`)
          return
        }

        // Ensure dist/skill/ exists
        fs.mkdirSync(DIST_SKILL_DIR, { recursive: true })

        // Zip .data/skills → dist/skill/skills.zip
        try {
          // Remove old zip first so it's always fresh
          if (fs.existsSync(ZIP_OUTPUT)) {
            fs.rmSync(ZIP_OUTPUT)
          }
          execSync(`zip -r "${ZIP_OUTPUT}" .`, { cwd: SKILLS_DIR, stdio: 'pipe' })
          console.log(`[prebuild-skills] written → ${ZIP_OUTPUT}`)
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          console.warn(`[prebuild-skills] zip failed (${message}) — skipping`)
        }
      },
    },
  }
}
