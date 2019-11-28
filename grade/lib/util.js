let util = {
  throttle: function (handler, wait) {
    var lastTime = 0;
    return function () {
      var nowTime = +new Date();
      if (nowTime - lastTime > wait) {
        handler.apply(this, arguments);
        lastTime = nowTime;
      }
    }
  },
  getDate() {
    let date = new Date();
    let mon = date.getMonth() + 1;
    if (mon <= 9) {
      mon = "0" + mon;
    }
    let day = date.getDate();
    if (day <= 9) {
      day = "0" + day;
    }
    return date.getFullYear() + "-" + mon + "-" + day;
  },
  rankText(num) {   //段位显示
    let text;
    console.log(num)
    if (num >= 0 && num < 0.1) {
      text = '玄铁';
    } else if (num >= 0.1 && num < 0.2) {
      text = '青铜';
    } else if (num >= 0.2 && num < 0.3) {
      text = '白银';
    } else if (num >= 0.3 && num < 0.4) {
      text = '黄金';
    } else if (num >= 0.4 && num < 0.5) {
      text = '铂金';
    } else if (num >= 0.5 && num < 0.6) {
      text = '钻石';
    } else if (num >= 0.6 && num < 0.7) {
      text = '星耀';
    } else if (num >= 0.7 && num < 0.8) {
      text = '月华';
    } else if (num >= 0.8 && num < 0.9) {
      text = '阳炎';
    } else if (num >= 0.9 && num < 1) {
      text = '达者';
    } else if (num == 1) {
      text = '王者';
    }
    return text;
    console.log(text)
    return text;
  },

  renderLatex(html) {
    if (!html || html.length == 0) return html;
    let patterns = [
      {
        pattern: /\s+src="\/?/g,
        replace: ' style="vertical-align:middle" src="https://teacher.yuangaofen.com/img/'
      },
      {
        pattern: /\s+src='\/?/g,
        replace: " style='vertical-align: middle' src='https://teacher.yuangaofen.com/img/"
      },
      {
        pattern: /url\('\/?/g,
        replace: ' url(\'https://teacher.yuangaofen.com/img/'
      },
      {
        pattern: /\\\((.+?)\\\)/g,
        replace: '<img src="https://teacher.yuangaofen.com/latex?$1" style="vertical-align:middle"/>'
      },
      {
        pattern: /<table .+?>/g,
        replace: '<table style="display:inline-block;vertical-align:middle;">'
      },
      {
        pattern: /<shapetype .+?>/g,
        replace: ''
      },
      {
        pattern: /<\/shapetype>/g,
        replace: ''
      }
    ];

    patterns.map(v => {
      html = html.replace(v.pattern, v.replace);
    });
    return html;
  }
}
export default util;