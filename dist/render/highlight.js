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
const cheerio = __importStar(require("cheerio"));
const shiki_1 = __importDefault(require("shiki"));
const highlightCode = async (html, projectDir, config) => {
    const themePath = config.highlighter?.themePath;
    const theme = await (async () => {
        if (themePath !== undefined) {
            return await shiki_1.default.loadTheme(path_1.default.join(projectDir, themePath));
        }
        return config.highlighter?.theme ?? 'monokai';
    })();
    const extraLanguages = config.highlighter?.extraLanguages ?? [];
    const highlighter = await shiki_1.default.getHighlighter({ theme });
    for (const { grammarPath, ...langConfig } of extraLanguages) {
        const fullPath = path_1.default.join(projectDir, grammarPath);
        await highlighter.loadLanguage({ path: fullPath, ...langConfig });
    }
    const $ = cheerio.load(html);
    $('pre code').each((_index, element) => {
        const classes = $(element).attr('class')?.split(' ').filter(cls => cls.startsWith('language-')) ?? [];
        if (classes.length > 0) {
            const [lang] = classes;
            const tokens = highlighter.codeToThemedTokens($(element).text(), lang.slice('language-'.length));
            const code = shiki_1.default.renderToHtml(tokens, {
                elements: {
                    pre({ children }) {
                        return `${children}`;
                    },
                    code({ children }) {
                        return `${children}`;
                    }
                }
            });
            $(element).html(code);
            const bg = highlighter.getBackgroundColor();
            const fg = highlighter.getForegroundColor();
            $(element).parent().attr('style', `background-color: ${bg}; color: ${fg};`);
        }
    });
    const highlighted = $('body').html();
    return highlighted;
};
exports.default = highlightCode;
