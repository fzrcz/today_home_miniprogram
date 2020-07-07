const app = getApp();
var util = require('../../../utils/util.js') 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: app.data.userRole,
    showType: false,
    dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that = this;
    // that.setData({
    //   role: app.data.userRole,
    // })
    // this.loadData()
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
    var that = this;
    that.setData({
      role: app.data.userRole,
    })
    this.loadData()
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

  loadData:function(){
    var that = this
    that.setData({
      showType: true,
      loadType: true,
      loadMoreTip: '疯狂加载中。。。'
    })
    if(app.data.userRole=='housekeeper'){
      util.doBaseGet("/employers/appoints/" + app.data.accountId, function (res) {
        // console.log(res)
        if (res[0]){
          that.setData({
            dataList: res,
            showType: false,
          })
        }else{
          that.setData({
            dataList: res,
            showType: true,
            loadType: false,
            loadMoreTip: '暂无数据'
          })
        }
      })
    }else{
      util.doBaseGet("/employers/" + app.data.accountId +"/appoints", function (res) {
        console.log(res)
        if (res[0]) {
          that.setData({
            dataList: res,
            showType: false,
          })
        } else {
          that.setData({
            dataList: res,
            showType: true,
            loadType: false,
            loadMoreTip: '暂无数据'
          })
        }
      })
    }
    
  },

  toPay: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    if (e.currentTarget.dataset.money > 0){
      var openid = app.data.openid;
      if (!openid) {
        wx.login({
          success: function (res) {
            if (res.code) {
              util.doBaseGet("/weiXin/applet/openId?code=" + res.code, function (res) {
                app.data.openid = res;
                that.beforePay(e.currentTarget.dataset.money, id, index);
              })
            }
          }
        })
      } else {
        that.beforePay(e.currentTarget.dataset.money, id, index);
      }
    }else{
      that.agree("",id,index);
    }

    // that.agree("2222");
    // 获取openid
    
  },

  //调取预支付
  beforePay: function (money, id, index) {
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
                that.agree(data.dealId, id, index);
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

//同意预约
  agree: function (dealId, id, index){
    var that = this

    var data = {
      status: 3  //状态，1等待确认，2阿姨拒绝，3阿姨同意
    }
    util.doPost("/employers/appoint/" + id + "/" + 3 + "/" + app.data.accountId, dealId, function (res) {
      if (res || res == 'true'){
        var list = that.data.dataList;
        list[index].status = 3
        // console.log(list)
        that.setData({
          dataList: list
        })
      }
      
    })
  },

  //拒绝预约
  reject:function(e){
    var that = this
    var data = {
      status: 2  //1：雇主支付 2：家政员拒绝 3：家政员接受4：家政员申请取消 5：雇主申请取消 6 预约成功 7雇主违约 8家政员违约
    }
    util.doPost("/employers/appoint/" + e.currentTarget.dataset.id + "/" + 2 + "/" + app.data.accountId, "", function (res) {
      if (res || res == 'true') {
        var list = that.data.dataList;
        list[e.currentTarget.dataset.index].status = 2
        that.setData({
          dataList: list
        })
      }
    })
  },
  //雇主取消订单
  cancell:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var data ={};
    util.doPost("/employers/" + app.data.accountId + "/appoint/" + id, data,function (res) {
      // console.log('aa',res);
      if (res || res == 'true') {
        wx.showToast({
          title: '订单取消成功，诚信金将在24小时内退回原账户',
          icon: 'none',
          duration: 3000
        })
        var dataList = that.data.dataList;
        if (app.data.userRole == 'employer') {
          dataList[index].status = '11';
        }
        that.setData({
          dataList: dataList
        })
      }
    })
  },

  //申请取消
  applyCancell: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var employerId = e.currentTarget.dataset.employer;
    var housekeeperId = e.currentTarget.dataset.housekeeper;
    var index = e.currentTarget.dataset.index;
    var appointAccount = '';
    var appointAccountRole='';
    if (app.data.userRole =='employer'){
      appointAccount = housekeeperId;
      appointAccountRole = 'housekeeper';
    }
    if (app.data.userRole == 'housekeeper') {
      appointAccount = employerId;
      appointAccountRole = 'employer';
    }
    var data ={
      appointId: id,
      applyAccount:app.data.accountId,
      applyAccountRole:app.data.userRole,
      appointAccount: appointAccount,
      appointAccountRole: appointAccountRole
    }
    // console.log(index,data);
    util.doPut("/applyCancelAppoint", data, function (res) {
      // console.log('结果', res);
      //空处理失败，false 有代办订单，true申请成功
      if (res) {
        var dataList = that.data.dataList;
        if (app.data.userRole == 'employer') {
          dataList[index].status = '5';
        }
        if (app.data.userRole == 'housekeeper') {
          dataList[index].status = '4';
        }
        that.setData({
          dataList: dataList
        })
        wx.showToast({
          title: '申请取消成功',
          icon: 'none',
          duration: 2000
        })             
      } else if (res == null) {
        wx.showToast({
          title: '申请失败',
          icon: 'none',
          duration: 2000
        })  
      }else{
        var title = '您已购买签约保障服务，暂时不能取消';
        if (app.data.userRole == 'housekeeper') {
          title = '雇主已购买签约保障服务，暂时不能取消';
        }
         
        wx.showToast({
          title: title,
          icon: 'none',
          duration: 2000
        })  
      }
    })
  },
  //同意取消
  agreeCancell: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var data = {
      appointId: id,
      disposeStatus:'accept'
    };
    util.doPost("/applyCancelAppoint", data, function (res) {
      // console.log('同意取消', res);
      if(res){
        wx.showToast({
          title: '您已同意取消预约',
          icon: 'none',
          duration: 2000
        })  
        var dataList = that.data.dataList;
        dataList[index].status = '9';
        that.setData({
          dataList: dataList
        })
      }else{
        wx.showToast({
          title: '取消失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //拒绝取消
  refusCancell: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var data = {
      appointId: id,
      disposeStatus: 'refuse'
    };
    util.doPost("/applyCancelAppoint", data, function (res) {
      // console.log('拒绝取消', res);
      if (res) {
        wx.showToast({
          title: '您已拒绝取消预约',
          icon: 'none',
          duration: 2000
        })
        var dataList = that.data.dataList;
        dataList[index].status = '10';
        that.setData({
          dataList: dataList
        })
      }else{
        wx.showToast({
          title: '拒绝失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  toDetail: function (e) {
    wx.navigateTo({
      url: 'detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },

  toCommission: function () {
    wx.navigateTo({
      url: '/pages/recommend/commission/commission',
    })
  },

})