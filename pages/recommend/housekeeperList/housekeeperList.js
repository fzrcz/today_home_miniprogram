// pages/recommend/nanny/nanny.js  家政员列表
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spinShow: "none", 
    //当前选中的条件
    checkboxVal:'',
    checkboxValChild:'',
    imgSrc: '/image/commission-banner.png',
    searchData: [],
    checkboxArr: [],
    offset: 0,
    limit: 10,
    //是否隐藏数据加载提示
    hidden: true,
    //scroll-view高度
    scrollHeight: 0,
    //section header 距离 ‘当前顶部’ 距离
    sectionHeaderLocationTop: 0,
    //是否悬停
    fixed: false,
    //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
    isShow: false,
    loadType: true,
    loadMsg: '正在加载中...',
  },
  //加载提示
  showLoad() {
    if (this.data.spinShow == 'block') {
      this.setData({
        spinShow: 'none'
      })
    } else {
      this.setData({
        spinShow: 'block'
      })
    }
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.showLoad();
    that.setData({
      workTypeId: options.workTypeId,
      checkboxVal: "'" + options.workTypeId + "'",
    });
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    this.loadWorkType();
    that.showLoad();
  },
  //查询阿姨类型
  loadWorkType: function () {
    var that = this;
    var data = {
      workTypeId: that.data.workTypeId
    }
    util.doGet("/housekeepersWorkType/children", data, function (res) {
      that.setData({
        checkboxArr: res
      })
      that.searchList();
    })
  },
  //条件筛选
  checkbox: function (e) {
    //获取当前点击的下标
    var index = e.currentTarget.dataset.index;
    //条件集合
    var checkboxArr = this.data.checkboxArr;
    //改变当前选中的checked值
    checkboxArr[index].checked = !checkboxArr[index].checked;
    this.setData({
      checkboxArr: checkboxArr
    });
    this.searchList();
  },
  //数据查询
  searchList:function(){
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
    //条件集合
    var checkboxArr = this.data.checkboxArr;
    var checkboxVal = that.data.checkboxVal;
    var checkboxValChild = '';
    for (var i = 0; i < checkboxArr.length;i++){
      if (checkboxArr[i].checked){
        checkboxValChild = "'" + checkboxArr[i].id + "'," + checkboxValChild
      }
    }
    checkboxValChild = checkboxValChild.substring(0, checkboxValChild.length - 1);
    if (checkboxValChild !=''){
      checkboxVal = checkboxValChild
    }
    //调用接口查询数据
    var data = {
      workTypeIds: checkboxVal,
      offset: that.data.offset,
      limit: that.data.limit
    };
    util.doGet("/housekeepers/workTypes", data, function (res) {
      var searchData=res;
      if (searchData.length==0){
        that.setData({
          //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
          isShow: true,
          loadType: false,
          loadMsg: '暂无数据',
        });
      }else{
        // 隐藏加载框
        that.setData({
          searchData: searchData,
          isShow: false,
        });
      }
    });
  },

  //数据查询--上拉加载更多
  searchListMore: function () {
    var that = this;
    that.setData({
      //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
      isShow: true,
      loadType: true,
      loadMsg: '正在加载中...',
    });
    //条件集合
    var checkboxArr = this.data.checkboxArr;
    var checkboxVal = that.data.checkboxVal;
    var checkboxValChild = '';
    for (var i = 0; i < checkboxArr.length; i++) {
      if (checkboxArr[i].checked) {
        checkboxValChild = "'" + checkboxArr[i].id + "'," + checkboxValChild
      }
    }
    checkboxValChild = checkboxValChild.substring(0, checkboxValChild.length - 1);
    if (checkboxValChild != '') {
      checkboxVal = checkboxValChild
    }
    //调用接口查询数据
    var data = {
      workTypeIds: checkboxVal,
      offset: that.data.offset,
      limit: that.data.limit
    };
    util.doGet("/housekeepers/workTypes", data, function (res) {
      // console.log(res);
      if (res.length !=0){
        for (var i = 0; i < res.length; i++) {
          that.data.searchData.push(res[i]);
        }
        // 隐藏加载框
        that.setData({
          searchData: that.data.searchData,
          //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
          isShow: false,
          scroll: true
        });
      }else{
        that.setData({
          //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
          isShow: true,
          loadType: false,
          loadMsg: '已无更多数据',
        });
      }
    });
  },

  //阿姨详细信息
  toDetail: function (e) {
    var id = e.currentTarget.dataset.index;
    // console.log(id);
    wx.navigateTo({
      url: '../housekeeperDetail/housekeeperDetail?housekeeperId=' + id,
    })
  },

  //页面滑动到底部
  bindDownLoad: function () {
    this.setData({
      offset: this.data.offset += 10
    })
    this.searchListMore();
  },
  //scroll-view滑动
  scroll: function (event) {
    //悬浮
    if (event.detail.scrollTop > this.data.sectionHeaderLocationTop) {
      this.setData({
        fixed: true
      })
    } else {
      this.setData({
        fixed: false
      })
    }
  },

  /**
  * 页面滚动监听
  */
  onPageScroll: function (e) {
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    let query = wx.createSelectorQuery()
    query.select(".section-header").boundingClientRect(function (res) {
      that.setData({
        //section header 距离 ‘当前顶部’ 距离
        sectionHeaderLocationTop: res.top
      })
    }).exec()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  toCommission: function () {
    wx.navigateTo({
      url: '/pages/recommend/commission/commission',
    })
  }
  
})