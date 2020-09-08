// pages/mine/chat/chat.js
Page({

  data: {
    add:0,
    input_value:'',
    input_height:44,
    focus:true,
    thisId:0,
    chatrecordlist:[
      {sendid:1,content:'你好',time:'今天'},
      {sendid:0,content:'？？？',time:'今天'},
      {sendid:1,content:'在吗',time:'今天'},
      {sendid:0,content:'不在，没钱，不爱',time:'今天'},
      {sendid:1,content:'在干嘛',time:'今天'},
      {sendid:0,content:'淦',time:'今天'},
      {sendid:1,content:'新年好',time:'今天'},
      {sendid:0,content:'好',time:'今天'},
      {sendid:1,content:'这句话测试这句话有多长这句话会不会换行11111111111111',time:'今天'},
    ],
    companyId: '',
    emojiChar: ["😠","😩","😲","😰","😒","😍","😜","😝","😋","😘","😚","😷","😳","😃","😅","😆","😁","😂","😊","😄","😢","😭","😨","😣","😡","😌","😖","😔","😱","😪","😏","😓","😫","😉","😤","✊","👍","👋","👏","👌","👎","🙏"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    this.setData({
      companyId: wx.getStorageSync('selectCompany').id
    })
    wx.getSystemInfo({
      success:res=>{
        this.setData({
          windowHeight:res.windowHeight
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  //监听输入框
  change(e){
    this.setData({
      input_value:e.detail.value
    })
  },
  //打开功能栏
  addfunct(){
    this.setData({
      add:1,
      input_height:204
    })
  },
  //打开表情包
  toemoticon(){
    this.setData({
      add:2,
      input_height:204
    })
  },
  //失焦后获取光标位置
  blur(e){
    console.log(e.detail.cursor)
    this.setData({
      cursor:e.detail.cursor,
    })
  },
  //点击表情
  emojiClick(e){
    let value=this.data.input_value,cursor=this.data.cursor;
    value = value.slice(0,cursor) + e.target.dataset.item + value.slice(cursor) 
    this.setData({
      input_value:value
    })
    console.log(e.target.dataset.item)
  },
  //发送
  sendout(){
    console.log('发送的内容:'+this.data.input_value)
  },
  //打开相机或图片
  toalbum(){
    wx.chooseImage({
      count: 3,
      success (res) {
        console.log(res.tempFilePaths)
      }
    })
  },
  //拨打电话
  tocall(e){
    if(this.data.companyId != 2) {
      wx.makePhoneCall({
        phoneNumber: '400-600-6580'
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: '0591-88771616'
      })
    }
    
  }
})