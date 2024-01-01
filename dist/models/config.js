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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.HighlighterConfig = exports.HighlighterLanguageConfig = void 0;
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const plugin_1 = require("../models/plugin");
class HighlighterLanguageConfig {
    id;
    scopeName;
    aliases;
    grammarPath;
}
exports.HighlighterLanguageConfig = HighlighterLanguageConfig;
__decorate([
    (0, class_validator_1.IsString)()
], HighlighterLanguageConfig.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)()
], HighlighterLanguageConfig.prototype, "scopeName", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsOptional)()
], HighlighterLanguageConfig.prototype, "aliases", void 0);
__decorate([
    (0, class_validator_1.IsString)()
], HighlighterLanguageConfig.prototype, "grammarPath", void 0);
class HighlighterConfig {
    theme;
    themePath;
    extraLanguages;
}
exports.HighlighterConfig = HighlighterConfig;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)()
], HighlighterConfig.prototype, "theme", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)()
], HighlighterConfig.prototype, "themePath", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HighlighterLanguageConfig),
    (0, class_validator_1.IsOptional)()
], HighlighterConfig.prototype, "extraLanguages", void 0);
class Config {
    title;
    description;
    languageCode;
    baseURL;
    params;
    highlighter;
    plugins;
    async getPluginModules() {
        return await Promise.all((this.plugins ?? []).map(async (pluginName) => await Promise.resolve(`${pluginName}`).then(s => __importStar(require(s)))));
    }
    async getPlugins() {
        return (await this.getPluginModules())
            .filter((module) => module.default instanceof plugin_1.GinPlugin)
            .map((module) => module.default);
    }
}
exports.Config = Config;
__decorate([
    (0, class_validator_1.IsString)()
], Config.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)()
], Config.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)()
], Config.prototype, "languageCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)()
], Config.prototype, "baseURL", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)()
], Config.prototype, "params", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HighlighterConfig),
    (0, class_validator_1.IsOptional)()
], Config.prototype, "highlighter", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)()
], Config.prototype, "plugins", void 0);
