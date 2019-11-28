// pages/user/user.js
const app = getApp();
import { updateInfo, getInfo, getMyinformation, getScanList2, getMyclass} from '../../lib/api.js'
Component({
  properties: {
    type: {
      type: Number,
      value: '',
      observer: function (newVal, oldVal) {
        // 属性值变化时执行
        if(newVal == 3) {
          this.getUserInfo();
          this.getInfromation();
          this.getScanerNum();
          this.getClass();
        }
      }
    }
  },
  data: {
    userInfo:{},      //用户信息
    editStatus:false, //开启编辑状态
    infromation:{
      parentNum: "",
      schoolId: "",
      school_name: "",
      studentNum: "",
    },  //学校 家长 学生等信息
    scanNum:'',      //扫描仪数量
    classList:[] ,    //班级列表
    openPhone:false,
    showContent:false
  },
  ready(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  attached() {

  },
  pageLifetimes: {
    show() {
      this.getUserInfo();
      this.getInfromation();
      this.getScanerNum();
      this.getClass();
    },
  },
  methods:{
    goOptions(e) {
      var type = e.currentTarget.dataset.type;
      var classArr = this.data.classList;
      // var classArr = [{ class: '高中2016级', stuNum: 3, classId: 222 }, { class: '高中2017级', stuNum: 30, classId: 232 }]
      var classList = JSON.stringify(classArr);
      var infromation = this.data.infromation;
      if (type == '1') {
        wx.navigateTo({
          url: '../school/school?name=' + infromation.school_name,
        })
      } else if (type == '2') {
        if (classArr.length == 0 || infromation.studentNum == 0) {
          wx.showToast({
            title: '没有学生',
            icon: 'none'
          })
          return
        }
        wx.navigateTo({
          url: '../mystudent/mystudent?classList=' + classList,
        })
      } else if (type == '3') {
        if (classArr.length == 0 || infromation.parentNum == 0) {
          wx.showToast({
            title: '没有家长',
            icon: 'none'
          })
          return
        }
        wx.navigateTo({
          url: '../myparent/myparent?classList=' + classList,
        })
      } else if (type == '4') {
        var infromation = this.data.infromation;
        var scanNum = this.data.scanNum;
        if(scanNum == 0 || scanNum.length == 0){
          wx.showToast({
            title: '没有扫描仪',
            icon: 'none'
          })
          return
        }
        wx.navigateTo({
          url: '../myscanner/myscanner?schoolName=' + (infromation.school_name ? infromation.school_name : '无归属学校'),
        })
      }
    },
    /*完成编辑后触发 */
    updateName(e) {
      console.log(e.detail.value)
      var name = e.detail.value;
      if (!name) {
        // wx.showToast({
        //   icon:'none',
        //   title: '名称不能为空',
        // })
        return
      }
      var params = {
        userName: name
      }
      updateInfo(params).then((res) => {
        if (res.code == 10000) {
          wx.showToast({
            title: '修改成功',
          })
          this.getUserInfo();
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
      this.setData({
        editStatus: false
      })
    },
    /*点击编辑*/
    editName() {
      this.setData({
        editStatus: true
      })
    },
    /*获取用户信息 */
    getUserInfo() {
      getInfo().then((res) => {
        console.log("获取用户信息：",res.data)
        if (res.code == 10000) {
          this.setData({
            userInfo: res.data,
            showContent: true
          })
        }
      })
    },
    /*获取我的学生 家长 学校等*/
    getInfromation() {
      getMyinformation().then((res) => {
        console.log("获取我的学生 家长 学校等：",res.data)
        if (res.code == 10000) {
          var data = res.data;
          var infromation = {
            parentNum: data.parentNum || 0,
            schoolId: data.schoolId,
            school_name: data.school_name || "无归属学校",
            studentNum: data.studentNum || 0,
          }
          this.setData({
            infromation
          })
        }
      })
    },
    /*获取我的扫描仪数量*/
    getScanerNum() {
      getScanList2({}).then((res) => {
        console.log("获取我的扫描仪数量：",res.data)
        if (res.code == 10000) {
          var arr = [];
          var scanlist = res.data;
          for(let i =0;i<scanlist.length;i++){
            if (scanlist[i].userStatus != 2){
              arr.push(scanlist[i])
            }
          }
          this.setData({
            scanNum: arr.length
          })
        }
      })
    },
    /*获取班级列表*/
    getClass() {
      getMyclass().then((res) => {
        console.log("获取班级列表: ",res.data)
        if (res.code == 10000) {
          this.setData({
            classList: res.data
          })
        }
      })
    },
    /*绑定电话*/
    bindPhone() {
      console.log('打开')
      this.setData({
        openPhone:true
      })
    },
    closePhone(el){
      this.setData({
        openPhone:false
      });
      app.globalData.wechatUserData.userPhone = el.detail.phone
      this.getUserInfo();
      this.getInfromation();
    }
  }
})