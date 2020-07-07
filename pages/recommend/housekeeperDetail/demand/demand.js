const app = getApp();
var util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    desc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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


  //补充说明输入值  
  descInput: function (e) {
    var that = this;
    that.setData({
      desc: e.detail.value
    })
  },

  submit: function () {
    var that = this
    var data = {
      employerId: app.data.accountId,
      need: that.data.desc
    }

    util.doPut("/employerNeed", data, function (res) {
      if (res) {
        wx.showToast({
          title: '提交成功，请耐心等待客服联系',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      }
    })


  }
})