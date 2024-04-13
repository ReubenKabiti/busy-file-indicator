import { randomUUID } from "crypto";
import * as vscode from "vscode";

export async function generateWorkspaceId() {
  const workspaceId = randomUUID();
  const workspacePath = vscode.workspace.workspaceFolders?.length
    ? vscode.workspace.workspaceFolders[0].uri.path
    : "";

  const vscodeFolderUri = vscode.Uri.joinPath(
    vscode.Uri.parse(workspacePath),
    ".vscode"
  );

  const newFileUri = vscode.Uri.joinPath(
    vscodeFolderUri,
    "busy-file-indicator.txt"
  );

  await vscode.workspace.fs.writeFile(newFileUri, Buffer.from(workspaceId));
  return workspaceId;
}

export async function readWorkspaceId() {
  const workspacePath = vscode.workspace.workspaceFolders?.length
    ? vscode.workspace.workspaceFolders[0].uri.path
    : "";

  const vscodeFolderUri = vscode.Uri.joinPath(
    vscode.Uri.parse(workspacePath),
    ".vscode"
  );

  const fileUri = vscode.Uri.joinPath(
    vscodeFolderUri,
    "busy-file-indicator.txt"
  );

  const fileContent = await vscode.workspace.fs.readFile(fileUri);

  return new TextDecoder().decode(fileContent);
}
