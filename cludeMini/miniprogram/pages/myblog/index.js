import * as Utils from '../../common/utils/index'
Page({
  data: {
    list: [],
    page: 1, 
    total: 0, 
    pageSize: 15,
    addComments: false,
    userInfo: wx.getStorageSync('userInfo'),
    needAuth: true
  },
  onLoad: function (options) {
    this.getData()
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
      
    let { page, total, pageSize,list } = this.data
    let params = {
      page,
      pageSize,
      checkSelf: true
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
          list: needMore? list.concat(res.result.data.list) : res.result.data.list,
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
})