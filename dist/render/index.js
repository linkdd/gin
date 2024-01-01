"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./template/model");
const template_1 = __importDefault(require("./template"));
const markdown_1 = __importDefault(require("./markdown"));
const highlight_1 = __importDefault(require("./highlight"));
const renderDocument = async (urlCache, page, projectDir, config) => {
    const context = await (0, model_1.getTemplateData)(page, urlCache, projectDir, config);
    const template = await (0, template_1.default)(page, projectDir);
    const html = await (0, markdown_1.default)(context, projectDir, page.content);
    const content = await (0, highlight_1.default)(html, projectDir, config);
    return await template.render({ content, ...context });
};
exports.default = renderDocument;
