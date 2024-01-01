import path from 'path'

import { TwingEnvironment, TwingLoaderFilesystem } from 'twing'

import { markdown } from '../twing/filters'

const getTemplateEnvironment = (projectDir: string): TwingEnvironment => {
  const templateDir = path.join(projectDir, 'templates')

  const loader = new TwingLoaderFilesystem(templateDir)
  const env = new TwingEnvironment(loader)
  env.addFilter(markdown)

  return env
}

export default getTemplateEnvironment
