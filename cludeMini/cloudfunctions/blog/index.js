// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const randomToken = require('random-token')
const xss = require('xss')
cloud.init({
  env: "cloud-xo8ot"
})
const blogStore = cloud.database().collection('blog')
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

  app.router('create', async (ctx, next) => {
    if (!event.data) {
      return (ctx.body = {
        code: 201,
        msg: '没有参数'
      })
    }
    if (!event.data.content) {
      return (ctx.body = {
        code: 202,
        msg: '请输入内容'
      })
    }
    // 也可以不用配图
    // if (!event.data.imgs || !event.data.imgs.length) {
    //   return (ctx.body = {
    //     code: 202,
    //     msg: '请选择图片'
    //   })
    // }
    let params = {
      id: randomToken(16),
      status: 1,
      userInfo: event.data.userInfo,
      likeCount: 0,
      comments: [],
      imgs: event.data.imgs,
      openid: ctx.data.openid,
      content: event.data.content,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime()
    }
    await blogStore.add({
      data: params,
    })
    return (ctx.body = {
      code: 200,
      msg: '添加成功'
    })
  })

  app.router('bloglist', async (ctx, next) => {
    let { page, search, pageSize, checkSelf } = event.data
    page = Number(page) || 0
    pageSize = Number(pageSize) || 0
    let total = 0
    let list = []
    let obj = {}
    if (search) {
      // 模糊搜索
      obj.content = cloud.database().RegExp({
        regexp: search,
        options: 'i'
      })
    }
    if (checkSelf) {
      obj.openid = ctx.data.openid
    }
    try {
      let _res = await blogStore.where(obj).get()
      if (_res.errMsg === "collection.get:ok") {
        total = _res.data.length
      }
      let _res2 = await blogStore.where(obj).skip((pageSize * (page - 1)) || 0).limit(pageSize || 15).orderBy('updateAt', 'desc').get()
      if (_res2.errMsg === "collection.get:ok") {
        list = _res2.data
      }
      return (ctx.body = {
        code: 200,
        msg: '查询数据成功',
        data: {
          total,
          list
        }
      })
    } catch(e) {
      return (ctx.body = {
        code: 201,
        msg: '貌似出了点错误',
        data: {}
      })
    }
  })

  app.router('addcomments', async(ctx, next) => {
    let { id, comments, nickName, avatarUrl } = event.data
    let _ = cloud.database().command
    try {
      let _res = await blogStore.where({
        id: id
      }).update({
        data: {
          comments: _.push({
            comments: xss(comments),
            createAt: new Date().getTime(),
            nickName: xss(nickName),
            openid: ctx.data.openid,
            avatarUrl
          })
        }
      })
      if (_res.errMsg === 'collection.update:ok') {
        return (ctx.body = {
          code: 200,
          msg: '提交成功'
        })
      }
    } catch(e) {
      return (ctx.body = {
        code: 201,
        msg: '貌似出了点问题'
      })
    }

  })

  app.router('detail', async(ctx, next) => {
    let { id } = event.data
    if (!id) {
      return (ctx.body = {
        code: 201,
        msg: '缺少必要参数id'
      })
    }
    try {
      let res = await blogStore.where({
        id
      }).get()
      if (res.errMsg === "collection.get:ok") {
        return (ctx.body = {
          code: 200,
          data: res.data
        })
      } else {
        return (ctx.body = {
          code: 201,
          msg: '找不到数据'
        })
      }
    } catch (e) {
      return (ctx.body = {
        code: 201,
        msg: '貌似出了点问题'
      })
    }
  })

  return app.serve()
}