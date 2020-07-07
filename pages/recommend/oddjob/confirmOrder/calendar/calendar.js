var util = require('../../../../../utils/util.js');
const app = getApp();
Page({
  data: {
    defaultValue: '',
    //星期数组
    weekText: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    lastMonth: '◀',
    nextMonth: '▶',
    //阿姨人数
    ayinum: 1,
    //当月格子
    thisMonthDays: [],
    //上月格子
    empytGridsBefore: [],
    //下月格子
    empytGridsAfter: [],
    //显示日期
    title: '',
    //格式化日期
    format: '',
    year: 0,
    month: 0,
    date: 0,
    toggleType: 'large',
    scrollLeft: 0,
    //常量 用于匹配是否为当天
    YEAR: 0,
    MONTH: 0,
    DATE: 0,
    afterThirty: 2592000000//三十天的时间差
  },
  onLoad(o){
    console.log(o.productId)
    this.setData({
      productId:o.productId,
      todaytime: o.todaytime
    });
    this.today();
    this.scheduling(o.todaytime, this.data.thisMonthDays);
    if (o.bornDay === '请选择日期') return;
    this.setData({
      select: o.bornDay
    });
  },
  rliyidond(e){
    console.log(e)
    this.setData({
      pointx:e.changedTouches[0].pageX
    })
  },
  rili(e){
    console.log(e)
    console.log(e.changedTouches[0].pageX-this.data.pointx)
    if(e.changedTouches[0].pageX-this.data.pointx<-60)return this.nextMonth()
    if(e.changedTouches[0].pageX-this.data.pointx>60)return this.lastMonth()
  },
  //获取阿姨排班情况
  scheduling(todaytime, thisMonthDays){
    let data={
      productId:this.data.productId,
      appointTime: todaytime
    }
      util.reqLoading(app.globalData.apiUrl, 'MS01201', data, 'POST', '加载中...',res=>{
        console.log(res)
        let data = res.data[0];
        console.log('最大可预约人数：' + data.maxHousekeeper)
        this.setData({
          maxHousekeeper: data.maxHousekeeper
        })
        if (!data.countMap)return;
        console.log(data.countMap)
        //循环数据添加进当前月份
        for (let key in data.countMap){
          if (+key.split("-")[1] === thisMonthDays[0].monthFormat){
            var arr = thisMonthDays.find(function (val) {
              return val.datatime == new Date(key).getTime()
            })
            arr.ayinum = data.maxHousekeeper - data.countMap[key];
          }
          
        }
        this.setData({
          thisMonthDays : thisMonthDays
        })
        console.log(this.data.thisMonthDays)
    })
  },
  //初始化
  display: function(year, month, date) {
    this.setData({
      year,
      month,
      date,
      title: year + '年' + this.zero(month) + '月'
    })
    this.createDays(year, month);
    this.createEmptyGrids(year, month);
  },
  //默认选中当天 并初始化组件
  today: function() {
    let DATE = this.data.defaultValue ? new Date(this.data.defaultValue) : new Date(),
      year = DATE.getFullYear(),
      month = DATE.getMonth() + 1,
      date = DATE.getDate(),
      select = year + '-' + this.zero(month) + '-' + this.zero(date),
      format = new Date(select).getTime();

    this.setData({
      format: format,
      select: select,
      year: year,
      month: month,
      date: date,
      YEAR: year,
      MONTH: month,
      DATE: date,
    })

    //初始化日历组件UI
    this.display(year, month, date);
  },

  //选择 并格式化数据
  select: function(e) {
    let date = e.currentTarget.dataset.date,
      ayinum = e.currentTarget.dataset.ayi,
      tis='',
      select2 = this.data.year + '-' + this.zero(this.data.month) + '-' + this.zero(date),
      select = this.data.year + '-' + this.zero(this.data.month) + '-' + date,
      selecttime = new Date(select).getTime();
    console.log(ayinum)
    if (this.data.format - 56400000 > selecttime || this.data.format + this.data.afterThirty < selecttime)return;
    if (ayinum<=0)return;
    this.setData({
      title: this.data.year + '年' + (this.data.month) + '月' + this.zero(date) + '日',
      select: select,
      select2: select2,
      selecttime: selecttime,
      year: this.data.year,
      month: this.data.month,
      date: this.zero(date)
    });
    if (ayinum==0){
      tis='当前日期暂无人员为您服务，请选择其他时间'
    } else if (ayinum<=3){
      tis = '当前日期服务人数仅剩' + ayinum+'人，请尽快选择'
    }else{
      tis = '当前日期服务人数充足'
    }
    // wx.showModal({
    //   title: '确认日期',
    //   content: tis,
    //   success:res=> {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //       // if (ayinum == 0) return;
    //       // this.choosedaily()
    //     } 
    //   },
    // })
  },
  //上个月
  lastMonth: function() {
    let month = this.data.month == 1 ? 12 : this.data.month - 1;
    let year = this.data.month == 1 ? this.data.year - 1 : this.data.year;
    //初始化日历组件UI
    this.display(year, month, 0);
    this.scheduling(this.data.todaytime, this.data.thisMonthDays);
  },
  //下个月
  nextMonth: function() {
    let month = this.data.month == 12 ? 1 : this.data.month + 1;
    let year = this.data.month == 12 ? this.data.year + 1 : this.data.year;
    //初始化日历组件UI
    this.display(year, month, 0);
    this.scheduling(this.data.todaytime, this.data.thisMonthDays);
  },
  //获取当月天数
  getThisMonthDays: function(year, month) {
    return new Date(year, month, 0).getDate();
  },
  // 绘制当月天数占的格子
  createDays: function(year, month) {
    let thisMonthDays = [],
      days = this.getThisMonthDays(year, month);
    for (let i = 1; i <= days; i++) {
      thisMonthDays.push({
        date: i,
        dateFormat: i,
        monthFormat: this.zero(month),
        week: this.data.weekText[new Date(Date.UTC(year, month - 1, i)).getDay()],
        ayinum: 15,
        datatime: new Date(this.data.year + '-' + this.zero(month) + '-' + this.zero(i)).getTime()
      });
    }
    this.setData({
      thisMonthDays: thisMonthDays
    })
    console.log(this.data.thisMonthDays)
  },
  //获取当月空出的天数
  createEmptyGrids: function(year, month) {
    let week = new Date(Date.UTC(year, month - 1, 1)).getDay(),
      empytGridsBefore = [],
      empytGridsAfter = [],
      emptyDays = (week == 0 ? 7 : week);
    //当月天数
    var thisMonthDays = this.getThisMonthDays(year, month);
    //上月天数
    var preMonthDays = month - 1 < 0 ?
      this.getThisMonthDays(year - 1, 12) :
      this.getThisMonthDays(year, month - 1);

    //空出日期
    for (let i = 1; i <= emptyDays; i++) {
      empytGridsBefore.push(preMonthDays - (emptyDays - i));
    }

    var after = (42 - thisMonthDays - emptyDays) - 7 >= 0 ?
      (42 - thisMonthDays - emptyDays) - 7 :
      (42 - thisMonthDays - emptyDays);
    for (let i = 1; i <= after; i++) {
      empytGridsAfter.push(i);
    }
    this.setData({
      empytGridsAfter,
      empytGridsBefore
    })
  },

  //补全0
  zero: function(i) {
    return i >= 10 ? i : '0' + i;
  },
  //确认
  choosedaily() {
    let pages = getCurrentPages();
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    let prevPage = pages[pages.length - 2];
    console.log(this.data.select)
    // prevPage.__data__.bornDay = this.data.select
    console.log(prevPage)
    prevPage.__data__.bornDay = this.data.select2
    wx.navigateBack({
      delta: 1,
    })
  }

})