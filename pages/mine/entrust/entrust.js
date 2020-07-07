const app = getApp();
var util = require('../../../utils/util.js')
var currDate = '1';
var payId = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    thisMonth: util.thisMonth(),
    totalDate: '本月',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.doBaseGet("/salaryEntrust/" + app.data.accountId + "/payment", function (res) {
      that.setData({
        salary: res
      })
    })

    util.doBaseGet("/signSafeguard/query/salary/list?id=" + app.data.accountId, function (res) {
      console.log(res)
      that.setData({
        paymentList: res
      })
    })

    this.loadData(1)
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



  loadData: function (currDate) {
    var that = this
    var data = {
      accountType: app.data.userRole
    }
    

    util.doGet("/accounts/" + app.data.accountId + "/accountBatch/" + currDate,data, function (res) {
      // console.log(res)
      that.setData({
        totalMoney: res.expenditure,
        dataList: res.accountBatchDtos
      })
    })
  },

  changeDate:function(){
    if (currDate == '1') {
      currDate = '3'
      this.setData({
        totalDate: '近3个月',
      });
    } else if (currDate == '3') {
      currDate = '6'
      this.setData({
        totalDate: '近6个月',
      });
    } else if (currDate == '6') {
      currDate = '12'
      this.setData({
        totalDate: '近1年',
      });
    } else {
      currDate = '1'
      this.setData({
        totalDate: '本月',
      });
    }
    this.loadData(currDate);
  },


  //预约
  toPay: function (e) {
    var that = this;
    payId = e.currentTarget.dataset.id;
    var openid = app.data.openid;
    // that.paySuccess("2222");
    //获取openid
    if (!openid) {
      wx.login({
        success: function (res) {
          if (res.code) {
            util.doBaseGet("/weiXin/applet/openId?code=" + res.code, function (res) {
              app.data.openid = res;
              that.beforePay(e.currentTarget.dataset.money);
            })
          }
        }
      })
    } else {
      that.beforePay(e.currentTarget.dataset.money);
    }
  },

  //调取预支付
  beforePay: function (money) {
    var that = this;
    var body = "今日到家-工资委托"
    var totalFee = money * 100;
    totalFee = totalFee.toFixed(0);
    var data = {
      openId: app.data.openid,
      body: body,
      totalFee: totalFee
    };
    // console.log(data);
    wx.request({
      url: util.baseUrl + '/weiXin/applet/payment',
      data: data,
      method: 'POST',
      header: {
        "secretKey": "PcnMh+UXAmk/iNlqFFahKu", 'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.statusCode == 500) {
          wx.showToast({
            title: '网络连接异常',
            icon: 'none',
            duration: 2000
          })
        } else {
          console.log(res);
          var data = res.data;
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': function (res) {
              if (res.errMsg == 'requestPayment:ok') {
                that.paySuccess(data.dealId);
              } else {

              }
            },
            'fail': function (res) {
              console.log(res)
            }
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络连接异常',
          icon: 'none',
          duration: 2000
        })
      },
    })
  },

  paySuccess: function (dealId){
    var that =this
    util.doPost("/salaryEntrusts/" + dealId + "/" + payId, '', function (res) {
      if(res){
        util.doBaseGet("/salaryEntrusts/" + app.data.accountId, function (res) {
          // console.log(res)
          that.setData({
            paymentList: res
          })
        })
      }
    })
  }
})