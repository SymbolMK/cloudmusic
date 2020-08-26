import { debounce } from '../../common/utils/index'
Component({
  properties: {
    playList: {
      type: Object,
      default: {}
    }
  },

  data: {

  },

  methods: {
    navigateList: debounce((e) => {
      let { id } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/music/index?id=${id}`
      });
        
    }, 400)
  }
})
