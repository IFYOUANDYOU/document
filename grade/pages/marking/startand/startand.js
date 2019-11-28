// pages/markPaper/showAnswer/showAnswer.js
const app = getApp();
var canOnePointMove = false
var onePoint = {
  x: 0,
  y: 0
}
let ratio = .9;
var twoPoint = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showStartand: {
      type: Boolean
    },
    startand: {
      type: Object,
      observer: function (newVal, oldVal) {
        console.log('newVal, oldVal')
        console.log(newVal, oldVal)
      }
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    msg: '',
    left: 20,
    top: 198,
    scale: 1,
    rotate: 0,
    staticImg: {
      width: '',
      height: ''
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadAnswer(ev) {

      console.log("******标准答案*******")
      console.log(ev)

      let imgWidth = app.globalData.systemInfo.screenWidth * 0.8;
      this.setData({
        staticImg: {
          width: imgWidth * 2,
          height: ev.detail.height / ev.detail.width * imgWidth * 2
        }
      })
    },
    touchstart: function (e) {
      var that = this
      if (e.touches.length < 2) {
        canOnePointMove = true
        onePoint.x = e.touches[0].pageX * 2
        onePoint.y = e.touches[0].pageY * 2
      } else {
        twoPoint.x1 = e.touches[0].pageX * 2
        twoPoint.y1 = e.touches[0].pageY * 2
        twoPoint.x2 = e.touches[1].pageX * 2
        twoPoint.y2 = e.touches[1].pageY * 2
      }
    },
    touchmove: function (e) {
      var that = this
      if (e.touches.length < 2 && canOnePointMove) {
        var onePointDiffX = e.touches[0].pageX * 2 - onePoint.x
        var onePointDiffY = e.touches[0].pageY * 2 - onePoint.y
        that.setData({
          msg: '单点移动',
          left: that.data.left + onePointDiffX,
          top: that.data.top + onePointDiffY
        })
        console.log(that.data.left + onePointDiffX, that.data.top + onePointDiffY)
        onePoint.x = e.touches[0].pageX * 2
        onePoint.y = e.touches[0].pageY * 2
      } else if (e.touches.length > 1) {
        var preTwoPoint = JSON.parse(JSON.stringify(twoPoint))
        twoPoint.x1 = e.touches[0].pageX * 2
        twoPoint.y1 = e.touches[0].pageY * 2
        twoPoint.x2 = e.touches[1].pageX * 2
        twoPoint.y2 = e.touches[1].pageY * 2
        // 计算角度，旋转(优先)
        var perAngle = Math.atan((preTwoPoint.y1 - preTwoPoint.y2) / (preTwoPoint.x1 - preTwoPoint.x2)) * 180 / Math.PI
        var curAngle = Math.atan((twoPoint.y1 - twoPoint.y2) / (twoPoint.x1 - twoPoint.x2)) * 180 / Math.PI
        if (Math.abs(perAngle - curAngle) > 1) {
          that.setData({
            msg: '旋转',
            rotate: that.data.rotate + (curAngle - perAngle)
          })
        } else {
          // 计算距离，缩放
          var preDistance = Math.sqrt(Math.pow((preTwoPoint.x1 - preTwoPoint.x2), 2) + Math.pow((preTwoPoint.y1 - preTwoPoint.y2), 2))
          var curDistance = Math.sqrt(Math.pow((twoPoint.x1 - twoPoint.x2), 2) + Math.pow((twoPoint.y1 - twoPoint.y2), 2))
          console.log(that.data.scale + (curDistance - preDistance) * 0.005)
          let scale = that.data.scale + (curDistance - preDistance) * 0.005;
          that.setData({
            msg: '缩放',
            scale: scale < .5 ? .5 : scale
          })
        }
      }
    },
    touchend: function (e) {
      var that = this
      canOnePointMove = false
      console.log('结束')
    },
  }
})
