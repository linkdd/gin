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
const fs_1 = require("fs");
const cmd_ts_1 = require("cmd-ts");
const fs_2 = require("cmd-ts/batteries/fs");
const fsUtils = __importStar(require("../utils/fs"));
const config_1 = require("../services/config");
const content_1 = require("../services/content");
const render_1 = require("../services/render");
exports.default = (0, cmd_ts_1.command)({
    name: 'build',
    description: "Generate website's HTML to target directory",
    args: {
        project: (0, cmd_ts_1.option)({
            description: "Path to website's source",
            type: fs_2.Directory,
            long: 'project',
            short: 'p',
            defaultValue: () => process.cwd(),
        }),
        output: (0, cmd_ts_1.option)({
            description: 'Path to directory where to generate the public/ folder',
            type: fs_2.Directory,
            long: 'output',
            short: 'o',
            defaultValue: () => process.cwd(),
        }),
    },
    async handler({ project, output }) {
        const cfg = await (0, config_1.loadConfiguration)(project);
        const targetDir = path_1.default.join(output, 'public');
        try {
            await fs_1.promises.mkdir(targetDir, { recursive: true });
            const staticDir = path_1.default.join(project, 'static');
            if (await fsUtils.exists(staticDir)) {
                await fsUtils.copyDir(staticDir, targetDir);
            }
            const contentDir = path_1.default.join(project, 'content');
            const urlCache = await (0, content_1.scanContentDir)(contentDir);
            for (const [pageUrl, page] of Object.entries(urlCache)) {
                if (page !== undefined) {
                    const pagePath = path_1.default.join(targetDir, pageUrl);
                    const docPath = path_1.default.join(pagePath, 'index.html');
                    await fs_1.promises.mkdir(pagePath, { recursive: true });
                    const html = await (0, render_1.renderDocument)(urlCache, page, project, cfg);
                    await fs_1.promises.writeFile(docPath, html);
                }
            }
        }
        catch (err) {
            console.error(err);
            process.exit(1);
        }
    },
});
