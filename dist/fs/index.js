"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = exports.mkdir = exports.copyFolderContent = exports.exists = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const exists = async (path) => {
    try {
        await fs_1.promises.access(path);
        return true;
    }
    catch {
        return false;
    }
};
exports.exists = exists;
const copyFolderContent = async (srcPath, destPath) => {
    const srcDir = await fs_1.promises.opendir(srcPath);
    for await (const entry of srcDir) {
        const srcEntryPath = path_1.default.join(srcPath, entry.name);
        const destEntryPath = path_1.default.join(destPath, entry.name);
        if (entry.isDirectory()) {
            await (0, exports.copyFolderContent)(srcEntryPath, destEntryPath);
        }
        else {
            await fs_1.promises.mkdir(path_1.default.dirname(destEntryPath), { recursive: true });
            await fs_1.promises.copyFile(srcEntryPath, destEntryPath);
        }
    }
};
exports.copyFolderContent = copyFolderContent;
exports.mkdir = fs_1.promises.mkdir;
exports.writeFile = fs_1.promises.writeFile;
