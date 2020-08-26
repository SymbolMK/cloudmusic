import fetch from '../common/fetch/index'
const BaseUrl = ''
class Services {
    /**
     * 音乐列表
     */
    musicList(params) {
        return fetch.post('/music/hotlist' ,params)
    }

    /**
     * 轮播列表
     */
    swiperList(params) {
        return fetch.post('/swiper/list' ,params)
    }

    swiperEdit(params) {
        return fetch.post('/swiper/edit' ,params)
    }

    swiperDelete(params) {
        return fetch.delete('/swiper/delete' ,params)
    }
}
export default new Services()