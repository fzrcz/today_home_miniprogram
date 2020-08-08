// pages/order/evaluate/evaluate.js
const app = getApp();
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    maxPicNum: 8,
    assesslist:[
      // {name:'差',img:'/image/assess_1.png',checkedimg:'/image/assess-1.png'},
      // {name:'一般',img:'/image/assess_2.png',checkedimg:'/image/assess-2.png'},
      // {name:'还不错',img:'/image/assess_3.png',checkedimg:'/image/assess-3.png'},
      // {name:'十分满意',img:'/image/assess_4.png',checkedimg:'/image/assess-4.png'},
      // {name:'强烈推荐',img:'/image/assess_5.png',checkedimg:'/image/assess-5.png'}
      {name:'差',img:'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/miniapp/assess_1.png',checkedimg:'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/miniapp/assess-1.png'},
      {name:'一般',img:'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/miniapp/assess_2.png',checkedimg:'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/miniapp/assess-2.png'},
      {name:'还不错',img:'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/miniapp/assess_3.png',checkedimg:'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/miniapp/assess-3.png'},
      {name:'十分满意',img:'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/miniapp/assess_4.png',checkedimg:'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/miniapp/assess-4.png'},
      {name:'强烈推荐',img:'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/miniapp/assess_5.png',checkedimg:'https://jrdj.oss-cn-shenzhen.aliyuncs.com/home2.0/miniapp/assess-5.png'}
    ],
    eveluatelist:[
      {name:'着装整体形象佳',check:false},
      {name:'  工具齐全整洁  ',check:false},
      {name:'  服务专业流畅  ',check:false},
      {name:'   服务态度好    ',check:false},
      {name:'未有迟到早退现象',check:false},
    ]

    // 服务态度好,衣着整洁,认真仔细,准时上工,服务质量高
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    // console.log("评价页，onload大小订单的id及角标：")
    // console.log(options.orderId)
    // console.log(options.orderDetailId)
    var index = options.serveIndex;
    // console.log(index)
    that.setData({
      orderDetailId: options.orderDetailId,
      orderId: options.orderId,
    })
    // 去获取当前订单的信息，回填到页面上
    var data = {
      id: that.data.orderId,
      platform: 'miniapp',
    }
    util.doGet("/business/orders/queryList", data, function(res) {
      wx.hideLoading();
      console.log("查询订单的评价内容，回填到页面上：")
      console.log(res);
      // 把商品的banner图展示出来
      that.setData({
        product: res.data[0].product[0],
      })
      var _obj = {};
      var status = 0;
      var concent = '';
      var imgPathList = [];
      var subDataArr = [];

      // 把保洁或零工的businessTypeId存起来，在发表评价的时候，根据这个来区分是否传detailId
      that.setData({
        businessTypeId: res.data[0].businessTypeId,
      })

      var subDataArr = res.data[0].checkList;
      // that.setData({
      //   subDataList: subDataArr,
      // })
      // 此种情况为家维的情况
      if (res.data[0].businessTypeId != 6) {
        // 如果订单状态为 完成，则回填
        if (res.data[0].orderStatusName == '完成') {
          _obj.curHdIndex = res.data[0].orderEvaluateList[0].score;
          status = res.data[0].orderStatusName;
          status: '完成';
          concent = res.data[0].orderEvaluateList[0].discuss;
          // 把图片的路径存到数组，setData到imgUrls
          var imgFileList = res.data[0].orderEvaluateList[0].orderEvaluateFiles;

          if(res.data[0].orderEvaluateList[0].time < '2020-02-05 23:59:59'){
            subDataArr = res.data[0].orderEvaluateList[0].checkList;
          }else{
            subDataArr = res.data[0].orderEvaluateList[0].checkNewList;
          }
          // subDataArr = res.data[0].orderEvaluateList[0].checkList;

          for (var i = 0; i < imgFileList.length; i++) {
            imgPathList.push(imgFileList[i].path);
          }
        }
        // 此种情况为家务的情况
      } else if (res.data[0].businessTypeId == 6) {
        if (res.data[0].hourlyWorkersServe[index].orderStatus == '完成') {
          _obj.curHdIndex = res.data[0].hourlyWorkersServe[index].orderEvaluateList[0].score;
          var imgFileList = res.data[0].hourlyWorkersServe[index].orderEvaluateList[0].orderEvaluateFiles;
          status = res.data[0].hourlyWorkersServe[index].orderStatus;
          concent = res.data[0].hourlyWorkersServe[index].orderEvaluateList[0].discuss;
          // 评价的时间跟上线时间对比一下，在上线之前评价的，那么展示旧的评价标签，否则展示新的评价标签
          if(res.data[0].hourlyWorkersServe[index].orderEvaluateList[0].time < '2020-02-05 23:59:59'){
            subDataArr = res.data[0].hourlyWorkersServe[index].orderEvaluateList[0].checkList;
          }else{
            subDataArr = res.data[0].hourlyWorkersServe[index].orderEvaluateList[0].checkNewList;
          }

          for (var i = 0; i < imgFileList.length; i++) {
            imgPathList.push(imgFileList[i].path);
          }
        }
      }

      that.setData({
        tabArr: _obj,
        // 把订单状态塞进来，用于判断在页面是否展示placeholder的内容
        status: status,
        // 评论内容
        concent: concent,
        // 把图片信息塞进来，展示已经上传的照片
        imgUrls: imgPathList,
        subDataList: subDataArr,
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  // 点击发布
  confirm: function() {
    var that = this
    var orderDetailId = that.data.orderDetailId
    var orderId = that.data.orderId
    var imgUrls = that.data.imgUrls
    var curHdIndex = that.data.tabArr.curHdIndex
    var concent = that.data.concent
    var prescription = that.data.imgUrls
    var files = []
    if(!curHdIndex){
      wx.showToast({
        title: '请进行星级评价，谢谢！',
        icon: 'none'
      })
      return;
    }

    for (var i = 0; i < prescription.length; i++) {
      console.log(prescription[i]);
      var base64 = wx.getFileSystemManager().readFileSync(prescription[i], "base64")
      files.push(base64)
    }

    // 拿到标签数组，转为字符串
    // var subDataArr = that.data.subDataArr;
    var subDataArr = that.data.eveluatelistArr;
    var tagString = '';
    for (var i in subDataArr) {
      tagString += subDataArr[i].name + ','
    }
    // console.log('字符串');
    // console.log(tagString);
    // 零工不传detailid
    // 保洁传
    // console.log(that.data.concent + "****")
    if (that.data.businessTypeId == 6) {
      // console.log(that.data.concent + "///")
      var data = {
        orderDetailId: orderDetailId,
        orderId: orderId,
        score: curHdIndex,
        discuss: concent,
        files: files,
        tags: tagString,
      }
    }
    if (that.data.businessTypeId != 6) {
      var data = {
        orderId: orderId,
        score: curHdIndex,
        discuss: concent,
        files: files,
        tags: tagString,
      }
    }

    // console.log('----------------------');
    // console.log(that.data.subDataList);
    // console.log(that.data.subDataArr);
    console.log("发表评论，传参：", data);

    // return;
    util.doPost('',"/business/orders/orderEvaluate", data, function(res) {
      console.log("发表后，返回：")
      console.log(res)
      if (res.success) {
        wx.showToast({
          title: '发表成功！',
          icon: 'success',
          duration: 1000,
          success: function() {
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1000) //延迟时间
          }
        })
      }
    })
  },

  // 选择星星
  chooseicon: function(e) {
    var strnumber = e.target.dataset.id;
    var _obj = {};
    _obj.curHdIndex = strnumber;
    this.setData({
      tabArr: _obj
    });
    console.log(strnumber)
  },
  // 获取评论的内容
  contentInput: function(e) {
    var that = this;
    that.setData({
      concent: e.detail.value,
    })
    console.log("评论内容:" + e.detail.value);
  },

  //快捷评论
  checkbox: function(e) {
    var index = e.currentTarget.dataset.index; //获取当前点击的下标
    // var checkboxArr = this.data.subDataList; //选项集合
    var eveluatelist = this.data.eveluatelist; //选项集合
    console.log(index)
    eveluatelist[index].check = !eveluatelist[index].check;
    // checkboxArr[index].check = !checkboxArr[index].check; //改变当前选中的checked值
    this.setData({
      // subDataList: checkboxArr,
      eveluatelist: eveluatelist,
    });
    var subDataArr = []
    var eveluatelistArr = []
    // for (var i in checkboxArr) {
    //   if (checkboxArr[i].check == true) {
    //     subDataArr.push(checkboxArr[i])
    //     this.setData({
    //       subDataArr: subDataArr
    //     })
    //   }
    // }
    for (var i in eveluatelist) {
      if (eveluatelist[i].check == true) {
        eveluatelistArr.push(eveluatelist[i])
        this.setData({
          eveluatelistArr: eveluatelistArr
        })
      }
    }
  },
  switchSelect(e) {
    var checkValue = e.detail.value;
    this.setData({
      checkValue: checkValue
    });

  },

  //图片上传
  eveluateImg: function() {
    var that = this
    var canUpLoadPic = that.data.maxPicNum - that.data.imgUrls.length
    console.log(canUpLoadPic)
    if (canUpLoadPic <= 0) {
      wx.showToast({
        title: '最多支持' + that.data.maxPicNum + '张图上传哦',
        icon: 'none',
        mask: true
      })
      return;
    }
    wx.chooseImage({
      count: canUpLoadPic,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          imgUrls: that.data.imgUrls.concat(tempFilePaths)
        })
      }
    })
  },

  upvideo(e){
    wx.showModal({
      content: '拍摄或选择的视频不得超过30秒',
      showCancel: false,
      success: (r) => {
        if(r.confirm){
          wx.chooseVideo({
            maxDuration: 30,
            success(res) {
              console.log(res.tempFilePath)//视频地址
              console.log(res.duration)//视频长度
              console.log(res.size)//视频大小
              //上传视频
              wx.uploadFile({
                url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
                filePath: res.tempFilePath,
                name: 'video',
                formData: {
                  'user': 'test'
                },
                success (res){
                  const data = res.data
                }
              })
            }
          })
        }
      }
    })
  },
  
  // 移除图片
  removePic: function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除此张图片吗？',
      success: function(res) {
        //点击确定
        if (res.confirm) {
          console.log('确定删除：')
          var index = e.currentTarget.dataset.index;
          var imgUrls = that.data.imgUrls;
          console.log("index为：" + index);
          console.log(that.data.imgUrls)
          imgUrls.splice(index, 1);
          that.setData({
            imgUrls: imgUrls,
          })
        } else {
          console.log('取消退出')
          return;
        }
      }
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

})