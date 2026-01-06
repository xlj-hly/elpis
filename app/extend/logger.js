const log4js = require('log4js')
/**
 * logger extend
 * @param {Object} app - Koa 实例
 *
 * 配置 log4js
 *
 * @example
 * app.logger.log、app.logger.error
 *
 */
module.exports = (app) => {
  let logger

  if (app.env.isLocal()) {
    // 输出控制台
    logger = console
  } else {
    // 日志落盘
    log4js.configure({
      appenders: {
        console: { type: 'console' },
        // 日志切割
        dateFile: {
          type: 'dateFile',
          filename: './logs/application.log',
          pattern: 'yyyy-MM-dd.log',
        },
      },
      categories: {
        default: { appenders: ['console', 'dateFile'], level: 'trace' },
      },
    })

    logger = log4js.getLogger()
  }

  return logger
}
