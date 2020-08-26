import * as Utils from '../../common/utils/index'
let ME = null
Page({
  data: {
    list: {},
    id: '',
    userInfo: wx.getStorageSync('userInfo'),
    addComments: false,
    needAuth: false,
    comments: ''
  },
  onLoad: function (options) {
    ME = this
    this.data.id = options.id || ''
    this.getData(options.id) 
  },
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
  getData(id) {
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'detail',
        data: {
          id
        }
      }
    }).then(res => {
      if (res.result.code === 200) {
        this.setData({
          list: res.result.data
        })
      }
    })
  },
  // 获取输入值
  getVal: Utils.debounce((e) => {
    ME.setData({
      comments: e.detail.value
    })
  }, 300),
  // 显示输入框
  showComments(e) {
    this.data.addComId = e.detail.id
    this.setData({
      addComments: true,
      needAuth: true
    })
  },
  onShareAppMessage: function () {
    let item = this.data.list[0]

    return {
      title: item.content,
      path: 'pages/detail/index?id='+item.id,
      imageUrl: item.imgs[0]
    }
  }
})