import { TwingExecutionContext, TwingEnvironment } from 'twing'

export default (env: TwingEnvironment) => {
  const defaultFilter = env.filters.get('default')
  // @ts-ignore
  defaultFilter.callable = async <T>(
    ctx: TwingExecutionContext,
    val: T | undefined,
    defaultVal: T,
  ): Promise<T> => {
    return val === undefined ? defaultVal : val
  }
}
