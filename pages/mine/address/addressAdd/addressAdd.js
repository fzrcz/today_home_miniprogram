const app = getApp();
var util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // region: ['福建省', '福州市', '鼓楼区'],
    check: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      // name: wx.getStorageSync("nickName"),
      phone: wx.getStorageSync("phone")
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
    var address = wx.getStorageSync("address");
    var area = wx.getStorageSync("area");
    var lat = wx.getStorageSync("lat");
    var lng = wx.getStorageSync("lng");
    wx.removeStorageSync("address")
    wx.removeStorageSync("area")
    wx.removeStorageSync("lat")
    wx.removeStorageSync("lng")
    if (address) {
      this.setData({
        areaId: area,
        address: address,
        latitude: lat,
        longitude: lng,
      })
    }
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


  onChange(event) {
    const detail = event.detail;
    this.setData({
      'check': detail.value
    })

  },

  // bindRegionChange(e) {
  //   this.setData({
  //     region: e.detail.value
  //   })
  // },

  formSubmit: function(e) {
    var that = this;
    if (e.detail.value.name == '') {
      wx.showToast({
        title: '联系人不能为空',
        icon: 'none'
      })
      return;
    }
    if (e.detail.value.phone.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
      return;
    }
    if (e.detail.value.address == '') {
      wx.showToast({
        title: '请选择服务地址',
        icon: 'none'
      })
      return;
    }
    if (e.detail.value.houseNumber == '') {
      wx.showToast({
        title: '门牌号不能为空',
        icon: 'none'
      })
      return;
    }
    var data = {
      accountId: app.data.accountId,
      name: e.detail.value.name,
      tell: e.detail.value.phone,
      areaId: e.detail.value.areaId,
      address: e.detail.value.address,
      houseNumber: e.detail.value.houseNumber,
      check: that.data.check,
      // 纬度
      latitude:that.data.latitude,
      // 经度
      longitude:that.data.longitude,
    }
    console.log("保存地址,传参", data)
    util.doPut("/account/serveAddress", data, function(res) {
      // console.log(res);
      wx.navigateBack({
        delta: 1
      })
    })
  },

  toSearch: function() {
    wx.navigateTo({
      url: '/pages/mine/address/searchAddr/searchAddr',
    })
  }

})