// pages/recommend/oddjob/productDetail/userEvaluationList/userEvaluationList.js
var util = require('../../../../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluatelist: [
      { headimg: '/image/moren-1.png', nick: '555*222', evaluate: 'henban', time: '2019-10-28', imgs: [
        'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
        'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
        'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
        'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
      ] },
      {
        headimg: '/image/moren-1.png', nick: '555*222', evaluate: 'nb', time: '2019-10-28', imgs: [
          'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
          'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
          'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
          'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
        ]
      },
      {
        headimg: '/image/moren-1.png', nick: '555*222', evaluate: 'gdpl', time: '2019-10-28', imgs: [
          'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
          'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
          'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
          'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
        ]
      },
      {
        headimg: '/image/moren-1.png', nick: '555*222', evaluate: 'henban', time: '2019-10-28', imgs: [
          'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
          'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
          'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
          'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
        ]
      },
      {
        headimg: '/image/moren-1.png', nick: '555*222', evaluate: 'henban', time: '2019-10-28', imgs: [
          'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
          'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
          'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
          'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/hourWorker/banner/banner-cleaning4-first.jpg',
        ]
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var evaluateList = JSON.parse(options.evaluateList);
    that.setData({
      evaluateList: evaluateList
    });

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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})