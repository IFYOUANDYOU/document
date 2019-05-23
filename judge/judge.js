Component({
  options:{
    styleIsolation: 'isolated'
  },
  data:{
    x:1,
    swiper:{},
  },
  properties:{
    // onCounterPlusOne: (data) => console.log(data),
    extra: {
      type:Object
    },
    paparStatus:{
      type:Boolean
    }
  },
  attached(){
    console.log(this.properties.extra)
    this.setData({
      swiper: this.properties.extra
    })
  },
  observers:{
    'properties.extra':function(val){
      console.log('监听',val)
    }
  },
  didUpdate(prevProps,prevData) {
    console.log('更新')
    // console.log(prevProps, this.props, prevData, this.data)
    console.log(this.props.extra)
    var new_swiper = this.props.extra;
    if(new_swiper.current > new_swiper.imgUrls.length-1){
      this.setData({
        no_paper:true
      })
    }
    this.setData({
      swiper:this.props.extra
    })
  },
  methods:{
    actions(e){
      console.log(e)
      var type = e.currentTarget.dataset.type;
      var swiper = this.properties.extra;
      var current = swiper.current;
      var answer=swiper.imgUrls[current];
      answer.makingTime = new Date();
      if(type==2){
        // 正确
        
        answer.score = swiper.allScore;
      }else if(type==1){
      //错误
        
        answer.score = 0;
      }
      // this.props.onCounterPlusOne(answer);
      // var aa = {dd:11}
      this.triggerEvent('onCounterPlusOne', answer)
    },
    endHandle(e){
      var type = e.currentTarget.dataset.type;
      if(type == 1){
        this.triggerEvent('backHandle', {type:1})
      }else if(type == 2){
        this.triggerEvent('backHandle', {type:2})
      }
    },
    enlargeHandle(){
      this.triggerEvent('enlarge', '1')
    }
  }
})