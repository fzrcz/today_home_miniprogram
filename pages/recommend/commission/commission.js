// 代办介绍
var util = require('../../../utils/util.js')
const app = getApp();
var btn = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/mini-customer/banner-findJob.png',
    commentsList: [],
    commentMore: [],
    //更多评论模态框
    visible: false,
    visibleLogin:false,
    random: Math.random() * 10000
  },
   //更多评论模态框-打开
  handleOpen() {
    this.loadMore();
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

  //评价
  loadData: function () {
    var that = this;
    util.doBaseGet("/commissions/comments/five", function (res) {
      that.setData({
        commentsList: res
      })
    })
  },
  //更多评价
  loadMore: function () {
    var that = this;
    util.doBaseGet("/commissions/comments/0/999999", function (res) {
      that.setData({
        commentMore: res
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res.windowWidth);
        that.setData({
          bodyWidth: res.windowWidth,
          bodyHeight: res.windowHeight
        });
      }
    });
    that.loadData();
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
    btn = false
    this.setData({
      visibleLogin: false
    })
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
  //图片同比例显示
  imageLoad1: function (e) {
    //获取图片真实宽度和高度
    var width = e.detail.width;    
    var  height = e.detail.height;
    //图片真实高度比例
    var  ratio = width/height; 
    //设置图片显示宽度
    var viewWidth = this.data.bodyWidth;
    //计算的高度值
    var viewHeight = viewWidth/ratio;
    this.setData({
      viewWidth: viewWidth,
      viewHeight: viewHeight
    })
  },
  //到确认订单页面
  toOrder: function () {
    if (!this.isLogin()) {
      this.login();
      return false;
    }
    if (app.data.userRole == 'housekeeper') {
      wx.showToast({
        title: '您是阿姨，暂时无法办理该业务',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    wx.navigateTo({
      url: 'commissionOrder/commissionOrder',
    })
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
  //判断是否登录
  isLogin: function () {
    var that = this;
    if (app.data.loginStatus == 'login') {
      return true;
    } else {
      return false;
    }
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
                    loginStatus: 'login',
                    visibleLogin: false
                  });
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
                    loginStatus: 'login',
                    visibleLogin: false
                  });
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


  toDetailImg:function(){
    wx.navigateTo({
      url: '/pages/recommend/detailAd/detailAd?page=entrust'
    })
  }
})