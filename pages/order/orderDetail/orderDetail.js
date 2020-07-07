// 订单详情
const app = getApp();
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前步骤
    current: 0,
    role: app.data.userRole,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    that.setData({
      id: options.id
    })

  },

  //获取详情 
  loadData: function () {
    var that = this;
    var data = {
      id: that.data.id
    }
    util.doGet("/signSafeguard/query/commission/detail", data, function (res) {
      console.log(res)
      var status = res[0].status;
      var current = 0;
      if (status == '51') {
        current = 0;
      } else if (status == '52') {
        current = 1;
      } else if (status == '53') {
        current = 2;
      } else if (status == '54') {
        current = 3;
      }
      // if (status == 'payment') {
      //   current = 0;
      // } else if (status == 'confirm') {
      //   current = 1;
      // } else if (status == 'service') {
      //   current = 2;
      // } else if (status == 'success') {
      //   current = 3;
      // }
      // var insurancePics = []
      // var insuranceContent = ''
      // if (res[0].insuranceFile.length > 0) {
      //   insurancePics = res[0].insuranceFile[0].path.split(",")
      //   insuranceContent = res[0].insuranceFile[0].remark
      // }
      var backCheckPics = []
      var backCheckContent = ''
      var contractPics = []
      var salaryPics = []
      var salaryDiscuss = ''
      if (res[0].fileList != null && res[0].fileList.length > 0) {
        var fileList = res[0].fileList
        for (var i in fileList) {
          if (fileList[i].fileType == 'background-file') {
            that.setData({
              backCheckId: fileList[i].id
            })
            backCheckPics = fileList[i].filePaths
            backCheckContent = fileList[i].remark
          } else if (fileList[i].fileType == 'contract-file') {
            contractPics = contractPics.concat(fileList[i].filePaths)
          // } else if (fileList[i].fileType == 'employer-card') {
          //   contractPics = contractPics.concat(fileList[i].filePaths)
          // } else if (fileList[i].fileType == 'housekeeper-card') {
          //   contractPics = contractPics.concat(fileList[i].filePaths)
          } else if (fileList[i].fileType == 'salary-protocol') {
            salaryPics = fileList[i].filePaths
            salaryDiscuss = fileList[i].remark
          }

        }
      }

      var insurancePics = []
      var insuranceContent = ''
      if (res[0].insuranceFile != null && res[0].insuranceFile.length > 0) {
        that.setData({
          insuranceId: res[0].insuranceFile[0].id
        })
        insurancePics = res[0].insuranceFile[0].path.split(",")
        insuranceContent = res[0].insuranceFile[0].remark
      }
      var healthPics = []
      var healthContent = ''
      if (res[0].healthFile != null && res[0].healthFile.length > 0) {
        that.setData({
          healthId: res[0].healthFile[0].id
        })
        healthPics = res[0].healthFile[0].path.split(",")
        healthContent = res[0].healthFile[0].remark
      }
      that.setData({
        dataDetail: res[0],
        discussList: res[0].discussList,
        contract: res[0].contract,
        backCheckPics: backCheckPics,
        backCheckContent: backCheckContent,
        insuranceOrderId: res[0].insuranceOrderId,
        insurancePics: insurancePics,
        insuranceContent: insuranceContent,
        healthOrderId: res[0].healthOrderId,
        healthPics: healthPics,
        healthContent: healthContent,
        contractPics: contractPics,
        salaryPics: salaryPics,
        salaryDiscuss: salaryDiscuss,
        current: current
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
    this.loadData();
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

  previewPic: function (e) {

    var current = e.target.dataset.src
    // console.log(current)
    var imagesrc = e.target.dataset.pics
    wx.previewImage({
      current: current,
      urls: imagesrc
    })
  },

  //拨打电话
  toMakePhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone + ''
    })
  },

  openMap: function () {
    var position = this.data.contract.position.split(',')
    wx.openLocation({
      latitude: Number(position[1]),
      longitude: Number(position[0]),
      name: this.data.contract.serviceArea
    })
  },

  toList: function (e) {
    wx.switchTab({
      url: '/pages/order/order',
    })
  },

  toRecord: function () {
    wx.navigateTo({
      url: '../record/record?orderId=' + this.data.id,
    })
  },

  
})