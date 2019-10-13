//index.js
const app = getApp()

const db = wx.cloud.database({
  env: "jinbin-2af1f4"
})

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onShow: function (e) {

    var that = this

    wx.getSetting({
      success(res) {
        console.log("success")
        if (res.authSetting['scope.userInfo']) {
          console.log("hasUserInfo")
          that.setData({
            hasUserInfo: true
          })
        } else {
          console.log("!hasUserInfo")
          that.setData({
            hasUserInfo: false
          })
        }
      }
    })
  },

  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      this.setData({
        hasUserInfo: true
      })
    }
  },

  postMessage: function (e) {
    let formId = e.detail.formId
    let num = e.detail.value.num
    let names = e.detail.value.names
    let money = e.detail.value.money
    let activityDesc = e.detail.value.activityDesc

    if (num > 0 && money > 0){

      db.collection("forms").add({
        data: {
          openid: this.data.openid,
          num: num,
          names: names,
          money: money,
          desc: activityDesc,
          isCheck: false,
          create_time: new Date()
        }
      })

      var timestamp = Date.parse(new Date()) / 1000
      var newtimestamp = timestamp + 24 * 60 * 60 * 7
      var n7_to = newtimestamp * 1000

      console.log("TIME")
      console.log(new Date())

      db.collection("formIds").add({
        data: {
          openid: this.data.openid,
          formId: e.detail.formId,
          expire: new Date(n7_to),
          available: true
        }
      })

      wx.navigateTo({
        url: '/pages/success/success',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }else{
      
    }

    // wx.cloud.callFunction({
    //   name: "broadcast",
    //   complete: res => {
    //     console.log("broadcast")
    //     console.log(res.result)
    //   }
    // }),

    // wx.navigateBack({})
  },

  //输入报销人数
  bindNum: function (e) {
    console.log(e.detail.value)
  },

  //填入活动名称
  bindNames: function (e) {
    console.log(e.detail.value)
  },

  //填入活动地址
  bindMoney: function (e) {
    console.log(e.detail.value)
  },

  //填入活动说明
  bindDesInput: function (e) {
    console.log(e.detail.value)
  },

  toMiniProgram: function (e) {
    console.log("toMiniProgram")
    wx.navigateToMiniProgram({
      appId: 'wx09a49d05a365a4e6',
      path: "pages/my/leftdays/leftdays",
      success(res) {
        console.log("SUCCESS")
      }
    })
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    console.log("output")
    wx.cloud.callFunction({
      name: 'output',
      success: res => {
        console.log(res.result.data)
        var sum = 0
        for (var index in res.result.data){
          console.log(res.result.data[index].names + " " + res.result.data[index].money)
          sum = sum + parseFloat(res.result.data[index].money)
        }
        
        console.log("报销金额综合: " + sum)

        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  this.setData({
                    avatarUrl: res.userInfo.avatarUrl,
                    userInfo: res.userInfo
                  })
                }
              })
            }
          } 
        })

        //将所有isCheck true的置为false
        // wx.cloud.callFunction({
        //   name: 'allCheck',
        //   success: res => {
        //     console.log(res)
        //   }
        // })

      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  onShareAppMessage: function(){
    return {
      title: '报销请点击进入登录后提交'
    }
  }

})
