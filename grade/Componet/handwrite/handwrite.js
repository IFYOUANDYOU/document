// Componet/handWrite/handWrite.js
var ctx, canvasw = 0, canvash = 0, touchs = [];//ctx初始化上下文 touchs
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    canvasImg: ""
  },

  attached() {
    this.initCanvas();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //初始化canvas
    initCanvas(e) {
      ctx = wx.createCanvasContext('lineCanvas');//获得Canvas的上下文
      ctx.setStrokeStyle("#FF6047");//设置线的颜色
      ctx.setLineWidth(2);//设置线的宽度
      ctx.setLineCap('round');//设置线两端端点样式更加圆润
      ctx.setLineJoin('round');//设置两条线连接处更加圆润
    },
    // 画布的触摸移动开始响应
    canvasTouchStart: function (event) {
      let point = { x: event.changedTouches[0].x, y: event.changedTouches[0].y };//获取触摸开始的 x,y
      touchs.push(point)
    },
    // 画布的触摸移动响应
    canvasTouchMove: function (e) {
      let point = { x: e.touches[0].x, y: e.touches[0].y };
      touchs.push(point);
      if (touchs.length >= 2) {
        this.drawLine(touchs);
      }
    },
    // 画布的触摸结束手势响应
    canvasTouchEnd: function (e) {
      console.log("画布的触摸结束手势响应" + e);//画布的触摸结束手势响应
      for (let i = 0; i < touchs.length; i++) {
        touchs.pop();
      }
    },
    canvasTouchCancel: function (e) {
      console.log("画布的触摸取消响应" + e);//画布的触摸取消响应
    },
    canvasTouchLongtap: function (e) {
      console.log("画布的长按手势响应" + e);//画布的长按手势响应
    },
    canvasTouchError: function (e) {
      console.log("画布触摸错误" + e);//画布触摸错误
    },
    //绘制线条
    drawLine: function (touchs) {
      let start = touchs[0];
      let end = touchs[1];
      touchs.shift();
      console.log(start.x, start.y, end.x, end.y)
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.draw(true);
    },
    //清除画布
    clearCanvas: function () {
      ctx.clearRect(0, 0, canvasw, canvash);
      ctx.draw(true)
    },
    //将canvas的操作保存成图片
    saveCanvas: function () {
      var that = this;
      wx.canvasToTempFilePath({
        canvasId: 'lineCanvas',
        success: function (res) {
          console.log(res.tempFilePath);//打印图片路径
        }
      })
    },
  }
})
