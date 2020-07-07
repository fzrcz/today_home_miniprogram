// common/maskModal.js
var app = getApp();
var util = require('../../utils/util.js')
let animationShowHeight = 600; //动画偏移高度
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 遮罩层变量
    animationData: "",
    showModalStatus: false,
    //登录提示
    showModalLogin: false,
    onBtn: 0,
  },

  //组件所在的生命周期
  pageLifetimes: {
    load: function(){
      var that = this;
      console.log("maskmodel的load")
      // 获取弹窗的轮播图
      // that.getRollPicList();
    },
    show: function() {
      console.log("maskmodel的show")
      var that = this
      console.log("111" + app.data.accountId)
      console.log("222" + app.data.haveJump)
      if((app.data.accountId || app.data.phone) && app.data.haveJump == 0){
        console.log("**********************************")
        app.data.haveJump++;
        that.getRollPicList();
      }else{
        // 没有page是10000的，用这个就是为了不让查出广告的弹窗
        that.setData({
          path: ''
        })
      }

      that.getWindowHeight();
      // 没有accountId或者没有电话号码，会弹出登录窗口，
      // 目前暂定，一天只弹出一次
      if ((!app.data.accountId || !app.data.phone) && app.data.jumpNum == 0) {
      // if (!app.data.accountId || !app.data.phone) {
        // console.log("#######",app.data.accountId)
        // console.log("%%%%+%%%%",app.data.phone)
        that.showModalLogin();
        app.data.jumpNum++;
      } else {
        that.hideModalLogin()
      }
      // console.log("登录次数：", that.data.jumpNum)

      // if (app.data.loginStatus == 'login') {
      //   this.showModal()
      // }
      // 调用是否有优惠券的接口
      // if (app.data.accountId) {
      //   that.getIsCoupons();
      // }
    },

  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 调用是否有优惠券的接口
    getIsCoupons: function() {
      var that = this;
      // 第一批优惠券调用这个MS00203的接口，之后新的优惠券就调用MS00205接口
      var data = {
        accountId: app.data.accountId,
      }
      util.reqLoading(app.globalData.apiUrl, 'MS00203', data, 'GET', '加载中...', function(res) {
        // var couponsBatchIdsList = [];
        // couponsBatchIdsList.push(3);
        // console.log("批次数组：")
        // console.log(app.globalData.couponsBatchIdsList)
        // var data = {
        //   accountId: app.data.accountId,
        //   type: 1, // 1.系统发放 0.不是系统发放
        //   couponsBatchIds: app.globalData.couponsBatchIdsList,
        // }
        // util.reqLoading(app.globalData.apiUrl, 'MS00205', data, 'GET', '加载中...', function(res) {

          console.log("调用是否有优惠券maskmodel，返回：");
          console.log(res);
          // isFlag是新领券的窗口用的，根据这个判断是否还有券要领
          that.setData({
            isFlag: res.data[0].flag,
          })
          // if (res.data[0].flag || res1.data[0].flag) {
          if (res.data[0].flag) {

            // var data = {
            //   accountId: app.data.accountId,
            //   type: 1, // 1.系统发放 2.手点击领取
            //   couponsBatchIds: app.globalData.couponsBatchIdsList,
            // }
            // util.reqLoading(app.globalData.apiUrl, 'MS00204', data, 'GET', '加载中...', function(res2) {
            //   console.log("onload查询优惠券，返回：");
            //   console.log(res2);
            //   that.setData({
            //     couponsList: res2.data,
            //   })
            // })

            that.setData({
              showModalStatus: true
            })
          } else {
            that.setData({
              showModalStatus: false
            })
          }
        })
      // })
    },

    // 查询轮播图的方法
    getRollPicList: function(){
      var that = this;
      var data = {
        page: 3,// 1.查询的是首页的轮播图 2.新人专享的轮播图 3.弹窗的轮播图
      }
      util.reqLoading(app.globalData.apiUrl, 'MS01001', data, 'POST', '加载中...', function (res) {
        console.log("弹窗轮播图查询，返回：", res);
        
        if(res.data[0].info[0]){
          that.setData({
            // rollPicList: res.data[0].info,
            path: res.data[0].info[0].path,
            haveJump: app.data.haveJump
          })
        }else{
          that.setData({
            path: ''
          })
        }
      })
    },

    getWindowHeight: function() {
      var _this = this
      wx.getSystemInfo({
        success: function(res) {
          _this.setData({
            windowHeight: res.windowHeight
          })
        }
      })
    },
    // 显示遮罩层  
    showModal: function(e) {
      //创建一个动画实例animation。调用实例的方法来描述动画。
      var animation = wx.createAnimation({
        duration: 500, //动画持续时间500ms
        timingFunction: "ease", //动画以低速开始，然后加快，在结束前变慢
        delay: 0 //动画延迟时间0ms
      })
      this.animation = animation
      //调用动画操作方法后要调用 step() 来表示一组动画完成
      animation.translateY(animationShowHeight).step() //     在Y轴向上偏移300
      this.setData({
        //通过动画实例的export方法导出动画数据传递给组件的animation属性。
        animationData: animation.export(),
        showModalStatus: true //显示遮罩层
      })
      setTimeout(function() {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 1)
    },
    // 隐藏遮罩层  
    hideModal: function(e) {
      var that = this;

      if (app.data.loginStatus == 'login') {
        wx.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 1500,
          success: function() {
            setTimeout(function() {
              wx.navigateTo({
                url: '/pages/mine/myCoupon/myCoupon',
              })
            }, 500) //延迟时间
          }
        })
      } else if (app.data.accountId) {
        wx.setStorageSync('loginStatus', 'login');
        app.data.loginStatus = 'login';
        wx.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 1500,
          success: function() {
            setTimeout(function() {
              wx.navigateTo({
                url: '/pages/mine/myCoupon/myCoupon',
              })
            }, 500) //延迟时间
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/empower/empower',
        })
      }

      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: "ease",
        delay: 0
      })
      this.animation = animation;
      animation.translateY(animationShowHeight).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function() {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false
        })
      }.bind(this), 200)


    },
    // 优惠券弹窗，点击×关闭弹窗
    closeHideModal: function(){
      var that = this;
      that.setData({
        showModalStatus: false
      })

    },

    // 显示登录提示遮罩层  
    showModalLogin: function(e) {
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: "ease",
        delay: 0
      })
      this.animation = animation
      animation.translateY(animationShowHeight).step()
      this.setData({
        animationData: animation.export(),
        showModalLogin: true
      })
      setTimeout(function() {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 1)
    },
    // 隐藏遮罩层  
    hideModalLogin: function() {
      var that = this;
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: "ease",
        delay: 0
      })
      this.animation = animation;
      animation.translateY(animationShowHeight).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function() {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalLogin: false
        })
      }.bind(this), 200)
    },
    //跳转登录页
    goEempower: function() {
      // 如果有accountId，没有手机号，那么跳到授权手机号页面
      if(app.data.accountId && !app.data.phone){
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }else{
        wx.navigateTo({
          url: '/pages/empower/empower',
        })
      }
    },

    // 延期跳转详情
    toDetail: function(){
      var that = this;
      wx.navigateTo({
        // url: '/pages/recommend/serviceDelay/serviceDelay',
        url: '/pages/recommend/defendVirus/defendVirus?type=2',
      })
    },

    // 关闭广告弹窗
    closeAdver: function(){
      var that = this;
      that.setData({
        path: '',
      })
    },
  }
})