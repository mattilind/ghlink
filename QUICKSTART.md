# Quick Start Guide

## Testing the Extension

### Option 1: Run in Development Mode (Recommended)

1. Open this folder in VSCode/Windsurf
2. Press `F5` to launch the Extension Development Host
3. In the new window, open any file from a GitHub repository
4. Select one or more lines
5. Use one of these methods to copy the GitHub link:
   - Right-click → "Copy GitHub Link"
   - Press `Cmd+Shift+G` (macOS) or `Ctrl+Shift+G` (Windows/Linux)
   - Command Palette → "Copy GitHub Link"

### Option 2: Install as VSIX Package

```bash
# Install vsce (VSCode Extension Manager)
npm install -g @vscode/vsce

# Package the extension
vsce package

# Install the generated .vsix file
# In VSCode: Extensions → ... menu → Install from VSIX
```

## How to Use

1. **Open a file** in a Git repository with a GitHub remote
2. **Select lines** you want to link to (single line or range)
3. **Copy the link** using:
   - Keyboard: `Cmd+Shift+G` (Mac) or `Ctrl+Shift+G` (Win/Linux)
   - Context menu: Right-click → "Copy GitHub Link"
   - Command palette: "Copy GitHub Link"
4. **Paste** the link anywhere (Slack, email, documentation, etc.)

## Example Output

- Single line: `https://github.com/owner/repo/blob/main/src/file.ts#L42`
- Line range: `https://github.com/owner/repo/blob/main/src/file.ts#L42-L56`

## Troubleshooting

**"Not a git repository"**
- Make sure your file is inside a Git repository

**"No origin remote found"**
- Add a GitHub remote: `git remote add origin <github-url>`

**"Remote is not a GitHub repository"**
- The origin remote must point to a GitHub repository

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode (auto-compile on changes)
npm run watch

# Run tests
npm test
```
