const app = getApp()
var util = require('../../../utils/util.js') 
var inviterId = ''
var btn = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneVal:'',
    isSuccess:false,
    visible:false,
    actions: [
      {
        name: '客服协助'
      },
      {
        name: '自行完善',
        color:'#FF7F27'
      }
    ],
    random: Math.random() * 10000
  },

  imageLoad: function (e) {
    //获取图片真实宽度和高度
    var width = e.detail.width;
    var height = e.detail.height;
    //图片真实高度比例

    this.setData({
      viewWidth: width,
      viewHeight: height
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene){
      inviterId = options.scene
    }
    if (app.data.accountId){
      this.setData({
        isSuccess: true
      })
    }
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
    var that = this;
    return {
      title: '工作多 工资高 雇主直联阿姨',
      imageUrl: 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/ad/img-share01.png?' + Math.random(),
      path: '/pages/share/recruit/recruit?scene=' + app.data.accountId,
      success: function (res) {

      },
      fail: function (res) {

      }
    }
  },

  //搜索框输入值  
  phoneInput: function (e) {
    var that = this;
    that.setData({
      phoneVal: e.detail.value
    })
  },

  getPhoneNumber(e) {
    if (e.detail.encryptedData == undefined) {
      return false;
    }
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          var data = {
            encryptedData: e.detail.encryptedData,
            code: res.code,
            iv: e.detail.iv
          }
          util.doGet("/weiXin/phone", data, function (res) {
            // console.log(res);
            if (res) {
              app.data.phone = res.phoneNumber
              wx.setStorageSync("phone", res.phoneNumber)
              that.setData({
                phoneVal: res.phoneNumber
              })
            }else{
              wx.showToast({
                title: '获取失败，请重新获取',
                icon: "none"
              })
            }
          })
        }
      }
    })
  },

  getUnionId1: function (e) {
    if (btn) {
      return;
    }
    btn = true;
    var that = this
    // if (that.data.phoneVal.length != 11) {
    //   wx.showToast({
    //     title: '请输入正确的手机号码，方便我们联系您！',
    //     duration: 3000,
    //     icon: "none"
    //   })
    //   btn = false;
    //   return;
    // }

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

              //去注册阿姨账户，如果已经有账号了，就不注册，返回id
              var data = {
                unionId: res.unionId,
                miniOpenId: res.openId,
                phone: that.data.phoneVal,
                headPic: res.avatarUrl,
                nickname: res.nickName,
                inviterId: inviterId,
                role: 'housekeeper'
              }
              util.doPut("/accounts/mini", data, function (base) {
                // console.log(base);
                if (base) {
                  that.toComplement()
                  wx.setStorageSync('accountId', base.id);
                  wx.setStorageSync('userRole', base.role);
                  wx.setStorageSync('loginStatus', 'login');
                  app.data.accountId = base.id
                  app.data.userRole = base.role
                  app.data.loginStatus = 'login';
                  // wx.showToast({
                  //   title: '您的申请我们已收到，您的资料还需要完善，以便更快的找到合适的工作。',
                  //   duration: 3000,
                  //   icon: "none"
                  // })

                  that.setData({
                    isSuccess: true
                  })

                } else {
                  wx.showToast({
                    title: '提交失败，请稍后再试',
                    duration: 3000,
                    icon: "none"
                  })
                }
                btn = false;
              })


            } else {
              btn = false;
            }

          })
        }
      }
    })
  },

  getUnionId: function (e) {
    console.log(btn)
    if (btn) {
      return;
    }
    btn = true;
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
              wx.navigateTo({
                url: 'getPhone/getPhone',
              })
            }
            btn = false

          })
        }
      }
    })
  },



  previewPic: function (e) {

    var current = 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/qrcode-kf.png'
    // console.log(current)
    var imagesrc = [current]
    wx.previewImage({
      current: current,
      urls: imagesrc
    })
  },

  toHelp: function () {
    wx.makePhoneCall({
      phoneNumber: '400-600-6580'
    })
  },

  toComplement:function(){
    wx.navigateTo({
      url: 'baseInfo/baseInfo',
    })
  },

  handleClick: function ({ detail }) {

    const index = detail.index;

    if (index === 0) {
      this.toHelp();
    } else if (index === 1) {
      this.toComplement();
    }

    this.setData({
      visible: false
    });
  }
})