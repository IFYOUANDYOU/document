// pages/wrongTopic/previewPDF/previewPDF.js
var _pdf = require("../../../utils/pdf.js");
var _work = require("../../../utils/pdf.worker.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guide: false,
    pdfIndex: 1,
    pdflist: [{
        id: 0,
        name: "201901期（月刊）"
      },
      {
        id: 1,
        name: "201902期（月刊）"
      },
      {
        id: 2,
        name: "201903期（月刊）"
      },
      {
        id: 3,
        name: "201904期（月刊）"
      },
      {
        id: 4,
        name: "201905期（月刊）"
      },
      {
        id: 5,
        name: "201906期（月刊）"
      }
    ],
    startX: 0,
    endX: 0,
    distance: 0,
    previewIndex: 0,
    previewDir: "",
    previewFlag: true,
    previewImg: [
      {
        id: 1,
        src: "/image/wrongs/cover-icon.png"
      },
      {
        id: 2,
        src: "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1567757207&di=f2b5326237c4200f8b5a32d53c460757&src=http://b-ssl.duitang.com/uploads/item/201206/11/20120611222355_n5cJz.jpeg"
      },
      {
        id: 3,
        src: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567767291472&di=56c84444ad88248a73b6a97959cc294f&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201410%2F02%2F20141002114400_syBsT.jpeg"
      },
      {
        id: 4,
        src: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567767291470&di=bef77a9150457ef22cbf1e9d5401ce48&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fc7f91201f66d3da362842521bb9bce845b601d5a82473-lWWxkV_fw658"
      },
      {
        id: 5,
        src: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567767349319&di=8218552c9062e8b82c07a232b77c6bbb&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201308%2F28%2F20130828084111_AnZaV.jpeg"
      },
      {
        id: 6,
        src: "http://www.hinews.cn/pic/0/10/88/86/10888693_395764.jpg"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPageData();
  },

  initPageData() {
    let previewImg = this.data.previewImg;
    previewImg.forEach((item, index) => {
      item.isturn = false;
      if (!index) {
        item.zIndex = 4
        // 在数据初始化的时候就把第二张图片的层级提升
      } else if (index == 1) {
        item.zIndex = 3
      } else {
        item.zIndex = 1
      }
    })
    previewImg[0].isturn = true;
    this.setData({
      previewImg,
      previewDir: "next"
    })
  },

  bindPdfChange(e) {
    this.setData({
      pdfIndex: e.detail.value
    })
  },
  previewTouchstart(e){
    this.setData({
      startX: e.touches[0].pageX
    })
  },
  previewTouchmove(e){
    let startX = this.data.startX, endX = e.touches[0].pageX;
    let distance = endX - startX;
    if(Math.abs(distance) < 5) return false;
    this.setData({
      distance
    })
  },
  previewTouchend(e){
    let distance = this.data.distance;
    let imgs = this.data.previewImg;
    let index = this.data.previewIndex, newIndex = index;
    let previewDir = this.data.previewDir;
    if(distance > 5){
      //right move
      console.log("<=")
      if(index == 0){
        return false;
      }
      previewDir = "prev";
      index -= 1;
    }
    if(distance < 5){
      //left move
      console.log("=>");
      if(index == imgs.length - 1){
        return false;
      }
      previewDir = "next";
      index += 1;
    }
    console.log(index)
    imgs.map((ele, i) => {
      if (index == i) {
        imgs[i].isturn = true;
        imgs[i].zIndex = 4;
      } else {
        imgs[i].isturn = false;
        imgs[i].zIndex = 1;
      }
    })
    if (index - 1 >= 0) {
      imgs[index - 1].zIndex = 3;
    }
    if (index + 1 < imgs.length) {
      imgs[index + 1].zIndex = 3;
    }
    if (index - 2 >= 0) {
      imgs[index - 2].zIndex = 2;
    }
    if (index + 2 < imgs.length) {
      imgs[index + 2].zIndex = 2;
    }
    this.setData({
      previewImg: imgs,
      previewIndex: index,
      previewDir
    })
  },
  // transition动画结束
  previewFinish() {
    this.data.previewFlag = true;
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