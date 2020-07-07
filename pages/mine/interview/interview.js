const app = getApp();
var util = require('../../../utils/util.js') 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    loadMoreTip: '疯狂加载中',
    offset: 0,
    limit: 10,
    showType: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
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
    this.setData({
      offset: this.data.offset += 10
    })
    // this.showLoadMore();
    this.loadData()
  },

  loadData: function () {
    var that = this
    that.setData({
      showType: true,
      loadType: true,
      loadMoreTip: '疯狂加载中。。。'
    })
    var data = {
      offset: that.data.offset,
      limit: that.data.limit
    }
    util.doGet("/interview/" + app.data.accountId+"/employers", data, function (res) {
      if (res[0]) {
        that.setData({
          dataList: that.data.dataList.concat(res),
          showType: false,
        })
      } else {
        if (that.data.offset == 0){
          that.setData({
            showType: true,
            loadType: false,
            loadMoreTip: '暂无数据'
          })
        }else{
          that.setData({
            showType: true,
            loadType: false,
            loadMoreTip: '已没有更多数据'
          })
        }
      }

    })
  },

  toCall:function(e){
    // console.log(e.currentTarget.dataset.phone)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone+""
    })
  }
})