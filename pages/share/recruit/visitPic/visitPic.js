const app = getApp();
var util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    faceSrc: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.doBaseGet("/housekeeper/" + app.data.accountId + "/basics", function (res) {
      if (res.visualizePicDto){
        that.setData({
          faceSrc: [res.visualizePicDto.visualizePicUrl],
        })
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


  chooseImageFace: function () {
    var that = this
    if (that.data.auth) {
      return;
    }
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed'],
      count: 1,
      success: function (res) {
        util.doPostImg("/housekeepers/" + app.data.accountId, res.tempFilePaths[0], function (res1) {
          if (res1) {
            that.setData({
              faceSrc: res.tempFilePaths[0]
            })
            
          }
        }) 
      }
    })
  },


  toSkip: function () {
    wx.navigateTo({
      url: '../workStyle/workStyle',
    })
  },

  
})