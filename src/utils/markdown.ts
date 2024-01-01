import { MarkdownContainerPlugin } from '@/models/plugin'

import MarkdownIt, { Token } from 'markdown-it'
import mditExtAbbr from 'markdown-it-abbr'
import mditExtAnchor from 'markdown-it-anchor'
import mditExtAttrs from 'markdown-it-attrs'
import mditExtContainer from 'markdown-it-container'
import mditExtDeflist from 'markdown-it-deflist'
import { full as mditExtEmoji } from 'markdown-it-emoji'
import mditExtFootnote from 'markdown-it-footnote'
import mditExtImageSize from 'markdown-it-imsize'
import mditExtIns from 'markdown-it-ins'
import mditExtMark from 'markdown-it-mark'
import mditExtMermaid from 'markdown-it-mermaid'
import mditExtMultimdTable from 'markdown-it-multimd-table'
import mditExtSub from 'markdown-it-sub'
import mditExtSup from 'markdown-it-sup'
import mditExtTableOfContents from 'markdown-it-table-of-contents'
import mditExtTaskLists from 'markdown-it-task-lists'
import mditExtWikilinks from 'markdown-it-wikilinks'

const mdit = new MarkdownIt({
  html: true,
  linkify: true,
})

mdit.use(mditExtAbbr)
mdit.use(mditExtAnchor)
mdit.use(mditExtAttrs)
mdit.use(mditExtDeflist)
mdit.use(mditExtEmoji)
mdit.use(mditExtFootnote)
mdit.use(mditExtImageSize)
mdit.use(mditExtIns)
mdit.use(mditExtMark)
mdit.use(mditExtMermaid)
mdit.use(mditExtMultimdTable, {
  multiline: true,
  rowspan: true,
  headerless: true,
  multibody: true,
  autolabel: true,
})
mdit.use(mditExtSub)
mdit.use(mditExtSup)
mdit.use(mditExtTableOfContents)
mdit.use(mditExtTaskLists)
mdit.use(
  mditExtWikilinks({
    makeAllLinksAbsolute: true,
    uriSuffix: '',
  }),
)

export default (plugins: MarkdownContainerPlugin[]) => {
  for (const plugin of plugins) {
    mdit.use(mditExtContainer, plugin.name, {
      validate: (params: string) => plugin.validate(params),
      render: (tokens: Token[], idx: number) => plugin.render(tokens, idx),
    })
  }

  return mdit
}
