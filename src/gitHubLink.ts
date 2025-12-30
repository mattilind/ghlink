import * as path from 'path';
import * as vscode from 'vscode';
import { simpleGit, SimpleGit, RemoteWithRefs } from 'simple-git';

/**
 * Information extracted from a Git repository for constructing GitHub URLs.
 */
interface GitHubInfo {
    /** GitHub repository owner (user or organization) */
    owner: string;
    /** GitHub repository name */
    repo: string;
    /** Current Git branch name */
    branch: string;
    /** Relative file path from repository root */
    filePath: string;
}

/**
 * Finds the appropriate GitHub remote from available remotes.
 * 
 * @param remotes - Array of Git remotes
 * @param configuredRemoteName - User-configured remote name (empty string for auto-detect)
 * @returns The selected remote
 * @throws Error if no suitable GitHub remote is found
 */
function findGitHubRemote(remotes: RemoteWithRefs[], configuredRemoteName: string): RemoteWithRefs {
    // If user configured a specific remote name, try to use it
    if (configuredRemoteName) {
        const configured = remotes.find(r => r.name === configuredRemoteName);
        if (configured && configured.refs.fetch) {
            return configured;
        }
        throw new Error(`Configured remote '${configuredRemoteName}' not found`);
    }
    
    // Auto-detect: filter to GitHub remotes only
    const githubRemotes = remotes.filter(r => 
        r.refs.fetch && r.refs.fetch.match(/github\.com[:/]/)
    );
    
    if (githubRemotes.length === 0) {
        throw new Error('No GitHub remotes found');
    }
    
    // If only one GitHub remote, use it
    if (githubRemotes.length === 1) {
        return githubRemotes[0];
    }
    
    // Multiple GitHub remotes: prefer 'origin', then 'upstream'
    const origin = githubRemotes.find(r => r.name === 'origin');
    if (origin) {
        return origin;
    }
    
    const upstream = githubRemotes.find(r => r.name === 'upstream');
    if (upstream) {
        return upstream;
    }
    
    // Fall back to first GitHub remote
    return githubRemotes[0];
}

/**
 * Extracts GitHub repository information from a file's Git repository.
 * 
 * @param filePath - Absolute path to the file in the Git repository
 * @returns Promise resolving to GitHub repository information
 * @throws Error if not in a Git repository, no GitHub remote found, or remote is not GitHub
 */
async function getGitHubInfo(filePath: string): Promise<GitHubInfo> {
    const git: SimpleGit = simpleGit(path.dirname(filePath));
    
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
        throw new Error('Not a git repository');
    }
    
    const remotes: RemoteWithRefs[] = await git.getRemotes(true);
    if (remotes.length === 0) {
        throw new Error('No git remotes found');
    }
    
    // Get configured remote name (empty string means auto-detect)
    const config = vscode.workspace.getConfiguration('ghlink');
    const configuredRemoteName = config.get<string>('remoteName', 'origin');
    
    const remote = findGitHubRemote(remotes, configuredRemoteName);
    const remoteUrl: string = remote.refs.fetch!;
    const match: RegExpMatchArray | null = remoteUrl.match(/github\.com[:/]([^/]+)\/(.+?)(\.git)?$/);
    
    if (!match) {
        throw new Error(`Remote '${remote.name}' is not a GitHub repository`);
    }
    
    const owner: string = match[1];
    const repo: string = match[2];
    
    const branch: string = await git.revparse(['--abbrev-ref', 'HEAD']);
    
    const rootDir: string = await git.revparse(['--show-toplevel']);
    const relativePath: string = path.relative(rootDir.trim(), filePath);
    
    return {
        owner,
        repo,
        branch: branch.trim(),
        filePath: relativePath.replace(/\\/g, '/')
    };
}

/**
 * Generates a GitHub URL for a specific file and line range.
 * 
 * @param filePath - Absolute path to the file in the Git repository
 * @param startLine - Starting line number (1-indexed)
 * @param endLine - Ending line number (1-indexed)
 * @returns Promise resolving to the GitHub URL with line anchors
 * @throws Error if Git repository information cannot be retrieved
 * 
 * @example
 * ```typescript
 * const link = await getGitHubLink('/path/to/file.ts', 10, 15);
 * // Returns: https://github.com/owner/repo/blob/main/file.ts#L10-L15
 * ```
 */
export async function getGitHubLink(filePath: string, startLine: number, endLine: number): Promise<string> {
    const info: GitHubInfo = await getGitHubInfo(filePath);
    
    const baseUrl: string = `https://github.com/${info.owner}/${info.repo}/blob/${info.branch}/${info.filePath}`;
    
    if (startLine === endLine) {
        return `${baseUrl}#L${startLine}`;
    } else {
        return `${baseUrl}#L${startLine}-L${endLine}`;
    }
}
