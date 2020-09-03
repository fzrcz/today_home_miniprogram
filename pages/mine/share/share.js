// pages/mine/share/share.js
var util = require('../../../utils/util.js');
var app = getApp();
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
    bgSrc: '/image/share-bg.png',
    imgSrc: '',
    pic: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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

    // util.mask('加载中...');
    util.doGet("/housekeepers/" + app.data.accountId + "/qrCode", data, function(res) {
      console.log('qrCode为：')
      var imgSrc = res.qrCode
      if(wx.getStorageSync('selectCompany').id != 2) {
        that.setData({
          imgSrc: imgSrc
        })
      } else {
        that.setData({
          imgSrc: 'https://hr-images-home.oss-cn-shenzhen.aliyuncs.com/20200826/19716.jpg?v=2'
        })
      }
      
    })
    // 查询邀请共几人
    util.doGet("/housekeepers/" + app.data.accountId + "/inviteInfo", data, function(res2) {
      console.log('share我的邀请人共几人：');
      console.log(res2);
      // console.log(res2.data.length);

      that.setData({
        myClientNum: res2.data
      })
    })

    // 查询客户工友人数及总收入
    var data = {
      inviterId: app.data.accountId,
      // inviterId: '33c14ad8-525b-47c2-bb16-98ff4299fa33',
      inviterFlag: 1,
      businessTypeArr: '2,3',
      roleType: 1,
    }
    wx.showLoading({
      title: '加载中...',
    })
    util.doGet("/accountTtaceRecord/queryList", data, function(res2) {
      
      console.log('分享onload：');
      console.log(res2);

      if (res2.success) {
        // res2.data为分润记录数据
        // if (res2.data.length == 0) {
        //   that.setData({
        //     myClientList: []
        //   })
        // } else {
          var allIncome = 0;
          
          for (var i = 0; i < res2.data.length; i++) {
            allIncome += res2.data[i].traceMoney;
          }
          var workerCount = 0;
          for (var i = 0; i < res2.data.length; i++) {
            if (res2.data[i].businessType == 2) {
              workerCount++;
            }
          }
          var employerCount = 0;
          for (var i = 0; i < res2.data.length; i++) {
            if (res2.data[i].businessType == 3) {
              employerCount++;
            }
          }

          wx.hideToast();
          wx.hideLoading();
          // 判断计算出来的总收入是不是0，如果是0就不保留两位小数，否则保留2位小数
          if(allIncome == 0){
            that.setData({
              allIncome: 0,
            })
          }else{
            that.setData({
              allIncome: allIncome.toFixed(2),
            })
          }
          that.setData({
            myClientList: res2.data,
            // allIncome: allIncome.toFixed(2),
            workerCount: workerCount,
            employerCount: employerCount,
          })
        }
      // }
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
        ctx.drawImage(bgSrc, 0, 0, shWidth, shHeight);
        ctx.drawImage(imgSrc, dxLeft, dyTop, imgWidth, imgHeight);
        ctx.draw(false, function(e) {
          // 保存到本地
          var shWidth = that.data.shWidth
          var shHeight = that.data.shHeight
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: windowWidth,
            height: shHeight,
            canvasId: 'myCanvas',
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


  //跳转到我邀请的人
  toMyInvitation: function() {
    wx.navigateTo({
      url: '/pages/mine/myClient/myInvitation/myInvitation',
    })
  },

  //跳转到储值提现
  income: function() {
    wx.navigateTo({
      url: '/pages/mine/income/income',
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