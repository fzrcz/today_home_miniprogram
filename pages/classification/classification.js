// pages/classification/classification.js
var app = getApp();
var util = require('../../utils/util.js')
let WxNotificationCenter = require('../../utils/WxNotificationCenter')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowCompany: false,
    serverlist: [{
        imageUrl: "/image/hourCleaning.png",
        description: "钟点保洁",
        url: "/pages/recommend/oddjob/hourCleaning/hourCleaning",
        id: 1
      },
      {
        imageUrl: "/image/appliancesCleaning.png",
        description: "家电清洗",
        url: "/pages/recommend/oddjob/appliancesCleaning/appliancesCleaning",
        id: 2
      },
      {
        imageUrl: "/image/mitesRemoval.png",
        description: "除尘除螨",
        url: "/pages/recommend/oddjob/mitesRemoval/mitesRemoval",
        id: 3
      },
      // {
      //   imageUrl: "/image/unlock.png",
      //   description: "今日好物",
      //   url: "/pages/recommend/oddjob/unlock/unlock",
      //   id: 4
      // },
      {
        imageUrl: "/image/dredgePipeline.png",
        description: "管道疏通",
        url: "/pages/recommend/oddjob/dredgePipeline/dredgePipeline",
        id: 5
      },
      {
        imageUrl: "/image/removeHCHO.png",
        description: "甲醛治理",
        url: "/pages/recommend/oddjob/removeHCHO/removeHCHO",
        id: 6
      },
      // {
      //   imageUrl: "/image/appliancesRepair.png",
      //   description: "家电维修",
      //   url: "/pages/recommend/oddjob/appliancesRepair/appliancesRepair",
      //   id: 7
      // },
      {
        imageUrl: "/image/leatherCare.png",
        description: "翻新养护",
        url: "/pages/recommend/oddjob/leatherCare/leatherCare",
        id: 8
      },
      {
        imageUrl: "/image/menu_ywqx.jpeg",
        description: "衣物清洗",
        url: "/pages/recommend/oddjob/dredgePipeline/dredgePipeline",
        id: 16
      },
      {
        imageUrl: "/image/menu_bjfw.jpeg",
        description: "搬家服务",
        url: "/pages/recommend/oddjob/removeHCHO/removeHCHO",
        id: 17
      },
      {
        imageUrl: "/image/jsgj.png",
        description: "家事管家",
        url: "/pages/recommend/oddjob/removeHCHO/removeHCHO",
        id: 18
      }
    ],
    curNav: 1,
    curIndex: 0,
    agentId: '',
    companyId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('调试二维码')
    console.log(options)
    WxNotificationCenter.addNotification('categoryUpdate', this.categoryNotification, this)
    this.setData({
      agentId: options.scene,
      showType: '6',
    })
    var that = this;
    // 获取手机高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
        })
      }
    })
    // that.setData({
    // })

  },
  categoryNotification() {
    console.log('分类刷新')
    this.getProductList()
  },

  // 侧边栏切换
  goServer: function(e) {
    var that = this;
    console.log(e)
    // 获取item项的id，和数组的下标值  
    var id = e.currentTarget.dataset.id;
    var description = e.currentTarget.dataset.description;
    var index = parseInt(e.target.dataset.index);
    console.log('分类id及角标：');
    console.log(id, index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index,
    })
    if (id == 1) {
      that.setData({
        // businessTypeId: '6'
        showType: '6'
      })
    }
    if (id == 2) {
      that.setData({
        // businessTypeId: '7'
        showType: '7'
      })
    }
    if (id == 3) {
      that.setData({
        // businessTypeId: '11'
        showType: '11'
      })
    }
    if (id == 4) {
      that.setData({
        // businessTypeId: '12'
        showType: '12'
      })
    }
    if (id == 5) {
      that.setData({
        // businessTypeId: '10'
        showType: '10'
      })
    }
    if (id == 6) {
      that.setData({
        // businessTypeId: '9'
        showType: '9'
      })
    }
    if (id == 7) {
      that.setData({
        // businessTypeId: '70'
        showType: '70'
      })
    }
    if (id == 8) {
      that.setData({
        // businessTypeId: '13'
        showType: '13'
      })
    }

    if (id == 16) {
      that.setData({
        // businessTypeId: '13'
        showType: '16'
      })
    }

    if (id == 17) {
      that.setData({
        // businessTypeId: '13'
        showType: '17'
      })
    }
    if (id == 18) {
      that.setData({
        // businessTypeId: '13'
        showType: '18'
      })
    }
    that.getProductList();
    // var data = {
    //   // businessTypeId: that.data.businessTypeId,
    //   showType: that.data.showType,
    //   activityStatus: 'miniapp',
    //   status: 'put'
    // }
    // util.doGet("/product/queryList", data, function(res) {
    //   console.log(description + '列表：');
    //   console.log(res);
    //   that.setData({
    //     productList: res.data
    //   })
    //   // 查询商品优惠后的价钱
    //   that.getProductLaterPrice();
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("分类onshow")
    if(wx.getStorageSync('selectCompany')) {
      this.setData({
        isShowCompany: false
      })
    }
    this.setData({
      companyId: wx.getStorageSync('selectCompany').id,
    })
    if(this.data.companyId == 1) {
      this.setData({
        serverlist: [{
          imageUrl: "/image/hourCleaning.png",
          description: "钟点保洁",
          url: "/pages/recommend/oddjob/hourCleaning/hourCleaning",
          id: 1
          },
          {
            imageUrl: "/image/appliancesCleaning.png",
            description: "家电清洗",
            url: "/pages/recommend/oddjob/appliancesCleaning/appliancesCleaning",
            id: 2
          },
          {
            imageUrl: "/image/mitesRemoval.png",
            description: "除尘除螨",
            url: "/pages/recommend/oddjob/mitesRemoval/mitesRemoval",
            id: 3
          },
          // {
          //   imageUrl: "/image/unlock.png",
          //   description: "今日好物",
          //   url: "/pages/recommend/oddjob/unlock/unlock",
          //   id: 4
          // },
          {
            imageUrl: "/image/dredgePipeline.png",
            description: "管道疏通",
            url: "/pages/recommend/oddjob/dredgePipeline/dredgePipeline",
            id: 5
          },
          {
            imageUrl: "/image/removeHCHO.png",
            description: "甲醛治理",
            url: "/pages/recommend/oddjob/removeHCHO/removeHCHO",
            id: 6
          },
          // {
          //   imageUrl: "/image/appliancesRepair.png",
          //   description: "家电维修",
          //   url: "/pages/recommend/oddjob/appliancesRepair/appliancesRepair",
          //   id: 7
          // },
          {
            imageUrl: "/image/leatherCare.png",
            description: "翻新养护",
            url: "/pages/recommend/oddjob/leatherCare/leatherCare",
            id: 8
          },
          {
            imageUrl: "/image/menu_ywqx.jpeg",
            description: "衣物清洗",
            url: "/pages/recommend/oddjob/dredgePipeline/dredgePipeline",
            id: 16
          },
          {
            imageUrl: "/image/menu_bjfw.jpeg",
            description: "搬家服务",
            url: "/pages/recommend/oddjob/removeHCHO/removeHCHO",
            id: 17
          },
          {
            imageUrl: "/image/jsgj.png",
            description: "家事管家",
            url: "/pages/recommend/oddjob/removeHCHO/removeHCHO",
            id: 18
          }
        ]
      })
    } else {
      this.setData({
        serverlist: [{
          imageUrl: "/image/hourCleaning.png",
          description: "钟点保洁",
          url: "/pages/recommend/oddjob/hourCleaning/hourCleaning",
          id: 1
          },
          {
            imageUrl: "/image/appliancesCleaning.png",
            description: "家电清洗",
            url: "/pages/recommend/oddjob/appliancesCleaning/appliancesCleaning",
            id: 2
          },
          {
            imageUrl: "/image/mitesRemoval.png",
            description: "除尘除螨",
            url: "/pages/recommend/oddjob/mitesRemoval/mitesRemoval",
            id: 3
          },
          // {
          //   imageUrl: "/image/unlock.png",
          //   description: "今日好物",
          //   url: "/pages/recommend/oddjob/unlock/unlock",
          //   id: 4
          // },
          {
            imageUrl: "/image/removeHCHO.png",
            description: "甲醛治理",
            url: "/pages/recommend/oddjob/removeHCHO/removeHCHO",
            id: 6
          },
          // {
          //   imageUrl: "/image/appliancesRepair.png",
          //   description: "家电维修",
          //   url: "/pages/recommend/oddjob/appliancesRepair/appliancesRepair",
          //   id: 7
          // },
        ]
      })
    }

    if(this.data.agentId){
      let scene = decodeURIComponent(this.data.agentId);
      wx.setStorageSync('invitationAgentId', scene)
    }
    //  else {
    //   wx.removeStorageSync('invitationAgentId')
    // }
    let data = {
      agentId: wx.getStorageSync('invitationAgentId'),
      platAccountId: wx.getStorageSync('accountId'),
    }
    util.doPost('form', "/business/agent/addAgentShareRecord", data, function (res) {
      console.log('关联代理商')
      console.log(res)
    })
    this.getProductList();
  },
  // 商品列表
  getProductList: function(){
    var that = this;
    var data = {
      showType: that.data.showType,
      activityStatus: 'miniapp',
      status: 'put',
      companyId: wx.getStorageSync('selectCompany').id
    }

    if(wx.getStorageSync('invitationAgentId')) {
      data.ifDistribute = 1
      data.agentId = wx.getStorageSync('invitationAgentId')
    }

    util.doGet("/product/queryList", data, function (res) {
      console.log('列表：');
      console.log(res);
      that.setData({
        productList: res.data
      })
      // 查询商品优惠后的价钱
      that.getProductLaterPrice();
    })
  },

  // 查询商品优惠后的价钱
  getProductLaterPrice() {
    var that = this;
    // if (app.data.accountId) {
    if (app.data.phone) {
      var data = {
        accountId: app.data.accountId,
        // businessTypeId: that.data.businessTypeId,
        showType: that.data.showType,
      }
      console.log("分类优惠传参：")
      console.log(data)
      util.reqLoading(app.globalData.apiUrl, 'MS00206', data, 'POST', '加载中...', function (res) {
        console.log("商品优惠后的价钱：")
        console.log(res)
        that.setData({
          afterPriceList: res.data,
        })
      })
    }else{
      that.setData({
        afterPriceList: [],
      })
    }
  },
  //进入产品详情
  toDetail: function (e) {
    var activityId = e.currentTarget.dataset.activityid;
    var productId = e.currentTarget.dataset.productid;
    if (!activityId) {
      activityId = ''
    }
    wx.navigateTo({
      url: '/pages/recommend/oddjob/productDetail/productDetail?productId=' + productId + '&activityId=' + activityId,
    });
  },
  //跳转钟点保洁
  hourCleaning: function () {
    wx.navigateTo({
      url: '/pages/recommend/oddjob/hourCleaning/hourCleaning',
    })
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