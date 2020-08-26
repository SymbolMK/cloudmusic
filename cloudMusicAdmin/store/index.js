import Logger from 'vuex/dist/logger'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import state from './state'

const debuger = process.env.NODE_ENV !== 'production'

export default {
    state,
    actions,
    mutations,
    getters,
    strict: false,
    plugins: debuger ? [Logger()] : []
}