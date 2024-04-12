import * as vscode from "vscode";
import { showStatusBarIndicator, StatusBarIndicatorStatus } from "./status-bar";
import { checkUserPermission } from "./users";
import { LocalStorageService } from "./storage";
import { getFileNameFromWorkspaceRoot } from "./utils/files";

const myStatusBarItem = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Right,
  100
);

const markAsBusyCommand = "busy-file-indicator.markAsBusy";
const markAsIdleCommand = "busy-file-indicator.markAsIdle";

const displayStatusBarUI = (isBusy: boolean) => {
  const fileStatus =
    isBusy === true
      ? StatusBarIndicatorStatus.BUSY
      : StatusBarIndicatorStatus.IDLE;

  showStatusBarIndicator(myStatusBarItem, fileStatus, {
    title: "Busy file status: mark as busy",
    command: fileStatus ? markAsBusyCommand : markAsIdleCommand,
  });
};

export function activate({
  subscriptions,
  workspaceState,
}: vscode.ExtensionContext) {
  let currentFile = getFileNameFromWorkspaceRoot();
  const storageService = new LocalStorageService(workspaceState);

  const getFileStatus = () => {
    currentFile = getFileNameFromWorkspaceRoot();

    if (currentFile?.length /** file is open */) {
      const fileStatus =
        storageService.getValue<StatusBarIndicatorStatus>(currentFile) ?? false;

      if (fileStatus === StatusBarIndicatorStatus.BUSY) {
        return displayStatusBarUI(true);
      }

      displayStatusBarUI(false);
    }
  };

  const setFileStatusAsBusy = (setAsBusy: boolean) => {
    const canToggleFileStatus = checkUserPermission();

    if (canToggleFileStatus === true && currentFile) {
      if (setAsBusy) {
        storageService.setValue(currentFile, StatusBarIndicatorStatus.BUSY);
      }

      // update status bar ui
      displayStatusBarUI(setAsBusy);
    }
  };

  // run status check on activation
  getFileStatus();

  const markAsBusy = vscode.commands.registerCommand(markAsBusyCommand, () => {
    setFileStatusAsBusy(true);
    vscode.window.showInformationMessage("File marked as busy");
  });

  const markAsIdle = vscode.commands.registerCommand(markAsIdleCommand, () => {
    setFileStatusAsBusy(false);
    vscode.window.showInformationMessage("File marked as idle");
  });

  // prevent key strokes when file is locked, show popup to user.
  // TODO: refresh name of file on file change
  const fileChangedEvent = vscode.workspace.onDidOpenTextDocument((e) => {
    getFileStatus();

    currentFile = getFileNameFromWorkspaceRoot();
    vscode.window.showWarningMessage("current file:" + currentFile);
  });

  subscriptions.push(markAsBusy, markAsIdle, fileChangedEvent);
}
