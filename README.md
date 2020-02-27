# ThemeSwitcher

## Features

This extension will set the VSCode theme to light or dark depending on a user-configured "day".

## Configuration

Configure the light and dark themes using the `themeswitcher.preferredLightColorTheme` and `themeswitcher.preferredDarkColorTheme` user settings.

## Extension Settings

This extension contributes the following settings:

* `themeswitcher.startDay`: set the 24-hour clock start of the day 
* `themeswitcher.endDay`: set the 24-hour clock end of the day 
* `themeswitcher.preferredLightColorTheme`: the light theme used in day
* `themeswitcher.preferredDarkColorTheme`: the dark theme used at day

## Upcoming Changes

As of the current Insider build (1.43.0), `workbench.preferredLightColorTheme` and `workbench.preferredDarkColorTheme` are available for native theme settings.
Once the public versions of these settings are on the stable release, this extension will use those instead of the extension specific settings.

>Icon made by Vectors Market from www.flaticon.com
