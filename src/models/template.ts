export interface PageTemplateData {
  url: string
  title: string
  params: { [key: string]: unknown }
  isHome: boolean
  isSection: boolean
  children: PageTemplateData[]
}

export interface PagesTemplateData {
  [url: string]: PageTemplateData | undefined
}

export interface SiteTemplateData {
  title: string
  description?: string
  languageCode?: string
  baseURL?: string
  pages: PagesTemplateData
  params: { [key: string]: unknown }
  data: unknown
}

export interface TemplateData {
  page: PageTemplateData
  site: SiteTemplateData
}
