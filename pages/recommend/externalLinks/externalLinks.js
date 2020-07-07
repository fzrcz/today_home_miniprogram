// pages/recommend/externalLinks/externalLinks.js
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
    var that = this;
    var detailUrl = options.detailUrl;
    console.log("detailUrl=" + detailUrl);
    // 将链接里边的*号改为？，%改为=
    var detailUrl = detailUrl.replace('*', '?');
    console.log("str2为" + detailUrl);
    var detailUrl = detailUrl.replace('%', '=');
    console.log("str3为" + detailUrl);
    that.setData({
      detailUrl: detailUrl,
    })

    // 截取到productId
    // var index = detailUrl.indexOf("=");
    // console.log("------------"+index)
    // var productId = detailUrl.substring(index+1);
    // console.log("------------" + productId)
    // 商品的访问量
    // var data = {
    //   accountId: app.data.accountId,
    //   productId: productId,
    //   source: options.source,// 来源： 
    //   channel: 1,// 渠道 1 H5  2 小程序
    // }
    // console.log("H5商品的访问量传参")
    // console.log(data)
    // util.reqLoading(app.globalData.apiUrl, 'MS00602', data, 'POST', '加载中...', function (res) {
    //   console.log("H5商品访问量返回：");
    //   console.log(res);
    // })

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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})