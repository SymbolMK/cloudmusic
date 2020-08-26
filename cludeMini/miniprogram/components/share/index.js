
Component({
  externalClasses: ['icon-pinglun1', 'icon-share','iconfont'],
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  data: {

  },

  methods: {
    // 预览图片
    previewImage(e) {
      let { src } = e.currentTarget.dataset
      let item = this.data.item

      wx.previewImage({
        current: src,
        urls: item.imgs
      })
    },
    showComments() {
      this.triggerEvent('showComments', {
        id: this.data.item.id
      })
    }
  }
})
