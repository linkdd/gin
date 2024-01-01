import { promises as fs } from 'fs'
import path from 'path'

import { Result, Ok, Err } from '@sniptt/monads'
import yaml from 'js-yaml'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'

import * as fsUtils from '../fs'
import { Config } from './model'

const loadConfiguration = async (projectDir: string): Promise<Result<Config, void>> => {
  const filenames = [
    'config.yaml',
    'config.yml',
  ]

  for (const filename of filenames) {
    const configPath = path.join(projectDir, filename)

    if (await fsUtils.exists(configPath)) {
      const buf = await fs.readFile(configPath, 'utf-8')
      const doc = yaml.load(buf) || {}
      const cfg = plainToClass(Config, doc)

      const errors = await validate(cfg, { whitelist: true })

      if (errors.length > 0) {
        console.error('Invalid configuration file:')
        for (const error of errors) {
          console.error(error.toString())
        }

        return Err(undefined as void)
      }

      return Ok(cfg)
    }
  }

  console.error('Could not find configuration file')
  return Err(undefined as void)
}

export default loadConfiguration
