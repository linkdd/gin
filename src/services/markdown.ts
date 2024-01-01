import path from 'path'

import {
  TwingLoader,
  createEnvironment,
  createFilesystemLoader,
  createArrayLoader,
  createChainLoader,
} from 'twing'

import mdit from '@/utils/markdown'
import * as fsUtils from '@/utils/fs'
import GinCoreExtension from '@/utils/twing/ext'
import twingPatch from '@/utils/twing/patch'
import { FileSystemLoaderFS } from '@/utils/twing/loader'
import { TemplateData } from '@/models/template'
import { Config } from '@/models/config'

const BUILTIN_TEMPLATE_KEY = '__document__'

export const renderMarkdown = async (
  context: TemplateData,
  projectDir: string,
  content: string,
  config: Config,
): Promise<string> => {
  const plugins = await config.getPlugins()

  const loaders: TwingLoader[] = [
    createArrayLoader({
      [BUILTIN_TEMPLATE_KEY]: content,
    }),
  ]

  const shortcodeDir = path.join(projectDir, 'templates', 'shortcodes')
  if (await fsUtils.exists(shortcodeDir)) {
    loaders.push(createFilesystemLoader(new FileSystemLoaderFS(shortcodeDir)))
  }

  const loader = createChainLoader(loaders)
  const env = createEnvironment(loader)
  env.addExtension(new GinCoreExtension(plugins))

  for (const plugin of plugins) {
    for (const ext of plugin.getTemplateExtensions()) {
      env.addExtension(ext)
    }
  }

  twingPatch(env)

  const preparedContent = await env.render(BUILTIN_TEMPLATE_KEY, context)

  const mdPlugins = plugins.flatMap((plugin) => plugin.getMarkdownContainers())
  return mdit(mdPlugins).render(preparedContent)
}
