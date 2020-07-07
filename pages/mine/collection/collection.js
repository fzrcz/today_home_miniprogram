const app = getApp();
var util = require('../../../utils/util.js') 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否隐藏数据加载提示
    showType: false,
    //scroll-view高度
    scrollTop: 0,
    dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      showType: true,
      loadType: true,
      loadMoreTip: '疯狂加载中。。。'
    })
    util.doBaseGet("/employers/housekeepers/" + app.data.accountId, function (res) {
      // console.log(res)
      if (res[0]){
        that.setData({
          dataList: res,
          showType: true,
          loadType: false,
          loadMoreTip: '已没有更多数据'
        })
      }else{
        that.setData({
          dataList: res,
          showType: true,
          loadType: false,
          loadMoreTip: '暂无数据'
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

  onPageScroll(event) {
    this.setData({
      scrollTop: event.scrollTop
    })
  },

  //阿姨详细信息
  toDetail: function (e) {
    var id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/recommend/housekeeperDetail/housekeeperDetail?housekeeperId=' + id,
    })
  }
})