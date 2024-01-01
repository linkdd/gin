"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const twing_1 = require("twing");
const filters_1 = require("../twing/filters");
const getTemplateEnvironment = (projectDir) => {
    const templateDir = path_1.default.join(projectDir, 'templates');
    const loader = new twing_1.TwingLoaderFilesystem(templateDir);
    const env = new twing_1.TwingEnvironment(loader);
    env.addFilter(filters_1.markdown);
    return env;
};
exports.default = getTemplateEnvironment;
