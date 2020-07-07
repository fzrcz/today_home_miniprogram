// pages/recommend/searchPage/searchPage.js
var app = getApp();
var util = require('../../../utils/util.js')
var searchContentList = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showHistory: true,
    // 获取手机高度
    windowWidth: '',
    windowHeight: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 获取手机高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
        })
      }
    })
    console.log('高度：' + that.data.windowHeight)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    searchContentList = app.data.searchContentList;
    console.log(searchContentList);
    that.setData({
      searchContentList: searchContentList,
    })
  },
  // 搜索内容
  searchContent: function(e) {
    var that = this;
    var searchContent = e.detail.value;
   
    console.log('搜索内容：' + searchContent + 'length ' + searchContent.length);
    if(searchContent.length == 0){
      that.setData({
        showHistory:true,
        productList: [],
      })
    }else{
      // 如果搜索框有内容，会实时查询
      that.getSearchList(searchContent);
    }
    that.setData({
      searchContent: searchContent,
    })
  },

  // 搜索按钮
  search: function() {
    var that = this;
    // 获取输入框的内容
    var searchContent = that.data.searchContent;
    // 获取上一次输入的历史记录
    searchContentList = that.data.searchContentList;
    if (!searchContentList) {
      searchContentList = [];
    }
    if (!searchContent) {
      // 用户不输入，默认搜索这个
      searchContent = '保洁';
      that.setData({
        historyContent: searchContent,
      })
    }
    // 把上次的反倒序之后，再把新内容排到后边，然后再整体倒序，存到缓存
    searchContentList = searchContentList.reverse();
    // 如果搜索内容是历史记录有的，则不再添加到历史记录
    var isSame = false;
    for (var i = 0; i < searchContentList.length; i++) {
      if (searchContent == searchContentList[i]) {
        console.log("================");
        isSame = true;
        break;
      } else {
        isSame = false;
      }
    }
    if (!isSame) {
      searchContentList.push(searchContent);
    }
    searchContentList = searchContentList.reverse();
    wx.setStorageSync('searchContentList', searchContentList);
    app.data.searchContentList = searchContentList;
    that.setData({
      searchContentList: searchContentList,
    })
    // 进行搜索
    that.getSearchList(searchContent);
  },

  // 搜索列表的方法
  getSearchList: function(searchContent) {
    var that = this;
    var data = {
      name: searchContent,
      activityStatus: 'miniapp',
      status: 'put'
    }
    util.doGet("/product/queryList", data, function(res) {
      console.log('搜索列表：');
      console.log(res);
      if (res.data.length != 0) {
        console.log(111);

        that.setData({
          productList: res.data,
          showHistory: false,
        })
      } else {
        console.log(222);

        that.setData({
          productList: [],
          showHistory: true,
        })
      }
    })
  },
  // 点击历史搜索
  historySearch: function(e) {
    var that = this;
    var historyContent = e.currentTarget.dataset.content;
    console.log('历史搜索：')
    console.log(historyContent);
    that.setData({
      historyContent: historyContent,
    })
    // 将内容回填到输入框，然后进行搜索
    that.getSearchList(historyContent);
  },
  // 清除历史记录
  deleteHistory: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除历史记录吗？',
      success: function(res) {
        //点击确定
        if (res.confirm) {
          console.log('确定：');
          // 删除存到数组的数据
          wx.setStorageSync('searchContentList', []);
          that.setData({
            searchContentList: [],
          })
          //点击取消
        } else {
          console.log('取消')
        }
      }
    })
  },
  //进入产品详情
  toDetail: function(e) {
    var activityId = e.currentTarget.dataset.activityid;
    var productId = e.currentTarget.dataset.productid;
    if (!activityId) {
      activityId = ''
    }
    wx.navigateTo({
      url: '/pages/recommend/oddjob/productDetail/productDetail?productId=' + productId + '&activityId=' + activityId,
    });
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})