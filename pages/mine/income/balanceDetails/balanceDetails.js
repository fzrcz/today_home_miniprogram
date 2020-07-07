// pages/mine/income/balanceDetails/balanceDetails.js
/*
businessType 1:工人收入 2：工人上级分润收入 3：顾客上级分润收入 4：提现支出 5：订单取消，返还电子券 6：电子券支付
*/
var app = getApp();
var util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    windowWidth: '',
    windowHeight: '',
    noData: false,
    hasMoreData: true,
    orderList: [],
    traceType: 0,
    currentPage: 0,
    limit: 15,
    isloading: true,
    // 根据这个判断上拉加载的时候有没有数据
    noDataList1: 1,
    noDataList2: 1,
    noDataList3: 1,
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    that.getAllBalanceDetailList();
  },

  // 查询账户明细的全部的方法
  getAllBalanceDetailList: function() {
    var that = this;
    var data = {
      offset: that.data.currentPage * that.data.limit,
      limit: that.data.limit,
      memberId:app.data.accountId,
      roleType:1,
      inviterFlag: 1,
    }
    wx.showLoading({
        title: '加载中',
        icon: 'loading'
      }),
      util.doGet("/accountTtaceRecord/queryList", data, function(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('账户明细的全部onload：')
      //console.log(res.data[0].accountBatch.remark)
        console.log(res)
        if (res.success) {
          if (res.data.length != 0) {
            that.setData({
              allBalanceDetailList: res.data,
            })
          } else {
            that.setData({
              allBalanceDetailList: []
            })
          }
        }
      })
  },

  // 账户明细的全部
  swichTab0: function(e) {
    var that = this;
    that.setData({
      currentTab: e.target.dataset.current,
      currentPage: 0,
      noDataList1: 1,
    });
    that.getAllBalanceDetailList();
    // var data = {
    //   offset: that.data.currentPage * that.data.limit,
    //   limit: that.data.limit,
    // }
    // wx.showLoading({
    //     title: '加载中',
    //     icon: 'loading'
    //   }),
    //   util.doGet("/accountTtaceRecord/queryList", data, function(res1) {
    //     wx.hideLoading();
    //     console.log('账户明细的全部：')
    //     console.log(res1)
    //     if (res1.success) {
    //       if (res1.data.length != 0) {
    //         that.setData({
    //           allBalanceDetailList: res1.data,
    //         })
    //       } else {
    //         that.setData({
    //           allBalanceDetailList: [],
    //         })
    //       }
    //     }
    //   })
  },
  // 账户明细的收入
  swichTab1: function(e) {
    var that = this;
    that.data.currentPage = 0;
    that.setData({
      currentTab: e.target.dataset.current,
      currentPage: 0,
      noDataList2: 1,
    });
    that.getInComeBalanceDetailList();
    // var data = {
    //   traceType: 1,
    //   offset: that.data.currentPage * that.data.limit,
    //   limit: that.data.limit,
    // }
    // wx.showLoading({
    //     title: '加载中',
    //     icon: 'loading'
    //   }),
    //   util.doGet("/accountTtaceRecord/queryList", data, function(res2) {
    //     wx.hideLoading();
    //     console.log('账户明细的收入：')
    //     console.log(res2)
    //     if (res2.success) {
    //       if (res2.data.length != 0) {
    //         that.setData({
    //           inComeBalanceDetailList: res2.data,
    //         })
    //       } else {
    //         that.setData({
    //           inComeBalanceDetailList: []
    //         })
    //       }
    //     }
    //   })
  },

  // 查询账户明细的收入的方法
  getInComeBalanceDetailList: function() {
    var that = this;
    var data = {
      traceType: 1,
      offset: that.data.currentPage * that.data.limit,
      limit: that.data.limit,
      memberId: app.data.accountId,
      roleType: 1,
      inviterFlag: 1,// 非空即可
    }
    wx.showLoading({
        title: '加载中',
        icon: 'loading'
      }),
      util.doGet("/accountTtaceRecord/queryList", data, function(res2) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('账户明细的收入：')
        console.log(res2)
        if (res2.success) {
          if (res2.data.length != 0) {
            that.setData({
              inComeBalanceDetailList: res2.data,
            })
          } else {
            that.setData({
              inComeBalanceDetailList: []
            })
          }
        }
      })
  },

  // 查询账户明细的支出的方法
  getOutComeBalanceDetailList: function() {
    var that = this;
    // that.setData({
    //   currentTab: e.target.dataset.current,
    //   currentPage: 0,
    //   noDataList3: 1,
    // });
    var data = {
      traceType: 2,
      offset: that.data.currentPage * that.data.limit,
      limit: that.data.limit,
      memberId: app.data.accountId,
      roleType: 1,
      inviterFlag: 1,// 非空即可
    }
    wx.showLoading({
        title: '加载中',
        icon: 'loading'
      }),
      util.doGet("/accountTtaceRecord/queryList", data, function(res3) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('账户明细的支出：')
        console.log(res3)
        if (res3.success) {
          if (res3.data.length != 0) {
            that.setData({
              outComeBalanceDetailList: res3.data
            })
          } else {
            that.setData({
              outComeBalanceDetailList: []
            })
          }
        }
      })
  },

  // 账户明细的支出
  swichTab2: function(e) {
    var that = this;
    that.setData({
      currentTab: e.target.dataset.current,
      currentPage: 0,
      noDataList3: 1,
    });
    that.getOutComeBalanceDetailList();
    // var data = {
    //   traceType: 2,
    //   offset: that.data.currentPage * that.data.limit,
    //   limit: that.data.limit,
    // }
    // wx.showLoading({
    //     title: '加载中',
    //     icon: 'loading'
    //   }),
    //   util.doGet("/accountTtaceRecord/queryList", data, function(res3) {
    //     wx.hideLoading();
    //     console.log('账户明细的支出：')
    //     console.log(res3)
    //     if (res3.success) {
    //       if (res3.data.length != 0) {
    //         that.setData({
    //           outComeBalanceDetailList: res3.data
    //         })
    //       } else {
    //         that.setData({
    //           outComeBalanceDetailList: []
    //         })
    //       }
    //     }
    //   })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    var currentPage = that.data.currentPage;
    currentPage++;
    console.log("当前页为第" + currentPage + "页")
    that.setData({
      isloading: false,
      currentPage: currentPage
    })
    that.getNewData();
  },

  // 分页操作
  getNewData: function() {
    var that = this;
    if (that.data.currentTab == 0) {
      if (that.data.noDataList1 != 0) {
        wx.showLoading({
          title: '加载中...'
        })
        // 全部列表的上拉触底刷新
        // 如果没有数据了，就停止上拉加载
        var data = {
          offset: that.data.currentPage * that.data.limit,
          limit: that.data.limit,
          memberId: app.data.accountId,
          roleType: 1,
          inviterFlag: 1,// 非空即可
        }
        util.doGet("/accountTtaceRecord/queryList", data, function(res) {
          wx.hideLoading();
          console.log('账户明细全部列表分页,查询的新数据：')
          console.log(res)
          if (res.success) {
            var getCashList = res.data;
            if (getCashList.length == 0) {
              wx.showToast({
                title: '没有更多数据啦...',
                icon: 'none',
                duration: 1500
              })
              that.setData({
                noDataList1: 0
              })
              return;
            } else {
              // console.log("旧数据：")
              // console.log(that.data.allBalanceDetailList)
              // console.log("新数据：")
              // console.log(getCashList)
              // 将新一页的数据添加到原数据后面
              getCashList = that.data.allBalanceDetailList.concat(getCashList);
              that.setData({
                allBalanceDetailList: getCashList,
              })
            }
          }
        })
      }
      // 收入列表的上拉触底刷新
    } else if (that.data.currentTab == 1) {
      if (that.data.noDataList2 != 0) {
        var data = {
          traceType: 1,
          offset: that.data.currentPage * that.data.limit,
          limit: that.data.limit,
          memberId: app.data.accountId,
          roleType: 1,
          inviterFlag: 1,// 非空即可
        }
        wx.showLoading({
            title: '加载中',
            icon: 'loading'
          }),
          util.doGet("/accountTtaceRecord/queryList", data, function(res3) {
            wx.hideLoading();
            console.log('收入列表的上拉触底刷新：')
            console.log(res3)
            if (res3.success) {
              if (res3.data.length != 0) {
                var newDataList = res3.data;
                newDataList = that.data.inComeBalanceDetailList.concat(newDataList);
                that.setData({
                  inComeBalanceDetailList: newDataList,
                })
              } else {
                wx.showToast({
                  title: '没有更多数据啦...',
                  icon: 'none',
                  duration: 1500
                })
                that.setData({
                  noDataList2: 0
                })
              }
            }
          })
      }
      // 支出列表的上拉触底刷新
    } else if (that.data.currentTab == 2) {
      if (that.data.noDataList3 != 0) {
        var data = {
          traceType: 2,
          offset: that.data.currentPage * that.data.limit,
          limit: that.data.limit,
          memberId: app.data.accountId,
          roleType: 1,
          inviterFlag: 1,// 非空即可
        }
        wx.showLoading({
            title: '加载中',
            icon: 'loading'
          }),
          util.doGet("/accountTtaceRecord/queryList", data, function(res3) {
            wx.hideLoading();
            console.log('支出列表的上拉触底刷新：')
            console.log(res3)
            var outComeBalanceDetailList = [];
            if (res3.success) {
              if (res3.data.length != 0) {
                var newDataList = res3.data;
                // 将新一页的数据添加到原数据后面
                newDataList = that.data.outComeBalanceDetailList.concat(newDataList);
                that.setData({
                  outComeBalanceDetailList: newDataList,
                })
              } else {
                wx.showToast({
                  title: '没有更多数据啦...',
                  icon: 'none',
                  duration: 1500
                })
                that.setData({
                  noDataList3: 0
                })
              }
            }
          })
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    // 调用刷新全部的接口
    if (that.data.currentTab == 0) {
      that.data.currentPage = 0;
      that.data.noDataList1 = 1;

      that.getAllBalanceDetailList();
      // var data = {
      //   offset: that.data.currentPage * that.data.limit,
      //   limit: that.data.limit,
      // }
      // wx.showLoading({
      //     title: '加载中',
      //     icon: 'loading'
      //   }),
      //   util.doGet("/accountTtaceRecord/queryList", data, function(res) {
      //     wx.hideLoading();
      //     wx.stopPullDownRefresh();
      //     console.log('下拉刷新，账户明细的全部：')
      //     console.log(res)
      //     if (res.success) {
      //       if (res.data.length != 0) {
      //         that.setData({
      //           allBalanceDetailList: res.data,
      //         })
      //       } else {
      //         that.setData({
      //           allBalanceDetailList: []
      //         })
      //       }
      //     }
      //   })
      // 调用收入的接口
    } else if (that.data.currentTab == 1) {
      that.data.currentPage = 0;
      that.data.noDataList2 = 1;
      that.getInComeBalanceDetailList();
      // var data = {
      //   traceType: 1,
      //   offset: that.data.currentPage * that.data.limit,
      //   limit: that.data.limit,
      // }
      // wx.showLoading({
      //     title: '加载中',
      //     icon: 'loading'
      //   }),
      //   util.doGet("/accountTtaceRecord/queryList", data, function(res) {
      //     wx.hideLoading();
      //     wx.stopPullDownRefresh();
      //     console.log('下拉刷新，账户明细的收入：')
      //     console.log(res)
      //     if (res.success) {
      //       if (res.data.length != 0) {
      //         that.setData({
      //           inComeBalanceDetailList: res.data,
      //         })
      //       } else {
      //         that.setData({
      //           inComeBalanceDetailList: []
      //         })
      //       }
      //     }
      //   })
      // 调用支出的接口
    } else if (that.data.currentTab == 2) {
      that.data.currentPage = 0;
      that.data.noDataList3 = 1;
      that.getOutComeBalanceDetailList();
      // var data = {
      //   traceType: 2,
      //   offset: that.data.currentPage * that.data.limit,
      //   limit: that.data.limit,
      // }
      // wx.showLoading({
      //     title: '加载中',
      //     icon: 'loading'
      //   }),
      //   util.doGet("/accountTtaceRecord/queryList", data, function(res) {
      //     wx.hideLoading();
      //     wx.stopPullDownRefresh();
      //     console.log('下拉刷新，账户明细的支出：')
      //     console.log(res)
      //     if (res.success) {
      //       if (res.data.length != 0) {
      //         that.setData({
      //           outComeBalanceDetailList: res.data,
      //         })
      //       } else {
      //         that.setData({
      //           outComeBalanceDetailList: []
      //         })
      //       }
      //     }
      //   })
    }
  },
  /** 
   * 滑动切换tab 
   */
  // bindChange: function(e) {
  //   var index = e.detail.current;
  //   var that = this;
  //   that.setData({
  //     orderList: []
  //   });
  //   that.setData({
  //     noData: false
  //   });
  //   that.setData({
  //     hasMoreData: true
  //   });
  //   that.setData({
  //     currentTab: e.detail.current
  //   });
  //   console.log("滑动切换的currentTab为：");
  //   console.log(that.data.currentTab);
  //   if (that.data.currentTab == 1) {
  //     that.setData({
  //       traceType: 1
  //     });
  //     that.onLoad();
  //   } else if (that.data.currentTab == 2) {
  //     that.setData({
  //       traceType: 2
  //     });
  //     that.onLoad();
  //   } else if (that.data.currentTab == 0) {
  //     that.setData({

  //     });
  //     that.onLoad();
  //   }

  //   var query = wx.createSelectorQuery();
  //   query.select('#order-' + index).boundingClientRect(function(rect) {
  //     that.setData({
  //       // height: rect.height + 40 + 'px'
  //     })
  //   }).exec();
  // },
  /** 
   * 点击tab切换 
   */
  // swichNav: function(e) {
  //   var that = this;
  //   if (that.data.currentTab === e.target.dataset.current) {
  //     return false;
  //   } else {
  //     that.setData({
  //       currentTab: e.target.dataset.current
  //     });
  //   }
  // },


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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})