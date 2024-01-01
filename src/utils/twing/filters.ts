import { TwingExecutionContext, TwingMarkup, createFilter } from 'twing'

import { GinPlugin } from '@/models/plugin'
import mdit from '@/utils/markdown'

export const markdown = (plugins: GinPlugin[]) =>
  createFilter(
    'markdown',
    async (
      context: TwingExecutionContext,
      content: TwingMarkup,
    ): Promise<string> => {
      const mdPlugins = plugins.flatMap((plugin) =>
        plugin.getMarkdownContainers(),
      )
      return mdit(mdPlugins).render(content.toString())
    },
    [],
    //{ isSafe: ['html'] },
  )

export const startswith = (_plugins: GinPlugin[]) =>
  createFilter(
    'startswith',
    async (
      context: TwingExecutionContext,
      content: string,
      pattern: string,
    ): Promise<boolean> => {
      return content.startsWith(pattern)
    },
    [],
  )

export const endswith = (_plugins: GinPlugin[]) =>
  createFilter(
    'endswith',
    async (
      context: TwingExecutionContext,
      content: string,
      pattern: string,
    ): Promise<boolean> => {
      return content.endsWith(pattern)
    },
    [],
  )
