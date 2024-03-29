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
exports.loadConfiguration = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const fsUtils = __importStar(require("../utils/fs"));
const config_1 = require("../models/config");
const loadConfiguration = async (projectDir) => {
    const filenames = ['config.yaml', 'config.yml'];
    for (const filename of filenames) {
        const configPath = path_1.default.join(projectDir, filename);
        if (await fsUtils.exists(configPath)) {
            const buf = await fs_1.promises.readFile(configPath, 'utf-8');
            const doc = js_yaml_1.default.load(buf) || {};
            const cfg = (0, class_transformer_1.plainToClass)(config_1.Config, doc);
            const errors = await (0, class_validator_1.validate)(cfg, { whitelist: true });
            if (errors.length > 0) {
                let msg = 'Invalid configuration file:\n';
                for (const error of errors) {
                    msg += `${error.toString()}\n`;
                }
                throw new Error(msg);
            }
            return cfg;
        }
    }
    throw new Error('Could not find configuration file');
};
exports.loadConfiguration = loadConfiguration;
