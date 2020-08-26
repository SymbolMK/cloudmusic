import { controller, post } from '../decorator/index'
import wechat from '../wechat/index'
@controller('/music')
export class musicController {
    @post('hotlist')
    async musiclist(ctx, next) {
        const { page, pageSize } = ctx.request.body
        let data = await wechat.callFunction({
            name: 'music',
            data: {
                $url: 'hotlist',
                page, 
                pageSize
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
                    msg: '查询参数错误'
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
