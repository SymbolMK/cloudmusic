import axios from 'axios'
import { Loading, Notification } from 'element-ui'
import qs from 'qs'

let loading
const fetch = axios.create({
    baseURL: '',
    timeout: 10000,
    responseType: 'json',
    headers: {}
})

// 请求拦截
fetch.interceptors.request.use(function(config) {
    loading = Loading.service({
        lock: true,
        text: '数据请求中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
    })
    // config.data = qs.stringify(config.data);
    return config
}, function(error) {
    return Promise.reject(error)
})

// 响应截断器
fetch.interceptors.response.use(function(response) {
    loading && loading.close()
    if (response.data.code!==200) {
        Notification.error({
            message: response.data.msg || '接口请求错误'
        })
    }
    return response.data
}, function(error) {
    loading && loading.close()
    Notification.error({
        message: error || '接口请求错误'
    })
    return Promise.reject(error)
})

export default fetch
