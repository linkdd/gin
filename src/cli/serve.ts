import path from 'path'
import chokidar from 'chokidar'

import express from 'express'
import expressWebsocket from 'express-ws'

import { command, number, option } from 'cmd-ts'
import { Directory } from 'cmd-ts/batteries/fs'

import * as cheerio from 'cheerio'

import * as fsUtils from '@/utils/fs'
import { loadConfiguration } from '@/services/config'
import { scanContentDir } from '@/services/content'
import { renderDocument } from '@/services/render'

export default command({
  name: 'serve',
  description: 'Serve current website',
  args: {
    project: option({
      description: "Path to website's source",
      type: Directory,
      long: 'project',
      short: 'p',
      defaultValue: () => process.cwd(),
    }),
    bind: option({
      description: 'Port to bind to',
      type: number,
      long: 'bind',
      short: 'b',
      defaultValue: () => 1515,
    }),
  },
  async handler({ project, bind }) {
    const app = express()
    const ws = expressWebsocket(app)

    const staticDir = path.join(project, 'static')
    if (await fsUtils.exists(staticDir)) {
      app.use(express.static(staticDir))
    }

    ws.app.ws('/__livereload__', (ws) => {
      const watcher = chokidar.watch(project, {
        ignoreInitial: true,
      })
      watcher.on('all', () => {
        ws.send('reload')
      })
      ws.addEventListener('close', () => {
        watcher.close()
      })
    })

    app.get('*', async (req, res, next) => {
      if (!req.path.endsWith('/')) {
        res.redirect(`${req.path}/`)
      } else {
        try {
          const cfg = await loadConfiguration(project)
          cfg.baseURL = '/'
          const contentDir = path.join(project, 'content')
          const urlCache = await scanContentDir(contentDir)
          const page = urlCache[req.path]

          if (page !== undefined) {
            let html = await renderDocument(urlCache, page, project, cfg)
            const $ = cheerio.load(html)
            $('head').append(`
              <script type="application/javascript">
                new WebSocket(\`ws://\${window.location.host}/__livereload__\`)
                  .addEventListener('message', () => {
                    window.location.reload()
                  })
              </script>
            `)
            html = $.html()
            console.log(`GET ${req.path} 200 OK`)
            res.status(200).send(html)
          } else {
            console.error(`GET ${req.path} 404 NOT_FOUND`)
            res.status(404).send('Document not found')
          }
        } catch (err) {
          next(err)
        }
      }
    })

    app.use((err: EvalError, req: express.Request, res: express.Response) => {
      console.error(err)
      res.status(500).send('An error occured')
    })

    await new Promise((resolve) => {
      app.listen(bind, () => {
        resolve(undefined as void)
      })
    })

    console.log(`Listening on http://localhost:${bind}`)
  },
})
