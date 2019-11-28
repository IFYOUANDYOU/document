

const app = getApp()
import {
  getUnchecked,
  updateTopic,
  topicRule,
  findChecked,
  findStudentUion,
  updateRule,
  getStudentUnionExamMore,
  findAllexaminfo
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
let handle_path = 0, handle_Contexts = [];

var newDist = 0;
var oldDist = 0;
var firstTouchPoint = {x: 0,y: 0};
var inScale = false;

Page({
  data: {
    distance: 0,
    scale: 1,
    scroll_top: 0,
    scroll_left: 0,

    isClear: false,
    clearSize: 20,
    penColor: '#FF6047',
    lineWidth: 2,
    curContexts: [],
    pathCount: 0,
    contextCount: 0,
    textFocusStatus: false,

    vw: 0,
    vh: 0,
    imgcomplete: false,
    boxTop: 0,
    boxLeft: 0,
    boxBot: 0,
    barHeight: 0,//
    page_title: '阅卷',
    judgeAnswer: false,//判断题是否显示 正确答案  testTpye=1
    scoreMark: {}, //分值 及  对错图标
    textMark: [], //文字标记集合
    lineMark: [], //划线集合
    chooseCode: [],//
    keyrows: 1,//横屏下打分数字的列数

    enlargeX: 260,
    enlargeY: 400, //放大坐标图标拖动控制
    isLarge: true,

    examId: 0,
    questionId: 0,
    back: false,  //false 评卷  true 回评

    totalnum: 0,//总数量
    curpage: 1,//当前页码
    allpage: 1,
    alldatas: [],//所有数据

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

  touchstartCallback: function (e) {
    oldDist = 0;
    inScale = true;
    // 单手指缩放开始，不做任何处理
    let _data = this.data;
    if (e.touches.length == 1) return;
    // 当两根手指放上去的时候，将距离(distance)初始化。
    let xMove = e.touches[1].x || e.touches[1].clientX - e.touches[0].x || e.touches[0].clientX;
    let yMove = e.touches[1].y || e.touches[1].clientY - e.touches[0].y || e.touches[0].clientY;
    //计算开始触发两个手指坐标的距离
    let distance = this._spacing(e);
    this.setData({
      'distance': distance,
    })
  },
  touchmoveCallback: function (e) {
    inScale = true;
    // 单手指缩放不做任何操作
    let _data = this.data, f = 0;
    if (e.touches.length == 1) return;
    let scroll_top = _data.scroll_top, scroll_left = _data.scroll_left;
    let imgload_width = _data.imgload_width, imgload_height = _data.imgload_height;
    let swiper = _data.swiper,current = swiper.current,imgUrls = swiper.imgUrls;
    let answers = imgUrls[current].answerPostion;
    //双手指运动 x移动后的坐标和y移动后的坐标
    let xMove = e.touches[1].x || e.touches[1].clientX - e.touches[0].x || e.touches[0].clientX;
    let yMove = e.touches[1].y || e.touches[1].clientY - e.touches[0].y || e.touches[0].clientY;
    if (oldDist == 0) {
      oldDist = this._spacing(e);
    } else {
      newDist = this._spacing(e);
      if (newDist > oldDist + 1) {
        f = newDist / oldDist;
        oldDist = newDist;
      }
      if (newDist < oldDist - 1) {
        f = newDist / oldDist;
        oldDist = newDist;
      }
    }
    //双手指运动新的 ditance
    let distance = this._spacing(e);
    let _calcRatio = this._calcRatio(e);
    
    //计算移动的过程中实际移动了多少的距离
    let distanceDiff = distance - _data.distance;
    let newScale = _data.scale + 0.005 * distanceDiff;
    if (newScale >= 5) newScale = 5;
    if (newScale <= 1) newScale = 1;
    scroll_top = scroll_left + _calcRatio.xRatio * imgload_width * (1 - f);
    scroll_left = scroll_top + _calcRatio.yRatio * imgload_height * (1 - f);
    console.log("scroll_top: " + scroll_top, "scroll_left: " + scroll_left)
    this.setData({
      'distance': distance,
      'scale': newScale,
      scroll_top,
      scroll_left
    })
  },
  _spacing: function (e) {
    console.log(e)
    let x = e.touches[0].x || e.touches[0].clientX - e.touches[1].x || e.touches[1].clientX;
    let y = e.touches[0].y || e.touches[0].clientY - e.touches[1].y || e.touches[1].clientY;
    return Math.sqrt(x * x + y * y);
  },
  _calcRatio: function (e) {
    let x = e.touches[0].x || e.touches[0].clientX + e.touches[1].x || e.touches[1].clientX;
    let y = e.touches[0].y || e.touches[0].clientY + e.touches[1].y || e.touches[1].clientY;
    
    var yRatio = (y / 2 - this.data.scroll_top) / this.data.imgload_height;
    var xRatio = (x / 2 - this.data.scroll_left) / this.data.imgload_width;
    return { xRatio, yRatio }
  },
  onLoad(query) {
    // 页面加载
    console.log("onLoad",query)
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
        totalnum: query.total
      })
      if (query.back == 'false') {
        this.getCheched(query.examId, query.questionId);
      } else {
        console.log('进入回评')
        this.findChecked(query.examId, query.questionId);
      }
    }
  },
  onReady() {
    console.log("onReady")
    var _this = this;
    // 页面加载完成
    _this.getVh();
  },
  onShow: function () {
    console.log('页面显示')
    var comment = app.globalData.commentData;
    largeTimes = 0;
    //this.nextQuestion();
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
      'swiper.swiper_type.': true,
    })
    
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

  initCanvas(){
    this.context = wx.createCanvasContext("lineCanvas", this)
  },

  /**
   * 触摸开始
   */
  canvasTouchStart: function (e) {
    
    if(this.data.close) return false;
    //得到触摸点的坐标
    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y
    var arr = new Array();
    this.data.curContexts[this.data.pathCount] = arr;
    this.setData({
      curContexts: this.data.curContexts,
      contextCount: 0,
    })
    if (!this.data.isClear) { //判断是否启用的橡皮擦功能  ture表示清除  false表示画画
      // 设置画笔颜色
      this.context.setStrokeStyle(this.data.penColor);
      // 设置线条宽度
      this.context.setLineWidth(this.data.lineWidth);
      this.context.setLineCap('round'); // 让线条圆润
      this.context.beginPath();
    }
  },

  /**
   * 手指触摸后移动
   */
  canvasTouchMove: function (e) {
    
    if(this.data.close) return false;
    handle_Contexts = [];
    var startX1 = e.changedTouches[0].x;
    var startY1 = e.changedTouches[0].y;
    var clearSize = this.data.clearSize, clearHalf = clearSize / 2;

    if (this.data.isClear) { //判断是否启用的橡皮擦功能  ture表示清除  false表示画画
      this.context.save();
      this.context.beginPath();
      this.context.arc(startX1, startY1, clearHalf,0,Math.PI * 2);
      this.context.clip();
      this.context.clearRect(startX1 - clearHalf, startY1 - clearHalf, clearSize, clearSize);
      this.context.restore();
    } else {
      this.context.moveTo(this.startX, this.startY)
      this.context.lineTo(startX1, startY1)
      this.context.stroke()
      this.startX = startX1;
      this.startY = startY1;
    }

    //只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟<canvas/>不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个<canvas/>
    var actions = this.context.getActions();
    this.data.curContexts[this.data.pathCount][this.data.contextCount] = actions;
    handle_Contexts = this.data.curContexts.filter(item=>{
      return item;
    })
    this.setData({
      curContexts: this.data.curContexts
    })
    wx.drawCanvas({
      canvasId: 'lineCanvas',
      reserve: true,
      actions: actions // 获取绘图动作数组
    });
    this.data.contextCount++;
  },

  /**
   * 触摸结束
   */
  canvasTouchEnd: function (e) {
    inScale = false;
    if(this.data.close) return false;
    this.canvasTouchMove(e);
    handle_path = this.data.pathCount + 1;
    this.setData({
      pathCount: (this.data.pathCount + 1),
      contextCount: 0
    });
  },
  /**
   * 清除涂鸦信息
   */
  clearLineCanvas: function (options) {
    console.log("clearCanvas");
    this.setData({
      isClear: !this.data.isClear
    });
  },
  /**
   * 回退一步
   */
  revokeCanvas: function (options) {
    if (this.data.close) return false;
    if (this.data.pathCount == 0) {
      wx.showToast({
        title: "没有更多了",
        icon: "none"
      })
      return false;
    }
    let curContexts = this.data.curContexts;
    this.context.clearRect(0, 0, 750, 1280);
    this.context.draw();
    if (this.data.pathCount > 0) {
      var pathCount = this.data.pathCount - 1;
      curContexts.pop();
      for (var i = 0; i < this.data.pathCount - 1; i++) {
        for (var j = 0; j < curContexts[i].length; j++) {
          wx.drawCanvas({
            canvasId: 'lineCanvas',
            reserve: true,
            actions: curContexts[i][j] // 获取绘图动作数组
          });
        }
      }
      //curContexts[pathCount] = null;
      this.setData({
        pathCount: pathCount,
        contextCount: 0,
      });
    }
  },
  /**
   * 前进一步
   */
  forwardCanvas: function (options) {
    if (this.data.close) return false;
    if (this.data.pathCount == handle_path) {
      wx.showToast({
        title: "没有更多了",
        icon: "none"
      })
      return false;
    }
    let curContexts = this.data.curContexts;
    this.context.clearRect(0, 0, 750, 1280);
    this.context.draw();
    var pathCount = this.data.pathCount + 1;
    curContexts.push(handle_Contexts[pathCount - 1]);
    for (var i = 0; i < pathCount; i++) {
      for (var j = 0; j < curContexts[i].length; j++) {
        wx.drawCanvas({
          canvasId: 'lineCanvas',
          reserve: true,
          actions: curContexts[i][j] // 获取绘图动作数组
        });
      }
    }

    this.setData({
      pathCount: pathCount,
      contextCount: 0,
    });
  },
  /**
   * 拖动文本输入框
   */
  EventHandleMove(e) {
    var _data = this.data;
    
    if (_data.line) return false;
    var move_x = e.touches[0].clientX;
    var move_y = e.touches[0].clientY;
    var imgload_width = _data.imgload_width,
      imgload_height = _data.imgload_height;
    var x = 0,
      y = 0;
    if (move_x > imgload_width + x_empty - 60) move_x = imgload_width + x_empty - 60;
    if (move_y > imgload_height + y_empty) move_y = imgload_height + y_empty;
    y = move_y - y_empty;
    x = move_x - x_empty - 60;
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    this.setData({
      t_left: x,
      t_top: y,
    })
  },
  /**
   * 拖动文本输入框
   */
  textFocusTap(e) {
    console.log(this.data.textFocusStatus)
    this.setData({
      textFocusStatus: true
    })
  },
  saveCanvasToimg(e) {
    var _this = this;
    var canvasw = _this.data.imgload_width,
      canvash = _this.data.imgload_height;
    if (this.data.pathCount == 0) {
      wx.showToast({
        title: "找不到划线痕迹",
        icon: "none"
      })
      return false;
    }
    _this.saveCanvas().then(res => {
      console.log("保存成功: ", res.data)
      _this.clearCanvas();
      _this.context.drawImage(res.data, 0, 0, canvasw, canvash);
      _this.context.draw(true);
    }).catch(res => {
      console.log("保存失败: ", res)
    })
  },

  //将canvas的操作保存成图片并上传
  saveCanvas: function () {
    var _this = this;
    if (_this.data.pathCount == 0) {
      wx.showToast({
        title: "找不到划线痕迹",
        icon: "none"
      })
      return false;
    }
    wx.showLoading({
      title: "正在保存",
      icon: "none"
    });
    console.log(1)
    var examId = _this.data.examId,
      questionId = _this.data.questionId;
    return new Promise((response, reject) => {
      _this.context.draw(true, wx.canvasToTempFilePath({
        canvasId: 'lineCanvas',
        success: function (res) {
          console.log(res.tempFilePath, wx.getStorageSync('cookieKey'))
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
              if (res.statusCode == 200) {
                var resdata = JSON.parse(res.data);
                console.log(resdata)
                response(resdata);
              }
            },
            fail(res) {
              reject("保存失败");
            },
            complete() {
              wx.hideLoading();
            }
          });
        }
      }));
    })
  },
  //清除画布
  clearCanvas: function () {
    var canvasw = this.data.imgload_width,
      canvash = this.data.imgload_height;
    this.context.clearRect(0, 0, canvasw, canvash);
    this.context.draw(true);
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
    var studentId = datas.uid,examId = datas.eid,questionId = datas.qid,_index = datas.index,aid = datas.aid;
    var swiper = this.data.swiper;
    var curindex = swiper.imgUrls.findIndex(item => item.id == aid);
    console.log("当前选中学生index：",curindex)
    if(swiper.current == curindex){
      this.setData({
        show_student_list: false,
      })
      return false;
    };
    var item = swiper.imgUrls[curindex];
    swiper.current = curindex;
    this.setData({
      swiper,
      show_student_list: false,
      imgcomplete: false,
      'swiper.swiper_type.': true,
    })
    console.log("当前选中学生item：",item)
    console.log("所有答卷：",swiper)
    
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
        show_student_list: false
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
        show_student_list: false
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
        show_student_list: false
      })
    } else if (type == 4) {
      this.setData({
        yes: true,  //移动
        close: true, //划线
        line: true,  //备注
        text: false,  //收藏
        clear: true, //正确答案
        float_bar: false,
        show_student_list: false
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
      if((testType != 1 && !answer_img) || (testType == 1 && !swiper.standard)){
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
        show_student_list: false
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
    var examId = _this.data.examId,questionId = _this.data.questionId,back = _this.data.back;
    findAllexaminfo({
      examId: examId
    }).then((res) => {
      if (res.code == 10000 && res.data != null && res.data.length != 0) {
        console.log(res.data)
        var exams = res.data,next_questionid;
        var complete = exams.filter(item => {
          return item.markAll != item.checkAll;
        })
        if(complete.length == 0){
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
          return false;
        }else{
          next_questionid = exams[0].questionId;
          _this.getCheched(examId, next_questionid);
        }
        _this.setData({
          scoreMark: {},
          lineMark: [],
          textMark: [],
          current: -1,
          item_current: "",
          questionId: next_questionid,
          back: false
        })
      }
    }).catch(res=>{
      this.errorFun();
    })
  },
  /*开始批阅下一题*/
  startNextPaper() {
    var examInfo = app.globalData.examInfo;
    var that = this;
    var arr = [];
    for (var key in examInfo) {
      var obj = {};
      obj.check = examInfo[key].checkAll;
      obj.markAll = examInfo[key].markAll;
      obj.questionId = examInfo[key].questionId;
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
        if (arr[n].markAll == arr[n].checkAll) { //如果下一题已经批阅完，就再下一题
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
    var canvasw = 0, canvash = 0;
    var swiper = _data.swiper,
      current = swiper.current,
      imgUrl = swiper.imgUrls[current];
    var answers = imgUrl.answerPostion;
    console.log('imgload', e);
    imgobj = e ? e : '';
    
    this.setData({
      imgcomplete: true
    })
    
    var screenWidth = _data.screenWidth,screenHeight = _data.screenHeight;
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
    this.setData({
      enlargeX: screenWidth * 0.75,
      enlargeY: transverse ? 40 : screenHeight * 0.75
    })
    if(!answers[0].url){
      answers = JSON.parse(answers) || [];
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
      canvasw = imgload_width, canvash = imgload_height;
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
      canvasw = imgload_width, canvash = imgload_height;

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
    if (canvasw && canvash && imgUrl.symbolPic){
      console.log("imgload 图片绘画痕迹： ", imgUrl.symbolPic)
      this.context.drawImage(imgUrl.symbolPic, 0, 0, canvasw, canvash);
      this.context.draw(true);
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
    var curItem = swiper.imgUrls[current];
    var answerData = this.data.answerData;
    var answer = this.data.answerArr;
    var alldata = this.data.totalnum,curpage = this.data.curpage,allpage = this.data.allpage,back = this.data.back;
    for (let j = 0; j < answer.length; j++) {
      answer[j].value = '';
    }
    var id = '';
    
    largeTimes = 0;
    lineArrays = [];
    textArrays = [];

    if (current > 0) {
      current = current - 1;
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
    }else{
      if(curpage == 1){
        wx.showToast({
          title: "已经是第一张了",
          icon: "none"
        })
        return false;
      }else{
        curpage--;
        this.setData({
          curpage
        })
        this.getTopic(curItem,-1);
      }
    }
    //swiper.current = current >= 0 ? current : 0;
    this.setData({
      'swiper.current': current >= 0 ? current : 0,
      'swiper.imgUrls': imgUrls,
      'swiper.swiper_type': false,
      float_bar: false,
      moreKeyCode: false,
      imgcomplete: false,
      show_student_list: false
    })
  },
  nextImg: function (data) {
    console.log('下一题');
    var examId = this.data.examId,questionId = this.data.questionId,back = this.data.back;
    var swiper = this.data.swiper;
    var current = swiper.current;
    var curItem = swiper.imgUrls[current];
    var alldata = this.data.totalnum,curpage = this.data.curpage,allpage = this.data.allpage;
    var title = this.data.title,page_title = this.data.page_title;
    var answerData = this.data.answerData;
    var answer = this.data.answerArr;
    var canvasw = this.data.imgload_width, canvash = this.data.imgload_height;

    var judge = swiper.imgUrls[current].id;
    var result = answerData.findIndex(item => item.id == judge);
    console.log(curItem.scoreStatus)
    if (result == -1 && !data || curItem.score == null) {//!curItem.scoreStatus
      wx.showToast({
        title: '请先批卷',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var unImgurls = swiper.imgUrls.filter(item => {
      return item.score == null;
    })

    if((back && current == (swiper.imgUrls.length - 1)) || (unImgurls.length == 0 && !back)){
      console.log("临界点")
      for (let j = 0; j < answer.length; j++) {
        answer[j].value = '';
      }
      curpage++;
      var flag = back ? 2 : 1; //未打分1   已打分2
      this.setData({
        curpage
      })
      this.getTopic(curItem, 1, flag);
      this.setData({ //清空图片上的图标线条
        swiper,
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
      })
    }else{
      console.log("正常切换下一张答卷")
      if(current < (swiper.imgUrls.length - 1)){
        swiper.current = current + 1;
      }else{
        var idindex = unImgurls[0].id;
        var current = swiper.imgUrls.findIndex(item => item.id == idindex);
        swiper.current = current;
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
        moreKeyCode: false,
        current: -1,
        imgcomplete: false
      })
      this.getPaperInfo(swiper.imgUrls[swiper.current].symbolMark);
      this.getScore(swiper.imgUrls[swiper.current].score);
      this.getNextImg();
    }
    
    var nextimg = swiper.imgUrls.length - swiper.current;
    var setTitle = page_title.indexOf("待批阅") != -1 ? "待批阅： " + unImgurls.length : page_title;
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
    timers1 && clearInterval(timers1);
    if(!this.data.flag) return false;
    var index = e.currentTarget.dataset['index'];
    var longTap = this.data.longTap;
    var item_current = this.data.item_current;//获取当前点击的数字（分值）
    var allScore = this.data.swiper.allScore;//获取本题总分值
    if(index != "..."){
      if(longTap) item_current = index + 0.5;
      if(item_current >= allScore){
        item_current = allScore;
      }
    }
    
    var corecurrent = this.data.coreCurrent;
    var len = this.data.answerArr.length;
    var answer = this.data.answerArr;
    var i = corecurrent + 1;
    
    this.setData({
      current: -1,
      longTap: false,
      item_current: index
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
      if(index == 0 && item_current == 0) {
        icon = 1;//错误 ×
      }else if(index > 0 || item_current > 0){
        if(index == allScore || item_current == allScore){
          icon = 2;//全对 √
        }else{
          icon = 3;//部分正确 
        }
      }
      scoreMark = {
        icon: icon,
        x: 0,
        score: "+ " + item_current,
        y: 0
      }
      this.setData({
        answerArr: answer,
        scoreMark,// errorIconData: arr
        item_current: '',
      })
      console.log('flag', this.data.flag)
      if (i >= len && this.data.flag) {
        var _this = this;
        var swiper = _this.data.swiper;
        var current = swiper.current;
        var newAnserObj = swiper.imgUrls[current];
        if(_this.data.pathCount == 0){
          newAnserObj.symbolPic = "";
          tonext();
        }else{
          _this.saveCanvas().then(res=>{
            console.log("批阅痕迹保存成功: ", res.data);
            newAnserObj.symbolPic = res.data;
            _this.clearCanvas();
            _this.context.drawImage(res.data, 0, 0, actionWidth, actionHeight);
            _this.context.draw(true);
            tonext();
          })
        }
        function tonext() {
          //当前题目打分完以后，等待0.5秒跳转下一题
          _this.setData({
            flag: false,
            coreCurrent: 0,
          })
          
          newAnserObj.score = item_current;
          newAnserObj.makingTime = new Date();
          _this.sendAnswer(newAnserObj)
          var ti2 = setTimeout(() => { //定时器
            var keycode2 = answer[0].allowValue;
            _this.computedKeycode(keycode2);
            _this.setData({
              coreCurrent: 0,
              //flag: true,
              moreKeyCode: false,
              item_current: '',
            })
            clearTimeout(ti2);
          }, 2)
        }
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
    if(!this.data.flag) {
      wx.showToast({
        title: "操作过于频繁",//单题评卷不得低于2s
        icon: "none"
      })
      return false;
    };
    touchStartTime = new Date().getTime();
    var allScore = this.data.swiper.allScore;
    var index = event.currentTarget.dataset['index'];
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
    var _data = this.data;
    strat_x = e.touches[0].clientX; // 手指开始触摸时的x轴 x轴--->相对于画布左边的距离
    strat_y = e.touches[0].clientY; // 手指开始触摸时的y轴 y轴--->相对于画布顶部的距离
    var boxTop = _data.boxTop,boxLeft = _data.boxLeft,
      vw = _data.vw,
      vh = _data.vh,
      imgload_width = _data.imgload_width,
      imgload_height = _data.imgload_height,
    x_empty = (vw - imgload_width) / 2 + boxLeft;
    y_empty = (vh - imgload_height) / 2 + boxTop;
    if (!this.data.text) {
      this.setData({
        move_start_x: strat_x,
      })
    }
  },
  
  EventMove(e) { //触摸移动事件  拖动文本输入框
    var _data = this.data;
    if (_data.line) return false;
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
    this.setData({
      t_left: x,
      t_top: y,
    })
  },
  //手指触摸结束时的事件
  EventHandle: function (e) {//划线
    if (inScale) return false;
    var _data = this.data;
    end_x = e.changedTouches[0].clientX; // 手指结束触摸时的x轴 x轴--->相对于画布左边的距离
    end_y = e.changedTouches[0].clientY; // 手指结束触摸时的y轴 y轴--->相对于画布顶部的距离
    if (!_data.yes) {
      if (end_x > strat_x) { //向左滑动，显示上一题
        console.log('右滑')
        this.prevImg();
      } else if (end_x < strat_x) {
        console.log('左滑')
        this.nextImg();
      }
      return
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
      console.log("当前所有答卷：",swiper)
      var imgcomplete = this.data.imgcomplete;
      var len = swiper.imgUrls.length > 0 ? swiper.imgUrls.length - 1 : 0
      var curIndex = swiper.imgUrls.findIndex(item => item.id == data.id);
      console.log("当前答卷item：",data)
      console.log("当前答卷index：",curIndex)
      if (current == -1 || curIndex == -1 || curIndex == undefined) {
        console.log('当前没有试卷')
        if (!data.answerPostion[0].url) {
          data.answerPostion = JSON.parse(data.answerPostion) || [];
        }
        data.answerPostion.forEach(item=>{
          var pic_url = item.url;
          item.url = pic_url.substring(0, pic_url.indexOf('?') != -1 ? pic_url.indexOf('?') : 9999);
          var w = parseInt(item.width);
          var h = parseInt(item.height);
          var x = parseInt(item.positionX);
          var y = parseInt(item.positionY);
          if (pic_url.indexOf('?') != -1) {
            item.oss_url = pic_url.substring(pic_url.indexOf('?') + 1);
          }
          if (item.oss_url == '') {
            item.oss_url += `x-oss-process=image/crop,x_${x},y_${y},h_${h},w_${w}`
          }
          item.default_height = h;
          item.default_width = w;
        })
        
        console.log(data)
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
        
        swiper.current = curIndex;
        if(data.id == swiper.imgUrls[swiper.current].id){
          imgcomplete = true;
        };
      }
      console.log(swiper)
      this.setData({
        swiper: swiper,
        scoreMark: {},// errorIconData: [],
        textMark: [],// textData: [],
        lineMark: [],// canvasData: [],
        current: -1,
        no_papar: true,
        imgcomplete,
        'swiper.swiper_type.': true,
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
    var testTpye = this.data.testType;
    var allScore = this.data.swiper.allScore;
    console.log(score, 'score')
    if(testTpye == 1 && score != null){
      var scoreMark = {
        type: "",
        icon: score == allScore ? 2 : 1,
        x: 0,
        y: 0,
        score: "+ " + score,
      }
      this.setData({
        scoreMark
      })
    }else{
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
    }
  },
  getPaperInfo(data) {
    // if (!data) {
    //   return
    // }
    this.clearCanvas();
    var scoreMark = {}, textMark = [], lineMark = [];
    var current = this.data.current;
    var totalnum = this.data.totalnum;
    if(!!data){
      var arrs = data.split('\t');
      for (let i in arrs) {
        var arr = arrs[i].split('$');
        if (arr[0] == "right" || arr[0] == "error") {//初始化打分
          if (arr[4]) {
            var score = (arr[4] == 0?arr[4]:arr[4].split(' ')[1]) || arr[4];
            current = Math.floor(score);
          }
          scoreMark = {
            type: arr[0],
            icon: arr[1],
            x: arr[2],
            y: arr[3],
            score: arr[4] != null ? arr[4] : "",
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
    console.log(current)
    this.setData({
      scoreMark,// textData: textData,
      textMark, // errorIconData: errorData,
      lineMark,// canvasData: lineData,
      current,
      moreKeyCode: false,
      item_current: '',
      enlargeX: this.data.screenWidth * 0.8,
      enlargeY: this.data.screenHeight * 0.75,
      allpage: Math.ceil(totalnum / 10),
      isClear: false
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
      }else{
        this.errorFun();
      }
    }).catch(res => {
      this.errorFun();
    })
  },
  getTopic(data,type,flag) {
    if (!data) {
      return
    };
    flag = flag || 2;
    var page = this.data.curpage;
    data.answerPostion = JSON.stringify(data.answerPostion);
    data.studentNamePic = JSON.stringify(data.studentNamePic);
    var examId = data.examId,questionId = data.questionId,aid = data.id;
    findChecked({
      examId: examId,
      questionId: questionId,
      id: aid,
      type: type,
      page: page
    }).then((res) => {
      this.mainHandle(res, 2);
    }).catch(res => {
      this.errorFun();
    })
  },
  findChecked(examId, questionId,aid) { //请求已经评卷过的题块
    var curpage = this.data.curpage;
    if (!examId || !questionId) {
      return
    }
    findStudentUion({
      examId: examId,
      questionId: questionId,
      page: curpage
    }).then((res) => {
      this.mainHandle(res, 1, aid);
    }).then((res) => {
      this.getNextImg();
    }).catch(res => {
      
    })
  },
  getCheched(examId, id, aid) { //获取评卷中所有未打分题目
    var title = this.data.page_title;
    var curpage = this.data.curpage;
    getUnchecked({
      examId: examId,
      questionId: id,
      page: curpage
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
        var testType = this.data.testType;
        var judgeAnswer = this.data.judgeAnswer;
        if (res.data.type == 1 || res.data.type == 2) {
          testType = 1
          judgeAnswer = !this.data.transverse?true:false;
        } else if (res.data.type == 10) {
          testType = 2 //多选题
        } else if (res.data.type == 3) {
          testType = 3
        } else if (res.data.type == 4) {
          testType = 4
        }
        var swiper = this.data.swiper;
        var picdata = res.data.TopicData;
        if(testType != 1 && res.data.answer.length != 0){
          var answerImg = JSON.parse(res.data.answer) || [];
          swiper.answer_img = answerImg[0] ? answerImg[0].url : '';
        }
        swiper.rule = res.data.rule?res.data.rule:[4,2,1,0]; //多选题规则
        var oss_url = "";
        for (let j = 0; j < picdata.length; j++) {
          var item = picdata[j],newAnswer = [],oss_urls=[];
          var reg = new RegExp("\\\\","g");
          if(reg.test(item.answerPostion)){
            item.answerPostion = item.answerPostion.replace(reg, "");
            var start = item.answerPostion.indexOf("[");
            var end = item.answerPostion.indexOf("]");
            if(start != 0 || end != (item.answerPostion.length-1)){
              item.answerPostion = item.answerPostion.substring(start,end+1);
            }
          }
          item.answerPostion = item.answerPostion ? JSON.parse(item.answerPostion) : [];
          if (item.answerPostion.length > 0) {
            item.answerPostion = item.answerPostion.filter(item => {
              var pic_url = item.url;
              item.url = pic_url.substring(0, pic_url.indexOf('?') != -1 ? pic_url.indexOf('?') : 9999);
              var w = parseInt(item.width);
              var h = parseInt(item.height);
              var x = parseInt(item.positionX);
              var y = parseInt(item.positionY);
              if (pic_url.indexOf('?') != -1) {
                item.oss_url = pic_url.substring(pic_url.indexOf('?') + 1);
                oss_url = pic_url.substring(pic_url.indexOf('?') + 1);
              }
              if(oss_url == ''){
                oss_url += `x-oss-process=image/crop,x_${x},y_${y},h_${h},w_${w}`;
              }
              if (item.oss_url == '') {
                item.oss_url += `x-oss-process=image/crop,x_${x},y_${y},h_${h},w_${w}`
              }
              item.default_height = h;
              item.default_width = w;
              return item;
            })
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
        if(aid){
          var currentIndex = swiper.imgUrls.findIndex(item => item.id == aid);
          if(currentIndex != -1){
            swiper.current = currentIndex;
          }
        }
        var len = picdata.length;
        swiper.allScore = res.data.score;
        swiper.answer = res.data.questionPic ? JSON.parse(res.data.questionPic) : [];
        swiper.standard = res.data.answer; //参考答案
        swiper.rule = res.data.rule?res.data.rule:[4,2,1,0]; //多选题规则
        
        var answerArr = [];
        answerArr.push({
          value: '',
          allowValue: this.getNumber(res.data.score)
        })
        var arr = this.getNumber(res.data.score)
        this.computedKeycode(arr);
        var unfinish = picdata.filter(item => {
          return item.score == null;
        })
        var settitle = unfinish.length?'待批阅：' + unfinish.length:'回评卷';
        wx.setNavigationBarTitle({
          title: settitle
        })
        var keyrow = Math.ceil(res.data.score / 6);
        var curpage = this.data.curpage;
        
        if(res.data.check){
          curpage = Math.ceil((res.data.check + 1) / 10);
        }
        this.setData({
          page_title: settitle,
          oss_url: oss_url,
          swiper: swiper,
          testType,
          coreCurrent: 0,
          answerArr: answerArr,
          no_papar: true,
          keyrows: keyrow,
          back: unfinish.length?false:true,
          curpage,
          judgeAnswer
        })
        this.getPaperInfo(swiper.imgUrls[swiper.current].symbolMark);//初始化页面线条等
        this.getScore(swiper.imgUrls[swiper.current].score);//初始化页面分值
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
    })
  },
  mainHandle(res, flag, aid) {
    console.log(res)
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
      var alldatas = this.data.alldatas, totalnum = this.data.totalnum;
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
        if(type != 1 && res.data.answer.length != 0){
          var answerImg = JSON.parse(res.data.answer) || [];
          swiper.answer_img = answerImg[0] ? answerImg[0].url : '';
        }
        var setrule = [];
        swiper.rule = res.data.rule?res.data.rule:[4,2,1,0]; //多选题规则
      } else { //------------------------
        picdata = res.data;
      }
      var oss_url = "";
      for (let j = 0; j < picdata.length; j++) {
        var item = picdata[j];
        var reg = new RegExp("\\\\","g");
        if(reg.test(item.answerPostion)){
          item.answerPostion = item.answerPostion.replace(reg, "");
          var start = item.answerPostion.indexOf("[");
          var end = item.answerPostion.indexOf("]");
          if(start != 0 || end != (item.answerPostion.length-1)){
            item.answerPostion = item.answerPostion.substring(start,end+1);
          }
        }
        item.answerPostion = item.answerPostion ? JSON.parse(item.answerPostion) : [];
        if (item.answerPostion.length > 0) {
          item.answerPostion = item.answerPostion.filter(item => {
            var pic_url = item.url;
            item.url = pic_url.substring(0, pic_url.indexOf('?') != -1 ? pic_url.indexOf('?') : 9999);
            var w = parseInt(item.width);
            var h = parseInt(item.height);
            var x = parseInt(item.positionX);
            var y = parseInt(item.positionY);
            if (pic_url.indexOf('?') != -1) {
              item.oss_url = pic_url.substring(pic_url.indexOf('?') + 1);
              oss_url = pic_url.substring(pic_url.indexOf('?') + 1);
            }
            if(oss_url == ''){
              oss_url += `x-oss-process=image/crop,x_${x},y_${y},h_${h},w_${w}`;
            }
            if (item.oss_url == '') {
              item.oss_url += `x-oss-process=image/crop,x_${x},y_${y},h_${h},w_${w}`
            }
            item.default_height = h;
            item.default_width = w;
            return item;
          })
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
      if(aid){
        var currentIndex = swiper.imgUrls.findIndex(item => item.id == aid);
        if(currentIndex != -1){
          swiper.current = currentIndex;
        }
      }
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
      var unfinish = picdata.filter(item => {
        return item.score == null;
      })
      var curindex = 0;
      if(unfinish.length != 0){
        curindex = swiper.imgUrls.findIndex(item => item.id == unfinish[0].id);
      }
      swiper.current = curindex;
      var settitle = unfinish.length?'待批阅：' + unfinish.length:'回评卷';
      var curpage = this.data.curpage;

      if(res.data.check && res.data.markAll != res.data.check){
        curpage = Math.ceil((res.data.check + 1) / 10);
      }
      
      wx.setNavigationBarTitle({
        title: settitle
      })
      console.log('answerdata', answerDatas)
      this.setData({
        title: settitle,
        page_title: settitle,
        oss_url: oss_url,
        swiper: swiper,
        testType: type,
        coreCurrent: 0,
        answerData: answerDatas,
        judgeAnswer,
        no_papar: true,
        keyrows: keyrow,
        back: unfinish.length?false:true,
        curpage,
        alldatas
      })
      this.getPaperInfo(swiper.imgUrls[swiper.current].symbolMark);//初始化页面线条等
      this.getScore(swiper.imgUrls[swiper.current].score);//初始化页面分值
      //this.getNextImg();
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
        rule.title = "漏选零项";
      }
      if(i == 1){
        rule.title = "漏选一项";
      }
      if(i == 2){
        rule.title = "漏选二项";
      }
      if(i == 3){
        rule.title = "漏选三项";
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
          var query = wx.createSelectorQuery();
          query.select('.contain').boundingClientRect();
          //query.selectViewport().scrollOffset();
          query.exec((res) => {
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
        }
      })
      /*进入页面时获取pic 元素的宽高，存下来备用*/
      
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
    }).catch(res => {
      wx.showToast({
        title: "请求出错,请返回重试",
        icon: "none"
      })
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
    console.log("onResize")
    var screenWidth = this.data.screenWidth,enlargeY = this.data.enlargeY;
    this.setData({
      vh: 0,
      vw: 0
    })
    this.getVh().then(()=>{
      this.imgload(imgobj);
      this.computedKeycode(this.data.keyCode);
    })
  },
  errorFun(){
    wx.showToast({
      title: "请求出错,请返回重试",
      icon: "none"
    })
    var timer1 = setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
      clearTimeout(timer1);
    }, 1500)
  }
});
