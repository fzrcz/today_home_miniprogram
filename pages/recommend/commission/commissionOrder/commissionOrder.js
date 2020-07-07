// 确认订单
const app = getApp();
var util = require('../../../../utils/util.js')
var primeCost = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //手续代办服务
    basicsPrice:0,
    basicsList:[],
    //体检项
    healthList: [],
    //保险项
    insuranceList: [],
    //增值服务项
    appreciationList: [],
    //阿姨列表
    housekeepersData: [],
    housekeeperId:'',
    // 其他服务价格
    otherPrice:0,
    //合计价格
    priceAll:0,
    //更多评论模态框
    visible: false,
    healthVisible: false,
    insuranceVisible: false,
    appreciationVisible: false,
    //默认地址id
    serviceAreaId:'',

    //默认选中阿姨（序号）
    selectTab:'0',
    housekeeperId:'',
    //头像
    imgUrl: 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/mini-customer/banner-findJob.png',
    //阿姨列表
    testData: [1, 2, 3],
  },

  //默认地址
  loadAddress: function () {
    var that = this;
    // console.log(app.data.accountId);
    util.doBaseGet("/accounts/" + app.data.accountId+"/serveAddress", function (res) {
      // console.log('地址',res)
      var id = ''
      if(res){
        id = res.id
      }
      that.setData({
        address: res,
        region: res.areaId,
        serviceAreaId:id
      })
    })
  },
  //基础服务
  basicsServes: function () {
    var that = this;
    util.doBaseGet("/commissionServes/basics", function (res) {
      var basicsPrice = 0;
      for(var i=0;i<res.length;i++){
        basicsPrice = basicsPrice + res[i].preferentialPrice;
        primeCost = primeCost + res[i].price;
      }
      that.setData({
        basicsPrice: basicsPrice,
        primeCost: primeCost,
        priceAll: that.data.otherPrice + basicsPrice,
        basicsList: res
      })
    })
  },
  //体检服务
  healthServes: function () {
    var that = this;
    util.doBaseGet("/commissionServes/health", function (res) {
      that.setData({
        healthList: res
      })
    })
  },
  //保险服务
  insuranceServes: function () {
    var that = this;
    util.doBaseGet("/commissionServes/insurance", function (res) {
      that.setData({
        insuranceList: res
      })
    })
  },
  //增值服务
  appreciationServes: function () {
    var that = this;
    util.doBaseGet("/commissionServes/appreciation", function (res) {
      that.setData({
        appreciationList: res
      })
    })
  },
  //预约阿姨
  housekeepersServes: function () {
    var that = this;
    util.doBaseGet("/employers/appoints/housekeepers/"+app.data.accountId+"", function (res) {
      console.log(res)
      if (res != '' && res !=null){
        that.setData({
          housekeeperId: res[0].id,
          housekeeperName: res[0].name,
          housekeepersData: res
        })
      }
    })
  },

  /**
   * 体检服务
   */
  healthChange: function (e) {
    var that = this;
    //获取当前点击的下标
    var index = e.currentTarget.dataset.index;
    //条件集合
    var healthList = this.data.healthList;
    //改变当前选中的checked值
    healthList[index].check = !healthList[index].check;
    var otherPrice = Number(that.data.otherPrice);
    var basicsPrice = Number(that.data.basicsPrice);
    if (healthList[index].check) {
      otherPrice = otherPrice + Number(healthList[index].preferentialPrice);
      primeCost = primeCost + Number(healthList[index].price);
    } else {
      otherPrice = otherPrice - Number(healthList[index].preferentialPrice)
      primeCost = primeCost - Number(healthList[index].price);
    }
    var priceAll = Number(basicsPrice + otherPrice);
    this.setData({
      healthList: healthList,
      primeCost: primeCost,
      otherPrice: otherPrice.toFixed(2),
      priceAll: priceAll.toFixed(2)
    });
  },
  /**
   * 保险服务
   */
  insuranceChange: function(e) {
    var that = this;
    //获取当前点击的下标
    var index = e.currentTarget.dataset.index;
    //条件集合
    var insuranceList = this.data.insuranceList;
    //改变当前选中的checked值
    insuranceList[index].check = !insuranceList[index].check;
    var otherPrice = Number(that.data.otherPrice);
    var basicsPrice = Number(that.data.basicsPrice);
    if (insuranceList[index].check) {
      otherPrice = otherPrice + Number(insuranceList[index].preferentialPrice);
      primeCost = primeCost + Number(insuranceList[index].price);
    } else {
      otherPrice = otherPrice - Number(insuranceList[index].preferentialPrice);
      primeCost = primeCost - Number(insuranceList[index].price);
    }
    var priceAll = Number(basicsPrice + otherPrice);
    this.setData({
      insuranceList: insuranceList,
      otherPrice: otherPrice.toFixed(2),
      primeCost: primeCost,
      priceAll: priceAll.toFixed(2)
    });
  },
  /**
   * 增值服务
   */
  appreciationChange: function(e) {
    var that = this;
    //获取当前点击的下标
    var index = e.currentTarget.dataset.index;
    //条件集合
    var appreciationList = this.data.appreciationList;
    //改变当前选中的checked值
    appreciationList[index].check = !appreciationList[index].check;
    var otherPrice = Number(that.data.otherPrice);
    var basicsPrice = Number(that.data.basicsPrice);
    if (appreciationList[index].check) {
      otherPrice = otherPrice + Number(appreciationList[index].preferentialPrice);
      primeCost = primeCost + Number(appreciationList[index].price);
    } else {
      otherPrice = otherPrice - Number(appreciationList[index].preferentialPrice)
      primeCost = primeCost - Number(appreciationList[index].price);
    }
    var priceAll = Number(basicsPrice + otherPrice);
    this.setData({
      appreciationList: appreciationList,
      otherPrice: otherPrice.toFixed(2),
      primeCost: primeCost,
      priceAll: priceAll.toFixed(2)
    });
  },
  //更多评论模态框-打开
  handleOpen() {
    var that=this;
    if (that.data.visible) {
      this.setData({
        visible: false
      });
      return
    }
    var count =0;
    for (var i = 0; i < that.data.healthList.length; i++) {
      if (that.data.healthList[i].check) {
        count++;
      }
    }
    if (count==0){
      this.setData({
        healthVisible: false
      });
    }else{
      this.setData({
        healthVisible: true
      });
    }
    count=0;
    for (var i = 0; i < that.data.insuranceList.length; i++) {
      if (that.data.insuranceList[i].check) {
        count++;
      } 
    }
    if (count == 0) {
      this.setData({
        insuranceVisible: false
      });
    } else {
      this.setData({
        insuranceVisible: true
      });
    }
    count = 0;
    for (var i = 0; i < that.data.appreciationList.length; i++) {
      if (that.data.appreciationList[i].check) {
        count++;
      }
    }
    if (count == 0) {
      this.setData({
        appreciationVisible: false
      });
    } else {
      this.setData({
        appreciationVisible: true
      });
    }
    this.setData({
      visible: true
    });
  },
  //更多评论模态框-关闭
  handleCancel() {
    this.setData({
      visible: false
    });
  },
  /**
   * 选择阿姨
   */
  myChange(e) {
    var that = this;
    var index = e.currentTarget.dataset.index
    this.setData({
      housekeeperId: that.data.housekeepersData[index].id,
      housekeeperName: that.data.housekeepersData[index].name,
      selectTab: index
    });
  },

  //地址管理
  toAddress: function () {
    wx.navigateTo({
      url: '/pages/recommend/commission/address/address',
    })
  },
  //阿姨详情
  toDetail: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/recommend/housekeeperDetail/housekeeperDetail?showBtn=false&housekeeperId=' + that.data.housekeeperId,
    })
  },

  //预约
  toPay: function (e) {
    var that = this;
    if (that.data.serviceAreaId==''){
      wx.showToast({
        title: '您还未选择地址！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    // if (that.data.housekeeperId == '') {
    //   wx.showToast({
    //     title: '您还未选择预约的阿姨！',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // }

    // that.paySuccess('79ed3248bb03477ab55bb94f225f07f7');
    // return

    var openid = app.data.openid;
    //获取openid
    if (!openid) {
      wx.login({
        success: function (res) {
          if (res.code) {
            util.doBaseGet("/weiXin/applet/openId?code=" + res.code, function (res) {
              console.log(111)
              app.data.openid = res;
              //that.paySuccess('123456');
              that.beforePay();
            })
          }
        }
      })
    }else{
      console.log(222)
      //that.paySuccess('123456');
      that.beforePay();
    } 
  },
  //调取预支付
  beforePay: function () {
    var that = this;
    var body = "今日到家-购买签约保障"
    var totalFee = this.data.priceAll * 100;
    totalFee = totalFee.toFixed(0);
    //totalFee = 1;
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
          // console.log(res);
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
              console.log('支付',res)
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
  //支付成功
  paySuccess: function (batchNo) {
    var that = this;
    // console.log(batchNo);
    //服务id
    var serveIds ='';
    for(var i= 0;i<that.data.basicsList.length;i++){
      serveIds = serveIds + that.data.basicsList[i].id +','
    }
    for (var i = 0; i < that.data.healthList.length; i++) {
      if (that.data.healthList[i].check){
        serveIds = serveIds + that.data.healthList[i].id + ','
      }
    }
    for (var i = 0; i < that.data.insuranceList.length; i++) {
      if (that.data.insuranceList[i].check) {
        serveIds = serveIds + that.data.insuranceList[i].id + ','
      }
    }
    for (var i = 0; i < that.data.appreciationList.length; i++) {
      if (that.data.appreciationList[i].check) {
        serveIds = serveIds + that.data.appreciationList[i].id + ','
      }
    }
    serveIds = serveIds.substring(0, serveIds.length - 1);
    var data = {
      employerId: app.data.accountId,
      housekeeperId: that.data.housekeeperId,
      cost: this.data.priceAll,
      batchNo: batchNo,
      serviceAreaId: that.data.serviceAreaId,
      serveIds: serveIds
    }
    util.doPut("/signSafeguard/special/commission", data, function (res) {
      console.log(res);
      wx.redirectTo({
        url: '/pages/recommend/commission/commissionSuccess/commissionSuccess?orderTime=' + res.orderTime + '&housekeeperName=' + that.data.housekeeperName + '&orderNo=' + res.orderNo + '&id=' + res.id + '&basicsPrice=' + that.data.basicsPrice + '&otherPrice=' + that.data.otherPrice,
      })
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    primeCost = 0
    this.loadAddress();
    this.basicsServes();
    this.healthServes();
    this.insuranceServes();
    this.appreciationServes();
    this.housekeepersServes();
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
    
    var addrid = wx.getStorageSync("addrid");
    wx.removeStorageSync("addrid")
    if(addrid){
      var that = this
      util.doBaseGet("/account/" + addrid + "/serveAddress", function (res) {
        // console.log(res)
        // var region = res.areaId.split(",")
        that.setData({
          region: res.areaId,
          address:res,
          serviceAreaId: res.id
        })
      })
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

  toList:function(){
    wx.navigateTo({
      url: '/pages/recommend/housekeeperAll/housekeeperAll',
    })
  }

})