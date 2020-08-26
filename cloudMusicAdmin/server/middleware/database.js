import fs from 'fs'
import { resolve } from 'path'
import mongoose from 'mongoose'
import Config from '../config/index'

// 获取所有的schema 模块
const models = resolve(__dirname, '../database/schema')

// 读取目录文件,并抽出js文件,然后依次引入
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*js$/))
  .forEach(file => require(resolve(models, file)))

export const database = app => {
    mongoose.set("debug", true)

    mongoose.connect(Config.db)

    mongoose.connection.on('disconnected', () => {
        mongoose.connect(Config.db)
    })

    mongoose.connection.on('error', () => {
        console.log(err)
    })

    mongoose.connection.on('open', async () => {
        const User = mongoose.model('User')
        let _user = await User.findOne({
            username: '403756835@qq.com'
        }).exec()

        if (!_user) {
            _user = new User({
                username: '403756835@qq.com',
                password: 'makai89698739',
                role: 'admin'
            })
            await _user.save()
        }
    })
}