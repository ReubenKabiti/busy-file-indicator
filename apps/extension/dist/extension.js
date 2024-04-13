/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 47:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BASE_API_URL = void 0;
exports.BASE_API_URL = "https://busy-file-indicator.onrender.com";


/***/ }),

/***/ 0:
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
const extension_1 = __webpack_require__(6);
const files_2 = __webpack_require__(48);
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
async function activate({ subscriptions, workspaceState, }) {
    let workspaceID = await (0, files_2.readWorkspaceId)();
    const storageService = new storage_1.LocalStorageService(workspaceState, workspaceID);
    const workspaceSyncData = await (0, extension_1.syncExtension)(workspaceID, storageService.toJSON());
    storageService.populateFromJson(workspaceSyncData.files);
    let currentFile = (0, files_1.getFileNameFromWorkspaceRoot)();
    const getFileStatus = () => {
        currentFile = (0, files_1.getFileNameFromWorkspaceRoot)();
        if (!currentFile?.length) {
            return { status: status_bar_1.StatusBarIndicatorStatus.IDLE, file: "" };
        }
        const fileStatus = storageService.getValue(currentFile) ??
            status_bar_1.StatusBarIndicatorStatus.IDLE;
        if (fileStatus === status_bar_1.StatusBarIndicatorStatus.BUSY) {
            displayStatusBarUI(true);
            return { status: fileStatus, file: currentFile };
        }
        displayStatusBarUI(false);
        return { status: fileStatus, file: currentFile };
    };
    // run status check on activation
    getFileStatus();
    const setFileStatusAsBusy = (setAsBusy, file = null) => {
        const canToggleFileStatus = (0, users_1.checkUserPermission)();
        if (canToggleFileStatus === true && currentFile) {
            if (setAsBusy) {
                storageService.setValue(file ?? currentFile, status_bar_1.StatusBarIndicatorStatus.BUSY);
            }
            else {
                storageService.deleteValue(file ?? currentFile);
            }
            // update status bar ui
            displayStatusBarUI(setAsBusy);
        }
    };
    /**
     * Activation Commands
     */
    const markAsBusy = vscode.commands.registerCommand(markAsBusyCommand, async () => {
        // persist register workspace amongst collaborators
        if (storageService.count() === 0) {
            workspaceID = await (0, files_2.generateWorkspaceId)();
        }
        setFileStatusAsBusy(true);
        await (0, extension_1.syncExtension)(workspaceID, storageService.toJSON());
        vscode.window.showInformationMessage("File marked as busy");
    });
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
        if (status === status_bar_1.StatusBarIndicatorStatus.BUSY) {
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
    subscriptions.push(markAsBusy, markAsIdle, fileChangedEvent, renameFilesEvent);
}
exports.activate = activate;


/***/ }),

/***/ 48:
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
exports.readWorkspaceId = exports.generateWorkspaceId = void 0;
const crypto_1 = __webpack_require__(49);
const vscode = __importStar(__webpack_require__(1));
async function generateWorkspaceId() {
    const workspaceId = (0, crypto_1.randomUUID)();
    const workspacePath = vscode.workspace.workspaceFolders?.length
        ? vscode.workspace.workspaceFolders[0].uri.path
        : "";
    const vscodeFolderUri = vscode.Uri.joinPath(vscode.Uri.parse(workspacePath), ".vscode");
    const newFileUri = vscode.Uri.joinPath(vscodeFolderUri, "busy-file-indicator.txt");
    await vscode.workspace.fs.writeFile(newFileUri, Buffer.from(workspaceId));
    return workspaceId;
}
exports.generateWorkspaceId = generateWorkspaceId;
async function readWorkspaceId() {
    const workspacePath = vscode.workspace.workspaceFolders?.length
        ? vscode.workspace.workspaceFolders[0].uri.path
        : "";
    const vscodeFolderUri = vscode.Uri.joinPath(vscode.Uri.parse(workspacePath), ".vscode");
    const fileUri = vscode.Uri.joinPath(vscodeFolderUri, "busy-file-indicator.txt");
    const fileContent = await vscode.workspace.fs.readFile(fileUri);
    return new TextDecoder().decode(fileContent);
}
exports.readWorkspaceId = readWorkspaceId;


/***/ }),

/***/ 2:
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

/***/ 4:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStorageService = exports.keyValuePairSeparator = void 0;
const status_bar_1 = __webpack_require__(2);
exports.keyValuePairSeparator = "==";
class LocalStorageService {
    storage;
    workspaceID;
    constructor(storage, workspaceID) {
        this.storage = storage;
        this.workspaceID = workspaceID;
    }
    getValue(key) {
        return this.storage.get(this.workspaceID.concat(exports.keyValuePairSeparator, key), status_bar_1.StatusBarIndicatorStatus.IDLE);
    }
    setValue(key, value) {
        this.storage.update(this.workspaceID.concat(exports.keyValuePairSeparator, key), value);
    }
    deleteValue(key) {
        this.storage.update(this.workspaceID.concat(exports.keyValuePairSeparator, key), undefined);
    }
    count() {
        return this.storage.keys.length;
    }
    populateFromJson(json) {
        const parsed = JSON.parse(json);
        for (const key in parsed) {
            this.setValue(key, parsed[key]);
        }
    }
    toJSON() {
        const keys = this.storage.keys();
        const obj = {};
        keys.forEach((key) => {
            const value = this.getValue(key);
            if (value) {
                obj[key] = value;
            }
        });
        return JSON.stringify(obj);
    }
}
exports.LocalStorageService = LocalStorageService;


/***/ }),

/***/ 3:
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

/***/ 6:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.syncExtension = void 0;
const key_1 = __webpack_require__(47);
/**
 * Sync extension data with the server, once data posted, returns the files for that workspace synced with server files
 * @param workspaceId - The workspace id
 * @param localData - The local data to sync
 */
async function syncExtension(workspaceId, localData) {
    const body = {
        workspace: workspaceId,
    };
    try {
        const response = await fetch(`${key_1.BASE_API_URL}/sync`, {
            method: "POST",
            body: localData,
        });
        // TODO: response should include files for that workspace. each file has a owner, if mark as busy, owner is the user id(github-email), if mark as idle, owner is empty
        return { files: "", success: response.status === 200 };
    }
    catch (error) {
        console.error("Error syncing extension:", error);
        return { files: "", success: false };
    }
}
exports.syncExtension = syncExtension;


/***/ }),

/***/ 5:
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


/***/ }),

/***/ 1:
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),

/***/ 49:
/***/ ((module) => {

module.exports = require("crypto");

/***/ })

/******/ 	});
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