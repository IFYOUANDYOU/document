let handle_path = 0,
  handle_Contexts = [];
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrls: {
      type: Array,
      observer: function (newVal, oldVal) {
        console.log(newVal, oldVal)
      }
    },
    imgInfo: {
      type: Object,
      observer: function (newVal, oldVal) {
        console.log(newVal, oldVal)
      }
    },
    posInfo: {
      type: Object,
      observer: function (newVal, oldVal) {
        console.log(newVal, oldVal)
      }
    },
    isDrow: {
      type: Boolean,
      observer: function (newVal, oldVal) {
        if (newVal) {
          console.log(newVal, oldVal);
          //this.addImg(this.data.imgUrl);
        }
      }
    },
    canvasWidth: {
      type: String
    },
    canvasHeight: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isClear: false,
    clearSize: 20,
    penColor: '#FF6047',
    lineWidth: 2,
    curContexts: [],
    pathCount: 0,
    contextCount: 0,
  },

  ready() {
    this.initCanvas();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initCanvas() {
      this.context = wx.createCanvasContext("lineCanvas", this);
    },
    /**
     * 触摸开始
     */
    canvasTouchStart: function (e) {
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
      handle_Contexts = [];
      var startX1 = e.changedTouches[0].x;
      var startY1 = e.changedTouches[0].y;
      var clearSize = this.data.clearSize,
        clearHalf = clearSize / 2;
      if (this.data.isClear) { //判断是否启用的橡皮擦功能  ture表示清除  false表示画画
        this.context.save();
        this.context.beginPath();
        this.context.arc(startX1, startY1, clearHalf, 0, Math.PI * 2);
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
      handle_Contexts = this.data.curContexts.filter(item => {
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
      var isDisabled = this.data.isDisabled;
      console.log("划线  触摸结束")
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
  }
})
