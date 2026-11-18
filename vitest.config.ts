import { defineConfig } from 'vitest/config'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    // Sibling git worktrees live under .worktrees/ (and .claude/worktrees/) and are
    // git-ignored, but vitest's default include still walks into them — every test
    // then runs twice (once per checkout) and failures are reported twice, against
    // code that isn't the one under test. Keep the default include, drop those trees.
    exclude: [...configDefaults.exclude, '**/.worktrees/**', '**/.claude/worktrees/**'],
  },
})
