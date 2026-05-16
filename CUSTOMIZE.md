# Customize airess glow

Want to make your own VS Code theme?

You can fork **airess glow**, edit the colors, test it locally, and package it as your own theme.

## 1. Fork the repo

Go to the GitHub repo and click **Fork**.

Then clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/airess-theme.git
cd airess-theme
```

## 2. Open it in VS Code

```bash
code .
```

## 3. Update the theme info

Open:

```txt
package.json
```

Update the basic extension info:

```json
"name": "your-theme-name",
"displayName": "Your Theme Name",
"description": "A short description of your theme",
"publisher": "your-publisher-name",
"version": "1.0.0"
```

Also update the theme names inside:

```json
"contributes": {
  "themes": []
}
```

The `label` is the name people will see in VS Code.

Example:

```json
{
  "label": "my cute theme",
  "uiTheme": "vs-dark",
  "path": "./themes/my-theme.json"
}
```

Use `vs` for light themes.

Use `vs-dark` for dark themes.

## 4. Edit the theme files

Go to the `themes` folder.

These are the main files:

```txt
themes/airess-lumen.json
themes/airess-bloom.json
themes/airess-dark.json
themes/airess-velvet.json
```

Each file controls one theme.

Inside each file, update the theme name:

```json
"name": "Your Theme Name"
```

Then edit the colors.

## 5. Understand the two main color sections

Most of the customization happens in two places:

```txt
colors
tokenColors
```

### `colors`

The `colors` section controls the VS Code interface.

This includes things like:

```txt
editor background
editor text
sidebar
activity bar
tabs
status bar
terminal
cursor
selection color
line highlight
dropdowns
buttons
```

Example:

```json
"colors": {
  "editor.background": "#fff8f4",
  "editor.foreground": "#30243f",
  "sideBar.background": "#f8eaf4",
  "activityBar.background": "#f3d7ea",
  "statusBar.background": "#6f56b5",
  "editorCursor.foreground": "#d96aa6",
  "editor.selectionBackground": "#dcd3ff"
}
```

If you want to change the overall vibe of the theme, start here.

### `tokenColors`

The `tokenColors` section controls the actual code colors.

This includes things like:

```txt
comments
strings
keywords
functions
variables
numbers
types
classes
punctuation
```

Example:

```json
{
  "scope": ["keyword", "storage.type"],
  "settings": {
    "foreground": "#d96aa6",
    "fontStyle": "bold"
  }
}
```

Another example:

```json
{
  "scope": ["string"],
  "settings": {
    "foreground": "#7dbaa0"
  }
}
```

## 6. Easy editing order

A good order to customize is:

1. Change the editor background
2. Change the main text color
3. Change the sidebar and tab colors
4. Change comments
5. Change strings
6. Change keywords
7. Change functions
8. Test it in VS Code

## 7. Common colors to look for

Search inside the theme file for these keys:

```txt
editor.background
editor.foreground
sideBar.background
activityBar.background
statusBar.background
tab.activeBackground
tab.inactiveBackground
editorCursor.foreground
editor.selectionBackground
editor.lineHighlightBackground
terminal.background
terminal.foreground
```

These usually make the biggest visual difference.

## 8. Test your theme locally

Open the project in VS Code.

Go to the **Debug** tab in the left sidebar.

Click the **play button**.

Or press:

```txt
F5
```

A new VS Code window will open.

This is the **Extension Development Host**.

In the new window:

1. Open Command Palette with `Cmd+Shift+P` or `Ctrl+Shift+P`
2. Search for **Color Theme**
3. Pick your theme

Now you can preview your theme while you edit it.

If your changes do not show up right away, reload the Extension Development Host window.

Open Command Palette and search:

```txt
Developer: Reload Window
```

## 9. Update the README and icon

Update:

```txt
README.md
```

Replace the text with your own theme name and description.

To change the icon, replace:

```txt
icon.png
```

Keep the same file name unless you also update the `icon` field in `package.json`.

## 10. Package the theme

Use Node 20:

```bash
nvm use 20
```

Then generate the `.vsix` file:

```bash
nvm use 20 && vsce package
```

This creates a file like:

```txt
your-theme-name-1.0.0.vsix
```

## 11. Test the VSIX file

In VS Code, go to:

```txt
Extensions → ... menu → Install from VSIX
```

Then choose your `.vsix` file.

You can also run:

```bash
code --install-extension your-theme-name-1.0.0.vsix
```

## 12. Publish it

Make sure your `publisher` in `package.json` matches your VS Code Marketplace publisher name.

Then run:

```bash
vsce publish
```

## 13. Update it later

Make your changes.

Then update the version in `package.json`.

Example:

```json
"version": "1.0.1"
```

Then package again:

```bash
nvm use 20 && vsce package
```

To publish the update:

```bash
vsce publish
```

## Quick checklist

Update these files:

```txt
package.json
README.md
icon.png
themes/*.json
```

Most important things to change:

```txt
package.json → name
package.json → displayName
package.json → publisher
package.json → contributes.themes labels
themes/*.json → name
themes/*.json → colors
themes/*.json → tokenColors
```

Package command:

```bash
nvm use 20 && vsce package
```
