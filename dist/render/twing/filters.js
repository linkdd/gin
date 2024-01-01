"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdown = void 0;
const twing_1 = require("twing");
const showdown_1 = __importDefault(require("showdown"));
const markdownFilterImpl = async (content) => {
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
    return converter.makeHtml(content.toString());
};
exports.markdown = new twing_1.TwingFilter('markdown', markdownFilterImpl, []);
