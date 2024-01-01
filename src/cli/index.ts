import { binary, subcommands } from 'cmd-ts'

import initCommand from '@/cli/init'
import buildCommand from '@/cli/build'
import serveCommand from '@/cli/serve'

export default binary(
  subcommands({
    name: 'gin',
    version: '0.1.0',
    description: 'Static website generator',
    cmds: {
      init: initCommand,
      build: buildCommand,
      serve: serveCommand,
    },
  }),
)
