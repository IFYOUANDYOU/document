// pages/wrongTopic/components/loseDifficulty/loseDifficulty.js
import {
  difficultyInfo
} from '../../../../lib/api';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    examId: {
      type: Number,
      observer: function (newVal, oldVal) {

      }
    },
    studentId: {
      type: Number,
      observer: function (newVal, oldVal) {

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    contentArr:[]
  },
  ready(){
    this.init();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init(){
      difficultyInfo({
        examId:this.data.examId,
        studentId: this.data.studentId
      }).then(res=>{
        console.log(res)
        if(res.code == 10000) {
          this.setData({
            contentArr:res.data
          })
        }
      })
    }
  }
})
