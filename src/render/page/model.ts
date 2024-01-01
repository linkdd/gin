export interface Page {
  url: string,
  title: string,
  children: Page[],
  isSection: boolean,
  isHome: boolean,
  params: {
    [key: string]: any
  },
  content: string,
}

export interface URLCache {
  [url: string]: Page | undefined
}
