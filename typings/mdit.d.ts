function plugin(md: MarkdownIt, opts?: unknown): void

declare module 'markdown-it-abbr' {
  export default plugin
}

declare module 'markdown-it-attrs' {
  export default plugin
}

declare module 'markdown-it-container' {
  export default plugin
}

declare module 'markdown-it-deflist' {
  export default plugin
}

declare module 'markdown-it-emoji' {
  export const full = plugin
}

declare module 'markdown-it-footnote' {
  export default plugin
}

declare module 'markdown-it-imsize' {
  export default plugin
}

declare module 'markdown-it-ins' {
  export default plugin
}

declare module 'markdown-it-mark' {
  export default plugin
}

declare module 'markdown-it-mermaid' {
  export default plugin
}

declare module 'markdown-it-sub' {
  export default plugin
}

declare module 'markdown-it-sup' {
  export default plugin
}

declare module 'markdown-it-table-of-contents' {
  export default plugin
}

declare module 'markdown-it-task-lists' {
  export default plugin
}

declare module 'markdown-it-wikilinks' {
  function wikilinksPlugin(options?: unknown): plugin
  export default wikilinksPlugin
}
