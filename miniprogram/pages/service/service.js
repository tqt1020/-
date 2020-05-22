// pages/service/service.js
const ajax = require('../../utils/ajax.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    host: getApp().globalData.baseUrl,
    currentIndex: 0,
    height: 400,
    txList:[],
    dataList:[],
    txName:'请选择体系',
    sortCarType:'',
    sortType:'',
    sortPp:'',
    carTypeName:'请选择车型',
    ppName:'请选择品牌',
    ppList:[],
    dataPpList:[],
    cxList: [],
    dataCxList: [],
    searchList: null,
    showData:false,
    phone:'',
    showZbData:false,
    zbSearch:null
  },
  //swiper切换时会调用
  pagechange: function (e) {
    this.setData({
      currentIndex: e.detail.current,
    })
  },
  //用户点击tab时调用
  titleClick: function (e) {
    var that = this;
    if (this.data.currentIndex === e.currentTarget.dataset.idx) {
      return false;
    } else {
      that.setData({
        currentIndex: e.currentTarget.dataset.idx,
      })
    }
  },
  // 获取当前手机信息
  setCanvasSize() {
    let  size = {}
    let  res = wx.getSystemInfoSync()
    let  width = res.windowWidth
    console.log(res)
    let  height = res.windowHeight
    size.w = width
    size.h = height
    return size
  },
  getFirstFun(id) {
    var that = this;//注意this指向性问题
    ajax.request({
      method: 'get',
      url: "/api/category/queryAllCategory?parentCategoryId=" +id,
      data: null,
      success: res => {
        var list = []
        if (res.length>0){
          res.forEach(item => {
            list.push(item.name)
          })
        }
        that.setData({
          txList: list,
          dataList: res
        })
      }, fail: function (res) {
        wx.hideLoading()
        console.log(res)
      }
    })
  },
  getTwoFun(id) {
    var that = this;//注意this指向性问题
    ajax.request({
      method: 'get',
      url: "/api/category/queryAllCategory?parentCategoryId=" + id,
      data: null,
      success: res => {
        var list = []
        if (res.length > 0) {
          res.forEach(item => {
            list.push(item.name)
          })
        }
        that.setData({
          ppList: list,
          dataPpList: res
        })
      }, fail: function (res) {
        wx.hideLoading()
        console.log(res)
      }
    })
  },
  getThreeFun(id) {
    var that = this;//注意this指向性问题
    ajax.request({
      method: 'get',
      url: "/api/category/queryAllCategory?parentCategoryId=" + id,
      data: null,
      success: res => {
        var list = []
        if (res.length > 0) {
          res.forEach(item => {
            list.push(item.name)
          })
        }
        that.setData({
          cxList: list,
          dataCxList: res
        })
      }, fail: function (res) {
        wx.hideLoading()
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      height: that.setCanvasSize().h - 60
    })
    that.getFirstFun('')
  },
  sortFolderFun() {
    var that = this
    wx.showActionSheet({
      itemList: that.data.txList,
      success: function (res) {
        console.log(res)
        console.log(that.data.txList)
        var sort = ''
        var name = ''
        var data = that.data.dataList
        var list = that.data.txList
        data.forEach((item,index) => {
          if (index == res.tapIndex){
            sort = item.categoryId
            name = item.name
          }
        })
        console.log(sort)
        that.setData({
          sortType: sort,
          txName:name
        })
        that.getTwoFun(sort)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  sortPpFun() {
    var that = this
    wx.showActionSheet({
      itemList: that.data.ppList,
      success: function (res) {
        console.log(res)
        console.log(that.data.ppList)
        var sort = ''
        var name = ''
        var data = that.data.dataPpList
        var list = that.data.ppList
        data.forEach((item, index) => {
          if (index == res.tapIndex) {
            sort = item.categoryId
            name = item.name
          }
        })
        console.log(sort)
        that.setData({
          sortPp: sort,
          ppName: name
        })
        that.getThreeFun(sort)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  sortTypeFun() {
    var that = this
    wx.showActionSheet({
      itemList: that.data.cxList,
      success: function (res) {
        console.log(res)
        console.log(that.data.cxList)
        var sort = ''
        var name = ''
        var data = that.data.dataCxList
        var list = that.data.cxList
        data.forEach((item, index) => {
          if (index == res.tapIndex) {
            sort = item.categoryId
            name = item.name
          }
        })
        console.log(sort)
        that.setData({
          sortCarType: sort,
          carTypeName: name
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  submitSearchFun() {
    var that = this;//注意this指向性问题
    ajax.request({
      method: 'post',
      url: "/api/product/queryByCategoryId?categoryId=" + that.data.sortCarType,
      success: res => {
        if (!res){
          that.setData({
            showData: false
          })
        } else{ 
          that.setData({
            searchList: res,
            showData: true
          })
        }
        
      }, fail: function (res) {
        wx.hideLoading()
        console.log(res)
      }
    })
  },
  inputChange(e){
    var that = this
    console.log(e)
    that.setData({
      phone: e.detail.value
    })
  },
  searchZbFun() {
    var that = this;//注意this指向性问题
    ajax.request({
      method: 'post',
      url: "/api/qualityAssurance/queryByKey?key=" + that.data.phone,
      success: res => {
        if (res.length>0) {
          that.setData({
            zbSearch: res[0],
            showZbData: true
          })
        } else {
          that.setData({
            showZbData: false
          })
          
        }

      }, fail: function (res) {
        wx.hideLoading()
        console.log(res)
      }
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})