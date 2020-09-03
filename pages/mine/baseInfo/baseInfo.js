const app = getApp();
var util = require('../../../utils/util.js')
var sexList = ['男', '女'];
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
    var that = this
    util.doBaseGet("/employers/basics/" + app.data.accountId, function (res) {
      // console.log(res)
      that.setData({
        name: res.name,
        nickname: res.nickname,
        headPic: res.headPic,
        sex: res.sex,
        auth: res.auth,
        phone: res.phone
      })

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
    var nickname = wx.getStorageSync('nickname')
    if (nickname) {
      this.setData({
        nickname: nickname
      })
      wx.removeStorageSync('nickname')
    }
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

  },

  //更换头像
  chooseImg: function () {
    var that = this
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed'],
      count: 1,
      success: function (res) {
        util.doPostImg("/employer/" + app.data.accountId, res.tempFilePaths[0], function (res1) {
          // console.log('上传图片', res1)

        })
        that.setData({
          headPic: res.tempFilePaths[0]
        })
      }
    })
  },

  //查看头像大图
  previewheadPic: function (e) {
    console.log(e);
    var current = e.target.dataset.src
    // console.log(current)
    var imagesrc = [current]
    wx.previewImage({
      current: current,
      urls: imagesrc
    })
  },

  //改变性别
  chooseSex: function () {
    var that = this;
    wx.showActionSheet({
      itemList: sexList,
      success: function (e) {
        var data = {
          id: app.data.accountId,
          sex: e.tapIndex + 1
        }
        util.doPost('',"/employer", data, function (res) {
          if (res) {
            wx.showToast({
              title: '修改成功',
              icon: 'none'
            })
          }
        })
        that.setData({
          sex: sexList[e.tapIndex]
        });
      }
    })
  },
})