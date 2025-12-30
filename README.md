# GitHub Link (ghlink)

A simple VSCode/Windsurf extension that generates GitHub links for selected lines and copies them to your clipboard.

## Features

- Generate GitHub links for the currently selected line(s) in your editor
- Automatically copies the link to your clipboard
- Works with single lines or line ranges
- Smart remote detection: automatically uses the GitHub remote if only one exists
- Configurable remote name for repositories with multiple remotes

## Usage

### Method 1: Context Menu
1. Select one or more lines in your editor
2. Right-click to open the context menu
3. Click "Copy GitHub Link"

### Method 2: Command Palette
1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Copy GitHub Link"
3. Press Enter

## Requirements

- Your file must be in a Git repository
- The repository must have at least one GitHub remote
- You must have an active internet connection to access GitHub

## Configuration

The extension works out of the box with sensible defaults, but you can customize the remote selection:

### Remote Selection

By default, the extension uses smart detection:
- If only one GitHub remote exists, it uses that automatically
- If multiple GitHub remotes exist, it prefers `origin`, then `upstream`
- You can override this by setting a specific remote name in your settings

To configure a specific remote:

1. Open VSCode Settings (`Cmd+,` or `Ctrl+,`)
2. Search for "ghlink"
3. Set **GitHub Link: Remote Name** to your preferred remote (e.g., `upstream`, `fork`, etc.)
4. Leave empty or set to `origin` for automatic detection

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
3. Intelligently selects the appropriate GitHub remote:
   - Uses configured remote if specified
   - Auto-detects if only one GitHub remote exists
   - Prefers `origin` over other remotes when multiple exist
4. Reads the GitHub remote URL
5. Gets the current branch name
6. Constructs a GitHub URL in the format:
   - Single line: `https://github.com/owner/repo/blob/branch/path/to/file.ext#L123`
   - Line range: `https://github.com/owner/repo/blob/branch/path/to/file.ext#L123-L456`
7. Copies the link to your clipboard

## License

MIT
