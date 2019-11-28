
import {
  wechatapplet
} from '../../../lib/api';

const app = getApp();
Page({
  data: {
    scene:'',  //页面传参
    userInfo:'',
    isShow:false,   //页面是否显示
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onLoad(query) {
    console.log(query)
    const scene = decodeURIComponent(query.scene);
    // const scene = 'F0DEF1D5AF7C'; //测试使用
    
    if (scene && scene !='undefined') {
      console.log(scene)
      this.setData({
        scene: scene
      })
    }

    console.log(this.data.canIUse)
   
    // 查看是否授权
    wx.cloud.callFunction({
      name: 'getInfo',
      success: res => {
        console.log(res)
        this.setData({
          userInfo: res.result.userInfo
        },()=>{
          this.getUserInfo();
        })
      }
    })
  },
  getUserInfo(){ //自动获取用户信息
    let _this = this;
    wx.getSetting({  //自动获取
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              app.globalData.userInfo = res.userInfo;
              _this.signIn(res.userInfo)
              console.log(res.userInfo)
            }
          })
        } else {  //没有授权
          _this.setData({
            isShow: true
          })
        }
      }
    })
  },
  signIn(userData){
    wechatapplet({
      // unionid: this.data.userInfo.openId, 
      openid: this.data.userInfo.openId,
      nickName: userData.nickName,
      avatarUrl: userData.avatarUrl,
      gender: userData.gender,
      country: userData.country,
      province: userData.province,
      city: userData.city,
      language: userData.language,
    }).then((res) => {
      console.log(this.data.scene);
      app.globalData.wechatUserData = res.data;
      if (this.data.scene && this.data.scene != 'undefined') {
        wx.reLaunch({
          url: '/pages/login/bindScanner/bindScanner?mac=' + this.data.scene,
        })
       
      } else {
        wx.reLaunch({
          url: '/pages/home/home',
        })
        
      }
     
    })
  },
  bindGetUserInfo(e) {  //点击授权
    app.globalData.userInfo = e.detail.userInfo;
    console.log(e);
    let userData = e.detail.userInfo;  //用户信息
    userData&&this.signIn(userData)
  }
})