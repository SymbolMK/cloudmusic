//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      try {
        wx.cloud.init({
          // env 参数说明：
          //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
          //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
          //   如不填则使用默认环境（第一个创建的环境）
          env: 'cloud-xo8ot',
          traceUser: true
        })
      } catch(e) {

      } finally {
        wx.cloud.callFunction({
          name: 'login',
          data: {}
        }).then(res => {
          console.log(res)
          this.globalData.loginInfo = res.result
        })
        this._getUserInfo()        
      }
    }

    this.globalData = {}
  },
  _getUserInfo() {
    if (!wx.getStorageSync('userInfo')) {
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: (result)=>{
                            wx.setStorageSync('userInfo', result.userInfo);
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(result)
                            }
                        }
                    })
                }
            }
        })
    }
},
  globalData: {}
})
