//获取应用实例
const app = getApp();
var timer = false;
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;

Page({
  data: {
    page: 1,
    visible:false,
    pois: [],
    nearby:true
  },
  // 点击选择地址 返回按钮
  BackTap: function (e) {
    console.log(e.currentTarget.dataset.lat)
    console.log(e.currentTarget.dataset.lng)
    var area = e.currentTarget.dataset.area
    console.log("选择的地址，", area)
    if (!area){
      area = e.currentTarget.dataset.areaid
    }
    if (area.indexOf("仓山区") == -1 && area.indexOf("鼓楼区") == -1 && area.indexOf("台江区") == -1 && area.indexOf("晋安区") == -1 && area.indexOf("闽侯县") == -1){
      wx.showToast({
        title: '不在服务范围内！',
        icon: 'none',
        duration: 2000
      })
      return false
    }

    wx.setStorageSync("area", e.currentTarget.dataset.area);
    wx.setStorageSync("address", e.currentTarget.dataset.address);
    // 纬度 e.location.lat
    wx.setStorageSync("lat", e.currentTarget.dataset.lat);
    // 经度 e.loaction.lng
    wx.setStorageSync("lng", e.currentTarget.dataset.lng);

    // let pages = getCurrentPages();
    // let prevPage = pages[pages.length - 2];
    // prevPage.setData({
    //   lat: e.currentTarget.dataset.lat,
    //   lng: e.currentTarget.dataset.lng,
    // })

    wx.navigateBack({
      delta: 1
    })
  },
  
  onLoad: function () {
    qqmapsdk = new QQMapWX({
      key: 'BW5BZ-34TC4-PYLUX-XUPZ5-G7YGE-5FBFG'
    });
  },
  onShow: function () {
    let vm = this;
    vm.getUserLocation();
  },
  getUserLocation: function () {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        // console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
                // console.log(2)
                wx.navigateBack({
                  delta: 1
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                      // console.log(3)
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        }
        else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation: function () {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(JSON.stringify(res), '获得经纬度')
        var latitude = res.latitude
        var longitude = res.longitude
        vm.setData({
          latitude: latitude,
          longitude: longitude
        })
        vm.getLocal(latitude, longitude)
      },
      fail: function (res) {
        console.log(res)
        vm.setData({
          visible:true
        })
      }
    })
  },
  // 获取当前地理位置
  getLocal: function (latitude, longitude) {
    let vm = this;
    wx.showLoading({
      title: '加载中',
    })
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude,
      },
      coord_type: 1,
      get_poi: 1,
      poi_options: 'page_size=5;page_index=' + vm.data.page,
      success: function (res) {
        console.log(res, '地理位置');
        wx.hideLoading()
        let pois = res.result.pois
        vm.setData({
          address: res.result.address,
          pois: vm.data.pois.concat(pois),
        })

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  //根据坐标查询位置
  serachInput(e) {
    var val = e.detail.value;
    let vm = this;
    console.log("选择地址的经纬度为：", vm.data)
    clearTimeout(timer);
    timer = setTimeout(function () {
      if (val.length > 0) {
        qqmapsdk.search({
          keyword: val,  //搜索关键词
          location: {
            latitude: vm.data.latitude,
            longitude: vm.data.longitude,
          },
          page_size: 10,
          success: function (res) {
            console.log(res, '搜索位置');
            let pois = res.data
            vm.setData({
              nearby: false,
              pois: pois,
            })
          },
        });
      } else {
        vm.setData({
          nearby:true,
          pois: [],
        })
        vm.getLocal(vm.data.latitude, vm.data.longitude)
      }

    }, 500);
  },

  handleClose:function(){
    this.setData({
      visible:false
    })
    wx.navigateBack({
      delta: 1
    })
  }
  // onReachBottom: function () {
  //   let vm = this;
  //   vm.setData({
  //     page: vm.data.page + 1
  //   })
  //   vm.getLocal(vm.data.latitude, vm.data.longitude)
  // },
})