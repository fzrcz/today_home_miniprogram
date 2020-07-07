// 查询所有阿姨
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spinShow: "none",
    //职业类型-一级
    parentWorkType: [],
    //职业类型-一级值
    current: '',
    //职业类型-二级-保姆
    bmArr: [],
    //职业类型-二级-月嫂
    ysArr: [],
    //当前选中的条件
    checkboxVal: '',
    //列表数据
    offset: 0,
    limit: 10,
    searchData:[],
    imgSrc: '/image/commission-banner.png',
    //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
    isShow: false,
    loadType: true,
    loadMsg: '正在加载中...',
    //scroll-view高度
    scrollHeight: 0,
    //section header 距离 ‘当前顶部’ 距离
    sectionHeaderLocationTop: 0,
    //是否悬停
    fixed: false,
    //显示阿姨类型二级
    fixedBm: false,
    fixedYs : true,
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
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    this.loadParentWorkType();
  },
  //查询阿姨类型-一级
  loadParentWorkType: function () {
    var that = this;
    util.doBaseGet("/housekeepersWorkType/parent", function (res) {
      // console.log(res);
      that.setData({
        parentWorkType: res,
        current:res[0].id,
      })
      that.loadChildrenWorkType(res[0].id, res[0].name);
      that.loadChildrenWorkType(res[1].id, res[1].name);
      that.searchList();
    })
  },
  //标签切换-阿姨类型一级
  handleChange({ detail }) {
    var that =this;
    var fixedBm = true;
    var fixedYs = true;
    //改变当前选中的checked值
    var key = detail.key;
    var name='';
    var arr = that.data.parentWorkType;
    for(var i=0;i<arr.length;i++){
      if(arr[i].id == key){
        name = arr[i].name;
      }
    }
    if (name == '保姆') {
      fixedBm = false;
      fixedYs = true;
    }
    if (name == '月嫂') {
      fixedBm = true;
      fixedYs = false;
    }
    this.setData({
      current: key,
      fixedBm: fixedBm,
      fixedYs: fixedYs
    });
    that.searchList();
  },

  //查询阿姨类型-二级
  loadChildrenWorkType: function (id,name) {
    var that= this;
    // console.log(id + name);
    var that = this;
    var data = {
      workTypeId: id
    }
    util.doGet("/housekeepersWorkType/children", data, function (res) {
      console.log(res);
      if (name =='保姆'){
        that.setData({
          bmArr: res
        });
      }
      if(name == '月嫂'){
        that.setData({
          ysArr: res
        });
      }
    })
  },
  //多选--保姆
  checkboxBm: function (e) {
    var that = this;
    //获取当前点击的下标
    var index = e.currentTarget.dataset.index;
    //选项集合
    var checkboxArr = this.data.bmArr;
    //改变当前选中的checked值
    checkboxArr[index].checked = !checkboxArr[index].checked;
    this.setData({
      bmArr: checkboxArr
    });
    that.searchList();
  },
  //多选--月嫂
  checkboxYs: function (e) {
    var that = this;
    //获取当前点击的下标
    var index = e.currentTarget.dataset.index;
    //选项集合
    var checkboxArr = this.data.ysArr;
    //改变当前选中的checked值
    checkboxArr[index].checked = !checkboxArr[index].checked;
    this.setData({
      ysArr: checkboxArr
    });
    that.searchList();
  },

  //数据查询
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
    //条件集合
    var current = that.data.current;
    var name = '';
    var arr = that.data.parentWorkType;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id == current) {
        name = arr[i].name;
      }
    }
    var checkboxArr = [];
    var checkboxVal = "'" + current+"'";
    if (name == '保姆') {
      checkboxArr = that.data.bmArr;
    }
    if (name == '月嫂') {
      checkboxArr = that.data.ysArr;
    }
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
    // console.log(checkboxVal);
    //调用接口查询数据
    var data = {
      workTypeIds: checkboxVal,
      offset: that.data.offset,
      limit: that.data.limit
    };
    util.doGet("/housekeepers/workTypes", data, function (res) {
      var searchData = res;
      if (searchData.length == 0) {
        that.setData({
          //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
          isShow: true,
          loadType: false,
          loadMsg: '暂无数据',
          spinShow: 'none'
        });
      } else {
        // 隐藏加载框
        that.setData({
          searchData: searchData,
          isShow: false,
          spinShow: 'none'
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
    var current = that.data.current;
    var name = '';
    var arr = that.data.parentWorkType;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id == current) {
        name = arr[i].name;
      }
    }
    var checkboxArr = [];
    var checkboxVal = "'" + current + "'";
    if (name == '保姆') {
      checkboxArr = that.data.bmArr;
    }
    if (name == '月嫂') {
      checkboxArr = that.data.ysArr;
    }
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
    // console.log(checkboxVal);
    //调用接口查询数据
    var data = {
      workTypeIds: checkboxVal,
      offset: that.data.offset,
      limit: that.data.limit
    };
    util.doGet("/housekeepers/workTypes", data, function (res) {
      console.log(res);
      if (res.length != 0) {
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
      } else {
        that.setData({
          //提示 isShow显示：true,隐藏：false;oadType加载:true,空:false;
          isShow: true,
          loadType: false,
          loadMsg: '已无更多数据',
        });
      }
    });
  },

  //页面滑动到底部
  bindDownLoad: function () {
    this.setData({
      offset: this.data.offset += 10
    })
    this.searchListMore();
  },
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
  //阿姨详细信息
  toDetail: function (e) {
    var id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../housekeeperDetail/housekeeperDetail?housekeeperId='+id,
    })
  },

  toCommission: function () {
    wx.navigateTo({
      url: '/pages/recommend/commission/commission',
    })
  }
})