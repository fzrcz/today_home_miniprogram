const app = getApp();
var util = require('../../../../utils/util.js') 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
    companyId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.doBaseGet("/housekeeper/" + app.data.accountId + "/mien", function (res) {
      if (res) {
        that.setData({
          imageList: res
        })
      }
      // for(var i in res){
      //   that.data.imageList.push(res[i].pic)
      // }
      // console.log(that.data.imageList)
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


  chooseImage: function () {
    var that = this,
      choosePhoto = this.data.imageList
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed'],
      count: 9 - choosePhoto.length,        // 最多可以选择9张图片，默认9
      success: function (res) {
        var imgsrc = res.tempFilePaths
        var data = {
          housekeeperId:app.data.accountId
        }
        util.doPostImgData("/housekeeper/mien", imgsrc[0], data, function (res1) {
          var addstr = {id: res1 ,pic:imgsrc[0] }
          choosePhoto = choosePhoto.concat(addstr)
          that.setData({
            imageList: choosePhoto
          })
        })
        
      }
    })
  },

  previewImage: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imageList;
    var imgArr = [];
    for(var i in imgs){
      imgArr.push(imgs[i].pic)
    }
    wx.previewImage({
      //当前显示图片
      current: imgs[index].pic,
      //所有图片
      urls: imgArr
    })
  },

  closeUploadImg: function (res) {
    // console.log(res)
    var that = this
    var parent = res.currentTarget.dataset.close    // 获取点击的是第几张图片键值
    // console.log(parent)
    var choosePhoto = this.data.imageList
    // choosePhoto = choosePhoto.splice(parent,1)
    var id = choosePhoto[parent].id
    util.doDelete("/housekeeper/" + app.data.accountId + "/mien/" + id, "", function (res) {
      wx.showToast({
        title: '删除成功',
        icon: 'none'
      })
    })
    delete choosePhoto[parent]
    that.setData({
      imageList: choosePhoto
    })
  },

  complete:function(){
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  },

  toCall:function(){
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('selectCompany').tel
    })
    
  }

})