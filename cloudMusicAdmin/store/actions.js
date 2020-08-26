import Services from './service'

export default {
    nuxtServerInit({commit}, {req}) {
        if (req.session && req.session.user) {
            const user = req.session.user
            let params = Object.assign({}, user)
            commit('SET_USER', params)
        }
    },

    setLogin({commit}, data) {
        commit('SET_USER', data)
    },

    togglemenu({state}){
        state.isCollapse = !state.isCollapse
    },

    loginout({commit}, data) {
        commit('REMOVE_COOKIE')
    },

    async musicList({commit}, data) {
        let _res = await Services.musicList(data)
        return _res
    },

    async swiper({ commit }, data) {
        let _res = await Services.swiperList(data)
        return _res
    },

    async swiperEdit({}, data) {
        let _res = await Services.swiperEdit(data)
        return _res
    }
}