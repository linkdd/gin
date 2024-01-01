import path from 'path'

import * as fsUtils from '../fs'
import { Config } from '../config/model'
import renderDocument from '../render'
import scanContentDir from '../render/page/scan'

interface BuildCommandProps {
  projectDir: string,
  config: Config,
  buildDir: string,
}

const runBuildCommand = async (props: BuildCommandProps) => {
  const staticDir = path.join(props.projectDir, 'static')
  await fsUtils.copyFolderContent(staticDir, props.buildDir)

  const contentDir = path.join(props.projectDir, 'content')
  const urlCache = await scanContentDir(contentDir)

  for (const [url, page] of Object.entries(urlCache)) {
    const html = await renderDocument(urlCache, page!, props.projectDir, props.config)
    const filePath = path.join(props.buildDir, url, 'index.html')
    await fsUtils.mkdir(path.dirname(filePath), { recursive: true })
    await fsUtils.writeFile(filePath, html)
  }
}

export default runBuildCommand
