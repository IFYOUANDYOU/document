const resdata = {
  "code": "10000",
  "msg": "OK",
  "data": [
    {
    "brands": [{
      "student_id": 4827,
      "hasList": false,
      "student_name": "包丽"
    }],
    "id": 1,
    "region": "B"
  }, 
  {
    "brands": [{
      "student_id": 4834,
      "hasList": true,
      "student_name": "蔡娅静"
    }, {
      "student_id": 4815,
      "hasList": false,
      "student_name": "陈康"
    }, {
      "student_id": 4840,
      "hasList": false,
      "student_name": "陈伊利"
    }, {
      "student_id": 4842,
      "hasList": false,
      "student_name": "程小广"
    }, {
      "student_id": 5297,
      "hasList": false,
      "student_name": "楚中天"
    }],
    "id": 2,
    "region": "C"
  }, 
  {
    "brands": [{
      "student_id": 4850,
      "hasList": false,
      "student_name": "典韦"
    }],
    "id": 3,
    "region": "D"
  }, 
  {
    "brands": [{
      "student_id": 4843,
      "hasList": true,
      "student_name": "高斯"
    }],
    "id": 4,
    "region": "G"
  }, 
  {
    "brands": [{
      "student_id": 4824,
      "hasList": false,
      "student_name": "贺锦文"
    }],
    "id": 5,
    "region": "H"
  }, 
  {
    "brands": [{
      "student_id": 4822,
      "hasList": false,
      "student_name": "江天天"
    }],
    "id": 6,
    "region": "J"
  }, 
  {
    "brands": [{
      "student_id": 4826,
      "hasList": true,
      "student_name": "雷青旖"
    }, {
      "student_id": 4835,
      "hasList": true,
      "student_name": "李小冉"
    }, {
      "student_id": 4846,
      "hasList": true,
      "student_name": "林蛋"
    }, {
      "student_id": 4833,
      "hasList": true,
      "student_name": "刘青山"
    }, {
      "student_id": 4832,
      "hasList": false,
      "student_name": "刘鑫"
    }],
    "id": 7,
    "region": "L"
  }, {
    "brands": [{
      "student_id": 4849,
      "hasList": true,
      "student_name": "马克"
    }, {
      "student_id": 4828,
      "hasList": false,
      "student_name": "马云"
    }],
    "id": 8,
    "region": "M"
  }, {
    "brands": [{
      "student_id": 4890,
      "hasList": true,
      "student_name": "年思"
    }, {
      "student_id": 4848,
      "hasList": true,
      "student_name": "牛顿"
    }],
    "id": 9,
    "region": "N"
  }, {
    "brands": [{
      "student_id": 4823,
      "hasList": true,
      "student_name": "冉芸芸"
    }],
    "id": 10,
    "region": "R"
  }, {
    "brands": [{
      "student_id": 4838,
      "hasList": true,
      "student_name": "王川"
    }, {
      "student_id": 4831,
      "hasList": true,
      "student_name": "王晶"
    }, {
      "student_id": 4829,
      "hasList": true,
      "student_name": "王思聪"
    }, {
      "student_id": 4841,
      "hasList": true,
      "student_name": "王章"
    }, {
      "student_id": 4851,
      "hasList": false,
      "student_name": "魏洋"
    }],
    "id": 11,
    "region": "W"
  }, {
    "brands": [{
      "student_id": 4836,
      "hasList": false,
      "student_name": "肖玉"
    }],
    "id": 12,
    "region": "X"
  }, {
    "brands": [{
      "student_id": 4820,
      "hasList": true,
      "student_name": "叶建生"
    }, {
      "student_id": 4825,
      "hasList": true,
      "student_name": "于丹"
    }],
    "id": 13,
    "region": "Y"
  }, {
    "brands": [{
      "student_id": 4847,
      "hasList": true,
      "student_name": "张川"
    }, {
      "student_id": 4816,
      "hasList": true,
      "student_name": "张慧"
    }, {
      "student_id": 4837,
      "hasList": true,
      "student_name": "张文宾"
    }, {
      "student_id": 4844,
      "hasList": true,
      "student_name": "张小艾"
    }, {
      "student_id": 4845,
      "hasList": true,
      "student_name": "张小培"
    }, {
      "student_id": 4873,
      "hasList": false,
      "student_name": "周小渡"
    }, {
      "student_id": 4818,
      "hasList": false,
      "student_name": "周炎"
    }, {
      "student_id": 4817,
      "hasList": false,
      "student_name": "朱润林"
    }, {
      "student_id": 4819,
      "hasList": false,
      "student_name": "朱杉"
    }],
    "id": 14,
    "region": "Z"
  }]
}
let allHeight = [],
  scroolHeight = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportList: [],

    isActive: null,
    fixedTitle: '',
    toView: 'inToView0',
    isClick: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData();
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

  getPageData() {
    const reportList = resdata.data;
    this.setData({
      reportList,
      isActive: reportList[0].id,
      fixedTitle: reportList[0].region
    })
    this.initBrands();
  },

  initBrands() {
    const _this = this;
    const reportList = _this.data.reportList;
    var number = 0;
    for (let i = 0; i < reportList.length; i++) {
      wx.createSelectorQuery().select('#inToView' + reportList[i].id).boundingClientRect(function (rect) {
        number = rect.height + number;
        var newArry = [{
          'height': number,
          'key': rect.dataset.id,
          "name": reportList[i].region
        }]
        allHeight = allHeight.concat(newArry);
      }).exec();
    };
  },

  //点击右侧字母导航定位触发
  scrollToViewFn: function (e) {
    var _this = this;
    var _id = e.target.dataset.id;
    const reportList = _this.data.reportList;
    for (var i = 0; i < reportList.length; ++i) {
      if (reportList[i].id === _id) {
        _this.setData({
          isActive: _id,
          isClick: true,
          toView: 'inToView' + _id
        }, () => {
          setTimeout(() => {
            _this.setData({
              isClick: false
            });
          }, 500)
        })
        break
      }
    }
  },

  onPageScroll: function (e) {
    if (this.data.isClick) return;
    var _this = this;
    scroolHeight = e.detail.scrollTop;
    for (let i in allHeight) {
      if (scroolHeight < allHeight[i].height) {
        _this.setData({
          isActive: allHeight[i].key,
          fixedTitle: allHeight[i].name
        });
        return false;
      }
    }
  },

  //点击学生查看 错题集
  showReport(e) {
    let haslist = e.currentTarget.dataset.list;
    if(!list){
      wx.showToast({
        title: '该生还没有错题集哦！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/wrongTopic/previewPDF/previewPDF'
    })
  },

  /**
   * 
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