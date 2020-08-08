// common/selectModal/index.js
let WxNotificationCenter = require('../../utils/WxNotificationCenter')
// let util = require('../../utils/util')
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pickerArray: [],
    pickerIndex: 0,
  },
  // observers: {
  //   pickerArray: function(newVal, oldVal) {
  //     console.log('监听数据变化')
  //     console.log(newVal, oldVal)
  //     this.updateData()
  //     // this.setData({
  //     //   pickerArray: newVal
  //     // })
  //   }
  // },
  lifetimes: {
    created() {
      console.log("在组件实例刚刚被创建时执行")
    },
    attached: function() {
      console.log('组件内获取app')
      console.log(app)
      WxNotificationCenter.addNotification('modalShow', (data) => {
        console.log('modal 显示监听了')
        this.setData({
          show: false
        })
      }, this)
      // 在组件实例进入页面节点树时执行
      if(!wx.getStorageSync('selectCompany')) {
        this.setData({
          show: true
        })
      } else {
        this.setData({
          show: false
        })
      }
      console.log('组件内获取分店列表')
      console.log(app.data.companyList)
      // console.log(wx.getStorageSync('companyList'))
      // let companyList = wx.getStorageSync('companyList')
      // let companyList = app.data.companyList
      // this.setData({
      //   pickerArray: companyList
      // })
      
    },
    ready: function() {
      this.updateData()
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    updateData() {
      let companyList = app.data.companyList
      this.setData({
        pickerArray: companyList
      })
    },
    bindPickerChange: function (e) {
      console.log(e)
      console.log('picker发送选择改变，携带值为', e.detail.value)
      console.log(this.data.pickerArray[e.detail.value])
      let companyInfo = this.data.pickerArray[e.detail.value]
      this.setData({
        pickerIndex: e.detail.value
      })
      wx.setStorageSync('selectCompany', companyInfo)
    },
    selectCompany: function(event) {
      console.log(event)
      let pickerIndex = this.data.pickerIndex
      let pickerData = this.data.pickerArray[pickerIndex]
      console.log(pickerData)
      wx.setStorageSync('selectCompany', pickerData)
      WxNotificationCenter.postNotificationName('homeUpdate', pickerData)
      WxNotificationCenter.postNotificationName('categoryUpdate', pickerData)
      WxNotificationCenter.postNotificationName('modalShow', pickerData)
      // this.setData({
      //   show: false
      // })
      // this.triggerEvent('close', {}, {})
    }
    //  bind:close="closeMask"
  }
})
