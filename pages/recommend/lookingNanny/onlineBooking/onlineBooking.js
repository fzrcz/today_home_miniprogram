// pages/recommend/lookingNanny/onlineBooking/onlineBooking.js
const app = getApp();
var util = require('../../../../utils/util.js');
// var constant = require('../../../../utils/constant.js');
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var bigIndexArr = [];
var smallIndex = [];
var saveHuReq = [];
var saveHuItem = [];
var saveHuValue = [];
var saveYueReq = [];
var saveYueItem = [];
var saveYueValue = [];
// 用于判断先点月嫂还是先点护工
var m = 1;
var n = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaArr: '', //区/镇列表
    index: 0,
    townArr: '',
    townIndex: 0,
    shopVoucher: true,// 是否展示购物凭证，true：展示 false.不展示
    imgUrl1: '/image/add.png',
    housekeeperType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    // 清空已选的选项
    bigIndexArr = [];
    console.log(bigIndexArr);

    qqmapsdk = new QQMapWX({
      key: 'BW5BZ-34TC4-PYLUX-XUPZ5-G7YGE-5FBFG' //开发者的key
    });

    //0保姆、1月嫂、2护工、3育婴师、4育儿嫂
    var clickId = options.clickId
    console.log(clickId);
    that.setData({
      clickId: clickId
    })

    if (clickId == 0) {
      var data = {
        housekeeperType: '保姆',
      }
      // MS00102获取需求列表
      util.reqLoading(app.globalData.apiUrl, 'MS00102', data, 'POST', '加载中...', function(res) {
        console.log('保姆需求onload为：');
        console.log(res);
        var itemList = [];
        var valueList = [];
        var requestList = [];
        for (var i in res.data) {
          if (res.data[i].key == '居家面积') {
            itemList[0] = res.data[i].key;
            valueList[0] = res.data[i].dictionaryMapList;
            requestList[0] = res.data[i];
          }
          if (res.data[i].key == '是否有宠物') {
            itemList[1] = res.data[i].key;
            valueList[1] = res.data[i].dictionaryMapList;
            requestList[1] = res.data[i];
          }
          if (res.data[i].key == '是否保姆住家') {
            itemList[2] = res.data[i].key;
            valueList[2] = res.data[i].dictionaryMapList;
            requestList[2] = res.data[i];
          }
          if (res.data[i].key == '住宅类型') {
            itemList[3] = res.data[i].key;
            valueList[3] = res.data[i].dictionaryMapList;
            requestList[3] = res.data[i];
          }
          if (res.data[i].key == '服务人口') {
            itemList[4] = res.data[i].key;
            valueList[4] = res.data[i].dictionaryMapList;
            requestList[4] = res.data[i];
          }
        }
        that.setData({
          housekeeperType: '保姆',
          requestList: res.data,
          itemList: itemList,
          valueList: valueList,
        })
      })
    }
    if (clickId == 1 ||clickId == 2) {
      var data = {
      }
      util.reqLoading(app.globalData.apiUrl, 'MS00102', data, 'POST', '加载中...', function(res) {
        console.log('月嫂需求onload为：');
        console.log(res);
        var itemList = [];
        var valueList = [];
        var requestList = [],housekeeperType;
        for (var i in res.data) {

          // if (res.data[i].key == '家政员类型') {

          //   var valueItemList = [];
          //   for (var j in res.data[i].dictionaryMapList) {
          //     if (res.data[i].dictionaryMapList[j].value == '月嫂') {
          //       valueItemList[0] = res.data[i].dictionaryMapList[j];
          //     }
          //     if (res.data[i].dictionaryMapList[j].value == '护工') {
          //       valueItemList[1] = res.data[i].dictionaryMapList[j];
          //     }
          //   }
          //   res.data[i].dictionaryMapList = valueItemList;
          //   itemList[0] = '您要找的服务人员是';
          //   valueList[0] = valueItemList;
          //   requestList[0] = res.data[i];
          // }
          if (res.data[i].key == '是否保姆住家') {
            itemList[0] = '您是否需要服务人员住家';
            valueList[0] = res.data[i].dictionaryMapList;
            requestList[0] = res.data[i];
          }
          if (res.data[i].key == '居家面积') {
            itemList[1] = '您的居家面积';
            valueList[1] = res.data[i].dictionaryMapList;
            requestList[1] = res.data[i];
          }
          if (res.data[i].key == '住宅类型') {
            itemList[2] = '您的住宅类型';
            valueList[2] = res.data[i].dictionaryMapList;
            requestList[2] = res.data[i];
          }
          if (res.data[i].key == '是否有宠物') {
            itemList[3] = '家中是否有宠物';
            valueList[3] = res.data[i].dictionaryMapList;
            requestList[3] = res.data[i];
          }
          if (res.data[i].key == '月嫂等级' && clickId == 1) {
            itemList[4] = '您希望月嫂服务在什么等级';
            valueList[4] = res.data[i].dictionaryMapList;
            requestList[4] = res.data[i];
            housekeeperType="月嫂"
          }
          if (res.data[i].key == '家庭人员情况' && clickId == 2) {
            itemList[4] = '您家中需要照顾的人员为';
            valueList[4] = res.data[i].dictionaryMapList;
            requestList[4] = res.data[i];
            housekeeperType="护工"
          }
        }
        that.setData({
          housekeeperType: housekeeperType,
          requestList: requestList,
          itemList: itemList,
          valueList: valueList,
        })
      })
    }
    if (clickId == 3 || clickId == 4) {
      util.reqLoading(app.globalData.apiUrl, 'MS00102', {}, 'POST', '加载中...', function(res) {
        console.log('育婴师需求onload为：');
        console.log(res);
        var itemList = [];
        var valueList = [];
        var requestList = [],housekeeperType;
        if(clickId == 3)housekeeperType='育婴师'
        if(clickId == 4)housekeeperType='育儿嫂'
        for (var i in res.data) {

          // if (res.data[i].key == '家政员类型') {
          //   var valueItemList = [];
          //   for (var j in res.data[i].dictionaryMapList) {
          //     if (res.data[i].dictionaryMapList[j].value == '育婴师') {
          //       valueItemList[0] = res.data[i].dictionaryMapList[j];
          //     }
          //     if (res.data[i].dictionaryMapList[j].value == '育儿嫂') {
          //       valueItemList[1] = res.data[i].dictionaryMapList[j];
          //     }
          //   }
          //   res.data[i].dictionaryMapList = valueItemList;
          //   itemList[0] = '您要找的服务人员是';
          //   valueList[0] = valueItemList;
          //   requestList[0] = res.data[i];
          // }
          if (res.data[i].key == '是否保姆住家') {
            itemList[0] = '您是否需要服务人员住家';
            valueList[0] = res.data[i].dictionaryMapList;
            requestList[0] = res.data[i];
          }
          if (res.data[i].key == '居家面积') {
            itemList[1] = '您的居家面积';
            valueList[1] = res.data[i].dictionaryMapList;
            requestList[1] = res.data[i];
          }
          if (res.data[i].key == '住宅类型') {
            itemList[2] = '您的住宅类型';
            valueList[2] = res.data[i].dictionaryMapList;
            requestList[2] = res.data[i];
          }
          if (res.data[i].key == '服务人口') {
            itemList[3] = '服务人口';
            valueList[3] = res.data[i].dictionaryMapList;
            requestList[3] = res.data[i];
          }
          if (res.data[i].key == '是否有宠物') {
            itemList[4] = '家中是否有宠物';
            valueList[4] = res.data[i].dictionaryMapList;
            requestList[4] = res.data[i];
          }
          if (res.data[i].key == '宝宝年龄') {
            itemList[5] = '您家的宝宝的年龄';
            valueList[5] = res.data[i].dictionaryMapList;
            requestList[5] = res.data[i];
          }
          if (res.data[i].key == '服务人员年龄') {
            itemList[6] = '您希望服务人员的年龄是';
            valueList[6] = res.data[i].dictionaryMapList;
            requestList[6] = res.data[i];
          }
          if (res.data[i].key == '服务人员经验') {
            itemList[7] = '您希望服务人员有怎样的经验';
            valueList[7] = res.data[i].dictionaryMapList;
            requestList[7] = res.data[i];
          }
        }
        that.setData({
          // requestList: res.data,
          housekeeperType: housekeeperType,
          requestList: requestList,
          itemList: itemList,
          valueList: valueList,
        })
      })
    }

    // that.getLocationDetail();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    m = 1;
    n = 1;

    var address = wx.getStorageSync("address");
    var area = wx.getStorageSync("area");
    var lat = wx.getStorageSync("lat");
    var lng = wx.getStorageSync("lng");
    console.log(address)
    console.log(area)
    console.log(lat)
    console.log(lng)
    // wx.removeStorageSync("address")
    // wx.removeStorageSync("area")
    // wx.removeStorageSync("lat")
    // wx.removeStorageSync("lng")
    if (address) {
      this.setData({
        area: area,
        address: address,
        latitude: lat,
        longitude: lng,
      })
      that.getLocationShop();
    }

  },

  // 搜索地址
  toSearch: function() {
    wx.navigateTo({
      url: '/pages/mine/address/searchAddr/searchAddr',
    })
  },
  // 获取该地址所属区的店铺的方法
  getLocationShop: function(){
    var that = this;
    var data = {
      // area: that.data.address.areaId,
      area: wx.getStorageSync("area"),
      // 纬度
      // lat: that.data.address.latitude,
      lat: wx.getStorageSync("lat"),
      // 经度
      // lng: that.data.address.longitude,
      lng: wx.getStorageSync("lng"),
    }
    console.log("获取店铺，传参：", data)
    util.reqLoading(app.globalData.apiUrl, 'MS01101', data, 'POST', '加载中...', function (res) {
      console.log("获取的店铺：", res.data[0].storeList);
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
      var storeNo = options.currentTarget.dataset.storeno
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
        storeNo: storeNo,
      })
    },

  // 选择选项
  selectValue: function(e) {
    var that = this;
    var bigIndex = e.currentTarget.dataset.bigindex;
    var smallIndex = e.currentTarget.dataset.smallindex;
    console.log('大小序号：' + bigIndex + '***' + smallIndex);
    bigIndexArr[bigIndex] = smallIndex;
    console.log(bigIndexArr)
    that.setData({
      bigIndexArr: bigIndexArr,
    })

    var requestList = that.data.requestList;
    var value = requestList[bigIndex].dictionaryMapList[smallIndex].value;
    console.log(value);
    if (value == '月嫂') {

      if (m == 1 && n == 1) {
        m++;
        // 把护工存起来
        saveHuReq = that.data.requestList[6];
        saveHuItem = that.data.itemList[6];
        saveHuValue = that.data.valueList[6];

        that.data.requestList.splice(6, 1);
        that.data.itemList.splice(6, 1);
        that.data.valueList.splice(6, 1);

      } else if (m == 1 && n != 1) {

        saveHuReq = that.data.requestList[5];
        saveHuItem = that.data.itemList[5];
        saveHuValue = that.data.valueList[5];

        that.data.requestList.splice(5, 1);
        that.data.itemList.splice(5, 1);
        that.data.valueList.splice(5, 1);

        that.data.requestList.push(saveYueReq);
        that.data.itemList.push(saveYueItem);
        that.data.valueList.push(saveYueValue);

      } else {

        saveHuReq = that.data.requestList[5];
        saveHuItem = that.data.itemList[5];
        saveHuValue = that.data.valueList[5];

        that.data.requestList.splice(5, 1);
        that.data.itemList.splice(5, 1);
        that.data.valueList.splice(5, 1);

        that.data.requestList.push(saveYueReq);
        that.data.itemList.push(saveYueItem);
        that.data.valueList.push(saveYueValue);
      }

      that.setData({
        requestList: that.data.requestList,
        itemList: that.data.itemList,
        valueList: that.data.valueList,
      })
    }
    if (value == '护工') {
      if (n == 1 && m == 1) {
        n++;
        // 把月嫂存起来
        saveYueReq = that.data.requestList[5];
        saveYueItem = that.data.itemList[5];
        saveYueValue = that.data.valueList[5];

        that.data.requestList.splice(5, 1);
        that.data.itemList.splice(5, 1);
        that.data.valueList.splice(5, 1);

      } else if (n == 1 && m != 1) {
        saveYueReq = that.data.requestList[5];
        saveYueItem = that.data.itemList[5];
        saveYueValue = that.data.valueList[5];

        that.data.requestList.splice(5, 1);
        that.data.itemList.splice(5, 1);
        that.data.valueList.splice(5, 1);

        // 把护工塞进去
        that.data.requestList.push(saveHuReq);
        that.data.itemList.push(saveHuItem);
        that.data.valueList.push(saveHuValue);

      } else {

        saveYueReq = that.data.requestList[5];
        saveYueItem = that.data.itemList[5];
        saveYueValue = that.data.valueList[5];

        that.data.requestList.splice(5, 1);
        that.data.itemList.splice(5, 1);
        that.data.valueList.splice(5, 1);

        // 把护工塞进去
        that.data.requestList.push(saveHuReq);
        that.data.itemList.push(saveHuItem);
        that.data.valueList.push(saveHuValue);

      }

      // 把护工加上，删掉月嫂
      that.setData({
        requestList: that.data.requestList,
        itemList: that.data.itemList,
        valueList: that.data.valueList,
      })
    }
    var houseSize;
    var population;
    var hasPet;
    var isResidence;
    var residenceType;
    var housekeeperType;
    var babyAge;
    var housekeeperAge;
    var housekeeperExp;
    var housekeeperLevel;
    var homeNeed;

    // // 您要找的服务人员(月嫂，育婴师)
    // var yingOrSao;
    // // 宝宝年龄
    // var babyAge;
    // // 希望服务人员年龄
    // var servicerAge;
    // // 服务人员有怎样的经验
    // var servicerExperience;

    // // 您希望月嫂服务再什么等级？（仅月嫂出现)
    // var matronLevel;
    // // 您家中需要照顾的人员（仅护工出现）
    // var disable;
    // // 孕妇预产期
    // var childbirth;


    if (that.data.clickId == 0) {
      if (bigIndex == 0) {
        that.setData({
          houseSize: value,
        })
      }
      if (bigIndex == 1) {
        that.setData({
          hasPet: value,
        })
      }
      if (bigIndex == 2) {
        that.setData({
          isResidence: value,
        })
      }
      if (bigIndex == 3) {
        that.setData({
          residenceType: value,
        })
      }
      if (bigIndex == 4) {
        that.setData({
          population: value,
        })
      }
    }
    // 月嫂/护工
    if (that.data.clickId == 1 || that.data.clickId == 2) {
      // if (bigIndex == 0) {
      //   that.setData({
      //     housekeeperType: value,
      //   })
      // }
      if (bigIndex + 1 == 1) {
        that.setData({
          isResidence: value,
        })
      }
      if (bigIndex + 1 == 2) {
        that.setData({
          houseSize: value,
        })
      }
      if (bigIndex + 1 == 3) {
        that.setData({
          residenceType: value,
        })
      }
      if (bigIndex + 1 == 4) {
        that.setData({
          hasPet: value,
        })
      }
      if (bigIndex + 1 == 5 && that.data.clickId == 1) {
        that.setData({
          housekeeperLevel: value,
        })
      }
      if (bigIndex + 1 == 5 && that.data.clickId == 2) {
        that.setData({
          homeNeed: value,
        })
      }
    }
    if (that.data.clickId == 3||that.data.clickId == 4) {
      // if (bigIndex == 0) {
      //   that.setData({
      //     housekeeperType: value,
      //   })
      // }
      if (bigIndex + 1 == 1) {
        that.setData({
          isResidence: value,
        })
      }
      if (bigIndex + 1 == 2) {
        that.setData({
          houseSize: value,
        })
      }
      if (bigIndex + 1 == 3) {
        that.setData({
          residenceType: value,
        })
      }
      if (bigIndex + 1 == 4) {
        that.setData({
          population: value,
        })
      }
      if (bigIndex + 1 == 5) {
        that.setData({
          hasPet: value,
        })
      }
      if (bigIndex + 1 == 6) {
        that.setData({
          babyAge: value,
        })
      }
      if (bigIndex + 1 == 7) {
        that.setData({
          housekeeperAge: value,
        })
      }
      if (bigIndex + 1 == 8) {
        that.setData({
          housekeeperExp: value,
        })
      }
    }
    // console.log(that.data.houseSize);
    // console.log(that.data.hasPet);
    // console.log(that.data.isResidence);
    // console.log(that.data.residenceType);
    // console.log(that.data.population);
  },

  // 姓名
  getEmployerName: function(e){
    var that = this;
    console.log("姓名：" + e.detail.value);
    that.setData({
      employerName: e.detail.value
    })
  },

  // 门牌号
  doorNum: function(e){
    var that = this;
    console.log("门牌号：" + e.detail.value);
    that.setData({
      // address: address,
      detailAddress: e.detail.value
    })
  },

  // 拿到手机号
  getPhone: function(e) {
    var that = this;
    var phoneNum = e.detail.value;
    console.log('手机号：' + phoneNum);
    that.setData({
      phoneNum: phoneNum,
    })
  },

  // 备注
  memo: function(e) {
    var that = this;
    var memo = e.detail.value;
    console.log('备注：' + memo);

    that.setData({
      memo: memo,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },



  // 确认提交
  confirmSubmit: function() {
    var that = this;
    // 获取地址
    /*之前用下拉框选择地址
    var district = that.data.areaArr[0][that.data.index].fullname;
    var street = that.data.townArr[0][that.data.townIndex].fullname;
    var address = '福建省福州市' + district + street + that.data.detailAddress;*/

    var address = that.data.area + that.data.address + that.data.detailAddress;
    
    var data = {
      employerId: app.data.accountId,
      address: address,
      phone: that.data.phoneNum,
      houseSize: that.data.houseSize,
      population: that.data.population,
      hasPet: that.data.hasPet,
      isResidence: that.data.isResidence,
      residenceType: that.data.residenceType,
      memo: that.data.memo,
      housekeeperType: that.data.housekeeperType,
      babyAge: that.data.babyAge,
      housekeeperAge: that.data.housekeeperAge,
      housekeeperExp: that.data.housekeeperExp,
      housekeeperLevel: that.data.housekeeperLevel,
      homeNeed: that.data.homeNeed,
      expectedDate: that.data.dates,
      pictureImg: that.data.imgBase64,
      // 店铺的id和编号传过去
      storeId: that.data.storeId,
      storeNo: that.data.storeNo,
      employerName: that.data.employerName,
    }

    if (!that.data.employerName || !that.data.detailAddress) {
      wx.showToast({
        title: '您有未完善的需求信息',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    
    if (that.data.clickId == 0) {
      if (!that.data.houseSize || !that.data.hasPet || !that.data.isResidence || !that.data.residenceType || !that.data.population || !that.data.address || !that.data.phoneNum) {
        console.log("************")
        wx.showToast({
          title: '您有未完善的需求信息',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }
    if (that.data.clickId == 1 || that.data.clickId == 2) {
      // if (!that.data.housekeeperType || !that.data.isResidence || !that.data.houseSize || !that.data.residenceType || !that.data.hasPet || !that.data.expectedDate || !that.data.detailAddress || !that.data.phoneNum) {
      if (!that.data.housekeeperType || !that.data.isResidence || !that.data.houseSize || !that.data.residenceType || !that.data.hasPet || !that.data.address || !that.data.phoneNum) {
        console.log("************")
        wx.showToast({
          title: '您有未完善的需求信息',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }
    if (that.data.clickId == 3 || that.data.clickId == 4) {
      // 旧版需要判断这个housekeeperType，新版每个类别都分开了，不用判断了
      // if (!that.data.housekeeperType || !that.data.isResidence || !that.data.houseSize || !that.data.residenceType || !that.data.population || !that.data.hasPet || !that.data.babyAge || !that.data.housekeeperAge || !that.data.housekeeperExp || !that.data.detailAddress || !that.data.phoneNum) {
      if (!that.data.housekeeperType || !that.data.houseSize || !that.data.residenceType || !that.data.population || !that.data.hasPet || !that.data.babyAge || !that.data.housekeeperAge || !that.data.housekeeperExp || !that.data.address || !that.data.phoneNum) {
        console.log("************123")
        console.log("是否住家111："+that.data.housekeeperType)
        console.log("是否住家222："+that.data.isResidence)
        console.log(that.data.houseSize)
        console.log(that.data.residenceType)
        console.log(that.data.population)
        console.log(that.data.hasPet)
        console.log(that.data.babyAge)
        console.log(that.data.housekeeperAge)
        console.log(that.data.housekeeperExp)
        console.log(that.data.detailAddress)
        console.log(that.data.phoneNum)
        wx.showToast({
          title: '您有未完善的需求信息',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }


    console.log('确认提交，传参：');
    console.log(data);
    // MS00101提交需求
    util.reqLoading(app.globalData.apiUrl, 'MS00101', data, 'POST', '加载中...', function(res) {
      console.log(that.data.clickId + '需求,确认提交返回：');
      console.log(res);
      wx.showToast({
        title: '提交成功',
        icon: 'none',
        duration: 1500,
        mask: true,
        success: function() {
          setTimeout(function() {
            wx.navigateBack({
              delta: 1,
            })
          }, 1500);
        }
      })
    })
  },

  //选择时间
  bindDateChange: function(e) {
    var dates = e.detail.value
    var that = this
    that.setData({
      dates: dates
    })
    // 截取年、月、日
    var year = dates.substring(0, 4)
    var month = dates.substring(5, 7)
    var day = dates.substring(8, 10)
    that.setData({
      year: year,
      month: month,
      day: day
    })
  },

  // 上传购物凭证
  chooseImg1: function (e) {
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
          imgBase64: base64
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function() {

  // }
  

  // 用之前下拉框选择地址所用的
  // 详细地址
  // detailAddress: function(e) {
  //   var that = this;
  //   var detailAddress = e.detail.value;
  //   var district = that.data.areaArr[0][that.data.index].fullname;
  //   var street = that.data.townArr[0][that.data.townIndex].fullname;
  //   // console.log('详细地址：' + detailAddress);
  //   // console.log('区：' + JSON.stringify(that.data.areaArr[0][that.data.index].fullname));
  //   // console.log('街道：' + JSON.stringify(that.data.townArr[0][that.data.townIndex].fullname));
  //   // 地址为
  //   var address = '福建省福州市' + district + street + detailAddress;
  //   console.log('总地址：' + address);
  //   that.setData({
  //     address: address,
  //     detailAddress: detailAddress,
  //   })
  // },
  // getLocationDetail: function() {
  //   var that = this;
  //   var num;
  //   var num2;
  //   var num3;
  //   var index = that.data.index
  //   // console.log(index);
  //   //获取当前位置的详细信息
  //   wx.getLocation({
  //     type: 'wgs84',
  //     success: function(res) {
  //       // wx.getLocation 获取当前的地理位置,latitude(维度)  longitude（经度）
  //       var latitude1 = res.latitude
  //       var longitude1 = res.longitude
  //       console.log("当前位置的经度：" + longitude1);
  //       console.log("当前位置的纬度：" + latitude1);
  //       qqmapsdk.reverseGeocoder({ //腾讯地图api 逆解析方法,传入参数为经纬度
  //         location: {
  //           latitude: latitude1,
  //           longitude: longitude1
  //         },
  //         success: function(res) { //逆解析成功时回调函数，res包含地理位置信息
  //           console.log('成功');
  //           console.log(res);

  //         }
  //       });
  //     }
  //   });
  //   /*直辖市如:北京：市（一级）、区（二级）id都是六位，(街道)第三级id是九位*/
  //   /*省-如:陕西：省（一级）、市（二级）、县级市、区（三级）id都是六位，(乡镇、街道)第四级id是九位*/
  //   /*由于直辖市、和省层级数目不同，不方便统一处理，可以借助id是六位还是九位，进行判断然后统一处理*/
  //   qqmapsdk.getCityList({ //获取城市列表
  //     success: function(ress) {

  //       // console.log(ress) //城市列表全部信息
  //       // num = ress.result[0][3].id //获取34个省，直辖市的id对应的id，1级行政单位（此处只是获取34中的一个）
  //       num = '350000'
  //       qqmapsdk.getDistrictByCityId({
  //         id: num, //省份id
  //         success: function(resss) {
  //           // console.log('....直辖市......')
  //           // console.log(resss.result[0][0].name)
  //           // console.log('....直辖市-end......')
  //           num2 = resss.result[0][0].id
  //           qqmapsdk.getDistrictByCityId({
  //             id: num2, //直辖市id
  //             success: function(ressss) {
  //               that.setData({
  //                 areaArr: ressss.result
  //               })
  //               // console.log(ressss) //县级市、区(2级行政单位所属），街道（直辖市的区所属），3级行政单位
  //               num3 = ressss.result[0][index].id;
  //               // console.log('....区/县......')
  //               // console.log(ressss.result[0][index].fullname) //注：从三级行政单位开始，三、四级都没有name属性，只有fullname属性
  //               // console.log(ressss.result[0][index].id)
  //               // console.log('....区/县-end......')
  //               qqmapsdk.getDistrictByCityId({
  //                 id: num3,
  //                 success: function(resssss) {
  //                   if (resssss == null) {
  //                     console.log('false') //类似于北京市，没有四级行政，当前所在函数不执行
  //                   } else { //省份有四级行政单位，下面代码可以执行
  //                     that.setData({
  //                       townArr: resssss.result
  //                     })
  //                   }
  //                 }
  //               })
  //             },
  //           })

  //         },

  //       })
  //     }
  //   })
  //   // var district = that.data.areaArr[0][that.data.index].fullname;
  //   // var street = that.data.townArr[0][that.data.townIndex].fullname;
  //   // that.setData({
  //   //   address: '福建省福州市' + district + street + that.data.detailAddress,
  //   // })
  //   // console.log('改动区县后总地址：' + that.data.address);
  //   // that.detailAddress();
  // },
  // bindPickerArea: function(e) {
  //   console.log("区：" + e.detail.value)
  //   this.setData({
  //     index: e.detail.value
  //   })
  //   this.getLocationDetail();
  // },
  // bindPickerTown: function(e) {
  //   console.log("街道111：", e)
  //   console.log("街道222：" + e.detail.value)
  //   this.setData({
  //     townIndex: e.detail.value
  //   })
  // },
})