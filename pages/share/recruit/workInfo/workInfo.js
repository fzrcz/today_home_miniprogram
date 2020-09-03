const app = getApp();
var util = require('../../../../utils/util.js')
var beliefArr = [];
var eduArr = [];
var salaryArr = [];
var salaryIdArr = [];

var statuskeyList = ['work', 'rest'];
var statusList = ['上班中', '找工作'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    expArr: ['0年', '1年', '2年', '3年', '4年', '5年', '6年', '7年', '8年', '9年', '10年', '11年', '12年', '13年', '14年', '15年', '16年', '17年', '18年', '19年', '20年']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      statusList: statusList
    })
    var that = this
    util.doBaseGet("/salary", function (res) {
      salaryIdArr = [];
      salaryArr = [];
      for (var i in res) {
        salaryIdArr.push(res[i].id)
        salaryArr.push(res[i].salary)
      }
      that.setData({
        salaryArr: salaryArr
      })
      // console.log(salaryArr)
    })
    util.doBaseGet("/belief", function (res) {
      beliefArr = [];
      for (var i in res) {
        beliefArr.push(res[i])
      }
      that.setData({
        beliefArr: beliefArr
      })
    })
    util.doBaseGet("/education", function (res) {
      eduArr = [];
      for (var i in res) {
        eduArr.push(res[i])
      }
      that.setData({
        eduArr: eduArr
      })
    })
    util.doBaseGet("/housekeeper/" + app.data.accountId + "/basics", function (res) {
      console.log(res)
      

      var index = 5;
      for (var i in salaryArr) {
        if (salaryArr[i] == res.salary) {
          index = i
          break;
        }
      }

      for (var i in beliefArr) {
        if (beliefArr[i] == res.belief) {
          that.setData({
            beliefIndex: i
          })
          break;
        }
      }
      for (var i in eduArr) {
        if (eduArr[i] == res.education) {
          that.setData({
            eduIndex: i
          })
          break;
        }
      }
      var expIndex = -1
      if (res.workYears != 0) {
        expIndex = res.workYears
      }

      that.setData({
        expIndex: expIndex,
        salaryIndex: index,
        salaryArr: salaryArr
      })
    })

    util.doBaseGet("/housekeeper/" + app.data.accountId, function (res) {

      var statusIndex = 1
      for (var i in statusList) {
        if (statusList[i] == res.personStatus) {
          statusIndex = i
          break;
        }
      }
      that.setData({
        statusIndex: statusIndex
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

  //改变工作状态
  chooseStatus: function (e) {

    this.setData({
      statusIndex: e.detail.value
    });
  },

  //改变信仰
  chooseBelief: function (e) {

    this.setData({
      beliefIndex: e.detail.value
    });

  },

  //改变学历
  chooseEdu: function (e) {

    this.setData({
      eduIndex: e.detail.value
    });
    
  },

  //改变工作年限
  changeExp: function (e) {
    
    this.setData({
      expIndex: e.detail.value
    });
  },

  //改变期望薪资
  changeSalary: function (e) {
    
    this.setData({
      salaryIndex: e.detail.value
    });
  },

  toSkip: function () {
    wx.navigateTo({
      url: '../intention/intention',
    })
  },

  toNext: function () {

    var data = {
      id: app.data.accountId,
      personStatus: statuskeyList[this.data.statusIndex],
      belief: parseInt(this.data.beliefIndex) + 1,
      education: parseInt(this.data.eduIndex) + 1
    }
    util.doPost('',"/housekeeper", data, function (res) {
      if (res) {
        // wx.showToast({
        //   title: '修改成功',
        //   icon: 'none'
        // })
      }
    })

    var expIndex = 0
    if (this.data.expIndex != -1){
      expIndex = this.data.expIndex
    }
    var workData = {
      id: app.data.accountId,
      expectSalary: salaryIdArr[this.data.salaryIndex],
      workYears: expIndex
    }
    util.doPost('',"/housekeeper/workInfo", workData, function (res) {
      if (res) {
        // wx.showToast({
        //   title: '修改成功',
        //   icon: 'none'
        // })
      }
    })

    wx.navigateTo({
      url: '../intention/intention',
    })

  }
})