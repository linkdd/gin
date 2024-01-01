import { promises as fs } from 'fs'
import path from 'path'

import yaml from 'js-yaml'

import { Config } from '../../config/model'
import { Page, URLCache } from '../page/model'

export interface PageTemplateData {
  url: string,
  title: string,
  params: { [key: string]: any },
  children: PageTemplateData[]
}

export interface PagesTemplateData {
  [url: string]: PageTemplateData | undefined
}

export interface SiteTemplateData {
  title: string,
  description?: string,
  languageCode?: string,
  baseURL?: string,
  pages: PagesTemplateData,
  params: { [key: string]: any },
  data: any,
}

export interface TemplateData {
  page: PageTemplateData,
  site: SiteTemplateData,
}

export const getPageTemplateData = (page: Page): PageTemplateData => {
  return {
    url: page.url,
    title: page.title,
    params: page.params,
    children: page.children.map(getPageTemplateData),
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

  const loadDir = async (scope: any, dir: string) => {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subScope = {}
        await loadDir(subScope, path.join(dir, entry.name))
        scope[entry.name] = subScope
      }
      else if (entry.isFile() && ['.yml', '.yaml'].includes(path.extname(entry.name).toLowerCase())) {
        const content = await fs.readFile(path.join(dir, entry.name), 'utf-8')
        const data = yaml.load(content) || {}

        const key = path.basename(entry.name, path.extname(entry.name))
        scope[key] = data
      }
    }
  }

  await loadDir(data, dataDir)

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
    }
  }
}

