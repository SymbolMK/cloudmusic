const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const { resolve } = require('path')
const R = require('ramda')
const app = new Koa()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

const r = path => resolve(__dirname, path)
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3006
const MIDDLEWARES = ['database', 'common', 'router']

class Server {
  constructor() {
    this.app = app
    this.useMiddleWares(this.app)(MIDDLEWARES)
  }

  useMiddleWares(app) {
    return R.map(R.compose(
      R.map(i => i(app)),
      require,
      i => `${r('./middleware')}/${i}`
    ))
  }

  async start() {
    const nuxt = await new Nuxt(config)
    if (config.dev) {
      try {
        const builder = new Builder(nuxt)
        await builder.build()
      } catch(e) {
        consola.error(e) // eslint-disable-line no-console
        process.exit(1)
      }
    }

    this.app.use(async (ctx, next) => {
      await next()
      ctx.status = 200
      ctx.req.session = ctx.session

      return new Promise((resolve, reject) => {
        ctx.res.on('close', resolve)
        ctx.res.on('finish', resolve)
        nuxt.render(ctx.req, ctx.res, promise => {
          promise.then(resolve).catch(reject)
        })
      })
    })

    app.listen(port, host)
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true
    })
  }
}

let App = new Server()

App.start()
