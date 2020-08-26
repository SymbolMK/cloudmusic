
import { debounce } from '../../common/utils/index'
let Me = this
Page({
  data: {
    playlist: [],
    info: {},
    relatedVideos: null,
    isPlayId: wx.getStorageSync('isPlayId'),
    trackIds: wx.getStorageSync('trackIds') || [],
    canScroll: false
  },
  onLoad: function (options) {
    Me = this
    wx.showLoading({
      title: '正在加载',
      mask: true,
    });
      
    this._getList(options)
  },
  onReady: function () {

  },
  onShow: function () {

  },
  // 播放全部
  playAll() {
    let playlist = this.data.playlist
    let item = playlist[0]
    wx.setStorageSync('isPlayId', item.id)
    wx.setStorageSync('currentCover',item.al.picUrl);
    wx.setStorageSync('trackIds', playlist)
    wx.navigateTo({
      url: `/pages/player/index?id=${item.id}&song=${item.name}&name=${item.ar[0].name}`
    });
  },
  // 腹肌滚动高度
  outScroll(e) {
    if(e.detail.scrollTop> 190) {
      this.setData({
        canScroll: true
      })
      wx.setNavigationBarTitle({
        title: this.data.info.name,
      })
        
    } else {
      this.setData({
        canScroll: false
      })
      wx.setNavigationBarTitle({
        title: '歌单',
      })
    }
  },
  // 立即播放
  playThis: debounce((e) => {
    let { item } = e.currentTarget.dataset
    Me.setData({
      isPlayId: item.id
    })
    wx.setStorageSync('isPlayId', item.id)
    wx.setStorageSync('currentCover',item.al.picUrl);
      
    let {trackIds, playlist} = Me.data
    if (trackIds && trackIds.findIndex(el => el.id === item.id) >-1) {
      wx.navigateTo({
        url: `/pages/player/index?id=${item.id}&song=${item.name}&name=${item.ar[0].name}`
      })
      return
    }
    wx.setStorageSync('trackIds', playlist)
    wx.navigateTo({
      url: `/pages/player/index?id=${item.id}&song=${item.name}&name=${item.ar[0].name}`
    });
      
  }, 300),
  _getList(options) {
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musiclist',
        id: options.id
      }
    }).then(res => {
      let data = res.result
      this.setData({
        playlist: data.playlist.tracks,
        info: {
          creator: data.playlist.creator,
          backgroundCoverId: data.playlist.backgroundCoverId,
          backgroundCoverUrl: data.playlist.backgroundCoverUrl,
          commentCount: data.playlist.commentCount,
          commentThreadId: data.playlist.commentThreadId,
          coverImgId: data.playlist.coverImgId,
          coverImgId_str: data.playlist.coverImgId_str,
          coverImgUrl: data.playlist.coverImgUrl,
          createTime: data.playlist.createTime,
          description: data.playlist.description,
          id: data.playlist.id,
          name: data.playlist.name,
          playCount: data.playlist.playCount,
          shareCount: data.playlist.shareCount,
          subscribed: data.playlist.subscribed,
          subscribedCount: data.playlist.subscribedCount,
          subscribers: data.playlist.subscribers,
          tags: data.playlist.tags,
          trackCount: data.playlist.trackCount,
          userId: data.playlist.userId,
          updateTime: data.playlist.updateTime,
          trackUpdateTime: data.playlist.trackUpdateTime,
          trackNumberUpdateTime: data.playlist.trackNumberUpdateTime,
        },
        relatedVideos: data.relatedVideos
      })
    }).then(() => {
      wx.hideLoading()
    })
  }
})