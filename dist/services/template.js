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
exports.getTemplate = exports.getTemplateData = exports.getPagesTemplateData = exports.getPageTemplateData = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const fsUtils = __importStar(require("../utils/fs"));
const twing_1 = require("twing");
const ext_1 = __importDefault(require("../utils/twing/ext"));
const patch_1 = __importDefault(require("../utils/twing/patch"));
const loader_1 = require("../utils/twing/loader");
const getTemplateEnvironment = async (projectDir, config) => {
    const plugins = await config.getPlugins();
    const templateDir = path_1.default.join(projectDir, 'templates');
    const loader = (0, twing_1.createFilesystemLoader)(new loader_1.FileSystemLoaderFS(templateDir));
    const env = (0, twing_1.createEnvironment)(loader);
    env.addExtension(new ext_1.default(plugins));
    for (const plugin of plugins) {
        for (const ext of plugin.getTemplateExtensions()) {
            env.addExtension(ext);
        }
    }
    (0, patch_1.default)(env);
    return env;
};
const getPageTemplateData = (page) => {
    return {
        url: page.url,
        title: page.title,
        params: page.params,
        isHome: page.isHome,
        isSection: page.isSection,
        children: page.children
            .sort((a, b) => {
            const aWeight = a.params.weight ?? 0;
            const bWeight = b.params.weight ?? 0;
            return aWeight - bWeight;
        })
            .map(exports.getPageTemplateData),
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
            else if (entry.isFile() &&
                ['.yml', '.yaml'].includes(path_1.default.extname(entry.name).toLowerCase())) {
                const content = await fs_1.promises.readFile(path_1.default.join(dir, entry.name), 'utf-8');
                const data = js_yaml_1.default.load(content) || {};
                const key = path_1.default.basename(entry.name, path_1.default.extname(entry.name));
                scope[key] = data;
            }
        }
    };
    if (await fsUtils.exists(dataDir)) {
        await loadDir(data, dataDir);
    }
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
        },
    };
};
exports.getTemplateData = getTemplateData;
const getTemplate = async (page, projectDir, config) => {
    const layout = page.params.layout ?? '_default';
    const env = await getTemplateEnvironment(projectDir, config);
    if (page.isHome) {
        return await env.loadTemplate(`layouts/${layout}/home.html`);
    }
    else if (page.isSection) {
        return await env.loadTemplate(`layouts/${layout}/section.html`);
    }
    return await env.loadTemplate(`layouts/${layout}/single.html`);
};
exports.getTemplate = getTemplate;
