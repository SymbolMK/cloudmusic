// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init()
const swiperStore = cloud.database().collection('swiperlist')
// const _ = cloud.database().command
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })
  const wxCtx = cloud.getWXContext()
  app.use(async (ctx, next) => {
    ctx.data = {
      openid: wxCtx.OPENID || '',
      appid: wxCtx.APPID || '',
      unionid: wxCtx.UNIONID || '',
    }

    await next()
  })

  app.router('list', async (ctx, next) => {
    let data = await swiperStore.orderBy('createTime', 'desc').get()
    return (ctx.body = {
      data: data.data
    })
  })

  app.router('edit', async (ctx, next) => {
    if (!event.data) {
      return (ctx.body = {
        code: 201,
        msg: '没有参数'
      })
    }

    if (!event.data.name) {
      return (ctx.body = {
        code: 202,
        msg: '请输入名称'
      })
    }

    const { url, name, id } = event.data
    let params = {
      name,
      url,
      openid: ctx.data.openid,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime()
    }
    if (id) {
      await swiperStore.where({id}).update({
        data: {
          name,
          url,
          updateAt: new Date().getTime()
        }
      })
      return (ctx.body = {
        code: 200,
        msg: '更新成功'
      })
    } else {
      await swiperStore.add({
        data: params,
      })

      return (ctx.body = {
        code: 200,
        msg: '添加成功'
      })
    }

    

  })

  app.router('delete', async (ctx, next) => {
    const { id } = event.data
    await swiperStore.where({id}).remove()

    return (ctx.body = {
      code: 200,
      msg: '删除成功'
    })
  })

  return app.serve()
}