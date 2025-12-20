import * as vscode from 'vscode';
import { getGitHubLink } from './gitHubLink';

/**
 * Activates the GitHub Link extension.
 * Registers the 'ghlink.copyLink' command that generates and copies GitHub URLs to the clipboard.
 * 
 * @param context - The extension context provided by VSCode
 */
export function activate(context: vscode.ExtensionContext): void {
    const disposable: vscode.Disposable = vscode.commands.registerCommand('ghlink.copyLink', async (): Promise<void> => {
        const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }

        const document: vscode.TextDocument = editor.document;
        const selection: vscode.Selection = editor.selection;
        
        const startLine: number = selection.start.line + 1;
        const endLine: number = selection.end.line + 1;
        
        try {
            const link: string = await getGitHubLink(document.uri.fsPath, startLine, endLine);
            
            await vscode.env.clipboard.writeText(link);
            
            const lineInfo: string = startLine === endLine 
                ? `line ${startLine}` 
                : `lines ${startLine}-${endLine}`;
            
            vscode.window.showInformationMessage(`GitHub link copied to clipboard (${lineInfo})`);
        } catch (error: unknown) {
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`Failed to generate GitHub link: ${errorMessage}`);
        }
    });

    context.subscriptions.push(disposable);
}

/**
 * Deactivates the extension.
 * Called when the extension is deactivated. Currently performs no cleanup.
 */
export function deactivate(): void {}
