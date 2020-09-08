var util = require('../../../utils/util.js');
var app = getApp();
let WxNotificationCenter = require('../../../utils/WxNotificationCenter')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgDraw: {},
    sharePath: "",
    shareCount: 0,
    count: 0,
    total: 0,
    imgSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      imgSrc: options.shareUrl
    })
    WxNotificationCenter.addNotification('updateWithdrawal', this.getCommissionTotal, this)
    this.getCommissionTotal()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let _this = this
    wx.showLoading({
      title: '生成中'
    })
    let bgImage = ''
    if(wx.getStorageSync('selectCompany').id != 2) {
      bgImage = 'https://hr-images-home.oss-cn-shenzhen.aliyuncs.com/20200829/19732.png?v=3'
    } else {
      bgImage = 'https://hr-images-home.oss-cn-shenzhen.aliyuncs.com/20200905/19758.png?v=0'
    }
    this.setData({
      imgDraw: {
        width: '750rpx',
        height: '1100rpx',
        background: bgImage,
        views: [
          {
            type: 'image',
            url: wx.getStorageSync('avatarUrl') || '',
            css: {
              top: '504rpx',
              left: '328rpx',
              width: '96rpx',
              height: '96rpx',
              borderWidth: '6rpx',
              borderColor: '#FFF',
              borderRadius: '96rpx'
            }
          },
          {
            type: 'text',
            text: wx.getStorageSync('nickName') || '今日到家',
            css: {
              top: '610rpx',
              fontSize: '28rpx',
              left: '375rpx',
              align: 'center',
              color: '#3c3c3c'
            }
          },
          {
            type: 'image',
            url: _this.data.imgSrc,
            css: {
              top: '888rpx',
              left: '20rpx',
              width: '200rpx',
              height: '200rpx'
            }
          }
        ]
      }
    })
  },
  onImgOK(e) {
    console.log(e)
    wx.hideLoading()
    this.setData({
      sharePath: e.detail.path
    })
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
  handleLongPress() {
    console.log("长按");
    let _this = this
    wx.showLoading({
      title: '保存中...',
      duration: 2000
    });
    // debugger
    console.log(_this.data.sharePath)
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.getImageInfo({
                src: _this.data.sharePath,
                success: function (ret) {
                    var path = ret.path;
                    wx.saveImageToPhotosAlbum({
                        filePath: path,
                        success(result) {
                            console.log(result)
                            wx.showToast({
                              title: '保存成功',
                              icon: 'success',
                              duration: 2000
                            });
                        },
                        fail(err) {
                          console.log(err)
                        }
                    })
                }
             })
            },
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
          wx.getImageInfo({
            src: _this.data.sharePath,
            success: function (ret) {
                var path = ret.path;
                wx.saveImageToPhotosAlbum({
                    filePath: path,
                    success(result) {
                        console.log(result)
                        wx.showToast({
                          title: '保存成功',
                          icon: 'success',
                          duration: 2000
                        });
                    },
                    fail(err) {
                      console.log(err)
                    }
                })
            }
         })
        }
      },

    });
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
    
  }
})