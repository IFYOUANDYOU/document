// pages/login/bindPhone/bindPhone.js
import {
  sendCode,
  getSchoolList,
  bindInfo,
  getMyinformation
} from '../../../lib/api';
let timer,flag=true;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        console.log(getMyinformation)
        console.log(bindInfo)
        getMyinformation().then((res) => {
          console.log(res)
          if(res.data) {
            this.setData({
              school: res.data.school_name
            });
          }
        })
      }
    },
    isSchool:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    codeTime:0,
    phone:'',
    school: '',
    schoolId: '',
    schoolList:'',
    inputType:0,
    showSearch:true
  },
  ready(){
  },
  /**
   * 组件的方法列表
   */
  methods: {
    submit(){
      var params = {
        phone: this.data.phone,
        code: this.data.code,
      };
      if(this.properties.isSchool){
        schoolId: this.data.schoolId
      }
      bindInfo(params).then((res)=>{
        console.log(res)
        if(res.code == 10000){
          this.triggerEvent('myevent', {
            phone: this.data.phone
          });
        }
      })
    },
    clearPhone(){
      this.setData({
        phone: ''
      });
    },
    close(){
      this.triggerEvent('myevent',false);
    },
    bindKeyInputCode(el){
      this.setData({
        code: el.detail.value
      });
    },
    bindKeyInput(el) {
      this.setData({
        phone: el.detail.value
      });
    },
    bindKeyBlur(){
      this.setData({
        inputType: 0
      });
    },
    setFirst() {
      this.setData({
        inputType: 1
      });
    },
    setSecond() {
      this.setData({
        inputType: 2
      });
    },
    setThird(){
      this.setData({
        // showSearch:false,
        inputType: 3
      });
    },
    searchSchoolData(data){
      if (data) {
        getSchoolList(data).then((res) => {
          console.log(res)
          res.data.unshift({
            school_name:'无归属学校',
            id:'-1'
          })
          if (res.code == 10000) {
            this.setData({
              showSearch:false,
              schoolList: res.data
            })
          }
         
        })
      }
    },
    checkItem(el){
      this.setData({
        showSearch:true,
        school: el.currentTarget.dataset.info.school_name,
        schoolId: el.currentTarget.dataset.info.id
      })
    },
    searchSchool(el){
      this.setData({
        showSearch: false,
        school: el.detail.value
      });
      if(flag){
        this.searchSchoolData(el.detail.value);
        flag = false;
      }
      timer&&clearInterval(timer);
      timer = setTimeout(()=>{
        this.searchSchoolData(el.detail.value);
        flag = true;
      },1000)
    },
    getCode() {
      if (!(/^1[345789]\d{9}$/.test(this.data.phone))) {
        wx.showToast({
          icon: 'none', //success / fail / exception / none
          title: '手机号码有误，请重填',
          duration: 3000
        });
        return;
      }
      

      let params = {
        phone: this.data.phone,
        type: 4 // 1,注册 2, 登录 3,找回密码 4,绑定手机
      }
      sendCode(params).then((res) => {
        console.log(res)
        if(res.code == 10000){
          this.setData({
            codeTime: 60
          });
          timer && clearInterval(timer);
          timer = setInterval(() => {
            if (this.data.codeTime == 0) {
              clearInterval(timer);
              this.setData({
                codeTime: 60
              });
            } else {
              this.setData({
                codeTime: --this.data.codeTime
              });
            }
            
          }, 1000);
        } else {
          wx.showToast({
            icon: 'none', //success / fail / exception / none
            title: '验证码获取出错',
            duration: 3000
          });
        }
      })
    }
  }
})
