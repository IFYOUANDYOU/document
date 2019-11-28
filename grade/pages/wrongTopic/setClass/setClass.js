// pages/wrongTopic/setClass/setClass.js
let getclass = {
  "teacherName": "🐔 ",
  "subject": "语文",
  "teacherFrom": "元阅",
  "id": 408,
  "ClasseList": [
      {
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
    teacherId: "",
    teacherFrom: "",
    teacherName: "",
    subject: "",
    classList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPageData();
  },

  initPageData(){
    let classlist = getclass.ClasseList;
    classlist.forEach(item => {
      item.selected = false;
    })
    this.setData({
      teacherId: getclass.id,
      teacherFrom: getclass.teacherFrom,
      teacherName: getclass.teacherName,
      subject: getclass.subject,
      classList: classlist
    })
  },

  //选择班级
  selectClass(e){
    let classlist = this.data.classList;
    let id = e.currentTarget.dataset.id;
    classlist.forEach(item => {
      if(item.id == id){
        item.selected = !item.selected;
      }
    })
    this.setData({
      classList: classlist
    })
    wx.navigateTo({
      url: '/pages/wrongTopic/reports/reports'
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