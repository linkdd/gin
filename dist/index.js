"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_ts_1 = require("cmd-ts");
const cli_1 = __importDefault(require("./cli"));
const main = async () => {
    await (0, cmd_ts_1.run)(cli_1.default, process.argv);
};
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
