let getclass = {
  "teacherName": "🐔 ",
  "subject": "语文",
  "teacherFrom": "元阅",
  "id": 408,
  "ClasseList": [{
      "grade": "初中2019级",
      "className": "2班",
      "id": 2167
    },
    {
      "grade": "初中2019级",
      "className": "3班",
      "id": 2168
    }
  ]
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popule: false,
    classList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPageData();
  },

  initPageData() {
    this.setData({
      classList: getclass.ClasseList
    })
  },

  //点击统一调整
  unifyModule(e) {
    let status = e.currentTarget.dataset.status;
    this.setData({
      popule: status == "true"
    })
    // wx.showModal({
    //   content: '统一调整后所有班级将使用一个 错题集模版，确定要调整吗？',
    //   success(res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
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