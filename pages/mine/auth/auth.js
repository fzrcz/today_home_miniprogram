const app = getApp();
var util = require('../../../utils/util.js') 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    faceSrc: [],
    otherSrc: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.doBaseGet("/" + app.data.userRole +"s/" + app.data.accountId+"/identity" , function (res) {
      // console.log(res)
      that.setData({
        faceSrc: [res.front],
        otherSrc: [res.back],
        auth:res.auth
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // },


  chooseImageFace: function () {
    var that = this
    if (that.data.auth) {
      return;
    }
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      count: 1,
      success: function (res) {
        // console.log(res)
        that.setData({
          faceSrc: res.tempFilePaths
        })
      }
    })
  },

  chooseImageOther: function () {
    var that = this
    if (that.data.auth) {
      return;
    }
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      count: 1,
      success: function (res) {
        // console.log(res)
        that.setData({
          otherSrc: res.tempFilePaths
        })
      }
    })
  },

  uploadImg: function (res) {
    var that = this;
    if(that.data.auth){
      return;
    }
    var faceList = this.data.faceSrc
    var otherList = this.data.otherSrc
    if (faceList[0] == null || faceList.length == 0 || otherList.length == 0 || otherList[0] == null) {
      wx.showToast({
        title: '请上传身份证的正反面',
        icon: "none",
        duration: 1000
      })
    } else {
      wx.showLoading({
        title: '上传中',
      })
      var houseUserId = wx.getStorageSync('houseUserId');
      var complete = false;

      /**
       * 上传身份证正面
       */
      if (faceList[0].indexOf('jrdj') <= 0) {
        var data = {
          imageType:'front',
          housekeeperId: app.data.accountId
        }
        util.doPostImgData("/" + app.data.userRole +"s/identity/auth", faceList[0], data, function (res1) {
        })
      }

      /**
       * 上传身份证背面
       */
      if (otherList[0].indexOf('jrdj') <= 0) {
        var data = {
          imageType: 'back',
          housekeeperId: app.data.accountId
        }
        util.doPostImgData("/" + app.data.userRole +"s/identity/auth", otherList[0], data, function (res1) {
          // console.log(res1)
          wx.hideLoading()
          if (res1 == 'true'){
            wx.showToast({
              title: '上传成功',
              icon: "none",
              duration: 1000
            })
            that.setData({
              auth: true
            })
            
          }else{
            wx.showToast({
              title: '上传失败，请上传您的真实身份证',
              icon: "none",
              duration: 1000
            })
          }
        })
      }
     
    }


  },
})