"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.endswith = exports.startswith = exports.markdown = void 0;
const twing_1 = require("twing");
const markdown_1 = __importDefault(require("../../utils/markdown"));
const markdown = (plugins) => (0, twing_1.createFilter)('markdown', async (context, content) => {
    const mdPlugins = plugins.flatMap((plugin) => plugin.getMarkdownContainers());
    return (0, markdown_1.default)(mdPlugins).render(content.toString());
}, []);
exports.markdown = markdown;
const startswith = (_plugins) => (0, twing_1.createFilter)('startswith', async (context, content, pattern) => {
    return content.startsWith(pattern);
}, []);
exports.startswith = startswith;
const endswith = (_plugins) => (0, twing_1.createFilter)('endswith', async (context, content, pattern) => {
    return content.endsWith(pattern);
}, []);
exports.endswith = endswith;
