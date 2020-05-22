// pages/product/product.js
var page = 1;//默认第一页
var sectionData = [];
var ifLoadMore = null;
const ajax = require('../../utils/ajax.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newGoods:[],
    hidden:false,
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.newGoodsShow()
  },

  // 获取数据（分页）
  newGoodsShow: function () {
    var that = this;
    ajax.request({
      method: 'GET',
      url: '/api/productcenter/queryByProductType?type=' + that.data.type + '&currentPage=' + page + '&pageSize=10',
      success: data => {
        var newGoodsData = data.list;
        console.log(data)
        page += 1;
        if (ifLoadMore) {
          //加载更多
          if (newGoodsData.length > 0) {
            sectionData['newGoods'] = sectionData['newGoods'].concat(newGoodsData);
          } else {
            wx.showToast({
              title: '暂无更多内容！',
              icon: 'loading',
              duration: 2000
            })
            ifLoadMore = false;
            this.setData({
              hidden: true
            })
          }
        } else {
          if (ifLoadMore == null) {
            ifLoadMore = true;
            sectionData['newGoods'] = newGoodsData;//刷新
          }
        }
        that.setData({
          newGoods: sectionData['newGoods']
        });
        console.log(that.data.newGoods)
        wx.stopPullDownRefresh();//结束动画
      }
    })
  },
  toDetailFun (e) {
    console.log(e)
    wx.navigateTo({
      url: '../details/details?id=' + e.currentTarget.dataset.id,
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
    console.log("上拉");
    var that = this;
    console.log('加载更多');
    if (ifLoadMore != null) {
      that.newGoodsShow();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})