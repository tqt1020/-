//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    host: getApp().globalData.baseUrl,
    carouselList: [
      '',
      '',
      ''
    ],
    currentIndex:0
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
      this.requestCarouselListData();//请求轮播图
    }
    

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  //请求轮播图
  requestCarouselListData() {
    var that = this;//注意this指向性问题
    // var urlStr = that.data.host + "/xjj/chome_carousel_list.json"; //请求连接注意替换（我用本地服务器模拟）
    console.log("请求轮播图：" + urlStr);
    wx.request({
      url: urlStr,
      data: {//这里放请求参数，如果传入参数值不是String，会被转换成String 
        // x: '',
        // y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("轮播图返回值：");
        console.log(res.data.result);
        var resultArr = res.data.result;
        that.setData({
          carouselList: resultArr
        })
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
  //swiper切换时会调用
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % 3
      this.setData({
        currentIndex: currentPageIndex
      })
    }
  },
  //用户点击tab时调用
  titleClick: function (e) {
    let currentPageIndex =
      this.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx
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
