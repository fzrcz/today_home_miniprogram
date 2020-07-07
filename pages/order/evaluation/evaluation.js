// pages/order/evaluation/evaluation.js
const app = getApp();
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rate:0,
    comment:''
  },
  //改变评分
  onChangeRate(e) {
    const index = e.detail.index;
    // console.log(index);
    this.setData({
      rate: index
    })
  },
  //搜索框输入值  
  serachInput: function (e) {
    var that = this;
    that.setData({
      comment: e.detail.value
    })
  },
  //提交
  push:function(){
    var that = this;
    if (that.data.rate == 0) {
      wx.showToast({
        title: '给我们的服务评个分呗！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (that.data.comment==''){
      wx.showToast({
        title: '说说您的使用心得！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
  
    if (app.data.accountId != '' || app.data.accountId !=null){
      var data = {
        employerId: app.data.accountId,
        commissionId: that.data.commissionId,
        score: that.data.rate,
        comment: that.data.comment
      }
      // console.log(data)
      util.doPut("/commission", data, function (res) {
        if(res){
          wx.showToast({
            title: '评价成功！',
            icon: 'none',
            duration: 2000
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: '发布评价失败！',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      commissionId: options.commissionId
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

})