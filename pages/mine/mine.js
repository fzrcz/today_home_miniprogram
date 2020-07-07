var app = getApp();
var util = require('../../utils/util.js')
// var btn = false;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //更多评论模态框
    visible: false,
    role: app.data.userRole,
    loginStatus: app.data.loginStatus,
    isOpenEye: '/image/open-eye.png',
    eyeStatus: 1, // 1:睁眼 2：闭眼
    balance: '---',
    accountPoint:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log('角色和登录状态以及id：');
    console.log(app.data.accountId);
    console.log(app.data.userRole);
    console.log(app.data.loginStatus);
    console.log(app.data.avatarUrl);
    console.log(app.data.nickName);
    console.log(app.data.unionid);
    console.log(app.data.openid);
    //that.loadInfo();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    // btn = false
    var that = this;
    that.setData({
      role: app.data.userRole,
      loginStatus: app.data.loginStatus,
      visible: false,
      showCode: false
    });
    if (app.data.loginStatus == 'login') {
      that.getNowBalance();
      that.packageGetOrderListByStatus(1);
      that.packageGetOrderListByStatus(2);
      that.packageGetOrderListByStatus(3);
      that.getCouponList(1, 1);
    }
    that.loadInfo();

    // 
    if(!app.data.phone){
      wx.setStorageSync('loginStatus', 'logout');
      app.data.loginStatus = 'logout';
      that.setData({
        loginStatus: 'logout'
      });
    }
  },

  // 查询优惠券的方法
  getCouponList: function(status, available) {
    var that = this;
    // MS00201获取优惠券列表
    var data = {
      accountId: app.data.accountId,
      status: status, // 使用状态：1.可用 0.已使用 
      available: available, // available：过期状态 1.未过期 0.已过期
    }
    util.reqLoading(app.globalData.apiUrl, 'MS00201', data, 'POST', '加载中...', function(res) {
      console.log("查询" + status + "***" + available + "优惠券");
      console.log(res);
      var couponList = res.data;
      if (couponList.length != 0) {
        that.setData({
          couponList: couponList,
        })
      } else {
        that.setData({
          couponList: []
        })
      }
    })
    console.log('优惠卷')
  },
  // 当前余额
  getNowBalance: function() {
    if (app.data.loginStatus == 'login') {
      var that = this;
      var data = {

      }
      wx.showLoading({
        title: '加载中...',
      })
      util.doGet("/accountTraceRecord/leftBalance/" + app.data.accountId + "/1", data, function(res) {
        wx.hideLoading();
        console.log('账户余额：')
        console.log(res)
        if (res.success) {
          if (res.data.accountWallet != null) {
            var canSumCannot = res.data.accountWallet.balance + res.data.accountWallet.freezeBalance + res.data.accountWallet.cardLeftBalance;
            that.setData({
              balance: canSumCannot.toFixed(2),
              accountPoint: res.data.accountWallet.accountPoint
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
    }
  },

  // 显示隐藏金额
  openCloseEye: function() {
    var that = this;
    if (that.data.eyeStatus == 1) {
      that.setData({
        isOpenEye: '/image/close-eye.png',
        eyeStatus: 0,
      })
    } else {
      that.setData({
        isOpenEye: '/image/open-eye.png',
        eyeStatus: 1,
      })
    }
  },

  // 储值/提现
  income: function() {
    var that = this;
    if (app.data.loginStatus == 'login') {
      wx.navigateTo({
        url: 'income/income',
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500
      })
    }
  },
  // 成为代理商
  toAgent(){
    let _this = this
    if (app.data.loginStatus != 'login') {
      wx.navigateTo({
        url: '/pages/empower/empower',
      })
    }else{
      let platId = wx.getStorageSync('accountId')
      util.doGet("/business/agent/info", {platId}, function(res) {
        if(res.data == null && res.success) {
          _this.getAgentInfo(platId)
          
        } else if(res.data != null && res.success) {
          console.log('设置ID')
          console.log(res)
          wx.setStorageSync('agentId', res.data.id)
          wx.navigateTo({
            url: `/pages/mine/agentShare/agentShare?shareUrl=${res.data.shareUrl}`,
          })
        } else {
          wx.showToast({
            title: res.reason,
            icon: 'none',
            duration: 1500
          })
        }

      })
      
    }
  },
  getAgentInfo(platId) {
    util.doGet("/business/agent/agentApply/query", {platId}, function(res) {
      console.log(res)
      if(res.data == null && res.success) {
        wx.navigateTo({
          url: './wantAgent/wantAgent',
        })
      } else if(res.success && res.data != null) {
        wx.showToast({
          title: '您已提交代理商申请，请等待审核',
          icon: 'none',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  // 待付款
  toPay: function() {
    if (app.data.loginStatus == 'login') {
      app.globalData.currentTab = 1;
      wx.switchTab({
        url: '../order/order',
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500
      })
    }
  },
  // 进行中
  inService: function() {
    if (app.data.loginStatus == 'login') {
      app.globalData.currentTab = 2;
      wx.switchTab({
        url: '../order/order',
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500
      })
    }
  },
  // 待评价
  toEvaluate: function() {
    if (app.data.loginStatus == 'login') {
      app.globalData.currentTab = 3;
      wx.switchTab({
        url: '../order/order',
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500
      })
    }
  },
  // 已完成
  finished: function() {
    if (app.data.loginStatus == 'login') {
      app.globalData.currentTab = 4;
      wx.switchTab({
        url: '../order/order',
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500
      })
    }
  },

  // 根据不同状态查询订单，需传状态的参数
  packageGetOrderListByStatus: function(currentTab) {
    var that = this;
    // 查询对应状态的订单
    if (currentTab == 0) {
      that.setData({
        stage: '',
      })
    }
    if (currentTab == 1) {
      that.setData({
        stage: '0',
      })
    }
    if (currentTab == 2) {
      that.setData({
        stage: '14,15',
      })
    }
    if (currentTab == 3) {
      that.setData({
        stage: '16',
      })
    }
    if (currentTab == 4) {
      that.setData({
        stage: '5',
      })
    }
    wx.showLoading({
      title: '加载中...',
    })
    that.getOrderListByStatus(that.data.stage);
  },


  getOrderListByStatus: function(stage) {
    var that = this;
    that.setData({
      scrollTop: 0,
      offset: 0,
      limit: 999,
      isShow: true,
      loadType: true,
      loadMsg: '正在加载中...',
      role: app.data.userRole
    });

    var accountId = app.data.accountId;
    var role = app.data.userRole;
    var data = {
      platform: 'miniapp',
      accountId: accountId,
      role: role,
      businessTypeId: '6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
      stageArr: stage,
      offset: 0,
      limit: 999,
    }
    // console.log("查询订单的传参：");
    // console.log(data);
    util.doGet("/business/orders/queryList", data, function(res) {
      wx.hideToast();
      wx.hideLoading();
      if (that.data.confirm1 == 1) {
        wx.showToast({
          title: '确认完成成功',
          icon: 'none',
          duration: 1500
        })
      }
      console.log('查询' + stage + '订单为：');
      console.log(res);
      if (res.success == false || res.data.length == 0) {
        that.setData({
          isShow: false,
          dataList: []
        });
        if (stage == '0') {
          that.setData({
            toPayNum: 0,
          })
        }
        if (stage == '14,15') {
          that.setData({
            inServiceNum: 0,
          })
        }
        if (stage == '16') {
          that.setData({
            toEvaluateNum: 0,
          })
        }
      } else {
        if (stage == '0') {
          that.setData({
            toPayNum: res.data.length,
          })
        }
        if (stage == '14,15') {
          that.setData({
            inServiceNum: res.data.length,
          })
        }
        if (stage == '16') {
          that.setData({
            toEvaluateNum: res.data.length,
          })
        }
        that.setData({
          isShow: false,
          dataList: res.data,
        });
      }
    })
  },
  //现金券兑换
  toCashCoupon:function(){
    if (app.data.loginStatus != 'login') {
      wx.navigateTo({
        url: '/pages/empower/empower',
      })
    } else {
      wx.navigateTo({
        url: '/pages/mine/cashCoupon/cashCoupon',
      })
    }
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

  onPullDownRefresh: function() {
    var that = this;
    wx.setBackgroundColor({
      backgroundColor: '#DDDDDD', // 窗口的背景色为白色
    })
    wx.setBackgroundTextStyle({
      textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
    })

    wx.showNavigationBarLoading();

    this.loadInfo();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();

  },

  //去消息列表
  toMessage: function() {
    wx.navigateTo({
      url: 'message/message',
    })
  },

  //去次数页面
  toTimes: function() {
    if (app.data.userRole == 'housekeeper') {
      wx.navigateTo({
        url: 'interview/interview',
      })
    } else {
      wx.navigateTo({
        url: 'times/times',
      })
    }

  },

  //去阿姨列表，包括预约，面试，收藏，足迹
  toCollection: function() {
    wx.navigateTo({
      url: 'collection/collection',
    })
  },

  //去基本信息
  toBaseInfo: function() {
    if (this.data.role == 'housekeeper') {
      wx.navigateTo({
        url: 'housekeeperInfo/housekeeperInfo',
      })
    } else {
      wx.navigateTo({
        url: 'baseInfo/baseInfo',
      })
    }

  },

  //去认证页面
  toAuth: function() {
    wx.navigateTo({
      url: 'auth/auth',
    })
  },

  //去二维码页面
  toQrcode: function() {
    wx.navigateTo({
      url: 'qrcode/qrcode',
    })

    // this.setData({
    //   showCode: !this.data.showCode
    // });
  },


  //去分享页面
  toShare: function() {
    if (app.data.loginStatus != 'login') {
      wx.navigateTo({
        url: '/pages/empower/empower',
      })
    } else {
      wx.navigateTo({
        url: 'share/share',
      })
    }
  },
  //去我的客户页面,在线聊天
  myClient: function() {
    if (app.data.loginStatus != 'login') {
      wx.navigateTo({
        url: '/pages/empower/empower',
      })
    } else {
      wx.navigateTo({
        url: 'myClient/myClient',
      })
    }
  },

  //去推荐活动页面
  toRecommend: function() {
    wx.navigateTo({
      url: 'recommend/recommend',
    })
  },

  //阿姨账户页面
  toAccount: function() {
    wx.navigateTo({
      url: 'account/account',
    })
  },
  //客服电话
  toCall: function() {
    wx.makePhoneCall({
      phoneNumber: '400-600-6580'
    })
    // wx.navigateTo({
    //   url: 'chat/chat',
    // })
  },

  //我的预约
  booking: function() {
    if (!this.isLogin()) {
      this.login();
      return false;
    }
    wx.navigateTo({
      url: 'booking/booking',
    })
  },
  //我的合同
  contract: function() {
    if (!this.isLogin()) {
      this.login();
      return false;
    }
    wx.navigateTo({
      url: 'contract/contract',
    })
  },
  //地址管理
  address: function() {
    if (app.data.loginStatus != 'login') {
      wx.navigateTo({
        url: '/pages/empower/empower',
      })
    } else {
      wx.navigateTo({
        url: 'address/address',
      })
    }
  },
  //工资委托
  entrust: function() {
    if (!this.isLogin()) {
      this.login();
      return false;
    }
    wx.navigateTo({
      url: 'entrust/entrust',
    })
  },
  //我的保险
  insurance: function() {
    if (!this.isLogin()) {
      this.login();
      return false;
    }
    wx.navigateTo({
      url: 'insurance/insurance',
    })
  },
  //我的体检
  checkup: function() {
    if (!this.isLogin()) {
      this.login();
      return false;
    }
    wx.navigateTo({
      url: 'checkup/checkup',
    })
  },
  //关于我们
  aboutUs: function() {
    if (!this.isLogin()) {
      this.login();
      return false;
    }
    wx.navigateTo({
      url: 'aboutUs/aboutUs',
    })
  },

  loadInfo: function() {
    var that = this
    if (app.data.loginStatus == 'login') {
      that.getNowBalance();
      if (app.data.userRole == 'housekeeper') {
        util.doBaseGet("/housekeepers/mine/" + app.data.accountId, function(res) {
          console.log('阿姨信息', res);
          that.setData({
            account: res.account,
            headPic: res.headPic,
            msgCount: res.msgCount,
            name: res.name,
            nickname: res.nickname,
            numCount: res.numCount,
            auth: res.auth,
            qrCode: res.qrCode
          })
        })
      } else if (app.data.userRole == 'employer') {
        util.doBaseGet("/employers/mine/" + app.data.accountId, function(res) {
          console.log('雇主信息', res);
          that.setData({
            account: res.account,
            headPic: res.headPic,
            msgCount: res.msgCount,
            name: res.name,
            nickname: res.nickname,
            housekeeperCount: res.housekeeperCount,
            numCount: res.numCount,
            auth: res.auth,
            qrCode: res.qrCode
          })
        })
      }
    }
  },
  //退出登录
  logout: function(e) {
    var that = this;

    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function(res) {
        //点击确定
        if (res.confirm) {
          console.log('确定退出：')
          wx.setStorageSync('loginStatus', 'logout');
          app.data.loginStatus = 'logout';
          // 清除全部缓存
          wx.clearStorageSync();
          // 移除accountId,手机号
          app.data.accountId = '';
          app.data.phone = '';

          console.log("退出后，手机号", app.data.phone)
          console.log("退出后，accountid", app.data.accountId)
          that.setData({
            loginStatus: 'logout'
          });
        } else {
          console.log('取消退出')
        }
      }
    })
  },
  //判断是否登录
  isLogin: function() {
    var that = this;
    if (that.data.loginStatus == 'login') {
      return true;
    } else {
      return false;
    }
  },

  //打开登录窗口
  handleOpenLogin() {
    this.setData({
      visible: true
    });
  },
  //关闭登录窗口
  handleCloseLogin({
    detail
  }) {
    this.setData({
      visible: false
    });
  },

  // 点击页面上的授权登录
  login: function() {
    var that = this;
    if(app.data.accountId && !app.data.phone){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }else{
      wx.navigateTo({
        url: '/pages/empower/empower',
      })
    }
    // wx.login({
    //   success: function(res) {
    //     if (res.code) {
    //       var data = {
    //         code: res.code
    //       }
    //       util.doGet("/weiXin/unionId", data, function(res) {
    //         if (res) {
    //           wx.setStorageSync('unionid', res);
    //           app.data.unionid = res
    //           util.doBaseGet("/accounts/" + res + "", function(base) {
    //             if (base != '' && base != null) {
    //               wx.setStorageSync('accountId', base.id);
    //               wx.setStorageSync('userRole', base.role);
    //               wx.setStorageSync('loginStatus', 'login');
    //               app.data.accountId = base.id;
    //               app.data.userRole = base.role;
    //               app.data.loginStatus = 'login';
    //               that.setData({
    //                 role: base.role,
    //                 loginStatus: 'login',
    //                 visible: false
    //               });
    //               that.loadInfo();
    //               that.packageGetOrderListByStatus(1);
    //               that.packageGetOrderListByStatus(2);
    //               that.packageGetOrderListByStatus(3);
    //             } else {
    //               wx.navigateTo({
    //                 url: '/pages/login/login',
    //               })
    //               // that.handleOpenLogin()
    //             }
    //           })
    //         } else {
    //           that.handleOpenLogin()
    //         }
    //       })
    //     }
    //   }
    // })
  },

  // 点击弹窗的授权登录
  // getUnionId: function(e) {
  //   if (btn) {
  //     return;
  //   }
  //   btn = true;
  //   var that = this
  //   app.data.userInfo = e.detail.userInfo;
  //   wx.login({
  //     success: function(res) {
  //       if (res.code) {
  //         var data = {
  //           encryptedData: e.detail.encryptedData,
  //           code: res.code,
  //           iv: e.detail.iv
  //         }
  //         util.doGet("/weiXin/userInfo", data, function(res) {
  //           // console.log(1, res)
  //           if (res) {

  //             wx.setStorageSync('avatarUrl', res.avatarUrl);
  //             wx.setStorageSync('nickName', res.nickName);
  //             wx.setStorageSync('openid', res.openId);
  //             wx.setStorageSync('unionid', res.unionId);
  //             app.data.avatarUrl = res.avatarUrl;
  //             app.data.nickName = res.nickName;
  //             app.data.openid = res.openId;
  //             app.data.unionid = res.unionId;
  //             //判断是否注册
  //             util.doBaseGet("/accounts/" + res.unionId + "", function(base) {
  //               // console.log(2, base)
  //               if (base != '' && base != null) {
  //                 wx.setStorageSync('accountId', base.id);
  //                 wx.setStorageSync('userRole', base.role);
  //                 wx.setStorageSync('loginStatus', 'login');
  //                 app.data.accountId = base.id;
  //                 app.data.userRole = base.role;
  //                 app.data.loginStatus = 'login';
  //                 that.setData({
  //                   role: base.role,
  //                   loginStatus: 'login',
  //                   visible: false
  //                 });
  //                 that.loadInfo();
  //               } else {
  //                 wx.navigateTo({
  //                   url: '/pages/login/login',
  //                 })
  //               }
  //               btn = false
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // },

  //常见问题

  releaseRequire: function() {
    wx.showToast({
      title: '该功能暂未开放',
      icon: 'none',
      mask: true
    })
    // wx.navigateTo({
    //   url: '/pages/mine/commonproblem/commonproblem',
    // })
  },
  //投诉中心
  complaintCenter: function() {
    wx.makePhoneCall({
      // phoneNumber: '0591-88599000'
      phoneNumber: '400-600-6580'
    })
  },

  //我的优惠券
  toMyCoupon: function() {
    // if (!this.isLogin()) {
    //   this.login();
    //   // return false;
    // }
    if (app.data.loginStatus != 'login') {
      wx.navigateTo({
        url: '/pages/empower/empower',
      })
    }else{
      wx.navigateTo({
        url: '/pages/mine/myCoupon/myCoupon',
      })
    }
  }
})