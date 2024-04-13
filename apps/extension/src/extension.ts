import * as vscode from "vscode";
import { showStatusBarIndicator, StatusBarIndicatorStatus } from "./status-bar";
import { checkUserPermission } from "./users";
import { LocalStorageService } from "./storage";
import { getFileNameFromWorkspaceRoot } from "./utils/files";
import { syncExtension } from "./utils/extension";
import { generateWorkspaceId, readWorkspaceId } from "./files";

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

export async function activate({
  subscriptions,
  workspaceState,
}: vscode.ExtensionContext) {
  let workspaceID = await readWorkspaceId();
  const storageService = new LocalStorageService(workspaceState, workspaceID);

  const workspaceSyncData = await syncExtension(
    workspaceID,
    storageService.toJSON()
  );

  storageService.populateFromJson(workspaceSyncData.files);

  let currentFile = getFileNameFromWorkspaceRoot();

  const getFileStatus = (): {
    status: StatusBarIndicatorStatus;
    file: string;
  } => {
    currentFile = getFileNameFromWorkspaceRoot();

    if (!currentFile?.length) {
      return { status: StatusBarIndicatorStatus.IDLE, file: "" };
    }

    const fileStatus =
      storageService.getValue<StatusBarIndicatorStatus>(currentFile) ??
      StatusBarIndicatorStatus.IDLE;

    if (fileStatus === StatusBarIndicatorStatus.BUSY) {
      displayStatusBarUI(true);
      return { status: fileStatus, file: currentFile };
    }

    displayStatusBarUI(false);

    return { status: fileStatus, file: currentFile };
  };

  // run status check on activation
  getFileStatus();

  const setFileStatusAsBusy = (
    setAsBusy: boolean,
    file: string | null = null
  ) => {
    const canToggleFileStatus = checkUserPermission();

    if (canToggleFileStatus === true && currentFile) {
      if (setAsBusy) {
        storageService.setValue(
          file ?? currentFile,
          StatusBarIndicatorStatus.BUSY
        );
      } else {
        storageService.deleteValue(file ?? currentFile);
      }

      // update status bar ui
      displayStatusBarUI(setAsBusy);
    }
  };

  /**
   * Activation Commands
   */
  const markAsBusy = vscode.commands.registerCommand(
    markAsBusyCommand,
    async () => {
      // persist register workspace amongst collaborators
      if (storageService.count() === 0) {
        workspaceID = await generateWorkspaceId();
      }

      setFileStatusAsBusy(true);
      await syncExtension(workspaceID, storageService.toJSON());

      vscode.window.showInformationMessage("File marked as busy");
    }
  );

  const markAsIdle = vscode.commands.registerCommand(markAsIdleCommand, () => {
    setFileStatusAsBusy(false);
    vscode.window.showInformationMessage("File marked as idle");
  });

  /**
   * Activation Events
   */

  // TODO: prevent key strokes when file is locked, show popup to user.
  // TODO: refresh name of file on file change
  /**
   * Renaming Files: updates all file paths in storage
   */
  const renameFilesEvent = vscode.workspace.onWillRenameFiles((event) => {
    if (storageService.count() === 0) {
      return;
    }

    for (const file of event.files) {
      setFileStatusAsBusy(false, file.oldUri.path);
      setFileStatusAsBusy(true, file.newUri.path);
    }

    getFileStatus();
  });

  vscode.workspace.onWillDeleteFiles((event) => {
    const { status } = getFileStatus();

    if (status === StatusBarIndicatorStatus.BUSY) {
      vscode.window.showWarningMessage("File is locked, can't delete");
      event.waitUntil(Promise.reject("File is busy, can't delete"));
    }
  });

  vscode.workspace.onDidChangeTextDocument((event) => {
    getFileStatus();
    vscode.window.showWarningMessage("Changed files" + currentFile);
  });

  const fileChangedEvent = vscode.workspace.onDidOpenTextDocument(() => {
    getFileStatus();
    vscode.window.showWarningMessage("Opened file" + currentFile);
  });

  subscriptions.push(
    markAsBusy,
    markAsIdle,
    fileChangedEvent,
    renameFilesEvent
  );
}
