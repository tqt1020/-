// pages/details/details.js
const ajax = require('../../utils/ajax.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo: null,
    airtleId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      airtleId: options.id
    })
    that.getInfo(options.id)
  },
  getInfo(airtleId) {
    var that = this;//注意this指向性问题
    ajax.request({
      method: 'get',
      url: "/api/airtle/queryAirtleDetail?airtleId=" + airtleId,
      data: null,
      success: res => {
        that.setData({
          dataInfo: res
        })
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