const app = getApp();
var util = require('../../../../utils/util.js')
var housekeeperId = '';
var employerName = '';
var shareTitle = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    housekeeperId = options.housekeeperId;
    employerName = options.employerName;
    this.setData({
      employerName: employerName
    })
    this.reportInfo(housekeeperId,employerName);
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
    var that = this;
    return {
      title: '致' + employerName + '的一封信',
      path: '/pages/recommend/housekeeperDetail/shareReport/shareReport?housekeeperId=' + housekeeperId + '&employerName=' + employerName,
      success: function (res) {

      },
      fail: function (res) {

      }
    }
  },

  reportInfo: function (housekeeperId, employerName) {
    var that = this
    var housekeeperIds = [];
    var dataList = [];
    housekeeperIds = housekeeperId.split(",");
    for(var i=0;i<housekeeperIds.length;i++){
      if(housekeeperIds[i] != ''&& housekeeperIds[i] !=null){
        var data = {
        }
        util.doGet("/housekeepers/" + housekeeperIds[i], data, function (res) {
           console.log('家政员'+i,res);
          if (res){
            dataList.push(res);
            that.setData({
              dataList: dataList
            })
          }
        })
      }
    }
  },
  //跳转到阿姨个人信息
  goInfo: function (e) {
    var nannyId = e.currentTarget.dataset.nannyid;
    wx.navigateTo({
      url: '/pages/recommend/housekeeperDetail/housekeeperDetail?housekeeperId=' + nannyId,
    })
  },
  /**
 * 返回首页
 */
  toRecommend: function () {
    wx.switchTab({
      url: '/pages/recommend/recommend',
    })
  },
})