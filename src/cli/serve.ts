import path from 'path'

import express from 'express'

import * as fsUtils from '../fs'
import { Config } from '../config/model'
import renderDocument from '../render'
import scanContentDir from '../render/page/scan'

interface ServeCommandProps {
  projectDir: string,
  config: Config,
  bindPort: number,
}

const runServeCommand = async (props: ServeCommandProps) => {
  const app = express()

  const staticDir = path.join(props.projectDir, 'static')
  if (await fsUtils.exists(staticDir)) {
    app.use(express.static(staticDir))
  }

  app.get('*', async (req, res, next) => {
    if (!req.path.endsWith('/')) {
      res.redirect(`${req.path}/`)
    }
    else {
      try {
        const contentDir = path.join(props.projectDir, 'content')
        const contentPath = req.path.slice(1, req.path.length - 1)

        const urlCache = await scanContentDir(contentDir)
        const page = urlCache[req.path]

        if (page !== undefined) {
          const html = await renderDocument(urlCache, page, props.projectDir, props.config)
          console.error(`GET ${req.path} 200 OK`)
          res.status(200).send(html)
        }
        else {
          console.error(`GET ${req.path} 404 NOT_FOUND`)
          res.status(404).send('Document not found')
        }
      }
      catch (err) {
        next(err)
      }
    }
  })

  app.use((err: Error, req: express.Request, res: express.Response) => {
    console.error(err)
    res.status(500).send('An error occured')
  })

  await new Promise(resolve => {
    app.listen(props.bindPort, () => { resolve(undefined as void) })
  })

  console.log(`Listening on http://localhost:${props.bindPort}`)
}

export default runServeCommand
