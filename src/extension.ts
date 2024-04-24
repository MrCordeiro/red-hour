import * as vscode from 'vscode';

let meetingTime: Date | null = null;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'red-hour.setMeetingTime',
    async () => {
      const input = await vscode.window.showInputBox({
        placeHolder: 'Enter your next meeting time (e.g., 2023-03-15 14:00)',
      });
      const date = await vscode.window.showInputBox({
        prompt: 'Enter the date or your meeting',
        placeHolder: 'e.g.: YYYY-MM-DD or leave it empty for today',
      });
      const time = await vscode.window.showInputBox({
        prompt: 'Enter the time (Hpm or Ham)',
      });
      meetingTime = new Date(input || '');
      vscode.window.showInformationMessage(
        `Meeting time set for ${meetingTime.toLocaleString()}`
      );
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
