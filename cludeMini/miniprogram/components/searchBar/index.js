import { debounce } from '../../common/utils/index'
let ME = null
Component({
  externalClasses: ['icon-bianji','iconfont','icon-sousuo'],
  properties: {

  },

  data: {
    searchVal: ''
  },
  ready() {
    ME = this
  },
  methods: {
    getVal: debounce((e) => {
      ME.setData({
        searchVal: e.detail.value
      })
    }, 300),
    startSearch: debounce(e => {
      ME.triggerEvent('Search', ME.data.searchVal)
    }, 300),
    EditNew: debounce(e => {
      ME.triggerEvent('Edit')
    })
  },
})
