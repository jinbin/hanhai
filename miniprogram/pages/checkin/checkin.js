// pages/tools/checklist/checklist.js

const db = wx.cloud.database({
  env: "jinbin-2af1f4"
})

var util = require('../../utils/util.js');

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: ['会议主持人'],
    index1: 0,
    checklist: {
      "会议主持人": {}
    }
  },

  // help: function(e) {
  //   console.log(e.target.dataset.content)
  //   wx.showModal({
  //     title: '头马助手de提示',
  //     showCancel: false,
  //     confirmColor: "#ff7f50",
  //     confirmText: "复制模板发群里",
  //     content: e.target.dataset.content,
  //     success(res) {}
  //   })
  // },

  // checkboxChange: function(e) {
  //   console.log('checkbox发生change事件，携带value值为：', e)
  //   // console.log(e)

  //   var that = this
  //   console.log(Object.keys(that.data.checklist[that.data.array[that.data.index1]]))

  //   //that.data.index1: 0
  //   //that.data.array: 会议主持人
  //   //that.data.checklist: 
  //   console.log("ok")
  //   var pre = Object.keys(that.data.checklist[that.data.array[that.data.index1]]) || []
  //   var pre_len = (Object.keys(that.data.checklist[that.data.array[that.data.index1]]) || []).length

  //   // 求 a 和 b 数组的差值 
  //   let aSet = new Set(e.detail.value)
  //   let bSet = new Set(pre)
  //   let difference = Array.from(new Set(e.detail.value.concat(pre).filter(v => !aSet.has(v) || !bSet.has(v))))

  //   // 当前是从 未√ 到 √ 状态
  //   if (e.detail.value.length > pre_len) {
  //     wx.showModal({
  //       title: '头马助手de提示',
  //       // showCancel: true,
  //       confirmColor: "#ff7f50",
  //       cancelText: "再想想",
  //       confirmText: "确定完成",
  //       content: that.data.help[that.data.array[that.data.index1]][difference[0]],
  //       success(res) {
  //         if (res.confirm) {
  //           that.data.checklist[that.data.array[that.data.index1]] = {}
  //           for (var i = 0; i < e.detail.value.length; i++) {
  //             console.log(e.detail.value[i])
  //             that.data.checklist[that.data.array[that.data.index1]][e.detail.value[i]] = true
  //           }

  //           console.log(that.data.checklist)
  //           that.setData({
  //             checklist: that.data.checklist
  //           })

  //           wx.setStorage({
  //             key: 'checklist',
  //             data: that.data.checklist
  //           })
  //         } else { // 再想想
  //           console.log("再想想")

  //           // 求 a 和 b 数组的差值 
  //           // let aSet = new Set(e.detail.value)
  //           // let bSet = new Set(pre)
  //           // let difference = Array.from(new Set(e.detail.value.concat(pre).filter(v => !aSet.has(v) || !bSet.has(v))))

  //           that.data.checklist[that.data.array[that.data.index1]] = {}
  //           for (var i = 0; i < pre.length; i++) {
  //             that.data.checklist[that.data.array[that.data.index1]][pre[i]] = true
  //           }

  //           that.setData({
  //             checklist: that.data.checklist
  //           })

  //           wx.setStorage({
  //             key: 'checklist',
  //             data: that.data.checklist
  //           })
  //         }
  //       } // success
  //     }) // showModal
  //   } else { // // 当前是从 √ 到 未√ 状态
  //     that.data.checklist[that.data.array[that.data.index1]] = {}
  //     for (var i = 0; i < e.detail.value.length; i++) {
  //       console.log(e.detail.value[i])
  //       that.data.checklist[that.data.array[that.data.index1]][e.detail.value[i]] = true
  //     }

  //     console.log(that.data.checklist)
  //     that.setData({
  //       checklist: that.data.checklist
  //     })

  //     wx.setStorage({
  //       key: 'checklist',
  //       data: that.data.checklist
  //     })
  //   }
  // },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    var type_val = options.type || "publicspeaking"

    this.setData({
      type_val: type_val
    })

    console.log("onload")

    db.collection("tasks").where({
      type: type_val
    }).get({
      success: function(res) {
        console.log("onload1")
        console.log(res.data[0].tasks)

        that.setData({
          tasks: res.data[0].tasks
        })

        // console.log(res[0].check_count)
        console.log("onload2")

        db.collection("records").where({
          openId: app.globalData.openId
        }).get({
          success: function(res1) {
            console.log(res1)
            console.log(res1.data)
            console.log("WWWWWWWW")
            console.log(res1.data.length)

            if (res1.data.length == 0){
              console.log("起初数据库无对应数据")
              that.setData({
                checked: {},
                check_time: "",
                check_count: 0,
                openId: app.globalData.openId
              })
            }else{
              console.log("起初数据库已有对应数据")
              that.setData({
                checked: res1.data[0][type_val] || {},
                check_time: res1.data[0]["check_time"],
                check_count: res1.data[0]["check_count"] || 0,
                openId: app.globalData.openId
              })
            }
          }
        })

      }
    })
  },

  uncheckin: function(options) {
    console.log("checkin")
    console.log(options)
    console.log(options.target.dataset.id)

    var that = this
    
    wx.showModal({
      content: '是否更改英雄之旅这一项为未完成?',
      showCancel: true,
      confirmText: '我确定',
      confirmColor: '#ff7f50',
      success: function(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'updateRecords',
            data: {
              checkId: options.target.dataset.id,
              type: that.data.type_val,
              value: false,
              check_count: 1
            },
            success: res => {
              console.log("更新完成")

              that.data.checked[options.target.dataset.id] = false
              that.setData({
                checked: that.data.checked,
                check_count: 1
              })
            }
          })
        }
      }
    })
  },

  checkin: function(options) {
    console.log("checkin")
    console.log(options)
    console.log(options.target.dataset.id)

    var that = this

    var today = util.formatTime(new Date())
    console.log(this.data.check_time)
    console.log(this.data.check_count)
    console.log(today)

    if (this.data.type_val != "jinbin" && this.data.check_time == today
      && this.data.check_count == 0
    ){
      wx.showModal({
        content: '每日只能打卡一次，今日已经打卡完成!',
        showCancel: false,
        confirmText: '我确定',
        confirmColor: '#ff7f50',
        success: function(res) {
          console.log(res)
          return
        }
      })
    }else {
      console.log("Hello")

      wx.showModal({
        content: options.target.dataset.desc + '\n是否确定英雄之旅这一项已完成?\n一天只有一次打卡机会，请慎重选择',
        showCancel: true,
        confirmText: '我确定',
        confirmColor: '#ff7f50',
        success: function (res) {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'updateRecords',
              data: {
                checkId: options.target.dataset.id,
                type: that.data.type_val,
                value: true,
                date: today,
                check_count: 0
              },
              success: res => {
                console.log("更新完成")

                that.data.checked[options.target.dataset.id] = true
                that.data.check_time = today
                that.setData({
                  checked: that.data.checked,
                  check_time: today,
                  check_count: 0
                })
              }
            })
          }
        }
      })
    }

    // db.collection("records").doc(
    //   // openId: app.globalData.openId
    //   "001984c3-3e97-4ab7-882a-daa7e33ba643"
    // ).update({
    //   data: {
    //     check_count: 1
    //   },
    //   success: res => {
    //     console.log(res)
    //   },

    //   fail: res => {
    //     console.log(res)
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: "一步步教你做好" + this.data.array[this.data.index1]
    }
  }
})