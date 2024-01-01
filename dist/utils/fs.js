"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyDir = exports.exists = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
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
const copyDir = async (source, target) => {
    await fs_1.promises.mkdir(target, { recursive: true });
    const items = await fs_1.promises.readdir(source);
    for (const item of items) {
        const sourcePath = path_1.default.join(source, item);
        const targetPath = path_1.default.join(target, item);
        const stat = await fs_1.promises.stat(sourcePath);
        if (stat.isDirectory()) {
            await (0, exports.copyDir)(sourcePath, targetPath);
        }
        else {
            await fs_1.promises.copyFile(sourcePath, targetPath);
        }
    }
};
exports.copyDir = copyDir;
