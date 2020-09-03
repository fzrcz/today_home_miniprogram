var certStr = ''
const app = getApp();
var util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    util.doBaseGet("/housekeepers/" + app.data.accountId + "/authMaterials", function(res) {
      // console.log(res)
      for (var j = 0; j < res.length; j++) {
        if (res[j].check) {
          certStr += res[j].id + ",";
        }
      }
      that.setData({
        dataList: res
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  switchSelect(e) {

    var that = this;
    var length = e.detail.value.length;
    certStr = ''
    for (var i = 0; i < length; i++) {

      // if (i < length - 1) {
      certStr += e.detail.value[i] + ',';
      // } else {
      //   certStr += e.detail.value[i]
      // }
    }

    var allGoodsBK = that.data.dataList;
    var checkArr = e.detail.value;
    //更改点击
    for (var i = 0; i < allGoodsBK.length; i++) {
      if (checkArr.indexOf(allGoodsBK[i].id) != -1) {
        allGoodsBK[i].check = true;
      } else {
        allGoodsBK[i].check = false;
      }

    }
    that.setData({
      dataList: allGoodsBK
    });

  },

  confirm: function() {
    var data = certStr.substring(0, certStr.length - 1);
    if (data) {
      util.doPost('',"/housekeepers/" + app.data.accountId + "/authMaterials", data, function(res) {
        if (res) {
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })

        }

      })
    } else {
      wx.showToast({
        title: '请选择证件资料',
        icon: "none"
      })
    }


  }

})