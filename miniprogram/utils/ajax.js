
const api = 'https://www.chinasolargard.com';

function request(opt) {
  // set token
  wx.showLoading()
  wx.request({
    method: opt.method || 'GET',
    url: api + opt.url,
    header: {
      'content-type': 'application/json' // 默认值
    },
    data: opt.data,
    success: function (res) {
      wx.hideLoading()
      if (res.data.code == '200') {
        opt.success(res.data.data);
      } else {
        console.error(res);
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
      }
    }
  })
}
module.exports.request = request