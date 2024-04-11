import * as vscode from "vscode";
export type StatusBarIndicator = "busy" | "idle";

export function statusBarIndicator(
  myStatusBarItem: vscode.StatusBarItem,
  status: StatusBarIndicator,
  command: vscode.Command
) {
  if (status === "busy") {
    myStatusBarItem.text = "Busy File Indicator: IDLE";
    myStatusBarItem.color = "white";
    myStatusBarItem.backgroundColor = new vscode.ThemeColor(
      "statusBarItem.warningBackground"
    );
    myStatusBarItem.command = command;
  } else {
    myStatusBarItem.text = "Busy File Indicator: BUSY";
    myStatusBarItem.color = "white";
    myStatusBarItem.backgroundColor = new vscode.ThemeColor(
      "statusBarItem.errorBackground"
    );
    myStatusBarItem.command = command;
  }
  myStatusBarItem.show();
}
