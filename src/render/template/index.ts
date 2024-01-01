import { TwingTemplate } from 'twing'

import getTemplateEnvironment from './env'
import { Page } from '../page/model'

const getTemplate = async (page: Page, projectDir: string): Promise<TwingTemplate> => {
  const layout = (page.params.layout as string) || '_default'
  const env = getTemplateEnvironment(projectDir)

  if (page.isHome) {
    return await env.load(`layouts/${layout}/home.html`)
  }
  else if (page.isSection) {
    return await env.load(`layouts/${layout}/section.html`)
  }

  return await env.load(`layouts/${layout}/single.html`)
}

export default getTemplate
