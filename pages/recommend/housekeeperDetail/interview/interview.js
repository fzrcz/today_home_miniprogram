const app = getApp();
var utils = require("../../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //别人的消息
    newsList: [],
    //输入框的值
    input: null,
    //对方id
    receiver: '',
    //视屏播放
    showCode: false,
    //消息归属
    type:'other'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //接收人
    var receiver = options.receiver
    var receiverType = options.receiverType
    //var receiver = '1000';
    //var receiverType = 'employer';
    that.setData({
      receiver: receiver,
      receiverType: receiverType,
      dispatcher:app.data.accountId,
      dispatcherType:app.data.userRole
      ////housekeeper 为阿姨，  employer 为雇主
      //dispatcher:'1',
      //dispatcherType:'housekeeper'
    })
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          bodyHeight: res.windowHeight - 40,
          bodyWidth: res.windowWidth
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  //视频错误
  videoErrorCallback: function (e) {
    // console.log('视频错误信息:')
    // console.log(e.detail.errMsg)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    //建立连接
    this.connect();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.closeSocket();
    // console.log('听页面隐藏');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.closeSocket();
    // console.log('页面卸载');
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

  },
  //握手链接
  connect:function(){
    var that = this;
    wx.connectSocket({
      url: app.data.urlSocket + '?accountId=' + that.data.dispatcher + '&accountType=' + that.data.dispatcherType,
      fail(err) {
        // console.log(err);
        if (err) {
          wx.showToast({
            title: 'Socket链接失败！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    //连接成功
    wx.onSocketOpen(function () {
      // console.log('连接成功');
    })
    //接收数据
    wx.onSocketMessage(function (data) {
      if (data.data !='sendError'){
        var obj = JSON.parse(data.data);
        // console.log('他人');
        obj['type'] = 'other';
        that.data.newsList.push(obj);
        that.setData({
          newsList: that.data.newsList
        })
        // console.log(that.data.newsList);
      }
    })
    //连接失败
    wx.onSocketError(function () {
      console.log('websocket连接失败！');
    })
  },
  

  //选择视频
  chooseVideo: function () {
    var that = this
    wx.chooseVideo({
      success: function (res) {
        that.setData({
          file: res.tempFilePath,
        })
        var map = {
          dispatcher: that.data.dispatcher,
          dispatcherType: that.data.dispatcherType,
          receiver: that.data.receiver,
          receiverType: that.data.receiverType,
          messageType: 'chat-video',
          url: '/pages/recommend/housekeeperDetail/interview/interview?receiver=' + that.data.dispatcher + '&receiverType' + that.data.dispatcherType
        }
        console.log(map);
        utils.doPostImgData("/platAccounts/message", that.data.file, map, function (res) {
          // console.log(res);
          var obj = JSON.parse(res);
          // console.log(that.data.dispatcher );
          // console.log(obj.receiver);
          if (that.data.dispatcher == obj.dispatcher) {
            // console.log('自己');
            obj['type'] = 'own';
            that.data.newsList.push(obj);
            that.setData({
              newsList: that.data.newsList
            })
          }
        })
      }
    })
  },

  //输入值监听
  bindChange: function (res) {
    this.setData({
      input: res.detail.value
    })
  },

  //发送消息
  send: function () {
    var that = this;
    //参数
    var map = {
      dispatcher:app.data.accountId,
      dispatcherType:app.data.userRole,
      receiver:that.data.receiver,
      receiverType:that.data.receiverType,
      messageType:'chat-text',
      url: '/pages/recommend/housekeeperDetail/interview/interview?receiver=' + that.data.dispatcher + '&receiverType' + that.data.dispatcherType,
      message:that.data.input
    }
    wx.sendSocketMessage({
      data: JSON.stringify(map),
      success: function (e) {
        map["type"] = 'own';
        that.data.newsList.push(map);
        that.setData({
          newsList: that.data.newsList
        })
        // console.log(that.data.newsList);
      },
      fail: function (e) {
        console.log('失败');
        that.connect();
        send.send();
      },
      complete: function (e) {

      }
    })
  },

  //返回
  back:function(){
    wx.closeSocket();
    // console.log('页面返回');
  },

  //打开视屏
  openVideo:function(e){
    var that =this;
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      showCode: true,
      videoUrl: index
    })
  },

  //关闭视屏
  closeVideo: function () {
    var that = this;
    that.setData({
      showCode: false
    })
  },

  // 获取hei的id节点然后屏幕焦点调转到这个节点
  bottom: function () {
    wx.createSelectorQuery().select('#aa').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      console.log(rect.bottom);
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },

  //获取时间
  getDate() {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (month < 9) {
      month = '0' + (month + 1);
    } else {
      month = month + 1;
    }
    if (day <10) {
      day = '0' + day;
    } 
    if (hour < 10) {
      hour = '0' + hour;
    } 
    if (minute < 10) {
      minute = '0' + minute;
    } 
    if (second < 10) {
      second = '0' + second;
    } 
    var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    console.log(dateTime)
    this.setData({
      dateTime: dateTime,
    });
  }
})