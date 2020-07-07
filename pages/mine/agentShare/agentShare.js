// pages/mine/share/share.js
var util = require('../../../utils/util.js');
var app = getApp();
let WxNotificationCenter = require('../../../utils/WxNotificationCenter')

var timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 获取手机高度
    windowWidth: '',
    windowHeight: '',
    //获取宽高
    shWidth: '',
    shHeight: '',
    imgWidth: '',
    imgHeight: '',
    dxLeft: '',
    dyTop: '',

    // bgSrc: 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/mini-customer/share-bg.png?v=2',
    bgSrc: '/image/angent-share-bg.png',
    imgSrc: '',
    pic: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      imgSrc: options.shareUrl
    })
    WxNotificationCenter.addNotification('updateWithdrawal', this.getCommissionTotal, this)
    
    //二维码获取
    var that = this;
    var data;
    wx.getSystemInfo({
      success: res => {
        that.setData({
          windowWidth: res.windowHeight,
          windowHeight: res.windowHeight
        })
      }
    })
    var query = wx.createSelectorQuery();
    query.select('.show_block').boundingClientRect(function(rect) {
      var shWidth = rect.width;
      var shHeight = rect.height
      var sLeft = rect.left
      var sTop = rect.top
      console.log(sTop, sLeft)
      that.setData({
        sLeft: sLeft,
        sTop: sTop
      })
      that.setData({
        shWidth: shWidth,
        shHeight: shHeight
      })
    }).exec();
    query.select('.img').boundingClientRect(function(rect) {
      var imgWidth = rect.width;
      var imgHeight = rect.height
      var dTop = rect.top
      var dLeft = rect.left
      console.log(dTop, dLeft)
      that.setData({
        imgWidth: imgWidth,
        imgHeight: imgHeight,
        dTop: dTop,
        dLeft: dLeft
      })
    }).exec();
    this.getCommissionTotal()

  },
  getCommissionTotal() {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    util.doGet("/business/agent/getCommissionTotal", 
    {agentId: wx.getStorageSync('agentId'),statusArr: '0,1,2,3'}, function(res) {
      if(res.success) {
        that.setData({
          // 总佣金
          total: res.data.total,
          // 我的推广（单）
          count: res.data.count,
          shareCount: res.data.shareCount
        })
      } else {
        wx.showToast({
          title: res.reason,
          icon: 'none',
          duration: 1500
        })
      }
      wx.hideLoading()
    })
  },

  getMyClientNum: function(data) {
    var that = this;
    // 查询邀请共几人
    util.doGet("/housekeepers/" + app.data.accountId + "/inviteInfo", data, function(res2) {
      console.log('share我的邀请人共几人：');
      console.log(res2);
      // console.log(res2.data.length);

      that.setData({
        myClientNum: res2.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    // timer = setTimeout(function () {
    //   console.log("----Countdown----");
    //   that.getMyClientNum(this.data);
    //   that.onShow();
    // }, 5000);
  },


  handleLongPress: function(e) {
    console.log("长按");
    let that = this;
    var imgSrc = that.data.imgSrc;
    let isFirst = wx.getStorageSync('isFirst') || 0;
    console.log(imgSrc)
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('yes')
              that.saveImage();
            },
            // fail() {
            //   console.log("拒绝")


            // },
            fail() {
              wx.hideLoading();
              wx.showModal({
                title: '温馨提示',
                content: '该功能需要您授权，是否去设置打开？',
                confirmText: "确认",
                cancelText: "取消",
                success: function(res) {
                  console.log(res);
                  if (res.confirm) {
                    console.log('用户点击确认')
                    wx.openSetting({
                      success: (res) => {
                        console.log(res)
                        res.authSetting = {
                          "scope.userLocation": true,
                        }
                        console.log("openSetting: success");
                      }
                    });
                  } else {
                    console.log('用户点击取消')
                  }
                }
              });

            }

          });
        } else {
          that.saveImage();
        }
      },

    });

  },
  saveImage() {
    wx.showLoading({
      title: '保存中...',
      duration: 2000
    });
    let that = this;
    // if (that.data.pic == null || '') {
    //   wx.showLoading({
    //     title: '保存失败',
    //     duration: 2000
    //   });
    // }
    wx.getImageInfo({
      src: that.data.imgSrc,
      success: function(res) {
        console.log(res)
        var bgSrc = that.data.bgSrc
        var imgSrc = res.path
        console.log(that.data.bgSrc)
        var shWidth = that.data.shWidth
        var shHeight = that.data.shHeight
        var imgWidth = that.data.imgWidth
        var imgHeight = that.data.imgHeight
        var windowWidth = that.data.windowWidth
        var dLeft = that.data.dLeft
        var dTop = that.data.dTop
        var sTop = that.data.sTop
        var sLeft = that.data.sLeft
        var dxLeft = dLeft - sLeft
        var dyTop = dTop - sTop
        console.log(dxLeft, dyTop)
        // var dx = 40 / shWidth
        // var dy = 350 / shHeight
        // var dxW = 60 / shWidth
        // var dxH = 60 / shWidth

        const ctx = wx.createCanvasContext('myCanvas');
        // ctx.drawImage(bgSrc, 0, 0, shWidth, shHeight);
        // ctx.drawImage(imgSrc, 60, 320, 60, 60); // 二维码
        ctx.drawImage(bgSrc, 0, 0, shWidth, shHeight);
        ctx.drawImage(imgSrc, dxLeft, dyTop, imgWidth, imgHeight);
        ctx.draw(false, function(e) {
          // 保存到本地
          var shWidth = that.data.shWidth
          var shHeight = that.data.shHeight
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: shWidth,
            height: shHeight,
            canvasId: 'myCanvas',
            destWidth: 2010,
            destHeight: 2877,
            success: function(res) {
              let pic = res.tempFilePath;
              console.log(pic)
              that.setData({
                  pic: pic
                }),
                wx.saveImageToPhotosAlbum({
                  filePath: pic,
                  success(res) {
                    wx.hideLoading();
                    wx.showToast({
                      title: '保存成功',
                      icon: 'success',
                      duration: 2000
                    });
                  }
                });
            }
          });
        });
      }
    })
  },
  // 邀请列表
  toMyAgentInvitation() {
    wx.navigateTo({
      url: '/pages/mine/myClient/agentMyInvitationList/myInvitation',
    })
  },

  //跳转到我推广列表
  toMyInvitation: function() {
    wx.navigateTo({
      url: '/pages/mine/myClient/agentMyInvitation/myInvitation',
    })
  },

  //跳转到佣金
  income: function() {
    wx.navigateTo({
      url: '/pages/mine/agentShare/income/income',
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
    // console.log('onHide****');
    // // 退出当前页面时，清除定时器
    // clearTimeout(timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // console.log('onunload****');
    // // 退出当前页面时，清除定时器
    // clearTimeout(timer);

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function() {

  // }
})