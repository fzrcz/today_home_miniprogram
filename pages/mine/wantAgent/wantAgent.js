// pages/mine/wantAgent/wantAgent.js
var app = getApp();
var util = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  formSubmit(e) {
    const {name, phone, sex} = e.detail.value
    console.log(name, phone, sex)
    if(!name.trim()) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 1500
      })
      return
    }
    let data ={
      platId: app.data.accountId,
      companyId: wx.getStorageSync('selectCompany').id,
      name,
      phone,
      sex
    }
    util.doPost('form', "/business/agent/apply", data, function (res) {
      if(res.data == null && res.success) {
        wx.showToast({
          title: res.reason,
          icon: 'none',
          duration: 1500
        })
        setTimeout(()=>{
          wx.switchTab({
            url: '/pages/recommend/recommend',
          })
        }, 2000)
      } else {
        wx.showToast({
          title: res.reason,
          icon: 'none',
          duration: 1500
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})