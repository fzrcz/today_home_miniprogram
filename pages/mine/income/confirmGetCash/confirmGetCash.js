// pages/mine/income/confirmGetCash/confirmGetCash.js
var app = getApp();
var util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var data = {

    }
    // 先判断下有没有冻结的余额，没有的话就可以继续提现了
    // url最后边的2为用户角色类型，1是顾客，2是工人
    util.doGet("/accountTraceRecord/leftBalance/" + app.data.accountId + "/1", data, function(res) {
      console.log('账户余额的冻结余额：');
      console.log(res);
      if (res.success) {
        that.setData({
          freezeBalance: res.data.accountWallet.freezeBalance,
          balance: res.data.accountWallet.balance,
          // 最低提现额度
          startAmount: res.data.startAmount,
        })
      }
    })
    
    // 调用可不可提现的接口
    util.doGet("/withdrawalRecord/canApply/" + app.data.accountId + "/1", data, function (res) {
      console.log('可不可提现：');
      console.log(res);
      if (res.success) {
        that.setData({
          canGetCash: true,
        })
      }else{
        that.setData({
          canGetCash: false,
        })
      }
    })
  },

  // 获取输入的钱
  getInputMoney: function(e) {
    this.setData({
      inputMoney: e.detail.value
    })
  },
  // 确认提现
  confirmGetCash: function() {
    var that = this;
    // if (that.data.freezeBalance != 0) {
    if (!that.data.canGetCash) {
      wx.showToast({
        title: '您有待审核的提现记录，不能再次提现！',
        icon: 'none',
        duration: 2000
      })
    } else {
      // 调用提现的接口
      // if (that.data.inputMoney > 0 && that.data.inputMoney <= that.data.workerBalance) {
      if (that.data.balance < that.data.startAmount) {
        util.showToast('最低提现额度为' + that.data.startAmount + '元');
        return;
      }
      wx.showModal({
        title: '提示',
        // content: '确定要提现' + that.data.inputMoney + '元吗？',
        content: '确定要提现' + that.data.balance + '元吗？',
        success: function(res) {
          //点击确定
          if (res.confirm) {
            console.log('确定提现：')
            var data = {

            }
            // 调用提现的接口，拿到冻结余额
            // 如果提现金额可输入，那么inputMoney为输入的金额
            // 不可输入，workerBalance就是账户的余额
            // url最后边的是用户角色类型，1是顾客，2是工人
            // util.doGet("/withdrawalRecord/apply/" + app.data.accountId + "/" + that.data.balance + "/" + 2, data, function(res5) {
            util.doGet("/withdrawalRecord/apply/" + app.data.accountId + "/" + that.data.balance + "/" + 1, data, function(res5) {
              console.log('提现返回结果：');
              console.log(res5);
              if (res5.success) {
                that.setData({
                  freezeBalance: res5.data.freezeBalance,
                })
                wx.showToast({
                  title: '已提交，待审核',
                  icon: 'success',
                  duration: 1000,
                  success: function() {
                    setTimeout(function() {
                      // 提现成功,返回到今日收益界面
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 1000);
                  }
                })
              } else {
                wx.showToast({
                  title: '提现失败，请重试！',
                  icon: 'none',
                  duration: 1000,
                })
              }
            })
            //点击取消
          } else {
            console.log('取消提现')
          }
        }
      })
      //   } else {
      //     wx.showToast({
      //       title: '提现金额错误',
      //       icon: 'none',
      //       duration: 1000 //持续的时间
      //     })
      // }
    }
  },

  // 跳转到提现记录页面
  getCashRecord: function() {
    wx.navigateTo({
      url: 'getCashRecord/getCashRecord',
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function() {

  // }
})