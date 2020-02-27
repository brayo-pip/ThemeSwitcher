import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const userSettings = vscode.workspace.getConfiguration();
	const extensionConfig = vscode.workspace.getConfiguration('themeswitcher');

	const availableThemes: string[] = [];

	for (const extension of vscode.extensions.all) {
		if (Object.keys(extension.packageJSON).includes('contributes')) {
			if (Object.keys(extension.packageJSON.contributes).includes('themes')) {
				for (const theme of extension.packageJSON.contributes.themes) {
					availableThemes.push(theme.id ? theme.id : theme.label);
				}
			}
		}
	}
	const prefLight = 'preferredLightColorTheme';
	const prefDark = 'preferredDarkColorTheme';

	const userPrefLight = `workbench.${prefLight}`;
	const userPrefDark = `workbench.${prefDark}`;

	const startDay = extensionConfig.get('startDay') as string;
	const endDay = extensionConfig.get('endDay') as string;

	const lightTheme = userSettings.get(userPrefLight) as string | undefined;
	const darkTheme = userSettings.get(userPrefDark) as string | undefined;

	const getLightTheme = () => {
		return lightTheme ? lightTheme : extensionConfig.get(prefLight);
	}

	const setLightTheme = (theme: string) => {
		lightTheme ? userSettings.update(userPrefLight, theme, true) : extensionConfig.update(prefLight, theme, true);
	}

	const getDarkTheme = () => {
		return darkTheme ? darkTheme : extensionConfig.get(prefDark);
	}

	const setDarkTheme = (theme: string) => {
		darkTheme ? userSettings.update(userPrefDark, theme, true) : extensionConfig.update(prefDark, theme, true);
	}

	context.subscriptions.push(vscode.commands.registerCommand('themeswitcher.changeDay', async () => {
		const start = await vscode.window.showInputBox({ prompt: 'Enter start day time.', placeHolder: 'HH:MM' });
		extensionConfig.update('startDay', start, true);
		const end = await vscode.window.showInputBox({ prompt: 'Enter end day time.', placeHolder: 'HH:MM' });
		extensionConfig.update('endDay', end, true);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('themeswitcher.changeThemes', async () => {
		const lightTheme = await vscode.window.showQuickPick(availableThemes, {
			placeHolder: 'Pick a theme to be your light theme.',
		});
		const darkTheme = await vscode.window.showQuickPick(availableThemes, {
			placeHolder: 'Pick a theme to be your dark theme.',
		});
		if (lightTheme && darkTheme) {
			setLightTheme(lightTheme);
			setDarkTheme(darkTheme);
			vscode.window.showInformationMessage(`Changes successful. Light: ${lightTheme}, Dark: ${darkTheme}`);
		}
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
	const currentTheme = isDay ? getLightTheme() : getDarkTheme();

	userSettings.update("workbench.colorTheme", currentTheme, true);

	const ct = 'Change Themes';
	vscode.window.showInformationMessage(`It is ${isDay ? 'day' : 'night'} time. Your theme is now ${currentTheme}.`, ct)
		.then(choice => {
			if (choice === ct) vscode.commands.executeCommand('themeswitcher.changeThemes');
		});
}

function getDate(str: string): Date {
	const hm = str.split(':');
	let date = new Date();
	const hours = Number.parseInt(hm[0]);
	const mins = Number.parseInt(hm[1]);
	if (Number.isNaN(hours) || Number.isNaN(mins)) throw new Error('Bad value');
	date.setHours(hours);
	date.setMinutes(mins);
	return date;
}

export function deactivate() { }
