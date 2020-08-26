// 背景音频管理器
const AudioManger = wx.getBackgroundAudioManager()
let Me = null
import { debounce, radomInt } from '../../common/utils/index'
Page({
  playList: [],
  currentIndex: 0,
  showModal: false,
  data: {
    showLrc: false,
    currentTime: '00:00',
    duration: '00:00',
    options: {},
    currentCover: wx.getStorageSync('currentCover'),
    playState: false,
    rangeVal: 0,
    SongLoading: false,
    playMode: wx.getStorageSync('playMode') || 'sequence',//sequence: 0顺序, loop: 1循环, random: 2随机
    lyric: ''
  },
  onLoad: function (options) {
    Me = this
    for (let k in options) {
      options[k] = decodeURIComponent(options[k])
    }

    this.playList = wx.getStorageSync('trackIds')
    this.currentIndex = this.playList.findIndex(el => el.id == options.id)
    this._getSong(options)
    this.setData({
      options,
      currentCover: wx.getStorageSync('currentCover')
    })
  },
  onReady: function () {

  },
  onShow: function () {

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
  },
  // 显示歌词
  toggleLrc() {
    this.setData({
      showLrc: !this.data.showLrc
    })
  },
  toggleStart() {
    if(!AudioManger.duration) return
    let { playState } = this.data
    if (playState) {
      AudioManger.pause()
    } else {
      AudioManger.play()
    }
    this.setData({
      playState: !playState
    })
  },
  sliderChange: debounce((e) => {
    let { value } = e.detail
    let time = AudioManger.duration * value / 100
    AudioManger.seek(time)
    Me.setData({
      rangeVal: value
    })
  }, 230),
  // 上一首
  prev: debounce(() => {
    if(!AudioManger.duration) return
    if (Me.playList.length === 1 || wx.getStorageSync('playMode') ==='loop') {
      AudioManger.seek(0)
      return
    }
    Me.changeIndex('pre')
  }, 240),
  // 下一首
  next:debounce(() => {
    if (Me.playList.length === 1 || wx.getStorageSync('playMode') ==='loop') {
      AudioManger.seek(0)
      return
    }
    Me.changeIndex('next')
  }, 240),
  // 循环
  changeIndex(type = 'pre') {
    //sequence: 0顺序, loop: 1循环, random: 2随机
    let idx = this.currentIndex
    let list = this.playList
    let playMode = wx.getStorageSync('playMode')
    // 上一首
    if (type === 'pre') {
      if (playMode == 'sequence') {
        idx--
        if (idx < 0) {
          idx = list.length - 1
        }
      } else {
        idx = radomInt(0, list.length)
      }
    } else {
      if (playMode == 'sequence') {
        idx++
        if (idx >= list.length) {
          idx = 0
        }
      } else {
        idx = radomInt(0, list.length)
      }
    }
    this.currentIndex = idx
    let item = list[idx]
    let options = {
      id: item.id,
      song: item.name,
      name: item.ar[0].name
    }
    this.setData({
      options,
      currentCover: item.al.picUrl
    }, ()=>{
      this._getSong(options)
    })
    wx.setStorageSync('isPlayId', item.id)
    wx.setStorageSync('currentCover', item.al.picUrl)
  },
  // 切换播放状态
  playMode(e) {
    this.setData({
      playMode: e.detail
    })
  },
  // 隐藏
  hideModal() {
    this.setData({
      showModal: false
    })
  },
  // 展示
  showModal() {
    this.setData({
      showModal: true
    })
  },
  // 播放歌曲
  playThis(e) {
    this.setData({
      options: e.detail,
      currentCover: e.detail.currentCover
    }, () => {
      this.hideModal()
      this._getSong(e.detail)
    })
  },
  // 获取背景音频信息
  _getSong(options) {
    AudioManger.stop()
    wx.showLoading({
      title: '正在加载',
      mask: true
    })

    let currentCover = wx.getStorageSync('currentCover')
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musicUrl',
        id: options.id
      }
    }).then(res => {
      let data = res.result
      if (data) {
        AudioManger.src = data.url
        AudioManger.title = options.song
        AudioManger.epname = options.name
        AudioManger.coverImgUrl = currentCover
        this.setData({
          playState: true
        })
        this._getLyric(options.id)
        this._getSongStatus()
      }
    }).then(() => {
      wx.hideLoading()
    }).catch(() => {
      wx.hideLoading()
    })
  },
  _getLyric(id) {
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musicLyric',
        id: id
      }
    }).then(res => {
      this.setData({
        lyric: res.result.lrc.lyric
      })
    })
  },
  _getSongStatus() {
    // 是否可播放
    AudioManger.onCanplay(() => {
      this.setData({
        SongLoading: false
      })
      if (typeof AudioManger.duration != 'undefined') {
        this._setDuration()
      } else {
        setTimeout(() => {
          this._setDuration()
        }, 900)
      }
    })
    // 缓冲等待
    AudioManger.onWaiting(() => {
      this.setData({
        SongLoading: true
      })
    })

    // 播放错误
    AudioManger.onError((error) => {
      wx.showModal({
        title: '提示',
        content: '嗯~~接口可能有点问题，要不你换首歌~~',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
      })
        
    })

    // 播放监听
    AudioManger.onPlay(res => {
      this.setData({
        playState: true
      })
    })
    // 暂停监听
    AudioManger.onPause(res => {
      this.setData({
        playState: false
      })
    })
    // 监听背景音频开始跳转操作事件
    AudioManger.onSeeking(res => {

    })
    // 监听背景音频完成跳转操作事件
    AudioManger.onSeeked(res => {
      if (AudioManger.paused) {
        AudioManger.play()  
      }
      
    })
    // 监听背景音频自然播放结束事件
    AudioManger.onEnded(res => {
      this.next()
    })
    // v监听背景音频播放进度更新事件，只有小程序在前台时会回调。
    AudioManger.onTimeUpdate(res => {
      if (AudioManger.paused) return
      let currentTime = (AudioManger.currentTime / 60).toFixed(2)
      let rangeVal = parseInt(AudioManger.currentTime / AudioManger.duration * 100)
      if (this.data.showLrc) {
        this.selectComponent('#lyric').timeUpdate(AudioManger.currentTime)
      }
      
      this.setData({
        currentTime,
        rangeVal
      })
    })
    // 监听用户在系统音乐播放面板点击下一曲事件（仅iOS
    AudioManger.onNext(() => {
      this.next()
    })
    // 监听用户在系统音乐播放面板点击上一曲事件（仅iOS
    AudioManger.onNext(() => {
      this.prev()
    })
  },
  
  _setDuration() {
    let time = (AudioManger.duration / 60).toFixed(2)
    this.setData({
      duration: time
    })
  },

})