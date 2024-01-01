import { TwingExtension } from 'twing'
import { Token } from 'markdown-it'

export interface MarkdownContainerPlugin {
  name: string
  validate(params: string): boolean
  render(tokens: Token[], idx: number): string
}

export interface GinPluginInterface {
  getMarkdownContainers(): MarkdownContainerPlugin[]
  getTemplateExtensions(): TwingExtension[]
}

export class GinPlugin implements GinPluginInterface {
  getMarkdownContainers(): MarkdownContainerPlugin[] {
    return []
  }

  getTemplateExtensions(): TwingExtension[] {
    return []
  }
}
