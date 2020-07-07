// pages/mine/generateAddMiniCode/generateAddMiniCode.js
var util = require('../../../utils/util.js')
const app = getApp();
var scene = '';
var productPic = '';
var headPic = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  },
  // 商品id
  getProductId: function(e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      productId: e.detail.value
    })
  },
  // 来源
  getSource: function(e) {
    console.log(e.detail.value)
    var that = this;
    that.setData({
      source: e.detail.value
    })
  },
  // 广告位
  getAddNo: function(e) {
    console.log(e.detail.value)
    var that = this;
    that.setData({
      addNo: e.detail.value
    })
  },
  // 路径
  getPagePath: function(e) {
    console.log(e.detail.value)
    var that = this;
    that.setData({
      pagePath: e.detail.value
    })
  },

  // 点击生成
  generateMinicode: function(e) {
    var that = this;

    // 有商品id的话，来源不可为空，检验一下来源是否为空
    if(that.data.productId && that.data.source || !that.data.productId){
      console.log("点击生成")
      that.toGetPoster();
    }else{
      wx.showToast({
        title: '请填写来源，且不能为空格',
        icon: 'none'
      })
      return;
    }
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
      src: 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/minishop/discount-bg.png',
      success(img) {
        productPic = img.path
        //保存头像图片到缓存
        wx.getImageInfo({
          src: app.data.avatarUrl,
          success(head) {
            headPic = head.path
            that.getMiniCode()
          }
        })
      }
    })
  },

  /**
   * 生成小程序码
   * 1.生成某商品的小程序码
   *  商品id：输入商品id
   *  来源：写上来源，写1 2 3 即可，1.人分享过来的 2.广告位过来的 3.自己正常进入
   *  广告位：如果是人分享进来的，则填写人的简单的account id。
   *         如果是从广告位进来的，则填写广告位的编号
   *         如果是自己进来的，则不用填写
   *  路径：扫小程序码后跳到哪里，可跳到某品类，也可跳到某商品的详情页
   * 
   * 2.生成某品类的小程序码：
   *    只填写某品类的路径即可，商品id，来源，广告位不用写 
   * 
   */

  getMiniCode: function() {
    var that = this;
    var productId = that.data.productId;
    var activityId = '';
    scene = productId + ";" + activityId;

    // 生成某品类的小程序码的话是不需要带商品id的
    if(that.data.productId){
      scene = scene + ";"+ that.data.source +";" + that.data.addNo + '';
    }else{
      scene = '***';
    }
    var data = {
      scene: scene,
      // 保洁类的路径
      // page: 'pages/recommend/oddjob/hourCleaning/hourCleaning'
      // 家电清洗类的路径
      // page: 'pages/recommend/oddjob/appliancesCleaning/appliancesCleaning'
      // 除尘除螨类的路径
      // page: 'pages/recommend/oddjob/mitesRemoval/mitesRemoval'
      // 某商品的路径
      // page: 'pages/recommend/oddjob/productDetail/productDetail'
      page: that.data.pagePath
    }
    console.log("生成小程序码传参：")
    console.log(data);
    util.doGet("/weiXin/productMiniCode", data, function(res) {
      console.log("res生成的小程序码:")
      console.log(res)
      that.setData({
        miniCodeSrc: res,
      })
      wx.hideLoading()
      // wx.getImageInfo({
      //   src: res,
      //   success(img) {
      //     console.log("img:")
      //     console.log(img)
      //     that.createPoster(img.path);
      //     that.setData({
      //       maskHidden: true
      //     });
      //   }
      // })

    })
  },

  // // //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  // // createPoster: function(miniCodePic) {
  // //   var that = this;
  // //   var context = wx.createCanvasContext('mycanvas');
  // //   context.setFillStyle("#fff")
  // //   context.fillRect(0, 0, 375, 667)

  // //   var topFontPic = "/image/img-share-fontTop.png"
  // //   var bottomFontPic = "/image/img-share-fontBottom.png"
  // //   // var miniCodePic = ""

  // //   //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
  // //   //不知道是什么原因，手机环境能正常显示
  // //   context.drawImage(productPic, 28, 130, 320, 359);

  // //   context.drawImage(headPic, 24, 52, 41, 41);
  // //   context.drawImage(topFontPic, 81, 49, 236, 41);
  // //   //不知道是什么原因，手机环境能正常显示
  // //   // context.save(); // 保存当前context的状态


  // //   //绘制右下角扫码提示语
  // //   context.drawImage(bottomFontPic, 142, 545, 200, 65);
  // //   //绘制左下角二维码
  // //   context.drawImage(miniCodePic, 34, 524, 98, 98);

  // //   context.draw(true, that.setCanvasPath);

  // //   //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
  // //   // setTimeout(function () {

  // //   // }, 2000);
  // // },

  // // setCanvasPath: function(e) {
  // //   var that = this
  // //   wx.canvasToTempFilePath({
  // //     canvasId: 'mycanvas',
  // //     success: function(res) {
  // //       wx.hideLoading()
  // //       var tempFilePath = res.tempFilePath;
  // //       console.log("生成小程序码的路径：")
  // //       console.log(tempFilePath)
  // //       that.setData({
  // //         imagePath: tempFilePath,
  // //         canvasHidden: true
  // //       });
  // //     },
  // //     fail: function(res) {
  // //       console.log(res);
  // //     }
  // //   });
  // // },

  // // //点击保存到相册
  // // baocun: function() {
  // //   var that = this
  // //   wx.saveImageToPhotosAlbum({
  // //     filePath: that.data.imagePath,
  // //     success(res) {
  // //       wx.showModal({
  // //         content: '图片已保存到相册，赶紧晒一下吧~',
  // //         showCancel: false,
  // //         confirmText: '好的',
  // //         confirmColor: '#333',
  // //         success: function(res) {
  // //           if (res.confirm) {
  // //             /* 该隐藏的隐藏 */
  // //             that.setData({
  // //               maskHidden: false
  // //             })
  // //           }
  // //         },
  // //         fail: function(res) {}
  // //       })
  // //     }
  // //   })
  // },


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