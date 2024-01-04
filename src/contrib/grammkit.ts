import { GinPlugin } from '@/models/plugin'
import {
  TwingExecutionContext,
  TwingExtension,
  TwingMarkup,
  createFilter,
} from 'twing'

// @ts-ignore
import grammkit from 'grammkit'
// @ts-ignore
import { parse } from 'pegjs/lib/parser'

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
`

// @ts-ignore
const renderDiagram = ({ rule, src }) =>
  `
<div class="grammkit-diagram">
  <div class="grammkit-diagram-title">${rule.name}</div>
  <div class="grammkit-diagram-svg">${grammkit.diagram(rule)}</div>
  <div class="grammkit-diagram-src">
    <details>
      <summary>Show source</summary>
      <pre><code class="language-text">${src}</code></pre>
    </details>
  </div>
</div>
  `

class GrammkitPlugin extends GinPlugin {
  getTemplateExtensions(): TwingExtension[] {
    return [
      {
        filters: [
          createFilter(
            'grammkit',
            async (
              context: TwingExecutionContext,
              content: TwingMarkup,
            ): Promise<string> => {
              const bnf = content.toString()
              const grammar = parse(bnf)
              const diagrams = grammar.rules
                // @ts-ignore
                .map((rule) => {
                  const start = rule.expression.location.start.offset
                  const end = rule.expression.location.end.offset
                  const ruleExpr = bnf
                    .slice(start, end)
                    .split('\n')
                    .map((line: string) => line.trim())
                    .map((line: string, idx: number) => {
                      if (idx > 0) {
                        return `  ${line}`
                      }

                      return line
                    })
                    .join('\n')

                  const src = `${rule.name}\n  = ${ruleExpr}`

                  return { rule, src }
                })
                .map(renderDiagram)
                .join('')

              return `<div class="grammkit-diagrams">${style}${diagrams}</div>`
            },
            [],
            // @ts-ignore
            { isSafe: ['html'] },
          ),
        ],
        functions: [],
        nodeVisitors: [],
        operators: [],
        tagHandlers: [],
        tests: [],
      },
    ]
  }
}

export default new GrammkitPlugin()
