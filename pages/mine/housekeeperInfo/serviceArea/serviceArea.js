var certStr = ''
const app = getApp();
var util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.doBaseGet("/dictionaries/area/allChildren?id=1273", function (res) {

      util.doBaseGet("/housekeeper/" + app.data.accountId + "/basics", function (res1) {
        if (res1) {
          var serviceArea = res1.serviceArea.split(',')
          for (var i in serviceArea) {
            for (var j = 0; j < res.length; j++) {
              if (serviceArea[i] == res[j].name) {
                res[j].check = true;
              }
            }
          }
        }
        var id = res[0].id
        var name = res[0].name
        var check = false
        if (res[0].check) {
          check = res[0].check
          for (var k in res) {
            res[k].check = true;
          }
        }
        res.splice(0, 1)
        that.setData({
          id: id,
          name: name,
          check: check,
          dataList: res
        })
      })

    })


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

  checkAll: function (e) {

    var check = this.data.check;
    if (check) {
      certStr = '';
      var allGoodsBK = this.data.dataList;
      //全部选中
      for (var i = 0; i < allGoodsBK.length; i++) {
        allGoodsBK[i].check = false;
      }
    } else {
      certStr = '1274,';
      var allGoodsBK = this.data.dataList;
      //全部选中
      for (var i = 0; i < allGoodsBK.length; i++) {
        allGoodsBK[i].check = true;
      }
    }
    // console.log(certStr)
    this.setData({
      check: !check,
      dataList: allGoodsBK
    });
  },

  switchSelect(e) {
    var that = this;
    var length = e.detail.value.length;
    var check = false
    certStr = ''
    if (length == 13) {
      certStr = '1274,'
      check = true
    } else {
      for (var i = 0; i < length; i++) {
        // if (i < length - 1) {
        certStr += e.detail.value[i] + ',';
        // } else {
        //   certStr += e.detail.value[i]
        // }
      }
    }


    var allGoodsBK = that.data.dataList;
    var checkArr = e.detail.value;
    //更改点击

    for (var i = 0; i < allGoodsBK.length; i++) {
      if (checkArr.indexOf(allGoodsBK[i].id) != -1) {
        allGoodsBK[i].check = true;
      } else {
        allGoodsBK[i].check = false;
      }
    }

    that.setData({
      check: check,
      dataList: allGoodsBK
    });

  },


  toSkip: function () {
    wx.navigateTo({
      url: '../cert/cert',
    })
  },

  confirm: function () {
    var str = certStr.substring(0, certStr.length - 1);
    if (str) {
      var data = {
        id: app.data.accountId,
        serviceArea: str
      }
      util.doPost("/housekeeper/workInfo", data, function (res) {
        if (res) {
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })

        }
      })
    }else{
      wx.showToast({
        title: '请选择服务区域',
        icon: 'none'
      })
    }
  
  }

})