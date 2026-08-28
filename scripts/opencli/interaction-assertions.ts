#!/usr/bin/env bun
/**
 * interaction-assertions.ts — Reference implementation for UI interaction checks.
 *
 * ⚠ REFERENCE IMPLEMENTATION — This script documents the interaction assertions
 * that a T18 MCP-driven agent should perform using `mcp__chrome-devtools__*` tools.
 * It does NOT directly invoke Chrome DevTools. The agent calls these tools inline.
 * See README.md §"MCP-Driven Canonical Flow" for the authoritative invocation shape.
 *
 * Interaction checks documented here:
 *   1. Theme toggle — clicking the toggle cycles light → dark → system
 *   2. Language switcher — switching locale navigates to the correct path
 *   3. Search dialog — opening dialog shows input; typing returns results
 *   4. Sidebar collapse — clicking collapse button hides sidebar
 *   5. Code copy — clicking copy button copies code to clipboard
 *   6. data-lbus-component presence — verifies custom components rendered
 *
 * Each check documents the MCP tool sequence the T18 agent MUST execute.
 */

export interface InteractionResult {
  check: string;
  passed: boolean;
  detail: string;
}

// ---- MCP invocation shape reference ----
// The T18 agent performs these steps using chrome-devtools MCP tools.
// This module exports the assertion logic that processes the results.

/**
 * Assert theme toggle behavior.
 *
 * MCP sequence (T18 agent executes directly):
 *   1. mcp__chrome-devtools__navigate_page({ type: "url", url })
 *   2. mcp__chrome-devtools__take_snapshot()  // verify initial state
 *   3. mcp__chrome-devtools__click({ uid: <theme-toggle-uid> })
 *   4. mcp__chrome-devtools__evaluate_script({
 *        function: "() => document.documentElement.dataset.mode"
 *      })  // expect "dark" or "light" depending on initial
 *   5. mcp__chrome-devtools__click({ uid: <theme-toggle-uid> })  // cycle again
 *
 * @param initialMode  dataset.mode before click (from evaluate_script)
 * @param afterMode    dataset.mode after click (from evaluate_script)
 */
export function assertThemeToggle(
  initialMode: string | null,
  afterMode: string | null,
): InteractionResult {
  // After one click the mode should have changed
  const passed = afterMode !== null && afterMode !== initialMode;
  return {
    check: "theme-toggle",
    passed,
    detail: passed
      ? `Theme cycled ${initialMode ?? "unset"} → ${afterMode}`
      : `Theme did not change: ${initialMode} → ${afterMode}`,
  };
}

/**
 * Assert language switcher navigation.
 *
 * MCP sequence (T18 agent executes directly):
 *   1. mcp__chrome-devtools__navigate_page({ type: "url", url })
 *   2. mcp__chrome-devtools__take_snapshot()
 *   3. mcp__chrome-devtools__click({ uid: <locale-zh-CN-uid> })
 *   4. mcp__chrome-devtools__evaluate_script({
 *        function: "() => location.pathname"
 *      })  // expect /zh-CN/... prefix
 *
 * @param targetLocale   Expected locale prefix ("zh-CN", "zh-HK", "en")
 * @param resultPathname Actual pathname after click (from evaluate_script)
 * @param originalPath   Original path before click
 */
export function assertLanguageSwitcher(
  targetLocale: string,
  resultPathname: string,
  _originalPath: string,
): InteractionResult {
  const expectedPrefix = targetLocale === "en" ? "/" : `/${targetLocale}/`;
  const passed = resultPathname.startsWith(expectedPrefix);
  return {
    check: "language-switcher",
    passed,
    detail: passed
      ? `Navigated to ${resultPathname} (locale: ${targetLocale})`
      : `Expected path starting with ${expectedPrefix}, got ${resultPathname}`,
  };
}

/**
 * Assert search dialog opens and returns results.
 *
 * MCP sequence (T18 agent executes directly):
 *   1. mcp__chrome-devtools__press_key({ key: "Meta+k" })  // open search
 *   2. mcp__chrome-devtools__take_snapshot()  // verify dialog visible
 *   3. const dialogUid = snapshot.find([role=dialog])
 *   4. mcp__chrome-devtools__fill({ uid: <search-input-uid>, value: "quote" })
 *   5. await wait 300ms
 *   6. mcp__chrome-devtools__take_snapshot()
 *   7. const results = snapshot.findAll([role=option])
 *
 * @param dialogVisible  Whether [role=dialog] appeared in snapshot
 * @param resultCount    Number of [role=option] items found after typing
 */
