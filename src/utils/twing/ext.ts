import {
  TwingExtension,
  TwingFilter,
  TwingFunction,
  TwingNodeVisitor,
  TwingOperator,
  TwingTagHandler,
  TwingTest,
} from 'twing'

import * as filters from '@/utils/twing/filters'
import { GinPlugin } from '@/models/plugin'

export default class GinCoreExtension implements TwingExtension {
  private plugins: GinPlugin[]
  readonly filters: TwingFilter[] = []
  readonly functions: TwingFunction[] = []
  readonly nodeVisitors: TwingNodeVisitor[] = []
  readonly operators: TwingOperator[] = []
  readonly tagHandlers: TwingTagHandler[] = []
  readonly tests: TwingTest[] = []

  constructor(plugins: GinPlugin[]) {
    this.plugins = plugins
    this.filters = Object.values(filters).map((factory) =>
      factory(this.plugins),
    )
  }
}
