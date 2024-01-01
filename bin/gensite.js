#!/usr/bin/env node

const { main } = require('../dist/index.js')

main().catch(err => {
  console.error(err)
  process.exit(1)
})
