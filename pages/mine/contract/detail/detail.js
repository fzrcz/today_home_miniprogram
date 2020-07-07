const app = getApp();
var util = require('../../../../utils/util.js') 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.doBaseGet("/signSafeguard/query/contract/detail?id=" + options.id, function (res) {
      console.log(res)
      if (res[0].fileList != null) {
        var list = []
        for (var i = 0; i < res[0].fileList.length; i++) {
          
          if (res[0].fileList[i].fileType == 'contract-file') {
            list = res[0].fileList[i].filePaths
          }
          // if (res[0].fileList[i].fileType != "employerCard" && res[0].fileList[i].fileType != "housekeeperCard"){
          //   list.push(res[0].fileList[i].filePath)
          // }
        }
      }
      that.setData({
        contractNo: res[0].contractNo,
        status: '0',
        startTime: res[0].effectTime,
        endTime: res[0].efficacyTime,
        salary: res[0].salary,
        remark: res[0].discuss,
        employerName: res[0].employerName,
        employerTel: res[0].employerTell,
        //employerAddr: res.employerAddress,
        employerIdcard: res[0].employerIdNo,
        housekeeperName: res[0].housekeeperName,
        housekeeperTel: res[0].housekeeperTell,
        //housekeeperAddr: res.housekeeperAddress,
        housekeeperIdcard: res[0].housekeeperIdNo,
        brokerName: res[0].staffName,
        brokerTel: res[0].staffTell,
        //brokerAddr: res.staffAddress
        imgList:list
      })
    })
  },

  //查看大图
  previewheadPic: function (e) {
    var current = e.target.dataset.src
    var imagesrc = this.data.imgList;
    wx.previewImage({
      current: current,
      urls: imagesrc
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

})