"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fsUtils = __importStar(require("../fs"));
const render_1 = __importDefault(require("../render"));
const scan_1 = __importDefault(require("../render/page/scan"));
const runBuildCommand = async (props) => {
    const staticDir = path_1.default.join(props.projectDir, 'static');
    await fsUtils.copyFolderContent(staticDir, props.buildDir);
    const contentDir = path_1.default.join(props.projectDir, 'content');
    const urlCache = await (0, scan_1.default)(contentDir);
    for (const [url, page] of Object.entries(urlCache)) {
        const html = await (0, render_1.default)(urlCache, page, props.projectDir, props.config);
        const filePath = path_1.default.join(props.buildDir, url, 'index.html');
        await fsUtils.mkdir(path_1.default.dirname(filePath), { recursive: true });
        await fsUtils.writeFile(filePath, html);
    }
};
exports.default = runBuildCommand;
