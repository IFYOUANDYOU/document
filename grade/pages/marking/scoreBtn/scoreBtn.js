let timers;
let touchStartTime = 0;
let touchEndTime = 0;
let defaultBtns = [];
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    moreCode: {
      type: Boolean
    },
    scores: {
      type: Number,
      observer: function (newVal, oldVal) {
        if (newVal) {
          this.scores = newVal;
        }
      }
    },
    testType: {
      type: Number
    },
    answerScore: {
      type: Number,
      observer: function (newVal, oldVal) {
        if (newVal) {
          this.answerScore = newVal;
          var arr = this.getNumber(newVal);
          defaultBtns = arr;
          this.computedKeycode(arr, 1);
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    clickflag: false,
    keyCode: [],
    keyCodeNum: 0,
    moreKeyCode: false,
    longTap: false,
    current: -1,
    current_score: 0,
    keyrows: 1,
  },

  ready() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
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
    computedKeycode(arr, flag) {
      var keyCode = [];
      var testType = this.data.testType;
      var transverse = this.data.transverse;
      var keyCodeNum = 0;
      var rows = Math.ceil(arr.length / 7);
      if(flag == 2){
        keyCode = arr;
        keyCodeNum = rows * 7 - keyCode.length;
      }else{
        if (arr.length > 14) { //横屏为12
          keyCode = arr.filter((index,item) => {
            return index <= 12;
          })
          keyCode.push('···');
        } else {
          keyCode = arr;
          keyCodeNum = rows * 7 - keyCode.length;
        }
      }
      this.setData({
        keyCodeNum,
        keyCode,
      })
    },
    keybarTouchStart(event) { //键盘点击事件
      timers && clearInterval(timers);
      if (this.data.clickflag) {
        wx.showToast({
          title: "操作过于频繁", //单题评卷不得低于2s
          icon: "none"
        })
        return false;
      }
      touchStartTime = new Date().getTime();
      let index = event.currentTarget.dataset['index'];
      if(index == "···"){
        this.computedKeycode(defaultBtns, 2);
        return false;
      }
      this.setData({
        current: index,
        current_score: index
      })
      if (index == this.scores) return false;
      timers = setInterval(() => {
        touchEndTime = new Date().getTime();
        if ((touchEndTime - touchStartTime) > 400) {
          if ((touchEndTime - touchStartTime) > 800) {
            clearInterval(timers)
          }
          this.setData({
            longTap: true
          })
        }
      }, 200)

    },
    keybarTouchEnd(event) {
      console.log("打分 总分：",this.scores)
      timers && clearInterval(timers);
      var index = event.currentTarget.dataset['index'];
      if(index == "···") return false;
      if (this.data.clickflag) return false;
      
      var longTap = this.data.longTap;
      var current_score = this.data.current_score;
      if (index != "...") {
        if (longTap) current_score = index + 0.5;
        if (current_score >= this.scores) {
          current_score = this.scores;
        }
      }
      this.setData({
        current_score,
        current: -1,
        longTap: false,
      })
      this.triggerEvent('scoreHandle', current_score);
      return false;
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
        var scoreMark = this.data.scoreMark; //var arr = [];
        var icon;
        if (index == 0 && item_current == 0) {
          icon = 1; //错误 ×
        } else if (index > 0 || item_current > 0) {
          if (index == allScore || item_current == allScore) {
            icon = 2; //全对 √
          } else {
            icon = 3; //部分正确 
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
          scoreMark, // errorIconData: arr
          item_current: '',
        })
        console.log('flag', this.data.flag)
        if (i >= len && this.data.flag) {
          var _this = this;
          var swiper = _this.data.swiper;
          var current = swiper.current;
          var newAnserObj = swiper.imgUrls[current];
          if (_this.data.pathCount == 0) {
            newAnserObj.symbolPic = "";
            tonext();
          } else {
            _this.saveCanvas().then(res => {
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
  }
})
