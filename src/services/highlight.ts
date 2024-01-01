import path from 'path'

import * as cheerio from 'cheerio'
import shiki from 'shiki'

import { Config } from '@/models/config'

export const highlightCode = async (
  html: string,
  projectDir: string,
  config: Config,
): Promise<string> => {
  const themePath = config.highlighter?.themePath

  const theme = await (async () => {
    if (themePath !== undefined) {
      return await shiki.loadTheme(path.join(projectDir, themePath))
    }

    return config.highlighter?.theme ?? 'monokai'
  })()

  const extraLanguages = config.highlighter?.extraLanguages ?? []
  const highlighter = await shiki.getHighlighter({ theme })

  for (const { grammarPath, ...langConfig } of extraLanguages) {
    const fullPath = path.join(projectDir, grammarPath)

    await highlighter.loadLanguage({ path: fullPath, ...langConfig })
  }

  const $ = cheerio.load(`<body>${html}</body>`)

  $('pre code').each((_index, element) => {
    const classes =
      $(element)
        .attr('class')
        ?.split(' ')
        .filter((cls) => cls.startsWith('language-')) ?? []
    if (classes.length > 0) {
      const [lang] = classes
      const tokens = highlighter.codeToThemedTokens(
        $(element).text(),
        lang.slice('language-'.length),
      )
      const code = shiki.renderToHtml(tokens, {
        elements: {
          pre({ children }) {
            return `${children}`
          },
          code({ children }) {
            return `${children}`
          },
        },
      })
      $(element).html(code)

      const bg = highlighter.getBackgroundColor()
      const fg = highlighter.getForegroundColor()
      $(element)
        .parent()
        .attr('style', `background-color: ${bg}; color: ${fg};`)
    }
  })

  const highlighted = $('body').html()
  return highlighted!
}
