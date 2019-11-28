import {
  simulated,
  getExamlist,
  findAllexaminfo,
  exportExamInfo,
  postExamResultTime
} from '../../lib/api';
const app = getApp();
Page({
  data: {
    loadstatus: true,

    arrIndex: 0,
    examInfo: {},
    postResult: false,
    examId: '',
    no_data: true,
    progressWidth: 0,
    propmodel: false,
    examName: ''

  },
  getResult(id) { //获取本次考试题目评卷进度
    findAllexaminfo({
      examId: id
    }).then((res) => {
      console.log(res)
      if (res.code == 10000) {
        if (res.data == null || Object.keys(res.data).length == 0) {
          this.setData({
            no_data: true,
            loadstatus: false
          })
          wx.showToast({
            icon: 'none',
            title: '没有考试信息',
            duration: 2000
          });
          return;
        } else {
          var exams = res.data.filter(item => {
            return item.markAll != item.checkAll;
          });
          var uncomplete = exams.length;
          console.log(exams)
          try {
            wx.setStorageSync('uncomplete', uncomplete);
          } catch (e) {
            wx.setStorage({
              key: "uncomplete",
              data: uncomplete
            });
          }
        }

        this.setData({
          examInfo: res.data,
          no_data: false,
          loadstatus: false
        })
        app.globalData.examInfo = res.data;
        var result = false;
        var nums = Object.keys(res.data).length;
        var n = 0;
        for (let key in res.data) {
          if (res.data[key].checkAll == res.data[key].markAll) {
            n++;
          }
        }
        if (n == nums) { //所有的试卷评完了
          this.setData({
            postResult: true
          })
        } else {
          this.setData({
            postResult: false
          })
        }
      }
    })
  },
  postRessult() { //提交评卷结果
    console.log('提交')
    var examid = this.data.examId;
    // wx.redirectTo({
    //   url:`/pages/score/scoreAnalyze/scoreAnalyze?type=1&examId=${this.data.examId}`
    // })
    if (this.data.postResult) {
      postExamResultTime({
        examId: examid
      }).then(res => {
        if (res.code == 10000) {
          wx.redirectTo({
            url: `/pages/gradePreview/gradePreview?id=${examid}`
          })
        }
        console.log(res)
      }).catch(res => {
        console.log(res)
      })

    }
  },
  goMarking(e) {
    console.log(e)
    var total = e.currentTarget.dataset.total;
    wx.navigateTo({
      url: `../marking/marking?questionId=${e.currentTarget.dataset.type}&back=${e.currentTarget.dataset.back}&examId=${this.data.examId}&total=${total}`
    })
  },
  /*右上角菜单*/
  menusHandle(e) {
    var type = e.currentTarget.dataset.type;
    if (type == '1') {
      //返回考试列表
      app.globalData.footerType = 2;
      wx.redirectTo({
        url: `/pages/home/home`
      })
    } else if (type == '2') {
      //补扫试卷
      wx.redirectTo({
        url: `/pages/createExam/createExam?examName=${this.data.examName}&isb=1&id=${this.data.examId}`
      })
    } else if (type == '3') {
      //修改识别结果
      wx.navigateTo({
        url: `/pages/exam/confirmMsg/confirmMsg?examId=${this.data.examId}`
      })
    }
  },
  onLoad(query) {
    // 页面加载
    console.log(query)
    // query.examid = 1104
    // query.examName = '元高分实验中学初二语文'
    if (query.examid) {
      // this.getResult(query.examid)
      this.setData({
        examId: query.examid,
        examName: query.examName
      })
    }
    // var examInfo = {
    //   1077: [{ markAll: 2, questionId: 1077, question: 1, check: 2 }],
    //   1078: [{ markAll: 2, questionId: 1078, question: 2, check: 0 }],
    //   1079: [{ markAll: 2, questionId: 1079, question: 3, check: 0 }],
    //   1079: [{ markAll: 2, questionId: 1079, question: 4, check: 0 }],
    //   1080: [{ markAll: 2, questionId: 1080, question: 5, check: 0 }],
    //   1081: [{ markAll: 2, questionId: 1081, question: 6, check: 0 }],
    //   1082: [{ markAll: 2, questionId: 1082, question: 7, check: 0 }],
    //   1083: [{ markAll: 2, questionId: 1083, question: 8, check: 0 }],
    //   1084: [{ markAll: 2, questionId: 1084, question: 9, check: 0 }],
    //   1085: [{ markAll: 2, questionId: 1085, question: 10, check: 0 }],
    // }
  },
  closeModel() {
    this.setData({
      propmodel: false
    })
  },
  openModel() {
    this.setData({
      propmodel: true
    })
  },
  close() {

  },
  /*统一调用*/
  init() {
    if (this.data.examId) {
      var params = {
        examId: this.data.examId,
      }
      exportExamInfo(params).then((response) => {
        this.getResult(this.data.examId);
      })
    }
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    this.init();
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
});
