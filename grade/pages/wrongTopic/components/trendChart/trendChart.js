
//import F2 from '@antv/wx-f2'; // 注：也可以不引入， initChart 方法已经将 F2 传入，如果需要引入，注意需要安装 @antv/wx-f2 依赖
function numberToMoney(n) {
  return String(Math.floor(n * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
let chart,timer;
function initChart(canvas, width, height, F2) { // 使用 F2 绘制图表
  let data  = [];
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source(data);
  chart.line().position('time*rank').shape('smooth').color('#FFAA00');
  chart.point().position('time*rank').shape('smooth').style({
    stroke: '#fff',
    lineWidth: 1
  }).color('#FFAA00');
  chart.render();
  return chart;
}
const app = getApp();
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    content: {
      type: Object,
      // value: '',
      observer: function (newVal, oldVal) {
        // 属性值变化时执行
        let arr = [];
        console.log(newVal.all)
        newVal.all.map(item =>{
          arr.push({
            time: item.exam_name,
            rank: item.rank*-1
          })
        })
        this.setData({
          finalArr:arr
        })
        console.log(newVal)
        
      }
    },
    name: {
      type: String,
      // value: '',
      observer: function (newVal, oldVal) {
        // 属性值变化时执行
        // return
      }
    }
  },

  data: {
    finalArr:[],
    totleNum: 0,
    preStudentData: new Array(5),
    nextStudentData: new Array(5),
    opts: {
      onInit: initChart
    },
  },  
  detached() {
    console.log('销毁')
    if (chart) {
      timer && clearTimeout(timer);
      // chart.clear();
      chart.destroy()
    }
  },
  ready() {
    
    timer =setInterval(()=>{
      if (this.data.finalArr && chart){
        clearInterval(timer);
        let minValue = Math.abs(this.data.finalArr[0].rank), maxValue = Math.abs(this.data.finalArr[0].rank);
        this.data.finalArr.map(item=>{
          if(maxValue<Math.abs(item.rank)) {
            maxValue = Math.abs(item.rank)
          }
          if (minValue> Math.abs(item.rank)) {
            minValue = Math.abs(item.rank)
          }
        })
        let tickCount = maxValue - minValue + 1;
        chart.clear();
        chart.tooltip({
          showCrosshairs: true,
          background: {
            radius: 2,
            fill: '#FFAA00',
            padding: [6, 10]
          },
          crosshairsStyle: {
            stroke: '#FFAA00',
            lineWidth: 2
          },
          showItemMarker: false,
          titleStyle: {
            fontSize: 24,
            fill: '#fff',
            textAlign: 'start',
            textBaseline: 'top'
          },
          onShow: function onShow(ev) {
            var items = ev.items;

            items[0].name = null;
            items[0].value = '排名：' + Math.abs(items[0].value);
          }
        });
        chart.axis('rank', {
          label: function label(text) {
            var cfg = {};
            cfg.text = Math.abs(text);
            return cfg;
          }
        });
        
        chart.source(this.data.finalArr, {
          rank: {
            min: maxValue*-1,
            max: minValue*-1,
            tickCount: tickCount > 1 ? tickCount:0
          },
          time:{
            formatter: function formatter(val) {
              var strs = val.split(''); //字符串数组
              var str = ''
              for (var i = 0, s; s = strs[i++];) { //遍历字符串数组
                str += s;
                if (!(i % 6)) {
                  str += '\n'; //按需要求余
                }
              }
              return str
            }
          }
        });
        chart.line().position('time*rank').shape('smooth').color('#FFAA00');
        chart.point().position('time*rank').shape('smooth').style({
          stroke: '#fff',
          lineWidth: 1
        }).color('#FFAA00');
        chart.render();
      }
    },1000); 
  },
  methods: {
  }

});
