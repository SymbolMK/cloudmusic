import regeneratorRunTime from '../../regenerator/runtime.js'
import SwiperJson from '../../assets/3-1_swiperImgUrls.js'
Page({
  data: {
    SwiperJson:SwiperJson,
    PlayList: [],
    pageSize: 10,
    page: 1,
    total: 0
  },
  onLoad: function (options) {
    // wx.cloud.callFunction({
    //   name: 'login',
    //   data: {},
    //   success: res => {
    //     console.log(res)
    //   },
    //   fail: err => {

    //   }
    // })
    this._getMList(true)
  },
  onShow: function () {

  },
  _getMList(reset) {
      
    let { page, pageSize,total, PlayList }  = this.data
    if (!reset) {
      if (Math.ceil(total / pageSize) > page) {
        page++
      }else {
        return
      }
    }

    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'hotlist',
        page,
        pageSize
      }
    }).then(res => {
      if (reset) {
        this.setData({
          total: res.result.total,
          PlayList: res.result.data,
          page: 1
        })
        wx.stopPullDownRefresh()
      } else {
        PlayList = PlayList.concat(res.result.data)
        this.setData({
          PlayList,
          page
        })
      }
      
    }).then(() => {
      wx.hideLoading()
    })
  },
  onShareAppMessage: function () {

  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this._getMList(true)
  },
  // 上滑加载
  onReachBottom: function () {
    this._getMList(false)
  },
})