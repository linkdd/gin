import path from 'path'

import { TwingEnvironment, TwingLoaderFilesystem, TwingLoaderArray, TwingLoaderChain } from 'twing'
import showdown from 'showdown'

import { markdown } from './twing/filters'
import { TemplateData } from './template/model'

const BUILTIN_TEMPLATE_KEY = '__document__'

const renderMarkdown = async (context: TemplateData, projectDir: string, content: string): Promise<string> => {
  const shortcodeDir = path.join(projectDir, 'templates', 'shortcodes')
  const shortcodeLoader = new TwingLoaderFilesystem(shortcodeDir)

  const builtinLoader = new TwingLoaderArray({
    [BUILTIN_TEMPLATE_KEY]: content,
  })

  const loader = new TwingLoaderChain([builtinLoader, shortcodeLoader])

  const env = new TwingEnvironment(loader)
  env.addFilter(markdown)
  const preparedContent = await env.render(BUILTIN_TEMPLATE_KEY, context)

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

  return converter.makeHtml(preparedContent)
}

export default renderMarkdown
