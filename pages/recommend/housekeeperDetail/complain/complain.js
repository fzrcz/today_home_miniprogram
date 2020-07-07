const app = getApp();
var util = require('../../../../utils/util.js')
var complaintList = []
var complaintId = 1
var housekeeperId = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    desc:''
  },

  complaintChange({ detail = {} }) {
    for (var i in complaintList){
      if (complaintList[i] == detail.value){
        complaintId = i
      }
    }
    this.setData({
      current: detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    housekeeperId = options.housekeeperId
    util.doBaseGet("/complaint", function (res) {
      complaintList = res;
      that.setData({
        complaint: complaintList,
        current: complaintList[1]
      })
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

  },

  //补充说明输入值  
  descInput: function (e) {
    var that = this;
    that.setData({
      desc: e.detail.value
    })
  },

  submit:function(){
    var that = this
    var data = {
      employerId: app.data.accountId,
      housekeeperId: housekeeperId,
      reason: complaintId,
      description: that.data.desc
    }

    util.doPut("/housekeepers/complaint", data, function (res) {
      if(res){
        wx.showToast({
          title: '举报成功，谢谢您的反馈',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      }
    })

    
  }
})