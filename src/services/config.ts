import { promises as fs } from 'fs'
import path from 'path'

import yaml from 'js-yaml'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'

import * as fsUtils from '@/utils/fs'
import { Config } from '@/models/config'

export const loadConfiguration = async (
  projectDir: string,
): Promise<Config> => {
  const filenames = ['config.yaml', 'config.yml']

  for (const filename of filenames) {
    const configPath = path.join(projectDir, filename)

    if (await fsUtils.exists(configPath)) {
      const buf = await fs.readFile(configPath, 'utf-8')
      const doc = yaml.load(buf) || {}
      const cfg = plainToClass(Config, doc)

      const errors = await validate(cfg, { whitelist: true })

      if (errors.length > 0) {
        let msg = 'Invalid configuration file:\n'
        for (const error of errors) {
          msg += `${error.toString()}\n`
        }

        throw new Error(msg)
      }

      return cfg
    }
  }

  throw new Error('Could not find configuration file')
}
