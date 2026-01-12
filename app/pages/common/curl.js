import CryptoJS from 'crypto-js'
import axios from 'axios'
import { ElMessage } from 'element-plus'

/**
 * curl 请求
 *
 * 封装 axios 请求
 *
 * @param {object} options - 请求选项
 * @param {string} options.url - 请求地址
 * @param {string} [options.method='GET'] - 请求方法
 * @param {object} [options.headers={}] - 请求头
 * @param {object} [options.query={}] - 请求参数
 * @param {object} [options.data={}] - 请求数据
 * @param {string} [options.responseType] - 响应类型
 * @param {number} [options.timeout=60000] - 请求超时时间
 * @param {string} [options.errorMessage='网络异常'] - 错误信息
 */
const curl = ({
  url, // 请求地址
  method = 'GET', // 请求方法
  headers = {}, // 请求头
  query = {}, // 请求参数
  data = {}, // 请求数据
  // responseType = 'json', // 响应类型
  timeout = 60000, // 请求超时时间
  errorMessage = '网络异常', // 错误信息
}) => {
  // 接口签名处理
  const signKey = '#^%@#*#*#*##*&@$$##**&'
  const st = Date.now()
  const signature = CryptoJS.HmacSHA256(signKey + st, signKey).toString()

  // 构造 axios 请求设置
  /**
   * @type {import('axios').AxiosRequestConfig}
   */
  const ajaxSetting = {
    url: url,
    method: method,
    headers: {
      ...headers,
      s_sign: signature,
      s_t: st,
    },
    params: query,
    data: data,
    timeout: timeout,
  }

  return axios
    .request(ajaxSetting)
    .then((res) => {
      const resData = res.data || {}

      // 后端 API 返回格式
      const { success, code, message } = resData

      // 失败
      if (!success) {
        switch (code) {
          case 442:
            ElMessage.error('请求参数异常')
            break
          case 445:
            ElMessage.error('请求不合法')
            break
          case 50000:
            ElMessage.error(message)
            break
          default:
            ElMessage.error(errorMessage)
            break
        }
        console.error(resData)
        return Promise.reject(resData)
      }

      // 成功
      return Promise.resolve(resData)
    })
    .catch((err) => {
      const { message } = err

      if (message.match(/timeout/)) {
        return Promise.reject({
          message: 'Request timeout',
          code: 504,
        })
      }

      return Promise.reject(err)
    })
}

export default curl
