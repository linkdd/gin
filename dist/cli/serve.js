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
const express_1 = __importDefault(require("express"));
const cmd_ts_1 = require("cmd-ts");
const fs_1 = require("cmd-ts/batteries/fs");
const fsUtils = __importStar(require("../utils/fs"));
const config_1 = require("../services/config");
const content_1 = require("../services/content");
const render_1 = require("../services/render");
exports.default = (0, cmd_ts_1.command)({
    name: 'serve',
    description: 'Serve current website',
    args: {
        project: (0, cmd_ts_1.option)({
            description: "Path to website's source",
            type: fs_1.Directory,
            long: 'project',
            short: 'p',
            defaultValue: () => process.cwd(),
        }),
        bind: (0, cmd_ts_1.option)({
            description: 'Port to bind to',
            type: cmd_ts_1.number,
            long: 'bind',
            short: 'b',
            defaultValue: () => 1515,
        }),
    },
    async handler({ project, bind }) {
        const app = (0, express_1.default)();
        const staticDir = path_1.default.join(project, 'static');
        if (await fsUtils.exists(staticDir)) {
            app.use(express_1.default.static(staticDir));
        }
        app.get('*', async (req, res, next) => {
            if (!req.path.endsWith('/')) {
                res.redirect(`${req.path}/`);
            }
            else {
                try {
                    const cfg = await (0, config_1.loadConfiguration)(project);
                    cfg.baseURL = '/';
                    const contentDir = path_1.default.join(project, 'content');
                    const urlCache = await (0, content_1.scanContentDir)(contentDir);
                    const page = urlCache[req.path];
                    if (page !== undefined) {
                        const html = await (0, render_1.renderDocument)(urlCache, page, project, cfg);
                        console.log(`GET ${req.path} 200 OK`);
                        res.status(200).send(html);
                    }
                    else {
                        console.error(`GET ${req.path} 404 NOT_FOUND`);
                        res.status(404).send('Document not found');
                    }
                }
                catch (err) {
                    next(err);
                }
            }
        });
        app.use((err, req, res) => {
            console.error(err);
            res.status(500).send('An error occured');
        });
        await new Promise((resolve) => {
            app.listen(bind, () => {
                resolve(undefined);
            });
        });
        console.log(`Listening on http://localhost:${bind}`);
    },
});
