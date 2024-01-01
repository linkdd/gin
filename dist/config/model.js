"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.HighlighterConfig = exports.HighlighterLanguageConfig = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
require("reflect-metadata");
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
