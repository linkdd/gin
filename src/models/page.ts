export interface Page {
  url: string
  title: string
  children: Page[]
  isSection: boolean
  isHome: boolean
  params: { [key: string]: unknown }
  content: string
}
