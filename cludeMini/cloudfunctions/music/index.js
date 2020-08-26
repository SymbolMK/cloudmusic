// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
cloud.init({
    env: "cloud-xo8ot"
})
const playStore = cloud.database().collection('playlist')
const URL = 'http://musicapi.xiecheng.live'
// 云函数入口函数
exports.main = async (event, context) => {
    const app = new TcbRouter({ event })
    const wxCtx = cloud.getWXContext()

    // 获取首页推荐的播放列表
    app.use(async (ctx,next) => {
        ctx.data = {
            openid: wxCtx.OPENID || '',
            appid: wxCtx.APPID || '',
            unionid: wxCtx.UNIONID || '',
        }
        
        await next()
    })
    // 获取推荐
    app.router('hotlist', async(ctx,next) => {
        let { page, pageSize } = event
        let data = await playStore.skip((pageSize * (page - 1)) || 0).limit(pageSize || 30).orderBy('createTime', 'desc').get()
        let total = await playStore.count()
        ctx.body = {
            data: data.data,
            total: total.total,
        }
    })
    // 获取歌单详情
    app.router('musiclist', async(ctx, next) => {
        let data = await rp(`${URL}/playlist/detail?id=${event.id}`)
        let _res = JSON.parse(data)
        if (_res.code == 200) {
            ctx.body = _res
        } else {
            ctx.body = {
                error: _res.code,
                errmsg: '查无数据'
            }
        }
    })

    // 获取播放歌曲的信息
    app.router('musicUrl', async(ctx,next) => {
        let data = await rp(`${URL}/song/url?id=${event.id}`)
        let _res = JSON.parse(data)
        if (_res.code == 200) {
            ctx.body = _res.data[0]
        } else {
            ctx.body = {
                error: _res.code,
                errmsg: '查无数据'
            }
        }
    })

    // 获取歌词
    app.router('musicLyric', async(ctx, next) => {
        let data = await rp(`${URL}/lyric?id=${event.id}`)
        let _res = JSON.parse(data)
        ctx.body = _res
    })
    
    return app.serve()
}