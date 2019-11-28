// pages/wrongTopic/scoreItem/scoreItem.js



import { getQuestionChoiceRateListPost,
  getExamBaseInfo
 } from '../../../lib/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totleScore:100,
    anserArr:[]
  },
  bindKeyInput(e) {
    console.log(e.target.dataset.info)
    
    let index = e.target.dataset.info;
    if (!e.detail.value) {
      this.data.anserArr.pop();
    } else if (e.detail.value*1 >= this.data.anserArr[index].start*1) {
      wx.showToast({
        icon: 'none', //success / fail / exception / none
        title: '当前输入不能大于或等于起始值',
        duration: 3000
      });
      this.data.anserArr[index].end = '';
    } else if (e.detail.value * 1 ==0) {
      wx.showToast({
        icon: 'none', //success / fail / exception / none
        title: '输入值不能小于0',
        duration: 3000
      });
      this.data.anserArr[index].end = '';
    } else {
      this.data.anserArr[index].end = e.detail.value;
    }
    
    this.setData({
      anserArr: this.data.anserArr
    })
  },
  save(){
    console.log(this.data.anserArr)
    let flag = true;
    this.data.anserArr.map(item=>{
      if(!item.end) {
        flag = false
      }
    })
    if(!flag) {
      wx.showToast({
        icon: 'none', //success / fail / exception / none
        title: '请填写完整后提交',
        duration: 3000
      });
      return
    }
    this.data.anserArr.push({
      "start": this.data.anserArr[this.data.anserArr.length - 1].end,
      "end":0
    });
    getQuestionChoiceRateListPost({
      "examId":this.data.examId,
      "list": this.data.anserArr
    }).then(res=>{
      if(res.code==10000){
        wx.showToast({
          icon: 'success', //success / fail / exception / none
          title: '设置成功',
          duration: 3000
        });
        setTimeout(()=>{
          wx.redirectTo({
            url: `/pages/score/scoreAnalyze/scoreAnalyze?type=1&examId=${this.data.examId}`
          })
        },1000)
      }
      console.log(res)
    })
  },
  addRange(){
    let arr = this.data.anserArr, len = this.data.anserArr.length;
    
    if(len<1) {
      arr.push({
        "start": this.data.totleScore,
        "end": ''
      })
    } else {
      if (!arr[len - 1].end) {
        wx.showToast({
          icon: 'none', //success / fail / exception / none
          title: '输入不能为空',
          duration: 3000
        });
        return
      } 
      arr.push({
        "start": arr[len-1].end,
        "end": ''
      })
    };
    console.log(arr)
    this.setData({
      anserArr:arr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      examId: options.examId
    },()=>{
      getExamBaseInfo({
        id: options.examId
      }).then(res=>{
        console.log(res)
        this.setData({
          totleScore: res.data.fullMark
        })
      })
    });
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})