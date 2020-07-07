// pages/mine/myClient/myInvitation/myInvitation.js
var app = getApp();
var util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curPageNum: 1,
    myClientList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = {
      agentId: wx.getStorageSync('agentId'),
      curPageNum: this.data.curPageNum
    }
    this.getRecordList(data)

  },
  getRecordList(data) {
    util.doGet("/business/agent/agentShareRecordList", data, res => {
      if(res.success) {
        if(res.data.length == 0) {
          wx.showToast({
            title: '没有更多数据啦~',
            icon: 'none'
          })
          return
        }
        this.setData({
          myClientList: this.data.myClientList.concat(res.data)
        })
      } else {
        wx.showToast({
          title: res.success,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.curPageNum = 1
    this.data.myClientList = []
    let data = {
      agentId: wx.getStorageSync('agentId'),
      curPageNum: this.data.curPageNum
    }
    this.getRecordList(data)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('加载更多')
    this.data.curPageNum++
    let data = {
      agentId: wx.getStorageSync('agentId'),
      curPageNum: this.data.curPageNum
    }
    this.getRecordList(data)
  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})