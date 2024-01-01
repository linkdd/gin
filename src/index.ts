import { run } from 'cmd-ts'

import rootCommand from '@/cli'

const main = async () => {
  await run(rootCommand, process.argv)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
