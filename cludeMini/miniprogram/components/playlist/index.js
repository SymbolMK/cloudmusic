import { debounce } from '../../common/utils/index'
let Me = null
Component({
  properties: {
    showModal: {
      type: Boolean,
      default: false,
      observer: function(navl) {
        console.log(navl)
        setTimeout(() => {
          this.setData({
            showMiddle: navl
          })
        }, 200)
      }
    }
  },

  data: {
    playList: [],
    isPlayId: wx.getStorageSync('isPlayId'),
    playMode: wx.getStorageSync('playMode') || 'sequence',//sequence: 0顺序, loop: 1循环, random: 2随机
    showMiddle: false,
    modeTxt: {
      sequence: '列表循环',
      loop: '单曲循环',
      random: '随机播放'
    }
  },
  ready() {
    Me = this
    this.setData({
      isPlayId: wx.getStorageSync('isPlayId'),
      playList: wx.getStorageSync('trackIds'),
      playMode: wx.getStorageSync('playMode') || 'sequence',//sequence: 0顺序, loop: 1循环, random: 2随机
    })
  },

  methods: {
    // 清除所有
    clearAll() {
      wx.removeStorageSync('trackIds')
      wx.removeStorageSync('isPlayId')
      wx.removeStorageSync('currentCover')
      wx.navigateBack({ delta: 1 })
        
    },
    // 切换模式
    changeMode() {
      //sequence: 0顺序, loop: 1循环, random: 2随机
      let playMode = wx.getStorageSync('playMode')
      if (playMode == 'loop') {
        wx.setStorageSync('playMode', 'random');
        playMode = 'random'
      } else if (playMode === 'random') {
        wx.setStorageSync('playMode', 'sequence');
        playMode = 'sequence'
      } else {
        wx.setStorageSync('playMode', 'loop');
        playMode = 'loop'
      }

      this.setData({
        playMode: playMode
      })
      this.triggerEvent('playMode', playMode)
    },
    playThis: debounce(e => {
      let { item } = e.currentTarget.dataset
      wx.setStorageSync('isPlayId', item.id)
      wx.setStorageSync('currentCover', item.al.picUrl);
      Me.setData({
        'isPlayId': item.id
      })
      Me.triggerEvent('playThis', {
        id: item.id,
        song: item.name,
        name: item.ar[0].name,
        currentCover: item.al.picUrl
      })
    }, 240),
    stop() {
      return false
    },
    hideModal() {
      this.setData({
        showMiddle: false
      }, () => {
        setTimeout(() => {
          this.triggerEvent('hideModal')
        }, 200)
      })
      
    }
  }
})
