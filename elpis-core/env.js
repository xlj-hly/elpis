module.exports = () => {
  return {
    // 判断是否是本地环境
    isLocal() {
      return process.env.ENV === 'local'
    },
    // 判断是否是测试环境
    isBeta() {
      return process.env.ENV === 'beta'
    },
    // 判断是否是生产环境
    isProduction() {
      return process.env.ENV === 'production'
    },
    // 获取当前环境
    get() {
      return ['local', 'beta', 'production'].includes(process.env.ENV)
        ? process.env.ENV
        : 'local'
    },
  }
}
