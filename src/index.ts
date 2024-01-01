import path from 'path'

import { program } from '@commander-js/extra-typings'

import runBuildCommand from './cli/build'
import runServeCommand from './cli/serve'
import loadConfiguration from './config/load'

export const main = async () => {
  program
    .name('gensite')
    .description('Static website generator')
    .version('0.1.0')
    .option('-p, --project <path>', 'Path to website\'s folder', process.cwd())

  program.command('build')
    .description('Render website to target directory')
    .option('-o, --output <path>', 'Path to build directory', undefined as string | undefined)
    .action(async (localOpts, cmd) => {
      const globalOpts = cmd.parent!.opts()
      const projectDir = path.resolve(globalOpts.project as string)
      const buildDir = localOpts.output ?? path.join(projectDir, 'public')

      const res = await loadConfiguration(projectDir)
      if (res.isErr()) {
        process.exit(1)
      }
      const config = res.unwrap()

      await runBuildCommand({
        projectDir,
        config,
        buildDir,
      })
    })

  program.command('serve')
    .description('Run local HTTP server and render website on demand')
    .option('-b, --bind <port>', 'port to listen to', '1515')
    .action(async (localOpts, cmd) => {
      const globalOpts = cmd.parent!.opts()
      const projectDir = path.resolve(globalOpts.project as string)
      const bindPort = parseInt(localOpts.bind)

      const res = await loadConfiguration(projectDir)
      if (res.isErr()) {
        process.exit(1)
      }
      const config = res.unwrap()
      config.baseURL = '/'

      await runServeCommand({
        projectDir,
        config,
        bindPort,
      })
    })

  await program.parseAsync()
}
