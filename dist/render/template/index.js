"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("./env"));
const getTemplate = async (page, projectDir) => {
    const layout = page.params.layout || '_default';
    const env = (0, env_1.default)(projectDir);
    if (page.isHome) {
        return await env.load(`layouts/${layout}/home.html`);
    }
    else if (page.isSection) {
        return await env.load(`layouts/${layout}/section.html`);
    }
    return await env.load(`layouts/${layout}/single.html`);
};
exports.default = getTemplate;
