let timer = null;
Component({
  options: {
    styleIsolation: 'isolated'
  },
  data: {
    x: 1,
    swiper: {},
    current: 0,
    clicktime: 0,
  },
  properties: {
    // onCounterPlusOne: (data) => console.log(data),
    extra: {
      type: Object,
      observer: function(val){
        this.setData({
          swiper: val
        })
      }
    },
    paparStatus: {
      type: Boolean
    },
    answerStatus: {
      type: Boolean
    },
    backStatus: {
      type: Boolean
    }, 
    currentIndex: {
      type: Number,
      observer: function(val){
        this.setData({
          current: val
        })
      }
    },
    imgcomplete: {
      type: Boolean
    }
  },
  attached() {
    console.log(this.properties.extra)
    this.setData({
      swiper: this.properties.extra,
      currentIndex: this.properties.currentIndex,
    })
  },
  observers: {
    'properties.extra': function(val) {
      console.log('监听', val)
    }
  },
  didUpdate(prevProps, prevData) {
    console.log('更新')
    // console.log(prevProps, this.props, prevData, this.data)
    console.log(this.props.extra)
    var new_swiper = this.props.extra;
    if (new_swiper.current > new_swiper.imgUrls.length - 1) {
      this.setData({
        no_paper: true
      })
    }
    this.setData({
      swiper: this.props.extra
    })
  },
  methods: {
    actions(e) {
      var type = e.currentTarget.dataset.type;
      var swiper = this.data.swiper,score = 0;
      var clicktime = this.data.clicktime;
      var newtime = +new Date(),flag = true;
      if(clicktime != 0){
        if(newtime - clicktime < 800){
          flag = false;
        }else{
          timer = setTimeout(() => {
            flag = true;
            clearTimeout(timer);
          }, 2000);
        }
      }
      this.setData({
        clicktime: newtime
      })
      if(!flag){
        wx.showToast({
          title: "操作过于频繁",
          icon: "none"
        })
        return false;
      }
      if (type == 2) {
        // 正确
        score = swiper.allScore;
      } else if (type == 1) {
        //错误
        score = 0;
      }
      this.triggerEvent('onCounterPlusOne', score)
    },
    endHandle(e) {
      var type = e.currentTarget.dataset.type;
      if (type == 1) {
        this.triggerEvent('backHandle', {
          type: 1
        })
      } else if (type == 2) {
        this.triggerEvent('backHandle', {
          type: 2
        })
      }
    },
    enlargeHandle() {
      this.triggerEvent('enlarge', '1')
    }
  }
})