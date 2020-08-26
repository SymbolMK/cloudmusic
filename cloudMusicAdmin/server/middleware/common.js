import koaBody from 'koa-bodyparser'
import koaSession from 'koa-session'

export const addBody = app => {
    app.use(koaBody())
}

export const addSession = app => {
    app.keys = ['cloudmusic']
    const CONF = {
        key: 'session:cloud',
        maxAge: 2 * 86400 * 1000,
        overwrite: true,
        signed: true,
        rolling: false,
        httpOnly: true
    }
    app.use(koaSession(CONF, app))
}