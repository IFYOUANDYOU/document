

const app = getApp()
import {
  getUnchecked,
  updateTopic,
  topicRule,
  findChecked,
  findStudentUion
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
var textArrays = [],lineArrays = [];
var default_text_top = 0,default_text_left = 0;
Page({
  data: {
    vw: 0,
    vh: 0,
    boxTop: 0,
    boxBot: 0,
    barHeight: 0,
    page_title: '阅卷',

    current: -1, //keycode控制
    item_current: '', //当前按下数字
    r_model: false, //键盘收起键控制
    yes: false, //顶部图标控制
    close: true, //顶部图标控制
    line: true, //顶部图标控制
    text: true, //顶部图标控制
    clear: true, //顶部图标控制
    swiper: {
      imgUrls: [],
      current: 0,
      swiper_type: true,
      allScore: 0,
      answer: '',
      standard: ''
    },
    topbar: true, //顶部导航显示隐藏
    moreKeyCode: false, //弹起更多分数按钮
    textEnd: false, //输入完成，控制
    t_top: 0, //输入文字坐标
    t_left: 0, //同上
    t_text: "", //输入框输入的文字
    textData: [], //文字集合
    currentAns: 0,
    t_width: 'auto',
    textfocus: false, //textarea聚焦控制
    no_papar: true, //有没有未批改的题，默认为 有
    score_bar: false, //打分浮框，显示与影藏
    errorIcon: false, //错误图标框显示隐藏
    errorIconData: [], //坐标集合
    canvasData: [], //canvas坐标集合
    coreCurrent: 0, //当前打分小题
    lineCanvas: false, //线条集合显示
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
    propModel: false, //打分规则弹窗
    testType: 0,//1 选择题 2 判断题 3 主观题 4 填空题 10 多选题
    inputRule: {
      rule1: '',
      rule2: '',
      rule3: ""
    },
    ruleText: '全选对满分，错选零分，漏选得一半分',
    answerModel: false, //参考答案弹窗
    picHeight: 0,
    picTop: 0,
    move_start_x: 0, //移动初始x值
    current_speed: 0, //当前进度
    all_speed: 0, //总进度
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
    float_bar: false, //菜单栏下面的小菜单
    float_type: 1,
    topic_flag: false, //查看题目
    show_student_list: false, //显示学生姓名列表
    answer_img: "", //查看题目
    positionY: "", //图片坐标y轴
    positionH: '', //图片坐标高度 
    oss_url: '', //oss坐标url参数

    set_flag: false,//多选题规则设置

  },
  
  surnBtn() {
    var swiper = this.data.swiper;
    var current = swiper.current;
    // var questionId = swiper.imgUrls[current].questionId;
    var questionId = 2;
    var keyarr = [];
    var obj = {};
    var rule = {};
    obj.questionId = questionId;
    rule["1"] = this.data.inputRule.rule1 + "";
    rule["2"] = this.data.inputRule.rule2 + "";
    rule["3"] = this.data.inputRule.rule3 + "";
    obj.rule = rule;
    keyarr.push(0)
    keyarr.push(this.data.inputRule.rule3)
    keyarr.push(this.data.inputRule.rule2)
    keyarr.push(this.data.inputRule.rule1)
    keyarr.push(swiper.allScore)
    console.log(obj)
    // return
    topicRule(JSON.stringify(obj)).then((res) => {
      console.log(res)
      if (res.code == 10000) {
        this.closeProp();
        this.setData({
          ruleText: '全选对满分，错选零分',
          keyCode: keyarr,
          keyCodeNum: 8,
          'inputRule[rule1]': '',
          'inputRule[rule2]': '',
          'inputRule[rule3]': '',
        })
        wx.showToast({
          type: 'success',
          content: '设置成功',
          duration: 3000
        });
      }
    })
  },
  endHandle(e) {
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      this.reviewPaper();
    } else if (type == 2) {
      this.startNextPaper();
    }
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
  onCounterPlusOne(data) { //组件函数
    console.log('组件函数', data);
    this.sendAnswer(data.detail)
    var index = data.detail.score;
    var picHeight = this.data.imgload_height;
    var picWidth = this.data.imgload_width;
    var y = 0;
    var x = 0;
    var arr = [];
    var icon;
    if ((index + '').indexOf('.') == -1) {
      if (index == 0) {
        icon = 1; //没有小数点，但是0分
      } else {
        icon = 2; //没有小数点，也不是0分
      }
    } else {
      icon = 3; //有小数点 半对
    }
    var obj = {
      icon: icon,
      x: x,
      score: index == 0 ? 0 : '+ ' + index,
      y: y
    }
    arr.push(obj);
    var y1 = picHeight / 2 - 10;
    var x1 = picWidth / 2;
    var obj1 = {
      icon: icon,
      x: x1,
      score: '',
      y: y1
    };
    arr.push(obj1)
    this.setData({
      errorIconData: arr
    })
  },
  /*子组件操作，回评本题*/
  backHandle(e) {
    var type = e.detail.type;
    if (type == 1) { //回评本题
      this.reviewPaper();
    } else { //批阅下一题
      this.startNextPaper();
    }
  },
  /*回评本题*/
  reviewPaper() {
    var swiper = this.data.swiper;
    var questionId = swiper.imgUrls[0].questionId;
    var examId = swiper.imgUrls[0].examId;
    this.findChecked(examId, questionId);
  },
  openProp() {
    this.setData({
      propModel: true
    })
  },
  closeProp() {
    this.setData({
      propModel: false
    })
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
  /*打开学生姓名下拉框*/
  openStudent() {
    this.setData({
      show_student_list: !this.data.show_student_list
    })
  },
  /*点击选中一个学生姓名*/
  selectStudentId(e) {
    var questionId = e.currentTarget.dataset.qid;
    console.log(questionId)
    var swiper = this.data.swiper;
    for (let i = 0; i < swiper.imgUrls.length; i++) {
      if (swiper.imgUrls[i].questionId == questionId) {
        this.handleTopic(swiper.imgUrls[i]);
        break;
      }
    }
  },
  /*点击放大图片，（增大坐标）*/
  enlargeHandle(e) {
    
    var oss_url = this.data.oss_url;
    var oss_arr = oss_url.split(',');
    for (let i = 0; i < oss_arr.length; i++) {
      if (oss_arr[i].indexOf('y_') >= 0) {
        oss_arr[i] = 'y_' + (oss_arr[i].slice(2) * 1 - 5);
      }
      if (oss_arr[i].indexOf('h_') >= 0) {
        oss_arr[i] = 'h_' + (oss_arr[i].slice(2) * 1 + 10);
      }
    }
    console.log('oss_arr', oss_arr)
    this.setData({
      oss_url: oss_arr.join(',')
    })
  },
  imgload(e) {
    console.log('imgload', e)
    var screenWidth = this.data.screenWidth;

    var vw = this.data.vw;
    var vh = this.data.vh;

    var img_vw,img_vh;

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

    console.log(vw,vh,imgload_width,imgload_height,img_vw,img_vh)

    var text_top = img_vh / 2;
    var text_left = img_vw / 2;

    default_text_top = text_top;
    default_text_left = text_left

    this.setData({
      imgload_width: img_vw,
      imgload_height: img_vh,
      t_top: text_top,
      t_left: text_left
    })

    imgobj = e;
    
  },
  prevImg: function () {
    console.log('上一题')
    var swiper = this.data.swiper;
    var current = swiper.current;
    // current--
    // this.setData({
    //   'swiper[current]':current,
    //   'swiper[swiper_type]':false
    // })
    // return
    var answerData = this.data.answerData;
    var answer = this.data.answerArr;
    for (let j = 0; j < answer.length; j++) {
      answer[j].value = '';
    }
    var id = '';
    current--;
    if (current >= 0) {
      // swiper.current = current -1;
      this.setData({ //清空图片上的图标线条
        errorIconData: [],
        textData: [],
        canvasData: [],
        yes: false,
        close: true,
        line: true,
        text: true,
        clear: true,
        answerArr: answer,
        score_bar: false,
      })

      id = swiper.imgUrls[current].id
      for (let i = 0; i < answerData.length; i++) {
        if (answerData[i].id == id) {
          setTimeout(() => {
            this.getPaperInfo(answerData[i].symbolMark)
            this.getScore(answerData[i].score)
          })
          break;
        }
      }
    } else { //如果等于0，请求已经批改过的

      // wx.showToast({
      //   content: "没有更多了",
      //   duration: 2000
      // })
      // return;
      this.getTopic(swiper.imgUrls[current])
    }
    // swiper.current = current > 0 ? current - 1 : swiper.imgUrls.length - 1;
    this.setData({
      'swiper.current': current >= 0 ? current : 0,
      'swiper.swiper_type': false,
      'touch.scale': 1
    })
  },
  nextImg: function (data) {
    console.log('下一题');
    var swiper = this.data.swiper;
    var current = swiper.current;
    var title = this.data.title;
    var answerData = this.data.answerData;
    var answer = this.data.answerArr;
    if (current < (swiper.imgUrls.length - 1)) {
      var judge = swiper.imgUrls[current].id;
      var result = answerData.find(item => item.id == judge);
      if (!result && !data) {
        wx.showToast({
          title: '请先批卷',
          icon: 'none',
          duration: 2000
        })
        return
      }
      for (let j = 0; j < answer.length; j++) {
        answer[j].value = '';
      }
      // return
      this.setData({ //清空图片上的图标线条
        errorIconData: [],
        textData: [],
        canvasData: [],
        yes: false,
        close: true,
        line: true,
        text: true,
        clear: true,
        answerArr: answer,
        score_bar: false,
      })
      swiper.current = current + 1;
      var id = swiper.imgUrls[swiper.current].id;
      for (let i = 0; i < answerData.length; i++) {
        if (answerData[i].id == id) {
          this.getPaperInfo(answerData[i].symbolMark)
          this.getScore(answerData[i].score)
          break;
        }
      }
    } else { //没有试卷了
      for (let j = 0; j < answer.length; j++) {
        answer[j].value = '';
      }
      this.setData({ //清空图片上的图标线条
        errorIconData: [],
        textData: [],
        canvasData: [],
        yes: false,
        close: true,
        line: true,
        text: true,
        clear: true,
        answerArr: answer,
        score_bar: false,
      })

      console.log(title)

      if (title == '待批阅') {
        this.getCheched(swiper.imgUrls[current].examId, swiper.imgUrls[current].questionId);
      } else {
        this.getTopic(swiper.imgUrls[current]);
      }
      return;
    }

    var setTitle = title == '待批阅' ? title + (swiper.imgUrls.length - swiper.current) : title;
    wx.setNavigationBarTitle({
      title: setTitle
    })
    this.setData({
      'swiper.current': swiper.current,
      'swiper.swiper_type.': true
    })
  },
  /*topbar图标控制事件*/
  yesup: function (e) {
    var type = e.currentTarget.dataset['type'];
    if (!this.data.no_papar) {
      return;
    }
    var swiper = this.data.swiper;
    var testType = this.data.testType;
    if (type == 1) {
      this.setData({
        yes: false,
        close: true,
        line: true,
        text: true,
        float_bar: false
      })
    } else if (type == 2) {
      if (testType == 1) {return}
      this.setData({
        yes: true,
        close: false,
        line: true,
        text: true,
        // errorIcon: true
        lineCanvas: true,
        float_bar: true,
        float_type: 1
      })
    } else if (type == 3) {
      if (testType == 1) {return}
      this.setData({
        line: false,
        yes: true,
        close: true,
        text: true,
        textEnd: false,
        float_bar: true,
        float_type: 2,
        t_top: default_text_top,
        t_left: default_text_left
      })
    } else if (type == 4) {
      this.setData({
        text: false,
        yes: true,
        close: true,
        line: true,
        float_bar: false
      })
      var questionId = swiper.imgUrls[swiper.current].questionId;
      var examId = swiper.imgUrls[swiper.current].examId;
      var id = swiper.imgUrls[swiper.current].id;
      wx.navigateTo({
        url: '/pages/mycollec/mycollec?questionId=' + questionId + '&examId=' + examId + '&id=' + id,
      })
    } else if (type == 5) {
      // this.setData({
      //   clear: false,
      //   errorIconData:[],
      //   textData:[],
      //   canvasData:[]
      // })
      var answer_pic = swiper.answer.length > 0 ? swiper.answer[0].url : ''
      this.setData({
        text: true,
        yes: true,
        close: true,
        line: true,
        clear: false,
        float_bar: false,
        topic_flag: true,
        answer_img: answer_pic
      })
    }
  },
  yesdown: function () {
    // console.log('cc')
    // var timer = setTimeout(() => {
    this.setData({
      // yes: true,
      // close: true,
      // line: true,
      text: true,
      // clear: true,

    })
    //   clearTimeout(timer);
    // }, 150)
  },
  /*清楚当前页面操作的标记*/
  clearArrData() {
    if (!this.data.close) {
      this.setData({
        canvasData: []
      })
    } else if (!this.data.line) {
      this.setData({
        textData: []
      })
    }
  },
  keydown: function (e) {
    console.log("打分")
    clearInterval(timers1);
    console.log(this.data.current)
    // var index = e.currentTarget.dataset['index'];
    var index = this.data.item_current;
    var corecurrent = this.data.coreCurrent;
    var len = this.data.answerArr.length;
    var answer = this.data.answerArr;
    var i = corecurrent + 1;
    // var timer = setTimeout(() => {
    this.setData({
      current: -1,
    })
    if (index == '···') { //如果点击省略号则弹出大键盘
      this.setData({
        moreKeyCode: true,
        t_width: this.countKeycode(2),
        keyCodeNum: this.countKeycode(1),
        keyCode: answer[corecurrent].allowValue,
      })
    } else { //记录点击进来的分数，目前是第几个小题
      answer[corecurrent].value = index;
      var actionWidth = this.data.imgload_width;
      var actionHeight = this.data.imgload_height;
      var y = actionHeight / 2 - 20;
      var x = actionWidth - 60;
      var arr = [];
      var icon;
      if ((index + '').indexOf('.') == -1) {
        if (index == 0) {
          icon = 1; //没有小数点，但是0分
        } else {
          icon = 2; //没有小数点，也不是0分
        }
      } else {
        icon = 3; //有小数点 半对
      }
      var obj = {
        icon: icon,
        x: 0,
        score: index == 0 ? 0 : '+ ' + index,
        y: 0
      }
      arr.push(obj);
      var y1 = actionHeight / 2 - 10;
      var x1 = actionWidth / 2 - 30;
      var obj1 = {
        icon: icon,
        x: x1,
        score: '',
        y: y1
      };
      arr.push(obj1)
      this.setData({
        answerArr: answer,
        errorIconData: arr
      })
      console.log('flag', this.data.flag)
      if (i >= len && this.data.flag) { //当前题目打分完以后，等待0.5秒跳转下一题
        this.setData({
          flag: false,
          coreCurrent: 0,
        })
        var swiper = this.data.swiper;
        var current = swiper.current;
        // var subscore = [];
        // var score = 0;
        // for (let k = 0; k < answer.length; k++) {
        // subscore.push(answer[k].value);
        //   score += answer[k].value * 1;
        // }
        var newAnserObj = swiper.imgUrls[current];
        newAnserObj.score = index;
        newAnserObj.makingTime = new Date();
        this.sendAnswer(newAnserObj)
        var ti2 = setTimeout(() => { //定时器
          // for(let j = 0; j < answer.length; j++) {
          //   answer[j].value = '';
          // }
          var keycode2 = answer[0].allowValue;
          this.computedKeycode(keycode2);
          this.setData({
            coreCurrent: 0,
            flag: true,
            moreKeyCode: false
          })
          clearTimeout(ti2);
        }, 1)
      } else if (i < len) {
        console.log('next')
        var keycode = answer[corecurrent + 1].allowValue;
        this.computedKeycode(keycode);
        this.setData({
          moreKeyCode: false,
          coreCurrent: i
        })
      }
    }
    // clearTimeout(timer);
    // }, 100)//外层定时器是为了点击结束后键盘点击效果的延迟
  },
   keyups(event) {   //键盘点击事件
    console.log(event)
    touchStartTime = new Date().getTime();
    var index = event.currentTarget.dataset['index'];
    var i = index == "···" ? 15 : index;
    
    this.setData({
      current: i,
      item_current: index
    })
    timers1 = setInterval(() => {
      touchEndTime = new Date().getTime();
      if ((touchEndTime - touchStartTime) > 550) {
        this.setData({
          item_current: index == "···" ? index : index + '.5'
        })
      }
    }, 100)
  },
  retract: function () {
    this.setData({
      r_model: true
    })
  },
  retracting: function () {
    var corecurrent = this.data.coreCurrent;
    var answer = this.data.answerArr;
    var keycode = answer[corecurrent].allowValue;
    this.computedKeycode(keycode);
    var ti = setTimeout(() => {
      this.setData({
        r_model: false
      })
      clearTimeout(ti);
    }, 150)
    this.setData({
      moreKeyCode: false,
    })
  },

  inputValue(e) { //输入完成触发
    console.log(e.detail)
    var input = this.data.textData;
    console.log(this.data.t_left,this.data.t_top)
    var obj = {
      x: this.data.t_left,
      y: this.data.t_top,
      value: e.detail.value
    }
    input.push(obj);
    textArrays.push(obj);//将输入完成之后的文字 坐标存入数组中
    this.setData({
      textData: input,
      text: true,
      textEnd: true,
      textfocus: false,
    })
  },
  /*禁止用户手指触摸滑动swiper*/
  stopTouchMove: function () {
    return false;
  },
  EventMove(e) { //触摸移动事件

    var _data = this.data;
    
    if (_data.line) {
      return
    }

    var move_x = e.touches[0].clientX;
    var move_y = e.touches[0].clientY;

    var boxTop = _data.boxTop,
      vw = _data.vw,
      vh = _data.vh,
      imgload_width = _data.imgload_width,
      imgload_height = _data.imgload_height,
      screenWidth = _data.screenWidth,
      screenHeight = _data.screenHeight;

    if(screenWidth > screenHeight){
      var y_empty = vh * 0.05 / 2;
      var y = move_y - boxTop - y_empty;
      var x = move_x - ((vw - imgload_width) / 2);
    }else{
      var x_empty = vw * 0.05 / 2;
      var y = move_y - boxTop - ((vh - imgload_height) / 2);
      var x = move_x - x_empty;
    }

    if(x < x_empty){
      x = x_empty;
    }

    this.setData({
      t_top: y,
      t_left: x
    })

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
    // if(e.touches.length == 1){
    //   console.log('单指')
    //   this.setData({
    //     flag_slide:true
    //   })
    // }
    // if(e.touches.length >= 2){ //双指触摸代表用户想要缩放图片，禁止滑动
    //   let xMove = e.touches[1].clientX - e.touches[0].clientX;
    //   let yMove = e.touches[1].clientY - e.touches[0].clientY;
    //   let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    //   this.setData({
    //     'touch.distance': distance,
    //     flag_slide:false
    //   })
    // }
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

      var top = strat_y - boxTop - ((vh - picHeight) / 2),left;
      if(screenWidth > screenHeight){
        left = strat_x - (vw - picWidth) / 2;
      }else{
        left = strat_x;
      }

      var arr = this.data.canvasData;
      
      var obj = {
        left,
        top,
        width: width,
        deg: deg
      }
      arr.push(obj);
      lineArrays.push(obj);//将所有线条数据存入 数组中

      this.setData({
        canvasData: arr
      })
    }
  },
  countKeycode(type) {
    var corecurrent = this.data.coreCurrent;
    var answer = this.data.answerArr;
    var keycode = answer[corecurrent].allowValue;
    var len = keycode.length;
    var num = 0;
    var width = 98;
    if (this.data.transverse) { //横屏
      num = (5 - (len % 6)) + len;
      width = (num + 1) / 6 * 49
    } else { //竖屏
      num = (6 - (len % 7)) + len;
    }
    if (type == 1) {
      return num;
    } else {
      return width;
    }
  },
  onLoad(query) {
    // 页面加载
    console.log(query)

    this.setData({
      errorIconData: [],
      textData: [],
      canvasData: []
    })

    if (query.questionId) {
      if (query.back == 'false') {
        this.getCheched(query.examId, query.questionId);
      } else {
        console.log('进入回评')
        this.findChecked(query.examId, query.questionId);
        this.setData({
          title: '回评卷'
        })
      }

    }
  },
  onReady() {
    // 页面加载完成
    this.getVh();
  },
  onShow: function () {
    console.log('页面显示')
    var comment = app.globalData.commentData;
    if (Object.keys(comment).length > 0) {
      comment.studentNamePic = comment.studentNamePic ? JSON.parse(comment.studentNamePic) : [];
      console.log(comment)
      wx.setNavigationBarTitle({
        title: '回评卷'
      })
      this.handleTopic(comment);
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
        var result = swiper.imgUrls.findIndex(item => item.id == data.id);
        if (result >= 0) { //找到有相同的taskid，就跳到指定的位置，没有就加在当前数组
          // swiper.current = result
          swiper.imgUrls.splice(result, 1);
          swiper.imgUrls.splice(current, 0, data);
        } else {
          swiper.imgUrls.splice(current, 0, data);
        }
      }
      /*把*/
      // this.pushAnswerData(data);
      this.getPaperInfo(data.symbolMark);
      this.getScore(data.score);
      this.setData({
        swiper: swiper,
        no_papar: true
      })
      app.globalData.commentData = {};
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
    if (!data) {
      return
    }
    var arr = data.split('\t');
    var errorData = [];
    var textData = [];
    var lineData = [];
    for (let i = 0; i < arr.length; i++) {
      var arr1 = arr[i].split('$');

      if (arr1[0] == 'right') {
        var obj = {};
        obj.icon = true;
        obj.x = arr1[1] * 1;
        obj.y = arr1[2] * 1;
        obj.score = arr1[3];
        errorData.push(obj);
      }
      if (arr1[0] == 'error') {
        var obj1 = {};
        obj1.icon = false;
        obj1.x = arr1[1] * 1;
        obj1.y = arr1[2] * 1;
        obj1.score = arr1[3];
        errorData.push(obj1);
      }
      if (arr1[0] == 'line') {
        var obj2 = {};
        obj2.left = arr1[1] * 1;
        obj2.top = arr1[2] * 1;
        obj2.width = arr1[3] * 1;
        obj2.deg = arr1[4] * 1;
        lineData.push(obj2);
      }
      if (arr1[0] == 'text') {
        var obj3 = {};
        obj3.x = arr1[1] * 1;
        obj3.y = arr1[2] * 1;
        obj3.value = arr1[3];
        textData.push(obj3);
      }
    }
    this.setData({
      textData: textData,
      errorIconData: errorData,
      canvasData: lineData
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
      errorIconData: [],
      textData: [],
      canvasData: [],
      yes: false,
      close: true,
      line: true,
      text: true,
      clear: true,
      score_bar: false,
    })
  },
  optionCon() {
    // console.log(this.answerOption);
    var error = this.data.errorIconData; //坐标集合
    var canvas = this.data.canvasData;
    var text = this.data.textData;
    var con = '';
    // right$x$y$	
    error.forEach(item => {
      var type = item.icon ? 'right' : 'error';
      con += type + '$' + item.x + '$' + item.y + '$' + item.score + '$' + "\t";
    })
    canvas.forEach(item => {
      con += 'line' + '$' + item.left.toFixed(1) + '$' + item.top.toFixed(1) + '$' + item.width.toFixed(1) + '$' + item.deg.toFixed(1) + '$' + "\t";
    })
    text.forEach(item => {
      con += 'text' + '$' + item.x + '$' + item.y + '$' + item.value + '$' + "\t";
    })
    return con;
  },
  getCheched(examId, id) { //获取题目，打分点
    getUnchecked({
      questionId: id,
      examId: examId
    }).then(res => {
      if (res.code == 10000) {
        if (!res.data) {
          var swiper = this.data.swiper;
          this.setData({
            no_papar: false,
            'swiper.current': swiper.current + 1
          })
          return
        }
        var type = res.data.type;
        if (res.data.type == 1 || res.data.type == 2) {
          type = 1
        } else if (res.data.type == 10) {
          type = 2 //多选题
        } else if (res.data.type == 3) {
          type = 3
        } else if (res.data.type == 4) {
          type = 4
        }
        var swiper = this.data.swiper;
        var picdata = res.data.TopicData;
        var oss_url = '';
        for (let j = 0; j < picdata.length; j++) {
          picdata[j].answerPostion = picdata[j].answerPostion ? JSON.parse(picdata[j].answerPostion) : [];

          if (picdata[j].answerPostion.length > 0) {
            var pic_url = picdata[j].answerPostion[0].url;
            try {
              picdata[j].answerPostion[0].url = pic_url.substring(0, pic_url.indexOf('?') != -1 ? pic_url.indexOf('?') : 9999);
            } catch (err) {
              picdata[j].answerPostion = JSON.parse(picdata[j].answerPostion);
              pic_url = picdata[j].answerPostion[0].url;
              picdata[j].answerPostion[0].url = pic_url.substring(0, pic_url.indexOf('?') != -1 ? pic_url.indexOf('?') : 9999);
            }

            if (pic_url.indexOf('?') != -1) {
              oss_url = pic_url.substring(pic_url.indexOf('?') + 1);
            }
          }
          picdata[j].studentNamePic = picdata[j].studentNamePic ? JSON.parse(picdata[j].studentNamePic) : [];
        }
        swiper.imgUrls = picdata;
        swiper.current = 0;
        var len = picdata.length;
        swiper.allScore = res.data.score;
        swiper.answer = res.data.questionPic ? JSON.parse(res.data.questionPic) : [];
        var current_speed = res.data.check;
        var all_speed = res.data.markAll;
        swiper.standard = res.data.answer; //参考答案
        var answerArr = [];
        answerArr.push({
          value: '',
          allowValue: this.getNumber(res.data.score)
        })
        var arr = this.getNumber(res.data.score)
        this.computedKeycode(arr);
        wx.setNavigationBarTitle({
          title: '待批阅:' + len
        })
        this.setData({
          title: '待批阅',
          oss_url: oss_url,
          swiper: swiper,
          testType: type,
          coreCurrent: 0,
          answerArr: answerArr,
          current_speed: current_speed,
          all_speed: all_speed
        })
      } else if (res.code == 10029) {
        wx.setNavigationBarTitle({
          title: '待批阅:0'
        })
        this.setData({
          no_papar: false,
          'swiper.current': 0
        })
        return
      }
    })
  },
  getNumber(num) { //计算分数键盘
    if (!num) {
      return 0
    }
    var arr = [];
    for (let i = 0; i <= num; i++) {
      arr.push(i)
    }
    return arr
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
    var current_speed = this.data.current_speed;
    if (!data.scoreStatus) { //回评卷不加
      data.scoreStatus = true;
    }
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
    })
  },
  findChecked(examId, questionId) { //请求已经评卷过的题块
    if (!examId || !questionId) {
      return
    }
    // data.answerPostion = JSON.stringify(data.answerPostion);
    // findChecked(JSON.stringify(data)).then((res)=>{
    findStudentUion({
      examId: examId,
      questionId: questionId
    }).then((res) => {
      this.mainHandle(res, 1);
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
      var swiper = this.data.swiper;
      var picdata;
      var type = this.data.testType;
      swiper.current = 0;
      if (flag == 1) {
        if (res.data.type == 1 || res.data.type == 2) {
          type = 1
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
        swiper.chooseCode = [{
          'title': '漏选三项',
          'num': 0
        },
        {
          'title': '漏选二项',
          'num': 2
        },
        {
          'title': '漏选一项',
          'num': 4
        },
        {
          'title': '',
          'num': 6
        }];
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
      var oss_url = "";
      for (let j = 0; j < picdata.length; j++) {
        picdata[j].answerPostion = picdata[j].answerPostion ? JSON.parse(picdata[j].answerPostion) : [];
        if (picdata[j].answerPostion.length > 0) {
          var pic_url = picdata[j].answerPostion[0].url;
          // console.log('??', picdata[j].answerPostion)
          try {
            picdata[j].answerPostion[0].url = pic_url.substring(0, pic_url.indexOf('?') != -1 ? pic_url.indexOf('?') : 9999);
          } catch (err) {
            picdata[j].answerPostion = JSON.parse(picdata[j].answerPostion)
            if(typeof(picdata[j].answerPostion) == "string"){
              picdata[j].answerPostion = JSON.parse(picdata[j].answerPostion)
            }
            console.log(picdata[j].answerPostion)
            pic_url = picdata[j].answerPostion[0].url;
            picdata[j].answerPostion[0].url = pic_url.substring(0, pic_url.indexOf('?') != -1 ? pic_url.indexOf('?') : 9999);
          }
          if (pic_url.indexOf('?') != -1) {
            oss_url = pic_url.substring(pic_url.indexOf('?') + 1);
          }

        }
        picdata[j].studentNamePic = picdata[j].studentNamePic ? JSON.parse(picdata[j].studentNamePic) : [];
      }
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
      console.log('answerdata', answerDatas)
      wx.setNavigationBarTitle({
        title: '回评卷'
      })
      this.setData({
        oss_url: oss_url,
        swiper: swiper,
        testType: type?type:this.data.testType,
        coreCurrent: 0,
        answerData: answerDatas,
        no_papar: true
      })
      console.log(swiper.current,swiper.imgUrls)
      this.getPaperInfo(swiper.imgUrls[swiper.current].symbolMark);//初始化页面线条等
      this.getScore(swiper.imgUrls[swiper.current].score);//初始化页面分值
    } else if (res.code == 10029) {
      var title = this.data.title;
      wx.setNavigationBarTitle({
        title: title == '待批阅' ? title + ":0" : title
      })
      this.setData({
        no_papar: false,
        'swiper.current': 0
      })
    }
  },
  /*计算键盘数量 高度*/
  computedKeycode(arr) {
    var keycode1 = [];
    if (arr.length > 14) {
      keycode1 = arr.slice(0, 13);
      keycode1.push('···');
    } else {
      keycode1 = arr;
    }
    var keyNum = 14;
    if (arr.length > 7) {
      keyNum = 14
    } else {
      keyNum = 7
    }
    this.setData({
      keyCodeNum: keyNum,
      keyCode: keycode1,
    })
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
    flag = flag > 0;
    this.setData({
      set_flag: flag
    })
  },
  //获取各块宽高
  getVh(){
    return new Promise((response, reject) => {
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            screenWidth: res.screenWidth,
            screenHeight: res.screenHeight,
            barHeight: res.statusBarHeight,
            
            transverse: res.screenWidth > res.screenHeight
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
            boxTop: res[0].top
          })
          response();
        }
      })
      
      // query.select('.keybar').boundingClientRect().exec((res) => {
      //   console.log(res)
      //   this.setData({
      //     boxBot: res[0].height
      //   })
      // })
    })
  },
  //修改打分规则
  resetRules(e){
    var rule1 = e.detail.value.rule1;
    var rule2 = e.detail.value.rule2;
    var rule3 = e.detail.value.rule3;
    var rules = this.data.swiper.chooseCode;
    if(rule1 == ''||rule2 == ''||rule3 == ''){
      wx.showToast({
        title: '请填完所有规则',
        icon: "none",
        duration: 1000
      });
      return false;
    }
    rules[0].num = rule1;
    rules[1].num = rule2;
    rules[2].num = rule3;
    console.log(rules)
    this.setData({
      'swiper.chooseCode': rules,
      set_flag: false
    })
  },
  //tabbar 操作的前进或撤销
  forwardHandle(e){
    var forward = e.currentTarget.dataset.forward;
    var textData = this.data.textData;
    var canvasData = this.data.canvasData;
    var close = this.data.close;//是否划线
    var line = this.data.line;//是否备注
    if(!close){
      if(forward == 1){//前进
        if(canvasData.length == lineArrays.length) return;
        var cur = (lineArrays.slice(canvasData.length,canvasData.length+1))[0];
        canvasData.push(cur)
      }else{//后退
        if(canvasData.length == 0) return;
        canvasData.pop();
      }
    }
    if(!line){
      if(forward == 1){//前进
        if(textData.length == textArrays.length) return;
        var cur = (textArrays.slice(textData.length,textData.length+1))[0];
        textData.push(cur)
      }else{//后退
        if(textData.length == 0) return;
        textData.pop();
      }
    }
    this.setData({
      canvasData,
      textData
    })
  },
  onResize(e){
    this.getVh().then(()=>{
      this.imgload(imgobj);
    });
  }
});