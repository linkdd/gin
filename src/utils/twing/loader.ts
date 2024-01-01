import path from 'path'
import * as fs from 'fs'

import {
  TwingFilesystemLoaderFilesystem,
  TwingFilesystemLoaderFilesystemStats,
} from 'twing'

export class FileSystemLoaderFS implements TwingFilesystemLoaderFilesystem {
  private dir: string

  constructor(dir: string) {
    this.dir = dir
  }

  stat(
    filePath: string,
    callback: (
      error: Error | null,
      stats: TwingFilesystemLoaderFilesystemStats | null,
    ) => void,
  ): void {
    return fs.stat(path.join(this.dir, filePath), callback)
  }
  readFile(
    filePath: string,
    callback: (error: Error | null, data: Buffer | null) => void,
  ): void {
    return fs.readFile(path.join(this.dir, filePath), callback)
  }
}
