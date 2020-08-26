
Component({
  properties: {
    lyric: {
      type: String,
      default: '',
      observer: function (nval) {
        if (!nval) {
          this.setData({
            lyricList: [{
              timeSec: 0,
              lrc: '暂无歌词'
            }],
            currentIndex: -1,

          })
          return
        }
        this._formatLyric(nval)
      }
    }
  },

  data: {
    lyricList: [],
    currentIndex: -1,
    lineHeight: 0,
    scrollTop: 0
  },
  ready() {
    this._formatL()
  },
  methods: {
    // 计算高度
    _formatL() {
      let { screenWidth } = wx.getSystemInfoSync()
      this.setData({
        lineHeight: screenWidth / 750 * 48
      })
    },
    _formatLyric(lyric) {
      let _ret = lyric.split('\n')
      let _list = []
      _ret.forEach(el => {
        let time = el.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time) {
          let lrc = el.split(time[0])[1]
          let _times = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          let timeSec = parseInt(_times[1]) * 60 + parseInt(_times[2]) + parseInt(_times[3]) / 1000
          _list.push({
            lrc,
            timeSec
          })
        }
      })

      this.setData({
        lyricList: _list
      }, () => {
        this.timeUpdate()
      })
    },
    // 隐藏歌词
    hideLrc() {
      this.triggerEvent('hideLrc')
    },
    timeUpdate(currentTime) {
      let { lyricList, lineHeight, currentIndex } = this.data
      if (!lyricList.length) return
      if (currentTime > lyricList[lyricList.length-1].timeSec) {
        // if (currentIndex != -1) {
          
        // }
        this.setData({
          currentIndex: -1,
          scrollTop: (lyricList.length - 1) * lineHeight
        })
        console.log(currentTime, lyricList[lyricList.length-1].timeSec, lyricList.length * lineHeight)
        return
      }
      for (let i = 0; i < lyricList.length; i++) {
        const el = lyricList[i]
        if (currentTime <= el.timeSec) {
          this.setData({
            currentIndex: i - 1,
            scrollTop: (i - 1) * lineHeight
          })
          break
        }

      }
    }
  }
})
