import Koa from 'koa'

export interface EnvUtils {
  isLocal: () => boolean
  isBeta: () => boolean
  isProduction: () => boolean
  get: () => string
}

export interface AppOptions {
  /** 项目名称 */
  name?: string
  /** 首页路径 */
  homePage?: string
}

export interface ElpisApp extends Omit<Koa, 'env'> {
  options: AppOptions
  baseDir: string
  businessPath: string
  env: EnvUtils
  config: Record<string, any>
  controller: Record<string, any>
  service: Record<string, any>
  middlewares: Record<string, any>
  routerSchema: Record<string, any>
  logger: Console
}
