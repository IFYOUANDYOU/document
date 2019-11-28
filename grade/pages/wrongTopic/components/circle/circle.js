// import Canvas from '../../utils/canvas.js'
Component({
  /**
   * 页面的初始数据
   */
  data: {
    flag:true,
    percentage: '', //百分比
    animTime: '', // 动画执行时间
  },
  properties:{
    type:{
      type: Number,
      // value: '',
      observer: function (newVal, oldVal) {
      }
    },
    content: {
      type: Object,
      // value: '',
      observer: function (newVal, oldVal) {
        // console.log(this.data.content.getScore, this.data.content.allScore)
        this.draw('runCanvas', parseInt(this.data.content.lostJl*100)||0, 2000);
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  ready() {
    
  },
  methods:{
      // 绘制圆形进度条方法
      run(c, w, h) {
        let num = (2 * Math.PI / 100 * c) - 0.5 * Math.PI;
        this.data.ctx2.arc(w, h, w - 5, -0.5 * Math.PI, num); //每个间隔绘制的弧度
        let color = this.data.type == 1 ? '#FF6047' : this.data.type == 2 ? '#5CB3FF' :'#24C789'
        this.data.ctx2.setStrokeStyle(color);
        this.data.ctx2.setLineWidth("10");
        this.data.ctx2.setLineCap("round");
        c&&this.data.ctx2.stroke();
        this.data.ctx2.beginPath();
        this.data.ctx2.setFontSize(17); //注意不要加引号
        this.data.ctx2.setFillStyle("#1D2023");
        this.data.ctx2.setTextAlign("center");
        this.data.ctx2.setTextBaseline("middle");
        this.data.ctx2.fillText(c + "%", w, h+10);

        this.data.ctx2.stroke();
        this.data.ctx2.beginPath();
        this.data.ctx2.setFontSize(12); //注意不要加引号
        this.data.ctx2.setFillStyle("#1D2023");
        this.data.ctx2.setTextAlign("center");
        this.data.ctx2.setTextBaseline("middle");
        this.data.ctx2.fillText(this.data.type == 1 ? '简单题' : this.data.type == 2?'中等题':'难题', w, h-10);

        this.data.ctx2.draw();
      },
      /**
       * start 起始百分比
       * end 结束百分比
       * w,h 其实就是圆心横纵坐标
       */
      // 动画效果实现
      canvasTap(start, end, time, w, h) {
        start++;
        if(this.data.flag){
          this.setData({
            flag:!this.data.flag
          })
          this.run(0, w, h);
        }
        if (start > end ||  !end) {
          return false;
        }
        this.run(start, w, h);
        setTimeout(()=> {
          this.canvasTap(start, end, time, w, h);
        }, time);
      },
      /**
       * id----------------canvas画板id
       * percent-----------进度条百分比
       * time--------------画图动画执行的时间  
       */
      draw(id, percent, animTime) {
        var that = this;
        const ctx2 = wx.createCanvasContext(id,this);
        that.setData({
          ctx2: ctx2,
          percentage: percent,
          animTime: animTime
        });
        var time = that.data.animTime / that.data.percentage;
        wx.createSelectorQuery().in(this).select('#' + id).boundingClientRect(function (rect) { //监听canvas的宽高
          var w = parseInt(rect.width / 2); 
          //获取canvas宽的的一半
          var h = parseInt(rect.height / 2); 
          //获取canvas高的一半，
          that.canvasTap(0, that.data.percentage, time, w, h)
        }).exec();
      },
  }
})