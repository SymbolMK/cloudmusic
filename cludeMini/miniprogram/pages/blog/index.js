import * as Utils from '../../common/utils/index'
let ME = null
Page({
  data: {
    needAuth: false,
    userInfo: wx.getStorageSync('userInfo'),
    list: [],
    page: 1,
    total: 0,
    search: '',
    pageSize: 15,
    addComments: false,
    comments: ''
  },
  onLoad: function (options) {
    const me = this
    ME = this
    if (!wx.getStorageSync('userInfo')) {
      this.setData({
        needAuth: false,
        userInfo: wx.getStorageSync('userInfo')
      })
    }
    this.getData()
  },
  onReady: function () {

  },
  onShow: function () {
    
  },
  // 显示输入框
  showComments(e) {
    this.data.addComId = e.detail.id
    this.setData({
      addComments: true,
      needAuth: true
    })
  },
  // 获取输入值
  getVal: Utils.debounce((e) => {
    ME.setData({
      comments: e.detail.value
    })
  }, 300),
  // 添加输入
  submitCom() {
    let { userInfo, comments, list } = this.data
    let _index = list.findIndex(el => el.id === this.data.addComId)
    let params = {
      comments,
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      id: this.data.addComId
    }
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'addcomments',
        data: params
      }
    }).then(res => {
      if (res.result.code == 200) {
        this.data.addComId =null
        list[_index].comments.push(params)
        this.setData({
          list,
          needAuth: false,
          addComments: false,
        })
      }
    })
  },
  // 获取数据
  getData(needMore=false) {
      
    let { page, search, total, pageSize,list } = this.data
    let params = {
      page,
      search,
      pageSize
    }
    if (needMore) {
      page++
      if (page > Math.ceil(total / pageSize)) {
        wx.hideLoading()
        return
      }
      params.page++
    }
    wx.showLoading({
      title: '查询中',
      mask: true
    })

    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'bloglist',
        data: params
      }
    }).then(res => {
      if (res.result.code == 200) {
        this.data.total = res.result.data.total,
        this.data.page = page
        this.setData({
          list: needMore? list.concat(res.result.data.list) : res.result.data.list
        })
      }
      wx.hideLoading();
      
    }).catch(e => {
      wx.hideLoading();
        
    })

  },
  // 加载更多
  loadMore() {
    this.getData(true)
  },
  // 预览图片
  previewImage(e) {
    let { src, id } = e.currentTarget.dataset
    let { list } = this.data
    let item = list.find(el => el.id === id)

    wx.previewImage({
      current: src,
      urls: item.imgs
    })
  },
  // 搜索
  search(e) {
    this.data.search = e.detail
    if (!e.detail) return
    this.getData(false)
  },
  // 添加新发现
  EditNew(e) {
    let { userInfo } = this.data
    if (userInfo.nickName) {
      wx.navigateTo({
        url: '/pages/publish/index'
      })
    } else {
      this.setData({
        needAuth: true
      })
    }
  },
  // yincangtishi
  closeTip() {
    this.setData({
      needAuth: false
    })
  },
  // 获取用户信息
  getUserInfo(res) {
    if (res.detail.errMsg === 'getUserInfo:ok') {
      wx.setStorageSync('userInfo', res.userInfo);
      this.setData({
        needAuth: false
      }, () => {
        wx.navigateTo({
          url: '/pages/publish/index'
        })
      })
    }
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e)
    if (e.from==='button') {
      let { id } = e.target.dataset
      let item = this.data.list.find(el => el.id === id)

      return {
        title: item.content,
        path: 'pages/detail/index?id='+id,
        imageUrl: item.imgs[0]
      }
    }
    
  }
})