import { Config } from '../config/model'
import { Page, URLCache } from './page/model'
import { getTemplateData } from './template/model'
import getTemplate from './template'

import renderMarkdown from './markdown'
import highlightCode from './highlight'

const renderDocument = async (
  urlCache: URLCache,
  page: Page,
  projectDir: string,
  config: Config,
): Promise<string> => {
  const context = await getTemplateData(page, urlCache, projectDir, config)
  const template = await getTemplate(page, projectDir)

  const html = await renderMarkdown(context, projectDir, page.content)
  const content = await highlightCode(html, projectDir, config)

  return await template.render({ content, ...context })
}

export default renderDocument
