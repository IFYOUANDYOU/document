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
Page({
  data: {
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
    t_top: 160, //输入文字坐标
    t_left: 125, //同上
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
    testType: 0,
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
    float_bar: false, //菜单栏下面的小菜单
    float_type: 1,
    topic_flag: false, //查看题目
    show_student_list: false, //显示学生姓名列表
    answer_img: "", //查看题目
    positionY: "", //图片坐标y轴
    positionH: '', //图片坐标高度 
    oss_url: '', //oss坐标url参数
  },
  bindRule1(e) {
    console.log(e)
    this.setData({
      'inputRule[rule1]': e.detail.value
    })
  },
  bindRule2(e) {
    this.setData({
      'inputRule[rule2]': e.detail.value
    })
  },
  bindRule3(e) {
    this.setData({
      'inputRule[rule3]': e.detail.value
    })
  },
  // changeTab(e){ //切换tab
  //   console.log(e.currentTarget.dataset.tab);
  //   this.setData({
  //     tabType:e.currentTarget.dataset.tab,
  //     'touch.scale':1
  //   })
  // },
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
    var index = data.detail.score;
    var picHeight = this.data.picHeight;
    var screenWidth = this.data.screenWidth;
    var y = picHeight / 2 - 20;
    var x = screenWidth - 60;
    var arr = [];
    // var icon = (index + '').indexOf('.') == -1 ? true : false;
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
    var x1 = screenWidth / 2;
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
    this.sendAnswer(data.detail)
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
    var imgload_width = e.detail.width;
    var imgload_height = e.detail.height;
    if (imgload_width > screenWidth) {
      imgload_width = screenWidth * 0.95;
    }
    if (imgload_height > 360) {
      imgload_height = 360
    }
    this.setData({
      imgload_width: imgload_width,
      imgload_height: imgload_height
    })
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
    // current++
    // this.setData({
    //   'swiper[current]':current,
    //   'swiper[swiper_type]':true
    // })
    // return
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

      if (title == '待批阅') {
        this.getCheched(swiper.imgUrls[current].examId, swiper.imgUrls[current].questionId);
      } else {
        this.getTopic(swiper.imgUrls[current]);
      }
      return;
    }

    var setTitle = title == '待批阅' ? title + ":" + (swiper.imgUrls.length - swiper.current) : title
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
      if (testType == 1) {
        return
      }
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
      if (testType == 1) {
        return
      }
      this.setData({
        line: false,
        yes: true,
        close: true,
        text: true,
        textEnd: false,
        float_bar: true,
        float_type: 2
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
      var picHeight = this.data.picHeight;
      var screenWidth = this.data.screenWidth;
      var y = picHeight / 2 - 20;
      var x = screenWidth - 60;
      var arr = [];
      // var icon = (index+'').indexOf('.')==-1 ? true : false;
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
      var x1 = screenWidth / 2;
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
  keyups(event) {
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
    var obj = {
      x: this.data.t_left,
      y: this.data.t_top,
      value: e.detail.value
    }
    input.push(obj);
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
    // console.log(e)
    // if(e.touches.length==1){//单指
    //   this.setData({
    //     flag_slide:true
    //   })
    // }
    // if(e.touches.length>=2 && this.data.line && this.data.text){
    //   console.log('双指缩放');
    //   let touch = this.data.touch
    //   let xMove = e.touches[1].clientX - e.touches[0].clientX;
    //   let yMove = e.touches[1].clientY - e.touches[0].clientY;
    //   let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    //   let distanceDiff = distance - touch.distance;
    //   let newScale = touch.scale + 0.005 * distanceDiff;
    //   if(newScale >= 2) {
    //     newScale = 2
    //   }
    //   if(newScale <= 1) {
    //     newScale = 1
    //   }
    //   this.setData({
    //     'touch.scale': newScale,
    //     flag_slide:false
    //   })
    // }
    if (this.data.line) {
      return
    }
    var move_x = e.touches[0].clientX;
    var move_y = e.touches[0].clientY;
    var top = this.data.picTop;
    var height = this.data.picHeight;
    var move_start = this.data.move_start_x;
    var y = move_y - top;
    if (y < height) { //不能超出元素的高度
      this.setData({
        t_top: y - 12,
        t_left: move_x - move_start
      })
    }
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
    // console.log(e)
    end_x = e.changedTouches[0].clientX; // 手指结束触摸时的x轴 x轴--->相对于画布左边的距离
    end_y = e.changedTouches[0].clientY; // 手指结束触摸时的y轴 y轴--->相对于画布顶部的距离
    if (this.data.clear && this.data.close && this.data.line && this.data.text) {
      if (end_x > strat_x) { //向左滑动，显示上一题
        // if(this.data.tabType ==1 || this.data.testType ==1){
        console.log('右滑')
        this.prevImg()
        // }
      } else if (end_x < strat_x) {
        // if(this.data.tabType ==1 || this.data.testType ==1){
        console.log('左滑')
        // var swiper = this.data.swiper;
        // if(swiper.current == 0){
        //   console.log('这是第一张')
        //   return
        // }
        this.nextImg()
        // }
      }
      return
    }
    if (!this.data.close) {
      var diff_x = end_x - strat_x,
        diff_y = end_y - strat_y;
      //返回角度,不是弧度
      var deg = 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
      var width = Math.pow((diff_x * diff_x + diff_y * diff_y), 0.5);
      // var query = wx.createSelectorQuery()
      // query.select('.pic').boundingClientRect()
      // query.exec((res) => {
      // console.log('res',res)
      // var y = res[0].top;
      // var h = res[0].height;
      var y = this.data.picTop;
      var h = this.data.picHeight;
      // var left = res[0].left;
      var left = 0;
      var arr = this.data.canvasData;
      if (this.data.transverse) { //横屏计算x轴
        strat_x = strat_x - left;
      }
      var result_y = strat_y - y;
      var obj = {
        left: strat_x,
        top: result_y,
        width: width,
        deg: deg
      }
      arr.push(obj);

      this.setData({
        canvasData: arr
      })
      // })
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
    // wx.setNavigationBarTitle({
    //   title:'待批阅'
    // })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          screenWidth: res.screenWidth
        })
      }
    })

  },
  onReady() {
    // 页面加载完成
    /*进入页面时获取pic 元素的宽高，存下来备用*/
    var query = wx.createSelectorQuery()
    query.select('.pic').boundingClientRect()
    query.exec((res) => {
      console.log(res)
      if (res[0]) {
        this.setData({
          picTop: res[0].top,
          picHeight: res[0].height
        })
      }
    })
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
        obj.x = arr1[1] * 1;
        obj.y = arr1[2] * 1;
        obj.score = arr1[3];
        var icon;
        if ((obj.score + '').indexOf('.') == -1) {
          if (obj.score == 0) {
            icon = 1; //没有小数点，但是0分
          } else {
            icon = 2; //没有小数点，也不是0分
          }
        } else {
          icon = 3; //有小数点 半对
        }
        obj.icon = icon;
        errorData.push(obj);
      }
      if (arr1[0] == 'error') {
        var obj1 = {};
        obj1.x = arr1[1] * 1;
        obj1.y = arr1[2] * 1;
        obj1.score = arr1[3];
        var icon1;
        if ((obj1.score + '').indexOf('.') == -1) {
          if (obj1.score == 0) {
            icon1 = 1; //没有小数点，但是0分
          } else {
            icon1 = 2; //没有小数点，也不是0分
          }
        } else {
          icon1 = 3; //有小数点 半对
        }
        obj1.icon = icon1;
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
          // wx.showToast({
          //   content:'没有更多试卷了',
          //   duration:2000
          // })
          var swiper = this.data.swiper;
          this.setData({
            no_papar: false,
            'swiper.current': swiper.current + 1
          })
          return
        }
        var type = 2;
        if (res.data.type == 1 || res.data.type == 2) {
          type = 1
        } else if (res.data.type == 10) {
          type = 2
        } else if (res.data.type == 3) {
          type = 3
        } else if (res.data.type == 4) {
          type = 4
        }
        var swiper = this.data.swiper;
        var picdata = res.data.TopicData;
        var oss_url = '';
        // for(let i =0;i<picdata.length;i++){
        //   picdata[i].answerPostion = picdata[i].answerPostion?JSON.parse(picdata[i].answerPostion):[];
        //   if (picdata[i].answerPostion.length>0){
        //     var pic_url = picdata[i].answerPostion[0].url ;
        //     picdata[i].answerPostion[0].url = pic_url.substring(0,pic_url.indexOf('?'));
        //     oss_url = pic_url.substring(pic_url.indexOf('?')+1);
        //   }
        //   picdata[i].studentNamePic = picdata[i].studentNamePic?JSON.parse(picdata[i].studentNamePic):[];
        // }
        for (let j = 0; j < picdata.length; j++) {
          picdata[j].answerPostion = picdata[j].answerPostion ? JSON.parse(picdata[j].answerPostion) : [];

          if (picdata[j].answerPostion.length > 0) {
            var pic_url = picdata[j].answerPostion[0].url;
            // console.log('??', picdata[j].answerPostion)
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
          no_papar: true
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
      console.log(res)
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
      if (flag == 1) {
        if (res.data.type == 1 || res.data.type == 2) {
          type = 1
        } else if (res.data.type == 10) {
          type = 2
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
        title: '回评卷',
        oss_url: oss_url,
        swiper: swiper,
        testType: type,
        coreCurrent: 0,
        answerData: answerDatas,
        no_papar: true
      })
      this.getPaperInfo(swiper.imgUrls[swiper.current].symbolMark);
      this.getScore(swiper.imgUrls[swiper.current].score);
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
  }
});
