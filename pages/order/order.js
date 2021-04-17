// 订单
const app = getApp();
var util = require('../../utils/util.js')
// var btn = false
var isRefreshing = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyId: '',
    swichNavlist:[
      {name:'全  部',num:0},
      {name:'待付款',num:0},
      {name:'进行中',num:0},
      {name:'待评价',num:0},
      {name:'已完成',num:0}
    ],
    isShowCompany: false,
    //dataList:[],
    // offset: 0,
    // limit: 10,
    currentPage: 0,
    limit: 5,
    //scroll-y是否滚动
    scroll: false,
    //更多评论模态框
    visible: false,
    //阿姨列表
    housekeepersData: [],
    housekeeperId: '',
    housekeeperName: '',
    //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
    isShow: false,
    loadType: true,
    loadMsg: '正在加载中...',
    //登录
    visibleLogin: false,
    confirm1: 0,
    // tab切换
    currentTab: 0,
    // 获取手机高度
    windowWidth: '',
    windowHeight: '',
    noDataList0: 1, // 根据这个是否在页面展示没有更多数据啦,0 展示，1 不展示
    noDataList1: 1,
    noDataList2: 1,
    noDataList3: 1,
    noDataList4: 1,
    m: 0,
    // signStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;


    that.setData({
      scrollStatus0: true,
      scrollStatus1: false,
      scrollStatus2: false,
      scrollStatus3: false,
      scrollStatus4: false,
      // offset: 0,
      // limit: 10,
      currentPage: 0,
      limit: 5,
      //scroll-y是否滚动
      scroll: false,
      //更多评论模态框
      visible: false,
      //阿姨列表
      housekeepersData: [],
      housekeeperId: '',
      housekeeperName: '',
      //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
      isShow: false,
      loadType: true,
      loadMsg: '正在加载中...',
      //登录
      visibleLogin: false,
      confirm1: 0,
      // tab切换
      currentTab: 0,
      // 获取手机高度
      windowWidth: '',
      windowHeight: '',
      noDataList0: 1, // 根据这个是否在页面展示没有更多数据啦,0 展示，1 不展示
      noDataList1: 1,
      noDataList2: 1,
      noDataList3: 1,
      noDataList4: 1,
      m: 0,
    })

    // 获取手机高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if(wx.getStorageSync('selectCompany')) {
      this.setData({
        isShowCompany: false
      })
    }
    this.setData({
      companyId: wx.getStorageSync('selectCompany').id
    })
    this.getOrderListnum('')
    // this.getOrderListnum('0')
    // this.getOrderListnum('14,15')
    // this.getOrderListnum('16')
    // this.getOrderListnum('5')
    // console.log('签名状态：')
    // console.log(that.data.signStatus)
    // console.log(that.data.signFilePath)
    // 是否签名的状态，签名之后，继续走确认完成的操作
    if (that.data.signStatus) {
      that.continueConfirmComplete(that.data.signFilePath);
      that.data.signStatus = false;
    }
    // btn = false

    if(app.data.phone){
      this.setData({
        confirm1: 0,
        noDataList0: 1, // 根据这个是否在页面展示没有更多数据啦,0 展示，1 不展示
        noDataList1: 1,
        noDataList2: 1,
        noDataList3: 1,
        noDataList4: 1,
        noLogin: false,// noLogin：true，没有登录，false，登录
      })
      console.log(app.currentTab + "*****************");
      var currentTab = app.globalData.currentTab;
      console.log("index 的 Onshow：");
      wx.showLoading({
        title: '加载中...',
      })
      if (!currentTab) {
        console.log('没有stage，查询已经选中的currentTab对应的订单');
        that.setData({
          currentPage: 0,
        })
        that.packageGetOrderListByStatus(that.data.currentTab);
      } else {
        that.setData({
          currentTab: app.globalData.currentTab,
          currentPage: 0,
        })
        that.packageGetOrderListByStatus(that.data.currentTab);
      }
    }else{
      that.setData({
        noLogin: true,
      })
      return;
    }
    console.log('所有订单')
    console.log(this.data.dataList)
  },
  getOrderListnum: function(stage) {
    var that = this,swichNavlist=this.data.swichNavlist;
    var data = {
      platform: 'miniapp',
      accountId: app.data.accountId,
      role: app.data.userRole,
      // businessTypeId: '4,5,6,7,8,9,10,11,12',
      businessTypeId: '6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',

      // stageArr: stage,
      // offset: 0,
      // limit: 999,
    }
    // util.doGet("/business/orders/queryListForApp", data, function(res) {
    //   console.log('查询111' + stage + '订单为：');
    //   console.log(res);
    //   if (res.success|| res.data.length !== 0) {
    //     // if (stage == '') swichNavlist[0].num=res.data.length
    //     // if (stage == '0') swichNavlist[1].num=res.data.length
    //     // if (stage == '14,15') swichNavlist[2].num=res.data.length
    //     // if (stage == '16') swichNavlist[3].num=res.data.length
    //     // if (stage == '5') swichNavlist[4].num=res.data.length
    //     // swichNavlist[0].num=res.data.length
    //     swichNavlist[1].num=res.data.waitPayOrderList.length
    //     swichNavlist[2].num=res.data.ongoingOrderList.length
    //     swichNavlist[3].num=res.data.toBeEvaluatedOrderList.length
    //     swichNavlist[4].num=res.data.completedOrderList.length
    //     that.setData({
    //       swichNavlist
    //     })
    //   }
    // })
  },
  // 去登录
  goLogin: function(){
    var that = this;
    if (app.data.accountId && !app.data.phone) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.navigateTo({
        url: '/pages/empower/empower',
      })
    }
  },
  toCall: function() {
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('selectCompany').tel
    })
    // wx.navigateTo({
    //   url: 'chat/chat',
    // })
  },

  //查询订单列表
  loadData: function(e) {
    var that = this;
    that.setData({
      scrollTop: 0,
      offset: 0,
      limit: that.data.limit,
      //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
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
      offset: 0,
      limit: that.data.currentPage * that.data.limit + that.data.limit,
      companyType: 0
    }
    util.doGet("/business/orders/queryList", data, function(res) {
      wx.hideToast();
      wx.hideLoading();
      if (that.data.confirm1 == 1) {
        wx.showToast({
          title: '确认完成成功',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
      console.log('查询全部订单onload为：');
      console.log(res)
      if (res.success == false || res.data.length == 0) {
        that.setData({
          isShow: false,
          dataList: []
        });
      } else {
        that.setData({
          isShow: false,
          dataList: res.data,
        });
      }
    })
  },

  // 点击确认完成按钮
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
          console.log("orderDetailId为：")
          console.log(orderDetailId)
          that.setData({
            orderDetailId: orderDetailId,
          })

          // 确定完好，跳转签字界面
          wx.navigateTo({
            url: '/pages/order/sign/sign',
          })

          // var tab = 2
          // // 家务，家维的确认完成，都走这一个接口，都传小订单的id
          // var data = {

          // }
          // util.doGet("/housekeepers/" + orderDetailId + "/orderconfirm", data, function(res1) {
          //   console.log("订单页点击确认完成，返回：")
          //   console.log(res1)
          //   wx.showLoading({
          //     title: '确认完成中...',
          //   })
          //   if (res1.success) {
          //     that.setData({
          //       confirm1: 1,
          //     })
          //     that.loadData();

          //   } else {
          //     wx.showLoading({
          //       title: '确认完成失败',
          //       icon: 'none',
          //       duration: 1500
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
    console.log(111);
    var data = {

    }
    // util.doGet("/housekeepers/" + that.data.orderDetailId + "/orderconfirm", data, function(res1) {
    util.doPostImgData("/housekeepers/" + that.data.orderDetailId + "/orderconfirm", signFilePath, data, function (res1) {

      console.log("订单页点击确认完成，返回：");
      console.log(res1)
      wx.showLoading({
        title: '确认完成中...',
      })
      var jsonRes1 = JSON.parse(res1);
      console.log(jsonRes1);
      if (jsonRes1.success) {
        that.setData({
          confirm1: 1,
        })
        that.loadData();
      } else {
        wx.showLoading({
          title: '确认完成失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //******************************************** */

  //待评价
  evaluate: function(e) {
    var that = this;
    var serveIndex = e.currentTarget.dataset.serveindex;
    var orderId = e.currentTarget.dataset.orderid;
    var orderDetailId = e.currentTarget.dataset.orderdetailid;
    var businessTypeId = e.currentTarget.dataset.businesstypeid;
    // var hourlyWorkersServe = JSON.stringify(e.currentTarget.dataset.hourserve)
    console.log("角标，大小订单id为：")
    console.log(serveIndex)
    console.log(orderId)
    console.log(orderDetailId)
    console.log("businessTypeId为：")
    console.log(businessTypeId)
    var tab = 2
    // 家务情况 
    if (businessTypeId == 6) {
      wx.navigateTo({
        url: 'evaluate/evaluate?orderId=' + orderId + "&orderDetailId=" + orderDetailId + "&serveIndex=" + serveIndex,
      })
    }
    // 家维情况
    if (businessTypeId != 6) {
      wx.navigateTo({
        url: 'evaluate/evaluate?orderId=' + orderId + "&orderDetailId=" + orderDetailId,
      })
    }
  },

  /** 
   * 点击tab切换 
   */
  swichNav: function(e) {
    var that = this;
    var currentTab = e.target.dataset.current;
    app.globalData.currentTab = currentTab;
    that.setData({
      currentTab: e.target.dataset.current
    });
  },

  // 滑动切换
  bindChange: function(e) {
    var that = this;

    var currentTab = e.detail.current;
    app.globalData.currentTab = currentTab;

    // that.onLoad();
    if (currentTab == 0) {

      that.setData({
        // offset: 0,
        // limit: 10,
        currentPage: 0,
        limit: 5,
        //scroll-y是否滚动
        scrollStatus0: true,
        scrollStatus1: false,
        scrollStatus2: false,
        scrollStatus3: false,
        scrollStatus4: false,
        scroll: false,
        //更多评论模态框
        visible: false,
        //阿姨列表
        housekeepersData: [],
        housekeeperId: '',
        housekeeperName: '',
        //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
        isShow: false,
        loadType: true,
        loadMsg: '正在加载中...',
        //登录
        visibleLogin: false,
        confirm1: 0,
        // tab切换
        currentTab: currentTab,
        // 获取手机高度
        windowWidth: '',
        windowHeight: '',
        noDataList0: 1, // 根据这个是否在页面展示没有更多数据啦,0 展示，1 不展示
        noDataList1: 1,
        noDataList2: 1,
        noDataList3: 1,
        noDataList4: 1,
        m: 0,
      })
    }

    if (currentTab == 1) {
      that.setData({
        // offset: 0,
        // limit: 10,
        currentPage: 0,
        limit: 5,
        //scroll-y是否滚动
        scrollStatus0: false,
        scrollStatus1: true,
        scrollStatus2: false,
        scrollStatus3: false,
        scrollStatus4: false,
        scroll: false,
        //更多评论模态框
        visible: false,
        //阿姨列表
        housekeepersData: [],
        housekeeperId: '',
        housekeeperName: '',
        //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
        isShow: false,
        loadType: true,
        loadMsg: '正在加载中...',
        //登录
        visibleLogin: false,
        confirm1: 0,
        // tab切换
        currentTab: currentTab,
        // 获取手机高度
        windowWidth: '',
        windowHeight: '',
        noDataList0: 1, // 根据这个是否在页面展示没有更多数据啦,0 展示，1 不展示
        noDataList1: 1,
        noDataList2: 1,
        noDataList3: 1,
        noDataList4: 1,
        m: 0,
      })
    }
    if (currentTab == 2) {
      that.setData({
        // offset: 0,
        // limit: 10,
        currentPage: 0,
        limit: 5,
        //scroll-y是否滚动
        scrollStatus0: false,
        scrollStatus1: false,
        scrollStatus2: true,
        scrollStatus3: false,
        scrollStatus4: false,
        scroll: false,
        //更多评论模态框
        visible: false,
        //阿姨列表
        housekeepersData: [],
        housekeeperId: '',
        housekeeperName: '',
        //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
        isShow: false,
        loadType: true,
        loadMsg: '正在加载中...',
        //登录
        visibleLogin: false,
        confirm1: 0,
        // tab切换
        currentTab: currentTab,
        // 获取手机高度
        windowWidth: '',
        windowHeight: '',
        noDataList0: 1, // 根据这个是否在页面展示没有更多数据啦,0 展示，1 不展示
        noDataList1: 1,
        noDataList2: 1,
        noDataList3: 1,
        noDataList4: 1,
        m: 0,
      })
    }
    if (currentTab == 3) {
      that.setData({
        // offset: 0,
        // limit: 10,
        currentPage: 0,
        limit: 5,
        //scroll-y是否滚动
        scrollStatus0: false,
        scrollStatus1: false,
        scrollStatus2: false,
        scrollStatus3: true,
        scrollStatus4: false,
        scroll: false,
        //更多评论模态框
        visible: false,
        //阿姨列表
        housekeepersData: [],
        housekeeperId: '',
        housekeeperName: '',
        //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
        isShow: false,
        loadType: true,
        loadMsg: '正在加载中...',
        //登录
        visibleLogin: false,
        confirm1: 0,
        // tab切换
        currentTab: currentTab,
        // 获取手机高度
        windowWidth: '',
        windowHeight: '',
        noDataList0: 1, // 根据这个是否在页面展示没有更多数据啦,0 展示，1 不展示
        noDataList1: 1,
        noDataList2: 1,
        noDataList3: 1,
        noDataList4: 1,
        m: 0,
      })
    }
    if (currentTab == 4) {
      that.setData({
        // offset: 0,
        // limit: 10,
        currentPage: 0,
        limit: 5,
        //scroll-y是否滚动
        scrollStatus0: false,
        scrollStatus1: false,
        scrollStatus2: false,
        scrollStatus3: false,
        scrollStatus4: true,
        scroll: false,
        //更多评论模态框
        visible: false,
        //阿姨列表
        housekeepersData: [],
        housekeeperId: '',
        housekeeperName: '',
        //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
        isShow: false,
        loadType: true,
        loadMsg: '正在加载中...',
        //登录
        visibleLogin: false,
        confirm1: 0,
        // tab切换
        currentTab: currentTab,
        // 获取手机高度
        windowWidth: '',
        windowHeight: '',
        noDataList0: 1, // 根据这个是否在页面展示没有更多数据啦,0 展示，1 不展示
        noDataList1: 1,
        noDataList2: 1,
        noDataList3: 1,
        noDataList4: 1,
        m: 0,
      })
    }

    // 获取手机高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
        })
      }
    })

    that.onShow();

    // console.log('滑动切换：');
    // console.log(currentTab);
    // that.setData({
    //   currentTab: e.detail.current,
    //   currentPage: 0,
    //   noDataList0: 1, // 根据这个是否在页面展示没有更多数据啦,0 展示，1 不展示
    //   noDataList1: 1,
    //   noDataList2: 1,
    //   noDataList3: 1,
    //   noDataList4: 1,
    // })
    // that.packageGetOrderListByStatus(that.data.currentTab);
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
    // that.setData({
    //   scrollTop: 0,
    //   offset: 0,
    //   limit: that.data.limit,
    //   isShow: true,
    //   loadType: true,
    //   // loadMsg: '正在加载中...',
    //   role: app.data.userRole
    // });

    var accountId = app.data.accountId;
    var role = app.data.userRole;
    // if (that.data.currentTab == 1 || that.data.currentTab == 2 || that.data.currentTab == 3) {
    //   var data = {
    //     platform: 'miniapp',
    //     accountId: accountId,
    //     role: role,
    //     businessTypeId: '6,7,8,9,10,11,12',
    //     stageArr: stage,
    //     offset: 0,
    //     limit: 999,
    //   }
    // }
    // if (that.data.currentTab == 0 || that.data.currentTab == 4) {
    var data = {
      platform: 'miniapp',
      accountId: accountId,
      role: role,
      businessTypeId: '6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
      stageArr: stage,
      offset: 0,
      limit: that.data.limit,
      companyType: 0
    }
    // }
    console.log("打印订单的传参：");
    console.log(data);
    util.doGet("/business/orders/queryList", data, function(res) {

      wx.hideLoading();

      console.log('查询' + stage + '订单为：');
      console.log(res)
      console.log(res.data);
      if (res.success == false || res.data.length == 0) {
        that.setData({
          // isShow: false,
          dataList: []
        });
      } else {
        that.setData({
          // isShow: false,
          dataList: res.data,
        });
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  lower: function(e) {
    var that = this;

    console.log("全部列表是否能滚动：" + that.data.scrollStatus0);

    console.log("下拉调用入口方法为：" + e.currentTarget.dataset.method);

    console.log("是否能再次刷新：" + isRefreshing);
    //正在刷新,只能刷一次
    if (isRefreshing) {
      return;
    }

    isRefreshing = true;

    console.log('*************');
    var currentPage = that.data.currentPage;
    currentPage++;
    console.log("当前页为第" + currentPage + "页")
    // that.setData({
    //   currentPage: currentPage
    // })
    that.getNewData(currentPage);
    // }
  },
  // lowerComplete: function() {
  //   var that = this;
  //   console.log('已完成触底了');
  //   var currentPage = that.data.currentPage;
  //   currentPage++;
  //   console.log("当前页为第" + currentPage + "页")
  //   that.setData({
  //     currentPage: currentPage
  //   })
  //   that.getNewData();
  // },

  // 分页操作
  getNewData: function(currentPage) {
    var that = this;
    if (that.data.noDataList0 != 0 && that.data.noDataList1 != 0 && that.data.noDataList2 != 0 && that.data.noDataList3 != 0 && that.data.noDataList4 != 0) {
      wx.showLoading({
        title: '加载中...'
      })
      var data = {
        platform: 'miniapp',
        accountId: app.data.accountId,
        role: app.data.userRole,
        businessTypeId: '6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
        stageArr: that.data.stage,
        offset: currentPage * that.data.limit,
        limit: that.data.limit,
        companyType: 0
      }
      console.log("查询订单的传参：");
      console.log(data);
      util.doGet("/business/orders/queryList", data, function(res) {
        wx.hideLoading();
        // if (that.data.confirm1 == 1) {
        //   wx.showToast({
        //     title: '确认完成成功',
        //     icon: 'none',
        //     duration: 1500
        //   })
        // }
        console.log('查询' + that.data.stage + '新的订单为：');
        console.log(res);
        // for (var i in res.data) {
        //   console.log(res.data[i].activityId);
        // }
        var dataList = res.data;
        if (dataList.length == 0) {
          wx.showToast({
            title: '没有更多数据啦...',
            icon: 'none',
            duration: 1500
          })
          if (that.data.currentTab == 0) {
            that.setData({
              noDataList0: 0,
              isShow: false,
            })
          }
          if (that.data.currentTab == 1) {
            that.setData({
              noDataList1: 0,
              isShow: false,
            })
          }
          if (that.data.currentTab == 2) {
            that.setData({
              noDataList2: 0,
              isShow: false,
            })
          }
          if (that.data.currentTab == 3) {
            that.setData({
              noDataList3: 0,
              isShow: false,
            })
          }
          if (that.data.currentTab == 4) {
            that.setData({
              noDataList4: 0,
              isShow: false,
            })
          }

          isRefreshing = false;
          return;

        } else {
          console.log("旧数据：");
          console.log(that.data.dataList);
          console.log("新数据：");
          console.log(dataList);
          // 将新一页的数据添加到原数据后面
          dataList = that.data.dataList.concat(dataList);
          that.setData({
            // isShow: false,
            dataList: dataList,
          })
        }

        //设置当前页码
        that.setData({
          currentPage: currentPage
        })

        //可以继续请求
        isRefreshing = false;
      })
    } else {
      console.log('没有新数据了...')
      isRefreshing = false;
    }
  },

  //拨打电话
  toMakePhone: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone + ''
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function() {
  //   // var that = this;
  //   // var data = {
  //   //   memberId: app.data.accountId,
  //   //   // accountType：账户类型：1.工人钱包，2.顾客钱包
  //   //   accountType: 1,
  //   //   offset: 0,
  //   //   limit: that.data.limit,
  //   // }
  //   // // 调用提现列表
  //   // wx.showLoading({
  //   //     title: '加载中',
  //   //     icon: 'loading'
  //   //   }),
  //   //   util.doGet("/withdrawalRecord/queryList", data, function(res) {
  //   //     wx.hideLoading();
  //   //     wx.stopPullDownRefresh();
  //   //     console.log('提现列表下拉刷新：')
  //   //     console.log(res)
  //   //     var getCashList = [];
  //   //     if (res.success) {
  //   //       that.setData({
  //   //         getCashList: res.data,
  //   //       })
  //   //     }
  //   //   })
  // },

  //判断是否登录
  isLogin: function() {
    // console.log(app.data.loginStatus)
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
  handleCloseLogin({
    detail
  }) {
    this.setData({
      visibleLogin: false
    });
  },
  //登录
  getUnionId: function(e) {
    // if (btn) {
    //   return;
    // }
    // btn = true;
    var that = this
    app.data.userInfo = e.detail.userInfo;
    wx.login({
      success: function(res) {
        if (res.code) {
          var data = {
            encryptedData: e.detail.encryptedData,
            code: res.code,
            iv: e.detail.iv
          }
          util.doGet("/weiXin/userInfo", data, function(res) {
             console.log(1, res)
            if (res) {
              console.log("res.avatarUrl=" + res.avatarUrl);

              wx.setStorageSync('avatarUrl', res.avatarUrl);
              wx.setStorageSync('nickName', res.nickName);
              wx.setStorageSync('openid', res.openId);
              wx.setStorageSync('unionid', res.unionId);
              app.data.avatarUrl = res.avatarUrl;
              app.data.nickName = res.nickName;
              app.data.openid = res.openId;
              app.data.unionid = res.unionId;
              //判断是否注册
              util.doBaseGet("/accounts/" + res.unionId + "", function(base) {
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
                  util.mask('加载中...')
                  that.loadData();
                } else {
                  wx.navigateTo({
                    url: '/pages/login/login',
                  })
                }
                // btn = false;
              })
            }
          })
        }
      }
    })
  },

  toHome: function() {
    wx.switchTab({
      url: '/pages/recommend/recommend',
    })
  },

  toPay: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var productName = e.currentTarget.dataset.productname;
    var index = e.currentTarget.dataset.index;
    console.log("商品名为：" + productName)
    // if (e.currentTarget.dataset.money > 0) {
    var openid = app.data.openid;
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
              // that.beforePay(e.currentTarget.dataset.money, id, index);
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
        if(!res.success){
          wx.showToast({
            title: res.reason,
            icon: 'none'
          })
          return;
        }
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
      // 有openid的情况
      // that.beforePay(e.currentTarget.dataset.money, id, index);
    }
    // } else {
    //   that.agree("", id, index);
    // }

    // 注释：之前的支付
    // var id = e.currentTarget.dataset.id;
    // var index = e.currentTarget.dataset.index;
    // if (e.currentTarget.dataset.money > 0) {
    //   var openid = app.data.openid;
    //   if (!openid) {
    //     wx.login({
    //       success: function (res) {
    //         if (res.code) {
    //           util.doBaseGet("/weiXin/applet/openId?code=" + res.code, function (res) {
    //             app.data.openid = res;
    //             that.beforePay(e.currentTarget.dataset.money, id, index);
    //           })
    //         }
    //       }
    //     })
    //   } else {
    //     that.beforePay(e.currentTarget.dataset.money, id, index);
    //   }
    // } else {
    //   that.agree("", id, index);
    // }

    // that.agree("2222");
    // 获取openid

  },

  //调取预支付
  // beforePay: function(money, id, index) {
  //   var that = this;
  //   var body = "今日到家-阿姨确认预约"
  //   var totalFee = money * 100;
  //   totalFee = totalFee.toFixed(0);
  //   var data = {
  //     openId: app.data.openid,
  //     body: body,
  //     totalFee: totalFee
  //   };
  //   // console.log(data);
  //   wx.request({
  //     url: util.baseUrl + '/weiXin/applet/payment',
  //     data: data,
  //     method: 'POST',
  //     header: {
  //       "secretKey": "PcnMh+UXAmk/iNlqFFahKu",
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     success: function(res) {
  //       if (res.statusCode == 500) {
  //         wx.showToast({
  //           title: '网络连接异常',
  //           icon: 'none',
  //           duration: 2000
  //         })
  //       } else {
  //         var data = res.data;
  //         wx.requestPayment({
  //           'timeStamp': data.timeStamp,
  //           'nonceStr': data.nonceStr,
  //           'package': data.package,
  //           'signType': data.signType,
  //           'paySign': data.paySign,
  //           'success': function(res) {
  //             if (res.errMsg == 'requestPayment:ok') {
  //               that.agree(data.dealId, id, index);
  //             } else {

  //             }
  //           },
  //           'fail': function(res) {
  //             console.log(res)
  //           }
  //         })
  //       }
  //     },
  //     fail: function() {
  //       wx.showToast({
  //         title: '网络连接异常',
  //         icon: 'none',
  //         duration: 2000
  //       })
  //     },
  //   })
  // },

  //家维订单详情
  toOddJobDetail: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var tab = 1
    wx.navigateTo({
      url: '/pages/order/oddJobDetail/oddJobDetail?id=' + id + '&tab=' + tab + '&currentTab=' + that.data.currentTab,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      visibleLogin: false,
      visible: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },



  // 注释：旧版
  //预约阿姨
  // housekeepersServes: function() {
  //   var that = this;
  //   util.doBaseGet("/employers/appoints/housekeepers/" + app.data.accountId + "", function(res) {
  //     if (res != '' && res != null) {
  //       that.setData({
  //         housekeeperId: res[0].id,
  //         housekeeperName: res[0].name,
  //         housekeepersData: res
  //       })
  //     } else {
  //       that.setData({
  //         housekeepersData: []
  //       })
  //     }
  //   })
  // },


  //同意预约
  // agree: function(dealId, id, index) {
  //   var that = this

  //   var data = {
  //     status: 43 //状态，1等待确认，2阿姨拒绝，3阿姨同意
  //   }
  //   util.doPost("/employers/appoint/" + id + "/" + 43 + "/" + app.data.accountId, dealId, function(res) {
  //     if (res || res == 'true') {
  //       var list = that.data.dataList;
  //       list[index].appointsOrders.status = 43
  //       // console.log(list)
  //       that.setData({
  //         dataList: list
  //       })
  //     }

  //   })
  // },

  //拒绝预约
  // reject: function(e) {
  //   var that = this
  //   var data = {
  //     status: 42 //1：雇主支付 2：家政员拒绝 3：家政员接受4：家政员申请取消 5：雇主申请取消 6 预约成功 7雇主违约 8家政员违约
  //   }
  //   util.doPost("/employers/appoint/" + e.currentTarget.dataset.id + "/" + 42 + "/" + app.data.accountId, "", function(res) {
  //     if (res || res == 'true') {
  //       var list = that.data.dataList;
  //       list[e.currentTarget.dataset.index].appointsOrders.status = 42
  //       that.setData({
  //         dataList: list
  //       })
  //     }
  //   })
  // },
  //雇主取消订单
  // cancell: function(e) {
  //   var that = this;
  //   var id = e.currentTarget.dataset.id;
  //   var index = e.currentTarget.dataset.index;
  //   var data = {};
  //   util.doPost("/employers/" + app.data.accountId + "/appoint/" + id, data, function(res) {
  //     // console.log('aa',res);
  //     if (res || res == 'true') {
  //       wx.showToast({
  //         title: '订单取消成功，诚信金将在24小时内退回原账户',
  //         icon: 'none',
  //         duration: 3000
  //       })
  //       var dataList = that.data.dataList;
  //       if (app.data.userRole == 'employer') {
  //         dataList[index].appointsOrders.status = '411';
  //       }
  //       that.setData({
  //         dataList: dataList
  //       })
  //     }
  //   })
  // },

  //申请取消
  // applyCancell: function(e) {
  //   var that = this;
  //   var id = e.currentTarget.dataset.id;
  //   var employerId = e.currentTarget.dataset.employer;
  //   var housekeeperId = e.currentTarget.dataset.housekeeper;
  //   var index = e.currentTarget.dataset.index;
  //   var appointAccount = '';
  //   var appointAccountRole = '';
  //   if (app.data.userRole == 'employer') {
  //     appointAccount = housekeeperId;
  //     appointAccountRole = 'housekeeper';
  //   }
  //   if (app.data.userRole == 'housekeeper') {
  //     appointAccount = employerId;
  //     appointAccountRole = 'employer';
  //   }
  //   var data = {
  //     appointId: id,
  //     applyAccount: app.data.accountId,
  //     applyAccountRole: app.data.userRole,
  //     appointAccount: appointAccount,
  //     appointAccountRole: appointAccountRole
  //   }
  //   util.doPut("/applyCancelAppoint", data, function(res) {
  //     // console.log('结果', res);
  //     //空处理失败，false 有代办订单，true申请成功
  //     if (res) {
  //       var dataList = that.data.dataList;
  //       if (app.data.userRole == 'employer') {
  //         dataList[index].appointsOrders.status = '45';
  //       }
  //       if (app.data.userRole == 'housekeeper') {
  //         dataList[index].appointsOrders.status = '44';
  //       }
  //       that.setData({
  //         dataList: dataList
  //       })
  //       wx.showToast({
  //         title: '申请取消成功，请耐心等待对方同意',
  //         icon: 'none',
  //         duration: 2000
  //       })
  //     } else if (res == null) {
  //       wx.showToast({
  //         title: '申请失败',
  //         icon: 'none',
  //         duration: 2000
  //       })
  //     } else {
  //       var title = '您已购买签约保障服务，暂时不能取消';
  //       if (app.data.userRole == 'housekeeper') {
  //         title = '雇主已购买签约保障服务，暂时不能取消';
  //       }

  //       wx.showToast({
  //         title: title,
  //         icon: 'none',
  //         duration: 2000
  //       })
  //     }
  //   })
  // },
  //同意取消
  // agreeCancell: function(e) {
  //   var that = this;
  //   var id = e.currentTarget.dataset.id;
  //   var index = e.currentTarget.dataset.index;
  //   var data = {
  //     appointId: id,
  //     disposeStatus: 'accept'
  //   };
  //   util.doPost("/applyCancelAppoint", data, function(res) {
  //     // console.log('同意取消', res);
  //     if (res) {
  //       wx.showToast({
  //         title: '您已同意取消预约',
  //         icon: 'none',
  //         duration: 2000
  //       })
  //       var dataList = that.data.dataList;
  //       dataList[index].appointsOrders.status = '49';
  //       that.setData({
  //         dataList: dataList
  //       })
  //     } else {
  //       wx.showToast({
  //         title: '取消失败',
  //         icon: 'none',
  //         duration: 2000
  //       })
  //     }
  //   })
  // },
  //拒绝取消
  // refusCancell: function(e) {
  //   var that = this;
  //   var id = e.currentTarget.dataset.id;
  //   var index = e.currentTarget.dataset.index;
  //   var data = {
  //     appointId: id,
  //     disposeStatus: 'refuse'
  //   };
  //   util.doPost("/applyCancelAppoint", data, function(res) {
  //     // console.log('拒绝取消', res);
  //     if (res) {
  //       wx.showToast({
  //         title: '您已拒绝取消预约',
  //         icon: 'none',
  //         duration: 2000
  //       })
  //       var dataList = that.data.dataList;
  //       dataList[index].appointsOrders.status = '410';
  //       that.setData({
  //         dataList: dataList
  //       })
  //     } else {
  //       wx.showToast({
  //         title: '拒绝失败',
  //         icon: 'none',
  //         duration: 2000
  //       })
  //     }
  //   })
  // },

  // toDetail: function(e) {
  //   wx.navigateTo({
  //     url: '/pages/mine/booking/detail/detail?id=' + e.currentTarget.dataset.id,
  //   })
  // },

  // toCommission: function() {
  //   wx.navigateTo({
  //     url: '/pages/recommend/commission/commission',
  //   })
  // },

  // 注释：旧版
  // toList: function() {
  //   wx.navigateTo({
  //     url: '/pages/recommend/housekeeperList/housekeeperList?workTypeId=06d07833-7c49-40c7-a726-5e121db9f19d'
  //   })
  // },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // },
  //触摸事件
  // touchendStart: function (event) {
  //   var that = this;
  //   that.setData({
  //     start: event.touches[0].pageY
  //   });
  // },
  //触摸释放事件
  // touchendEnd: function (event) {
  //   var that = this;
  //   var height = that.data.height;
  //   that.setData({
  //     height: 0,
  //     showFl: false,
  //   });
  //   if (height>30){
  //     this.loadData();
  //   }
  // },
  //触摸移动
  // touchMove: function (event) {
  //   var that = this;
  //   if(that.data.scrollTop==0){
  //     let pageY = event.touches[0].pageY;
  //     var height = pageY - that.data.start;
  //     if (height>0 &&height<50){
  //       that.setData({
  //         height: height,
  //       });
  //       if (height>10){
  //         that.setData({
  //           showFl:true,
  //         });
  //       }
  //     }
  //   }
  // },

  //阿姨详情
  // toHousekeeperDetail: function(e) {
  //   var that = this;
  //   wx.navigateTo({
  //     url: '/pages/recommend/housekeeperDetail/housekeeperDetail?showBtn=false&housekeeperId=' + e.currentTarget.dataset.id,
  //   })
  // },

  /**
   * 查看详情
   */
  // toOrderDetail: function(e) {
  //   var that = this;
  //   var id = e.currentTarget.dataset.id;
  //   console.log(e)
  //   wx.navigateTo({
  //     url: '/pages/order/orderDetail/orderDetail?id=' + id,
  //   })
  // },
  /**
   * 到评价界面
   */
  // toOrderEvaluation: function(e) {
  //   var that = this;
  //   var id = e.currentTarget.dataset.id;
  //   wx.navigateTo({
  //     url: '/pages/order/evaluation/evaluation?commissionId=' + id,
  //   })
  // },

  // toshowEval: function(e) {
  //   wx.navigateTo({
  //     url: '/pages/order/showEval/showEval?id=' + e.currentTarget.dataset.id,
  //   })
  // },


  //更多阿姨模态框-打开
  // handleOpen(e) {
  //   this.housekeepersServes();
  //   var that = this;
  //   var index = e.currentTarget.dataset.index;
  //   var id = e.currentTarget.dataset.id;
  //   this.setData({
  //     index: index,
  //     id: id,
  //     visible: true
  //   });
  // },
  //更多阿姨模态框-关闭
  // handleCancel() {
  //   this.setData({
  //     visible: false
  //   });
  // },
  /**
   * 选择阿姨
   */
  // myChange(e) {
  //   var that = this;
  //   wx.showModal({
  //     title: '温馨提示',
  //     content: '您是否确认选择该阿姨，确定后将不能更换！',
  //     success(res) {
  //       if (res.confirm) {
  //         that.setData({
  //           visible: false
  //         });

  //         var index = e.currentTarget.dataset.index;
  //         that.setData({
  //           housekeeperId: that.data.housekeepersData[index].id,
  //           housekeeperName: that.data.housekeepersData[index].name,
  //           // selectTab: index
  //         });
  //         var data = {
  //           id: that.data.id,
  //           housekeeperId: that.data.housekeeperId
  //         }
  //         util.doPost("/signSafeguard/commission", data, function(res) {
  //           console.log(res)
  //           that.data.dataList[that.data.index].commissionOrders.housekeeperName = that.data.housekeeperName;
  //           that.data.dataList[that.data.index].commissionOrders.status = 53;
  //           if (res) {
  //             that.setData({
  //               dataList: that.data.dataList
  //             });
  //           }
  //         })
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // },

  //加载更多
  // loadMore: function () {
  //   var that = this;
  //   that.setData({
  //     //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
  //     isShow: true,
  //     loadType: true,
  //     loadMsg: '正在加载中...',
  //   });
  //   var accountId = app.data.accountId;
  //   var role = app.data.userRole;
  //   if (accountId != '' && role != '') {
  //     var data = {
  //       accountId: accountId,
  //       role: role,
  //       status: that.data.status
  //     }
  //     util.doGet("/commissionOrder/" + that.data.offset + "/" + that.data.limit, data, function (res) {
  //       // console.log('sss', res.length);
  //       if (res.length == 0 || res.length == undefined) {

  //         that.setData({
  //           //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
  //           offset: that.data.offset -= 10,
  //           isShow: true,
  //           loadType: false,
  //           loadMsg: '已没有更多数据',
  //         });
  //       } else {
  //         for(var i=0;i<res.length;i++){
  //           that.data.dataList.push(res[i]);
  //         }
  //         that.setData({
  //           //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
  //           isShow: false,
  //           dataList: that.data.dataList,
  //           scroll: true,
  //         });
  //       }
  //     })
  //   }
  // },

  // //滑动到底部加载数据
  // bindDownLoad: function () {
  //   this.setData({
  //     offset: this.data.offset += 10
  //   })
  //   this.loadMore();
  // },
  // //下拉刷新
  // bindScroll: function (event) {
  //   var that = this;
  //   that.setData({
  //     scrollTop: event.detail.scrollTop
  //   });
  // },
})