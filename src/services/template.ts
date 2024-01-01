import { promises as fs } from 'fs'
import path from 'path'

import yaml from 'js-yaml'

import * as fsUtils from '@/utils/fs'
import { Config } from '@/models/config'
import { Page } from '@/models/page'
import { URLCache } from '@/models/url'
import {
  TemplateData,
  PageTemplateData,
  PagesTemplateData,
} from '@/models/template'

import {
  TwingEnvironment,
  createEnvironment,
  createFilesystemLoader,
  TwingTemplate,
} from 'twing'

import GinCoreExtension from '@/utils/twing/ext'
import twingPatch from '@/utils/twing/patch'
import { FileSystemLoaderFS } from '@/utils/twing/loader'

const getTemplateEnvironment = async (
  projectDir: string,
  config: Config,
): Promise<TwingEnvironment> => {
  const plugins = await config.getPlugins()

  const templateDir = path.join(projectDir, 'templates')

  const loader = createFilesystemLoader(new FileSystemLoaderFS(templateDir))
  const env = createEnvironment(loader)
  env.addExtension(new GinCoreExtension(plugins))

  for (const plugin of plugins) {
    for (const ext of plugin.getTemplateExtensions()) {
      env.addExtension(ext)
    }
  }

  twingPatch(env)

  return env
}

export const getPageTemplateData = (page: Page): PageTemplateData => {
  return {
    url: page.url,
    title: page.title,
    params: page.params,
    isHome: page.isHome,
    isSection: page.isSection,
    children: page.children
      .sort((a, b) => {
        const aWeight = (a.params.weight as number) ?? 0
        const bWeight = (b.params.weight as number) ?? 0
        return aWeight - bWeight
      })
      .map(getPageTemplateData),
  }
}

export const getPagesTemplateData = (urlCache: URLCache): PagesTemplateData => {
  const pages: PagesTemplateData = {}

  for (const [url, page] of Object.entries(urlCache)) {
    pages[url] = getPageTemplateData(page!)
  }

  return pages
}

export const getTemplateData = async (
  page: Page,
  urlCache: URLCache,
  projectDir: string,
  config: Config,
): Promise<TemplateData> => {
  const dataDir = path.join(projectDir, 'data')
  const data = {}

  type Metadata = unknown
  type Scope = { [key: string]: Scope | Metadata }

  const loadDir = async (scope: Scope, dir: string) => {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subScope = {}
        await loadDir(subScope, path.join(dir, entry.name))
        scope[entry.name] = subScope
      } else if (
        entry.isFile() &&
        ['.yml', '.yaml'].includes(path.extname(entry.name).toLowerCase())
      ) {
        const content = await fs.readFile(path.join(dir, entry.name), 'utf-8')
        const data = yaml.load(content) || {}

        const key = path.basename(entry.name, path.extname(entry.name))
        scope[key] = data
      }
    }
  }

  if (await fsUtils.exists(dataDir)) {
    await loadDir(data, dataDir)
  }

  return {
    page: getPageTemplateData(page),
    site: {
      title: config.title,
      description: config.description,
      languageCode: config.languageCode,
      baseURL: config.baseURL,
      pages: getPagesTemplateData(urlCache),
      params: config.params ?? {},
      data,
    },
  }
}

export const getTemplate = async (
  page: Page,
  projectDir: string,
  config: Config,
): Promise<TwingTemplate> => {
  const layout = (page.params.layout as string) ?? '_default'
  const env = await getTemplateEnvironment(projectDir, config)

  if (page.isHome) {
    return await env.loadTemplate(`layouts/${layout}/home.html`)
  } else if (page.isSection) {
    return await env.loadTemplate(`layouts/${layout}/section.html`)
  }

  return await env.loadTemplate(`layouts/${layout}/single.html`)
}
