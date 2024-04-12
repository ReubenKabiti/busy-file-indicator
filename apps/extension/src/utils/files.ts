import * as vscode from "vscode";

const editor = vscode.window.activeTextEditor;

export function getFileNameFromWorkspaceRoot() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.length
    ? vscode.workspace.workspaceFolders[0]?.name
    : "";

  const paths = editor?.document.uri.toString().split(workspaceFolder);
  return workspaceFolder + paths?.pop();
}
