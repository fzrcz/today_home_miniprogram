const app = getApp();
var util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var housekeeperId = options.housekeeperId
    util.doBaseGet("/signSafeguard/query/appoint/detail?id=" + options.id, function (res) {
      //console.log(res)
      that.setData({
        id: res[0].id,
        orderNo: res[0].orderNo,
        employerName: res[0].employerName,
        employerPhone: res[0].employerPhone,
        housekeeperName: res[0].housekeeperName,
        housekeeperPhone: res[0].housekeeperPhone,
        money: res[0].money,
        orderStatus: res[0].orderStatus,
        appointTime: res[0].appointTime,
        orderTime: res[0].orderTime,
        housekeeperId: housekeeperId
      })
    })
  },

  toPay: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    if (e.currentTarget.dataset.money > 0) {
      var openid = app.data.openid;
      if (!openid) {
        wx.login({
          success: function (res) {
            if (res.code) {
              util.doBaseGet("/weiXin/applet/openId?code=" + res.code, function (res) {
                app.data.openid = res;
                that.beforePay(e.currentTarget.dataset.money, id);
              })
            }
          }
        })
      } else {
        that.beforePay(e.currentTarget.dataset.money, id);
      }
    } else {
      that.agree("", id, index);
    }
  },

  //调取预支付
  beforePay: function (money, id) {
    var that = this;
    var body = "今日到家-阿姨确认预约"
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
          var data = res.data;
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': function (res) {
              if (res.errMsg == 'requestPayment:ok') {
                that.agree(data.dealId, id);
              } else {

              }
            },
            'fail': function (res) {
              console.log(res.errMsg)
              if (res.errMsg=='requestPayment:fail cancel'){
                wx.showToast({
                  title: '您已取消支付',
                  icon: 'none',
                  duration: 2000
                })
              }
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

  //同意预约
  agree: function (dealId, id) {
    var that = this

    var data = {
      status: 3  //状态，1等待确认，2阿姨拒绝，3阿姨同意
    }
    console.log(id);
    console.log(that.data.housekeeperId);
    console.log(dealId);
    util.doPost('',"/employers/appoint/" + id + "/" + 3 + "/" + that.data.housekeeperId, dealId, function (res) {
      console.log(res);
      if (res || res == 'true') {
        that.setData({
          orderStatus: 3
        })
      }
    })
  },

  /**
 * 返回首页
 */
  toRecommend: function () {
    wx.switchTab({
      url: '/pages/recommend/recommend',
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.employerName+'预约了您',
      imageUrl: 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/ad/img-share01.png?' + Math.random(),
      path: 'pages/mine/booking/share/share?id=' + that.data.id+'&housekeeperId=' + that.data.housekeeperId,
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  }
})