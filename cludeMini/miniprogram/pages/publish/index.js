import { debounce } from '../../common/utils/index'
import randomToken from '../../radomToken/index'
let ME = null
let Files = []
Page({
  data: {
    imageList: [],
    MaxLen: 6,
    value: ''
  },
  onLoad: function (options) {
    ME = this
  },

  // 添加新图片
  addnew() {
    const me = this
    let { MaxLen,imageList } = this.data
    wx.chooseImage({
      count: MaxLen - imageList.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          imageList: imageList.concat(result.tempFilePaths)
        })
      }
    });
      
  },
  // 预览图片
  previewThis(e) {
    let { imageList } = this.data
    let { src } = e.currentTarget.dataset
    wx.previewImage({
      current: src,
      urls: imageList
    });
      
  },
  // 删除图片
  deleteThis(e) {
    let { imageList } = this.data
    let { index } = e.currentTarget.dataset
    imageList.splice(index, 1)
    this.setData({
      imageList
    })
  },
  // 获取数据
  getVal: debounce(e => {
    let { value } = e.detail
    ME.setData({
      value
    })
  }, 230),
  // 上传数据
  submitData: debounce(e => {
    wx.showLoading({
      title: '数据整理中',
      mask: true
    })
    let { value, imageList } = ME.data

    if (value.trim() === '') {
      wx.hideLoading()
      wx.showToast({
        title: '请输入发布信息',
        icon: 'none',
      })
      return
    }
    let _promise = []
    for (let i = 0; i < imageList.length; i++) {
      const el = imageList[i]
      _promise.push(ME._uploadFile(el))
    }

    Promise.all(_promise).then(() => {
      wx.cloud.callFunction({
        name: 'blog',
        data: {
          $url: 'create',
          data: {
            content: value,
            imgs: Files,
            userInfo: wx.getStorageSync('userInfo')
          }
        }
      }).then(res => {
        console.log(res,'00000')
        if (res.result.code == 200) {
          wx.showToast({
            title: '添加成功',
            icon: 'none',
          })
          let routes = getCurrentPages();
          let before = routes[routes.length-2]
          before.getData && before.getData()
            
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
            
        }
        wx.hideLoading();
        
      }).catch(e => {
        wx.hideLoading();
      })
    })
    

      
  }),
  // 上传文件
  _uploadFile(tempFile) {
    let suffix = /\.\w+$/.exec(tempFile)[0]
    return new Promise((resolve,reject) => {
      wx.cloud.uploadFile({
        cloudPath: `blog/${randomToken(32)}_${Date.now()}${suffix}`,
        filePath: tempFile,
        success: res => {
          Files.push(res.fileID)
          resolve(res.fileID)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }
})