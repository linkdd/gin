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
exports.renderMarkdown = void 0;
const path_1 = __importDefault(require("path"));
const twing_1 = require("twing");
const markdown_1 = __importDefault(require("../utils/markdown"));
const fsUtils = __importStar(require("../utils/fs"));
const ext_1 = __importDefault(require("../utils/twing/ext"));
const patch_1 = __importDefault(require("../utils/twing/patch"));
const loader_1 = require("../utils/twing/loader");
const BUILTIN_TEMPLATE_KEY = '__document__';
const renderMarkdown = async (context, projectDir, content, config) => {
    const plugins = await config.getPlugins();
    const loaders = [
        (0, twing_1.createArrayLoader)({
            [BUILTIN_TEMPLATE_KEY]: content,
        }),
    ];
    const shortcodeDir = path_1.default.join(projectDir, 'templates', 'shortcodes');
    if (await fsUtils.exists(shortcodeDir)) {
        loaders.push((0, twing_1.createFilesystemLoader)(new loader_1.FileSystemLoaderFS(shortcodeDir)));
    }
    const loader = (0, twing_1.createChainLoader)(loaders);
    const env = (0, twing_1.createEnvironment)(loader);
    env.addExtension(new ext_1.default(plugins));
    for (const plugin of plugins) {
        for (const ext of plugin.getTemplateExtensions()) {
            env.addExtension(ext);
        }
    }
    (0, patch_1.default)(env);
    const preparedContent = await env.render(BUILTIN_TEMPLATE_KEY, context);
    const mdPlugins = plugins.flatMap((plugin) => plugin.getMarkdownContainers());
    return (0, markdown_1.default)(mdPlugins).render(preparedContent);
};
exports.renderMarkdown = renderMarkdown;
