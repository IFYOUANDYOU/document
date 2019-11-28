

const app = getApp()
import {
  getUnchecked,
  updateTopic,
  topicRule,
  findChecked,
  findStudentUion,
  updateRule,
  uploadSymbolImg
} from '../../lib/api';
// pages/marking/marking.js
// 触摸开始时间
let touchStartTime = 0;
// 触摸结束时间
let touchEndTime = 0;
// 最后一次单击事件点击发生时间
let lastTapTime = 0;
let timers1;
var my_carvas, strat_x, strat_y, end_x, end_y;
let imgobj = {},last_vw,last_vh;
var textArrays = [],oldText = 0,lineArrays = [],oldLine = 0;
var default_text_top = 0,default_text_left = 0;
var x_empty = 0,y_empty = 0;
let largeTimes = 0,largeY = 0,largeH = 0;
var ctx, canvasw = 0, canvash = 0, touchs = [],isHandle = false;//ctx初始化上下文 touchs   isHandle 画布上是否有绘画痕迹
let codeNumber = -1,codeDisable = false;
let canvasImg = "";

Page({
  data: {
    vw: 0,
    vh: 0,
    imgcomplete: false,
    boxTop: 0,
    boxLeft: 0,
    boxBot: 0,
    barHeight: 0,
    page_title: '阅卷',
    judgeAnswer: false,//判断题是否显示 正确答案  testTpye=1
    scoreMark: {}, //分值 及  对错图标
    textMark: [], //文字标记集合
    lineMark: [], //划线集合
    chooseCode: [],//
    keyrows: 1,//横屏下打分数字的列数

    enlargeX: 0,
    enlargeY: 0, //放大坐标图标拖动控制
    isLarge: true,

    textFocusStatus: false,
    canvasImg: "",

    examId: 0,
    questionId: 0,
    back: false,  //false 评卷  true 回评

    current: -1, //keycode控制
    item_current: '', //当前按下数字
    r_model: false, //键盘收起键控制
    longTap: false,//是否长按

    yes: false, //顶部图标控制
    close: true, //顶部图标控制
    line: true, //顶部图标控制
    text: true, //顶部图标控制
    clear: true, //顶部图标控制
    float_bar: false, //菜单栏下面的小菜单
    float_type: 1,

    swiper: {
      imgUrls: [],
      current: 0,
      swiper_type: true,
      allScore: 0,
      answer: '',
      standard: '',
      answer_img: ""
    },
    //topbar: true, //顶部导航显示隐藏
    moreKeyCode: false, //弹起更多分数按钮
    textEnd: false, //输入完成，控制
    t_top: 0, //输入文字坐标
    t_left: 0, //同上
    t_text: "", //输入框输入的文字
    currentAns: 0,
    t_width: 'auto',
    textfocus: false, //textarea聚焦控制
    no_papar: true, //有没有未批改的题，默认为 有
    score_bar: false, //打分浮框，显示与影藏
    // errorIcon: false, //错误图标框显示隐藏
    // errorIconData: [], //坐标集合
    // canvasData: [], //canvas坐标集合
    coreCurrent: 0, //当前打分小题
    // lineCanvas: false, //线条集合显示
    keyCode: [],
    keyCodeNum: 14, //键盘空白
    t_keyCode: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '···'],
    answerArr: [], //答案数据
    touch: {
      distance: 0,
      scale: 1,
      baseWidth: null,
      baseHeight: null,
      scaleWidth: null,
      scaleHeight: null
    },
    title: '待批阅',
    imgwidth: 0,
    imgheight: 0,
    t_imgwidth: 0,
    t_imgheight: 0,
    flag: true, //控制打分开关，防止过快点击
    answerData: [], //答案，划线，文字，集合
    testType: 0,//1 选择题 2 判断题 3 主观题 4 填空题 10 多选题
    
    ruleText: '全选对满分，错选零分，漏选得一半分',
    answerModel: false, //参考答案弹窗
    picHeight: 0,
    picTop: 0,
    move_start_x: 0, //移动初始x值
    paperModel: false,
    marePic: false, //是否是大图显示
    tabType: 1, //tab用来切换题目 答案  参考答案
    touch: { //缩放参数
      distance: '',
      scale: 1
    },
    transverse: false,
    flag_slide: false, //滑动开关，用于控制用户滑动跟缩放行为
    imgload_height: '',
    imgload_width: '',
    screenWidth: '', //设备屏幕宽度
    screenHeight: '', //设备屏幕高度
    
    topic_flag: false, //查看题目
    show_student_list: false, //显示学生姓名列表

    oss_url: '', //oss坐标url参数

    set_flag: false,//多选题规则设置
  },
  onLoad(query) {
    // 页面加载
    console.log(query)

    wx.showLoading("加载中");

    this.setData({
      scoreMark: {},// errorIconData: [],
      textMark: [],// textData: [],
      lineMark: [],// canvasData: [],
    })

    this.initCanvas();

    if (query.questionId) {
      this.setData({
        examId: query.examId,
        questionId: query.questionId,
        back: query.back == 'false'?false:true,
        page_title: query.back == 'false'?'阅卷':'回评卷',
      })
      if (query.back == 'false') {
        this.getCheched(query.examId, query.questionId);
      } else {
        console.log('进入回评')
        this.findChecked(query.examId, query.questionId);
      }
    }
    this.getVh().then(()=>{
      
    });
  },
  onReady() {
    var _this = this;
    // 页面加载完成
  },
  onShow: function () {
    console.log('页面显示')
    var comment = app.globalData.commentData;
    largeTimes = 0;
    if (Object.keys(comment).length > 0) {
      console.log(comment)
      comment.studentNamePic = comment.studentNamePic ? JSON.parse(comment.studentNamePic) : [];
      this.setData({
        page_title: "回评卷",
        imgcomplete: false
      })
      this.handleTopic(comment);
    }
    this.setData({
      yes: false,  //移动
      close: true, //划线
      line: true,  //备注
      text: true,  //收藏
      clear: true, //正确答案
      float_bar: false,
    })
    wx.hideLoading();
  },
  onHide() {
    // 页面隐藏
    console.log('onhide')
    
  },
  onUnload() {
    // 页面被关闭
    console.log('onUnload')
    var swiper = {
      imgUrls: [],
      current: 0,
      swiper_type: true,
      allScore: 0,
      answer: '',
      standard: ''
    };
    this.setData({
      swiper: swiper,
      keyCode: [],
      scoreMark: {},// errorIconData: [],
      textMark: [],// textData: [],
      lineMark: [],// canvasData: [],
      yes: false,
      close: true,
      line: true,
      text: true,
      clear: true,
      score_bar: false,
      show_student_list: false
    })
  },
  //初始化canvas
  initCanvas(e) {
    ctx = wx.createCanvasContext('lineCanvas');//获得Canvas的上下文
  },
  // 画布的触摸移动开始响应
  canvasTouchStart: function (event) {
    if (this.data.close) return false;
    touchs = [];
    let point = { x: event.changedTouches[0].x, y: event.changedTouches[0].y };//获取触摸开始的 x,y
    touchs.push(point);
  },
  // 画布的触摸移动响应
  canvasTouchMove: function (e) {
    if (this.data.close) return false;
    let point = { x: e.touches[0].x, y: e.touches[0].y };
    touchs.push(point);
    if (touchs.length >= 2) {
      this.drawLine(touchs,1);
    }
  },
  // 画布的触摸结束手势响应
  canvasTouchEnd: function (e) {
    if (this.data.close) return false;
    console.log("画布的触摸结束手势响应" + e);//画布的触摸结束手势响应
    for (let i = 0; i < touchs.length; i++) {
      touchs.pop();
    }
    
  },
  canvasTouchCancel: function (e) {
    if (this.data.close) return false;
    console.log("画布的触摸取消响应" + e);//画布的触摸取消响应
  },
  canvasTouchLongtap: function (e) {
    if (this.data.close) return false;
    console.log("画布的长按手势响应" + e);//画布的长按手势响应
  },
  canvasTouchError: function (e) {
    if (this.data.close) return false;
    console.log("画布触摸错误" + e);//画布触摸错误
  },
  //绘制线条
  drawLine: function (touchs,flag) {
    let start = touchs[0];
    let end = touchs[1];
    var lineColor = flag == 1?"#FF6047":"#fff";
    touchs.shift();
    ctx.save();
    ctx.setStrokeStyle(lineColor);//设置线的颜色
    ctx.setLineWidth(1);//设置线的宽度
    ctx.setLineCap('round');//设置线两端端点样式更加圆润
    ctx.setLineJoin('round');//设置两条线连接处更加圆润
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.save();
    ctx.draw(true);
    isHandle = true;
  },
  //清除画布
  clearCanvas: function () {
    var canvasw = this.data.imgload_width,canvash = this.data.imgload_height;
    ctx.clearRect(0, 0, canvasw, canvash);
    ctx.draw(true);
    isHandle = false;
  },
  saveCanvasToimg(e){
    var _this = this;
    var canvasw = _this.data.imgload_width,canvash = _this.data.imgload_height;
    if(!isHandle){
      wx.showToast({
        title: "找不到划线痕迹",
        icon: "none"
      })
      return false;
    }
    _this.saveCanvas().then(res => {
      console.log("保存成功: ", res.data)
      _this.clearCanvas();
      ctx.drawImage(res.data, 0, 0, canvasw, canvash);
      ctx.draw(true);
    }).catch(res => {
      console.log("保存失败: ", res)
    })
  },

  //将canvas的操作保存成图片
  saveCanvas: function () {
    var _this = this;
    wx.showLoading({ title: "正在保存",icon: "none" });
    var examId = _this.data.examId,questionId = _this.data.questionId;
    return new Promise((response,reject)=>{
      ctx.draw(true, wx.canvasToTempFilePath({
        canvasId: 'lineCanvas',
        success: function (res) {
          console.log(res.tempFilePath,wx.getStorageSync('cookieKey'))
          wx.uploadFile({
            url: `https://teacher.yuangaofen.com.cn/examQuestion/symbolUpload/${examId}/${questionId}`,
            filePath: res.tempFilePath,
            name: 'file',
            formData: {
              "examId": examId,
              "id": questionId,
              "file": res.tempFilePath,
            },
            header: {
              "Content-Type": "multipart/form-data",
              "Cookie": wx.getStorageSync('cookieKey'),
            },
            success(res) {
              if(res.statusCode == 200){
                var resdata = JSON.parse(res.data);
                console.log(resdata)
                response(resdata);
              }
            },
            fail(res) {
              reject("保存失败");
            },
            complete(){
              wx.hideLoading();
            }
          });
        },
        fail: function (res) {
          reject("保存失败");
        }
      }));
    })
  },
  /*打开学生姓名下拉框*/
  openStudent() {
    if (!this.data.no_papar) return false;
    var answerImgs = this.data.swiper.imgUrls;
    for (let i in answerImgs) {
      var item = answerImgs[i];
      if (!item.studentNamePic[0].url) {
        item.studentNamePic = JSON.parse(item.studentNamePic);
      }
    }
    this.setData({
      show_student_list: !this.data.show_student_list,
      'swiper.imgUrls': answerImgs
    })
  },
  /*点击选中一个学生姓名*/
  selectStudentId(e) {
    var datas = e.currentTarget.dataset;
    var studentId = datas.uid,examId = datas.eid,questionId = datas.qid,_index = datas.index;
    console.log(studentId,examId,studentId,_index)
    var swiper = this.data.swiper,item = swiper.imgUrls[_index];
    swiper.current = _index;
    this.setData({
      swiper,
      show_student_list: false,
      imgcomplete: false
    })
    this.handleTopic(item);
  },
  /*topbar图标控制事件*/
  yesup: function (e) {
    var type = e.currentTarget.dataset['type'];
    if (!this.data.no_papar || !this.data.imgcomplete) {
      return;
    }
    var swiper = this.data.swiper;
    var testType = this.data.testType;
    if (type == 1) {
      this.setData({
        yes: false,  //移动
        close: true, //划线
        line: true,  //备注
        text: true,  //收藏
        clear: true, //正确答案
        float_bar: false,  //划线、备注浮动菜单
      })
    } else if (type == 2) {
      if (testType == 1) {return}
      this.setData({
        yes: true,  //移动
        close: false, //划线
        line: true,  //备注
        text: true,  //收藏
        clear: true, //正确答案
        //lineCanvas: true,
        float_bar: true,
        float_type: 1,
      })
    } else if (type == 3) {
      if (testType == 1) {return}
      this.setData({
        yes: true,  //移动
        close: true, //划线
        line: false,  //备注
        text: true,  //收藏
        clear: true, //正确答案
        textEnd: false,
        float_bar: true,
        float_type: 2,
        t_top: default_text_top,
        t_left: default_text_left,
        textFocusStatus: false,
      })
    } else if (type == 4) {
      this.setData({
        yes: true,  //移动
        close: true, //划线
        line: true,  //备注
        text: false,  //收藏
        clear: true, //正确答案
        float_bar: false,
      })
      var questionId = swiper.imgUrls[swiper.current].questionId;
      var examId = swiper.imgUrls[swiper.current].examId;
      var id = swiper.imgUrls[swiper.current].id;
      console.log(questionId,examId,id)
      wx.navigateTo({
        url: '/pages/mycollec/mycollec?questionId=' + questionId + '&examId=' + examId + '&id=' + id,
      })
    } else if (type == 5) {
      var answer_pic = swiper.answer.length > 0 ? swiper.answer[0].url : '';
      var answer_img = swiper.answer_img;
      var judgeAnswer = this.data.judgeAnswer;
      judgeAnswer = testType == 1;
      if(testType != 1 && !answer_img){
        wx.showToast({
          title: "暂无答案",
          icon: "none"
        })
        return false
      }
      this.setData({
        yes: true,  //移动
        close: true, //划线
        line: true,  //备注
        text: true,  //收藏
        clear: false, //正确答案
        float_bar: false,
        topic_flag: true,
        'swiper.answer_img': answer_img,
        judgeAnswer,
      })
    }
  },
  yesdown: function () {},
  /*回评本题 / 评阅下一题 / 返回列表 按钮*/
  endHandle(e) {
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      this.reviewPaper();
    } else if (type == 2) {
      if(this.data.back){
        wx.navigateBack({
          delta: 1
        })
      }else{
        this.nextQuestion();
      }
    }
  },
   /*子组件 对错判断 事件*/
  onCounterPlusOne(data) {
    console.log('组件函数', data);
    var index = data.detail;
    var swiper = this.data.swiper;
    var current = swiper.current;
    var newAnserObj = swiper.imgUrls[current];
    newAnserObj.score = index;
    newAnserObj.makingTime = new Date();
    var picHeight = this.data.imgload_height;
    var picWidth = this.data.imgload_width;
    var scoreMark = {};
    var y = 0;
    var x = 0;
    var arr = [];
    // var icon = (index + '').indexOf('.') == -1 ? true : false;
    var icon;
    //重置打分规则
    var allScore = swiper.allScore;
    if(index == 0) {
      icon = 1;//错误 ×
    }else if(index > 0){
      if(index == allScore){
        icon = 2;//全对 √
      }else{
        icon = 3;//部分正确 
      }
    }
    scoreMark = {
      icon: icon,
      x: x,
      score: index == 0 ? 0 : '+ ' + index,
      y: y
    }
    this.setData({
      scoreMark
    })
    
    this.sendAnswer(newAnserObj);
  },
  /*子组件   回评本题 / 评阅下一题 / 返回列表 按钮*/
  backHandle(e) {
    var type = e.detail.type;
    if (type == 1) { //回评本题
      this.reviewPaper();
    } else { //批阅下一题  返回列表
      if(this.data.back){
        wx.navigateBack({
          delta: 1
        })
      }else{
        this.nextQuestion();
      }
    }
  },
  /*回评本题*/
  reviewPaper() {
    var swiper = this.data.swiper;
    var questionId = swiper.imgUrls[0].questionId;
    var examId = swiper.imgUrls[0].examId;
    this.findChecked(examId, questionId);
    this.setData({
      title: '回评卷',
      page_title: '回评卷',
      back: true
    })
  },
  //评阅下一题
  nextQuestion(){
    var _this = this;
    var examInfo = app.globalData.examInfo;
    var examId = _this.data.examId,questionId = _this.data.questionId,back = _this.data.back;
    var exams = [],index = 0;
    wx.getStorage({
      key: 'exams',
      success(res) {
        exams = res.data;
      }
    })
    try {
      exams = wx.getStorageSync('exams');
    } catch (e) {
      if(exams.length == 0){
        for (var i in examInfo) {
          for (var j in examInfo[i]) {
            var item = examInfo[i][j];
            if(item.markAll != item.check){
              exams.push(examInfo[i][j]);
            }
          }
        }
      }
    }
    // console.log(exams)
    // return false;
    
    for(var i in exams){
      if(questionId && exams[i].questionId == questionId){
        index = i;
      }
    }
    if((exams.length == 0) || (index == 0 && exams.length == 1)){
      console.log("complete")
      wx.showToast({
        title: '所有题块已批阅',
        icon: 'none',
        success: () => {
          var timer1 = setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
            clearTimeout(timer1);
          }, 1500)
        }
      })
      return false;
    }
    var exam = {};
    if(index * 1 == exams.length-1){
      exam = exams[0];
    }else{
      exam = exams[index * 1 + 1];
    }
    exams.splice(index,1);//删除数组
    try {
      wx.setStorageSync('exams', exams);
    } catch (e) { 
      wx.setStorage({
        key: "exams",
        data: exams
      });
    }
    console.log(exam,exams)
    if(!exam.questionId || !questionId) return false;
    if(exam.check == exam.markAll){
      console.log('进入回评')
      _this.findChecked(examId, exam.questionId);
      _this.setData({
        title: '回评卷',
        page_title: '回评卷',
        back: true
      })
    }else{
      _this.getCheched(examId, exam.questionId);
    }
    _this.setData({
      scoreMark: {},
      lineMark: [],
      textMark: [],
      current: -1,
      item_current: "",
      questionId: exam.questionId,
      back: exam.check == exam.markAll
    })
  },
  /*开始批阅下一题*/
  startNextPaper() {
    var examInfo = app.globalData.examInfo;
    var that = this;
    var arr = [];
    for (var key in examInfo) {
      var obj = {};
      obj.check = examInfo[key][0].check;
      obj.markAll = examInfo[key][0].markAll;
      obj.questionId = examInfo[key][0].questionId;
      arr.push(obj);
    }
    var len = arr.length;
    var swiper = this.data.swiper;
    var questionId = swiper.imgUrls[0].questionId;
    var index = arr.findIndex(item => item.questionId == questionId);
    var examId = swiper.imgUrls[0].examId;;
    /*递归调用*/
    function nextPaper(n) {
      if (n < len) {
        if (arr[n].markAll == arr[n].check) { //如果下一题已经批阅完，就再下一题
          nextPaper(n + 1);
        } else {
          var next_questionid = arr[index + 1].questionId;
          that.getCheched(examId, next_questionid);
        }
      } else {
        wx.showToast({
          title: '所有题块已批阅',
          icon: 'none',
          success: () => {
            var timer1 = setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
              clearTimeout(timer1)
            }, 1500)
          }
        })
      }
    }
    nextPaper(index + 1);
  },
  openAnswer(e) { //打开参考答案弹窗
    var type = e.currentTarget.dataset.type;
    if (type == 4) {
      this.setData({
        marePic: false,
        answerModel: true
      })
    } else if (type == 3) {
      this.setData({
        marePic: true,
        answerModel: true
      })
    } else if (type == 2) {
      this.setData({
        paperModel: true
      })
    }
  },
  closeAnswer() {
    this.setData({
      topic_flag: false,
      clear: true,
      yes: false
    })
  },
  /*点击放大图片，（增大坐标）*/
  enlargeHandle(e) {
    var swiper = this.data.swiper,current = swiper.current,imgUrl = swiper.imgUrls[current];
    var answers = imgUrl.answerPostion;
    var isLarge = this.data.isLarge;
    if(largeTimes < 3){
      largeTimes ++;
    }else{
      largeTimes = 0;
    }
    isLarge = !(largeTimes == 3);
    for(var j in answers){
      var answer = answers[j];
      var y = answer.positionY,h = answer.default_height;
      var oss_arr = answer.oss_url;
      var markY = y - largeTimes * 10;
      markY = Math.floor(markY);
      var markH = h + largeTimes * 20;
      markH = Math.floor(markH);
      oss_arr = oss_arr.split(",");
      var new_oss = [];
      for (let i = 0; i < oss_arr.length; i++) {
        var oss = oss_arr[i];
        if (oss.indexOf('y_') != -1) {
          var ossy = oss.substring(oss.indexOf('y_'),2);
          ossy += markY * 1;
          new_oss.push(ossy);
        }else if (oss.indexOf('h_') != -1) {
          var ossh = oss.substring(oss.indexOf('h_'),2);
          ossh += markH * 1;
          new_oss.push(ossh);
        }else{
          new_oss.push(oss);
        }
      }
      answer.height = markH * 1;
      answer.oss_url = new_oss.join(",");
    }
    /**if(answers.length > 1){
      if(largeTimes < 3){
        largeTimes ++;
      }else{
        largeTimes = 0;
      }
      for(var j in answers){
        var answer = answers[j];
        var y = answer.positionY,h = answer.height;
        var oss_arr = answer.oss_url;
        var markY = y - largeTimes * 10;
        markY = Math.floor(markY);
        var markH = h + largeTimes * 20;
        markH = Math.floor(markH);
        oss_arr = oss_arr.split(",");
        var new_oss = [];
        for (let i = 0; i < oss_arr.length; i++) {
          var oss = oss_arr[i];
          if (oss.indexOf('y_') != -1) {
            var ossy = oss.substring(oss.indexOf('y_'),2);
            ossy += markY * 1;
            new_oss.push(ossy);
          }else if (oss.indexOf('h_') != -1) {
            var ossh = oss.substring(oss.indexOf('h_'),2);
            ossh += markH * 1;
            new_oss.push(ossh);
          }else{
            new_oss.push(oss);
          }
        }
        answer.oss_url = new_oss.join(",");
      }
      console.log(answers)
    }else{
      var oss_url = answers[0].oss_url;
      var oss_arr = oss_url.split(','),new_oss = [];
      for (let i = 0; i < oss_arr.length; i++) {
        var item = oss_arr[i];
        var mark = item.slice(2) * 1;
        if (item.indexOf('y_') != -1) {
          if(largeTimes == 0){
            largeY = mark;
          }
          mark = largeTimes == 3 ? largeY : mark - 10;
          new_oss.push('y_' + mark);
        }else if (item.indexOf('h_') != -1) {
          if(largeTimes == 0){
            largeH = mark;
          }
          mark = largeTimes == 3 ? largeH : mark + 20;
          new_oss.push('h_' + mark);
        }else{
          new_oss.push(item)
        }
      }
      if(largeTimes < 3){
        largeTimes ++;
      }else{
        largeTimes = 0;
      }
      answers[0].oss_url = new_oss.join(",");
    } */
    console.log(swiper)
    this.setData({
      swiper,
      isLarge
    })
  },
  //拖动点击放大图标
  enlargeMove(e) {
    var left = e.touches[0].clientX;
    var top = e.touches[0].clientY;
    var vw = this.data.screenWidth,vh = this.data.screenHeight;
    if(vw - left < 20) left = vw - 20;
    if(vh - top < 20) top = vh - 20;
    if(left < 20) left = 20;
    if(top < 20) top = 20;
    
    this.setData({
      enlargeX: left,
      enlargeY: top
    })
  },
  imgload(e) {
    var _data = this.data;
    var swiper = _data.swiper,
      current = swiper.current,
      imgUrl = swiper.imgUrls[current];
    var answers = imgUrl.answerPostion;
    console.log('imgload', e);
    imgobj = e ? e : '';
    this.setData({
      imgcomplete: true
    })
    
    var screenWidth = _data.screenWidth;
    var transverse = _data.transverse;
    var vw = _data.vw,
      vh = _data.vh;
    var text_top = 0,
      text_left = 0;
    
    var common_width = vw * 0.95,
      common_height = vh * 0.95;
    if (!vw || !vh) {
      console.log("获取宽高失败")
      this.getVh().then(() => {
        this.imgload(imgobj);
      })
      return false;
    }
    console.log(answers)
    if (answers.length > 1) {
      var imgload_width = 0,imgload_height = 0;
      var scale = (common_width / answers[0].width)<(common_height / answers[0].height)?(common_width / answers[0].width):(common_height / answers[0].height);
      answers.forEach(item => {
        var scale_width = common_width / item.width,
          scale_height = common_height / item.height;
        item.scale = scale_width < scale_height ? scale_width : scale_height;
        if (item.scale < scale) {
          scale = item.scale;
        }
      })
      imgload_width = common_width * 1;
      for (var i = 0; i < answers.length; i++) {
        answers[i].imgload_vw = answers[i].width * scale;
        answers[i].imgload_vh = answers[i].height * scale;
        imgload_height += answers[i].height * scale * 1;
      }
      text_top = imgload_height / 2, text_left = imgload_width / 2;
      default_text_top = text_top;
      default_text_left = text_left;
      /** for (var i = 0; i < answers.length; i++) {
        console.log(answers[i])
        var img_width = answers[i].width,
          img_height = answers[i].height;
        var scale_width = common_height / img_width * img_width,
          scale_height = common_width / img_width * img_height;
        var img_vw = 0,
          img_vh = 0;
        if (img_width > img_height) {
          img_vw = common_width;
          img_vh = scale_height;
          if (img_vh > vh) {
            img_vh = common_height;
            img_vw = scale_width;
          }
        } else {
          img_vh = common_height;
          img_vw = scale_width;
          if (img_vw > vw) {
            img_vw = scale_width;
            img_vh = common_height;
          }
        }
        text_top = img_vh / 2, text_left = img_vw / 2;
        default_text_top = text_top;
        default_text_left = text_left;
        answers[i].imgload_vw = img_vw;
        answers[i].imgload_vh = img_vh;
        imgload_width = img_vw * 1, imgload_height += img_vh * 1;
      }*/
      console.log(swiper,imgload_width,imgload_height,text_top,text_left)
      this.setData({
        swiper,
        imgload_width,
        imgload_height,
        t_top: text_top,
        t_left: text_left,
        flag: true
      })
    } else {
      var img_vw, img_vh;
      var imgload_width = e.detail.width;
      var imgload_height = e.detail.height;

      var common_width = vw * 0.95,
        common_height = vh * 0.95,
        scale_width = common_height / imgload_height * imgload_width,
        scale_height = common_width / imgload_width * imgload_height;

      if (imgload_width > imgload_height) {
        img_vw = common_width;
        img_vh = scale_height;
        if (img_vh > vh) {
          img_vh = common_height;
          img_vw = scale_width;
        }
      } else {
        img_vh = common_height;
        img_vw = scale_width;
        if (img_vw > vw) {
          img_vw = scale_width;
          img_vh = common_height;
        }
      }

      console.log(vw, vh, imgload_width, imgload_height, img_vw, img_vh)

      var text_top = img_vh / 2;
      var text_left = img_vw / 2;

      default_text_top = text_top;
      default_text_left = text_left

      this.setData({
        imgload_width: img_vw,
        imgload_height: img_vh,
        t_top: text_top,
        t_left: text_left,
        flag: true
      })
    }
  },
  //图片加载失败
  imageOnLoadError(){
    console.log('图片加载失败');
    wx.showToast({
      title: "图片加载失败",
      icon: "none"
    })
  },
  prevImg: function () {
    console.log('上一题')
    var swiper = this.data.swiper;
    var imgUrls = swiper.imgUrls;
    var current = swiper.current;
    var answerData = this.data.answerData;
    var answer = this.data.answerArr;
    
    for (let j = 0; j < answer.length; j++) {
      answer[j].value = '';
    }
    var id = '';
    if (current == 0){
      wx.showToast({
        title: "已经是第一张了",
        icon: "none"
      });
      return false;
    }
    current--;
    largeTimes = 0;
    lineArrays = [];
    textArrays = [];
    if (current >= 0) {
      // swiper.current = current -1;
      this.setData({ //清空图片上的图标线条
        scoreMark: {},// errorIconData: [],
        textMark: [],// textData: [],
        lineMark: [],// canvasData: [],
        yes: false,
        close: true,
        line: true,
        text: true,
        clear: true,
        answerArr: answer,
        score_bar: false,
        float_bar: false,
        imgcomplete: false
      })
      //id = swiper.imgUrls[current].id;
      for (var i in imgUrls) {
        if (typeof (imgUrls[i].answerPostion) == "string") {
          imgUrls[i].answerPostion = JSON.parse(imgUrls[i].answerPostion);
        }
        if (typeof (imgUrls[i].studentNamePic) == "string") {
          imgUrls[i].studentNamePic = JSON.parse(imgUrls[i].studentNamePic);
        }
      }
      var item = imgUrls[current];
      this.getPaperInfo(item.symbolMark);
      this.getScore(item.score);
      this.getNextImg();
    } else { //如果等于0，请求已经批改过的
      this.getTopic(swiper.imgUrls[current])
    }
    //swiper.current = current >= 0 ? current : 0;
    this.setData({
      'swiper.current': current >= 0 ? current : 0,
      'swiper.imgUrls': imgUrls,
      'swiper.swiper_type': false,
      'touch.scale': 1,
      float_bar: false,
      moreKeyCode: false,
      imgcomplete: false,
      show_student_list: false
    })
  },
  nextImg: function (data) {
    console.log('下一题');
    var swiper = this.data.swiper;
    var current = swiper.current;
    var title = this.data.title,page_title = this.data.page_title;
    var answerData = this.data.answerData;
    var answer = this.data.answerArr;

    var judge = swiper.imgUrls[current].id;
    var result = answerData.findIndex(item => item.id == judge);
    console.log(answerData)
    if (result == -1 && !data) {
      wx.showToast({
        title: '请先批卷',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (current < (swiper.imgUrls.length - 1)) {
      largeTimes = 0;
      lineArrays = [];
      textArrays = [];
      for (let j = 0; j < answer.length; j++) {
        answer[j].value = '';
      }
      // return
      this.setData({ //清空图片上的图标线条
        scoreMark: {},// errorIconData: [],
        textMark: [],// textData: [],
        lineMark: [],// canvasData: [],
        yes: false,
        close: true,
        line: true,
        text: true,
        clear: true,
        answerArr: answer,
        score_bar: false,
        float_bar: false,
        moreKeyCode: false,
        current: -1,
        imgcomplete: false
      })
      swiper.current = current + 1;
      var id = swiper.imgUrls[swiper.current].id;
      for (let i = 0; i < answerData.length; i++) {
        if (answerData[i].id == id) {
          this.getPaperInfo(answerData[i].symbolMark);
          this.getScore(answerData[i].score);
          break;
        }
      }
      this.getNextImg();
    } else { //没有试卷了
      for (let j = 0; j < answer.length; j++) {
        answer[j].value = '';
      }
      this.setData({ //清空图片上的图标线条
        scoreMark: {},// errorIconData: [],
        textMark: [],// textData: [],
        lineMark: [],// canvasData: [],
        yes: false,
        close: true,
        line: true,
        text: true,
        clear: true,
        answerArr: answer,
        score_bar: false,
        float_bar: false,
        //no_papar: false
      })
      console.log(answerData.length,swiper.imgUrls.length)
      if(answerData.length == swiper.imgUrls.length){
        this.setData({
          no_papar: false,
          page_title: page_title.indexOf("待批阅") != -1?"待批阅： 0":page_title
        })
      }else{
        this.getCheched(swiper.imgUrls[current].examId, swiper.imgUrls[current].questionId);//未评卷完
      }
      return;
    }
    var nextimg = swiper.imgUrls.length - swiper.current;
    var setTitle = page_title.indexOf("待批阅") != -1 ? "待批阅： " + nextimg : page_title;
    wx.setNavigationBarTitle({
      title: setTitle
    })
    this.setData({
      swiper,
      imgcomplete: false,
      page_title: setTitle,
      'swiper.swiper_type.': true,
      float_bar: false,
      show_student_list: false
    })
  },
  /*清楚当前页面操作的标记*/
  clearArrData() {
    if (!this.data.close) {
      this.setData({
        lineMark: []
      })
    } else if (!this.data.line) {
      this.setData({
        textMark: []
      })
    }
  },
  keydown: function (e) {
    console.log("打分")
    if(codeDisable) return false;
    timers1 && clearInterval(timers1);
    // var index = e.currentTarget.dataset['index'];
    var index = this.data.item_current;//获取当前点击的数字（分值）
    var allScore = this.data.swiper.allScore;//获取本题总分值
    var corecurrent = this.data.coreCurrent;
    var len = this.data.answerArr.length;
    var answer = this.data.answerArr;
    var i = corecurrent + 1;
    this.setData({
      current: -1,
      longTap: false
    })
    if (index == '···') { //如果点击省略号则弹出大键盘
      this.setData({
        moreKeyCode: true,
        keyCodeNum: this.countKeycode(1),
        keyCode: answer[corecurrent].allowValue,
      })
    } else { //记录点击进来的分数，目前是第几个小题
      answer[corecurrent].value = index;
      var actionWidth = this.data.imgload_width;
      var actionHeight = this.data.imgload_height;
      var y = actionHeight / 2 - 20;
      var x = actionWidth - 60;
      var scoreMark = this.data.scoreMark;//var arr = [];
      var icon;
      codeDisable = true;
      if(index == 0) {
        icon = 1;//错误 ×
      }else if(index > 0){
        if(index == allScore){
          icon = 2;//全对 √
        }else{
          icon = 3;//部分正确 
        }
      }
      scoreMark = {
        icon: icon,
        x: 0,
        score: index == 0 ? 0 : '+ ' + index,
        y: 0
      }
      this.setData({
        answerArr: answer,
        scoreMark,// errorIconData: arr
        item_current: ''
      })
      console.log('flag', this.data.flag)
      if (i >= len && this.data.flag) {
         //当前题目打分完以后，等待0.5秒跳转下一题
        this.setData({
          flag: false,
          coreCurrent: 0,
          item_current: ''
        })
        var swiper = this.data.swiper;
        var current = swiper.current;
        var newAnserObj = swiper.imgUrls[current];
        newAnserObj.score = index;
        newAnserObj.makingTime = new Date();
        this.sendAnswer(newAnserObj)
        var ti2 = setTimeout(() => { //定时器
          var keycode2 = answer[0].allowValue;
          this.computedKeycode(keycode2);
          this.setData({
            coreCurrent: 0,
            flag: true,
            moreKeyCode: false,
            item_current: ''
          })
          clearTimeout(ti2);
        }, 0.01)
      } else if (i < len) {
        console.log('next')
        var keycode = answer[corecurrent + 1].allowValue;
        this.computedKeycode(keycode);
        this.setData({
          moreKeyCode: false,
          coreCurrent: i,
          item_current: ''
        })
      }
    }
  },
  keyups(event) {  //键盘点击事件
    console.log(event)
    timers1 && clearInterval(timers1);
    if(codeDisable) return false;
    touchStartTime = new Date().getTime();
    var allScore = this.data.swiper.allScore;
    var index = event.currentTarget.dataset['index'];
    //codeNumber = index;
    var i = index == "···" ? 15 : index;
    this.setData({
      current: i,
      item_current: index,
    })
    console.log(index == allScore)
    if(index == allScore) return false;
    timers1 = setInterval(() => {
      touchEndTime = new Date().getTime();
      if ((touchEndTime - touchStartTime) > 400) {
        if ((touchEndTime - touchStartTime) > 800) {
          clearInterval(timers1)
        }
        console.log(index,index == "···" ? index : index + 0.5)
        this.setData({
          item_current: index == "···" ? index : index + 0.5,
          longTap: true
        })
      }
    }, 200)
    
  },
  inputValue(e) { //输入完成触发
    console.log(e.detail)
    var textMark = this.data.textMark;//var input = this.data.textData;
    var obj = {
      x: this.data.t_left,
      y: this.data.t_top,
      value: e.detail.value
    }
    textMark.push(obj);//input.push(obj);
    textArrays.push(obj);//将输入完成之后的文字 坐标存入数组中
    this.setData({
      textMark,//textData: input,
      text: true,
      textEnd: true,
      textfocus: false,
      textFocusStatus: false
    })
  },
  /*禁止用户手指触摸滑动swiper*/
  stopTouchMove: function () {
    return false;
  },
  // 手指触摸事件
  EventHandleStart: function (e) {
    console.log(e)
    strat_x = e.touches[0].clientX; // 手指开始触摸时的x轴 x轴--->相对于画布左边的距离
    strat_y = e.touches[0].clientY; // 手指开始触摸时的y轴 y轴--->相对于画布顶部的距离
    if (!this.data.text) {
      this.setData({
        move_start_x: strat_x,
      })
    }
  },
  // 手指触摸事件
  EventHandleStart: function (e) {
    var _data = this.data;
    if(!_data.close) return false;
    strat_x = e.touches[0].clientX; // 手指开始触摸时的x轴 x轴--->相对于画布左边的距离
    strat_y = e.touches[0].clientY; // 手指开始触摸时的y轴 y轴--->相对于画布顶部的距离
    var boxTop = _data.boxTop,boxLeft = _data.boxLeft,
      vw = _data.vw,
      vh = _data.vh,
      imgload_width = _data.imgload_width,
      imgload_height = _data.imgload_height,
    x_empty = vw * 0.05 / 2 + boxLeft;
    y_empty = (vh - imgload_height) / 2 + boxTop;
    console.log(x_empty,y_empty)
    if (!_data.text) {
      this.setData({
        move_start_x: strat_x,
      })
    }
  },
  textFocusTap(e){
    console.log(this.data.textFocusStatus)
    this.setData({
      textFocusStatus: true
    })
  },
  EventMove(e) { //触摸移动事件
    var _data = this.data;
    if (!_data.close) {
      return
    }
    var move_x = e.touches[0].clientX;
    var move_y = e.touches[0].clientY;
    var imgload_width = _data.imgload_width,
      imgload_height = _data.imgload_height;
    var x = 0,y = 0;
    if (move_x > imgload_width + x_empty - 60) move_x = imgload_width + x_empty - 60;
    if (move_y > imgload_height + y_empty) move_y = imgload_height + y_empty;
    y = move_y - y_empty;
    x = move_x - x_empty - 60;
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    console.log(imgload_width,imgload_height)
    console.log(move_x,move_y)
    console.log(x,y)
    this.setData({
      t_left: x,
      t_top: y,
    })
  },
  
  //手指触摸结束时的事件
  EventHandle: function (e) {
    var _data = this.data;
    end_x = e.changedTouches[0].clientX; // 手指结束触摸时的x轴 x轴--->相对于画布左边的距离
    end_y = e.changedTouches[0].clientY; // 手指结束触摸时的y轴 y轴--->相对于画布顶部的距离
    if (_data.clear && _data.close && _data.line && _data.text) {
      if (end_x > strat_x) { //向左滑动，显示上一题
        console.log('右滑')
        this.prevImg();
      } else if (end_x < strat_x) {
        console.log('左滑')
        this.nextImg();
      }
      return
    }
    
    if (!_data.close) {
      var diff_x = end_x - strat_x,
        diff_y = end_y - strat_y;
      //返回角度,不是弧度
      var deg = 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
      var width = Math.pow((diff_x * diff_x + diff_y * diff_y), 0.5);

      var vh = _data.vh,
        vw = _data.vw,
        boxTop = _data.boxTop,
        screenHeight = _data.screenHeight,
        screenWidth = _data.screenWidth,
        picHeight = _data.imgload_height,
        picWidth = _data.imgload_width;
        console.log(boxTop,picHeight,picWidth)

      var top = strat_y - boxTop - ((vh - picHeight) / 2),left;
      if(screenWidth > screenHeight){
        left = strat_x - (vw - picWidth) / 2;
      }else{
        left = strat_x;
      }

      var lineMark = this.data.lineMark;//var arr = this.data.canvasData;
      
      var obj = {
        left,
        top,
        width: width,
        deg: deg
      }
      lineMark.push(obj);//arr.push(obj);
      lineArrays.push(obj);//将所有线条数据存入 数组中

      this.setData({
        lineMark,//canvasData: arr,
      })
    }
  },
  /*处理各种跳回来的题*/
  handleTopic(data) {
    if (!data) {
      return
    }
    if (data.id) {
      var swiper = this.data.swiper;
      var current = swiper.current;
      var len = swiper.imgUrls.length > 0 ? swiper.imgUrls.length - 1 : 0
      if (current == -1) {
        console.log('当前没有试卷')
        swiper.imgUrls = [];
        swiper.imgUrls.push(data);
        swiper.current = 0;
      } else {
        console.log('中途')
        largeTimes = 0;
        lineArrays = [];
        textArrays = [];
        
        var answerImgs = swiper.imgUrls;
        for (let i in answerImgs) {
          var item = answerImgs[i];
          if (!item.answerPostion[0].url) {
            item.answerPostion = JSON.parse(item.answerPostion);
          }
        }
        var result = swiper.imgUrls.findIndex(item => item.id == data.id);
        if(result != '-1'){
          swiper.current = result;
        }else{
          if(data.symbolMark){
            this.findChecked(data.examId,data.questionId);
          }
        }
        console.log(swiper)
        this.getNextImg();
      }
      this.setData({
        swiper: swiper,
        scoreMark: {},// errorIconData: [],
        textMark: [],// textData: [],
        lineMark: [],// canvasData: [],
        current: -1,
        no_papar: true,
      })
      this.getPaperInfo(data.symbolMark);
      this.getScore(data.score);
      app.globalData.commentData = {};
    }
  },
  countKeycode(type) {
    var corecurrent = this.data.coreCurrent;
    var answer = this.data.answerArr;
    var keycode = answer[corecurrent].allowValue;
    var len = keycode.length;
    var num = 0;
    var width = 0;
    num = Math.ceil(len / 7);
    if (this.data.transverse) { //横屏
      width = num * 10;
    }
    if (type == 1) {
      return num;
    } else {
      return width;
    }
  },
  getScore(data) {
    var answer = this.data.answerArr;
    var score = data;
    console.log(score, 'score')
    for (let i = 0; i < answer.length; i++) {
      answer[i].value = score;
    }
    var keycode = answer[0].allowValue;
    this.computedKeycode(keycode);
    this.setData({
      answerArr: answer,
      score_bar: true,
      moreKeyCode: false
    })
  },
  getPaperInfo(data) {
    // if (!data) {
    //   return
    // }
    var scoreMark = {}, textMark = [], lineMark = [];
    var current = this.data.current;
    if(!!data){
      var arrs = data.split('\t');
      for (let i in arrs) {
        var arr = arrs[i].split('$');
        if (arr[0] == "right" || arr[0] == "error") {//初始化打分
          if (arr[4]) {
            var score = arr[4] == 0?arr[4]:arr[4].split(' ')[1];
            current = Math.floor(score);
          }
          scoreMark = {
            type: arr[0],
            icon: arr[1],
            x: arr[2],
            y: arr[3],
            score: arr[4],
          }
        }else if(arr[0] == "line"){//初始化划线
          var lineObj = {};
          lineObj = {
            left: arr[1] * 1,
            top: arr[2] * 1,
            width: arr[3] * 1,
            deg: arr[4] * 1
          }
          lineMark.push(lineObj);
          //lineArrays = lineMark;
        }else if(arr[0] == "text"){//初始化文字备注
          var textObj = {};
          textObj = {
            x: arr[1] * 1,
            y: arr[2] * 1,
            value: arr[3] == 'NaN'?'':arr[3]
          }
          textMark.push(textObj);
          //textArrays = textMark;
        }
      }
      oldLine = lineMark.length || 0;
      oldText = textMark.length || 0;
    }
    this.setData({
      scoreMark,// textData: textData,
      textMark, // errorIconData: errorData,
      lineMark,// canvasData: lineData,
      current,
      moreKeyCode: false,
      item_current: '',
      enlargeX: this.data.screenWidth * 0.8,
      enlargeY: this.data.screenHeight * 0.75
    })
    
    console.log(this.data.scoreMark,this.data.lineMark,this.data.textMark,this.data.current)
  },
  optionCon() {
    var scoreMark = this.data.scoreMark; //分值
    var textMark = this.data.textMark;//文字标记
    var lineMark = this.data.lineMark;//划线标记
    var con = '';
    // right$x$y$	
    if(scoreMark.icon){
      var type = scoreMark.icon ? 'right' : 'error';
      con += type + '$' + scoreMark.icon + '$' + scoreMark.x + '$' + scoreMark.y + '$' + scoreMark.score + "\t";
    }
    lineMark.forEach(item => {
      con += 'line' + '$' + item.left.toFixed(1) + '$' + item.top.toFixed(1) + '$' + item.width.toFixed(1) + '$' + item.deg.toFixed(1) + '$' + "\t";
    })
    textMark.forEach(item => {
      con += 'text' + '$' + item.x + '$' + item.y + '$' + item.value + '$' + "\t";
    })
    return con;
  },
  getNumber(num) { //计算分数键盘
    if (!num) {
      return 0
    }
    var arr = [];
    for (let i = 0; i <= num; i++) {
      arr.push(i)
    }
    return arr;
  },
  /*计算键盘数量 高度*/
  computedKeycode(arr) {
    var keyCode = [];
    var testType = this.data.testType;
    var transverse = this.data.transverse;
    if(testType == 2){
      // var total = arr[arr.length-1];
      // var pice = total / arr.length;
      // pice = Math.ceil(pice);
      // keyCode = [0,pice * 1,pice * 2,total];
    } else {
      if(transverse) {
        if (arr.length > 12){
          keyCode = arr.slice(0, 11);
          keyCode.push('···');
        }
      }
      if (arr.length > 14) {
        keyCode = arr.slice(0, 13);
        keyCode.push('···');
      } else {
        keyCode = arr;
      }
    }
    var keyCodeNum = arr.length > 7 ? 14 : 7;
    this.setData({
      keyCodeNum,
      keyCode,
    })
  },
  sendAnswer(data) { //发送答案
    console.log("发送答案");
    this.saveCanvas().then(res => {
      if(res){
        console.log("save path: " + res,res.length)
      }
    }).catch(res => {
      wx.showToast({
        title: "保存失败",
        icon: "none"
      })
      return false;
    })
    return false;
    if (!data) {
      return
    }
    var swiper = this.data.swiper;
    var current = swiper.current;
    var swiperTime = 'swiper.imgUrls[' + current + '].makingTime';
    this.setData({
      [swiperTime]: data.makingTime
    })
    data.answerPostion = JSON.stringify(data.answerPostion);
    data.symbolMark = this.optionCon();
    data.studentNamePic = JSON.stringify(data.studentNamePic);
    if (!data.scoreStatus) { //回评卷不加
      data.scoreStatus = true;
    }
    console.log(data)
    /*----- */
    this.pushAnswerData(data);
    updateTopic(JSON.stringify(data)).then((res) => {
      console.log('评分结果', res)
      if (res.code == 10000) {
        console.log(res.data)
        var ti3 = setTimeout(() => {
          this.nextImg('1');
          clearTimeout(ti3);
        }, 500)
      }
    })
  },
  getTopic(data) {
    if (!data) {
      return
    };
    data.answerPostion = JSON.stringify(data.answerPostion);
    data.studentNamePic = JSON.stringify(data.studentNamePic);
    findChecked(JSON.stringify(data)).then((res) => {
      this.mainHandle(res, 2);
    }).then(res=>{
      this.getNextImg();
    })
  },
  findChecked(examId, questionId) { //请求已经评卷过的题块
    if (!examId || !questionId) {
      return
    }
    findStudentUion({
      examId: examId,
      questionId: questionId
    }).then((res) => {
      console.log(res)
      this.mainHandle(res, 1);
    }).then((res) => {
      this.getNextImg();
    })
  },
  getCheched(examId, id) { //获取评卷中所有未打分题目
    var title = this.data.page_title;
    getUnchecked({
      questionId: id,
      examId: examId
    }).then(res => {
      console.log(res)
      if (res.code == 10000) {
        if (!res.data) {
          //var swiper = this.data.swiper;
          this.setData({
            no_papar: false,
            page_title: title.indexOf("待批阅") != -1?"待批阅： 0":title
            //'swiper.current': swiper.current + 1
          })
          return
        }
        largeTimes = 0;
        var type = 1;
        var judgeAnswer = this.data.judgeAnswer;
        if (res.data.type == 1 || res.data.type == 2) {
          type = 1
          judgeAnswer = !this.data.transverse?true:false;
        } else if (res.data.type == 10) {
          type = 2 //多选题
        } else if (res.data.type == 3) {
          type = 3
        } else if (res.data.type == 4) {
          type = 4
        }
        var swiper = this.data.swiper;
        var picdata = res.data.TopicData;
        if(type != 1 && res.data.answer.length != 0){
          var answerImg = JSON.parse(res.data.answer);
          swiper.answer_img = answerImg[0] ? answerImg[0].url : '';
        }
        swiper.rule = res.data.rule?res.data.rule:[]; //多选题规则
        var oss_url = "";
        for (let j = 0; j < picdata.length; j++) {
          var item = picdata[j];
          var reg = new RegExp("\\\\","g");
          // item.studentNamePic = `"\"[{"positionY":470.9786276715411,"url1":"https://dingtalkyuan1.oss-cn-shenzhen.aliyuncs.com/1449/back///userData/ygf/workCheck/ygf_2019-05-27_1558940229514_0_1006a5856feb-3a1f-4d1f-98a7-31296c458bfb/out_0321879735.jpg","width":1987,"url":"https://dingtalkyuan1.oss-cn-shenzhen.aliyuncs.com/1449/back///userData/ygf/workCheck/ygf_2019-05-27_1558940229514_0_1006a5856feb-3a1f-4d1f-98a7-31296c458bfb/out_0321879735.jpg?x-oss-process=image/crop,x_2284,y_471,h_134,w_1987","positionX":2284,"height":134.02137232845894}]"\"`;
          if(reg.test(item.answerPostion)){
            item.answerPostion = item.answerPostion.replace(reg, "");
            var start = item.answerPostion.indexOf("[");
            var end = item.answerPostion.indexOf("]");
            if(start != 0 || end != (item.answerPostion.length-1)){
              item.answerPostion = item.answerPostion.substring(start,end+1);
            }
          }
          //console.log(item.answerPostion)
          item.answerPostion = item.answerPostion ? JSON.parse(item.answerPostion) : [];
          if (item.answerPostion.length > 0) {
            for(var i in item.answerPostion){
              var pic_url = item.answerPostion[i].url;
              try {
                item.answerPostion[i].url = pic_url.substring(0, pic_url.indexOf('?') != -1 ? pic_url.indexOf('?') : 9999);
              } catch (err) {
                item.answerPostion = JSON.parse(item.answerPostion);
                pic_url = item.answerPostion[i].url;
                item.answerPostion[i].url = pic_url.substring(0, pic_url.indexOf('?') != -1 ? pic_url.indexOf('?') : 9999);
              }
              var w = parseInt(item.answerPostion[i].width);
              var h = parseInt(item.answerPostion[i].height);
              var x = parseInt(item.answerPostion[i].positionX);
              var y = parseInt(item.answerPostion[i].positionY);
              if (pic_url.indexOf('?') != -1) {
                item.answerPostion[i].oss_url = pic_url.substring(pic_url.indexOf('?') + 1);
                oss_url = pic_url.substring(pic_url.indexOf('?') + 1);
              }
              if(oss_url == ''){
                oss_url += `x-oss-process=image/crop,x_${x},y_${y},h_${h},w_${w}`;
              }
              if (item.answerPostion[i].oss_url == '') {
                item.answerPostion[i].oss_url += `x-oss-process=image/crop,x_${x},y_${y},h_${h},w_${w}`
              }
            }
          }
          if(reg.test(item.studentNamePic)){
            item.studentNamePic = item.studentNamePic.replace(reg, "");
            var start = item.studentNamePic.indexOf("[");
            var end = item.studentNamePic.indexOf("]");
            if(start != 0 || end != (item.studentNamePic.length-1)){
              item.studentNamePic = item.studentNamePic.substring(start,end+1);
              console.log(item.studentNamePic)
            }
          }
          item.studentNamePic = item.studentNamePic ? JSON.parse(item.studentNamePic) : [];
        }
        console.log(picdata)
        swiper.imgUrls = picdata;
        swiper.current = 0;
        var len = picdata.length;
        swiper.allScore = res.data.score;
        swiper.answer = res.data.questionPic ? JSON.parse(res.data.questionPic) : [];
        swiper.standard = res.data.answer; //参考答案
        swiper.rule = res.data.rule?res.data.rule:[]; //多选题规则
        
        var answerArr = [];
        answerArr.push({
          value: '',
          allowValue: this.getNumber(res.data.score)
        })
        var arr = this.getNumber(res.data.score)
        this.computedKeycode(arr);
        wx.setNavigationBarTitle({
          title: '待批阅： ' + len
        })
        var keyrow = Math.ceil(res.data.score / 6);
        this.setData({
          page_title: '待批阅： ' + len,
          oss_url: oss_url,
          swiper: swiper,
          testType: type,
          coreCurrent: 0,
          answerArr: answerArr,
          no_papar: true,
          keyrows: keyrow,
          judgeAnswer
        })
      } else if (res.code == 10029) {
        wx.setNavigationBarTitle({
          title: '待批阅： 0'
        })
        this.setData({
          page_title: '待批阅： 0',
          no_papar: false,
          'swiper.current': 0
        })
        return
      }
    }).then(res=>{
      this.getNextImg();
    })
  },
  mainHandle(res, flag) {
    if (res.code == 10000) {
      if (!res.data) {
        wx.showToast({
          content: '没有更多试卷了',
          duration: 2000
        })
        return
      }
      largeTimes = 0;
      var swiper = this.data.swiper;
      var picdata;
      var type = this.data.testType;
      var judgeAnswer = this.data.judgeAnswer;
      if (flag == 1) {
        if (res.data.type == 1 || res.data.type == 2) {
          type = 1;
          judgeAnswer = !this.data.transverse?true:false;
        } else if (res.data.type == 10) {
          type = 2 //多选题
        } else if (res.data.type == 3) {
          type = 3
        } else if (res.data.type == 4) {
          type = 4
        }
        picdata = res.data.TopicData;
        /*从最后一个开始*/
        // swiper.current = res.data.TopicData.length-1;
        swiper.allScore = res.data.score;
        swiper.answer = res.data.questionPic ? JSON.parse(res.data.questionPic) : [];
        swiper.standard = res.data.answer; //参考答案
        var answerArr = [];
        answerArr.push({
          value: '',
          allowValue: this.getNumber(res.data.score)
        })
        var arr = this.getNumber(res.data.score);
        this.computedKeycode(arr);
        this.setData({
          answerArr: answerArr
        })
      } else { //------------------------
        picdata = res.data;
      }
      swiper.current = 0;
      if(type != 1){
        var answerImg = JSON.parse(res.data.answer);
        swiper.answer_img = answerImg[0] ? answerImg[0].url : '';
      }
      swiper.rule = res.data.rule?res.data.rule:[]; //多选题规则
      var oss_url = "";
      for (let j = 0; j < picdata.length; j++) {
        var item = picdata[j];
        var reg = new RegExp("\\\\","g");
        // item.studentNamePic = `"\"[{"positionY":470.9786276715411,"url1":"https://dingtalkyuan1.oss-cn-shenzhen.aliyuncs.com/1449/back///userData/ygf/workCheck/ygf_2019-05-27_1558940229514_0_1006a5856feb-3a1f-4d1f-98a7-31296c458bfb/out_0321879735.jpg","width":1987,"url":"https://dingtalkyuan1.oss-cn-shenzhen.aliyuncs.com/1449/back///userData/ygf/workCheck/ygf_2019-05-27_1558940229514_0_1006a5856feb-3a1f-4d1f-98a7-31296c458bfb/out_0321879735.jpg?x-oss-process=image/crop,x_2284,y_471,h_134,w_1987","positionX":2284,"height":134.02137232845894}]"\"`;
        if(reg.test(item.answerPostion)){
          item.answerPostion = item.answerPostion.replace(reg, "");
          var start = item.answerPostion.indexOf("[");
          var end = item.answerPostion.indexOf("]");
          if(start != 0 || end != (item.answerPostion.length-1)){
            item.answerPostion = item.answerPostion.substring(start,end+1);
          }
        }
        //console.log(item.answerPostion)
        item.answerPostion = item.answerPostion ? JSON.parse(item.answerPostion) : [];
        if (item.answerPostion.length > 0) {
          for(var i in item.answerPostion){
            var pic_url = item.answerPostion[i].url;
            try {
              item.answerPostion[i].url = pic_url.substring(0, pic_url.indexOf('?') != -1 ? pic_url.indexOf('?') : 9999);
            } catch (err) {
              item.answerPostion = JSON.parse(item.answerPostion);
              pic_url = item.answerPostion[i].url;
              item.answerPostion[i].url = pic_url.substring(0, pic_url.indexOf('?') != -1 ? pic_url.indexOf('?') : 9999);
            }
            var w = parseInt(item.answerPostion[i].width);
            var h = parseInt(item.answerPostion[i].height);
            var x = parseInt(item.answerPostion[i].positionX);
            var y = parseInt(item.answerPostion[i].positionY);
            if (pic_url.indexOf('?') != -1) {
              item.answerPostion[i].oss_url = pic_url.substring(pic_url.indexOf('?') + 1);
              oss_url = pic_url.substring(pic_url.indexOf('?') + 1);
            }
            if(oss_url == ''){
              oss_url += `x-oss-process=image/crop,x_${x},y_${y},h_${h},w_${w}`;
            }
            if (item.answerPostion[i].oss_url == '') {
              item.answerPostion[i].oss_url += `x-oss-process=image/crop,x_${x},y_${y},h_${h},w_${w}`
            }
          }
        }
        if(reg.test(item.studentNamePic)){
          item.studentNamePic = item.studentNamePic.replace(reg, "");
          var start = item.studentNamePic.indexOf("[");
          var end = item.studentNamePic.indexOf("]");
          if(start != 0 || end != (item.studentNamePic.length-1)){
            item.studentNamePic = item.studentNamePic.substring(start,end+1);
            console.log(item.studentNamePic)
          }
        }
        item.studentNamePic = item.studentNamePic ? JSON.parse(item.studentNamePic) : [];
      }
      console.log(picdata)
      swiper.imgUrls = picdata;
      /*装入已评卷数组 */
      var answerDatas = this.data.answerData;
      for (let i = 0; i < swiper.imgUrls.length; i++) {
        var obj = {};
        obj.id = swiper.imgUrls[i].id;
        obj.score = swiper.imgUrls[i].score;
        obj.symbolMark = swiper.imgUrls[i].symbolMark;
        // console.log('obj',obj)
        if (answerDatas.length > 0) {
          var result = answerDatas.findIndex(item => item.id == obj.id);
          // console.log('result',result)
          if (result >= 0) {
            answerDatas[result] = obj;
          } else {
            answerDatas.push(obj);
          }
        } else {
          answerDatas.push(obj);
        }
      }
      var keyrow = Math.ceil(res.data.score / 6);
      console.log('answerdata', answerDatas)
      wx.setNavigationBarTitle({
        title: '回评卷'
      })
      this.setData({
        title: '回评卷',
        page_title: "回评卷",
        oss_url: oss_url,
        swiper: swiper,
        testType: type,
        coreCurrent: 0,
        answerData: answerDatas,
        judgeAnswer,
        no_papar: true,
        keyrows: keyrow
      })
      this.getPaperInfo(swiper.imgUrls[swiper.current].symbolMark);//初始化页面线条等
      this.getScore(swiper.imgUrls[swiper.current].score);//初始化页面分值
    } else if (res.code == 10029) {
      var title = this.data.title,page_title = this.data.page_title;
      wx.setNavigationBarTitle({
        title: title == '待批阅' ? title + "： 0" : title
      })
      this.setData({
        page_title: page_title == '待批阅' ? page_title + "： 0" : page_title,
        no_papar: false,
        'swiper.current': 0
      })
    }
  },

  getNextImg(){
    console.log("getNextImg",wx.canIUse('getImageInfo'))
    var _this = this;
    if(this.data.imgcomplete) return false;
    if(!wx.canIUse('getImageInfo')){
      _this.setData({
        imgcomplete: true,
      })
    }
    var swiper = _this.data.swiper,current = swiper.current;
    if(current == 0 || current == swiper.imgUrls.length - 1){
      current = 0
    }else{
      current = current + 1;
    }
    var imgUrl = swiper.imgUrls[current] || [];
    var answerArr = imgUrl.answerPostion || [];
    if(!answerArr.length) return false;
    if(typeof(answerArr) == "string"){
      answerArr = JSON.parse(answerArr) || [];
    }
    var imgsrc = [];
    // for(let i = 0;i<answerArr.length;i++){
    //   if(answerArr[i].url && answerArr[i].oss_url){
    //     console.log(answerArr[i].url + "?" + answerArr[i].oss_url)
    //     wx.getImageInfo({
    //       src: answerArr[i].url + "?" + answerArr[i].oss_url,
    //       success (res) {
    //         console.log("成功");
    //       },
    //       fail(res){
    //         console.log("失败");
    //       },
    //       complete(res){
    //         console.log("完成");
    //         _this.setData({
    //           imgcomplete: true
    //         })
    //       }
    //     })
    //   }else{
    //     _this.setData({
    //       imgcomplete: true
    //     })
    //   }
    // }
  },
  
  /*把当前已经评论的题块放进一个数组中*/
  pushAnswerData(data) {
    var obj = {};
    var answerDatas = this.data.answerData;
    obj.id = data.id;
    obj.score = data.score;
    obj.symbolMark = data.symbolMark;
    if (answerDatas.length > 0) {
      var result = answerDatas.findIndex(item => item.id == obj.id);
      if (result >= 0) {
        answerDatas[result] = obj;
      } else {
        answerDatas.push(obj);
      }
    } else {
      answerDatas.push(obj);
    }
    console.log('answerdata', answerDatas)
    this.setData({ //把答案分数，划线 文字等装进数组
      answerData: answerDatas
    })
  },
  //setPropAction
  setPropAction(e){
    var flag = e.currentTarget.dataset.flag;
    var rules = this.data.swiper.rule,chooseCode = [];
    flag = flag > 0;
    for(var i in rules){
      var rule = {};
      if(i == 0){
        rule.title = "漏选零项"
      }
      if(i == 1){
        rule.title = "漏选一项"
      }
      if(i == 2){
        rule.title = "漏选二项"
      }
      if(i == 3){
        rule.title = "漏选三项"
      }
      rule.idd = i;
      rule.num = rules[i];
      chooseCode.push(rule);
    }
    console.log(chooseCode)
    this.setData({
      set_flag: flag,
      chooseCode
    })
  },
  //获取各块宽高
  getVh(){
    return new Promise((response, reject) => {
      wx.getSystemInfo({
        success: (res) => {
          console.log(res)
          var transverse = res.screenWidth > res.screenHeight;
          this.setData({
            screenWidth: res.screenWidth,
            screenHeight: res.screenHeight,
            barHeight: res.statusBarHeight,
            transverse,
            judgeAnswer: transverse ? false : true,
            moreKeyCode: false
          })
        }
      })
      /*进入页面时获取pic 元素的宽高，存下来备用*/
      var query = wx.createSelectorQuery();
      var container = '.contain';
      query.select('.contain').boundingClientRect().exec((res) => {
        console.log(res)
        if (res[0]) {
          this.setData({
            vw: res[0].width,
            vh: res[0].height,
            boxTop: res[0].top,
            boxLeft: res[0].left,
          })
          response();
        }
      })
    })
  },
  //修改打分规则
  resetRules(e){
    var _this = this,_data = _this.data;
    var examId = _data.examId,questionId = _data.questionId
    var scores = _data.swiper.allScore,
      chooseCode = _data.chooseCode,
      rules = _data.swiper.rule;
    var rule1 = e.detail.value.rule1;
    var rule2 = e.detail.value.rule2;
    var rule3 = e.detail.value.rule3;
    var tip = '';
    if(rule1 == ''|| rule2 == ''|| rule3 == ''){
      tip = '请填完所有规则';
    }else if(rule1 > scores || rule2 > scores || rule3 > scores){
      tip = '分值不能大于题目总分';
    }else{
      tip = '规则设置成功';
    }
    if(tip != '规则设置成功'){
      wx.showToast({
        title: tip,
        icon: "none",
        duration: 1000
      });
      return false;
    }

    rules = {"0": rule1,"1": rule2,"2": rule3};
    if(!examId || !questionId || !rules) return false;
    console.log({
      examId: examId,
      questionId: questionId,
      rule: rules
    })
    updateRule({
      examId: examId,
      questionId: questionId,
      rule: rules
    }).then((res)=>{
      console.log(res)
      if(res.code == 10000){
        wx.showToast({
          title: '设置成功',
          success:()=>{
            _this.setData({
              'swiper.rule': rules,
              set_flag: false
            })
          }
        })
      }else{
        wx.showToast("设置成功");
      }
    })
  },
  //tabbar 操作的前进或撤销
  forwardHandle(e) {
    var forward = e.currentTarget.dataset.forward;
    var textMark = this.data.textMark;
    var lineMark = this.data.lineMark;
    //console.log(oldText,textArrays,oldLine,lineMark,lineArrays)
    var close = this.data.close;//是否划线
    var line = this.data.line;//是否备注
    if (!close) {
      if (lineArrays.length == 0) return false;
      if(forward == 1){//前进
        if (lineMark.length - oldLine == lineArrays.length) {
          wx.showToast({
            title: "已经是最新了",
            icon: "none"
          })
          return false
        };
        var cur = (lineArrays.slice(lineMark.length - oldLine,lineMark.length+1))[0];
        lineMark.push(cur)
      }else{//后退
        if (lineMark.length == oldLine) {
          wx.showToast({
            title: "没有了",
            icon: "none"
          })
          return false
        };
        lineMark.pop();
      }
    }
    if (!line) {
      if (textArrays.length == 0) return false;
      if(forward == 1){//前进
        if (textMark.length - oldText == textArrays.length) {
          wx.showToast({
            title: "已经是最新了",
            icon: "none"
          })
          return false
        };
        var cur = (textArrays.slice(textMark.length - oldLine,textMark.length+1))[0];
        textMark.push(cur)
      }else{//后退
        if (textMark.length == 0) {
          wx.showToast({
            title: "没有了",
            icon: "none"
          })
          return false
        };
        textMark.pop();
      }
    }
    this.setData({
      lineMark,
      textMark
    })
  },
  onResize(e){
    var enlargeX = this.data.enlargeX,enlargeY = this.data.enlargeY;
    this.setData({
      vh: 0,
      vw: 0,
      enlargeX: enlargeY,
      enlargeY: enlargeX
    })
    this.getVh().then(()=>{
      this.imgload(imgobj);
      this.computedKeycode(this.data.keyCode);
    });
  }
});
