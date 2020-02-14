import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const userSettings = vscode.workspace.getConfiguration();
	const extensionConfig = vscode.workspace.getConfiguration('themeswitcher');

	const prefLight = 'workbench.preferredLightColorTheme';
	const lightTheme = userSettings.get(prefLight);
	const prefDark = 'workbench.preferredDarkColorTheme';
	const darkTheme = userSettings.get(prefDark);

	const startDay = extensionConfig.get('startDay') as string;
	const endDay = extensionConfig.get('endDay') as string;

	context.subscriptions.push(vscode.commands.registerCommand('themeswitcher.changeDay', async () => {
		const start = await vscode.window.showInputBox({ prompt: 'Enter start day time.', placeHolder: 'HH:MM' });
		extensionConfig.update('startDay', start, true);
		const end = await vscode.window.showInputBox({ prompt: 'Enter end day time.', placeHolder: 'HH:MM' });
		extensionConfig.update('endDay', end, true);
	}));

	let startTime = 0, endTime = 0;

	try {
		startTime = getDate(startDay).getTime();
		endTime = getDate(endDay).getTime();
	} catch (e) {
		const cv = 'Change Values';
		vscode.window.showErrorMessage('Invalid start or end day values.', cv)
			.then(choice => {
				if (choice === cv) vscode.commands.executeCommand('themeswitcher.changeDay');
			});
		return;
	}

	const currentTime = new Date().getTime();

	const isDay = currentTime > startTime && currentTime < endTime;
	const currentTheme = isDay ? lightTheme : darkTheme

	// console.log(lightTheme, darkTheme, startDay, endDay, currentHour, isDay, currentTheme)

	userSettings.update("workbench.colorTheme", currentTheme, true);

	vscode.window.showInformationMessage(`It is ${isDay ? 'day' : 'night'} time. Your theme is now ${currentTheme}.`)
}

function getDate(str: string): Date {
	const hm = str.split(':');
	console.log(hm);
	let date = new Date();
	const hours = Number.parseInt(hm[0]);
	const mins = Number.parseInt(hm[1]);
	if (Number.isNaN(hours) || Number.isNaN(mins)) throw new Error('Bad value');
	date.setHours(hours);
	date.setMinutes(mins);
	return date;
}

export function deactivate() { }
