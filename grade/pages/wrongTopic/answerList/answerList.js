// pages/wrongTopic/answerList.js
import {
  studentMisTakeInfo,
  questionInfo
} from '../../../lib/api';
import Util from '../../../lib/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: '',
    arr: [1, 2],
    showCon: false,
    studentId: 185,
    examId: 1343,
    studentName: '',
    examName: "",
    structerArr: [],
    contentData: '',
  },
  getPaperInfo(data) {
    // if (!data) {
    //   return
    // }
    let scoreMark = {}, textMark = [], lineMark = [];
    let current;
    if (data) {
      var arrs = data.split('\t');
      for (let i in arrs) {
        var arr = arrs[i].split('$');
        if (arr[0] == "right" || arr[0] == "error") {//初始化打分
          if (arr[4]) {
            var score = arr[4] == 0 ? arr[4] : arr[4].split(' ')[1];
            current = Math.floor(score);
          }
          scoreMark = {
            type: arr[0],
            icon: arr[1],
            x: arr[2],
            y: arr[3],
            score: arr[4],
          }
        } else if (arr[0] == "line") {//初始化划线
          var lineObj = {};
          lineObj = {
            left: arr[1] * 1,
            top: arr[2] * 1,
            width: arr[3] * 1,
            deg: arr[4] * 1
          }
          lineMark.push(lineObj);
        } else if (arr[0] == "text") {//初始化文字备注
          var textObj = {};
          textObj = {
            x: arr[1] * 1,
            y: arr[2] * 1,
            value: arr[3] == 'NaN' ? '' : arr[3]
          }
          textMark.push(textObj);
        }
      }
    }
    console.log(scoreMark)
    console.log(textMark)
    console.log(lineMark)
    return {
      scoreMark: scoreMark,
      textMark: textMark,
      lineMark: lineMark
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (!options.info) {
      this.getAnswerList();
      return
    }
    let studentInfo = JSON.parse(options.info);
    this.setData({
      examId: options.examId,
      studentId: studentInfo.student_id || studentInfo.id
    }, () => {
      this.getAnswerList();
    })

  },
  previewTitle(ev) {
    let dataItem = ev.currentTarget.dataset.item,arr=[];
    dataItem.map(item=>{
      arr.push(item.url)
    })
    wx.previewImage({
      current: arr[0],
      urls: arr
    })
  },
  showContent(el) {

    // console.log(el.currentTarget.dataset.index)
    let questionId = el.currentTarget.dataset.info.id;
    let index = el.currentTarget.dataset.index;
    this.data.structerArr[index].active = !this.data.structerArr[index].active;
    this.setData({
      structerArr: this.data.structerArr
    })
    questionInfo({
      questionId: questionId,
      studentId: this.data.studentId,
      examId: this.data.examId
    }).then(res => {
      // console.log(res);
      if (res.code == 10000) {
        this.listContent(res.data, index);
      }
    })
  },
  listContent(data, index) {  //对取到的题块详细内容做处理
    this.getPaperInfo(data.symbol_mark)
  // return

    data.marker = this.getPaperInfo(data.symbol_mark);

    data.answer2 = Util.renderLatex(data.answer2);
    data.avgScore = data.avgScore && data.avgScore.toFixed(2);
    data.title = Util.renderLatex(data.title);
    // console.log(data)
    data.question_pic = data.question_pic && JSON.parse(data.question_pic);
    data.answer_pic = data.answer_pic && JSON.parse(data.answer_pic);
    if (data.like && data.like.length > 0) {
      data.like.map(item => {
        // console.log(item.title)
        item.title = Util.renderLatex(item.title)
        item.answer2 = Util.renderLatex(item.answer2)
        item.parse = Util.renderLatex(item.parse)
        // WxParse.wxParse(`htmlDom`, 'html', item.title, this, 5);
        item.isShow = false;
        return item;
      });
    }

    this.data.structerArr[index].childData = data;
    this.setData({
      structerArr: this.data.structerArr
    })
    // console.log(this.data.structerArr)
  },
  showChild(el) {
    let item = el.currentTarget.dataset.info;
    let parentIndex = el.currentTarget.dataset.parent;
    let childIndex = el.currentTarget.dataset.child;
    // console.log(item);
    this.data.structerArr[parentIndex].childData.like[childIndex].isShow = !this.data.structerArr[parentIndex].childData.like[childIndex].isShow;
    // console.log(this.data.structerArr)
    this.setData({
      structerArr: this.data.structerArr
    })
  },
  getAnswerList() { //获取题块数据
    studentMisTakeInfo({
      studentId: this.data.studentId,
      examId: this.data.examId
    }).then(res => {
      if (res.code != 10000) {
        return
      }
      res.data.structer.map(item => {
        item.active = true;
        return item;
      })
      this.setData({
        showCon: true,
        contentData: res.data,
        studentName: res.data.student_name || '',
        examName: res.data.exam_name || '',
        structerArr: res.data.structer
      })

    })
  },
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: '023-63128778' // 仅为示例，并非真实的电话号码
    })
  },
  toContent(el) {
    let questionId = el.currentTarget.dataset.id;
    this.setData({
      toView: `toView_${questionId}`
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