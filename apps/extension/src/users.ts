import * as vscode from "vscode";

export function checkUserPermission(): boolean {
  const canMarkFile = true;

  if (!canMarkFile) {
    vscode.window.showErrorMessage(
      "You don't have permission to mark the file as busy"
    );
    return false;
  }

  return true;
}
