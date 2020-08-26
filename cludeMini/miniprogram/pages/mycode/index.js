
Page({
  data: {
    info: {}
  },
  onLoad: function (options) {
    this.getData()
  },
  getData() {
    wx.cloud.callFunction({
      name: 'code',
      data: {}
    }).then(res => {
      console.log(res)
    })
  }
})