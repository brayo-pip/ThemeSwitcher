"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const userSettings = vscode.workspace.getConfiguration();
    const extensionConfig = vscode.workspace.getConfiguration('themeswitcher');
    const lightTheme = userSettings.get('workbench.preferredLightColorTheme');
    const darkTheme = userSettings.get('workbench.preferredDarkColorTheme');
    const startDay = extensionConfig.get('themeswitcher.startDay');
    const endDay = extensionConfig.get('themeswitcher.endDay');
    const currentHour = new Date().getHours();
    // const isDay = false;
    const isDay = currentHour > startDay && currentHour < endDay;
    const currentTheme = isDay ? lightTheme : darkTheme;
    userSettings.update("workbench.colorTheme", currentTheme, true);
    // // Use the console to output diagnostic information (console.log) and errors (console.error)
    // // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "themeswitcher" is now active!');
    vscode.window.showInformationMessage(`It is ${isDay ? 'day time' : 'night time'}. Your theme is now ${currentTheme}.`);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map