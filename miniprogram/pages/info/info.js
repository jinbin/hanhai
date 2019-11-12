// pages/info/info.js

const db = wx.cloud.database({
  env: "jinbin-2af1f4"
})

var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['D85'],
    index: 0,
    array1: ['Z', 'L', 'N', 'O', 'Q', 'R', 'S', 'T', 'U', 'W', 'X', 'Y'],
    index1: 0,
    division_index: 0,
    array2: ['Hangzhou METALK Toastmasters Club', 'WestLake Bilingual'],
    index2: 0,
    club_index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    db.collection("clubs").where({
      division: 'Z'
    }).get({
      success: function(res) {
        // console.log(res)
        // console.log(res.data[0]['clubs'])
        that.setData({
          array2: res.data[0]['clubs']
        })
      }
    })
  },

  formSubmit: function(options) {
    console.log("hello")
    console.log(options)
    console.log(options.detail.value.name)

    if (options.detail.value.name == "") {
      util.giveTip("信息不完整，请重新填写")
    } else {
      var that = this
      wx.cloud.callFunction({
        name: 'updateInfo',
        data: {
          district: that.data.array[that.data.index],
          division: that.data.array1[that.data.index1],
          club: that.data.array2[that.data.index2],
          name: options.detail.value.name
        },
        success: res => {
          console.log(res)
          util.giveTip("大区: " + that.data.array[that.data.index] + "\n中区: " + that.data.array1[that.data.index1] + "\n俱乐部: " + that.data.array2[that.data.index2] + "\n姓名: " + options.detail.value.name + "\n个人信息保存成功!")
        }
      })
    }
  },

  formReset: function(options) {
    this.setData({
      index: 0,
      index1: 0,
      index2: 0
    })
  },

  bindPickerClub: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log('设置的俱乐部为: ' + this.data.array2[e.detail.value])
    this.setData({
      index2: e.detail.value
    })
  },

  bindPickerDivision: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log('设置的中区为: ' + this.data.array1[e.detail.value])
    this.setData({
      index1: e.detail.value
    })
    var that = this
    db.collection("clubs").where({
      division: that.data.array1[e.detail.value]
    }).get({
      success: function(res) {
        that.setData({
          array2: res.data[0]['clubs']
        })
      }
    })
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

  }
})