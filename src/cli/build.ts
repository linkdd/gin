import path from 'path'
import { promises as fs } from 'fs'

import { command, option } from 'cmd-ts'
import { Directory } from 'cmd-ts/batteries/fs'

import * as fsUtils from '@/utils/fs'
import { loadConfiguration } from '@/services/config'
import { scanContentDir } from '@/services/content'
import { renderDocument } from '@/services/render'

export default command({
  name: 'build',
  description: "Generate website's HTML to target directory",
  args: {
    project: option({
      description: "Path to website's source",
      type: Directory,
      long: 'project',
      short: 'p',
      defaultValue: () => process.cwd(),
    }),
    output: option({
      description: 'Path to directory where to generate the public/ folder',
      type: Directory,
      long: 'output',
      short: 'o',
      defaultValue: () => process.cwd(),
    }),
  },
  async handler({ project, output }) {
    const cfg = await loadConfiguration(project)
    const targetDir = path.join(output, 'public')

    try {
      await fs.mkdir(targetDir, { recursive: true })

      const staticDir = path.join(project, 'static')
      if (await fsUtils.exists(staticDir)) {
        await fsUtils.copyDir(staticDir, targetDir)
      }

      const contentDir = path.join(project, 'content')
      const urlCache = await scanContentDir(contentDir)

      for (const [pageUrl, page] of Object.entries(urlCache)) {
        if (page !== undefined) {
          const pagePath = path.join(targetDir, pageUrl)
          const docPath = path.join(pagePath, 'index.html')

          await fs.mkdir(pagePath, { recursive: true })

          const html = await renderDocument(urlCache, page, project, cfg)
          await fs.writeFile(docPath, html)
        }
      }
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  },
})
