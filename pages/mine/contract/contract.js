const app = getApp();
var util = require('../../../utils/util.js') 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: app.data.userRole,
    showType: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
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

  loadData: function () {
    var that = this
    that.setData({
      showType: true,
      loadType: true,
      loadMoreTip: '疯狂加载中。。。'
    })
    util.doBaseGet("/contracts/"+app.data.accountId+"/" + app.data.userRole, function (res) {
      console.log(res)
      if (res[0]) {
        that.setData({
          dataList: res,
          showType: false,
        })
      } else {
        that.setData({
          showType: true,
          loadType: false,
          loadMoreTip: '暂无数据'
        })
      }
    })
  },

  toDetail:function(e){
    wx.navigateTo({
      url: 'detail/detail?id=' + e.currentTarget.dataset.id,
    })
  }

})