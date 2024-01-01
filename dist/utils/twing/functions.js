"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mermaid = void 0;
const mermaid_1 = require("../../utils/mermaid");
const mermaid = (_plugins) => new twing_1.TwingFunction('mermaid', async (url) => {
    return `${(0, mermaid_1.mermaidCss)()}\n${(0, mermaid_1.mermaidJs)(url)}`;
}, [], { is_safe: ['html'] });
exports.mermaid = mermaid;
