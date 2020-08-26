import rp from 'request-promise'
import Config from '../config/index'
import mongoose from 'mongoose'

const Token = mongoose.model('Token')
const base = 'https://api.weixin.qq.com/'
const api = {
    accessToken: `${base}cgi-bin/token?grant_type=client_credential`,
    cloudFunc: `${base}tcb/invokecloudfunction`, // 触发云函数
    updateIndex: `${base}tcb/updateindex`, // 更新索引
    collectionAdd: `${base}tcb/databasecollectionadd`, // 新增集合
    collectionDel: `${base}tcb/databasecollectiondelete`, // 删除集合
    collectGet: `${base}tcb/databasecollectionget`, // 获取集合信息
    databaseAdd: `${base}tcb/databaseadd`, // 插入记录
    databaseDel: `${base}tcb/databasedelete`, // 删除记录
    databaseUpdate: `${base}tcb/databaseupdate`, // 更新记录
    databaseQuery: `${base}tcb/databasequery`, // 查询记录
    databaseAggregate: `${base}tcb/databaseaggregate`, // 数据库聚合
    databaseCount: `${base}tcb/databasecount`, // 获取查询记录数量
    uploadFile: `${base}tcb/uploadfile`, // 上传文件
    batchDownloadFile: `${base}tcb/batchdownloadfile`, // 获取文件下载链接
    batchDeleteFile: `${base}tcb/batchdeletefile`, // 删除文件
}

class Wechat {
    constructor(opts) {
        this.opts = Object.assign({}, opts)
        this.appID = Config.mina.appid
        this.appSecret = Config.mina.secret
        this.getAccessToken = opts.getAccessToken
        this.saveAccessToken = opts.saveAccessToken
        this.fetchAccessToken()
    }

    async request(options) {
        options = Object.assign({}, options, { json: true })
        try {
            const response = await rp(options)
            return response
        } catch (e) {
            console.log(e)
        }
    }

    async fetchAccessToken() {
        let data = await this.getAccessToken()

        if ( !this.isValidToken(data, 'access_token')) {
            data = await this.updateAccessToken()
            await this.saveAccessToken(data)
        }
        return data
    }

    async updateAccessToken() {
        const Url = `${api.accessToken}&appid=${this.appID}&secret=${this.appSecret}`
        const data = await this.request({ url: Url })
        const now = new Date().getTime()
        const expiresAt = now + (data.expires_in - 60) * 1000

        data.expires_in = expiresAt

        return data
    }

    isValidToken(data, name) {
        if (!data || !name || !data.expires_in) {
            return false
        }
        const expires_in = data.expires_in
        const now = new Date().getTime()

        if (now < expires_in) {
            return true
        } else {
            return false
        }
    }

    // 触发云函数
    async callFunction(params) {
        const token = await this.fetchAccessToken()
        const options = {
            method: "POST",
            uri: `${api.cloudFunc}?access_token=${token.access_token}&env=${Config.mina.env}&name=${params.name}`,
            body: params.data,
            json: true
        }
        return this.request(options)
    }

    // 操作云数据库
    async database (params) {
        const token = await this.fetchAccessToken()
        const options = {
            method: "POST",
            uri: `${api[params.type]}?access_token=${token.access_token}`,
            body: {
                env: Config.mina.env,
                ...params.data
            },
            json: true
        }
        return this.request(options)
    }
}

export default new Wechat({
    getAccessToken: async () => await Token.getAccessToken(),
    saveAccessToken: async (data) => await Token.saveAccessToken(data),
})