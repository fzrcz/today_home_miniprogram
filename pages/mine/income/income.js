// pages/mime/income/income.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeColor: "#FF4081",
    backgroundColor: "#FFFFFF",
    currentTab: 0,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var that = this
    console.log("今日收入,客户id：")
    console.log(app.data.accountId)
    var data = {

    }
    // 当前余额
    util.doGet("/accountTraceRecord/leftBalance/" + app.data.accountId + "/1", data, function (res) {
      console.log('账户余额：');
      console.log(res);
      console.log(res.data.accountWallet.balance);
      if (res.success) {
        if (res.data.accountWallet != null) {
          that.setData({
            // 可提现金额
            balance: res.data.accountWallet.balance,
            // 不可提现金额
            canNotBalance: res.data.accountWallet.freezeBalance,
            // 电子券金额
            eleTicket: res.data.accountWallet.cardLeftBalance,
          })
        } else {
          that.setData({
            balance: 0,
          })
        }
      } else {
        wx.showToast({
          title: '获取余额失败，请重试！',
          icon: 'none',
          duration: 1000
        })
      }
    })

    // 今日收入
    var data = {
      roleType: 1,
    }
    util.doGet("/accountTraceRecord/hosekeeperDailySum/" + app.data.accountId + "/1", data, function(res) {
      console.log('今日收入')
      console.log(res)
      if (res.success) {
        if (res.data.length == 0) {
          that.setData({
            todayIncome: 0,
          })
        } else {
          that.setData({
            todayIncome: res.data[0].traceMoney,
          })
        }
      } else {
        wx.showToast({
          title: '获取今日收入失败，请重试！',
          icon: 'none',
          duration: 1000
        })
      }
    })
    // 月度收入
    util.doGet("/accountTraceRecord/hosekeeperMonthSum/" + app.data.accountId + "/1", data, function(res1) {
      console.log('月度收入')
      console.log(res1)
      if (res1.success) {
        if (res1.data.length == 0) {
          that.setData({
            monthIncome: 0,
          })
        } else {
          that.setData({
            monthIncome: res1.data[0].traceMoney,
          })
        }
      } else {
        wx.showToast({
          title: '获取月度收入失败，请重试！',
          icon: 'none',
          duration: 1000
        })
      }
    })
    // 财产总收入
    util.doGet("/accountTraceRecord/hosekeeperMoneyCount/" + app.data.accountId + "/1", data, function(res2) {
      console.log('财产总收入：')
      console.log(res2)
      if (res2.success) {
        if (res2.data.length == 0) {
          that.setData({
            allIncome: 0
          })
        } else {
          that.setData({
            allIncome: res2.data[0].traceMoney,
          })
        }
      }
    })
    // 睡后总收入
    var data = {
      accountId: app.data.accountId,
      roleType: 1,
    }
    util.doGet("/accountTraceRecord/inviterMoneyCount", data, function (res5) {
      console.log('睡后总收入：')
      console.log(res5);
      if (res5.data.length != 0) {
        that.setData({
          sleepAllIncome: res5.data[0].traceMoney
        })
      } else {
        that.setData({
          sleepAllIncome: 0,
        })
      }
    })

    // 睡后收入排行
    var data = {
      offset: 0,
      limit: 7
    }
    util.doGet("/accountTraceRecord/inviterMoneyCount", data, function(res4) {
      console.log('睡后收入排行：');
      console.log(res4);
      var sleepIncomeRangeListTop3 = [];
      var sleepIncomeRangeListLater4 = [];
      var sleepIncomeRangeListNoData = [];
      if (res4.success) {
        if (res4.data.length != 0) {
          if (res4.data.length < 3) {
            for (var i = 0; i < res4.data.length; i++) {
              sleepIncomeRangeListTop3.push(res4.data[i]);
            }
          } else {
            for (var i = 0; i < 3; i++) {
              sleepIncomeRangeListTop3.push(res4.data[i]);
            }
          }
          for (var i = 3; i < res4.data.length; i++) {
            sleepIncomeRangeListLater4.push(res4.data[i]);
          }
          that.setData({
            sleepIncomeRangeListTop3: sleepIncomeRangeListTop3,
            sleepIncomeRangeListLater4: sleepIncomeRangeListLater4,
          })
        } else {
          that.setData({
            sleepIncomeRangeListNoData: sleepIncomeRangeListNoData,
          })
        }
      }
    })

  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function (options) {
    var that = this;
    // 每次到这个页面，去实时查询一下账户余额
    var data = {

    }
    util.doGet("/accountTraceRecord/leftBalance/" + app.data.accountId + "/1", data, function (res) {
      console.log('onshow账户余额：')
      console.log(res)
      if (res.success) {
        if (res.data.accountWallet != null) {
          that.setData({
            balance: res.data.accountWallet.balance,
          })
        } else {
          that.setData({
            balance: 0,
          })
        }
      }
    })
  },

  // 点击选项卡事件
  swichTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      });
    }
  },

  // 跳转账户明细
  balanceDetails: function (e) {
    wx.navigateTo({
      url: 'balanceDetails/balanceDetails',
    })
  },
  // 提现
  getCash: function() {
    var that = this;
    wx.navigateTo({
      url: 'confirmGetCash/confirmGetCash?balance=' + that.data.balance,
    })
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function() {

  // }
})