// pages/order/sign/sign.js

var context = null;
var isButtonDown = false;
var arrx = [];
var arry = [];
var arrz = [];
var canvasw = 0;
var canvash = 0;

Page({
  data: {
    src: "",
    img: "",
    rpx: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('签名的onload')
  },
  onShow: function(options) {
    console.log('签名的onshow')
    //清除画布
    arrx = [];
    arry = [];
    arrz = [];
    context.draw(false);
  },

  canvasIdErrorCallback: function(e) {
    // console.error(e.detail.errMsg)
  },
  //开始
  canvasStart: function(event) {
    isButtonDown = true;
    arrz.push(0);
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);

  },

  onLoad: function(options) {
    var that = this
    // 使用 wx.createContext 获取绘图上下文 context
    context = wx.createCanvasContext('canvas');
    context.beginPath()
    context.setStrokeStyle('#f60');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
    context.draw();
  },

  //过程
  canvasMove: function(event) {
    var that = this
    if (isButtonDown) {
      arrz.push(1);
      // console.log(event)
      arrx.push(event.changedTouches[0].x);
      arry.push(event.changedTouches[0].y);
    };

    for (var i = 0; i < arrx.length; i++) {
      if (arrz[i] == 0) {
        context.moveTo(arrx[i], arry[i])
      } else {
        context.lineTo(arrx[i], arry[i])
      };

    };
    context.clearRect(0, 0, canvasw, canvash);
    context.setStrokeStyle('#f60');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
    context.stroke();

    context.draw(false);
  },
  // 点击保存图片
  clickMe: function() {
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      fileType: 'jpg',
      success: function(res) {

        console.log('success****:')
        console.log(res)
        let pic = res.tempFilePath;
        console.log('pic****:')
        console.log(pic)

        // 调用接口把图片保存到后台，然后返回上一页

        wx.saveImageToPhotosAlbum({
          filePath: pic,
          success(res) {

            console.log('保存：')
            console.log(res)
            wx.hideLoading();
            wx.showToast({
              title: '保存成功',
            });
            let pages = getCurrentPages();
            //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
            let prevPage = pages[pages.length - 2];

            prevPage.setData({
              signStatus: true,
              signFilePath: pic,
            })
            wx.navigateBack({
              delta: 1,
            })

            // //存入服务器
            // wx.uploadFile({
            //   url: 'a.php', //接口地址
            //   filePath: res.tempFilePath,
            //   name: 'file',
            //   formData: {                                 //HTTP 请求中其他额外的 form data 
            //     'user': 'test'
            //   },
            //   success: function (res) {
            //     console.log(res);

            //   },
            //   fail: function (res) {
            //     console.log(res);
            //   },
            //   complete: function (res) {
            //   }
            // });
          },
          fail() {
            wx.hideLoading()
          }
        })
      }
    })
  },
  canvasEnd: function(event) {
    isButtonDown = false;
  },
  cleardraw: function() {
    //清除画布
    arrx = [];
    arry = [];
    arrz = [];
    context.draw(false);
  },

})