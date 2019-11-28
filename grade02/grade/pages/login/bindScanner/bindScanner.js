import { 
  bindScanThe,
  sanqr,
  getSchoolList
} from '../../../lib/api';
const app = getApp();
let timer, flag = true;
Page({
  data: {
    number:'',
    unionCode:'',
    innerHeight:'',
    showSearch:false,
    schoolList:'',
    school:'',
  },
  onLoad(query){
    console.log(query)
    this.setData({
      unionCode:query.mac
    })
  },
  bindKeyBlur() {
    this.setData({
      inputType: 0
    });
  },
  searchSchoolData(data) {
    if (data) {
      getSchoolList(data).then((res) => {
        console.log(res)
        res.data.push({
          school_name: '无归属学校',
          id: '-1'
        })
        if (res.code == 10000) {
          this.setData({
            showSearch: false,
            schoolList: res.data
          })
        }

      })
    }
  },
  setThird() {
    this.setData({
      // showSearch:false,
      inputType: 3
    });
  },
  searchSchool(el) {
    this.setData({
      showSearch: false,
      school: el.detail.value
    });
    if (flag) {
      this.searchSchoolData(el.detail.value);
      flag = false;
    }
    timer && clearInterval(timer);
    timer = setTimeout(() => {
      this.searchSchoolData(el.detail.value);
      flag = true;
    }, 1000)
  },
  clearSchool(){
    this.setData({
      showSearch: true,
      school: '',
      schoolId: ''
    })
  },
  checkItem(el) {
    this.setData({
      showSearch: true,
      school: el.currentTarget.dataset.info.school_name,
      schoolId: el.currentTarget.dataset.info.id
    })
  },
  bindKeyBlur() {
    this.setData({
      inputType: 0
    });
  },
  cancle(){
    dd.navigateBack({
      deltwx: 1
    })
  },
  bindNumber(){
    if (!this.data.number) {
      wx.showToast({
        icon: 'none', //success / fail / exception / none
        title: '扫描仪名称不能为空',
        duration: 3000
      });
      return;
    }
    if (!this.data.schoolId) {
      wx.showToast({
        icon: 'none', //success / fail / exception / none
        title: '归属学校不能为空',
        duration: 3000
      });
      return;
    }
    let params = {
      unionCode: this.data.unionCode,
      type:'',
      name:this.data.number
    }
    bindScanThe(params).then((res)=>{
      if (res.code!=10000) {
        wx.showToast({
          icon: 'none', //success / fail / exception / none
          title: res.msg,
          duration: 3000,
          success:()=>{
            // console.log('start')
            setTimeout(()=>{
              wx.reLaunch({
                url: '/pages/home/home',
              })
            },3000);
          }
        });
      } else {
        wx.showToast({
          icon: 'success', //success / fail / exception / none
          title: '绑定成功',
          duration: 3000,
          success:()=>{
            sanqr({
              code: this.data.unionCode
            }).then(()=>{
              wx.reLaunch({
                url: '/pages/home/home',
              })
            })
            
          }
        });
      }
    })
  },
  bindKeyInput(el){
    this.setData({
      number:el.detail.value
    });
  }
});
