/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = void 0;
const vscode = __importStar(__webpack_require__(1));
const status_bar_1 = __webpack_require__(2);
const users_1 = __webpack_require__(3);
const storage_1 = __webpack_require__(4);
const files_1 = __webpack_require__(5);
const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
const markAsBusyCommand = "busy-file-indicator.markAsBusy";
const markAsIdleCommand = "busy-file-indicator.markAsIdle";
const displayStatusBarUI = (isBusy) => {
    const fileStatus = isBusy === true
        ? status_bar_1.StatusBarIndicatorStatus.BUSY
        : status_bar_1.StatusBarIndicatorStatus.IDLE;
    (0, status_bar_1.showStatusBarIndicator)(myStatusBarItem, fileStatus, {
        title: "Busy file status: mark as busy",
        command: fileStatus ? markAsBusyCommand : markAsIdleCommand,
    });
};
function activate({ subscriptions, workspaceState, }) {
    let currentFile = (0, files_1.getFileNameFromWorkspaceRoot)();
    const storageService = new storage_1.LocalStorageService(workspaceState);
    const getFileStatus = () => {
        currentFile = (0, files_1.getFileNameFromWorkspaceRoot)();
        if (currentFile?.length /** file is open */) {
            const fileStatus = storageService.getValue(currentFile) ?? false;
            if (fileStatus === status_bar_1.StatusBarIndicatorStatus.BUSY) {
                return displayStatusBarUI(true);
            }
            displayStatusBarUI(false);
        }
    };
    const setFileStatusAsBusy = (setAsBusy) => {
        const canToggleFileStatus = (0, users_1.checkUserPermission)();
        if (canToggleFileStatus === true && currentFile) {
            if (setAsBusy) {
                storageService.setValue(currentFile, status_bar_1.StatusBarIndicatorStatus.BUSY);
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
        currentFile = (0, files_1.getFileNameFromWorkspaceRoot)();
        vscode.window.showWarningMessage("current file:" + currentFile);
    });
    subscriptions.push(markAsBusy, markAsIdle, fileChangedEvent);
}
exports.activate = activate;


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.showStatusBarIndicator = exports.StatusBarIndicatorStatus = void 0;
const vscode = __importStar(__webpack_require__(1));
var StatusBarIndicatorStatus;
(function (StatusBarIndicatorStatus) {
    StatusBarIndicatorStatus["BUSY"] = "BUSY";
    StatusBarIndicatorStatus["IDLE"] = "IDLE";
})(StatusBarIndicatorStatus || (exports.StatusBarIndicatorStatus = StatusBarIndicatorStatus = {}));
function showStatusBarIndicator(myStatusBarItem, status, command) {
    if (status === StatusBarIndicatorStatus.BUSY) {
        myStatusBarItem.text = "Busy indicator: Busy 🚀";
        myStatusBarItem.color = "white";
        myStatusBarItem.backgroundColor = new vscode.ThemeColor("statusBarItem.errorBackground");
        myStatusBarItem.command = command;
    }
    else {
        myStatusBarItem.text = "Busy indicator: Idle 💤";
        myStatusBarItem.color = "white";
        myStatusBarItem.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");
        myStatusBarItem.command = command;
    }
    myStatusBarItem.show();
}
exports.showStatusBarIndicator = showStatusBarIndicator;


/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkUserPermission = void 0;
const vscode = __importStar(__webpack_require__(1));
function checkUserPermission() {
    const canMarkFile = true;
    if (!canMarkFile) {
        vscode.window.showErrorMessage("You don't have permission to mark the file as busy");
        return false;
    }
    return true;
}
exports.checkUserPermission = checkUserPermission;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStorageService = void 0;
const status_bar_1 = __webpack_require__(2);
class LocalStorageService {
    storage;
    constructor(storage) {
        this.storage = storage;
    }
    getValue(key) {
        return this.storage.get(key, status_bar_1.StatusBarIndicatorStatus.IDLE);
    }
    setValue(key, value) {
        this.storage.update(key, value);
    }
}
exports.LocalStorageService = LocalStorageService;


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getFileNameFromWorkspaceRoot = void 0;
const vscode = __importStar(__webpack_require__(1));
const editor = vscode.window.activeTextEditor;
function getFileNameFromWorkspaceRoot() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.length
        ? vscode.workspace.workspaceFolders[0]?.name
        : "";
    const paths = editor?.document.uri.toString().split(workspaceFolder);
    return workspaceFolder + paths?.pop();
}
exports.getFileNameFromWorkspaceRoot = getFileNameFromWorkspaceRoot;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map