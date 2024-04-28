import * as vscode from 'vscode';


/**
 * Retrieves the background color from the VS Code configuration.
 * If no custom background color is set, it returns the default background color.
 * @returns The background color as a string.
 */
export function getBackgroundColor(): string {
  const defaultBackgroundColor = "#000000";
  const config = vscode.workspace.getConfiguration();
  const colorCustomizations = config.get('workbench.colorCustomizations');
  const currentBackgroundColor = (colorCustomizations as any)?.['editor.background'] ?? defaultBackgroundColor;
  console.log(`Current background color: ${currentBackgroundColor}`);
  return currentBackgroundColor;
}

/**
 * Sets the background color of the editor.
 * @param bgColor The color to set as the background color.
 */
export function setBackgroundColor(bgColor: string) {
  vscode.workspace.getConfiguration().update('workbench.colorCustomizations', {
    'editor.background': bgColor,
  },
    vscode.ConfigurationTarget.Workspace
  );
  console.log(`Background color set to: ${bgColor}`);
}


/**
 * Updates the background color based on the meeting time.
 * If the meeting time has passed, it resets the color to the original background color.
 * If the meeting time is within 15 minutes, it adjusts the color intensity based on the remaining time.
 * @param meetingTime - The time of the meeting.
 * @param originalBgColor - The original background color.
 */
export function updateColor(meetingTime: Date, originalBgColor: string) {
  const now = new Date();
  const diff = meetingTime.getTime() - now.getTime();
  const minutesUntilMeeting = diff / 1000 / 60;

  const effectActive = minutesUntilMeeting < 15;

  if (minutesUntilMeeting < 0) {
    // Reset the color if the meeting time has passed
    setBackgroundColor(originalBgColor);
  } else if (effectActive) {
    const intensity = Math.floor(255 * (1 - (minutesUntilMeeting / 15)));
    const newColor = adjustColorIntensity(originalBgColor, intensity);
    vscode.workspace.getConfiguration().update('workbench.colorCustomizations', {
      "editor.background": newColor
    }, vscode.ConfigurationTarget.Workspace);
  }
}

function adjustColorIntensity(baseColor: string, redIntensity: number): string {

  // Validate the baseColor format
  if (!/^#[0-9A-F]{6}$/i.test(baseColor)) {
    throw new Error('Invalid color format. Please use a 6-digit hex color code.');
  }

  let red = parseInt(baseColor.substring(1, 3), 16);
  let green = parseInt(baseColor.substring(3, 5), 16);
  let blue = parseInt(baseColor.substring(5, 7), 16);

  // Increase the red component up to a maximum of 255
  red = Math.min(255, red + redIntensity);

  // Convert components back to hex
  const redHex = red.toString(16).padStart(2, '0');
  const greenHex = green.toString(16).padStart(2, '0');
  const blueHex = blue.toString(16).padStart(2, '0');

  return `#${redHex}${greenHex}${blueHex}`;
}