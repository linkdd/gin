import { Page } from './page'

export interface URLCache {
  [url: string]: Page | undefined
}