export function assertSearchDialog(
  dialogVisible: boolean,
  resultCount: number,
): InteractionResult {
  const passed = dialogVisible && resultCount > 0;
  return {
    check: "search-dialog",
    passed,
    detail: passed
      ? `Dialog opened; ${resultCount} result(s) returned`
      : dialogVisible
        ? `Dialog opened but no results returned (count: ${resultCount})`
        : "Dialog did not open",
  };
}

/**
 * Assert sidebar collapse behavior.
 *
 * MCP sequence (T18 agent executes directly):
 *   1. mcp__chrome-devtools__take_snapshot()
 *   2. const collapseUid = snapshot.find([aria-label*="collapse" i])
 *   3. mcp__chrome-devtools__click({ uid: collapseUid })
 *   4. mcp__chrome-devtools__take_snapshot()
 *   5. const sidebarVisible = snapshot.find(nav[aria-label*="sidebar" i])
 *
 * @param sidebarVisibleBefore  True if sidebar was visible before click
 * @param sidebarVisibleAfter   True if sidebar is visible after click
 */
export function assertSidebarCollapse(
  sidebarVisibleBefore: boolean,
  sidebarVisibleAfter: boolean,
): InteractionResult {
  const passed = sidebarVisibleBefore && !sidebarVisibleAfter;
  return {
    check: "sidebar-collapse",
    passed,
    detail: passed
      ? "Sidebar collapsed successfully"
      : sidebarVisibleBefore
        ? "Sidebar did not collapse after click"
        : "Sidebar was not visible before click",
  };
}

/**
 * Assert code copy button.
 *
 * MCP sequence (T18 agent executes directly):
 *   1. mcp__chrome-devtools__take_snapshot()
 *   2. const copyUid = snapshot.find([aria-label*="copy" i])
 *   3. mcp__chrome-devtools__click({ uid: copyUid })
 *   4. const text = await mcp__chrome-devtools__evaluate_script({
 *        function: "async () => navigator.clipboard.readText()"
 *      })
 *
 * @param clipboardText  Text read from clipboard after click
 * @param expectedPrefix Expected prefix of code content
 */
export function assertCodeCopy(
  clipboardText: string,
  expectedPrefix: string,
): InteractionResult {
  const passed = clipboardText.trim().startsWith(expectedPrefix.trim());
  return {
    check: "code-copy",
    passed,
    detail: passed
      ? `Clipboard contains expected code (prefix: "${expectedPrefix.slice(0, 20)}...")`
      : `Clipboard mismatch: got "${clipboardText.slice(0, 40)}"`,
  };
}

/**
 * Assert that key data-lbus-component values are present on page.
 *
 * MCP sequence (T18 agent executes directly):
 *   1. const components = await mcp__chrome-devtools__evaluate_script({
 *        function: "() => [...document.querySelectorAll('[data-lbus-component]')]
 *                         .map(el => el.dataset.lbusComponent)"
 *      })
 *
 * @param found     Array of data-lbus-component values found on page
 * @param required  Array of expected component names
 */
export function assertComponentPresence(
  found: string[],
  required: string[],
): InteractionResult {
  const foundSet = new Set(found);
  const missing = required.filter((r) => !foundSet.has(r));
  const passed = missing.length === 0;
  return {
    check: "component-presence",
    passed,
    detail: passed
      ? `All ${required.length} components present`
      : `Missing components: ${missing.join(", ")}`,
  };
}

// ---- CLI main (prints reference docs) ----

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log(`
interaction-assertions.ts — reference implementation for UI interaction checks.

This module documents the MCP-driven interaction assertions for T18.
It does NOT run Chrome DevTools directly. The T18 agent calls
mcp__chrome-devtools__* tools inline and passes results to these exports.

See README.md §"MCP-Driven Canonical Flow" for the full agent script.

Exported assertion functions:
  assertThemeToggle(initialMode, afterMode)
  assertLanguageSwitcher(targetLocale, resultPathname, originalPath)
  assertSearchDialog(dialogVisible, resultCount)
  assertSidebarCollapse(sidebarVisibleBefore, sidebarVisibleAfter)
  assertCodeCopy(clipboardText, expectedPrefix)
  assertComponentPresence(found, required)
`);
    process.exit(0);
  }

  console.log("interaction-assertions.ts: reference implementation.");
  console.log("Import the exported functions in your T18 agent script.");
  console.log("Run with --help for documentation.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
