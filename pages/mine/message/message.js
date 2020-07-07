const app = getApp();
var util = require('../../../utils/util.js') 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    loadMoreTip: '疯狂加载中',
    offset: 0,
    limit: 10,
    showType: false,
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
    var that = this;
    wx.setBackgroundColor({
      backgroundColor: '#DDDDDD', // 窗口的背景色为白色
    })
    wx.setBackgroundTextStyle({
      textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
    })

    wx.showNavigationBarLoading();
    this.setData({
      offset: 0,
      limit: 10,
      dataList: []
    });
    this.loadData();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();

  },

  //上拉事件
  onReachBottom() {
    this.setData({
      offset: this.data.offset += 10
    })
    this.loadData()
  },

  loadData:function(){
    var that = this
    that.setData({
      showType: true,
      loadType: true,
      loadMoreTip: '疯狂加载中。。。'
    })
    var data = {
      receiver: app.data.accountId,
      receiverType: app.data.userRole,
      offset: that.data.offset,
      limit: that.data.limit
    }
    util.doGet("/platAccounts/message", data, function (res) {
      // console.log(res)
      if(res[0]){
        that.setData({
          dataList: that.data.dataList.concat(res),
          showType: false,
        })
      }else{
        if (that.data.offset == 0) {
          var loadMoreTip = '暂无数据'
        } else {
          var loadMoreTip = '已没有更多数据'
        }
        that.setData({
          showType: true,
          loadType: false,
          loadMoreTip: loadMoreTip
        })
      }
      
    })
  },

  read:function(e){
    if (!e.currentTarget.dataset.isread){
      var list = this.data.dataList;
      list[e.currentTarget.dataset.index].lookOver = true
      this.setData({
        dataList: list
      })
      util.doPost("/platAccounts/" + e.currentTarget.dataset.id + "/message", '', function (res) {

      })
    }
    

    // wx.switchTab({
    //   url: e.currentTarget.dataset.url
    // })
  }


})