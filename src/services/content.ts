import { promises as fs } from 'fs'
import path from 'path'

import frontmatter from 'gray-matter'

import { Page } from '@/models/page'
import { URLCache } from '@/models/url'

const scanDir = async (
  directory: string,
  parent: string = '',
): Promise<URLCache> => {
  const urlCache: URLCache = {}

  const entries = await fs.readdir(directory, {
    withFileTypes: true,
    recursive: false,
  })
  const directories: string[] = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      directories.push(entry.name)

      const fullPath = path.join(directory, entry.name)
      const localPath = path.join(parent, entry.name)
      const childUrlCache = await scanDir(fullPath, localPath)
      Object.assign(urlCache, childUrlCache)

      let url = localPath.replace(/\\/g, '/').replace(/\.md$/, '')
      if (!url.startsWith('/')) {
        url = `/${url}`
      }
      if (!url.endsWith('/')) {
        url = `${url}/`
      }
      url = url.replace(/\/_index\/$/, '/')

      const section = urlCache[url]
      if (section !== undefined) {
        for (const page of Object.values(childUrlCache)) {
          const isDirectChild =
            page!.url
              .split(url)
              .flatMap((s) => s.split('/'))
              .filter((s) => s !== '').length === 1

          if (isDirectChild) {
            section.children.push(page!)
          }
        }
      }
    }
  }

  const children = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name)
      const localPath = path.join(parent, entry.name)

      if (entry.isFile() && path.extname(entry.name) === '.md') {
        const pageName = path.basename(entry.name, '.md')

        if (
          directories.includes(pageName) &&
          (await fs.stat(path.join(directory, pageName, '_index.md'))).isFile()
        ) {
          return null
        }

        const buf = await fs.readFile(fullPath, 'utf-8')
        const { content, data: pageParams } = frontmatter(buf, {
          language: 'yaml',
        })
        const isSection = entry.name === '_index.md'
        const defaultTitle = isSection
          ? path.basename(parent)
          : path.basename(localPath, '.md')
        const title = pageParams.title ?? defaultTitle

        let url = localPath.replace(/\\/g, '/').replace(/\.md$/, '')
        if (!url.startsWith('/')) {
          url = `/${url}`
        }
        if (!url.endsWith('/')) {
          url = `${url}/`
        }
        url = url.replace(/\/_index\/$/, '/')

        const page: Page = {
          url,
          title,
          children: [],
          isSection,
          isHome: url === '/',
          params: pageParams,
          content,
        }

        return page
      }

      return null
    }),
  )

  for (const child of children) {
    if (child !== null) {
      urlCache[child.url] = child
    }
  }

  return urlCache
}

export const scanContentDir = async (contentDir: string): Promise<URLCache> => {
  const urlCache = await scanDir(contentDir)

  const rootPage = urlCache['/']

  if (rootPage !== undefined) {
    for (const page of Object.values(urlCache)) {
      const isRoot = page!.url === '/'
      const isDirectChild = page!.url.split('/').length === 3

      if (!isRoot && isDirectChild) {
        rootPage.children.push(page!)
      }
    }
  }

  return urlCache
}
