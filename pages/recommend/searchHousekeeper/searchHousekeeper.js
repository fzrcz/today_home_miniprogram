// pages/recommend/searchHousekeeper/searchHousekeeper.js
var util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //搜索显示
    visible: 'block',
    //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
    isShow: false,
    loadType: true,
    loadMsg: '正在加载中...',
    //分页
    offset: 0,
    limit: 10,
    //当前搜索框的值
    searchVal: '',
    file:'',
    searchData: [],
    //当前查询的类型
    searchType:'text',
    //搜索记录
    history:[],
    //scroll-view高度
    scrollHeight: 0,
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'history',
      success: function (res) {
        that.setData({
          history: res.data.reverse()
        });
      }
    });
  },
  //搜索框输入值  
  serachInput: function (e) {
    var that = this;
    that.setData({
      searchVal: e.detail.value
    })
  },
  /**
   * 选择图片
   */
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed'],
      count: 1,
      success: function (res) {
        that.setData({
          file: res.tempFilePaths[0],
          searchType:'pic',
          //搜索显示
          visible: 'none'
        })
        that.searchList();
      }
    })
  },
  /**
   * 输入框查询
   */
  search: function () {
    // console.log('0000');
    var that = this;
    if (this.data.searchVal != '' && this.data.searchVal != null){
      var history = this.data.history;
      for (var i = 0; i < history.length; i++) {
        if (history[i] == this.data.searchVal) {
          this.data.history.splice(i);
        }
      }
      this.data.history.push(this.data.searchVal);
      wx.setStorage({
        key: "history",
        data: this.data.history
      });
    }
    that.setData({
      searchType: 'text',
      //搜索显示
      visible: 'none'
    })
    that.searchList();
  },
  /**
  * 通过历史记录查询
  */
  searchHistory(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      searchVal: index
    });
    this.search();
  },
  //调用接口查询数据
  searchList: function () {
    var that = this;
    that.setData({
      offset: 0,
      limit: 10,
      searchData: [],
      //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
      isShow: true,
      loadType: true,
      loadMsg: '正在加载中...',
    });
    if (that.data.searchType == 'text') {
      var data={};
      util.doPost("/housekeepers?offset=" + that.data.offset + "&limit=" + that.data.limit + "&text=" + that.data.searchVal, data, function (res) {
        // console.log('列表',res);
        that.setData({
          searchData: res
        })
        if (that.data.searchData.length == 0) {
          that.setData({
            //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
            isShow: true,
            loadType: false,
            loadMsg: '暂无数据',
          });
        } else {
          // 隐藏加载框
          that.setData({
            searchData: that.data.searchData,
            isShow: false,
          });
        }
      })
    } else if (that.data.searchType =='pic'){
      var data = {
        offset: 0,
        limit: 10,
        text: ''
      }
      console.log(111111111)
      util.doPostImgData("/housekeepers", that.data.file, data, function (res) {
        var obj = JSON.parse(res);
        that.setData({
          searchData: obj
        })
        console.log(obj);
        if (that.data.searchData.length == 0) {
          that.setData({
            //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
            isShow: true,
            loadType: false,
            loadMsg: '暂无数据',
          });
        } else {
          // 隐藏加载框
          that.setData({
            searchData: that.data.searchData,
            isShow: false,
          });
        }
      })
    }
  },

  //数据查询--上拉加载更多
  searchListMore: function () {
    var that = this;
    that.setData({
      offset: that.data.offset,
      limit: 10,
      //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
      isShow: true,
      loadType: true,
      loadMsg: '正在加载中...',
    });
    if (that.data.searchType == 'text') {
      var data = {};
      util.doPost("/housekeepers?offset=" + that.data.offset + "&limit=" + that.data.limit+"&text=" + that.data.searchVal, data, function (res) {
        that.setData({
          searchMoreData: res
        })
        // console.log(that.data.searchMoreData);
        that.doData();
      })
    } else if (that.data.searchType == 'pic') {
      var data = {
        offset: that.data.offset,
        limit: that.data.limit,
        text: ''
      }
      util.doPostImgData("/housekeepers", that.data.file, data, function (res) {
        var obj = JSON.parse(res);
        that.setData({
          searchMoreData: obj
        })
        that.doData();
      })
    }
  },
  //数据处理
  doData:function(){
    var that = this;
    var searchMoreData = that.data.searchMoreData;
    if(searchMoreData.length == 0) {
      that.setData({
        //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
        isShow: true,
        loadType: false,
        loadMsg: '已无更多数据',
      });
    } else {
      for (var i = 0; i < searchMoreData.length; i++) {
        that.data.searchData.push(searchMoreData[i]);
      }
      that.setData({
        searchData: that.data.searchData,
        isShow: false,
      });
    }
  }, 
 
  /**
  * 通过姓名，电话，身份证查找--根据历史搜索
  */
  historySerach: function () {
    //模态框显示隐藏
    this.setData({
      showBottom: !this.data.showBottom,
      isShow: this.data.showBottom,
    });
    this.searchList();
  },

  //阿姨详细信息
  toDetail: function (e) {
    var id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../housekeeperDetail/housekeeperDetail?housekeeperId=' + id,
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 40,
          bodyHeight: res.windowHeight
        });
      }
    });
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
    this.setData({
      offset: this.data.offset += 10
    })
    this.searchListMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})