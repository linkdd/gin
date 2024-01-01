"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderDocument = void 0;
const template_1 = require("../services/template");
const markdown_1 = require("../services/markdown");
const highlight_1 = require("../services/highlight");
const renderDocument = async (urlCache, page, projectDir, config) => {
    const context = await (0, template_1.getTemplateData)(page, urlCache, projectDir, config);
    const template = await (0, template_1.getTemplate)(page, projectDir, config);
    const html = await (0, markdown_1.renderMarkdown)(context, projectDir, page.content, config);
    const content = await (0, highlight_1.highlightCode)(html, projectDir, config);
    return await template.render({ content, ...context });
};
exports.renderDocument = renderDocument;
