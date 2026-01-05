import dotenv from 'dotenv'
import Koa from 'koa'

dotenv.config()

// Koa 实例
const app = new Koa()

// 启动服务
try {
  const port = process.env.PORT || 8080
  const host = process.env.HOST || '0.0.0.0'
  app.listen(port, host)
  console.log(`Server is running on http://${host}:${port}`)
} catch (e) {
  console.error('Server startup failed:', e)
  process.exit(1)
}
