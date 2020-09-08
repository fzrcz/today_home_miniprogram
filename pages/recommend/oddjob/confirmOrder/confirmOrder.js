var util = require('../../../../utils/util.js')
const app = getApp();
let animationShowHeight = 600; //动画偏移高度

Page({
  /**
   * 页面的初始数据
   */
  data: {
    companyId: '',
    serbuslist:[
      { serbusname: '今日到家-01', serbusimg: '', serbusgas: '1', serbuscheck:0},
      { serbusname: '今日到家-02', serbusimg: '', serbusgas: '2', serbuscheck: 1 },
    ],
    defaultarea:88,//默认面积
    buyCnt: 1,
    min: 1,
    bornDay: '请选择日期',
    // currentDate: "",
    selectCoupon: '请选择优惠券',
    imgUrl1: '/image/add.png',
    shopVoucher: true, // 是否展示购物凭证，true：展示 false.不展示
    // 遮罩层变量
    animationData: "",
    showPaymentStatus: false,
    paymentList: [{
        paymentName: "微信支付",
        value: 0,
        id: 0,
        checked: true
      },
      {
        paymentName: "电子券余额",
        value: 1,
        id: 1,
        checked: false
      }
    ],
   paymentName:'微信支付',
   //total:0,//无优惠的总价格
   checkindex:1,//支付方式的单选锁定
    couponsLimit: 0,
    totalFee: 0,//优惠券余额扣除之后要支付
    payIndex: 0,
    imgBase64: '',//购物凭证
    vouchaertip: '已选择其他优惠,购物凭证不可用',
    todaytime:'',
    virusKillArea: '',
    fourthValue:true,
    // 预约的时间点，病毒消杀需要选时间点，然后拼接在预约时间后边，没选时间点，默认00:00：00，注意00前边有个空格
    detailClock: " 00:00:00"
  },
  bindKeyInput:function(e){
    console.log(e)
  },
  getWindowHeight: function() {
    var _this = this
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },
  // 显示遮罩层  
  showPayment: function(e) {
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
      showPaymentStatus: true //显示遮罩层
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1)
  },
  // 隐藏遮罩层  
  hidePayment: function(e) {
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
        showPaymentStatus: false
      })
    }.bind(this), 200)
  },
  paymentChange: function(e) {
    console.log(e)
    var payIndex = e.detail.value
    var paymentList = this.data.paymentList
    for (var i = 0; i < paymentList.length; i++) {
      if (payIndex == i) {
        this.data.paymentList[i].checked = true
        var paymentName = paymentList[i].paymentName
        this.setData({
          paymentName: paymentName
        })
      } else {
        this.data.paymentList[i].checked = false
      }
    }
    if(payIndex==1){
      this.setData({
        shopVoucher: false,
        payIndex:1,
        totalPrice: (+this.data.totalPrice + this.data.couponsLimit)
      })
      if (this.data.cardLeftBalance < this.data.totalPrice){
        this.setData({
          cardPrice: +this.data.cardLeftBalance,
          totalFee: (+this.data.totalPrice - this.data.cardLeftBalance).toFixed(2)
        })
      }
      if (this.data.cardLeftBalance >= this.data.totalPrice){
        this.setData({
          cardPrice: this.data.totalPrice,
          totalFee: 0
        })
      }
    }else{
      this.setData({
        shopVoucher: true,
        payIndex: 0,
        total: (+this.data.totalPrice - this.data.couponsLimit),
        totalPrice: (+this.data.totalPrice - this.data.couponsLimit).toFixed(2),
      })
    }
    this.setData(this.data)
    this.hidePayment
    this.setData({
      showPaymentStatus:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    var data = {

    }
    util.doGet("/accountTraceRecord/leftBalance/" + app.data.accountId + "/1", data, function (res) {
      // console.log('账户余额的冻结余额：');
       console.log(res);
      if (res.success) {
        that.setData({
          freezeBalance: res.data.accountWallet.freezeBalance,
          balance: res.data.accountWallet.balance,
          //电子券余额
          cardLeftBalance: res.data.accountWallet.cardLeftBalance,
          // 最低提现额度
          startAmount: res.data.startAmount,
        })
      }
    })
    console.log(options)
    that.getWindowHeight()
    // 获取时间
    // var currentDate = util.getCurrentDate(new Date)
    // this.setData({
    //   currentDate: currentDate
    // })
    var totalPriceMemo = options.price; // 不在当前页面的时候再把合计价格赋给初始价格，防止每次选优惠券就减掉优惠券的价钱
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
    console.log(totalPriceMemo)
    var totalPrice = options.price;
    if (options.productId == '1') {
      totalPrice = totalPrice ;
      totalPriceMemo = totalPriceMemo ;
      // return
      
    }
    this.setData({
      firstValue: false,
      secondValue: false,
      thirdValue: true,
      buyCnt: 40,
      productId: options.productId,
      businessTypeId: options.businessTypeId,
      showType: options.showType,
      activityId: options.activityId,
      productName: options.productName,
      serviceNo: options.serviceNo,
      price: options.price,
      //total:(+totalPrice).toFixed(2),
      totalPrice: (+totalPrice).toFixed(2),
      totalPriceMemo: totalPriceMemo
    })

    // 加载地址
    that.loadAddress();

    // 获取优惠券
    // var data = {
    //   accountId: app.data.accountId,
    // }
    // util.reqLoading(app.globalData.apiUrl, 'MS00203', data, 'GET', '加载中...', function (res) {
      
    // var data = {
    //   accountId: app.data.accountId,
    //   type: 0, // 1.系统发放 2.手点击领取
    //   couponsBatchId: app.globalData.couponsBatchIdsList,
    // }
    // util.reqLoading(app.globalData.apiUrl, 'MS00205', data, 'GET', '加载中...', function(res) {

      // console.log("下单onload获取优惠券，返回：");
      // console.log(res);
      // success: {
        that.getCouponsList(options);
      // }
    // })
    // if(this.data.productId == 1 || this.data.businessTypeId == 7) {
    //   this.setData({
    //     min: 2,
    //     buyCnt: 2
    //   })
    //   console.log('设置min')
    //   console.log(this.data.min)
    // }
  },
  // 获取该地址所属区的店铺的方法
  getLocationShop: function(){
    var that = this;
    var data = {
      area: that.data.address.areaId,
      // 纬度
      lat: that.data.address.latitude,
      // 经度
      lng: that.data.address.longitude,
    }
    console.log("获取店铺，传参：", data)
    util.reqLoading(app.globalData.apiUrl, 'MS01101', data, 'POST', '加载中...', function (res) {
      console.log("获取的店铺：", res);
      that.setData({
        storeList: res.data[0].storeList,
      })
    })
  },

  // 选择商家
  chooseStore: function (options){
    var that = this;
    var index = options.currentTarget.dataset.index
    var storeId = options.currentTarget.dataset.storeid
    var storeList = that.data.storeList
    for (let i in storeList){
      storeList[i].selected = false
      // that.setData({
      //   storeList: storeList
      // })
    }
    storeList[index].selected = true
    that.setData({
      storeList: storeList,
      storeId: storeId,
    })
  },
  // 查询优惠券
  getCouponsList: function(options) {
    var that = this;
    // 查询一下有没有可用的优惠券，没有的话，显示暂无优惠券可用
    // MS00201获取优惠券列表
    var data = {
      accountId: app.data.accountId,
      productId: options.productId,
    }
    util.reqLoading(app.globalData.apiUrl, 'MS00202', data, 'POST', '加载中...', function(res) {
      console.log("查询" + "优惠券");
      console.log(res);
      var couponList = res.data;
      if (couponList.length != 0) {

        var canUserCouponList = [];
        var canNotUserCouponList = [];
        var num = 0; // 有一张可用就加1
        for (var i in couponList) {
          if (couponList[i].flag == true) {
            num++;
            canUserCouponList[i] = couponList[i];
          } else {
            canNotUserCouponList[i] = couponList[i];
          }
        }
        that.setData({
          isCanUse: true, // 有可用的，根据这个变为红色
          selectCoupon: num + '张可用',
        })
        if (canUserCouponList.length == 0) {
          that.setData({
            isCanUse: false,
            selectCoupon: '暂无优惠券可用',
          })
        }
        that.setData({
          canUserCouponList: canUserCouponList,
          canNotUserCouponList: canNotUserCouponList,
        })
      } else {
        that.setData({
          isCanUse: false,
          couponList: [],
          selectCoupon: '暂无优惠券可用',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //补全0
  zero: function (i) {
    return i >= 10 ? i : '0' + i;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  
  onShow: function(options) {
    // debugger
    //获取当天时间
    let DATE =new Date(),
      year = DATE.getFullYear(),
      month = DATE.getMonth() + 1,
      date = DATE.getDate(),
      select = year + '-' + this.zero(month) + '-' + this.zero(date);
    this.setData({
      companyId: wx.getStorageSync('selectCompany').id,
      todaytime: select,
      // 每次返回页面的时候，把立即支付变成可点击的
      crowdStatus: false,
    })
    
    var that = this;
    // 从立即支付回到页面，开关变为false
    // 如果是翻新改造类型或开荒保洁，默认面积40平米，但是厨卫翻新改造不要面积
    // if (that.data.businessTypeId == "13" || that.data.productId == 69){
    if ((that.data.showType == "13" || that.data.productId == 69) && that.data.productId != 74){
      that.setData({
        firstValue: false,
        secondValue: false,
        thirdValue: true,
        buyCnt: 40,
        total: that.data.price * 40,
        totalPrice: that.data.price * 40
      })
    }else{
        that.setData({
          firstValue: false,
          secondValue: false,
          thirdValue: false,
          nowPay: false,
          buyCnt: 1,
        })
      
    }
    if(this.data.productId == 1) {
      that.setData({
        min: 2,
        buyCnt: 2,
        totalPrice: (+this.data.totalPrice*2).toFixed(2)
      })
    } 
    

    var addrid = wx.getStorageSync("addrid");
    console.log("addrid为：", addrid);
    wx.removeStorageSync("addrid")
    // 在选择地址页面，有选择地址，进入到这个if
    if (addrid) {
      var that = this
      util.doBaseGet("/account/" + addrid + "/serveAddress", function(res) {
        console.log("存地址之后，返回：", res)
        that.setData({
          address: res
        })
        // 去查询该地址所属区的店铺
        that.getLocationShop();
      })
      // 在选择地址页面，没选地址，直接返回回来，判断有没有默认的地址
    }else if(that.data.address){
      that.getLocationShop();
    }
    that.setData({
      bornDay: that.data.bornDay
    })
    console.log(that.data)
    var targetAmount = that.data.targetAmount;
    var couponsLimit = that.data.couponsLimit == undefined ? 0 : that.data.couponsLimit;
    var name = that.data.name;
    var couponsNo = that.data.couponsNo;
    var myCouponsId = that.data.myCouponsId;
    that.setData({
      businessTypeId: that.data.businessTypeId
    })

    // console.log("onshow编号：" + couponsNo);
    // console.log("onshow优惠的金额：" + couponsLimit);
    // console.log("onshow满多少的金额：" + targetAmount);
    // console.log('次数' + that.data.serviceNo)
    //次数商品不予使用电子券和凭证
    if (that.data.serviceNo != 1 && that.data.serviceNo != 'null' && that.data.serviceNo != ''){
      if(that.data.businessTypeId == '18') {
        that.setData({
          shopVoucher:true
        })
      } else {
        that.setData({
          shopVoucher:false,
          checkindex: 0,
          checktip: '(该商品优惠券不可用)',
          vouchaertip: '该商品购物凭证不可用'
        })
      }
      
    }
    //未选择优惠券
    if (!couponsLimit) {
      if (that.data.selectCoupon.indexOf('-') >= 0) {
        that.setData({
          selectCoupon: '请选择优惠券',
          checkindex: 1,
          shopVoucher:true,
          couponsLimit:0
        })
      }

    } else if (couponsNo != undefined){
      this.setData({
        shopVoucher: false,
        checkindex:0,
        checktip:'(已选择其他优惠，电子券不可用)'
      })
    }
    that.setData({
      targetAmount: targetAmount,
      couponsLimit: couponsLimit,
      name: name,
      couponsNo: couponsNo,
      myCouponsId: myCouponsId,
      //total: (+that.data.totalPrice).toFixed(2),
      totalPrice: (+that.data.totalPrice).toFixed(2),
    })
    if (targetAmount && couponsLimit && name) {
      that.setData({
        selectCoupon: '-￥' + couponsLimit,
      })
    }
    // console.log("总价：" + that.data.totalPrice);
    // console.log("优惠价：" + couponsLimit);
    // console.log("相减：");
    // console.log((that.data.totalPrice - couponsLimit).toFixed(2));
    if (that.data.totalPrice >= that.data.targetAmount) {
      that.setData({
        //total: that.data.totalPrice.toFixed(2),
        totalPrice: (that.data.totalPrice - couponsLimit).toFixed(2),
      })
    }

    // 读取病毒消杀商品的系数
    if(that.data.showType == 6){
      that.getVirusKillValue();
    }

  },
  // 上传购物凭证
  chooseImg1: function(e) {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        _this.setData({
          imgUrl1: res.tempFilePaths[0],
          // 是否上产凭证，上传了，把右上角的x显示出来
          isUploadPic: true,
        })

        var pre = 'data:image/jpeg;base64,';
        var base64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
        _this.setData({
          imgBase64: base64,
          shopVoucher:true,
          checkindex:0,
          checktip: '(已选择其他优惠，电子券不可用)'
        })
      }
    })
  },

  // 关闭购物凭证
  closePic: function(){
    var that = this;
    that.setData({
      imgUrl1: '/image/add.png',
      isUploadPic: false,
      imgBase64: '',
    })
  },

  // 选择日期
  // bindDateChange(e) {
  //   let that = this;
  //   console.log('选择的日期：' + e.detail.value)
  //   console.log("商品id：" + that.data.productId)
  //   // 若是2次4小时258的商品，不让选择1月份的预约日期
  //   if (that.data.productId == 67 && e.detail.value > '2019-12-31' && e.detail.value < '2020-02-01'){
  //     console.log("1111")
  //     wx.showToast({
  //       title: '暂时不能预约1月份的日期',
  //       icon:'none'
  //     })
  //     return;
  //   }

  //   // 判断选择的日期是否是周六日，若是，则显示爆满
  //   var weekArray = new Array("日", "一", "二", "三", "四", "五", "六");

  //   // var date = '2019/10/31';  //※※※注意，日期格式一定要为xxxx/xx/xx,别的格式Android 和iOS有兼容问题。
  //   var date = e.detail.value;
  //   var week = weekArray[new Date(date).getDay()];  //注意此处必须是先new一个Date
  //   // console.log("周几：" + week)
  //   if (week == '六' || week == '日') {
  //     that.setData({
  //       crowdStatus: true,
  //       crowd: '爆满',
  //     })
  //   } else {
  //     that.setData({
  //       crowdStatus: false,
  //       crowd: '空闲',
  //     })
  //   }
  //   that.setData({
  //     bornDay: e.detail.value,
  //   })
  // },
  // 选择上午下午
  selectValue: function(e) {
    var that = this;
    var timeSlot = e.currentTarget.dataset.value;
    // console.log(timeSlot);
    if (timeSlot == '上午') {
      that.setData({
        morning: true,
        noon: false,
        timeSlot: '上午',
      })
    }
    if (timeSlot == '下午') {
      that.setData({
        morning: false,
        noon: true,
        timeSlot: '下午',
      })
    }
  },

  //选择面积（地板养护）
  houseSize:function(e){
    const value = +e.currentTarget.dataset.value;
    console.log(value)
    if (value==120){
      this.setData({
        firstValue: true,
        secondValue: false,
        thirdValue: false,
        buyCnt: value,
        total: this.data.price * value,
        totalPrice: (this.data.price * value).toFixed(2)

      })
    } else if (value == 80) {
      this.setData({
        firstValue: false,
        secondValue: true,
        thirdValue: false,
        buyCnt: value,
      total: this.data.price * value,
        totalPrice: (this.data.price * value).toFixed(2)
      })
    } else if (value == 40) {
      this.setData({
        firstValue: false,
        secondValue: false,
        thirdValue: true,
        buyCnt: value,
        total: this.data.price * value,
        totalPrice: (this.data.price * value).toFixed(2)
      })
    } else if (value == 150) {
      this.setData({
        fourthValue: true,
        totalPrice: parseFloat(this.data.price).toFixed(2),
        virusKillArea: "",
        houseSize: "150㎡及以下",
      })
    } else if (value == 160) {
      this.setData({
        firstValue: true,
        secondValue: false,
        thirdValue: false,
        buyCnt: value,
        total: this.data.price * value,
        totalPrice: (this.data.price * value).toFixed(2)

      })
    } else if (value == '120-160') {
      this.setData({
        firstValue: false,
        secondValue: true,
        thirdValue: false,
        buyCnt: value,
        total: this.data.price * value,
        totalPrice: (this.data.price * value).toFixed(2)
      })
    } else if (value == '120') {
      this.setData({
        firstValue: false,
        secondValue: false,
        thirdValue: true,
        buyCnt: value,
        total: this.data.price * value,
        totalPrice: (this.data.price * value).toFixed(2)
      })
    }
  },
// 改造区域
  reformArea:function(e){
    var that = this;
    const value = +e.currentTarget.dataset.value;
    if (value==1){
      that.setData({
        fourValue: true,
        fiveValue: false,
        reformArea: '厨房',
      })
    } else if (value == 2) {
      that.setData({
        fourValue: false,
        fiveValue: true,
        reformArea: '卫生间',
      })
    }
  },
  // 选择居家面积
  selectHouseSize: function(e) {
    var that = this;
    var value = e.currentTarget.dataset.value;
    // console.log(value);
    var aaa = e.detail.value;
    // console.log(aaa)
    if (value == '1') {
      that.setData({
        firstValue: true,
        secondValue: false,
        thirdValue: false,
        houseSize: '160㎡以上',
      })
    }
    if (value == '2') {
      that.setData({
        firstValue: false,
        secondValue: true,
        thirdValue: false,
        houseSize: '120-160㎡',
      })
    }
    if (value == '3') {
      that.setData({
        firstValue: false,
        secondValue: false,
        thirdValue: true,
        houseSize: '120㎡',
      })
    }
  },

  // 备注
  memoInput: function(e) {
    var that = this;
    console.log(e.detail.value);
    that.setData({
      memo: e.detail.value,
    })
  },

  // 选择优惠券
  chooseCoupon: function() {
    wx.navigateTo({  
      url: '/pages/recommend/oddjob/confirmOrder/chooseCoupon/chooseCoupon?productId=' + this.data.productId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("onhide");
    var that = this;
    var totalPrice = that.data.totalPriceMemo;
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    console.log(totalPrice)
    // 如果是点击立即支付隐藏的页面的话，就不必改价格了
    if (!that.data.nowPay) {
      console.log("^^^^######################################")
      that.setData({
        totalPrice: totalPrice,
      })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log("onunload");
    var that = this;
    // var totalPrice = that.data.totalPriceMemo
    // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
    // console.log(totalPrice)
    // that.setData({
    //   totalPrice: totalPrice,
    // })
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

  //默认地址
  loadAddress: function() {
    var that = this;
    util.doBaseGet("/accounts/" + app.data.accountId + "/serveAddress", function(res) {
      console.log('onload加载的地址：',res)

      that.setData({
        address: res
      })
      // 如果能加载出地址，则去查询该地址所属区的店铺
      if(res){
        that.getLocationShop();
      }
    })
  },

  toAddress: function() {
    wx.navigateTo({
      url: '/pages/recommend/commission/address/address',
    })
  },

  changeNum({
    detail
  }) {
    console.log(detail)
    //console.log(e)
    this.setData({
      buyCnt: detail.value,
      total: this.data.price * detail.value,
      totalPrice: (this.data.price * detail.value - this.data.couponsLimit).toFixed(2)
    })
    if (this.data.paymentName=='微信支付'){
      this.setData({
        totalFee: (this.data.price * detail.value - this.data.couponsLimit).toFixed(2),
        cardPrice: 0,
      })
    }else{
      this.setData({
        totalFee: (this.data.price * detail.value) - this.data.couponsLimit <= +this.data.cardLeftBalance ? 0 : +this.data.totalPrice - this.data.cardLeftBalance,
        cardPrice: (this.data.price * detail.value) - this.data.couponsLimit <= +this.data.cardLeftBalance ? this.data.totalPrice : this.data.cardLeftBalance
      })
    }
  },
  //面积输入获焦事件
  focusarea(e){
    this.setData({
      fourthValue: false,
    })
  },

  // 读取病毒消杀的面积，计算价钱
  virusKillAreaInput: function(e){
    var that = this;
    var virusKillArea = e.detail.value;
    that.setData({
      virusKillArea: virusKillArea,
      houseSize: virusKillArea,
    })
    if(virusKillArea > 150){
      var price =  parseFloat(that.data.price) + parseFloat((virusKillArea - 150) * that.data.virusKillValue);
      console.log("输入面积为：" + virusKillArea + "，价钱为：" + price)
      that.setData({
        totalPrice: price.toFixed(2),
        totalPriceMemo: price.toFixed(2),
        // buyCnt: virusKillArea,
      })
    }else{
      that.setData({
        totalPrice: parseInt(that.data.price).toFixed(2),
      })
    }
  },

  // 获取病毒消杀的系数
  getVirusKillValue: function(){
    var that = this;
    var data = {
      key: "virusKill",
    }
    util.reqLoading(app.globalData.apiUrl, 'MS00105', data, 'POST', '加载中...', function(res) {
      console.log("读取病毒消杀系数，返回：", res)
      console.log(res.data[0].value);
      that.setData({
        virusKillValue: res.data[0].value,
      })
    })
  },

  //选择时间事件
  slider4change(e){
    var that = this;
    that.setData({
      detailClock: " " + e.detail.value + ":00:00"
    })
    console.log(`slider发生change事件，携带值为`, e.detail.value)
  },

  // 立即支付
  toPay: function(e) {
    var that = this;
    // 设置一个开关，点击立即支付的时候，不让下边的合计的价钱回到原价
    that.setData({
      nowPay: true,
      // 点击之后把按钮变灰掉
      crowdStatus: true,
    })

    // console.log(that.data.bornDay)
    // console.log(that.data.timeSlot)
    // console.log(that.data.houseSize)

    if (!that.data.address) {
      wx.showToast({
        title: '您还未选择地址！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    // if (that.data.businessTypeId == '6') {
    if (that.data.showType == '6' || that.data.showType == '18') {
      if (that.data.bornDay == '请选择日期') {
        wx.showToast({
          title: '您还未选择预约日期！',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      // 暂时去掉上下午的选择
      // if (!that.data.timeSlot) {
      //   wx.showToast({
      //     title: '您还未选择预约时间！',
      //     icon: 'none',
      //     duration: 2000
      //   })
      //   return false;
      // }
      if (!that.data.houseSize && that.data.productId != 69 && that.data.productId != 81 && that.data.productId != 82) {
        wx.showToast({
          title: '您还未选择居家面积！',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    if (!that.data.reformArea && that.data.productId == 74) {
      wx.showToast({
        title: '您还未选择改造区域！',
        icon: 'none',
        duration: 2000
      })
      // 点击之后把按钮变成可支付的
      that.setData({
        crowdStatus: false,
      })
      return false;
    }

    // if (!that.data.storeId) {
    //   wx.showToast({
    //     title: '您还未选择服务店铺！',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // }

    // 如果是病毒消杀，如果用户下单没有选择时间，那么默认是八点
    if((that.data.productId == 81 || that.data.productId == 82) && that.data.detailClock == " 00:00:00"){
      that.setData({
        detailClock: " 08:00:00"
      })
    }
    // 如果是病毒消杀130㎡以下，则面积为130㎡
    if(that.data.productId == 82){
      that.setData({
        houseSize: " 130㎡及以下"
      })
    }

    var openid = app.data.openid;
    //获取openid
    if (!openid) {
      wx.login({
        success: function(res) {
          if (res.code) {
            util.doBaseGet("/weiXin/applet/openId?code=" + res.code, function(res) {
              app.data.openid = res;
              //that.paySuccess('123456');
              that.pay();
            })
          }
        }
      })
    } else {

      //that.paySuccess('123456');
      that.pay();
    }
  },
  //调取预支付
  pay: function() {
    var that = this;

    var body = that.data.productName
    if (that.data.payIndex==0){
      // that.setData({
      //   totalFee :+that.data.totalPrice,
      //   cardPrice : 0,
      // })
       var totalFee = +that.data.totalPrice;
       var cardPrice = 0;
    }else{
      // that.setData({
      //   totalFee: that.data.totalFee,
      //   cardPrice: that.data.cardPrice
      // })
       var totalFee = that.data.totalFee;
       var cardPrice = that.data.cardPrice;
    }
    //var totalFee = that.data.totalPrice;
    // var totalFee = that.data.totalFee;
    // var cardPrice = that.data.cardPrice;
    console.log(that.data.totalPrice)
    console.log(totalFee)
    console.log(cardPrice)

    var products = [{
      productId: that.data.productId,
      orderQuantity: that.data.buyCnt
    }]
    var oddJobOrder = {}
    var hourlyWorkersOrder = {}
    console.log("*********************")
    console.log(that.data.showType)

    // 业务类型是家务，但是展示类型不是家务，那么预约时间为空
    if (that.data.businessTypeId == '6' && that.data.showType != 6) {
      that.setData({
        bornDay: '',
        detailClock: '',
      })
    }

    if (that.data.businessTypeId == '6') {
    // if (that.data.showType == 6) {
      hourlyWorkersOrder = {
        linkman: that.data.address.name,
        phone: that.data.address.tell,
        area: that.data.address.areaId,
        address: that.data.address.address,
        houseNumber: that.data.address.houseNumber,
        appointTime: that.data.bornDay + that.data.detailClock,
        houseSize: that.data.houseSize,
        noonType: that.data.timeSlot,
        memo: that.data.memo,
      }
    } else {
      oddJobOrder = {
        linkman: that.data.address.name,
        phone: that.data.address.tell,
        area: that.data.address.areaId,
        address: that.data.address.address,
        houseNumber: that.data.address.houseNumber,
        remark: that.data.reformArea,
      }
    }
    var data = {
      platform: 'miniapp',
      businessTypeId: that.data.businessTypeId,
      showType: that.data.showType,
      accountId: app.data.accountId,
      openId: app.data.openid,
      activityId: that.data.activityId,
      body: body,
      totalFee: totalFee,
      products: products,
      oddJobOrder: oddJobOrder,
      hourlyWorkersOrder: hourlyWorkersOrder,
      // 把优惠券编号和优惠金额传过去
      // couponsNo: that.data.couponsNo,
      myCouponsId: that.data.myCouponsId,
      couponsLimit: that.data.couponsLimit,
      channel: 2,
      source: wx.getStorageSync('invitationAgentId') ? 5 : app.globalData.source,
      parameter: app.globalData.parameter,
      // 购物凭证（网龙），file转base64之后的
      file: that.data.imgBase64,
      // 电子券金额
      cardPrice: cardPrice,
      // 店铺id
      storeId: that.data.storeId,
      agentId: wx.getStorageSync('invitationAgentId'),
      companyId: wx.getStorageSync('selectCompany').id
    };
    console.log("点击立即支付传参：");
    console.log(data);

    util.doPost('','/business/orders/' + that.data.businessTypeId, data, res=> {
      console.log('点击立即支付：')
      console.log(res)
      if(!res.success){
        wx.showModal({
          title: '',
          content: res.reason,
          showCancel: false,
          success: function (res) {
            console.log(111111111111111111111)
          }
        })
        return;
      }
      if (res.statusCode == 500) {
        wx.showToast({
          title: '网络连接异常',
          icon: 'none',
          duration: 2000
        })
      } else {
        // console.log(res);
        if (totalFee==0 ){
          if (res.success){
            setTimeout(function(){
              wx.redirectTo({
                url: '../orderSuccess/orderSuccess',
              })
            },2200)
            
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 1800
                })
          }
        }else{
          var data = res.data;
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': function (res) {
              if (res.errMsg == 'requestPayment:ok') {
                wx.redirectTo({
                  url: '../orderSuccess/orderSuccess',
                })
                // wx.showToast({
                //   title: '支付成功',
                //   icon: 'none',
                //   duration: 2000
                // })
              } else {

              }
            },
            'fail': function (res) {
              console.log('支付', res)
            }
          })
        }
        
      }
    })

  },
})