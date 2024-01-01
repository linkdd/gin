import { TwingFilter, TwingMarkup } from 'twing'
import showdown from 'showdown'

const markdownFilterImpl = async (content: TwingMarkup): Promise<string> => {
  const converter = new showdown.Converter({
    omitExtraWLInCodeBlocks: true,
    ghCodeBlocks: true,
    ghCompatibleHeaderId: true,
    parseImgDimensions: true,
    strikethrough: true,
    tables: true,
    tasklists: true,
    emoji: true,
    underline: true,
  })

  return converter.makeHtml(content.toString())
}
export const markdown = new TwingFilter('markdown', markdownFilterImpl, [])
