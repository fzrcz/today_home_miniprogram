var util = require('../../../../utils/util.js')
const app = getApp();
var scene = ''
var productPic = ''
var headPic = ''
let animationShowHeight = 600; //动画偏移高度
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluateListaa: [{
        headPic: '/image/moren-1.png',
        employerNickName: '555*222',
        discuss: '挺好',
        time: '',
        imgs: []
      },
      {
        headPic: '/image/moren-1.png',
        employerNickName: '555*222',
        discuss: '',
        time: '',
        imgs: []
      },
      {
        headPic: '/image/moren-1.png',
        employerNickName: '555*222',
        discuss: '22',
        time: '',
        imgs: []
      },
      {
        headPic: '/image/moren-1.png',
        employerNickName: '555*222',
        discuss: '33',
        time: '',
        imgs: []
      },
      {
        headPic: '/image/moren-1.png',
        employerNickName: '555*222',
        discuss: '44',
        time: '',
        imgs: []
      },
    ],
    visibleLogin: false,
    visibleShare: false,
    maskHidden: false,
    ruleShow: false,
    // 遮罩层变量
    animationData: "",
    showModalStatus: false,
    //登录提示
    showModalLogin: false,
    num: 0,// 可用优惠券的数量
  },

  //展开收起
  toggle() {
    var value = !this.data.ruleShow;
    this.setData({
      ruleShow: value
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
    // that.getIsCoupons();

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
      wx.showToast({
        title: '恭喜您领取成功',
        icon: 'success',
        duration: 1500
      })
    } else if (app.data.accountId) {
      wx.setStorageSync('loginStatus', 'login');
      app.data.loginStatus = 'login';
      wx.showToast({
        title: '恭喜您领取成功',
        icon: 'success'
      })
      // wx.navigateTo({
      //   url: '/pages/mine/myCoupon/myCoupon',
      // })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var _this = this
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    // source:来源：1 人分享过来的 2 广告位过来的 3 正常过来的
    var source = 3;
    var parameter = '';

    var activityId = ""
    var productId = ""
    // options.scene有值，证明是从小程序码扫进来的
    // 没有值，可能是通过文章链接进来的，如果没有值，就用默认值
    if (options.scene) {
      scene = decodeURIComponent(options.scene)
      console.log("scene******为")
      console.log(scene)
      var scenes = scene.split(";")
      productId = scenes[0]
      activityId = scenes[1]
      source = scenes[2]
      parameter = scenes[3]
    } else {
      console.log("没有scene")
      productId = options.productId
      activityId = options.activityId
      if (options.source) {
        source = options.source
      }
      if (options.parameter) {
        parameter = options.parameter
      }
    }
    // *******************************************************************
    scene = productId + ";" + activityId;

    // 把productId存起来
    that.setData({
      productId: productId,
    })

    var data = {
      platform: "miniapp",
      activityId: activityId,
      // accountId: app.data.accountId,
    }
    // console.log('详情传参：');
    // console.log(data);
    wx.showLoading({
      title: '加载中...',
      mask: true,
      duration: 60000
    })
    util.doGet("/product/detail/" + productId, data, function(res) {
      wx.hideLoading();
      console.log('产品详情页返回：')
      console.log(res.data)

      that.setData({
        detail: res.data
      })
    })

    // 把source和parameter存起来，用于支付的时候传参
    app.globalData.source = source;
    app.globalData.parameter = parameter;

    // 商品的访问量
    var data = {
      accountId: app.data.accountId,
      productId: productId,
      channel: 2, // 渠道 1 H5  2 小程序
      source: source, // 来源：
      parameter: parameter,
    }
    console.log("商品的访问量传参")
    console.log(data)
    util.reqLoading(app.globalData.apiUrl, 'MS00602', data, 'POST', '加载中...', function(res) {
      console.log("商品访问量返回：");
      console.log(res);
    })

    // // 调用是否有优惠券可用 onshow有调用，onload不必再调用
    // that.getCouponsList(productId);

    // 获取评价列表
    that.getEvaluateList(productId);
  },
  // onload 结束

  // 获取评价列表的方法
  getEvaluateList: function(productId) {
    var that = this;
    var data = {
      productId: productId,
    }
    util.reqLoading(app.globalData.apiUrl, 'MS00901', data, 'POST', '加载中...', function(res) {
      console.log("获取评价列表，返回：")
      console.log(res)

      // 把有评价内容的存到一个数组
      var evaluateList = res.data[0].info;
      var haveDiscussList = [];
      for (var i in evaluateList) {
        if (evaluateList[i].discuss != "" && evaluateList[i].discuss != null) {
          haveDiscussList.push(evaluateList[i]);
        }
      }
      that.setData({
        evaluateList: res.data[0].info,
        haveDiscussList: haveDiscussList,
      })
    })
  },

  // 获取accountId对应的简单的id
  getSimpleAccountId: function() {
    // 访问详情页的时候调用accounts/mini，获取一下accountId对应的数字id，用于生成海报的时候传入这个人id
    // 由于accountId太长，生成海报不能成功，所以用简单的数字id
    console.log("accountSimpleId为：");
    console.log(app.data.accountSimpleId);
    if (!app.data.accountSimpleId) {
      console.log("没有accountSimpleId，去获取")
      var data = {
        unionId: app.data.unionid,
        miniOpenId: app.data.openid,
        phone: app.data.phone,
        headPic: app.data.avatarUrl,
        nickname: app.data.nickName,
        role: app.data.userRole,
      }
      console.log("minidata传参：")
      console.log(data)
      util.doPut("/accounts/mini", data, function(base) {
        console.log('accounts/mini返回');
        console.log(base);
        if (base) {
          wx.setStorageSync('accountSimpleId', base.accountId);
          // wx.setStorageSync('accountId', base.id);
          // wx.setStorageSync('userRole', base.role);
          // wx.setStorageSync('loginStatus', 'login');
          app.data.accountSimpleId = base.accountId;
          // app.data.accountId = base.id;
          // app.data.userRole = base.role;
          // app.data.loginStatus = 'login';
        }
      })
    }
  },

  // 查询优惠券
  getCouponsList: function(productId) {
    var that = this;
    // 查询一下有没有可用的优惠券，没有的话，显示暂无优惠券可用
    // MS00201获取优惠券列表
    // 没有登录，就先把优惠金额设成0
    if (!app.data.accountId) {
      that.setData({
        couponsLimitPrice: 0,
      })
    } else {
      var data = {
        accountId: app.data.accountId,
        productId: productId,
      }
      util.reqLoading(app.globalData.apiUrl, 'MS00202', data, 'POST', '加载中...', function(res) {
        console.log("查询" + "优惠券");
        console.log(res);
        var couponList = res.data;
        if (couponList.length != 0) {

          var canUserCouponList = [];
          var canNotUserCouponList = [];
          var num = 0; // 有一张可用就加1
          var couponsLimit = [];
          for (var i in couponList) {
            if (couponList[i].flag == true) {
              couponsLimit.push(couponList[i].couponsLimit);
              num++;
              canUserCouponList[i] = couponList[i];
            } else {
              canNotUserCouponList[i] = couponList[i];
            }
          }
          // console.log("额度数组：")
          // console.log(couponsLimit)

          for (var k = 0; k < couponsLimit.length - 1; k++) {
            for (var j = k + 1; j < couponsLimit.length; j++) { // 升序把<改成>
              if (couponsLimit[k] < couponsLimit[j]) {
                var temp = couponsLimit[k];
                couponsLimit[k] = couponsLimit[j];
                couponsLimit[j] = temp;
              }
            }
          }
          // console.log("额度数组排序后：")
          // console.log(couponsLimit)
          if (couponsLimit.length > 0) {
            that.setData({
              couponsLimitPrice: couponsLimit[0],
              num: num,
            })
          } else {
            that.setData({
              couponsLimitPrice: 0,
              num: num,
            })
          }

          // that.setData({
          //   isCanUse: true, // 有可用的，根据这个变为红色
          //   selectCoupon: num + '张可用',
          // })
          // if (canUserCouponList.length == 0) {
          //   that.setData({
          //     isCanUse: false,
          //     selectCoupon: '暂无优惠券可用',
          //   })
          // }

          // that.setData({
          //   canUserCouponList: canUserCouponList,
          //   canNotUserCouponList: canNotUserCouponList,
          // })
        } else {
          that.setData({
            couponsLimitPrice: 0,
            num: 0,
          })
        }
      })
    }
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
    var that = this;

    // if (!app.data.accountId) {
    //   this.showModalLogin()
    // } else {
    //   this.hideModalLogin()
    // }

    // 调用是否有优惠券的接口
    // if (app.data.accountId) {
    if (app.data.phone) {
      // that.getIsCoupons();
      that.getCouponsList(that.data.productId);
      // 去获取accountId的简单的id，用于分享出去的时候传参
      that.getSimpleAccountId();
    }
  },
  // onshow结束

  // 调用是否有优惠券的接口
  getIsCoupons: function() {
    var that = this;
    // 第一批优惠券调用这个MS00203的接口，之后新的优惠券就调用MS00205接口
    var data = {
      accountId: app.data.accountId,
    }
    util.reqLoading(app.globalData.apiUrl, 'MS00203', data, 'GET', '加载中...', function(res) {

      // var data = {
      //   accountId: app.data.accountId,
      //   type: 0, // 1.系统发放 2.手点击领取
      //   couponsBatchId: app.data.couponsBatchIdsList,
      // }
      // util.reqLoading(app.globalData.apiUrl, 'MS00205', data, 'GET', '加载中...', function(res) {

      //   console.log("详情页调用是否有优惠券，返回：");
      //   console.log(res);
      if (res.data[0].flag) {

        // MS00204展示优惠券的数据
        // var data = {
        //   accountId: app.data.accountId,
        //   type: 1, // 1.系统发放 2.手点击领取
        //   couponsBatchIds: app.globalData.couponsBatchIdsList,
        // }
        // util.reqLoading(app.globalData.apiUrl, 'MS00204', data, 'GET', '加载中...', function (res2) {
        //   console.log("详情页onload查询优惠券，返回：");
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
  },

  //跳转登录页
  goEempower: function() {
    wx.navigateTo({
      url: '/pages/empower/empower',
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
    var that = this;
    that.handleCancelShare()
    return {
      title: that.data.detail.description,
      imageUrl: that.data.detail.productFileBanner[0].filePath,
      success: function(res) {

      },
      fail: function(res) {

      }
    }
  },

  toIndex: function() {
    wx.switchTab({
      url: '/pages/recommend/recommend',
    })
  },

  toCall: function() {
    wx.makePhoneCall({
      phoneNumber: "400-600-6580"
    })
  },

  /**
   * 去订单页
   */
  toOrder: function() {
    var that = this;
    // 判断有没登录，没有就跳转登录
    // if (!app.data.accountId) {
    //   wx.navigateTo({
    //     url: '/pages/empower/empower',
    //   })
    //   return;
    // }
    // if (app.data.accountId && !app.data.phone) {
    if (!app.data.phone) {
      wx.navigateTo({
        url: '/pages/empower/empower',
      })
      return;
    } else {
      // 检测是否能买新人专享的商品
      console.log("是否新人商品：" + that.data.detail.isNewPeople)
      console.log("是否新人：" + app.data.isNewPeople)
      if (that.data.detail.isNewPeople == 10 && app.data.isNewPeople != 1) {
        // wx.showToast({
        //   title: '抱歉，您已购买过新人专享的商品，不能再次购买',
        //   icon: 'none',
        //   duration: 2000
        // })
        wx.showModal({
          title: '',
          content: '抱歉，您已购买过新人专享的商品，不能再次购买',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              console.log("确认删除")

            } else {
              console.log("取消删除")
            }
          }
        })
        return;
      }
    }
    var that = this
    var activityId = ''
    if (that.data.detail.activity) {
      activityId = that.data.detail.activity.id
    }
    wx.navigateTo({
      url: '../confirmOrder/confirmOrder?productId=' + that.data.detail.id + '&businessTypeId=' + that.data.detail.businessTypeId + '&showType=' + that.data.detail.showType + '&activityId=' + activityId + '&productName=' + that.data.detail.name + '&price=' + that.data.detail.discountsPrice + '&serviceNo=' + that.data.detail.serviceNo,
    })
  },

  //去评价列表页
  userEvaluationList() {
    var that = this;
    wx.navigateTo({
      url: '/pages/recommend/oddjob/productDetail/userEvaluationList/userEvaluationList?evaluateList=' + JSON.stringify(that.data.evaluateList),
    })
  },

  //分享模态框-打开
  handleOpenShare() {
console.log('分享')
    // if (app.data.accountId) {
    if (app.data.phone) {
      this.setData({
        visibleShare: true
      });
    } else {
      wx.navigateTo({
        url: '/pages/empower/empower',
      })
    }
  },

  //分享模态框-关闭
  handleCancelShare() {
    this.setData({
      visibleShare: false
    });
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
  //判断是否登录
  // isLogin: function() {
  //   var that = this;
  //   if (app.data.loginStatus == 'login') {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // },

  // login: function() {
  //   var that = this
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
  //               console.log(base)
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
  //                   visibleLogin: false
  //                 });
  //               } else {
  //                 // that.handleOpenLogin()
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

  //登录
  // getUnionId: function(e) {
  //   if (btn) {
  //     return;
  //   }
  //   btn = true
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
  //                   visibleLogin: false
  //                 });
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

  //获取头像
  getUserInfo: function(e) {
    console.log(e)
    app.data.avatarUrl = e.detail.userInfo.avatarUrl;
    this.toGetPoster()

  },

  //点击生成海报
  toGetPoster: function(e) {
    var that = this;
    this.setData({
      maskHidden: false,
      visibleShare: false
    });
    wx.showLoading({
      title: '生成中...',
      mask: true
    });

    //保存产品详情图片到缓存
    wx.getImageInfo({
      src: that.data.detail.productFileBanner[0].filePath,
      success(img) {
        productPic = img.path
        //保存头像图片到缓存
        wx.getImageInfo({
          src: app.data.avatarUrl,
          success(head) {
            console.log("进到getimageinfo")
            console.log("head为：", head)
            headPic = head.path
            that.getMiniCode()
          }
        })
      }
    })

    // setTimeout(function () {

    // }, 1000)
  },

  getMiniCode: function() {
    var that = this;
    // 后边 ‘’ 改为accountId的简单id,source 1人分享过来的
    scene = scene + ";1;" + app.data.accountSimpleId;
    // scene = scene + ";1;" + 11260;
    // scene = scene + ";1;" + '';
    var data = {
      scene: scene,
      page: 'pages/recommend/oddjob/productDetail/productDetail'
    }
    console.log("生成小程序码传参：")
    console.log(data);
    util.doGet("/weiXin/productMiniCode", data, function(res) {
      console.log("res生成的小程序码:")
      console.log(res)
      wx.getImageInfo({
        src: res,
        success(img) {
          console.log("img为：", img)
          that.createPoster(img.path);
          that.setData({
            maskHidden: true
          });
        }
      })

    })
  },

  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createPoster: function(miniCodePic) {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#fff")
    context.fillRect(0, 0, 375, 667)

    var topFontPic = "/image/img-share-fontTop.png"
    var bottomFontPic = "/image/img-share-fontBottom.png"
    // var miniCodePic = ""

    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(productPic, 28, 130, 320, 359);

    context.drawImage(headPic, 24, 52, 41, 41);
    context.drawImage(topFontPic, 81, 49, 236, 41);
    //不知道是什么原因，手机环境能正常显示
    // context.save(); // 保存当前context的状态


    //绘制右下角扫码提示语
    context.drawImage(bottomFontPic, 142, 545, 200, 65);
    //绘制左下角二维码
    context.drawImage(miniCodePic, 34, 524, 98, 98);

    context.draw(true, that.setCanvasPath);

    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    // setTimeout(function () {

    // }, 2000);
  },

  setCanvasPath: function(e) {
    var that = this
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function(res) {
        wx.hideLoading()
        var tempFilePath = res.tempFilePath;
        console.log("生成小程序码的路径：")
        console.log(tempFilePath)
        that.setData({
          imagePath: tempFilePath,
          canvasHidden: true
        });
      },
      fail: function(res) {
        console.log(res);
      }
    });
  },

  //点击保存到相册
  baocun: function() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function(res) {
            if (res.confirm) {
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          },
          fail: function(res) {}
        })
      }
    })
  },

  // 点击中间的防疫小措施，跳转
  // pages/recommend/defendVirus/defendVirus
  toDetail: function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/recommend/defendVirus/defendVirus?type=1',
    })
  },


})