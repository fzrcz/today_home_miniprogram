const app = getApp();
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    companyId: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options.id)
    // console.log(options.tab)
    var that = this
    var tab = options.tab
    var currentTab = options.currentTab
    that.setData({
      tab: tab,
      // 拿到订单页传过来的大订单的id
      id: options.id,
      currentTab: currentTab,
    })
    // that.getOrderDetail();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    //***************签名更新，打开此注释*********************** */
    // console.log(that.data.signStatus)
    // console.log(that.data.signFilePath)
    // 是否签名的状态，签名之后，继续走确认完成的操作
    if (that.data.signStatus) {
      that.continueConfirmComplete(that.data.signFilePath);
      that.data.signStatus = false;
    }
    this.setData({
      companyId: wx.getStorageSync('selectCompany').id,
      selectCompany: wx.getStorageSync('selectCompany')
    })
    //************************************** */
    wx.showLoading({
      title: '加载中...',
    })
    that.getOrderDetail();
  },
  toCall: function() {
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('selectCompany').tel
    })
    // wx.navigateTo({
    //   url: 'chat/chat',
    // })
  },
  previewImage: function(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },

  // 查询大订单对应的详情页的方法
  getOrderDetail: function() {
    var that = this;
    var data = {
      id: that.data.id,
      platform: 'miniapp',
    }
    util.doGet("/business/orders/queryList", data, function(res) {
      wx.hideLoading();
      console.log("订单详情页，onshow返回：")
      console.log(res);
      var serviceNo;
      var remainServiceNo;
      var star;
      if (res.data[0].businessTypeId == '6') {
        if(that.data.currentTab == '4'){
          star = res.data[0].hourlyWorkersServe[0].orderEvaluateList[0].score;
        }
        // 总次数
        serviceNo = res.data[0].hourlyWorkersServe.length;
        // 剩余服务次数
        remainServiceNo = res.data[0].hourlyWorkersOrder[0].remainServiceNo;
      }
      if (res.data[0].businessTypeId != '6') {
         if(that.data.currentTab == '4'){
          star = res.data[0].orderEvaluateList[0].score;
        }
      }
      that.setData({
        info: res.data,
        // 该服务是第几次
        nextService: serviceNo - remainServiceNo,
        star: star,
      })
    })
  },

  //点击确认完成
  confirmComplete: function(e) {
    var that = this;

    wx.showModal({
      title: '提示',
      content: '请确认您家中物品是否完好？',
      success: function(res) {
        //点击确定
        if (res.confirm) {
          console.log('确定完好：')

          var orderDetailId = e.currentTarget.dataset.orderdetailid;
          console.log("点击详情页，确认完成，拿到大小订单的id：");
          console.log(that.data.id);
          console.log(orderDetailId);
          that.setData({
            orderDetailId: orderDetailId,
          })
          // 确定完好，跳转签字界面
          wx.navigateTo({
            url: '/pages/order/sign/sign',
          })

          // var data = {

          // }
          // util.doGet("/housekeepers/" + orderDetailId + "/orderconfirm", data, function(res1) {
          //   console.log("详情页点击确认完成，返回：")
          //   console.log(res1);
          //   if (res1.success) {
          //     wx.showLoading({
          //       title: '确认完成中...',
          //     })
          //     // 确认完成成功，再调用一下查询状态，更改为待评价
          //     var data = {
          //       id: that.data.id,
          //       platform: 'miniapp',
          //     }
          //     util.doGet("/business/orders/queryList", data, function(res2) {
          //       wx.hideLoading();
          //       console.log(res2);
          //       wx.showToast({
          //         title: '确认完成成功',
          //         icon: 'none',
          //         duration: 1500
          //       })
          //       that.setData({
          //         info: res2.data
          //       })
          //     })
          //   }
          // })
        } else {
          console.log('物品没有完好');
          wx.showToast({
            title: '您可联系客服进行投诉处理',
            icon: 'none'
          })
        }
      }
    })

  },

  //******************************************** */
  continueConfirmComplete: function (signFilePath) {

    var that = this;
    var data = {

    }
    // util.doGet("/housekeepers/" + that.data.orderDetailId + "/orderconfirm", data, function(res1) {
    util.doPostImgData("/housekeepers/" + that.data.orderDetailId + "/orderconfirm", signFilePath, data, function (res1) {

      console.log("详情页点击确认完成，返回：")
      console.log(res1);
      var jsonRes1 = JSON.parse(res1);
      if (jsonRes1.success) {
        wx.showLoading({
          title: '确认完成中...',
        })
        // 确认完成成功，再调用一下查询状态，更改为待评价
        var data = {
          id: that.data.id,
          platform: 'miniapp',
        }
        util.doGet("/business/orders/queryList", data, function(res2) {
          wx.hideLoading();
          console.log(res2);
          wx.showToast({
            title: '确认完成成功',
            icon: 'none',
            duration: 1500
          })
          that.setData({
            info: res2.data
          })
        })
      }
    })
  },
  //******************************************** */

  // 点击待评价/已评价
  toCommentPage: function(e) {
    var that = this;
    // 获取到小订单的id
    var orderDetailId = e.currentTarget.dataset.orderdetailid;
    var index = e.currentTarget.dataset.index;
    var orderId = that.data.id;
    console.log("大小订单id为：")
    console.log(orderId)
    console.log(orderDetailId)
    console.log("点击待评价，获取序号：")
    console.log(index)
    // that.setData({
    //   index: index,
    //   orderDetailId: orderDetailId,
    // })
    wx.navigateTo({
      url: '../evaluate/evaluate?orderDetailId=' + orderDetailId + '&orderId=' + orderId + '&serveIndex=' + index,
    })
  },

  // 点击付款
  toPay: function(e) {
    var that = this;
    var id = that.data.id;
    var openid = app.data.openid;
    var productName = e.currentTarget.dataset.productname;
    console.log("商品名为：" + productName)
    console.log('支付的openid为：')
    console.log(openid);
    if (!openid) {
      // 没有openid的情况
      wx.login({
        success: function(res) {
          if (res.code) {
            util.doBaseGet("/weiXin/applet/openId?code=" + res.code, function(res) {
              app.data.openid = res;
              var data = {
                orderId: id,
                opendId: res,
                body: productName,
              }

              util.doGet("/business/orders/prePayOrder", data, function(res) {
                console.log('发起支付，返回:');
                console.log(res);
              })
            })
          }
        }
      })
    } else {
      var data = {
        orderId: id,
        openId: app.data.openid,
        body: productName,
      }
      util.doPost('',"/business/orders/prePayOrder", data, function(res) {
        console.log('发起支付，返回:');
        console.log(res);
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function(res) {
            // if (res.errMsg == 'requestPayment:ok') {
            wx.redirectTo({
              url: '../orderSuccess/orderSuccess',
            })
            // wx.showToast({
            //   title: '支付成功',
            //   icon: 'none',
            //   duration: 2000
            // })
            // } else {

            // }
          },
          'fail': function(res) {
            console.log('支付失败', res);
          }
        })
      })
    }
  },

  //查看大图
  previewheadPic: function(e) {
    var current = e.target.dataset.src
    // console.log(current)
    var imagesrc = this.data.imgList;
    wx.previewImage({
      current: current,
      urls: imagesrc
    })
  },
  //拨打工人电话
  toWorkerPhone: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone + ''
    })
  },
  //拨打客服电话
  phoneCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone + ''
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})