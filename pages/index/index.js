// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible1: false,
    actions1: [
      {
        name: '选项1',
      },
      {
        name: '选项2'
      },
      {
        name: '去分享',
        icon: 'share',
        openType: 'share'
      }
    ],
    actions2: []

  },
  handleClickMask(){
    this.setData({
      visible2: false
    });
  },
  onShareAppMessage() {
    return {
      title: 'iView Weapp',
      imageUrl: 'https://file.iviewui.com/iview-weapp-logo.png'
    };
  },

  handleOpen1() {
    this.setData({
      visible1: true
    });
  },

  handleCancel1() {
    this.setData({
      visible1: false
    });
  },
  handleCancel2() {
    this.setData({
      visible2: false
    });
  },

  handleOpen2() {
    this.setData({
      visible2: true
    });
  },

  handleCancel2() {
    this.setData({
      visible2: false
    });
  },

  handleClickItem1({ detail }) {
    const index = detail.index + 1;

    $Message({
      content: '点击了选项' + index
    });
  },

  handleClickItem2() {
    const action = [...this.data.actions2];
    action[0].loading = true;

    this.setData({
      actions2: action
    });

    setTimeout(() => {
      action[0].loading = false;
      this.setData({
        visible2: false,
        actions2: action
      });
      $Message({
        content: '删除成功！',
        type: 'success'
      });
    }, 2000);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  toggleLeft1() {
    this.setData({
      showLeft1: !this.data.showLeft1
    });
  },
  toggleLeft2() {
    this.setData({
      showLeft2: !this.data.showLeft2
    });
  },
  toggleRight1() {
    this.setData({
      showRight1: !this.data.showRight1
    });
  },
  toggleRight2() {
    this.setData({
      showRight2: !this.data.showRight2
    });
  },
  toggleBottom() {
    this.setData({
      showBottom: !this.data.showBottom
    });
  },
  toggleTop() {
    this.setData({
      showTop: !this.data.showTop
    });
  },

})