// pages/recommend/defendVirus/defendVirus.js
var app = getApp();
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    srcList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var type = options.type;
    console.log("5656565")
    console.log(type)
    // type 1.展示 守护您的健康的详情图 2.延期通知的详情图 3.防疫要点详情图
    if(type ==1){
      console.log("jinlai le ")
      var content = 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/banner/defendVirusDetail.jpg?v=1'
      that.data.srcList.push(content)
    }
    if(type ==2){
      var content = 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/ad/serviceDelayDetail.jpg?v=2'
      that.data.srcList.push(content)
    }
    if(type ==3){
      var content1 = 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/ad/tip1.jpg?v=2'
      var content2 = 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/ad/tip2.jpg?v=2'
      var content3 = 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/ad/tip3.jpg?v=2'
      var content4 = 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/ad/tip4.jpg?v=2'
      var content5 = 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/ad/tip5.jpg?v=2'
      var content6 = 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/ad/tip6.jpg?v=2'
      var content7 = 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/ad/tip7.jpg?v=2'
      that.data.srcList.push(content1)
      that.data.srcList.push(content2)
      that.data.srcList.push(content3)
      that.data.srcList.push(content4)
      that.data.srcList.push(content5)
      that.data.srcList.push(content6)
      that.data.srcList.push(content7)
    }
    that.setData({
      srcList: that.data.srcList,
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