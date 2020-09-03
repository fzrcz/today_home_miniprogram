const app = getApp();
var util = require('../../../../utils/util.js')
var beliefArr = [];
var eduArr = [];
var salaryArr = [];
var salaryIdArr = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expArr: ['0年', '1年', '2年', '3年', '4年', '5年', '6年', '7年', '8年', '9年', '10年', '11年', '12年', '13年', '14年', '15年', '16年', '17年', '18年', '19年', '20年'],
    expIndex: 0,
    salaryIndex : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.doBaseGet("/salary", function (res) {
      salaryIdArr=[];
      salaryArr=[];
      for (var i in res) {
        salaryIdArr.push(res[i].id)
        salaryArr.push(res[i].salary)
      }
    })
    util.doBaseGet("/belief", function (res) {
      beliefArr=[];
      for(var i in res){
        beliefArr.push(res[i])
      }
    })
    util.doBaseGet("/education", function (res) {
      eduArr = [];
      for (var i in res) {
        eduArr.push(res[i])
      }
    })
    util.doBaseGet("/housekeeper/" + app.data.accountId + "/basics", function (res) {
      // console.log(res)
      if (res.nativeName == null) {
        var native = ["未知"]
      } else {
        var native = res.nativeName.split(",")
      }
      if (res.serviceArea == null) {
        var serviceArea = ["未知"]
      } else {
        var serviceArea = res.serviceArea.split(",")
      }
      var index =-1;
      for(var i in salaryArr){
        if(salaryArr[i] == res.salary){
          index = i
          break;
        }
      }
      // console.log(index);
      that.setData({
        name: res.name,
        auth: res.auth,
        nickname: res.nickname,
        sex: res.sex,
        birthMonth: res.birthMonth,
        native: native,
        serviceArea: serviceArea,
        phone: res.phone,
        belief: res.belief,
        edu: res.education,
        expIndex: res.workYears,
        salaryIndex: index,
        salaryArr: salaryArr
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
    var nickname = wx.getStorageSync('nickname')
    if(nickname){
      this.setData({
        nickname: nickname
      })
      wx.removeStorageSync('nickname')
    }

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


  //改变信仰
  chooseBelief: function () {
    var that = this;
    wx.showActionSheet({
      itemList: beliefArr,
      success: function (e) {
        var data = {
          id: app.data.accountId,
          belief: e.tapIndex + 1
        }
        util.doPost('',"/housekeeper", data, function (res) {
          if (res) {
            wx.showToast({
              title: '修改成功',
              icon: 'none'
            })
          }
        })
        that.setData({
          belief: beliefArr[e.tapIndex]
        });
      }
    })
  },

  //改变学历
  chooseEdu: function () {
    var that = this;
    wx.showActionSheet({
      itemList: eduArr,
      success: function (e) {
        var data = {
          id: app.data.accountId,
          education: e.tapIndex + 1
        }
        util.doPost('',"/housekeeper", data, function (res) {
          if (res) {
            wx.showToast({
              title: '修改成功',
              icon: 'none'
            })
          }
        })
        that.setData({
          edu: eduArr[e.tapIndex]
        });
      }
    })
  },

  //改变工作年限
  changeExp:function(e){
    var data = {
      id: app.data.accountId,
      workYears: e.detail.value
    }
    util.doPost('',"/housekeeper/workInfo", data, function (res) {
      if (res) {
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
      }
    })
    this.setData({
      expIndex: e.detail.value
    });
  },

  //改变期望薪资
  changeSalary: function (e) {
    var data = {
      id: app.data.accountId,
      expectSalary: salaryIdArr[e.detail.value]
    }
    util.doPost('',"/housekeeper/workInfo", data, function (res) {
      if (res) {
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
      }
    })
    this.setData({
      salaryIndex: e.detail.value
    });
  },

  //改变籍贯
  changeNative(e) {
    var region = e.detail.value
    var data = {
      id: app.data.accountId,
      nativeId: region[0] + region[1] + region[2]
    }
    util.doPost('',"/housekeeper", data, function (res) {
      // console.log(res);
      if (res) {
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
      }
    })
    this.setData({
      native: e.detail.value
    })
  },

  //改变居住地
  changeLive(e) {
    var region = e.detail.value
    var data = {
      id: app.data.accountId,
      serviceArea: region[0] + region[1] + region[2]
    }
    util.doPost('',"/housekeeper/workInfo", data, function (res) {
      if (res) {
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
      }
    })
    this.setData({
      serviceArea: e.detail.value
    })
  },
})