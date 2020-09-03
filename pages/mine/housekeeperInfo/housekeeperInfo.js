const app = getApp();
var util = require('../../../utils/util.js') 
var statuskeyList = ['work', 'rest', 'appoint'];
var statusList = ['上班中', '找工作', '已预定'];

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
    var that = this
    util.doBaseGet("/housekeeper/" + app.data.accountId, function (res) {
      // console.log(res)
      that.setData({
        name: res.name,
        nickname: res.nickname,
        headPic: res.headPic,
        workStatus: res.personStatus,
        auth: res.auth,
        workIntent: res.workIntent
      })

    })
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

  //更换头像
  chooseImg: function () {
    var that = this
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed'],
      count: 1,
      success: function (res) {
        util.doPostImg("/housekeepers/" + app.data.accountId, res.tempFilePaths[0], function (res1) {
          if (res1){
            that.setData({
              headPic: res.tempFilePaths[0]
            })
            wx.showToast({
              title: '修改成功',
              icon: 'none'
            })
          }
        }) 
      }
    })
  },
  //工作状态
  chooseWorkStatus:function(){
    var that = this;
    wx.showActionSheet({
      itemList: statusList,
      success: function (e) {
        var data = {
          id:app.data.accountId,
          personStatus: statuskeyList[e.tapIndex]
        }
        util.doPost('',"/housekeeper", data, function (res) {
          if(res){
            wx.showToast({
              title: '修改成功',
              icon: 'none'
            })
          }
        })
        that.setData({
          workStatus: statusList[e.tapIndex]
        });
      }
    })
  },
  //已实名
  toAuth:function(e){
    wx.navigateTo({
      url: '/pages/mine/auth/auth',
    })
  },

  toIntention:function(){
    wx.navigateTo({
      url: 'intention/intention',
    })
  },

  toServiceArea: function () {
    wx.navigateTo({
      url: 'serviceArea/serviceArea',
    })
  },

  toCert:function(e){
    wx.navigateTo({
      url: 'cert/cert',
    })
  },

  toWorkStyle:function(){
    wx.navigateTo({
      url: 'workStyle/workStyle',
    })
  },

  toBaseInfo:function(){
    wx.navigateTo({
      url: 'baseInfo/baseInfo',
    })
  },

  toRecord:function(){
    wx.navigateTo({
      url: 'record/record',
    })
  }

})