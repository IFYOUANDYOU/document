// pages/wrongTopic/compoents/knowladgeLost/knowladgeLost.js

import {
  getKnowledgePoint
} from '../../../../lib/api';
let maxScore = 0;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    examId: {
      type: Number,
      observer: function (newVal, oldVal) {
        if(newVal) {
          if (this.data.studentId && this.data.studentId > 0) {
            this.getInfo();
          } else {
            setTimeout(() => {
              this.getInfo();
            }, 1500)
          }
        }
      }
    },
    studentId: {
      type: Number,
      observer: function (newVal, oldVal) {
        // this.getInfo();
      }
    },
    studentName: {
      type: String,
      observer: function (newVal, oldVal) {
        // this.getInfo();
      }
    },
    innerHeight: {
      type: String,
      value:0,
      observer: function (newVal, oldVal) {
        // this.getInfo();
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showSearch:true,
    loadMore:true,
    typeBar:1,
    start: 0,
    contentArr:[],
    maxScore:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadMore(){
      this.setData({
        start:this.data.start+5
      },()=>{
        this.getInfo();
      })
    },
    searchStudent(el){
      maxScore = 0;
      console.log(el.currentTarget.dataset.info)
      this.setData({
        start: 0,
        loadMore: true,
        showSearch: true,
        typeBar: el.currentTarget.dataset.info
      },()=>{
        this.getInfo(2);
      })
    },
    cancle(){
      this.setData({
        showSearch: true
      })
    },
    choseKnowladge(){
      this.setData({
        showSearch:false
      })
    },

    showContent(el){
      let index = el.currentTarget.dataset.index;
      let info = el.currentTarget.dataset.info;
      this.data.contentArr[index].active = !this.data.contentArr[index].active;
      this.setData({
        contentArr: this.data.contentArr
      })
      console.log(index)
      console.log(info)
    },
    getInfo(type){
      // getQuestionChoiceRateList({

      // })
     
      getKnowledgePoint({
        id:this.data.examId,
        start:this.data.start,
        type: this.data.typeBar,
        studentId:this.data.studentId
      }).then(res=>{
       
        if(res.code != 10000){
          return
        }
        if(!res.data) {
          this.setData({
            loadMore:false
          })
          return;
        }
        let data = res.data;
        data.map(item=>{
          item.active = false;
          item.precent = this.data.studentId == 0 ? ((item.avg / item.fullMark) * 100).toFixed(1) : ((item.studentKnowSum / item.fullMark) * 100).toFixed(1);
          if (item.fullMark > maxScore){
            maxScore = item.fullMark;
          }
          return item
        })
        console.log(maxScore)
        this.setData({
          maxScore: maxScore,
          contentArr: [].concat(type==2?[]:this.data.contentArr,data)
        })
      })
    },
    toLostList(el){
      let data = el.currentTarget.dataset.info;
      console.log(data)
      if (data.studentLoseCentNumber<1){
        wx.showToast({
          icon: 'none', //success / fail / exception / none
          title: '没有丢分的人',
          duration: 3000
        });
        return
      }
      wx.navigateTo({
        url: `/pages/wrongTopic/loseList/loseList?dataInfo=${JSON.stringify(el.currentTarget.dataset.info)}&examId=${this.data.examId}`
      })
    }
  }
})
