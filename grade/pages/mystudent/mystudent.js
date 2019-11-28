// pages/parent/parent.js
import { getMystudentList} from '../../lib/api.js'
Page({
  data: {
    index:0,
    classList:[],
    studentList:[],
    toggle: false
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    var classList = this.data.classList;
    var id = classList[e.detail.value].classId;
    this.getStudent(id);
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var classList = options.classList;
    console.log(options.classList)
    if(classList){
      var classList = JSON.parse(classList)
      for(var i in classList){
        if(classList[i].length){
          for(var j in classList[i]){
            classList[i][j].toggle = false;
          }
        }
      }
      console.log('list',classList);
      this.setData({
        classList: classList
      })
    }
  },
  /*获取班级学生列表*/
  getStudent(e){
    var classId = e.currentTarget.dataset.classid;
    var classList = this.data.classList;
    for(var i in classList){
      if(classList[i].length){
        for(var j in classList[i]){
          if(classId == classList[i][j].classId){
            classList[i][j].toggle = !classList[i][j].toggle;
            if(!classList[i][j].studentList){
              this.getMystudentList(classId);
            }else if(classList[i][j].studentList.length == 0){
              wx.showToast({
                title: "暂无学生",
                icon: "none"
              })
              return false;
            }
          }else{
            classList[i][j].toggle = false;
          }
        }
      }
    }
    this.setData({
      classList
    })
  },
  getMystudentList(id){
    if(!id) return false;
    var classList = this.data.classList;
    var params = {
      classId: id
    }
    getMystudentList(params).then((res)=>{
      console.log("获取班级学生列表", res.data)
      if(res.code == 10000){
        for(var i in classList){
          if(classList[i].length){
            for(var j in classList[i]){
              if(id == classList[i][j].classId){
                if(res.data.length == 0){
                  wx.showToast({
                    title: "暂无学生",
                    icon: "none"
                  })
                }
                classList[i][j].studentList = res.data;
                classList[i][j].toggle = true;
                console.log(res.data)
              }else{
                classList[i][j].toggle = false;
              }
            }
          }
        }
        this.setData({
          classList
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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