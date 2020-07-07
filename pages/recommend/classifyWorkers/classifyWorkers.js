// pages/recommend/classifyWorkers/classifyWorkers.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyList: [{
        imgIcon: "/image/classify-icon-1.png",
        name: "保姆",
        content: "做饭、做卫生、带孩子、照顾老人"
      },
      {
        imgIcon: "/image/classify-icon-2.png",
        name: "月嫂",
        content: "护理新生儿、制作月子餐，多技能更贴心"
      },
      {
        imgIcon: "/image/classify-icon-6.png",
        name: "护工",
        content: "专业、多技能、更贴心的照顾老人"
      },
      {
        imgIcon: "/image/classify-icon-3.png",
        name: "育婴师",
        content: "用爱心托起家庭的未来"
      },
      {
        imgIcon: "/image/classify-icon-5.png",
        name: "育儿嫂",
        content: "快乐宝贝，幸福妈妈"
      },
      {
        imgIcon: "/image/classify-icon-4.png",
        name: "服务合同",
        content: "有合同更省心"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  //跳转对应页面
  lookingNanny: function(e) {
    var clickId = e.currentTarget.dataset.id;
    if(clickId==5){
      wx.navigateTo({
        url: '/pages/recommend/classifyWorkers/serviceContract/serviceContract',
      })
    }else{
      wx.navigateTo({
        url: '/pages/recommend/lookingNanny/lookingNanny?clickId=' + clickId,
      })
    }
  },

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