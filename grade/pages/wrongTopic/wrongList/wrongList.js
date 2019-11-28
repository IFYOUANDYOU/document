// pages/wrongTopic/answerList.js
import {
  studentMisTakeInfo,
  questionInfo
} from '../../../lib/api';
import Util from '../../../lib/util';

let allHeight = [],
  scroolHeight = 0;

const resdata = {
  "code": "10000",
  "msg": "OK",
  "data": {
    "school": "重庆市巴蜀中学",
    "grade": "七年级",
    "subject": "数学",
    "studentName": "周星星",
    "testTime": "第五次测试",
    "unit": "第三单元周测",
    "examName": "重庆市巴蜀中学七年级第五次测试 数学 第三单元周测",
    "summary": {
      "lostPoints": 8,
      "errors": 8,
      "points": 10
    },
    "errQuestions": [
      {
        stuPic: null,
        otherQuestions:
          "10594613,10955958,6849279,6673810,7752830,5387350,10036053,6996546,10041654,7249547",
        examName: "三年级数学期末测试卷1",
        subjectId: 2,
        score: 3,
        answer: "A",
        knowledgePointName: ["有理数的混合运算"],
        width: 2474,
        questionNum: "一、3",
        id: 14,
        answerPic: null,
        questionPic:
          "https://wechat-test2.oss-cn-shenzhen.aliyuncs.com/4415/back/paper/13812/pages/0001_8229104760.jpg?x-oss-process=image/crop,x_0,y_762,h_85,w_2474",
        questionType: "科目类型",
        questionList: [
          {
            area: "安徽省",
            Similarity: 0,
            answer2: "【答案】<p>（1）-200；（2）63</p><p></p>",
            parse:
              '<p></p><p>试题分析：按照先乘方，再乘除，最后算加减，右括号的先算括号里面的，顺序进行即可。</p><p>试题解析：（1）<img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.001.png" width="135" height="41" ></p><p><img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.002.png" width="110" height="19" >  </p><p><img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.003.png" width="87" height="19" >   </p><p><img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.004.png" width="51" height="19" > </p><p>（2）<img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.005.png" width="279" height="39" ></p><p><img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.006.png" width="196" height="23" > </p><p><img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.007.png" width="136" height="23" > </p><p><img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.008.png" width="81" height="19" > </p><p><img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.009.png" width="34" height="19" ></p><p>考点：有理数的混合运算</p><p> </p>',
            title:
              '<p>计算：（每题6分，共12分）</p><p>（1）<img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_ST/SYS201506130618203529286064_ST.001.png" width="135" height="41" >；（2）<img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_ST/SYS201506130618203529286064_ST.002.png" width="279" height="39" ></p><p> </p>',
            option_d: "",
            option_e: "",
            option_b: "",
            option_c: "",
            qtpye: "计算题",
            id: 5387350,
            option_a: "",
            knowledges: "有理数加减乘除及乘方混合运算"
          },
          {
            area: "云南省",
            Similarity: 0,
            answer2:
              '【答案】<p>（1）2xy－2      （2）4xy+10<img src="/upimg/czsx/STSource/2015040806091060253955/SYS201504080609174466434755_DA/SYS201504080609174466434755_DA.001.png" width="20" height="24" ></p><p></p>',
            parse:
              '<p></p><p>试题分析：（1）首先根据单项式的乘法公式将中括号去掉，然后再利用除法进行计算；（2）根据完全平方公式和平方差公式进行展开，然后再进行合并同类项.</p><p>试题解析：（1）原式=<img src="/upimg/czsx/STSource/2015040806091060253955/SYS201504080609174466434755_DA/SYS201504080609174466434755_DA.002.png" width="201" height="24" >=<img src="/upimg/czsx/STSource/2015040806091060253955/SYS201504080609174466434755_DA/SYS201504080609174466434755_DA.003.png" width="139" height="24" >=2xy－2</p><p>（2）原式=<img src="/upimg/czsx/STSource/2015040806091060253955/SYS201504080609174466434755_DA/SYS201504080609174466434755_DA.004.png" width="191" height="24" >=4xy+10<img src="/upimg/czsx/STSource/2015040806091060253955/SYS201504080609174466434755_DA/SYS201504080609174466434755_DA.001.png" width="20" height="24" >.</p><p>考点：多项式的除法计算、完全平方公式和平方差公式.</p><p> </p>',
            title:
              '<p>计算.（每题4分，共8分）</p><p>（1）<img src="/upimg/czsx/STSource/2015040806091060253955/SYS201504080609174466434755_ST/SYS201504080609174466434755_ST.001.png" width="215" height="31" ></p><p>（2）<img src="/upimg/czsx/STSource/2015040806091060253955/SYS201504080609174466434755_ST/SYS201504080609174466434755_ST.002.png" width="173" height="26" ></p><p> </p>',
            option_d: "",
            option_e: "",
            option_b: "",
            option_c: "",
            qtpye: "计算题",
            id: 6673810,
            option_a: "",
            knowledges: "整式"
          },
          {
            area: "江苏省",
            Similarity: 0,
            answer2:
              '【答案】<p>（1）2；（2）<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.001.png" width="31" height="23" ></p><p></p>',
            parse:
              '<p></p><p>试题分析：（1）先将三个式子分别化简，然后按照加减法法则计算即可；（2）先将三个式子分别化简，然后按照加减法法则计算即可.</p><p>试题解析：（1）<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.002.png" width="33" height="24" >－（<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.003.png" width="16" height="41" >）－2＋（<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.004.png" width="24" height="24" >－1）0</p><p>=5—4+1（每算对一个得1分）</p><p>=2</p><p>（2）<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.005.png" width="33" height="24" > + <img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.006.png" width="52" height="29" > + <img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.007.png" width="56" height="32" ></p><p>= ﹣2+5+<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.008.png" width="31" height="23" >—33分（每算对一个得1分）</p><p>= <img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.001.png" width="31" height="23" ></p><p>考点：1.二次根式；2.三次根式；3.实数的乘方.</p><p> </p>',
            title:
              '<p>计算题．（每题4分，共8分）</p><p>（1）计算：<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_ST/SYS201504070601386364569031_ST.001.png" width="33" height="24" >－（<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_ST/SYS201504070601386364569031_ST.002.png" width="16" height="41" >）－2＋（<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_ST/SYS201504070601386364569031_ST.003.png" width="24" height="24" >－1）0；</p><p>（2）<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_ST/SYS201504070601386364569031_ST.004.png" width="33" height="24" > + <img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_ST/SYS201504070601386364569031_ST.005.png" width="52" height="29" > +<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_ST/SYS201504070601386364569031_ST.006.png" width="56" height="32" >.</p><p> </p>',
            option_d: "",
            option_e: "",
            option_b: "",
            option_c: "",
            qtpye: "计算题",
            id: 6849279,
            option_a: "",
            knowledges: "二次根式"
          }
        ],
        questionNumUN: 13568,
        height: 85,
        stuScore: 0,
        classAvg: 2.4
      },
      {
        stuPic: null,
        otherQuestions:
          "10594613,10955958,6849279,6673810,7752830,5387350,10036053,6996546,10041654,7249547",
        examName: "三年级数学期末测试卷1",
        subjectId: 2,
        score: 3,
        answer: "A",
        knowledgePointName: ["有理数的混合运算"],
        width: 2474,
        questionNum: "一、5",
        id: 12,
        answerPic: null,
        questionPic:
          "https://wechat-test2.oss-cn-shenzhen.aliyuncs.com/4415/back/paper/13812/pages/0001_8229104760.jpg?x-oss-process=image/crop,x_0,y_762,h_85,w_2474",
        questionType: "科目类型",
        questionList: [
          {
            area: "安徽省",
            Similarity: 0,
            answer2: "【答案】<p>（1）-200；（2）63</p><p></p>",
            parse:
              '<p></p><p>试题分析：按照先乘方，再乘除，最后算加减，右括号的先算括号里面的，顺序进行即可。</p><p>试题解析：（1）<img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.001.png" width="135" height="41" ></p><p><img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.002.png" width="110" height="19" >  </p><p><img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.003.png" width="87" height="19" >   </p><p><img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.004.png" width="51" height="19" > </p><p>（2）<img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.005.png" width="279" height="39" ></p><p><img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.006.png" width="196" height="23" > </p><p><img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.007.png" width="136" height="23" > </p><p><img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.008.png" width="81" height="19" > </p><p><img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_DA/SYS201506130618203529286064_DA.009.png" width="34" height="19" ></p><p>考点：有理数的混合运算</p><p> </p>',
            title:
              '<p>计算：（每题6分，共12分）</p><p>（1）<img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_ST/SYS201506130618203529286064_ST.001.png" width="135" height="41" >；（2）<img src="/upimg/czsx/STSource/2015061306180164903574/SYS201506130618203529286064_ST/SYS201506130618203529286064_ST.002.png" width="279" height="39" ></p><p> </p>',
            option_d: "",
            option_e: "",
            option_b: "",
            option_c: "",
            qtpye: "计算题",
            id: 5387350,
            option_a: "",
            knowledges: "有理数加减乘除及乘方混合运算"
          },
          {
            area: "云南省",
            Similarity: 0,
            answer2:
              '【答案】<p>（1）2xy－2      （2）4xy+10<img src="/upimg/czsx/STSource/2015040806091060253955/SYS201504080609174466434755_DA/SYS201504080609174466434755_DA.001.png" width="20" height="24" ></p><p></p>',
            parse:
              '<p></p><p>试题分析：（1）首先根据单项式的乘法公式将中括号去掉，然后再利用除法进行计算；（2）根据完全平方公式和平方差公式进行展开，然后再进行合并同类项.</p><p>试题解析：（1）原式=<img src="/upimg/czsx/STSource/2015040806091060253955/SYS201504080609174466434755_DA/SYS201504080609174466434755_DA.002.png" width="201" height="24" >=<img src="/upimg/czsx/STSource/2015040806091060253955/SYS201504080609174466434755_DA/SYS201504080609174466434755_DA.003.png" width="139" height="24" >=2xy－2</p><p>（2）原式=<img src="/upimg/czsx/STSource/2015040806091060253955/SYS201504080609174466434755_DA/SYS201504080609174466434755_DA.004.png" width="191" height="24" >=4xy+10<img src="/upimg/czsx/STSource/2015040806091060253955/SYS201504080609174466434755_DA/SYS201504080609174466434755_DA.001.png" width="20" height="24" >.</p><p>考点：多项式的除法计算、完全平方公式和平方差公式.</p><p> </p>',
            title:
              '<p>计算.（每题4分，共8分）</p><p>（1）<img src="/upimg/czsx/STSource/2015040806091060253955/SYS201504080609174466434755_ST/SYS201504080609174466434755_ST.001.png" width="215" height="31" ></p><p>（2）<img src="/upimg/czsx/STSource/2015040806091060253955/SYS201504080609174466434755_ST/SYS201504080609174466434755_ST.002.png" width="173" height="26" ></p><p> </p>',
            option_d: "",
            option_e: "",
            option_b: "",
            option_c: "",
            qtpye: "计算题",
            id: 6673810,
            option_a: "",
            knowledges: "整式"
          },
          {
            area: "江苏省",
            Similarity: 0,
            answer2:
              '【答案】<p>（1）2；（2）<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.001.png" width="31" height="23" ></p><p></p>',
            parse:
              '<p></p><p>试题分析：（1）先将三个式子分别化简，然后按照加减法法则计算即可；（2）先将三个式子分别化简，然后按照加减法法则计算即可.</p><p>试题解析：（1）<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.002.png" width="33" height="24" >－（<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.003.png" width="16" height="41" >）－2＋（<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.004.png" width="24" height="24" >－1）0</p><p>=5—4+1（每算对一个得1分）</p><p>=2</p><p>（2）<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.005.png" width="33" height="24" > + <img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.006.png" width="52" height="29" > + <img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.007.png" width="56" height="32" ></p><p>= ﹣2+5+<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.008.png" width="31" height="23" >—33分（每算对一个得1分）</p><p>= <img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_DA/SYS201504070601386364569031_DA.001.png" width="31" height="23" ></p><p>考点：1.二次根式；2.三次根式；3.实数的乘方.</p><p> </p>',
            title:
              '<p>计算题．（每题4分，共8分）</p><p>（1）计算：<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_ST/SYS201504070601386364569031_ST.001.png" width="33" height="24" >－（<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_ST/SYS201504070601386364569031_ST.002.png" width="16" height="41" >）－2＋（<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_ST/SYS201504070601386364569031_ST.003.png" width="24" height="24" >－1）0；</p><p>（2）<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_ST/SYS201504070601386364569031_ST.004.png" width="33" height="24" > + <img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_ST/SYS201504070601386364569031_ST.005.png" width="52" height="29" > +<img src="/upimg/czsx/STSource/2015040706013458947986/SYS201504070601386364569031_ST/SYS201504070601386364569031_ST.006.png" width="56" height="32" >.</p><p> </p>',
            option_d: "",
            option_e: "",
            option_b: "",
            option_c: "",
            qtpye: "计算题",
            id: 6849279,
            option_a: "",
            knowledges: "二次根式"
          }
        ],
        questionNumUN: 13568,
        height: 85,
        stuScore: 0,
        classAvg: 2.4
      }
    ],
    "loseKnowledgePoint": [
      {
        sumlosePoints: 10.0,
        knowledgePointName: "解一元二次方程——配方法",
        titleNumber: 2,
        rate: "0.2778",
        sumScore: 36.0,
        examId: 2,
        knowledgePointId: 20143,
        id: 7,
        subjectId: 2
      },
      {
        sumlosePoints: 10.0,
        knowledgePointName: "运用公式法",
        titleNumber: 2,
        rate: "0.2778",
        sumScore: 36.0,
        examId: 2,
        knowledgePointId: 20076,
        id: 8,
        subjectId: 2
      },
      {
        sumlosePoints: 20.0,
        knowledgePointName: "轴对称——最短路线问题",
        titleNumber: 3,
        rate: "0.1587",
        sumScore: 126.0,
        examId: 2,
        knowledgePointId: 20393,
        id: 10,
        subjectId: 2
      },
      {
        sumlosePoints: 20.0,
        knowledgePointName: "四边形综合题",
        titleNumber: 3,
        rate: "0.1587",
        sumScore: 126.0,
        examId: 2,
        knowledgePointId: 21101,
        id: 9,
        subjectId: 2
      },
      {
        sumlosePoints: 21.0,
        knowledgePointName: "有理数的混合运算",
        titleNumber: 20,
        rate: "0.0175",
        sumScore: 1200.0,
        examId: 2,
        knowledgePointId: 20021,
        id: 6,
        subjectId: 2
      }
    ]
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: '',
    scoreAvg: "",
    arr: [1, 2],
    showCon: false,
    studentId: 185,
    examId: 1343,
    studentName: '',
    examName: "",
    wrongList: [],
    loseKnowledgePoint: [],
    summary: {},
    structerArr: [],
    contentData: '',
  },
  getPaperInfo(data) {
    // if (!data) {
    //   return
    // }
    let scoreMark = {}, textMark = [], lineMark = [];
    let current;
    if (data) {
      var arrs = data.split('\t');
      for (let i in arrs) {
        var arr = arrs[i].split('$');
        if (arr[0] == "right" || arr[0] == "error") {//初始化打分
          if (arr[4]) {
            var score = arr[4] == 0 ? arr[4] : arr[4].split(' ')[1];
            current = Math.floor(score);
          }
          scoreMark = {
            type: arr[0],
            icon: arr[1],
            x: arr[2],
            y: arr[3],
            score: arr[4],
          }
        } else if (arr[0] == "line") {//初始化划线
          var lineObj = {};
          lineObj = {
            left: arr[1] * 1,
            top: arr[2] * 1,
            width: arr[3] * 1,
            deg: arr[4] * 1
          }
          lineMark.push(lineObj);
        } else if (arr[0] == "text") {//初始化文字备注
          var textObj = {};
          textObj = {
            x: arr[1] * 1,
            y: arr[2] * 1,
            value: arr[3] == 'NaN' ? '' : arr[3]
          }
          textMark.push(textObj);
        }
      }
    }
    console.log(scoreMark)
    console.log(textMark)
    console.log(lineMark)
    return {
      scoreMark: scoreMark,
      textMark: textMark,
      lineMark: lineMark
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (!options.info) {
      this.initPageData();
      return
    }
    let studentInfo = JSON.parse(options.info);
    this.setData({
      examId: options.examId,
      studentId: studentInfo.student_id || studentInfo.id
    }, () => {
      this.getAnswerList();
    })
  },
  //初始化页面数据
  initPageData(){
    let wrongList = resdata.data.errQuestions;
    wrongList.forEach(item => {
      item.toggle = false;
      if(item.questionList && item.questionList.length){
        item.questionList.forEach(q => {
          q.toggle = false;
        })
      }
    })
    this.setData({
      studentName: resdata.data.studentName,
      examName: resdata.data.examName,
      summary: resdata.data.summary,
      loseKnowledgePoint: resdata.data.loseKnowledgePoint,
      wrongList: wrongList,
      scoreAvg: 69
    })
    this.initCanvas(this.data.scoreAvg);
  },
  initCanvas(deg){
    var context = wx.createCanvasContext('scoreAvg');
    wx.createSelectorQuery().select('#rightCanvas').boundingClientRect(function (rect) {
      var num = (2 * Math.PI / 100 * deg) - 0.5 * Math.PI;
      var w = parseInt(rect.width / 2);
      var h = parseInt(rect.height / 2);
      let linewidth = Math.floor(rect.width * 0.138);
      console.log(rect, linewidth)
      const grd = context.createLinearGradient(0,w, h, 45);
      grd.addColorStop(0, '#3B96FF');
      grd.addColorStop(1, '#3B96FF');
      context.setLineWidth(linewidth);
      context.setLineCap("butt");
      context.arc(w, h, w - linewidth / 2, -0.5 * Math.PI, num);
      context.setStrokeStyle(grd);
      context.stroke();
      context.draw();
    }).exec();
  },
  previewTitle(ev) {
    let dataItem = ev.currentTarget.dataset.item,arr=[];
    dataItem.map(item=>{
      arr.push(item.url)
    })
    wx.previewImage({
      current: arr[0],
      urls: arr
    })
  },
  // 点击查看 题目详细情况
  showContent(el) {
    let questionId = el.currentTarget.dataset.info.id;
    let index = el.currentTarget.dataset.index;
    let toggle = el.currentTarget.dataset.toggle;
    let wrongList = this.data.wrongList;
    if(toggle){
      wrongList[index].toggle = !toggle;
    }else{
      wrongList.forEach((item,idx) => {
        item.toggle = index == idx;
      })  
    }
    this.setData({
      wrongList,
      toView: "inToView" + questionId
    })
    return false;
    questionInfo({
      questionId: questionId,
      studentId: this.data.studentId,
      examId: this.data.examId
    }).then(res => {
      // console.log(res);
      if (res.code == 10000) {
        this.listContent(res.data, index);
      }
    })
  },
  //点击查看相似题详情
  showSimilar(e){
    let index = e.currentTarget.dataset.index;
    let idx = e.currentTarget.dataset.idx;
    let toggle = e.currentTarget.dataset.toggle;
    let wrongList = this.data.wrongList;
    let questionList = wrongList[idx].questionList;
    if(toggle){
      console.log(toggle)
      questionList[index].toggle = !toggle;
    }else{
      questionList.forEach((item,idx) => {
        item.toggle = index == idx;
      })
    }
    console.log(questionList)
    this.setData({
      wrongList
    })
  },
  //滚动
  onPageScroll: function (e) {
    var _this = this;
    scroolHeight = e.detail.scrollTop;
    console.log(scroolHeight)
  },
  listContent(data, index) {  //对取到的题块详细内容做处理
    this.getPaperInfo(data.symbol_mark)
  // return

    data.marker = this.getPaperInfo(data.symbol_mark);

    data.answer2 = Util.renderLatex(data.answer2);
    data.avgScore = data.avgScore && data.avgScore.toFixed(2);
    data.title = Util.renderLatex(data.title);
    // console.log(data)
    data.question_pic = data.question_pic && JSON.parse(data.question_pic);
    data.answer_pic = data.answer_pic && JSON.parse(data.answer_pic);
    if (data.like && data.like.length > 0) {
      data.like.map(item => {
        // console.log(item.title)
        item.title = Util.renderLatex(item.title)
        item.answer2 = Util.renderLatex(item.answer2)
        item.parse = Util.renderLatex(item.parse)
        // WxParse.wxParse(`htmlDom`, 'html', item.title, this, 5);
        item.isShow = false;
        return item;
      });
    }

    this.data.structerArr[index].childData = data;
    this.setData({
      structerArr: this.data.structerArr
    })
    // console.log(this.data.structerArr)
  },
  showChild(el) {
    let item = el.currentTarget.dataset.info;
    let parentIndex = el.currentTarget.dataset.parent;
    let childIndex = el.currentTarget.dataset.child;
    // console.log(item);
    this.data.structerArr[parentIndex].childData.like[childIndex].isShow = !this.data.structerArr[parentIndex].childData.like[childIndex].isShow;
    // console.log(this.data.structerArr)
    this.setData({
      structerArr: this.data.structerArr
    })
  },
  getAnswerList() { //获取题块数据
    studentMisTakeInfo({
      studentId: this.data.studentId,
      examId: this.data.examId
    }).then(res => {
      if (res.code != 10000) {
        return
      }
      res.data.structer.map(item => {
        item.active = true;
        return item;
      })
      this.setData({
        showCon: true,
        contentData: res.data,
        studentName: res.data.student_name || '',
        examName: res.data.exam_name || '',
        structerArr: res.data.structer
      })

    })
  },
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: '023-63128778' // 仅为示例，并非真实的电话号码
    })
  },
  toContent(el) {
    let questionId = el.currentTarget.dataset.id;
    this.setData({
      toView: `toView_${questionId}`
    })
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