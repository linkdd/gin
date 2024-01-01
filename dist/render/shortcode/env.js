"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const twing_1 = require("twing");
const getTemplateEnvironment = (projectDir) => {
    const templateDir = path_1.default.join(projectDir, 'templates', 'shortcodes');
    const loader = new twing_1.TwingLoaderFilesystem(templateDir);
    return new twing_1.TwingEnvironment(loader);
};
exports.default = getTemplateEnvironment;
