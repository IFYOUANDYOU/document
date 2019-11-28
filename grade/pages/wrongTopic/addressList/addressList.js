
import {
  studentList
} from '../../../lib/api';
const app = getApp();
Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    isActive: null,

    listMain: [
      // {
      //   id: "", 
      //   region: "",
      //   brands: [
      //     { id: "", name: "" }
      //   ]
      // }
      ],
    listTitles: [],
    fixedTitle: '',
    toView: 'inToView0',
    oHeight: [],
    scroolHeight: 0,

    examId:787,
    isClick:false
  },
 
  //点击右侧字母导航定位触发
  scrollToViewFn: function (e) {
    var that = this;
    var _id = e.target.dataset.id;
    for (var i = 0; i < that.data.listMain.length; ++i) {
      console.log(that.data.listMain[i].id , _id)
      if (that.data.listMain[i].id === _id) {
        that.setData({
          isActive: _id,
          isClick:true,
          toView: 'inToView' + _id
        },()=>{
          setTimeout(()=>{
            that.setData({
              isClick: false
            });
          },500)
        })
        break
      }
    }
  },
  toBottom: function (e) {
    console.log(e)
  },
  // 页面滑动时触发
  onPageScroll: function (e) {
    if(this.data.isClick) {
      return
    }
    this.setData({
      scroolHeight: e.detail.scrollTop
    });
   
    for (let i in this.data.oHeight) {
      if (e.detail.scrollTop < this.data.oHeight[i].height) {
        console.log(this.data.oHeight[i].key)
        this.setData({
          isActive: this.data.oHeight[i].key,
          fixedTitle: this.data.oHeight[i].name
        });
        return false;
      }
    }

  },
  // 处理数据格式，及获取分组高度
  getBrands: function () {
    var that = this;
    // wx.request({
    //   url: '获取数据地址',
    //   success(res) {
        // if (res.data.status == 0) {
        //   var someTtitle = null;
        //   var someArr = [];
        //   for (var i = 0; i < res.data.data.length; i++) {
        //     var newBrands = { brandId: res.data.data[i].brandId, name: res.data.data[i].brandName };
        //     if (res.data.data[i].initial != someTtitle) {
        //       someTtitle = res.data.data[i].initial
        //       var newObj = {
        //         id: i,
        //         region: someTtitle,
        //         brands: []
        //       };
        //       someArr.push(newObj)
        //     }
        //     newObj.brands.push(newBrands);

        //   };
          //赋值给列表值
          // that.setData({
          //   listMain: someArr
          // });
          //赋值给当前高亮的isActive
          that.setData({
            isActive: that.data.listMain[0].id,
            fixedTitle: that.data.listMain[0].region
          });

          //计算分组高度,wx.createSelectotQuery()获取节点信息
          var number = 0;
          for (let i = 0; i < that.data.listMain.length; ++i) {
            wx.createSelectorQuery().select('#inToView' + that.data.listMain[i].id).boundingClientRect(function (rect) {
              number = rect.height + number;
              var newArry = [{ 'height': number, 'key': rect.dataset.id, "name": that.data.listMain[i].region }]
              that.setData({
                oHeight: that.data.oHeight.concat(newArry)
              })
            }).exec();
          };

        // }
      // }
    // })
  },
  showReport(el){
    console.log(el.currentTarget.dataset.info)
    wx.navigateTo({
      url: `/pages/wrongTopic/answerList/answerList?examId=${this.data.examId}&info=${JSON.stringify(el.currentTarget.dataset.info)}`
    })
  },
  getList(name=''){
    studentList({
      name:name,
      examId:this.data.examId
    }).then(res=>{
      console.log(res)
      
      this.setData({
        listMain:res.data
      },()=>{
        if (res.data.length>0) {
          this.getBrands();
        }
      })
    })
  },
  search(el){
    console.log(el.detail.value)
    this.getList(el.detail.value)
  },
  onLoad: function (options) {
    this.setData({
      examId:options.examId
    },()=>{
      app.globalData.chooseExamId = options.examId
      this.getList();
    })
    
  }
})