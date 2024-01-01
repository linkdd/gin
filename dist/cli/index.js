"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_ts_1 = require("cmd-ts");
const init_1 = __importDefault(require("../cli/init"));
const build_1 = __importDefault(require("../cli/build"));
const serve_1 = __importDefault(require("../cli/serve"));
exports.default = (0, cmd_ts_1.binary)((0, cmd_ts_1.subcommands)({
    name: 'gin',
    version: '0.1.0',
    description: 'Static website generator',
    cmds: {
        init: init_1.default,
        build: build_1.default,
        serve: serve_1.default,
    },
}));
