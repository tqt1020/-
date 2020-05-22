//index.js
const app = getApp()
const ajax = require('../../utils/ajax.js');
var page = 1
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    host: getApp().globalData.baseUrl,
    carouselList: null,
    currentIndex:0,
    type:'1',
    currentPage:'1',
    pageSize:'2',
    categoryList:[],
    newsList:[]
  },

  onLoad: function() {
    var that = this;
    that.requestCarouselListData();//请求轮播图
    that.requestNewscenterData();//请求新闻中心
    that.requestMastproductData();//请求核心产品图
  },
  //请求轮播图
  requestCarouselListData() {
    var that = this;//注意this指向性问题
    ajax.request({
      method: 'POST',
      url: "/api/banner/selectAll",
      data: null,
      success: res => {
        that.setData({
          carouselList: res
        })
      }, fail: function (res) {
        wx.hideLoading()
        console.log(res)
      }
    })
  },
  //点击了轮播图
  chomeCarouselClick: function (event) {
    var urlStr = event.currentTarget.dataset.url;
    console.log("点击了轮播图：" + urlStr);
    // wx.navigateTo({
    //   url: 'test?id=1'
    // })
  },
  //核心产品图
  requestMastproductData(){
    var that = this;
    ajax.request({
      method: 'GET',
      url: '/api/productcenter/queryProductCenterForHome',
      success: res => {
        console.log(res)
        that.setData({
          categoryList: res
        })
      }, fail: function (res) {
        wx.hideLoading()
        console.log(res)
      }
    })
  },
  //请求新闻中
  requestNewscenterData(){
    var that = this;
    ajax.request({
      method: 'POST',
      url: "/api/airtle/queryAirtleList?type=" + that.data.type + '&currentPage=' + that.data.currentPage + '&pageSize=' + that.data.pageSize,
      success: res => {
        //console.log(res)
        that.setData({
          newsList: res.list
        })
      }, fail: function (res) {
        wx.hideLoading()
        console.log(res)
      }
    })
  },
  //swiper切换时会调用
  pagechange: function (e) {
    this.setData({
      currentIndex: e.detail.current,
    })
  },
  //用户点击tab时调用
  titleClick: function (e) {
    console.log(e);
    var that = this;
    if (this.data.currentIndex === e.currentTarget.dataset.idx) {
      return false;
    } else {
      that.setData({
        currentIndex: e.currentTarget.dataset.idx,
      })
    }
  },
  toDetailFun(e) {
    console.log(e)
    wx.navigateTo({
      url: '../details/details?id=' + e.currentTarget.dataset.id,
    })
  },
  toNewsDetailFun(e) {
    console.log(e)
    wx.navigateTo({
      url: '../news/news?id=' + e.currentTarget.dataset.id,
    })
  },
  toProductFun(e) {
    console.log(e)
    wx.switchTab({
      url: '../product/product'
    })
  },





  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
