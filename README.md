# ThemeSwitcher

## Features

This extension will set the VSCode theme to light or dark depending on a user-configured "day".

## Theme Configuration

Configure the light and dark themes using the `ThemeSwitcher: Change Themes` command (preferred method).

For manual configuration:
* Change the `workbench.preferredLightColorTheme` and `workbench.preferredDarkColorTheme` user settings 

## Daytime Configuration

Configure the start/end day times using the `ThemeSwitcher: Change Day` command (preferred method).

For manual configuration:
* Change the `themeswitcher.startDay` and `themeswitcher.endDay` user settings 

## Extension Settings

This extension contributes the following settings:

* `themeswitcher.startDay`: the time representing the 24-hour clock start of the day 
* `themeswitcher.endDay`: the time representing the 24-hour clock end of the day 
* `themeswitcher.flipThemeTiming`: if true, will have the light mode in the night and dark mode in the day (false by default)

>Icon made by Vectors Market from www.flaticon.com
