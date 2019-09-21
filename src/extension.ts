import * as vscode from 'vscode';
import {
  processStr,
} from 'solhint/lib';

export function activate(context: vscode.ExtensionContext) {
  console.log('Solver activated...');

  let timeout: NodeJS.Timer;

  const delay: number = vscode.workspace.getConfiguration().get('solver.delay') as number;
  let solhintConfig: object;

  const editor = vscode.window.activeTextEditor;

  const warningDecoration = vscode.window.createTextEditorDecorationType({
    border: '1px solid #f39c12',
    borderStyle: 'dashed'
  });

  const errorDecoration = vscode.window.createTextEditorDecorationType({
    border: '1px solid #c0392b',
    borderStyle: 'dashed'
  });

  if (vscode.workspace.name) {
    vscode.workspace.findFiles('**/.solhint.json', '**/node_modules/**')
      .then((files) => {
        if (files.length > 0) {
          const fs = vscode.workspace.fs;

          fs.readFile(files[0])
            .then((content) => {
              console.log('Config file found!');
              solhintConfig = JSON.parse(content.toString());
              vscode.window.showInformationMessage('Loaded configuration from local solhint.json file.');
            });
        } else {
          solhintConfig = vscode.workspace.getConfiguration().get('solver.config') as object;
          vscode.window.showErrorMessage('No solhint.json config file has been found in the current workspace, the rules set in the settings will be used.');
        }
      });
  } else {
    vscode.window.showErrorMessage('The current file is not in a workspace, the rules set in the settings will be used.');
    solhintConfig = vscode.workspace.getConfiguration().get('solver.config') as object;
  }

  function updateDecorations() {
    if (!editor) {
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

  vscode.window.onDidChangeActiveTextEditor((activeEditor) => {
    if (activeEditor) {
      triggerUpdateDecorations();
    }
  }, null, context.subscriptions);

  vscode.window.onDidChangeTextEditorSelection(() => {
    triggerUpdateDecorations();
  }, null, context.subscriptions);
}

export function deactivate() {}
