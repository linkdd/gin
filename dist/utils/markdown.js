"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const markdown_it_1 = __importDefault(require("markdown-it"));
const markdown_it_abbr_1 = __importDefault(require("markdown-it-abbr"));
const markdown_it_anchor_1 = __importDefault(require("markdown-it-anchor"));
const markdown_it_attrs_1 = __importDefault(require("markdown-it-attrs"));
const markdown_it_container_1 = __importDefault(require("markdown-it-container"));
const markdown_it_deflist_1 = __importDefault(require("markdown-it-deflist"));
const markdown_it_emoji_1 = require("markdown-it-emoji");
const markdown_it_footnote_1 = __importDefault(require("markdown-it-footnote"));
const markdown_it_imsize_1 = __importDefault(require("markdown-it-imsize"));
const markdown_it_ins_1 = __importDefault(require("markdown-it-ins"));
const markdown_it_mark_1 = __importDefault(require("markdown-it-mark"));
const markdown_it_mermaid_1 = __importDefault(require("markdown-it-mermaid"));
const markdown_it_multimd_table_1 = __importDefault(require("markdown-it-multimd-table"));
const markdown_it_sub_1 = __importDefault(require("markdown-it-sub"));
const markdown_it_sup_1 = __importDefault(require("markdown-it-sup"));
const markdown_it_table_of_contents_1 = __importDefault(require("markdown-it-table-of-contents"));
const markdown_it_task_lists_1 = __importDefault(require("markdown-it-task-lists"));
const markdown_it_wikilinks_1 = __importDefault(require("markdown-it-wikilinks"));
const mdit = new markdown_it_1.default({
    html: true,
    linkify: true,
});
mdit.use(markdown_it_abbr_1.default);
mdit.use(markdown_it_anchor_1.default);
mdit.use(markdown_it_attrs_1.default);
mdit.use(markdown_it_deflist_1.default);
mdit.use(markdown_it_emoji_1.full);
mdit.use(markdown_it_footnote_1.default);
mdit.use(markdown_it_imsize_1.default);
mdit.use(markdown_it_ins_1.default);
mdit.use(markdown_it_mark_1.default);
mdit.use(markdown_it_mermaid_1.default);
mdit.use(markdown_it_multimd_table_1.default, {
    multiline: true,
    rowspan: true,
    headerless: true,
    multibody: true,
    autolabel: true,
});
mdit.use(markdown_it_sub_1.default);
mdit.use(markdown_it_sup_1.default);
mdit.use(markdown_it_table_of_contents_1.default);
mdit.use(markdown_it_task_lists_1.default);
mdit.use((0, markdown_it_wikilinks_1.default)({
    makeAllLinksAbsolute: true,
    uriSuffix: '',
}));
exports.default = (plugins) => {
    for (const plugin of plugins) {
        mdit.use(markdown_it_container_1.default, plugin.name, {
            validate: (params) => plugin.validate(params),
            render: (tokens, idx) => plugin.render(tokens, idx),
        });
    }
    return mdit;
};
