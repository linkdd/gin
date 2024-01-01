"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const path_1 = __importDefault(require("path"));
const extra_typings_1 = require("@commander-js/extra-typings");
const build_1 = __importDefault(require("./cli/build"));
const serve_1 = __importDefault(require("./cli/serve"));
const load_1 = __importDefault(require("./config/load"));
const main = async () => {
    extra_typings_1.program
        .name('gensite')
        .description('Static website generator')
        .version('0.1.0')
        .option('-p, --project <path>', 'Path to website\'s folder', process.cwd());
    extra_typings_1.program.command('build')
        .description('Render website to target directory')
        .option('-o, --output <path>', 'Path to build directory', undefined)
        .action(async (localOpts, cmd) => {
        const globalOpts = cmd.parent.opts();
        const projectDir = path_1.default.resolve(globalOpts.project);
        const buildDir = localOpts.output ?? path_1.default.join(projectDir, 'public');
        const res = await (0, load_1.default)(projectDir);
        if (res.isErr()) {
            process.exit(1);
        }
        const config = res.unwrap();
        await (0, build_1.default)({
            projectDir,
            config,
            buildDir,
        });
    });
    extra_typings_1.program.command('serve')
        .description('Run local HTTP server and render website on demand')
        .option('-b, --bind <port>', 'port to listen to', '1515')
        .action(async (localOpts, cmd) => {
        const globalOpts = cmd.parent.opts();
        const projectDir = path_1.default.resolve(globalOpts.project);
        const bindPort = parseInt(localOpts.bind);
        const res = await (0, load_1.default)(projectDir);
        if (res.isErr()) {
            process.exit(1);
        }
        const config = res.unwrap();
        config.baseURL = '/';
        await (0, serve_1.default)({
            projectDir,
            config,
            bindPort,
        });
    });
    await extra_typings_1.program.parseAsync();
};
exports.main = main;
