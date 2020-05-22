// pages/ours/ours.js
const ajax = require('../../utils/ajax.js');
var page = 1;//默认第一页
var sectionData = [];
var ifLoadMore = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    height:400,
    currentTab:0,
    username: '',
    usertel: '',
    message: ''
  },
  //swiper切换时会调用
  swiperChange: function (e) {
    this.setData({
      currentIndex: e.detail.current,
    })
  },
  swichNav: function (e) {
    console.log(e);
    var that = this;
    if (this.data.currentIndex === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentIndex: e.currentTarget.dataset.current,
      })
    }
  },
  //点击提交表单
  formSubmit:function(e){
    console.log(e);
    var that = this;
    var username = e.detail.value.username;
    console.log(username);
    var usertel = e.detail.value.usertel;
    console.log(usertel);
    var message = e.detail.value.message
    if (username == ''){
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
      })
      return
    }
    if (usertel == '') {
      wx.showToast({
        title: '请输入电话',
        icon: 'none',
      })
      return
    }
     else {
     var reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (!reg.test(usertel)) {
        wx.showToast({
          title: '请输入电话',
        })
        return
      }  
    }
    var dataParams = {
      address:'',
      phone: usertel,
      leaveWord: message,
      name: username
    }
    console.log(dataParams)
    ajax.request({
      method: 'POST',
      url: "/api/ContactUs/addContactUs",
      data: JSON.stringify(dataParams),
      success: res => {
        wx.showToast({
          title: '提交成功'
        })
        that.setData({
          username: '',
          usertel: '',
          message: ''
        },3000)
      }, fail: function (res) {
        wx.hideLoading()
        console.log(res)
      }
    })
  },
  // 获取当前手机信息
    setCanvasSize()  {
        let size  =  {}
        let res  =  wx.getSystemInfoSync()
        let width  =  res.windowWidth
        console.log(res)
        let height  =  res.windowHeight
        size.w  =  width
        size.h  =  height
        return  size
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      height:that.setCanvasSize().h-5
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