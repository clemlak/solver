import * as vscode from 'vscode';
import {
  processStr,
} from 'solhint/lib';

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension activated');

  let editor = vscode.window.activeTextEditor;
  let timeout: NodeJS.Timer;

  /* We load our settings */
  const delay: number = vscode.workspace.getConfiguration().get('solver.delay') as number;
  const warningStyle: object = vscode.workspace.getConfiguration().get('solver.warningStyle') as object;
  const errorStyle: object = vscode.workspace.getConfiguration().get('solver.errorStyle') as object;
  let solhintConfig: object;

  const warningDecoration = vscode.window.createTextEditorDecorationType(warningStyle);
  const errorDecoration = vscode.window.createTextEditorDecorationType(errorStyle);

  if (vscode.workspace.name) {
    vscode.workspace.findFiles('**/.solhint.json', '**/node_modules/**')
      .then((files) => {
        if (files.length > 0) {
          const fs = vscode.workspace.fs;

          fs.readFile(files[0])
            .then((content) => {
              solhintConfig = JSON.parse(content.toString());
              vscode.window.showInformationMessage('Using solhint.json configuration file from current workspace.');
            });
        } else {
          solhintConfig = vscode.workspace.getConfiguration().get('solver.config') as object;
          vscode.window.showErrorMessage('No solhint.json configuration file has been found in the current workspace, the rules set in the settings will be used.');
        }
      });
  } else {
    vscode.window.showErrorMessage('The current file is not in a workspace, the rules set in the settings will be used.');
    solhintConfig = vscode.workspace.getConfiguration().get('solver.config') as object;
  }

  function updateDecorations() {
    if (!editor || editor.document.languageId !== 'solidity') {
      return;
    }

    const warnings = [];
    const errors = [];

    const report = processStr(editor.document.getText(), solhintConfig);
    console.log(report.messages);

    for (let i = 0; i < report.messages.length; i += 1) {
      const msg = report.messages[i];

      const line = editor.document.lineAt(msg.line - 1);

      const range = new vscode.Range(
          new vscode.Position(msg.line - 1, msg.column - 1),
          line.range.end
      );

      if (msg.severity === 3) {
        const hoverMessage = `⚠️ Rule "${msg.ruleId}": ${msg.message}.`;

        warnings.push({
          hoverMessage,
          range,
        });
      } else {
        const hoverMessage = `❌ Rule "${msg.ruleId}": ${msg.message}.`;

        errors.push({
          hoverMessage,
          range,
        });
      }
    }

    editor.setDecorations(warningDecoration, warnings);
    editor.setDecorations(errorDecoration, errors);
  }

  function triggerUpdateDecorations() {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(updateDecorations, delay);
  }

  vscode.window.onDidChangeActiveTextEditor(() => {
    editor = vscode.window.activeTextEditor;
    triggerUpdateDecorations();
  }, null, context.subscriptions);

  vscode.window.onDidChangeTextEditorSelection(() => {
    editor = vscode.window.activeTextEditor;
    triggerUpdateDecorations();
  }, null, context.subscriptions);
}

export function deactivate() {
  console.log('Extension desactivated');
}
