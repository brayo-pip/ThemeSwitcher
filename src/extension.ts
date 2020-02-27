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

	class Themes {
		private hasUserSettings = Boolean(userSettings.get(userPrefLight)) && Boolean(userSettings.get(userPrefDark));

		getLightTheme() {
			return (this.hasUserSettings ? userSettings.get(userPrefLight) : extensionConfig.get(prefLight)) as string;
		}

		setLightTheme(theme: string) {
			this.hasUserSettings ? userSettings.update(userPrefLight, theme, true) : extensionConfig.update(prefLight, theme, true);
		}

		getDarkTheme() {
			return (this.hasUserSettings ? userSettings.get(userPrefDark) : extensionConfig.get(prefDark)) as string;
		}

		setDarkTheme(theme: string) {
			this.hasUserSettings ? userSettings.update(userPrefDark, theme, true) : extensionConfig.update(prefDark, theme, true);
		}
	}

	const themes = new Themes();

	context.subscriptions.push(vscode.commands.registerCommand('themeswitcher.changeDay', async () => {
		const start = await vscode.window.showInputBox({ prompt: 'Enter start day time.', placeHolder: 'HH:MM' });
		extensionConfig.update('startDay', start, true);
		const end = await vscode.window.showInputBox({ prompt: 'Enter end day time.', placeHolder: 'HH:MM' });
		extensionConfig.update('endDay', end, true);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('themeswitcher.changeThemes', async () => {
		const light = await vscode.window.showQuickPick(availableThemes, {
			placeHolder: 'Pick a theme to be your light theme (esc to skip this step).',
		});
		const dark = await vscode.window.showQuickPick(availableThemes, {
			placeHolder: 'Pick a theme to be your dark theme (esc to skip this step).',
		});
		if (light)
			themes.setLightTheme(light);
		if (dark)
			themes.setDarkTheme(dark);
		if (light || dark)
			vscode.window.showInformationMessage(`Success! Light: ${light ? light : themes.getLightTheme()}, Dark: ${dark ? dark : themes.getDarkTheme()}`);
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
	const currentTheme = isDay ? themes.getLightTheme() : themes.getDarkTheme();

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
