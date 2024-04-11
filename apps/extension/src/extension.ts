import * as vscode from "vscode";
import { statusBarIndicator } from "./ui/status-bar";

const myStatusBarItem = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Right,
  100
);

export function activate({ subscriptions }: vscode.ExtensionContext) {
  const markAsBusyCommand = "busy-file-indicator.markAsBusy";
  const markAsIdleCommand = "busy-file-indicator.markAsIdle";

  statusBarIndicator(myStatusBarItem, "busy", {
    title: "Busy file status: mark as busy",
    command: markAsIdleCommand,
  });

  vscode.window.showInformationMessage("Hello world");

  subscriptions.push(
    vscode.commands.registerCommand(markAsBusyCommand, () => {
      statusBarIndicator(myStatusBarItem, "busy", {
        title: "Busy file status: mark as busy",
        command: markAsIdleCommand,
      });
    }),
    vscode.commands.registerCommand(markAsIdleCommand, () => {
      statusBarIndicator(myStatusBarItem, "idle", {
        title: "Busy file status: mark as busy",
        command: markAsBusyCommand,
      });
    })
  );
}
