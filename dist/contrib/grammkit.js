"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = require("../models/plugin");
const twing_1 = require("twing");
// @ts-ignore
const grammkit_1 = __importDefault(require("grammkit"));
// @ts-ignore
const parser_1 = require("pegjs/lib/parser");
const style = `
<style scoped>
svg.railroad-diagram path {
  stroke-width: 3;
  stroke: black;
  fill: none;
}
svg.railroad-diagram text {
  font: bold 14px monospace;
  text-anchor: middle;
  cursor: pointer;
}
svg.railroad-diagram text.label {
  text-anchor: start;
}
svg.railroad-diagram text.comment {
  font: italic 12px monospace;
}
svg.railroad-diagram rect {
  stroke-width: 3;
  stroke: black;
  fill: hsl(120,100%,90%);
}
</style>
`;
// @ts-ignore
const renderDiagram = ({ rule, src }) => `
<div class="grammkit-diagram">
  <div class="grammkit-diagram-title">${rule.name}</div>
  <div class="grammkit-diagram-svg">${grammkit_1.default.diagram(rule)}</div>
  <div class="grammkit-diagram-src">
    <details>
      <summary>Show source</summary>
      <pre><code class="language-text">${src}</code></pre>
    </details>
  </div>
</div>
  `;
class GrammkitPlugin extends plugin_1.GinPlugin {
    getTemplateExtensions() {
        return [
            {
                filters: [
                    (0, twing_1.createFilter)('grammkit', async (context, content) => {
                        const bnf = content.toString();
                        const grammar = (0, parser_1.parse)(bnf);
                        const diagrams = grammar.rules
                            // @ts-ignore
                            .map((rule) => {
                            const start = rule.expression.location.start.offset;
                            const end = rule.expression.location.end.offset;
                            const ruleExpr = bnf
                                .slice(start, end)
                                .split('\n')
                                .map((line) => line.trim())
                                .map((line, idx) => {
                                if (idx > 0) {
                                    return `  ${line}`;
                                }
                                return line;
                            })
                                .join('\n');
                            const src = `${rule.name}\n  = ${ruleExpr}`;
                            return { rule, src };
                        })
                            .map(renderDiagram)
                            .join('');
                        return `<div class="grammkit-diagrams">${style}${diagrams}</div>`;
                    }, [], 
                    // @ts-ignore
                    { isSafe: ['html'] }),
                ],
                functions: [],
                nodeVisitors: [],
                operators: [],
                tagHandlers: [],
                tests: [],
            },
        ];
    }
}
exports.default = new GrammkitPlugin();
