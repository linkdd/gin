"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const gray_matter_1 = __importDefault(require("gray-matter"));
const scanDir = async (directory, parent = '') => {
    const urlCache = {};
    const entries = await fs_1.promises.readdir(directory, { withFileTypes: true });
    const directories = [];
    for (const entry of entries) {
        if (entry.isDirectory()) {
            directories.push(entry.name);
            const fullPath = path_1.default.join(directory, entry.name);
            const localPath = path_1.default.join(parent, entry.name);
            const childUrlCache = await scanDir(fullPath, localPath);
            Object.assign(urlCache, childUrlCache);
            let url = localPath.replace(/\\/g, '/').replace(/\.md$/, '');
            if (!url.startsWith('/')) {
                url = `/${url}`;
            }
            if (!url.endsWith('/')) {
                url = `${url}/`;
            }
            url = url.replace(/\/_index\/$/, '/');
            const section = urlCache[url];
            if (section !== undefined) {
                const pages = Object.values(childUrlCache);
                for (const page of Object.values(childUrlCache)) {
                    if (page.url !== url) {
                        section.children.push(page);
                    }
                }
            }
        }
    }
    const children = await Promise.all(entries.map(async (entry) => {
        const fullPath = path_1.default.join(directory, entry.name);
        const localPath = path_1.default.join(parent, entry.name);
        if (entry.isFile() && path_1.default.extname(entry.name) === '.md') {
            const pageName = path_1.default.basename(entry.name, '.md');
            if (directories.includes(pageName)
                && (await fs_1.promises.stat(path_1.default.join(directory, pageName, '_index.md'))).isFile()) {
                return null;
            }
            const buf = await fs_1.promises.readFile(fullPath, 'utf-8');
            const { content, data: pageParams } = (0, gray_matter_1.default)(buf);
            const isSection = entry.name === '_index.md';
            const defaultTitle = isSection ? path_1.default.basename(parent) : path_1.default.basename(localPath, '.md');
            const title = pageParams.title ?? defaultTitle;
            let url = localPath.replace(/\\/g, '/').replace(/\.md$/, '');
            if (!url.startsWith('/')) {
                url = `/${url}`;
            }
            if (!url.endsWith('/')) {
                url = `${url}/`;
            }
            url = url.replace(/\/_index\/$/, '/');
            const page = {
                url,
                title,
                children: [],
                isSection,
                isHome: url === '/',
                params: pageParams,
                content,
            };
            return page;
        }
        return null;
    }));
    for (const child of children) {
        if (child !== null) {
            urlCache[child.url] = child;
        }
    }
    return urlCache;
};
const scanContentDir = async (contentDir) => {
    const urlCache = await scanDir(contentDir);
    const rootPage = urlCache['/'];
    if (rootPage !== undefined) {
        for (const page of Object.values(urlCache)) {
            const isRoot = page.url === '/';
            const isDirectChild = page.url.split('/').length === 3;
            if (!isRoot && isDirectChild) {
                rootPage.children.push(page);
            }
        }
    }
    return urlCache;
};
exports.default = scanContentDir;
