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
    // this.setData({
    //   // statusList: statusList,
    //   nickname: wx.getStorageSync("nickName")
    // })
    var that = this
    
    util.doBaseGet("/housekeeper/" + app.data.accountId + "/basics", function (res) {
      console.log(res)
      if (res.nativeName == null) {
        var native = ["福建省", "福州市", "鼓楼区"]
      } else {
        var native = res.nativeName.split(",")
      }

      if (res.birthMonth == null || res.birthMonth == '') {
        var birthMonth = '1975-01'
      } else {
        var birthMonth = res.birthMonth
      }

      that.setData({
        name: res.name,
        auth: res.auth,
        nickname: res.nickname,
        birthMonth: birthMonth,
        idNo: res.idNo,
        native: native,
     
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
  
  

  //改变出生年月
  chooseBirthMonth: function (e) {

    // var birth = e.detail.value.replace("-", "")
    // var data = {
    //   id: app.data.accountId,
    //   birthMonth: birth
    // }
    // util.doPost("/housekeeper", data, function (res) {
    //   if (res) {

    //   }
    // })

    this.setData({
      birthMonth: e.detail.value
    });
  },


  //改变籍贯
  changeNative(e) {
    // var region = e.detail.value
    // var data = {
    //   id: app.data.accountId,
    //   nativeId: region[0] + region[1] + region[2]
    // }
    // util.doPost("/housekeeper", data, function(res) {
    //   console.log(res);
    //   if (res) {
    //     // wx.showToast({
    //     //   title: '修改成功',
    //     //   icon: 'none'
    //     // })
    //   }
    // })
    this.setData({
      native: e.detail.value
    })
  },

  nameInput: function(e) {
    var that = this;
    that.setData({
      nickname: e.detail.value
    })
  },

  idNoInput: function(e){
    this.setData({
      idNo: e.detail.value
    })
  },

  toSkip: function() {
    wx.navigateTo({
      url: '../intention/intention',
    })
  },

  toNext: function() {
    if (this.data.idNo){
      if (this.data.idNo.length > 0 && this.data.idNo.length != 18) {
        wx.showToast({
          title: '请输入正确的身份证号码',
          icon: 'none'
        })
        return
      }
    }
    var region = this.data.native
    // console.log(region)
    var birth = this.data.birthMonth.replace("-", "")
    var data = {
      id: app.data.accountId,
      nickname: this.data.nickname,
      idNo: this.data.idNo,
      nativeId: region[0] + region[1] + region[2],
      birthMonth: birth
    }
    util.doPost("/housekeeper", data, function (res) {
    })

    wx.navigateTo({
      url: '../workInfo/workInfo',
    })
    
  }
})