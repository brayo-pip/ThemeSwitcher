// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const userSettings = vscode.workspace.getConfiguration();
	const extensionConfig = vscode.workspace.getConfiguration('themeswitcher');

	const lightTheme = userSettings.get('workbench.preferredLightColorTheme');
	const darkTheme = userSettings.get('workbench.preferredDarkColorTheme');

	const startDay = extensionConfig.get('themeswitcher.startDay') as number;
	const endDay = extensionConfig.get('themeswitcher.endDay') as number;

	const currentHour = new Date().getHours();
	// const isDay = false;
	const isDay = currentHour > startDay && currentHour < endDay;
	const currentTheme = isDay ? lightTheme : darkTheme

	userSettings.update("workbench.colorTheme", currentTheme, true);

	// // Use the console to output diagnostic information (console.log) and errors (console.error)
	// // This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "themeswitcher" is now active!');
	vscode.window.showInformationMessage(`It is ${isDay ? 'day time' : 'night time'}. Your theme is now ${currentTheme}.`);
}

// this method is called when your extension is deactivated
export function deactivate() { }
