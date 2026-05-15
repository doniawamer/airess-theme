const path = require('path');
const vscode = require('vscode');

const CUSTOM_UI_STYLE_ID = 'subframe7536.custom-ui-style';
const RELOAD_CMD = 'custom-ui-style.reload';
const APPLY_CMD = 'airess-theme.applyUiFonts';
const APPLIED_KEY = 'airessTheme.uiFontsApplied';

const AIRESS_UI_CURSIVE =
  "'Segoe Script', 'Apple Chancery', 'Snell Roundhand', 'Bradley Hand ITC', 'Chalkboard SE', cursive";

/** @type {Record<string, Record<string, string>>} */
const AIRESS_UI_STYLESHEET = {
  '.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab .tab-label':
    {
      'font-family': AIRESS_UI_CURSIVE,
      'font-size': '12px',
    },
  '.monaco-workbench .tabs-container > .tab .label-name': {
    'font-family': AIRESS_UI_CURSIVE,
    'font-size': '12px',
  },
  '.monaco-pane-view .pane > .pane-header h3.title': {
    'font-family': AIRESS_UI_CURSIVE,
    'font-size': '11px',
    'font-weight': '600',
    'color': 'var(--vscode-sideBarSectionHeader-foreground)',
    'letter-spacing': '0.06em',
  },
  '.quick-input-list .quick-input-list-entry .monaco-icon-label': {
    'font-family': AIRESS_UI_CURSIVE,
    'font-size': '12px',
  },
  '.quick-input-list .quick-input-list-entry .label-description': {
    'font-family': AIRESS_UI_CURSIVE,
    'font-size': '11px',
    'opacity': '0.9',
  },
  '.search-view .monaco-list-row .monaco-icon-label': {
    'font-family': AIRESS_UI_CURSIVE,
    'font-size': '12px',
  },
  '.explorer-folders-view .monaco-tl-row .monaco-icon-label': {
    'font-family': AIRESS_UI_CURSIVE,
    'font-size': '12px',
  },
};

/**
 * @param {vscode.ExtensionContext} context
 * @returns {string}
 */
function bundledCssFileUrl(context) {
  return vscode.Uri.file(path.join(context.extensionPath, 'media', 'airess-ui-fonts.css')).toString();
}

/**
 * @param {vscode.ExtensionContext} context
 */
/**
 * @param {vscode.ExtensionContext} context
 * @param {{ silent?: boolean }} options
 */
async function applyUiFonts(context, options = {}) {
  const { silent = false } = options;
  const customUi = vscode.extensions.getExtension(CUSTOM_UI_STYLE_ID);
  if (!customUi) {
    const choice = await vscode.window.showWarningMessage(
      'airess glow needs the free "Custom UI Style" extension for cursive tabs & sidebar headers (themes alone cannot change those fonts).',
      'Install Custom UI Style',
      'Cancel'
    );
    if (choice === 'Install Custom UI Style') {
      await vscode.commands.executeCommand(
        'workbench.extensions.search',
        `@id:${CUSTOM_UI_STYLE_ID}`
      );
    }
    return false;
  }

  if (!customUi.isActive) {
    await customUi.activate();
  }

  const cfg = vscode.workspace.getConfiguration('custom-ui-style');
  const cssUrl = bundledCssFileUrl(context);

  await cfg.update('stylesheet', AIRESS_UI_STYLESHEET, vscode.ConfigurationTarget.Global);
  await cfg.update(
    'external.imports',
    [{ type: 'css', url: cssUrl }],
    vscode.ConfigurationTarget.Global
  );
  await cfg.update('watch', true, vscode.ConfigurationTarget.Global);

  const commands = await vscode.commands.getCommands(true);
  if (!commands.includes(RELOAD_CMD)) {
    await vscode.window.showWarningMessage(
      'Custom UI Style is installed but not ready yet. Reload the window, then run “airess glow: Apply cursive UI fonts”.'
    );
    return false;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'airess glow',
      cancellable: false,
    },
    async () => {
      await vscode.commands.executeCommand(RELOAD_CMD);
    }
  );

  if (!silent) {
    await vscode.window.showInformationMessage(
      'Cursive UI fonts applied. If tabs still look normal, fully quit and reopen Cursor (Cmd+Q), then run “airess glow: Apply cursive UI fonts” again.',
      'OK'
    );
  }
  return true;
}

/**
 * @param {vscode.ExtensionContext} context
 */
async function ensureUiFontsOnce(context) {
  if (context.globalState.get(APPLIED_KEY)) {
    return;
  }
  const ok = await applyUiFonts(context, { silent: true });
  if (ok) {
    await context.globalState.update(APPLIED_KEY, true);
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand(APPLY_CMD, async () => {
      const ok = await applyUiFonts(context);
      if (ok) {
        await context.globalState.update(APPLIED_KEY, true);
      }
    })
  );

  context.subscriptions.push(
    vscode.extensions.onDidChange(() => {
      void ensureUiFontsOnce(context);
    })
  );

  // Defer so Custom UI Style can finish activating on startup.
  const timeout = setTimeout(() => {
    void ensureUiFontsOnce(context);
  }, 3000);
  context.subscriptions.push({ dispose: () => clearTimeout(timeout) });
}

function deactivate() {}

module.exports = { activate, deactivate, applyUiFonts, AIRESS_UI_STYLESHEET, AIRESS_UI_CURSIVE };
