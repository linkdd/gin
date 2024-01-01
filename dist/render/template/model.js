"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateData = exports.getPagesTemplateData = exports.getPageTemplateData = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const getPageTemplateData = (page) => {
    return {
        url: page.url,
        title: page.title,
        params: page.params,
        children: page.children.map(exports.getPageTemplateData),
    };
};
exports.getPageTemplateData = getPageTemplateData;
const getPagesTemplateData = (urlCache) => {
    const pages = {};
    for (const [url, page] of Object.entries(urlCache)) {
        pages[url] = (0, exports.getPageTemplateData)(page);
    }
    return pages;
};
exports.getPagesTemplateData = getPagesTemplateData;
const getTemplateData = async (page, urlCache, projectDir, config) => {
    const dataDir = path_1.default.join(projectDir, 'data');
    const data = {};
    const loadDir = async (scope, dir) => {
        const entries = await fs_1.promises.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory()) {
                const subScope = {};
                await loadDir(subScope, path_1.default.join(dir, entry.name));
                scope[entry.name] = subScope;
            }
            else if (entry.isFile() && ['.yml', '.yaml'].includes(path_1.default.extname(entry.name).toLowerCase())) {
                const content = await fs_1.promises.readFile(path_1.default.join(dir, entry.name), 'utf-8');
                const data = js_yaml_1.default.load(content) || {};
                const key = path_1.default.basename(entry.name, path_1.default.extname(entry.name));
                scope[key] = data;
            }
        }
    };
    await loadDir(data, dataDir);
    return {
        page: (0, exports.getPageTemplateData)(page),
        site: {
            title: config.title,
            description: config.description,
            languageCode: config.languageCode,
            baseURL: config.baseURL,
            pages: (0, exports.getPagesTemplateData)(urlCache),
            params: config.params ?? {},
            data,
        }
    };
};
exports.getTemplateData = getTemplateData;
