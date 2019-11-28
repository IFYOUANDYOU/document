// pages/wrongTopic/loseList/loseList.js

import {
  getKnowledgeStudentList
} from '../../../lib/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:1,  //1降序 2 升序
    lostData:'',
    studentData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      lostData: JSON.parse(options.dataInfo)
    },()=>{
      getKnowledgeStudentList({
        examId: options.examId,
        xid: this.data.lostData.knowledgeId,
      }).then(res=>{
        console.log(res)
        this.setData({
          studentData:res.data
        })
      })
    })
    
    console.log(JSON.parse(options.dataInfo))
  },
  sortList(){
    console.log(this.data.lostData)
    this.data.studentData.sort((pre,next)=>{
      return this.data.index == 1 ? (pre.knowledgeLoseCent - next.knowledgeLoseCent) : (next.knowledgeLoseCent - pre.knowledgeLoseCent);
    })
    this.setData({
      index:this.data.index==2?'1':'2',
      studentData: this.data.studentData
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