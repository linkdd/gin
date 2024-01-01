import { promises as fs } from 'fs'
import path from 'path'

export const exists = async (path: string) => {
  try {
    await fs.access(path)
    return true
  }
  catch {
    return false
  }
}

export const copyFolderContent = async (srcPath: string, destPath: string) => {
  const srcDir = await fs.opendir(srcPath)

  for await (const entry of srcDir) {
    const srcEntryPath = path.join(srcPath, entry.name)
    const destEntryPath = path.join(destPath, entry.name)

    if (entry.isDirectory()) {
      await copyFolderContent(srcEntryPath, destEntryPath)
    }
    else {
      await fs.mkdir(path.dirname(destEntryPath), { recursive: true })
      await fs.copyFile(srcEntryPath, destEntryPath)
    }
  }
}

export const mkdir = fs.mkdir
export const writeFile = fs.writeFile
