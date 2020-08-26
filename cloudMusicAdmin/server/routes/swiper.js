import { controller, post, required, del } from '../decorator/index'
import wechat from '../wechat/index'

@controller('/swiper')
export class swiperController {
    @post('list')
    async swiperlist(ctx, next) {
        // let data = await wechat.callFunction({
        //     name: 'swiper',
        //     data: {
        //         $url: 'list'
        //     }
        // })
        let data = await wechat.database({
            type: 'databaseQuery',
            data: {
                query: 'db.collection("swiperlist").get()'
            }
        })
        console.log(data)
        if (data) {
            if (data.errcode === 0) {
                return (ctx.body = {
                    code: 200,
                    msg: '查询成功',
                    data: data.data.map(el => {
                        return JSON.parse(el)
                    })
                })
            } else {
                return (ctx.body = {
                    code: 201,
                    data: [],
                    msg: '查询失败'
                })
            }
        } else {
            return (ctx.body = {
                code: 203,
                data: [],
                msg: '貌似出了点错误'
            })
        }
    }

    @post('edit')
    @required({body: ['name', 'url']})
    async swiperEdit(ctx, next) {
        const { name, url, id } = ctx.request.body
        let data = await wechat.callFunction({
            name: 'swiper',
            data: {
                $url: 'edit',
                data: { name, url, id: id || '' }
            }
        })
        if (data) {
            if (data.errcode === 0) {
                return (ctx.body = {
                    code: 200,
                    msg: '修改成功',
                    data: JSON.parse(data.resp_data)
                })
            } else {
                return (ctx.body = {
                    code: 201,
                    data: {},
                    msg: '查询失败2'
                })
            }
        } else {
            return (ctx.body = {
                code: 203,
                data: [],
                msg: '貌似出了点错误'
            })
        }
    }

    @del('delete')
    @required({body: ['id']})
    async swiperDelete(ctx, next) {
        const { id } = ctx.request.body
        let data = await wechat.callFunction({
            name: 'swiper',
            data: {
                $url: 'delete',
                data: { id }
            }
        })

        if (data) {
            if (data.errcode === 0) {
                return (ctx.body = {
                    code: 200,
                    msg: '查询成功',
                    data: JSON.parse(data.resp_data).data
                })
            } else {
                return (ctx.body = {
                    code: 201,
                    data: [],
                    msg: '查询参数缺失'
                })
            }
        } else {
            return (ctx.body = {
                code: 203,
                data: [],
                msg: '貌似出了点错误'
            })
        }
    }
}
