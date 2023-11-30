import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	/* SETUP CODE */

	// init the configs for the user and for the extension
	const userSettings = vscode.workspace.getConfiguration();
	const extensionConfig = vscode.workspace.getConfiguration('Theme-Scheduler');

	// get a list of themes on the system
	const availableThemes: string[] = [];
	for (const extension of vscode.extensions.all) {
		const extThemes = extension.packageJSON.contributes?.themes ?? [];
		for (const theme of extThemes) {
			availableThemes.push(theme.id ?? theme.label);
		}
	}

	// create a Themes class for interacting with the user settings
	class Themes {
		// get the setting ids for the user's light/dark theme
		static userPrefLightId = 'workbench.preferredLightColorTheme';
		static userPrefDarkId = 'workbench.preferredDarkColorTheme';

		static getLightTheme() {
			return userSettings.get(Themes.userPrefLightId) as string;
		}

		static setLightTheme(theme: string) {
			userSettings.update(Themes.userPrefLightId, theme, true);
		}

		static getDarkTheme() {
			return userSettings.get(Themes.userPrefDarkId) as string;
		}

		static setDarkTheme(theme: string) {
			userSettings.update(Themes.userPrefDarkId, theme, true);
		}
	}

	const reloadPrompt = async () => {
		const rw = 'Reload Window';
		const choice = await vscode.window.showWarningMessage('Reload the window for changes to take effect.', rw);
		if (choice === rw)
			vscode.commands.executeCommand('developer.reloadWindow');
	};

	// register the changeDay command (updates startDay and endDay vars)
	context.subscriptions.push(vscode.commands.registerCommand('Theme-Scheduler.changeDay', async () => {
		const start = await vscode.window.showInputBox({ prompt: 'Enter start day time.', placeHolder: 'HH:MM' });
		const end = await vscode.window.showInputBox({ prompt: 'Enter end day time.', placeHolder: 'HH:MM' });
		if (start)
			extensionConfig.update('startDay', start, true);
		if (end)
			extensionConfig.update('endDay', end, true);
		if (start || end)
			await reloadPrompt();
	}));

	// register the changeThemes command (update the prefLight/Dark theme vars)
	context.subscriptions.push(vscode.commands.registerCommand('Theme-Scheduler.changeThemes', async () => {
		const light = await vscode.window.showQuickPick(availableThemes, {
			placeHolder: 'Pick a theme to be your light theme haha (esc to skip this step).',
		});
		const dark = await vscode.window.showQuickPick(availableThemes, {
			placeHolder: 'Pick a theme to be your dark theme (esc to skip this step).',
		});
		if (light)
			Themes.setLightTheme(light);
		if (dark)
			Themes.setDarkTheme(dark);
		if (light || dark) {
			vscode.window.showInformationMessage(`Success! Light: ${light ? light : Themes.getLightTheme()}, Dark: ${dark ? dark : Themes.getDarkTheme()}`);
			await reloadPrompt();
		}
	}));

	/* FUNCTIONALITY CODE */

	// get the vars from the extension config
	const startDay = extensionConfig.get('startDay') as string;
	const endDay = extensionConfig.get('endDay') as string;
	const flipThemeTiming = extensionConfig.get('flipThemeTiming') as boolean;
	const showNotifications = extensionConfig.get('showNotifications') as boolean;

	// attempt to get reasonable startTime and endTime for the daytime check (changeDay if bad values)
	let startTime = 0, endTime = 0;
	try {
		startTime = getDate(startDay).getTime();
		endTime = getDate(endDay).getTime(); 
	} catch (e) {
		const cv = 'Change Values';
		vscode.window.showErrorMessage('Invalid start or end day values.', cv)
			.then(choice => {
				if (choice === cv) vscode.commands.executeCommand('Theme-Scheduler.changeDay');
			});
		return;
	}

	// get current time
	const { isDay, currentTheme } = setTheme();

	// display if it is day or night, and then what the current theme is (then optionally prompt for changeThemes)
	const ct = 'Change Themes';
	const ns = 'Do not show again';
	if (showNotifications) {
		vscode.window.showInformationMessage(`It is ${isDay ? 'day' : 'night'} time. Your theme is now ${currentTheme}.`, ns, ct)
			.then(choice => {
				if (choice === ct) 
					vscode.commands.executeCommand('Theme-Scheduler.changeThemes');
				else if (choice === ns) 
					extensionConfig.update('showNotifications', false, true);
			});
	}
	function setTheme() {
		const currentTime = new Date().getTime();

		// find out the current theme based on if current time matches user-defined day (account for flipped themes)
		const isDay = currentTime > startTime && currentTime < endTime;
		const currentTheme = (isDay !== flipThemeTiming) ? Themes.getLightTheme() : Themes.getDarkTheme();

		// update the current color theme
		userSettings.update("workbench.colorTheme", currentTheme, true);
		return { isDay, currentTheme };
	}
	function scheduleThemeChange() {
		// get the current time
		const currentTime = new Date().getTime();
		// find out if it is day or night
		const isDay = currentTime > startTime && currentTime < endTime;
		
		let timeUntilChange = 0;
		if (isDay)
			// get the time until the next night (in ms)
			timeUntilChange = (currentTime > endTime) ? (24 * 60 * 60 * 1000) - (currentTime - endTime) : endTime - currentTime;
		else
			timeUntilChange = (currentTime > startTime) ? (24 * 60 * 60 * 1000) - (currentTime - startTime) : startTime - currentTime;

		// get the time until the next day (in ms)
		setTimeout(() => {
			setTheme();
			scheduleThemeChange();
		}, timeUntilChange);
	}
	scheduleThemeChange();
}

/**
 * Takes a string representation of a time and turns it into a Date
 * @param timeString string representation of a time in format HH:MM
 */
function getDate(timeString: string): Date {
	// split the parts of the string into hours and minutes
	const hm = timeString.split(':');
	const hours = Number.parseInt(hm[0]);
	const mins = Number.parseInt(hm[1]);
	if (Number.isNaN(hours) || Number.isNaN(mins)) throw new Error('Bad value');
	// create a new date, but set the hours and minutes to the given values
	const date = new Date();
	date.setHours(hours);
	date.setMinutes(mins);
	return date;
}

export function deactivate() { }
