---
title: Homepage
---

# Features

 - :memo: Extended [[./docs/markdown|Markdown]] features (such as Tables, Task lists, ...)
 - :art: Syntax highlighting of code blocks using [[./docs/syntax-highlighting|Shiki]]
 - :lipstick: Support of [[./docs/templates|Twing]] templates
{.feature-list}


# Why not [Hugo](https://gohugo.io)?


| | Gin | Hugo |
|---|---|---|
| **Markdown Renderer** | [[./docs/markdown\|MarkdownIt]] | [Goldmark](https://github.com/yuin/goldmark) |
| Heading anchors | :white_check_mark: | :white_check_mark: |
| Definition lists | :white_check_mark: | :white_check_mark: |
| Task lists | :white_check_mark: | :white_check_mark: |
| Tables | :white_check_mark: | :white_check_mark: |
| Footnotes | :white_check_mark: | :white_check_mark: |
| Table of Contents | :white_check_mark: | :white_check_mark: |
| Custom attributes | :white_check_mark: | **Partial**{.has-text-warning-dark} |
| Emojis | :white_check_mark: | :x: |
| Wikilinks | :white_check_mark: | :x: |
| Image Size | :white_check_mark: | :x: |
| `<abbr>` | :white_check_mark: | :x: |
| `<ins>` | :white_check_mark: | :x: |
| `<sub>` | :white_check_mark: | :x: |
| `<sup>` | :white_check_mark: | :x: |
| `<mark>` | :white_check_mark: | :x: |
| | | {.comparison-table-separator} |
| **Syntax Highlighting** | [[./docs/syntax-highlighting\|Shiki]] | [Chroma](https://github.com/alecthomas/chroma) |
| Custom language (TexMate grammar) | :white_check_mark: | :x: |
| | | {.comparison-table-separator} |
| **Template Engine** | [[./docs/templates\|Twing]] | [Go templates](https://gohugo.io/templates/introduction/) |
| Front Matter data | :white_check_mark: | :white_check_mark: |
| Data folder | :white_check_mark: | :white_check_mark: |
| | | {.comparison-table-separator} |
| **Plugins** | Javascript/Typescript | N/A |
| Custom Markdown blocks | :white_check_mark: | :x: |
| Custom template filters | :white_check_mark: | :x: |
| | | {.comparison-table-separator} |
| **Data formats** | - | - |
| YAML | :white_check_mark: | :white_check_mark: |
| JSON | :building_construction: **TODO**{.has-text-warning-dark} | :white_check_mark: |
| TOML | :x: | :white_check_mark: |
| | | {.comparison-table-separator} |
| **Content formats** | - | - |
| Markdown | :white_check_mark: | :white_check_mark: |
| HTML | **Inside Markdown**{.has-text-warning-dark} | :white_check_mark: |
| RestructuredText | :x: | :white_check_mark: |
| Pandoc | :x: | :white_check_mark: |
| AsciiDoc | :x: | :white_check_mark: |
| Emacs Org-Mode | :x: | :white_check_mark: |
{.comparison-table}
