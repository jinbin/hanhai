//app.js
App({

  globalData: {
    openId: ""
  },

  onLaunch: function () {
    var that = this

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    wx.cloud.init({
      traceUser: true,
      env: 'jinbin-2af1f4'
    })

    wx.cloud.callFunction({
      name: 'getOpenId',

      success: res => {
        console.log(res.result.openid)
        that.globalData["openId"] = res.result.openid
      }
    })

    this.globalData = {
    }
  }
})
