var util = require('../../utils/util.js')
const app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let WxNotificationCenter = require('../../utils/WxNotificationCenter')
var qqmapsdk;
var i = 1;
var j = 1;
var k = 1;
var x = 1;
var y = 1;
var z = 1;
let animationShowHeight = 600; //动画偏移高度
Page({

  //页面的初始数据
  data: {
    str:'',
    strtime:0,
    current:0,
    spinShow: "none",
    topSearch: "none",
    loadMoreTip: '疯狂加载中',
    loadType: true,
    offset: 0,
    limit: 10,
    colOne: [],
    colTwo: [],
    scrollH: 0,
    imgWidth: 0,
    colOneHeight: 0,
    colTwoHeight: 0,
    msgCount: 0,
    selectCompany: {},
    isShowCompany: false,
    companyId: 1,
    serverlist: [
      // {
      //   imageUrl: "/image/newpoeple.png",
      //   description: "新人专享",
      //   url: "newpeople/newpeople"
      // },
      // {
      //   imageUrl: "/image/antarea.png",
      //   description: "抗疫专区",
      //   url: 'oddjob/sterilize/sterilize'
      // },
      // {
      //   imageUrl: "/image/hourCleaning.png",
      //   description: "钟点保洁",
      //   url: "/pages/recommend/oddjob/hourCleaning/hourCleaning"
      // },
      // {
      //   imageUrl: "/image/appliancesCleaning.png",
      //   description: "家电清洗",
      //   url: "/pages/recommend/oddjob/appliancesCleaning/appliancesCleaning"
      // },{
      //   imageUrl: "/image/nannymoon.png",
      //   description: "月嫂保姆",
      //   url: '/pages/recommend/classifyWorkers/classifyWorkers'
      // },
      // {
      //   imageUrl: "/image/mitesRemoval.png",
      //   description: "除尘除螨",
      //   url: "/pages/recommend/oddjob/mitesRemoval/mitesRemoval"
      // },
      // {
      //   imageUrl: "/image/leatherCare.png",
      //   description: "翻新养护",
      //   url: "/pages/recommend/oddjob/leatherCare/leatherCare"
      // },
      // {
      //   imageUrl: "/image/unlock.png",
      //   description: "今日直购",
      //   url: ""
      // },
      // {
      //   imageUrl: "/image/dredgePipeline.png",
      //   description: "管道疏通",
      //   url: "/pages/recommend/oddjob/dredgePipeline/dredgePipeline"
      // },
      // {
      //   imageUrl: "/image/removeHCHO.png",
      //   description: "甲醛治理",
      //   url: "/pages/recommend/oddjob/removeHCHO/removeHCHO"
      // },
      // {
      //   imageUrl: "/image/appliancesRepair.png",
      //   description: "家电维修",
      //   url: "/pages/recommend/oddjob/appliancesRepair/appliancesRepair"
      // }
    ],
    serverlist2: [
      {
        imageUrl: "/image/leatherCare.png",
        description: "翻新养护",
        url: "/pages/recommend/oddjob/leatherCare/leatherCare"
      },
      {
        imageUrl: "/image/pet.png",
        description: "宠物洁",
        url: "petclean/petclean"
      },
      {
        imageUrl: "/image/dredgePipeline.png",
        description: "管道疏通",
        url: "/pages/recommend/oddjob/dredgePipeline/dredgePipeline"
      },
      {
        imageUrl: "/image/removeHCHO.png",
        description: "甲醛治理",
        url: "/pages/recommend/oddjob/removeHCHO/removeHCHO"
      },
      {
        imageUrl: "/image/menu_ywqx.jpeg",
        description: "衣物清洗",
        url: "/pages/recommend/oddjob/ywqx/ywqx"
      },
      {
        imageUrl: "/image/menu_bjfw.jpeg",
        description: "搬家服务",
        url: "/pages/recommend/oddjob/bjfw/bjfw"
      },
    ],
    autoplay: false, //是否自动切换	
    indicatordots: false, //是否显示面板指示点
    showView: true, //点击切换
    currentTab: 0, // tab切换 
    isShowMask: true, 
    // 遮罩层变量
    animationData: "",
    showModalStatus: false,
    //登录提示
    showModalLogin: false
  },
  changeswip(e){
    this.setData({
      current: e.detail.current
    })
  },
  toCompany() {
    console.log('去选择分店')
    this.setData({
      isShowCompany: true
    })
  },
  bindPickerChange(e) {
    console.log(e)
  },
  toHdPage() {
    wx.navigateTo({
      url: '/pages/recommend/hdPage/hdPage',
    })
  },
  tapswip(){
    var current=1
    if (this.data.current == 1) current=0;
    this.setData({
      current: current
    })
  },
  seytime() {
    var that = this;
    const ordernam = ['钟点保洁', '家电清洗', '除尘除螨', '翻新养护', '管道疏通', '甲醛治理', '保姆', '月嫂']
    const namef = "赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤"
    const surname = namef[Math.ceil(Math.random() * namef.length - 1)];
    const srvename = ordernam[Math.ceil(Math.random() * 7)];
    that.setData({
      str: "2s前" + surname + '**已下单' + srvename + '服务',
      strtime: 1
    })
  },
  //生命周期函数--监听页面加载
  async onLoad(options) {
    await this.getUserLocation()
    this.setData({
      companyId: wx.getStorageSync('selectCompany').id
    })
    if(wx.getStorageSync('selectCompany')) {
      this.setData({
        selectCompany: wx.getStorageSync('selectCompany'),
        isShowCompany: false
      })
    }
    // WxNotificationCenter.addNotification('homeUpdate', this.homeNotification, this)
    // this.setData({
    //   isShowCompany: false
    // })

    app.data.source = 123;
    app.data.parameter = 'kokokoko';
    var that = this;
    //页面动画
    this.setData({
      timec: Math.ceil(Math.random() * 1)
    })
    setInterval(() => {
      this.seytime();
      setTimeout(()=> {
        this.setData({
          strtime: 0
        })
      }, 10000)
      // console.log(this.data.timec * 20 + '秒后执行')
      this.setData({
        timec: Math.ceil(Math.random() * 7)
      })
    }, 20000 * this.data.timec)

    // // 获取来源
    // var source = options.soruce;
    // that.setData({
    //   source: source,
    // })

    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;
        //保姆和月嫂
        let imgWidthNanny = imgWidth - 10;
        let scale = imgWidthNanny / 344;
        let imgHeightNanny = 176 * scale;
        //签约保障
        let imgWidthCommission = res.windowWidth - 10;
        let scaleCommission = imgWidthCommission / 685;
        let imgHeightCommission = 176 * scaleCommission;
        this.setData({
          baseWidth: ww,
          banseHeight: wh,
          scrollH: scrollH,
          imgWidth: imgWidth,
          imgHeightNanny: imgHeightNanny,
          imgWidthNanny: imgWidthNanny,
          imgHeightCommission: imgHeightCommission,
          imgWidthCommission: imgWidthCommission,
          leftVal: imgWidth * 0.5 - 20
        });
      }
    })
    

    //地址定位
    qqmapsdk = new QQMapWX({
      key: 'BW5BZ-34TC4-PYLUX-XUPZ5-G7YGE-5FBFG'
    });
    // this.loadData();
    // this.loadWorkType();
    // this.loadBanner();
    // // 加载热门服务
    // this.getHotServiceList();
    // this.getList();

    // 加载为您推荐的钟点保洁
    this.setData({
      // businessTypeId: '6',
      showType: 6,
    })

  },
  handleMask() {
    this.setData({
      isShowMask: false
    })
  },
  homeNotification() {
    console.log('接收到更新')
    this.setData({
      selectCompany: wx.getStorageSync('selectCompany'),
      isShowCompany: false
    })
    // this.loadData();
    // this.loadWorkType();
    // this.loadBanner();
    // this.loadInfo();
    // this.getList();
    // // 加载热门服务
    // this.getHotServiceList();
    // // 轮播图查询
    // this.getRollPicList();
    // this.showModal()

  },
  // 查询优惠券的方法
  getCouponList: function (status, available) {
    var that = this;
    // MS00201获取优惠券列表
    var data = {
      accountId: app.data.accountId,
      status: status,// 使用状态：1.可用 0.已使用 
      available: available,// available：过期状态 1.未过期 0.已过期
    }
    util.reqLoading(app.globalData.apiUrl, 'MS00201', data, 'POST', '加载中...', function (res) {
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
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    let vm = this
    if(vm.data.companyId == 1) {
      let menu = [
        {
          imageUrl: "/image/newpoeple.png",
          description: "新人专享",
          url: "newpeople/newpeople"
        },
        {
          imageUrl: "/image/antarea.png",
          description: "抗疫专区",
          url: 'oddjob/sterilize/sterilize'
        },
        {
          imageUrl: "/image/hourCleaning.png",
          description: "钟点保洁",
          url: "/pages/recommend/oddjob/hourCleaning/hourCleaning"
        },
        {
          imageUrl: "/image/appliancesCleaning.png",
          description: "家电清洗",
          url: "/pages/recommend/oddjob/appliancesCleaning/appliancesCleaning"
        },{
          imageUrl: "/image/nannymoon.png",
          description: "月嫂保姆",
          url: '/pages/recommend/classifyWorkers/classifyWorkers'
        },
        {
          imageUrl: "/image/mitesRemoval.png",
          description: "除尘除螨",
          url: "/pages/recommend/oddjob/mitesRemoval/mitesRemoval"
        },
        {
          imageUrl: "/image/jsgj.png",
          description: "家事管家",
          url: "/pages/recommend/oddjob/jsgj/jsgj"
        },
        {
          imageUrl: "/image/unlock.png",
          description: "今日直购",
          url: ""
        },
        {
          imageUrl: "/image/menu_ywqx.jpeg",
          description: "衣物清洗",
          url: "/pages/recommend/oddjob/ywqx/ywqx"
        },
        {
          imageUrl: "/image/menu_bjfw.jpeg",
          description: "搬家服务",
          url: "/pages/recommend/oddjob/bjfw/bjfw"
        },
        // {
        //   imageUrl: "/image/dredgePipeline.png",
        //   description: "管道疏通",
        //   url: "/pages/recommend/oddjob/dredgePipeline/dredgePipeline"
        // },
        // {
        //   imageUrl: "/image/removeHCHO.png",
        //   description: "甲醛治理",
        //   url: "/pages/recommend/oddjob/removeHCHO/removeHCHO"
        // },
        // {
        //   imageUrl: "/image/appliancesRepair.png",
        //   description: "家电维修",
        //   url: "/pages/recommend/oddjob/appliancesRepair/appliancesRepair"
        // }
      ]
      vm.setData({
        serverlist: menu
      })
      console.log('serverlist')
      // console.log(this.data.serverlist)
      
    } else {
      let menu = [
        {
          imageUrl: "/image/newpoeple.png",
          description: "新人专享",
          url: "newpeople/newpeople"
        },
        {
          imageUrl: "/image/antarea.png",
          description: "抗疫专区",
          url: 'oddjob/sterilize/sterilize'
        },
        {
          imageUrl: "/image/hourCleaning.png",
          description: "钟点保洁",
          url: "/pages/recommend/oddjob/hourCleaning/hourCleaning"
        },
        {
          imageUrl: "/image/appliancesCleaning.png",
          description: "家电清洗",
          url: "/pages/recommend/oddjob/appliancesCleaning/appliancesCleaning"
        },
        {
          imageUrl: "/image/mitesRemoval.png",
          description: "除尘除螨",
          url: "/pages/recommend/oddjob/mitesRemoval/mitesRemoval"
        },
        {
          imageUrl: "/image/removeHCHO.png",
          description: "甲醛治理",
          url: "/pages/recommend/oddjob/removeHCHO/removeHCHO"
        },
        {
          imageUrl: "/image/menu_bjfw.jpeg",
          description: "搬家服务",
          url: "/pages/recommend/oddjob/bjfw/bjfw"
        },
        {
          imageUrl: "/image/menu_sdwx.png",
          description: "水电维修",
          url: "/pages/recommend/oddjob/sdwx/sdwx"
        },
      ]
      vm.setData({
        serverlist: menu
      })
      console.log('serverlist')
      // console.log(this.data.serverlist)
    }
    // var data = {
    //   accountId: app.data.accountId,
    //   type: 1, // 1.系统发放 2.手点击领取
    //   couponsBatchId: app.globalData.couponsBatchIdsList,
    // }
    // util.reqLoading(app.globalData.apiUrl, 'MS00205', data, 'GET', '加载中...', function (res2) {
    //   console.log("onload查询优惠券205205，返回：");
    //   console.log(res2);
    //   // that.setData({
    //   //   couponsList: res2.data,
    //   // })
    // })

    // this.setData({
    //   companyId: wx.getStorageSync('selectCompany').id
    // })
    // debugger
    
    // console.log('selectCompany的ID')
    // console.log(wx.getStorageSync('selectCompany').id)
    // console.log('首页的app')
    // console.log(app)
    // util.doGet("/company/companyList", {}, (res) => {
    //   console.log('分店列表：');
    //   console.log(res);
    //   app.data.companyList = res.data
    //   // wx.setStorageSync('companyList', res.data)
    // })

    
    // this.setNavMenu()
    //  else {
    //   
    // }

    if (!app.data.accountId) {
      this.showModalLogin()
    } else {
      this.hideModalLogin()
    }
    // that.loadInfo();
    // // that.getUserLocation();
    // that.showModal()
    // // 加载热门服务
    // this.getHotServiceList();

    // // 轮播图查询
    // that.getRollPicList();

    // 调用是否有优惠券的接口
    // if (app.data.loginStatus == 'login') {
    //   that.getIsCoupons();
    // }
    // 调用获取优惠券列表的方法
    if(app.data.loginStatus == 'login'){
      that.getCouponList(1, 1, 0);
    }
    
    
  },

  // 查询轮播图的方法
  getRollPicList: function(){
    // debugger
    var that = this;
    var data = {
      // page: 1,// 1.查询的是首页的轮播图
      companyId: wx.getStorageSync('selectCompany').id
    }
    util.reqLoading(app.globalData.apiUrl, 'MS01001', data, 'POST', '加载中...', function (res) {
      console.log("轮播图查询，返回：", res);
      that.setData({
        rollPicList: res.data[0].info,
      })
    })
  },
  // 领券
  toGetCoupons: function() {
    if (app.data.loginStatus == 'login') {
      wx.navigateTo({
        url: '/pages/mine/myCoupon/myCoupon',
      })
    } else if (app.data.accountId) {
      wx.setStorageSync('loginStatus', 'login');
      app.data.loginStatus = 'login';
      wx.navigateTo({
        url: '/pages/mine/myCoupon/myCoupon',
      })
    } else {
      wx.navigateTo({
        url: '/pages/empower/empower',
      })

    }

  },
  // 调用是否有优惠券的接口
  // getIsCoupons: function() {
  //   var that = this;
  //   // 第一批优惠券调用这个MS00203的接口，之后新的优惠券就调用MS00205接口
  //   var data = {
  //     accountId: app.data.accountId,
  //   }
  //   util.reqLoading(app.globalData.apiUrl, 'MS00203', data, 'GET', '加载中...', function(res) {

  //     // var data = {
  //     //   accountId: app.data.accountId,
  //     //   type: 1, // 1.系统发放 2.手点击领取
  //     //   couponsBatchId: app.globalData.couponsBatchIdsList,
  //     // }
  //     // util.reqLoading(app.globalData.apiUrl, 'MS00205', data, 'GET', '加载中...', function(res) {

  //     console.log("调用是否有优惠券，返回：");
  //     console.log(res);
  //     if (res.data[0].flag) {

  //       var data = {
  //         accountId: app.data.accountId,
  //         type: 1, // 1.系统发放 2.手点击领取
  //         couponsBatchIds: app.globalData.couponsBatchIdsList,
  //       }
  //       util.reqLoading(app.globalData.apiUrl, 'MS00204', data, 'GET', '加载中...', function(res2) {
  //         console.log("onload查询优惠券，返回：");
  //         console.log(res2);
  //         that.setData({
  //           couponsList: res2.data,
  //         })
  //       })

  //       that.setData({
  //         showModalStatus: true
  //       })
  //     } else {
  //       that.setData({
  //         showModalStatus: false
  //       })
  //     }
  //   })
  // },

  //跳转服务
  goServer: function(e) {
    console.log(e)
    if (e.currentTarget.dataset.url == '') {
      // wx.showToast({
      //   title: '该功能暂未开放',
      //   icon: 'none', 
      //   duration: 2000
      // })

      wx.navigateToMiniProgram({
        appId: 'wx3cd9055ad8bbb8e2',
        path: 'common/pages/index/index',
        extraData: {},
        envVersion: 'develop',
        success(res) {
          // 打开成功
          console.log(res)
        }
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      });
    }
  },

  //跳转家电维修
  toDredgePipeline:function(){
    wx.navigateTo({
      url: '/pages/recommend/oddjob/dredgePipeline/dredgePipeline',
    });
  },
  toremoveHCHO: function () {
    wx.navigateTo({
      url: '/pages/recommend/oddjob/removeHCHO/removeHCHO',
    });
  },

  /** 
   * 点击tab切换 
   */

  swichNav: function(e) {
    var that = this;
    var current = e.target.dataset.current;
    // console.log('点击切换：');
    // console.log(that.data.currentTab);
    // console.log(e.target.dataset.current);
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      });
    }
    if (current == 0) {
      return;
    }
    if (current == 1) {
      if (i == 1) {
        i++;
        that.followCurrentGetList(current);
      }
    }
    if (current == 2) {
      if (j == 1) {
        j++;
        that.followCurrentGetList(current);
      }
    }
    if (current == 3) {
      if (k == 1) {
        k++;
        that.followCurrentGetList(current);
      }
    }
    // that.followCurrentGetList(current);
  },

  /** 
   * 滑动切换tab 
   */
  bindChange: function(e) {
    var that = this;
    // console.log('滑动切换：');
    // console.log(e.detail.current);
    var current = e.detail.current;
    var index = current
    index = parseInt(index)
    that.setData({
      currentTab: index
    });
    console.log(index)
    var query = wx.createSelectorQuery();
    query.select('#swiper-' + index).boundingClientRect(function(rect) {
      that.setData({
        sHeight: rect.height + 'px'
      })
    }).exec();

    // if (current == 0) {
    //   return;
    // }
    // if (current == 1) {
    //   if (x == 1) {
    //     console.log(11111111)
    //     x++;
    //     that.followCurrentGetList(current);
    //   }
    // }
    // if (current == 2) {
    //   if (y == 1) {
    //     console.log(22222222)
    //     y++;
    //     that.followCurrentGetList(current);
    //   }
    // }
    // if (current == 3) {
    //   if (z == 1) {
    //     console.log(33333333)
    //     z++;
    //     that.followCurrentGetList(current);
    //   }
    // }

    that.followCurrentGetList(current);


    // var index = e.detail.current
    // that.setData({
    //   currentTab: e.detail.current
    // });
  },
  // 把current对应0,1,2,3的时候，对businissTypeId赋值，然后查询对应列表，进行封装
  // 6 保洁 7 家维 8 家庭健康 9 甲醛治理 10 管道疏通 11 除尘除螨 12
  followCurrentGetList: function(current) {
    var that = this;
    if (current == 0) {
      that.setData({
        // businessTypeId: '6'
        showType: 6
      })
    }
    if (current == 1) {
      that.setData({
        // businessTypeId: '11'
        showType: 11
      })
    }
    if (current == 2) {
      that.setData({
        // businessTypeId: '7'
        showType: 7
      })
    }
    if (current == 3) {
      that.setData({
        // businessTypeId: '9'
        showType: 9
      })
    }
    that.getList();
  },

  // 为您推荐，获取相应的列表
  getList: function() {
    var that = this;
    var data = {
      // businessTypeId: that.data.businessTypeId,
      showType: that.data.showType,
      // activityStatus: 'miniapp',
      status: 'nomal',
      platform: 'wechat',
      companyId: wx.getStorageSync('selectCompany').id
    }
    // util.doGet("/product/queryList", data, function (res) {
    //   console.log(res)
    //   that.setData({
    //     productList: res.data
    //   })
    // })
    util.doGet("/productRecommend/queryList", data, function(res) {
      console.log('为您推荐：');
      console.log(res);
      // util.doGet("/product/queryList", data, function(res) {
      // console.log(res)
      that.setData({
        productList: res.data,
      })
      var query = wx.createSelectorQuery();
      query.select('#swiper-0').boundingClientRect()
      query.exec(function(res) {
        //取高度
        console.log(res)
        that.setData({
          sHeight: res[0].height + 'px'
        })
      })
    })
  },
  // 热门服务，获取相应的列表
  getHotServiceList: function() {
    var that = this;
    var data = {
      // businessTypeId: that.data.businessTypeId,
      // activityStatus: 'miniapp',
      // status: 'put',
      platform: 'miniapp',
      companyId: wx.getStorageSync('selectCompany').id

    }
    util.doGet("/productRecommend/queryList", data, function(res) {
      console.log('今日特价：');
      console.log(res);
      that.setData({
        hotProductList: res.data,
      })
    })
  },
  // 新版：进入产品详情
  newToDetail: function(e) {
    var activityId = e.currentTarget.dataset.activityid;
    var productId = e.currentTarget.dataset.productid;
    if (!activityId) {
      activityId = ''
    }
    wx.navigateTo({
      url: '/pages/recommend/oddjob/productDetail/productDetail?productId=' + productId + '&activityId=' + activityId,
    });
  },

  // 旧版：进入产品详情
  toDetail: function(e) {
    var activityid = e.currentTarget.dataset.activityid;
    if (!activityid) {
      activityid = ''
    }
    wx.navigateTo({
      url: '/pages/recommend/oddjob/productDetail/productDetail?productId=' + e.currentTarget.dataset.productid + '&activityId=' + activityid,
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    return {
      title: '互联网家政便民一站式平台',
      // imageUrl: 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/ad/img-share04.png?' + Math.random(),
      // path: '/pages/share/recruit/recruit?scene=' + app.data.accountId,
      success: function(res) {

      },
      fail: function(res) {

      }
    }
  },

  //滚动监听
  onPageScroll: function(e) {
    if (e.scrollTop > 190) {
      wx.setNavigationBarColor({
        // 必写项
        frontColor: '#ffffff',
        // 必写项
        backgroundColor: '#ff7f27',
        animation: { // 可选项
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
      this.setData({
        topSearch: "block"
      })
    } else if (e.scrollTop < 190) {
      wx.setNavigationBarColor({
        // 必写项
        frontColor: '#000000',
        // 必写项
        backgroundColor: '#FFF',
        animation: { // 可选项
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
      this.setData({
        topSearch: "none"
      })
    }
  },

  //加载数据
  loadData: function() {
    var that = this;
    var data = {
      // employerId:'1',
      offset: that.data.offset,
      limit: that.data.limit,
      companyId: wx.getStorageSync('selectCompany').id
    }
    // console.log(22222)
    that.showLoadMore();
    util.doGet("/recommend/housekeepers", data, function(res) {
      that.showLoadMore();
      if (res) {
        for (var i = 0; i < res.length; i++) {
          //图片比例计算,自适应高度
          if (res[i].visualizePicDto == null) {
            var arr = {
              'height': 1080,
              'width': 720,
              'visualizePicUrl': that.data.defultImg
            };
            res[i].visualizePicDto = arr;
          }
          let workType = res[i].workType;
          if (workType == '月嫂') {
            res[i].workType = 'maternity';
          } else {
            res[i].workType = 'nanny';
          }
          var colorType = {
            'colorType': '#9A9A9A'
          }
          let personStatus = res[i].personStatus;
          if (personStatus == 'work') {
            colorType = '#9A9A9A';
          }
          if (personStatus == 'unknown') {
            colorType = '#00A2E8';
          }
          if (personStatus == 'precontract') {
            colorType = '#FF7F27';
          }
          if (personStatus == 'rest') {
            colorType = '#22B14C';
          }
          res[i]["colorType"] = colorType;
          let oImgW = res[i].visualizePicDto.width;
          let oImgH = res[i].visualizePicDto.height;
          let imgWidth = that.data.imgWidth;
          let scale = imgWidth / oImgW;
          let imgHeight = oImgH * scale;
          res[i].visualizePicDto.height = imgHeight;
          //获取列的高度
          let colOneHeight = that.data.colOneHeight;
          let colTwoHeight = that.data.colTwoHeight;
          //判断当前图片添加到左列还是右列
          if (colOneHeight <= colTwoHeight) {
            colOneHeight += imgHeight;
            that.data.colOne.push(res[i])
          } else {
            colTwoHeight += imgHeight;
            that.data.colTwo.push(res[i])
          }

          //保存列高度
          that.setData({
            colOneHeight: colOneHeight,
            colTwoHeight: colTwoHeight
          })
        }
        //刷新数据
        that.setData({
          colOne: that.data.colOne,
          colTwo: that.data.colTwo
        })
      } else {
        that.setData({
          loadType: false,
          loadMoreTip: '已经滑倒最底部啦！'
        })
      }
    })
  },

  //下拉事件
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.setData({
      offset: 0,
      limit: 10,
      colOne: [],
      colTwo: [],
      colOneHeight: 0,
      colTwoHeight: 0
    });
    this.loadData();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  //上拉事件
  onReachBottom() {
    this.setData({
      offset: this.data.offset += 10
    })
    this.loadData()
  },

  //底部加载更多的提示
  showLoadMore() {
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

  //查询阿姨类型
  loadWorkType: function() {
    var that = this;
    util.doBaseGet("/housekeepersWorkType/parent", function(res) {
      for (var i = 0; i < res.length; i++) {
        if (res[i].name == '保姆') {
          that.setData({
            nanny: res[i].id
          })
        }
        if (res[i].name == '月嫂') {
          that.setData({
            maternity: res[i].id
          })
        }
      }
    })
  },
  //查询banner
  loadBanner: function() {
    var that = this;
    util.doBaseGet("/advertisingPics/recommend", function(res) {
      // for (var i = 0; i<res.length;i++){
      //   let oImgW = res[i].width;
      //   let oImgH = res[i].height;
      //   let imgWidth = that.data.baseWidth;
      //   let scale = imgWidth / oImgW;
      //   let imgHeight = oImgH * scale;
      //   res[i].height = imgHeight;
      // }
      that.setData({
        bannerList: res
      })
    })
  },

  toDetailPic: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    });
  },

  //保姆列表
  toNannyList: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/recommend/housekeeperList/housekeeperList?workTypeId=' + that.data.nanny,
    })
  },
  //月嫂列表
  toMaternityList: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/recommend/housekeeperList/housekeeperList?workTypeId=' + that.data.maternity,
    })
  },
  //零工
  toOddJobList: function() {
    wx.navigateTo({
      url: '/pages/recommend/oddjob/oddjob',
    })
  },

  //更多阿姨列表
  toAllList: function() {
    wx.navigateTo({
      url: '/pages/recommend/housekeeperAll/housekeeperAll',
    })
  },
  //阿姨搜索
  toSearch: function() {
    wx.navigateTo({
      url: '/pages/recommend/searchHousekeeper/searchHousekeeper',
    })
  },
  //代办
  toCommission: function() {
    wx.navigateTo({
      url: '/pages/recommend/commission/commission',
    })
  },
  //阿姨详细信息
  toDetail: function(e) {
    var id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/recommend/housekeeperDetail/housekeeperDetail?housekeeperId=' + id,
    })
  },

  // 判断用户是否授权
  getUserLocation: function() {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
                wx.navigateBack({
                  delta: 1
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        } else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation: function() {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        // console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      },
      fail: function(res) {
        // console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置 定位获取数据
  getLocal: function(latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(res) {
        console.log('定位')
        console.log(JSON.stringify(res));
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        let district = res.result.ad_info.district
        util.doGet("/company/getCompany", {city, county: district}, res => {
          console.log('获取当前分店：');
          if(!res.data) {
            this.setData({
              selectCompany: {}
            })
          } else {
            wx.setStorageSync('selectCompany',res.data[0])
            vm.setData({
              companyId: res.data[0].id,
              selectCompany: res.data[0]
            })
          }
          if(vm.data.companyId == 1) {
            let menu = [
              {
                imageUrl: "/image/newpoeple.png",
                description: "新人专享",
                url: "newpeople/newpeople"
              },
              {
                imageUrl: "/image/antarea.png",
                description: "抗疫专区",
                url: 'oddjob/sterilize/sterilize'
              },
              {
                imageUrl: "/image/hourCleaning.png",
                description: "钟点保洁",
                url: "/pages/recommend/oddjob/hourCleaning/hourCleaning"
              },
              {
                imageUrl: "/image/appliancesCleaning.png",
                description: "家电清洗",
                url: "/pages/recommend/oddjob/appliancesCleaning/appliancesCleaning"
              },{
                imageUrl: "/image/nannymoon.png",
                description: "月嫂保姆",
                url: '/pages/recommend/classifyWorkers/classifyWorkers'
              },
              {
                imageUrl: "/image/mitesRemoval.png",
                description: "除尘除螨",
                url: "/pages/recommend/oddjob/mitesRemoval/mitesRemoval"
              },
              {
                imageUrl: "/image/jsgj.png",
                description: "家事管家",
                url: "/pages/recommend/oddjob/jsgj/jsgj"
              },
              {
                imageUrl: "/image/unlock.png",
                description: "今日直购",
                url: ""
              },
              {
                imageUrl: "/image/menu_ywqx.jpeg",
                description: "衣物清洗",
                url: "/pages/recommend/oddjob/ywqx/ywqx"
              },
              {
                imageUrl: "/image/menu_bjfw.jpeg",
                description: "搬家服务",
                url: "/pages/recommend/oddjob/bjfw/bjfw"
              },
              // {
              //   imageUrl: "/image/dredgePipeline.png",
              //   description: "管道疏通",
              //   url: "/pages/recommend/oddjob/dredgePipeline/dredgePipeline"
              // },
              // {
              //   imageUrl: "/image/removeHCHO.png",
              //   description: "甲醛治理",
              //   url: "/pages/recommend/oddjob/removeHCHO/removeHCHO"
              // },
              // {
              //   imageUrl: "/image/appliancesRepair.png",
              //   description: "家电维修",
              //   url: "/pages/recommend/oddjob/appliancesRepair/appliancesRepair"
              // }
            ]
            vm.setData({
              serverlist: menu
            })
            console.log('serverlist')
            // console.log(this.data.serverlist)
            
          } else {
            let menu = [
              {
                imageUrl: "/image/newpoeple.png",
                description: "新人专享",
                url: "newpeople/newpeople"
              },
              {
                imageUrl: "/image/antarea.png",
                description: "抗疫专区",
                url: 'oddjob/sterilize/sterilize'
              },
              {
                imageUrl: "/image/hourCleaning.png",
                description: "钟点保洁",
                url: "/pages/recommend/oddjob/hourCleaning/hourCleaning"
              },
              {
                imageUrl: "/image/appliancesCleaning.png",
                description: "家电清洗",
                url: "/pages/recommend/oddjob/appliancesCleaning/appliancesCleaning"
              },
              {
                imageUrl: "/image/mitesRemoval.png",
                description: "除尘除螨",
                url: "/pages/recommend/oddjob/mitesRemoval/mitesRemoval"
              },
              {
                imageUrl: "/image/removeHCHO.png",
                description: "甲醛治理",
                url: "/pages/recommend/oddjob/removeHCHO/removeHCHO"
              },
              {
                imageUrl: "/image/menu_bjfw.jpeg",
                description: "搬家服务",
                url: "/pages/recommend/oddjob/bjfw/bjfw"
              },
              {
                imageUrl: "/image/menu_sdwx.png",
                description: "水电维修",
                url: "/pages/recommend/oddjob/sdwx/sdwx"
              },
            ]
            vm.setData({
              serverlist: menu
            })
            console.log('serverlist')
            // console.log(this.data.serverlist)
          }
          vm.loadData();
          vm.loadWorkType();
          vm.loadBanner();
          vm.loadInfo();
          vm.getList();
          // 加载热门服务
          vm.getHotServiceList();
          // 轮播图查询
          vm.getRollPicList();
          vm.showModal()
          console.log(res);
        })
        vm.setData({
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude
        })
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        // console.log(res);
      }
    });
  },



  handleClick: function() {
    wx.navigateTo({
      url: '/pages/mine/message/message',
    })
  },

  //跳转h5页面
  externalLinks: function(e) {
    console.log('跳转链接')
    console.log(e)
    var that = this;
    if (!app.data.accountId) {
      wx.navigateTo({
        url: '/pages/empower/empower',
      });
      return false;
    }
    if (app.data.accountId && !app.data.phone) {
      wx.navigateTo({
        url: '/pages/login/login',
      });
      return false;
    }
    var detailUrl = e.currentTarget.dataset.detailurl;
    if (detailUrl.indexOf("http") < 0){
      wx.navigateTo({
        url: detailUrl,
      })
    }else{
      wx.login({
        success: function(res) {
          if (res.code) {
            util.doBaseGet("/weiXin/applet/openId?code=" + res.code, function(res) {
              wx.setStorageSync('openid', res);
              app.data.openid = res;
              console.log("opendi为：" + res);
              //that.paySuccess('123456');
              // that.pay();

              console.log("///////////////////////////");
              console.log(app.data.unionid);
              console.log(app.data.openid);
              var data = {
                unionId: app.data.unionid,
                openId: app.data.openid
              }
              util.doGet("/weiXin/updateCustomerMiniOpenId", data, function(res) {})

              console.log('h5链接：');
              console.log(detailUrl);

              // if (!this.isLogin()) {
              //   this.login();
              //   // return false;
              // }
              // this.getUnionId();
              wx.navigateTo({
                url: 'externalLinks/externalLinks?detailUrl=' + detailUrl + '&openId=' + app.data.openid,
                // url: 'externalLinks/externalLinks?detailUrl=' + detailUrl + '&openId=' + app.data.openid + '&source=' + that.data.soruce,
                // url: 'externalLinks/externalLinks?detailUrl=https://test443.51jrdj.com/home-wechat2.0/cleaningAcarid?productId=52&openId=' + app.data.openid,
              })
            })
          }
        }
      })
  }


  },
  // 点击轮播图
  clickBanner: function(e){
    var that = this;
    var jumpPath = e.currentTarget.dataset.jumppath;
    wx.navigateTo({
      url: jumpPath,
    })
  },

  fourFourHourCleaning: function() {
    util.toFourFourHourCleaning();

    // wx.navigateTo({
    //   //跳转4次*4小时钟点保洁
    //   //url: 'externalLinks/externalLinks?detailUrl=https://test443.51jrdj.com/home-wechat2.0/cleaningAcarid*productId%53&openId=' + app.data.openid,
    //   //跳转2次*4小时钟点保洁
    //   url: 'externalLinks/externalLinks?detailUrl=https://weixin.51jrdj.com/home-wechat2.0/cleaningAcarid*productId%54&openId=' + app.data.openid,
    // })
  },
  //跳转2次全屋除尘除螨
  twoCleaningAcarid: function() {
    util.toTwoCleaningAcarid();
    // wx.navigateTo({
    //   //url: 'externalLinks/externalLinks?detailUrl=https://test443.51jrdj.com/home-wechat2.0/cleaningAcarid*productId%51&openId=' + app.data.openid,
    //   url: 'externalLinks/externalLinks?detailUrl=https://weixin.51jrdj.com/home-wechat2.0/cleaningAcarid*productId%51&openId=' + app.data.openid,
    // })
  },
//跳转宠物洁页面
  petcleaner(){
    util.toPetClean();
    // wx.navigateTo({
    //   url:'/pages/recommend/petclean/petclean'
    // })
  },
  //搜索页面
  toSearchPage: function() {
    wx.navigateTo({
      url: '/pages/recommend/searchPage/searchPage',
    })
  },


  //找保姆
  classifyWorkers: function() {
    // 调用util封装好的跳转到保姆页面的方法
    util.toClassifyWorkers();
    // wx.navigateTo({
    //   url: '/pages/recommend/classifyWorkers/classifyWorkers',
    // })
  },
  //除尘除螨
  mitesRemoval: function() {
    wx.navigateTo({
      url: '/pages/recommend/oddjob/mitesRemoval/mitesRemoval',
    })
  },
  previewImage: function(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },

  // 登陆相关
  //判断是否登录
  isLogin: function() {
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
  // login: function() {
  //   console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
  //   var that = this;
  //   wx.login({
  //     success: function(res) {
  //       if (res.code) {
  //         var data = {
  //           code: res.code
  //         }
  //         util.doGet("/weiXin/unionId", data, function(res) {
  //           if (res) {
  //             wx.setStorageSync('unionid', res);
  //             app.data.unionid = res
  //             util.doBaseGet("/accounts/" + res + "", function(base) {
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
  //             })
  //           } else {
  //             that.handleOpenLogin()
  //           }
  //         })
  //       }
  //     }
  //   })
  // },

  loadInfo: function() {
    var that = this
    if (app.data.loginStatus == 'login') {
      // that.getNowBalance();
      if (app.data.userRole == 'housekeeper') {
        util.doBaseGet("/housekeepers/mine/" + app.data.accountId, function(res) {
          console.log('阿姨信息', res);

          wx.setStorageSync('isNewPeople', res.isNew);
          app.data.isNewPeople = res.isNew;
          
          that.setData({
            account: res.account,
            headPic: res.headPic,
            msgCount: res.msgCount,
            name: res.name,
            nickname: res.nickname,
            numCount: res.numCount,
            auth: res.auth,
            qrCode: res.qrCode,
          })

          // 判断是否是新人
          // if(res.isNew == 1){
          //   var serverlist1 = that.data.serverlist.slice(0, 8)
          //   var serverlist2 = that.data.serverlist.slice(8, 10)
          //   that.setData({
          //     serverlist1: serverlist1,
          //     serverlist2: serverlist2
          //   })
          // }else{
          //   var serverlist1 = that.data.serverlist.slice(1, 9)
          //   var serverlist2 = that.data.serverlist.slice(9, 10)
          //   that.setData({
          //     serverlist1: serverlist1,
          //     serverlist2: serverlist2
          //   })
          // }
        })
      } else if (app.data.userRole == 'employer') {
        util.doBaseGet("/employers/mine/" + app.data.accountId, function(res) {
          console.log('雇主信息', res);

          wx.setStorageSync('isNewPeople', res.isNew);
          app.data.isNewPeople = res.isNew;
          
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

  hourCleaning: function() {
    wx.navigateTo({
      url: '/pages/recommend/oddjob/hourCleaning/hourCleaning',
    })
  },
  // 点击弹窗的授权登录
  // getUnionId: function(e) {
  //   // if (btn) {
  //   //   return;
  //   // }
  //   // var btn = true;
  //   var that = this
  //   // app.data.userInfo = e.detail.userInfo;
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
  //               // btn = false
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  // 旧版
  // loadInfo: function () {
  //   var that = this
  //   if (app.data.loginStatus == 'login') {
  //     if (app.data.userRole == 'housekeeper') {
  //       util.doBaseGet("/housekeepers/mine/" + app.data.accountId, function (res) {
  //         // console.log('阿姨信息', res)
  //         that.setData({
  //           msgCount: res.msgCount
  //         })
  //       })
  //     } else if (app.data.userRole == 'employer') {
  //       util.doBaseGet("/employers/mine/" + app.data.accountId, function (res) {
  //         //console.log('雇主信息', res)
  //         that.setData({
  //           msgCount: res.msgCount,
  //         })
  //       })
  //     }
  //   }
  // },

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
      showModalStatus: false //显示遮罩层
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1)
  },
  // 隐藏遮罩层  
  hideModal: function() {
    var that = this;
    that.getIsCoupons();

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

    if (app.data.loginStatus == 'login') {
      wx.navigateTo({
        url: '/pages/mine/myCoupon/myCoupon',
      })
    } else if (app.data.accountId) {
      wx.setStorageSync('loginStatus', 'login');
      app.data.loginStatus = 'login';
      wx.navigateTo({
        url: '/pages/mine/myCoupon/myCoupon',
      })
    } else {
      wx.navigateTo({
        url: '/pages/empower/empower',
      })

    }

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
    wx.navigateTo({
      url: '/pages/empower/empower',
    })
  }
})