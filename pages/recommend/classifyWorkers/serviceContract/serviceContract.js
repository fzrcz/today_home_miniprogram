// pages/recommend/classifyWorkers/serviceContract/serviceContract.js
var util = require('../../../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: 1,
    serviceTime: [{
        id: '0',
        value: '1',
        name: '1年（送保险）',
        checked: 'true'
      },
      {
        id: '1',
        value: '2',
        name: '半年（送保险）',
      },
      {
        id: '2',
        value: '3',
        name: '三个月（送保险）',
      },
      {
        id: '3',
        value: '4',
        name: '一个月',
      },
      {
        id: '4',
        value: '5',
        name: '其他',
      },
    ],
    showView: false,
    priceNumber: '',
    contractName: '1年（送保险）' // 默认不选的话就是这个
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.totalPrice();
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
  //对应的价格
  totalPrice: function(e) {
    var that = this
    var isShow = that.data.isShow
    var priceNumber = that.data.priceNumber
    if (isShow == '1') {
      that.setData({
        totalPrice: '2380'
        // totalPrice: '0.01'
      })
    } else if (isShow == '2') {
      that.setData({
        totalPrice: '1880'
        // totalPrice: '0.02'
      })
    } else if (isShow == '3') {
      that.setData({
        totalPrice: '1380'
        // totalPrice: '0.03'
      })
    } else if (isShow == '4') {
      that.setData({
        totalPrice: '880'
        // totalPrice: '0.04'
      })
    } else {
      that.setData({
        totalPrice: priceNumber
      })
    }
  },

  // 选择合同年限
  radioChange: function(e) {
    var that = this;

    console.log(e);
    var chooseValue = e.detail.value;
    var isShow = parseInt(chooseValue);
    var serviceTime = that.data.serviceTime;
    for (var i in serviceTime) {
      if (serviceTime[i].value == chooseValue) {
        that.setData({
          contractName: serviceTime[i].name
        })
      }
    }

    console.log("合同年限为：" + that.data.contractName);

    that.setData({
      isShow: isShow
    })
    if (chooseValue == '5') {
      that.setData({
        showView: true　　
      })
    } else {
      that.setData({
        showView: false
      })
    }
    that.totalPrice()
  },

  //输入金额
  priceInput: function(e) {
    this.setData({
      priceNumber: e.detail.value
    })
  },

  //输入金额失去焦点时
  priceOnBlur: function() {
    this.totalPrice()
  },

  //取合同编号
  contractInput: function(e) {
    this.setData({
      contractNumber: e.detail.value
    })
  },

  // 立即支付
  toPay: function() {
    var that = this;

    var that = this;
    console.log("合同付款登录状态" + app.data.loginStatus);
    if (app.data.loginStatus != 'login') {
      wx.navigateTo({
        url: '/pages/empower/empower',
      })
    } else {

      //取合同编号
      var contractNumber = that.data.contractNumber
      if (!contractNumber) {
        wx.showToast({
          title: '您尚未填写合同编号！',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      var totalPrice = that.data.totalPrice
      if (!totalPrice) {
        wx.showToast({
          title: '您尚未输入金额！',
          icon: 'none',
          duration: 2000
        })
        return false;
      }

      //获取openid
      var openid = app.data.openid;
      console.log("openid为：" + openid);
      console.log("合同编号：" + contractNumber);
      console.log("输入金额：" + totalPrice);

      if (!openid) {
        wx.login({
          success: function(res) {
            if (res.code) {
              util.doBaseGet("/weiXin/applet/openId?code=" + res.code, function(res) {
                app.data.openid = res;
                that.pay();
              })
            }
          }
        })
      } else {
        that.pay();
      }
    }
  },

  //调取预支付
  pay: function() {
    var that = this;

    var body = "今日到家"
    var totalFee = that.data.totalPrice;

    var data = {
      contractNo: that.data.contractNumber,
      totalAmount: totalFee,
      accountId: app.data.accountId,
      title: that.data.contractName + totalFee + '元',
      openId: app.data.openid,
      body: body,
    };

    console.log("支付的传参：");
    console.log(data);

    util.doPost('','/business/orders/contract', data, function(res) {
      console.log('点击立即支付返回：')
      console.log(res)
      if (res.success) {
        var data = res.data;
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': data.signType,
          'paySign': data.paySign,
          'success': function(res) {
            console.log("支付成功");
            if (res.errMsg == 'requestPayment:ok') {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                success: function() {
                  wx.navigateBack({
                    detal: 1
                  })
                }
              })
            } else {
              console.log("支付失败");
            }
          },
          'fail': function(res) {
            console.log('支付失败', res)
          }
        })
      }
    })
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