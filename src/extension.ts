import * as vscode from 'vscode';
import { getBackgroundColor, setBackgroundColor, updateColor } from './color';
import { setMeeting } from './time';



// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const COLOR_UPDATE_INTERVAL_SECONDS = 60;

  let meetingTime: Date | null = null;
  let originalBgColor = getBackgroundColor();

  let disposables = [];

  // Register the command to set the meeting time
  disposables.push(vscode.commands.registerCommand(
    'red-hour.setMeetingTime',
    async () => {
      const dateInput = await vscode.window.showInputBox({
        prompt: 'Enter the date or your meeting',
        placeHolder: 'e.g.: YYYY-MM-DD or leave it empty for today',
      });
      const timeInput = await vscode.window.showInputBox({
        prompt: 'Enter the time (HHpm, HHam, HH:MMpm, HH:MMam)',
      });
      meetingTime = setMeeting(dateInput || '', timeInput || '');
      vscode.window.showInformationMessage(
        `Meeting time set for ${meetingTime.toLocaleString()}`
      );
    }
  ));

  // Register the command to cancel the meeting effect
  disposables.push(vscode.commands.registerCommand(
    'red-hour.cancelMeetingTime',
    () => {
      meetingTime = null;
      setBackgroundColor(originalBgColor);
      vscode.window.showInformationMessage(
        'Meeting effect cancelled and color reset.'
      );
    }
  ));

  // If the user changes the background color, and there is no meeting set, 
  // respect the user's choice and keep the new color.
  disposables.push(vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('workbench.colorCustomizations')) {
      if (!meetingTime) {
        setBackgroundColor(originalBgColor);
      }
    }
  }));

  setInterval(() => {
    if (meetingTime) {
      vscode.debug.activeDebugConsole.appendLine(`Meeting time: ${meetingTime}`);
      updateColor(meetingTime, originalBgColor);
    }
  }, 1000 * COLOR_UPDATE_INTERVAL_SECONDS);


  context.subscriptions.push(...disposables);
}




// This method is called when your extension is deactivated
export function deactivate() { }
