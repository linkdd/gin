"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const twing_1 = require("twing");
const showdown_1 = __importDefault(require("showdown"));
const filters_1 = require("./twing/filters");
const BUILTIN_TEMPLATE_KEY = '__document__';
const renderMarkdown = async (context, projectDir, content) => {
    const shortcodeDir = path_1.default.join(projectDir, 'templates', 'shortcodes');
    const shortcodeLoader = new twing_1.TwingLoaderFilesystem(shortcodeDir);
    const builtinLoader = new twing_1.TwingLoaderArray({
        [BUILTIN_TEMPLATE_KEY]: content,
    });
    const loader = new twing_1.TwingLoaderChain([builtinLoader, shortcodeLoader]);
    const env = new twing_1.TwingEnvironment(loader);
    env.addFilter(filters_1.markdown);
    const preparedContent = await env.render(BUILTIN_TEMPLATE_KEY, context);
    const converter = new showdown_1.default.Converter({
        omitExtraWLInCodeBlocks: true,
        ghCodeBlocks: true,
        ghCompatibleHeaderId: true,
        parseImgDimensions: true,
        strikethrough: true,
        tables: true,
        tasklists: true,
        emoji: true,
        underline: true,
    });
    return converter.makeHtml(preparedContent);
};
exports.default = renderMarkdown;
