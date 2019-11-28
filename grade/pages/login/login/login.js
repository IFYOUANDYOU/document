import { 
  signIn,
  getInfo,
  dingtalk,
  sanqr
} from '../../../lib/api';
const app = getApp();
let timer;
Page({
  data: {
    innerHeight:0,
    codeTime:60,
    phone:'',
    password:'',
    code:'',
    isLogin:true,
    type:1 // 1密码登陆  2验证码登录
  },
  bindKeyInput(el){
    this.setData({
      phone:el.detail.value
    });
  },
  bindKeyInputTwo(el){
    this.setData({
      code:el.detail.value
    });
  },
  bindKeyInputThree(el){
    this.setData({
      password:el.detail.value
    });
  },
  onLoad(options) {
    // options.mac = '68F72826A580';
    if(options.phone) {
      this.setData({
        phone:options.phone
      })
    } else if (options.mac) {
      app.globalData.mac = options.mac;
      sanqr({
        code:app.globalData.mac
      }).then((res)=>{
        console.log(JSON.stringify(res));
      })
    };

    // dd.setNavigationBar({
    //   title: '  ',
    //   backgroundColor: '#FFA900'
    // });
    // this.setData({
    //   innerHeight:app.globalData.sysInfo.windowHeight*app.globalData.sysInfo.pixelRatio
    // })
   
  },
  changeTab(el){
    console.log(el)
    this.setData({
      type:el.target.dataset.info
    })
  },
  clearPsw(){
    this.setData({
      password:''
    })
  },
  forgetPsw(){
     wx.navigateTo({
      url:'../register/register?type=2'
    })
  },
  toRegister(){
    wx.navigateTo({
      url:'../register/register?type=1'
    })
  },
  signIn(el){
    if(!this.data.isLogin) {
      return
    }
    console.log(el)
    if(!(/^1[345789]\d{9}$/.test(this.data.phone))){ 
      dd.showToast({
        type: 'exception', //success / fail / exception / none
        content: '手机号码有误，请重填',
        duration: 3000
      });
      return false; 
    } 
    let type = el.target.dataset.info;
    let params;
    if(type==1) {
      params = {
        phone:this.data.phone, 
        type:2, 
        cont:this.data.password
      }
    } else {  //验证码
      params = {
        phone:this.data.phone, 
        type:1, 
        cont:this.data.code
      }
    }
    signIn(params).then((res)=>{
      this.setData({  //防止重复提交
        isLogin:true
      })
      if (res.code!=10000) {
        dd.showToast({
          type: 'fail', //success / fail / exception / none
          content: res.msg,
          duration: 3000
        });
      } else {
        getInfo().then((res)=>{
          if(res.code == 10000){
            if(res.data.userName) { //用户账号信息存在
              console.log(app.globalData)
              app.globalData.ddSelfInfo = res.data;
              if(app.globalData.mac) {
                wx.navigateTo({
                  url:'../bindScanner/bindScanner'
                })
              }else {
                wx.reLaunch({
                  url: '../../examManage/examManage'
                });
              }
            } else {    //用户账号信息不存在
              wx.navigateTo({
                url:'../complateInfo/complateInfo'
              })
            } 
          } else {
            wx.showToast({
              type: 'error', //success / fail / exception / none
              title: '登陆失败',
              duration: 3000
            });
          }
        })
      }
    })
  },
  getCode(){
    if(!(/^1[345789]\d{9}$/.test(this.data.phone))){ 
      dd.showToast({
        type: 'exception', //success / fail / exception / none
        content: '手机号码有误，请重填',
        duration: 3000
      });
      return false; 
    } 
    this.setData({
      codeTime:60
    });
    timer&&clearInterval(timer);
    timer = setInterval(()=>{
      if(this.data.codeTime == 0){
        clearInterval(timer);
        this.setData({
          codeTime:60
        });
      }
      this.setData({
        codeTime:--this.data.codeTime
      });
    },1000)
  }
});
