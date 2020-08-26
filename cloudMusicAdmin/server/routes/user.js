import api from '../api'
import { controller, get, post, required } from '../decorator/index'

@controller('/admin')
export class userController {
    @post('login')
    @required({body: ['username', 'password']})
    async login(ctx, next) {
        const { username, password } = ctx.request.body
        const data = await api.user.login({username, password})
        const { user, match } = data
        if (match) {
            if (user.role !== 'admin') {
                return (ctx.body = {
                    code: 201,
                    msg: '您的权限不够'
                })
            }
            ctx.session.user = user
            return (ctx.body = {
                code: 200,
                msg: '登陆成功',
                data: user
            })
        } else {
            if (!user) {
                return (ctx.body = {
                    code: 204,
                    msg: '用户不存在'
                })
            } else {
                return (ctx.body = {
                    code: 202,
                    msg: '用户密码不正确'
                })
            }
        }
    }

    @post('logout') 
    async logout(ctx, next) {
        ctx.session = null
        return (ctx.body = {
            code: 200,
            msg: '登出成功'
        })
    }
}
