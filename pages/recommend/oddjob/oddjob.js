var util = require('../../../utils/util.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverlist: [
      { imageUrl: "/image/hourCleaning.png", description: "钟点保洁", url: "hourCleaning/hourCleaning" },
      { imageUrl: "/image/appliancesCleaning.png", description: "家电清洗", url: "appliancesCleaning/appliancesCleaning" },
      { imageUrl: "/image/appliancesRepair.png", description: "家电维修", url: "appliancesRepair/appliancesRepair" },
      { imageUrl: "/image/unlock.png", description: "开换", url: "unlock/unlock" },
      { imageUrl: "/image/dredgePipeline.png", description: "管道疏通", url: "dredgePipeline/dredgePipeline" },
      { imageUrl: "/image/removeHCHO.png", description: "甲醛治理", url: "removeHCHO/removeHCHO" },
      { imageUrl: "/image/mitesRemoval.png", description: "除尘除螨", url: "mitesRemoval/mitesRemoval" },
      { imageUrl: "/image/leatherCare.png", description: "皮具护理", url: "leatherCare/leatherCare" }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadBanner();
    this.loadRecommend();
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

  //查询banner
  loadBanner: function () {
    var that = this;
    util.doBaseGet("/advertisingPics/oddjob", function (res) {
      that.setData({
        bannerList: res
      })
    })
  },

  toDetailPic:function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    });
  },

  loadRecommend:function(){
    var that = this
    var data = {
      platform: "wechat",
      businessTypeId: "6,7,9,10,11"
    }
    util.doGet("/productRecommend/queryList", data, function (res) {
      console.log(res)
      that.setData({
        recommendList: res.data
      })
    })
  },

  //跳转服务
  goServer: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    });
  },

  //进入产品详情
  toDetail:function(e){
    var activityid = e.currentTarget.dataset.activityid;
    if(!activityid){
      activityid = ''
    }
    wx.navigateTo({
      url: '/pages/recommend/oddjob/productDetail/productDetail?productId=' + e.currentTarget.dataset.productid + '&activityId=' + activityid,
    });
  }

})