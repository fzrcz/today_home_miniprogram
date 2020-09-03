// 家政员详情
const app = getApp();
var util = require('../../../utils/util.js')
var housekeeperPhone = ''
var btn = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //拨打电话
    visibleCall: false,
    //免责声明
    visibleDisclaimer: false,
    disclaimerActions:[
      {
        name: '不再显示'
      },
      {
        name: '确定'
      }
    ],
    //视屏播放
    showCode: false,
    spinShow: "none", 
    //更多评价模态框
    visible: false,
    commentDtoList:[],
    //立即预约
    visibleAppoin: false,
    //聊天悬浮
    hideRight:30,
    workIntentsVal:'',
    //诚信金
    price:50,
    //是否勾选同意
    checkboxVal:true,
    //证件认证
    certificate:[],
    //是否已经预约
    appoint: false,
    /////////////////
    //是否显示视频中间的播放按钮
    showCenter:false,
    //不显示全视频
    fixed:true,
    myVideoClass: 'upVideo',
    videoHeight:75,
    //是否显示评价
    showComment:false,
    actions: [
      {
        name: '联系客服'
      },
      {
        name: '留下需求'
      },
      {
        name: '取消'
      }
    ],
    //登录
    visibleLogin: false
  },
  //加载提示
  showLoad() {
    if (this.data.spinShow == 'block') {
      this.setData({
        spinShow: 'none'
      })
    } else {
      this.setData({
        spinShow: 'block'
      })
    }
  },
  //数据加载
  loadData: function () {
    var that = this;
    that.showLoad();
    var data = {
      employerId: app.data.accountId
    }
    util.doGet("/housekeepers/"+that.data.housekeeperId, data, function (res) {
      console.log(res);
      //工作意向
      var workIntentsVal = "";
      for (var i = 0; i < res.workIntents.length;i++){
        if (res.workIntents[i] != '月嫂' && res.workIntents[i] != '保姆') {
          workIntentsVal = res.workIntents[i] + ',' + workIntentsVal;
        }
        if (res.workIntents[i] == '月嫂'){
          that.setData({
            showComment:true
          })
        }
      }
      workIntentsVal = workIntentsVal.substring(0, workIntentsVal.length - 1);
      
      that.setData({
        //是否已经预约
        appoint: res.appoint,
        collect: res.collect,
        housekeeperInfo:res,
        workIntentsVal: workIntentsVal,
        interviewCount: res.interviewCount
      })
      that.showLoad();
    })

    //查看证件材料接口
    util.doBaseGet("/housekeepers/" + that.data.housekeeperId + "/authMaterials", function (res) {
      // console.log(res)
      //认证证件
      var certificate = [];
      for (var j = 0; j < res.length; j++) {
        if (res[j].check) {
          certificate.push(res[j])
        }
      }
      that.setData({
        certificate: certificate
      })
    })

  },

  //更多评价
  loadMoreCommentDto: function () {
    var that = this;
    util.doBaseGet("/housekeepers/" + that.data.housekeeperId +"/comment?offset=0&limit=999999", function (res) {
      // console.log(res);
      that.setData({
        commentDtoList: res
      })
    })
  },
  //收藏
  doCollect:function(){
    var that = this;
    if (!this.isLogin()) {
      this.login();
      return false;
    }
    var data = {
      employerId: app.data.accountId,
      type: 'housekeeper',
      dataId: that.data.housekeeperId
    };
    util.doPost('',"/employers/collect", data, function (res) {
      if (res){
        that.setData({
          collect: !that.data.collect,
        })
      }
    })
  },
  //预约
  pay: function (e) {
    var that = this;
    that.setData({
      form_id: e.detail.formId
    })
    if (app.data.userRole == 'housekeeper'){
      wx.showToast({
        title: '您是阿姨，暂时无法预约',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!that.data.checkboxVal){
      wx.showToast({
        title: '您还未同意诚信金规则',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var openid = app.data.openid;
    var price = that.data.price;
    if (price==0){
      that.paySuccess('empty');
    } else if (price == 50 && that.data.hasFree){
      that.setData({
        price:50
      })
      that.paySuccess('empty');
    }else{
      //获取openid
      if (!openid) {
        wx.login({
          success: function (res) {
            if (res.code) {
              util.doBaseGet("/weiXin/applet/openId?code=" + res.code, function (res) {
                openid = res;
                app.data.openid = res;
                that.beforePay();
              })
            }
          }
        })
      } else {
        that.beforePay();
      } 
    }
  },
  //调取预支付
  beforePay:function(){
    var that = this;
    var body = "今日到家-诚信金支付"
    var totalFee = this.data.price * 100;
    // var totalFee = 1;
    var data = {
      openId: app.data.openid,
      body: body,
      totalFee: totalFee
    };
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
  //支付成功
  paySuccess: function (batchNo){
    var that = this;
    // console.log(batchNo);

    var data = {
      employerId: app.data.accountId,
      housekeeperId: that.data.housekeeperId,
      money: that.data.price,
      // money: 0.01,
      appointTime: that.data.appointTime
    }
    util.doPut("/employers/" + batchNo + "/appoint", data, function (res) {
      if (res){
        //支付成功不让跳回，防止二次预约
        wx.redirectTo({
          url: '/pages/recommend/reservationSuccess/reservationSuccess?appointTime=' + res.appointTime + '&orderTime=' + res.orderTime + '&orderNo=' + res.orderNo + '&price=' + that.data.price,
        })
      }else{
        wx.showToast({
          title: '您已经预约了该阿姨',
          icon: 'none'
        })
      }
      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var housekeeperId = options.housekeeperId; 
    var showBtn = options.showBtn;
    if(showBtn){
      this.setData({
        showBtn:false
      })
    }else{
      this.setData({
        showBtn:true
      })
    }
    
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          bodyWidth: res.windowWidth,
          bodyHeight: res.windowHeight-50,
          housekeeperId: housekeeperId
        });
      }
    });
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    btn = false
    this.setData({
      visibleLogin: false,
      visibleCall:false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      showAd: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 页面滑动
   */
  onPageScroll: function (ev) {
  },
  //触发
  touchendSart: function (event) {
    var that = this;
    that.setData({
      startY: event.touches[0].pageY
    });
  },
  //触摸移动
  touchMove: function (event) {
    var that = this;
    let moveY = event.touches[0].pageY;
    var height = moveY - that.data.startY;
    if (height > 0) {
      that.setData({
        hideRight:20
      });
    }else{
      that.setData({
        hideRight: -50
      });
    }
  },
  //释放
  touchendEnd: function (event) {
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
      title: that.data.housekeeperInfo.name,
      imageUrl: that.data.housekeeperInfo.headPic,
      path: 'pages/recommend/housekeeperDetail/housekeeperDetail?housekeeperId=' + that.data.housekeeperId,
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },

  //视频错误
  videoErrorCallback: function (e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },
  
  /**
   * 预约模态框
   */
  toggleBottom() {
    this.setData({
      showBottom: !this.data.showBottom
    });
  },
  /**
   * 滑动选择器
   */
  cxjChange: function (e){
    this.setData({
      price: e.detail.value
    });
  },
  cxjChoose: function (e) {
    this.setData({
      price: e.currentTarget.dataset.price
    });
  },

  lychange: function (e) {
    var num = e.detail.value;
    if (num ==0){
      num = 3;
    }
    var timestamp = Date.parse(new Date()); 
    var newTimestamp = timestamp + num * 24 * 60 * 60 * 1000;
    var date = new Date(newTimestamp);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    if (month < 9) {
      month = '0' + (month + 1);
    } else {
      month = month + 1;
    }
    var dateTime = year + '年' + month + '月' + day + '日';
    this.setData({
      dateTime: dateTime,
      appointTime: year + '-' + month + '-' + day
    });
  },

  lychoose: function (e) {
    var num = e.currentTarget.dataset.days;
    this.setData({
      days: num
    });
    if (num == 0) {
      num = 3;
    }
    var timestamp = Date.parse(new Date());
    var newTimestamp = timestamp + num * 24 * 60 * 60 * 1000;
    var date = new Date(newTimestamp);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    if (month < 9) {
      month = '0' + (month + 1);
    } else {
      month = month + 1;
    }
    var dateTime = year + '年' + month + '月' + day + '日';
    this.setData({
      dateTime: dateTime,
      appointTime: year + '-' + month + '-' + day
    });
  },
  //更多评价模态框-打开
  handleOpen() {
    this.loadMoreCommentDto();
    this.setData({
      visible: true
    });
  },
  //更多评价模态框-关闭
  handleCancel() {
    this.setData({
      visible: false
    });
  },
  //立即预约模态框-打开
  handleOpenAppoin() {
    var that = this;
    if (!this.isLogin()) {
      this.login();
      return false;
    }
    if (that.data.appoint) {
      wx.showToast({
        title: '您已经预约了该阿姨！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    this.getDate();
    this.hasFree();
    this.setData({
      visibleAppoin: true,
      showAd:true
    });
  },
  //立即预约模态框-关闭
  handleCancelAppoin() {
    this.setData({
      visibleAppoin: false
    });
  },
  //勾选同意
  checkbox: function (e) {
    var that =this;
    that.setData({
      checkboxVal: !that.data.checkboxVal
    }); 
    // console.log(that.data.checkboxVal);
  },
  getDate(){
    var timestamp = Date.parse(new Date());
    var newTimestamp = timestamp + 3 * 24 * 60 * 60 * 1000;
    var date = new Date(newTimestamp);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    if (month < 9) {
      month = '0' + (month + 1);
    } else {
      month = month + 1;
    }
    var dateTime = year + '年' + month + '月' + day + '日';
    this.setData({
      dateTime: dateTime,
      appointTime: year + '-' + month + '-' + day
    });
  },
  //到聊天界面
  chart: function () {
    var that = this;
    var data = {
      employerId: app.data.accountId,
      housekeeperId: that.data.housekeeperId,
      type: that.data.type,
      tell: that.data.phone
    }
    // console.log(data);
    util.doPut("/employers/interview", data, function (res) {
      // console.log(res);
      if (res !== null && res != '') {
        that.data.interviewCount = that.data.interviewCount-1;
        wx.navigateTo({
          url: '/pages/recommend/housekeeperDetail/interview/interview?receiver=' + that.data.housekeeperId + '&receiverType=housekeeper',
        })
      } else {
        wx.showToast({
          title: '面试失败！',
          icon: 'none',
          duration: 2000
        })
      }
      that.setData({
        interviewCount: that.data.interviewCount,
        visibleCall: false
      });
    })
  },
  //拨打电话
  toMakePhone: function () {
    var that =this;
    var data = {
      employerId: app.data.accountId,
      housekeeperId: that.data.housekeeperId,
      type: that.data.type,
      tell: that.data.phone
    }
    // console.log(data);
    util.doPut("/employers/interview", data, function (res) {
      if (res !==null && res !='') {
        that.data.interviewCount = that.data.interviewCount - 1;
        wx.makePhoneCall({
          phoneNumber: "'" + that.data.phone + "'"
        })
      } else {
        wx.showToast({
          title: '面试失败！',
          icon: 'none',
          duration: 2000
        })
      }
      that.setData({
        interviewCount: that.data.interviewCount,
        visibleCall: false
      });
    })
  },

  //免责声明点击
  disclaimerClick: function ({ detail }) {
    var index = detail.index
    var that = this
    if (index == 0) {
      wx.setStorageSync("showDisclaimer", true)
    } 
    wx.makePhoneCall({
      phoneNumber: housekeeperPhone + ""
    })
    that.setData({
      visibleDisclaimer: false
    });
  },

  handleOpenCall(e) {
    var that = this;
    if (!this.isLogin()) {
      this.login();
      return false;
    }
    var data = {
      employerId: app.data.accountId,
      housekeeperId: that.data.housekeeperId,
      type: "tell",
      tell: e.currentTarget.dataset.phone
    }

    util.doPut("/employers/interview", data, function (res) {
      //  console.log(res);
      if (res) {
        
        if(wx.getStorageSync("showDisclaimer")){
          wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone + ""
          })
        }else{
          housekeeperPhone = e.currentTarget.dataset.phone
          that.setData({
            visibleDisclaimer: true
          });
        }
        
      } else {
        that.setData({
          visibleCall: true
        });
      }
      
    })


    // var that = this;
    // var phone = e.currentTarget.dataset.phone;
    // var type = e.currentTarget.dataset.type;
    // var cl = e.currentTarget.dataset.cl;
    // this.setData({
    //   visibleCall: true,
    //   phone: e.currentTarget.dataset.phone,
    //   type: type,
    //   cl:cl
    // });
  },

  modalClick: function ({ detail }){
    var index = detail.index
    var that = this
    if(index == 0){
      wx.makePhoneCall({
        phoneNumber: "059123508689"
      })
    }else if(index == 1){
      wx.navigateTo({
        url: 'demand/demand',
      })
    }else{
      that.setData({
        visibleCall: false
      });
    }
  },

  handleCloseCall() {
    this.setData({
      visibleCall: false
    });
  },
  //更多阿姨
  more: function () {
    wx.navigateTo({
      url: '/pages/recommend/housekeeperAll/housekeeperAll',
    })
  },
  //阿姨详细信息
  toDetail: function (e) {
    var id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../housekeeperDetail/housekeeperDetail?housekeeperId=' + id,
    })
  },
  //打开视屏
  openVideo: function (e) {
    var that = this;
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      showCode: true,
      videoUrl: index
    })
  },

  //关闭视屏
  closeVideo: function () {
    var that = this;
    that.setData({
      showCode: false
    })
  },
  //举报
  toComplain:function(e){
    if (!this.isLogin()) {
      this.login();
      return false;
    }
    // var callNo = 18084764335;
    // console.log(callNo);
    // wx.makePhoneCall({
    //   phoneNumber: "'" + callNo+"'"
    // })
    wx.navigateTo({
      url: 'complain/complain?housekeeperId=' + this.data.housekeeperId,
    })
  },

  //查看头像大图
  previewheadPic: function (e) {

    var current = e.target.dataset.src
    // console.log(current)
    var imagesrc = [current]
    wx.previewImage({
      current: current,
      urls: imagesrc
    })
  },
  //判断是否登录
  isLogin: function () {
    var that = this;
    if (app.data.loginStatus == 'login') {
      return true;
    } else {
      return false;
    }
  },
  //打开登录窗口
  handleOpenLogin() {
    this.setData({
      visibleLogin: true
    });
  },
  //关闭登录窗口
  handleCloseLogin({ detail }) {
    this.setData({
      visibleLogin: false
    });
  },

  login: function () {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          var data = {
            code: res.code
          }
          util.doGet("/weiXin/unionId", data, function (res) {
            if (res) {
              wx.setStorageSync('unionid', res);
              app.data.unionid = res 
              util.doBaseGet("/accounts/" + res + "", function (base) {
                if (base != '' && base != null) {
                  wx.setStorageSync('accountId', base.id);
                  wx.setStorageSync('userRole', base.role);
                  wx.setStorageSync('loginStatus', 'login');
                  app.data.accountId = base.id;
                  app.data.userRole = base.role;
                  app.data.loginStatus = 'login';
                  that.setData({
                    role: base.role,
                    visibleLogin: false
                  });
                  that.loadData();
                } else {
                  // that.handleOpenLogin()
                  wx.navigateTo({
                    url: '/pages/login/login',
                  })
                }
              })
            } else {
              that.handleOpenLogin()
            }
          })
        }
      }
    })
  },


  //登录
  getUnionId: function (e) {
    if (btn) {
      return;
    }
    btn = true
    var that = this
    app.data.userInfo = e.detail.userInfo;
    wx.login({
      success: function (res) {
        if (res.code) {
          var data = {
            encryptedData: e.detail.encryptedData,
            code: res.code,
            iv: e.detail.iv
          }
          util.doGet("/weiXin/userInfo", data, function (res) {
            // console.log(1, res)
            if (res) {
              
              wx.setStorageSync('avatarUrl', res.avatarUrl);
              wx.setStorageSync('nickName', res.nickName);
              wx.setStorageSync('openid', res.openId);
              wx.setStorageSync('unionid', res.unionId);
              app.data.avatarUrl = res.avatarUrl;
              app.data.nickName = res.nickName;
              app.data.openid = res.openId;
              app.data.unionid = res.unionId;
              //判断是否注册
              util.doBaseGet("/accounts/" + res.unionId + "", function (base) {
                // console.log(2, base)
                if (base != '' && base != null) {
                  wx.setStorageSync('accountId', base.id);
                  wx.setStorageSync('userRole', base.role);
                  wx.setStorageSync('loginStatus', 'login');
                  app.data.accountId = base.id;
                  app.data.userRole = base.role;
                  app.data.loginStatus = 'login';
                  that.setData({
                    role: base.role,
                    visibleLogin: false
                  });
                  that.loadData();
                } else {
                  wx.navigateTo({
                    url: '/pages/login/login',
                  })
                }
                btn = false
              })
            }
          })
        }
      }
    })
  },

  toCommission:function(){
    wx.navigateTo({
      url: '/pages/recommend/commission/commission',
    })
  },

  toRule:function(){
    wx.navigateTo({
      url: 'rule/rule',
    })
  },

  closeAd:function(){
    this.setData({
      showAd:false
    })
  },

  hasFree:function(){
    var that = this
    var hasFreeTxt = ''
    var hasFree = false
    var data = {
      employerId: app.data.accountId
    }
    util.doGet("/signSafeguard/special/appoint/free", data, function (res) {
      console.log(res)
      if(res){
        hasFreeTxt = '您将有一次免50元诚信金预约阿姨的机会',
        hasFree = true
      }
      that.setData({
        hasFreeTxt: hasFreeTxt,
        hasFree:hasFree
      })
    })
  }

})