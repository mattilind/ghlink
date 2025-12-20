# GitHub Link (ghlink)

A simple VSCode/Windsurf extension that generates GitHub links for selected lines and copies them to your clipboard.

## Features

- Generate GitHub links for the currently selected line(s) in your editor
- Automatically copies the link to your clipboard
- Works with single lines or line ranges
- Supports both HTTPS and SSH remote URLs

## Usage

### Method 1: Context Menu
1. Select one or more lines in your editor
2. Right-click to open the context menu
3. Click "Copy GitHub Link"

### Method 2: Keyboard Shortcut
- **Windows/Linux**: `Ctrl+Shift+G`
- **macOS**: `Cmd+Shift+G`

### Method 3: Command Palette
1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Copy GitHub Link"
3. Press Enter

## Requirements

- Your file must be in a Git repository
- The repository must have a GitHub remote named "origin"
- You must have an active internet connection to access GitHub

## Installation

### From Source

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to compile the TypeScript code
4. Press `F5` in VSCode to open a new Extension Development Host window
5. Test the extension in the new window

### Building VSIX Package

```bash
npm install -g @vscode/vsce
vsce package
```

Then install the `.vsix` file in VSCode.

## How It Works

The extension:
1. Detects the current file and selected line(s)
2. Finds the Git repository root
3. Reads the GitHub remote URL from the origin remote
4. Gets the current branch name
5. Constructs a GitHub URL in the format:
   - Single line: `https://github.com/owner/repo/blob/branch/path/to/file.ext#L123`
   - Line range: `https://github.com/owner/repo/blob/branch/path/to/file.ext#L123-L456`
6. Copies the link to your clipboard

## License

MIT
