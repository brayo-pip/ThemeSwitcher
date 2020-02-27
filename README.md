# ThemeSwitcher

## Features

This extension will set the VSCode theme to light or dark depending on a user-configured "day".

## Configuration

Configure the light and dark themes using the `ThemeSwitcher: Change Themes` command (preferred method).

For manual configuration:
* Change the `workbench.preferredLightColorTheme` and `workbench.preferredDarkColorTheme` user settings if it exists
* Otherwise, change the `themeswitcher.preferredLightColorTheme` and `themeswitcher.preferredDarkColorTheme` user settings.

>Note: See **Important Information** for more details.

## Extension Settings

This extension contributes the following settings:

* `themeswitcher.startDay`: set the 24-hour clock start of the day 
* `themeswitcher.endDay`: set the 24-hour clock end of the day 
* `themeswitcher.preferredLightColorTheme`: the light theme used in day*
* `themeswitcher.preferredDarkColorTheme`: the dark theme used at night*

>*=See **Important Information**

## Important Information

As of the January 2020 Stable build (1.42.0), `workbench.preferredLightColorTheme` and `workbench.preferredDarkColorTheme` are available for native theme settings.
For those who have access to this new feature, this extension will use those settings ***instead of the extension specific settings***. Additionally, the `ThemeSwitcher: Change Themes` command will set themes based on the new settings' availability: in the workbench if it exists, otherwise in the extension.

>Icon made by Vectors Market from www.flaticon.com
