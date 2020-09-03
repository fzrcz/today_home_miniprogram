const app = getApp();
var util = require('../../../../utils/util.js') 
var intentionStr = ''
var subIntentionStr = ''

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
    var that = this
    util.doBaseGet("/housekeepers/" + app.data.accountId + "/workIntents/parent", function (res) {
      var data = res;
      that.setData({
        dataList: data
      })
      for (var i = 0; i < data.length; i++) {
        if (data[i].checked) {
          intentionStr += data[i].id;
          util.doBaseGet("/housekeepers/" + app.data.accountId + "/workIntents/" + data[i].id +"/children", function (res1) {
            var subData = res1;
            that.setData({
              subDataList: subData
            })
            for (var j = 0; j < subData.length; j++) {
              if (subData[j].checked) {
                subIntentionStr += subData[j].id + ",";
              }
            }
          })
        }
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


  radioChange(e) {
    var that = this
    var allGoodsBK = that.data.dataList;
    var checkArr = e.detail.value;
    intentionStr = e.detail.value;
    util.doBaseGet("/housekeepers/" + app.data.accountId + "/workIntents/" + e.detail.value + "/children", function (res1) {
      var subData = res1;
      that.setData({
        subDataList: subData
      })
      
    })
    //更改点击
    for (var i = 0; i < allGoodsBK.length; i++) {
      if (checkArr.indexOf(allGoodsBK[i].id) != -1) {
        allGoodsBK[i].checked = true;
      } else {
        allGoodsBK[i].checked = false;
      }

    }
    that.setData({
      dataList: allGoodsBK
    });
  },

  switchSelect(e) {

    var that = this;
    var length = e.detail.value.length;
    subIntentionStr = ''
    for (var i = 0; i < length; i++) {
      subIntentionStr += e.detail.value[i] + ',';
    }

    var allGoodsBK = that.data.subDataList;
    var checkArr = e.detail.value;
    //更改点击
    for (var i = 0; i < allGoodsBK.length; i++) {
      if (checkArr.indexOf(allGoodsBK[i].id) != -1) {
        allGoodsBK[i].checked = true;
      } else {
        allGoodsBK[i].checked = false;
      }

    }
    that.setData({
      subDataList: allGoodsBK
    });

  },

  toSkip: function () {
    wx.navigateTo({
      url: '../serviceArea/serviceArea',
    })
  },

  confirm:function(){
    // console.log(subIntentionStr + intentionStr)
    var data = subIntentionStr + intentionStr
    if (data){
      util.doPost('',"/housekeepers/" + app.data.accountId + "/workIntents", data, function (res) {
      })
    }
    
    wx.navigateTo({
      url: '../serviceArea/serviceArea',
    })
    
    

  }

})