import path from 'path'
import { promises as fs } from 'fs'

export const exists = async (path: string) => {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

export const copyDir = async (source: string, target: string) => {
  await fs.mkdir(target, { recursive: true })

  const items = await fs.readdir(source)

  for (const item of items) {
    const sourcePath = path.join(source, item)
    const targetPath = path.join(target, item)

    const stat = await fs.stat(sourcePath)

    if (stat.isDirectory()) {
      await copyDir(sourcePath, targetPath)
    } else {
      await fs.copyFile(sourcePath, targetPath)
    }
  }
}
