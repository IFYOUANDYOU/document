import {
  getSchoolList,
  updateInfo
} from '../../../lib/api';
const app = getApp();
Page({
  data: {
    name:'',
    listDatwx:[],
    type:1,
    index:0
  },
  bindKeyInput(el){
    this.setData({
      name:el.detail.value
    });
  },
  changeRadio(el){
    this.setData({
      type:el.target.dataset.info
    })
  },
  bindPickerChange(){
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value,
    });
  },
  bindInfo(){
     if(!this.data.name){ 
      dd.showToast({
        type: 'exception', //success / fail / exception / none
        content: '姓名昵称不能为空',
        duration: 3000
      });
      return false; 
    } 
    var params = {
      userName:this.data.name,
      schoolId:this.data.type==1?this.data.listData[this.data.index].id:''
    };
    updateInfo(params).then((res)=>{
      console.log(res)
      if (res.code == 10000) {
        if(app.globalData.mac) {
          dd.redirectTo({
            url:'../bindScanner/bindScanner'
          })
        }else {
          dd.redirectTo({
            url: '../../examManage/examManage'
          })
        };
      } else {
        dd.showToast({
          type: 'fail', //success / fail / exception / none
          content: '用户信息绑定失败',
          duration: 3000
        });
      }
      
    })
  },
  onLoad() {
    if(app.globalData.ddSelfInfo) {
      this.setData({
        name:app.globalData.ddSelfInfo.dingTalk.nick
      })
    }
    getSchoolList(1).then((res)=>{
      console.log(res)
      this.setData({
        listDatwx:res.data
      })
    })
  },
});
