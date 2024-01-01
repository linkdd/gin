import { Config } from '@/models/config'
import { Page } from '@/models/page'
import { URLCache } from '@/models/url'

import { getTemplateData, getTemplate } from '@/services/template'
import { renderMarkdown } from '@/services/markdown'
import { highlightCode } from '@/services/highlight'

export const renderDocument = async (
  urlCache: URLCache,
  page: Page,
  projectDir: string,
  config: Config,
): Promise<string> => {
  const context = await getTemplateData(page, urlCache, projectDir, config)
  const template = await getTemplate(page, projectDir, config)

  const html = await renderMarkdown(context, projectDir, page.content, config)
  const content = await highlightCode(html, projectDir, config)

  return await template.render({ content, ...context })
}
