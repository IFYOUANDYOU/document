#### 书

《你不知道的js》

《高性能JavaScript》

#### 函数

高内聚、低耦合

耦合：重复、具有相同功能的代码；

```js
//函数声明
function functionTest(){}
document.write(functionTest) //function functionTest(){}
//函数表达式
var funName = function test(){}  //funName.name = test  命名函数表达式
var funName = function (){}  //funName.name = funName   匿名函数表达式
console.log(funName)  //test 无用的；  打印函数体
```

```js
function sum(){
    let results = 0;
    for(let i = 0; i < arguments.length; i++){
        results += arguments[i];
    }
    return results;
}
```

形参和实参不是同一个，但是属于隐射关系，一个发生变化，对应的也会变化；

实参列表，初始化是多少就是多少；

```js
function sum(a,b){
    //sum(1,2)
    b = 4; //对应arguments[1] 也会变成4
    arguments[0] = 3; //对应a也会变成3
    //sum(1)
    b = 2; //对应arguments[1]为 undefined
}
```

```js
function scream(animal){
    switch(animal){
        case "dog":
            return "dog";
            break;
            //...
    }
}
    
//反转字符
function reverse(){
    let num = window.prompt("input");
    let str = "";
    for(let i = num.length - 1; i >= 0; i --){
        str += transfer(num[i]);
    }
    return str;
}
function transfer(target){
    switch(target){
        case "1":
            return "壹";
        case "2":
            return "贰";
            //...
    }
}
function mul(num){
    if(num == 1 || num == 0){
        return num;
    }else{
        return num * arguments.caller(num - 1);
    }
}
function fb(num){
    if(num == 1 || num == 2){
        return 1;
    }else{
        return arguments.caller(num - 1) + arguments.caller(num - 2);
    }
}
```

```js
function (){
    let str = "";
    
}
```

#### 预编译

函数声明整体提升；

变量声明提升；

1、imply global 暗示全局变量：即任何变量，如果未经声明就赋值，此变量为全局对象所有；

2、一切声明的全局变量，全是window的属性；

###### 预编译的过程

预编译发生在函数执行前一刻

1、创建AO对象（Activetion Object , 即执行期上下文）；

2、找形参和变量声明，将变量和形参名作为AO属性名，值为undefined；

3、将实参值和形参统一；

4、在函数体里面找函数声明，值赋予函数体；

注意：在全局里面，生成一个GO对象（Global Object）

```js
function test(a){
    console.log(a)  //function a(){}
    var a = 123;
    console.log(a)  //123
    function a(){}
    console.log(a)  //123
    var b = function(){}
    console.log(b)  //function b(){}
    function d(){}
    //程序执行由右向左，给f赋值为111，然后将f的值赋给e
    var e = f = 111; //f由于没有声明，是全局的变量；
}
test(1);
```

#### 闭包

```js
function test(){
    var arr = [];
    for(var i = 0;i < 10;i++){
        arr[i] = function(){
            console.log(i)
        }
    }
    return arr;
}
```

![1574674162879](C:\Users\EDZ\AppData\Roaming\Typora\typora-user-images\1574674162879.png)

#### 作用域

###### 执行期上下文

**执行期上下文**：函数执行时，会创建一个称为执行期上下文的内部对象；

一个执行期上下文定义了一个函数执行时的环境，函数每次执行时对应的执行上下文都是独一无二的，所以多次调用一个函数会导致创建多个执行上下文，当函数执行完毕，所产生的执行上下文被销毁；

**查找变量**：从作用域链的顶端依次向下查找；

###### [[scope]] 作用域

每个JavaScript函数都是一个对象，对象中有些属性可以访问，有些不能；这些不可访问属性仅供JavaScript引擎存取，[[scope]]就是其中一个；

**[[scope]]**：指我们所说的作用域，其中存储了运行期上下文的集合；

###### 作用域链

**作用域链**：[[scope]]中所存储的执行期上下文对象的集合，这个集合呈链式链接，把这种 链式链接叫做作用域链；

函数产生作用域，作用域属于函数；

```js
function a(){
    function b(){
        var bb = 234;
        aa = 555;
        console.log(aa)  //555
    }
    var aa = 123;
    b();
    console.log(aa)  //555
}
var g = 456;
a();
```

| ![1574214489704](C:\Users\EDZ\AppData\Roaming\Typora\typora-user-images\1574214489704.png) | ![1574214327039](C:\Users\EDZ\AppData\Roaming\Typora\typora-user-images\1574214327039.png) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![1574214611039](C:\Users\EDZ\AppData\Roaming\Typora\typora-user-images\1574214611039.png) | ![1574214729367](C:\Users\EDZ\AppData\Roaming\Typora\typora-user-images\1574214729367.png) |

问题：

​	b函数被创建时包含a的AO，与a函数的AO是一个引用；

​	函数执行完成之后销毁执行期上下文；

```js
function a(){
    function b(){
        function c(){
            
        }
        c();
    }
    b();
}
a();
```

| ![1574215626754](C:\Users\EDZ\AppData\Roaming\Typora\typora-user-images\1574215626754.png) |
| ------------------------------------------------------------ |
| 总结：里面所有aAO  都是一个，b同理                           |

#### 闭包

闭包作用：

​	实现公有变量；

​	可以做缓存（存储结构）；

```js
function test(){
    var num = 100;
    function a(){
        num ++;
        console.log(num)
    }
    function b(){
        num --;
        console.log(num)
    }
    return [a,b];
}
var myArr = test();
myArr[0](); //执行a函数   返回101
myArr[1](); //执行b函数   返回100
```

​	可以实现封装、属性私有化；

​	模块化开发，防止污染全局变量；

```js
function a(){
    function b(){
        var bbb = 123;
        console.log(aaa);
    }
    var aaa = 234;
    return b;
}
var ggg = 345;
var demo = a();
demo();
```

| ![1574216351788](C:\Users\EDZ\AppData\Roaming\Typora\typora-user-images\1574216351788.png) |      |
| ------------------------------------------------------------ | ---- |
|                                                              |      |

#### 立即执行函数

```js
//针对初始化功能的函数
(function(){
    var a = 123;
    var b = 234;
    console.log(a + b);
}())

//立即执行函数方式
(function(){}())   //w3c推荐使用第一种
(function(){})()

//只有表达式才能被执行符号执行
var test = function(){
    console.log("只有表达式才能被执行符号执行");
}()
//能被执行符号执行的表达式   函数名称会被自动忽略
+ function test(){
    console.log("test没有任何意义，不能调用  test is not defined")
}()
(function test(){})   //test is not defined
```



#### 原型

原型是function对象的一个属性，定义了构造函数制造出的对象的公共祖先；

通过该构造函数产生的对象，可以继承该原型的属性和方法；

原型也是对象；

利用原型特点和概念，可以提取共有属性；

对象如何查看原型  ====>  隐式属性 ——proto——;

对象如何查看对象的构造函数   ====>    constructor ;

绝大多数对象的最终都会继承自Object.prototype；  

Object.create(原型)；   //创建对象

#### this指向

函数预编译过程this ====>  window

全局作用域里this  ====>  window

-------------------------------------------------------------------------

call/apply 可以改变函数运行时this的指向；

​	call（this指向，参数1，参数2，。。。）

​	apply（this指向，[参数1，参数2，。。])

obj.fun();    func里面的this指向obj;   //谁调用函数，里面的this指向谁；

arguments.callee    指向函数的引用；

fun.caller    fun被调用的环境；   //ES5严格模式报错

###### 数组深克隆

```js
//深克隆
function deepClone(origin,target){
    //遍历对象 for(let prop in obj){}
    //判断是不是原始值  typeof() object 
    //判断是数组还是对象  instanceof toString constructor
    //建立相应的数组或对象
    let target = target || {},toStr = Object.prototype.toString;
    let arrStr = "[object Array]";
    for(let prop in origin){
        if(origin.hasOwnProperty(prop)){
            if(origin[prop] !== "null" && typeof(origin[prop]) == "object"){
                target[prop] = toStr.call(origin[prop]) == arrStr ? [] : {};
                arguments.callee(origin[prop], target[prop]);
                //deepClone(origin[prop], target[prop]);
            }else{
                target[prop] = origin[prop];
            }
        }
    }
}
```

#### 数组

改变原数组

push pop shift unshift sort reverse

splice

###### 重写数组方法

```js
Array.prototype.push = function(){  //从后面增加数组
    for(let i in arguments){
        this[this.length] = arguments[i];
    }
    return this.length;
}
```

```js
Array,prototype.pop = function(){  //删除数组最后一位
    let removeItem = this[this.length - 1];
    this.length = this.length - 1;
    return removeItem;
}
```

```js
Array,prototype.unShift  = function(){  //从前面增加数组
    //let newStr = arguments.join(",");
    //let oldStr = this.join(",");
    //let _str = newStr + "," + oldStr;
    //return _str.split(",").length;
    for(let i in arguments){
        let len = this.length;
        for(let j = 0;j < this.length;j++){
            this[len] = this[len - 1];
            len --;
        }
        this[0] = arguments[j];
    }
    return this.length;
}
```

```js
Array,prototype.shift  = function(){  //从前面删除数组
    let first = this[0];
    for(let i = 0; i < this.length;i++){
        this[i] = this[i + 1];
    }
    this.length --;
    return first;
}
```

```js
Array.prototype.reverse = function(){
    
}
```

```js
//sort
arr,sort(function(num1,num2){
    return num1 - num2;  //升序
    return num2 - num1; //降序
})
//给一个有序的数组，乱序
arr.sort(function(){
    return Math.random() - 0.5;
})
```

不改变原数组

concat join split toString slice

#### 类数组

属性必须为索引，必须有length属性，最好加上push方法

```js
let obj = {
    0: "a",
    1: "b",
    3: "c",
    length: 3,
    push: Array.prototype.push
}
```

```js
//数组去重
Array.prototype.unique = function(){
    let temp = {},newArr = [],len = this.length;
    for(let i = 0; i < len; i++){
        if(!temp[this[i]]){
            temp[this[i]] = "111";
            newArr.push(this[i]);
        }
    }
    return newArr;
}
```

```js
//封装typeof
function getType(target){
    let tp = typeof(target);
    let templates = {
        "[object Arrar]": "array",
        "[object Object]": "object",
        "[object Number]": "number - object",
        "[object Boolean]": "boolean - object",
        "[object String]": "string - object"
    }
    if(target === null){
        return "null";
    }else if(tp == "object"){
        let propType = Object.prototype.toString.call(target);
        return templates[propType];
    }else{
        return tp;
    }
}                       
```

```js
//字符串中第一个只出现一次的字符
function getOneTimeCode(str){
    let target = [];
    for(let i = 0; i < str.length; i++){
        let code = str[i];
        if(!target[code]){
            target.push(code);
        }
    }
    return target[0];
}
```

#### try......catch

```js
//在try里面代码发生错误，不会执行错误后的try里面的代码
try{
    console.log("a");
    console.log(b);
    console.log("c");
}catch(e){}
console.log("e");
//没有发生错误，try里面执行完毕之后继续执行后面的代码
//catch负责在try出现错误时，捕获错误信息（name,message），程序不会发送错误信息
```

| 错误名             | 错误信息                 |
| ------------------ | ------------------------ |
| EvalError          | eval()的使用与定义不一致 |
| RangeError         | 数值越界                 |
| **ReferenceError** | 非法或不能识别的引用数值 |
| **SyntaxError**    | 发生语法解析错误         |
| TypeError          | 操作数类型错误           |
| URLError           | URL处理函数使用不当      |

ReferenceError： 没有定义就使用；

#### ES5

##### “use strict”;  严格模式

不能使用with、arguments.callee、func.caller；

变量赋值前必须声明；

局部this必须被赋值；预编译this不再指向window；

拒绝重复属性和参数；

#### DOM

document object model  ----  DOM

定义了表示和修改文档所需的方法；

DOM对象即为宿主对象，由浏览器厂商定义，来操作html和xml功能的一类对象的集合；

DOM是对HTML以及XML的标准编程接口；

```js
let ul = document.getElementsByTagName("ul")[0];
ul.onmouseover = function(e){
    let event = e || window.event;
    let target = event.target || event.srcElement;
    target.stylet.backgroundColor = "rgb(0,255,"+target.getAttribute('img-data')+")";
    target.setAttribute("img-data",parseInt(target.getAttribute("img-data")) + 6);
}
```

###### 查找元素节点

```js
document   //代表整个文档；
.getElementById()  //元素id在IE8以下的浏览器，不区分大小写，而且也返回匹配name属性的元素(返回name名相同的div)；
.getElementsByTagName()   //标签名
.getElementsByName()  //注意：只有部分标签name可生效（表单，表单元素，img，iframe）
.getElementsByClassName()   //类名，IE8及以下不支持
.querySelector()   //css选择器，IE7及以下不支持
.querySelectorAll()   //css选择器，IE7及以下不支持
```

###### 遍历节点树

```js
parentNode  //父节点(最顶端的parentNode为#document)
childNodes  //子节点们
firstChild   //第一个子节点
lastChild   //最后一个子节点
nextSibling   //后一个兄弟节点
previousSibling   //前一个兄弟节点
```

###### 基于元素节点树的遍历

```js
parentElement  //返回当前元素的父元素节点（IE不兼容）
children   //只返回当前元素的子节点
node.childElementCount  //=== node.children.length   当前元素节点的子几点数
firstElementChild  //返回第一个元素节点（IE不兼容）
lastElementChild   //返回最后一个元素节点（IE不兼容）
nextElementSibling/previousElementSibling   //返回后一个/前一个兄弟元素节点（IE不兼容）
```

```js
function returnElementChild(node){
    let temp = {
        length: 0,
        push: Array.prototype.push,
        aplice: Array.prototype.splice
    },
    child = node.childNodes,
    len = child.length;
    for(let i = 0;i<len;i++){
        if(child[i].nodeType === 1){
            temp.push(child[i]);
        }
    }
}
```



###### 节点的属性

```js
nodeName   //元素标签名
nodeValue   //text节点或comment节点(注释节点)的文本内容，可读写
nodeType  //几点类型，只读
attributes  //节点的属性集合

Node.hasChildNodes();   //是否有子节点  返回true/false
```



```js
getElementById   //定义在Document.prototype上
getElementsByName  //定义在HTMLDocument.prototype上
getElementsByTagName  //定义在Document.prototype和Element.prototype上
HTMLDocument.prototype  //定义了一些常用属性，body、head分别指代HTML文档中的body、head标签
Document.prototype //定义了documentElement属性，指代文档的根元素，在HTML文档中，总是指代html元素
getElementByClassName、querySelector、querySelectorAll在Document.prototype、Element.prototype类中均有定义
```

```js
//返回元素的第n层祖先元素节点
function returnParent(elem,n){
    //let elem = document.getElementsByTagName("p")[0];
    while(elem && n){
        elem = elem.parentElement;
        n--;
    }
    return elem;
}
```

```js
//封装自己的获取子元素节点的方法
Element.prototype.getChildren = function(){
    let child = this.childNodes,
        len = child.length,
        arr = [];
    for(let i = 0;i<len;i++){
        if(child[i].nodeType == 1){
            arr.push(child[i]);
        }
    }
    return arr;
}
```

```js
//封装函数，返回元素的第n个兄弟元素节点，n为正，返回后面，否则前面，为0返回自己
function getSiblings(elem,n){
    while(elem && n){
        if(n > 0){
            if(elem.nextElementSibling){
                elem = elem.nextElementSibling;
            }else{
                for(elem = elem.nextSibling;elem&&elem.nodeType != 1;elem = elem.nextSibling);
            }
            n--;
        }else{
            if(elem.previousElementSibling){
                elem = elem.previousElementSibling;
            }else{
                for(elem = elem.previousibling;elem&&elem.nodeType != 1;elem = elem.previousibling);
            }
            n++;
        }
    }
    return elem;
}
```

```js
//DOM增
document.createElement();  //元素节点
document.createTextNode();  //文本节点
document.createComment();   //注释节点
document.craeteDocumentFragment();  //
```

```js
//插入
parentNode.appendChild();
parentNode.insertBefore(target,child);//insert target before child

//封装函数insertAfter（）
Element.prototype.insertAfter = function(target,child){
    //是否有兄弟元素，有插入兄弟元素前面，没有appendChild父级元素
    let nextNode = child.nextElementSibiling;
    if(nextNode == null){
        this.appendChild(target);
    }else{
        this.insertBefore(target,nextNode);
    }
}
```

```js
//删除
parent.removeChild();
child.remove();
```

```js
//替换
parentNode.replaceChild(target,origin);  //target替换origin
```

###### DOM基本操作

```js
//节点属性
innerHTML
innerText  // (火狐不兼容)
textContent  //老版本IE不好使
//节点方法
e.setAttribute();
e.getAttribute();
```

#### Date对象

纪元时间：1970年1月1日

```js
let date = new Date();
date.getTime()   //当前时间到纪元时间的毫秒数
```

#### JavaScript定时器

```js
setInterval();   //定时执行
setTimeout();
clearInterval();  //延迟执行
clearTimeout();
```

定时器是全局对象window的方法，内部函数this指向window；

```js
let minutes = 0,seconds = 0;
let timer = setInterval(function(){
    seconds ++;
    if(seconds == 59){
        seconds = 0;
        minutes ++;
    }
    if(minutes == 3){
        clearInterval(timer);
    }
},1000)
```

#### 窗口属性

###### 查看滚动条的滚动距离

```js
//IE8及以下不兼容
window.pageXOffset / pageYOffset 
//兼容性比较混乱，用时取两个值相加，因为不可能存在两个同时有值；
document.body / documentElement.scrollLeft / scrollTop
//封装兼容性方法，求滚动轮滚动距离
function getScrollOffset(){
    if(window.pageXOffset){
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        }
    }else{
        return {
            x: document.body.scrollLeft + document.documentElement.scrollLeft,
            y: document.body.scrollTop + document.documentElement.scrollTop,
        }
    }
}
```

###### 视口尺寸

```js
window.innerWidth / innerHeight  //IE8及以下不兼容
document.documentElement.clientWidth / clientHeight  //标准模式下，任意浏览器都兼容
document.body.clientWidth / clientHeight  //适用于怪异模式下的浏览器
//封装方法，返回浏览器视口尺寸getViewportOffset
function getViewportOffset(){
    //获取模式: document.compatMode
    if(window.innerWidth){
        return {
            w: window.innerWidth,
            h: window.innerHeight
        }
    }else{
        if(document.compatMode == "CSS1Compat"){
           //标准模式；    BackCompat  怪异模式，向后兼容
            return {
                w: document.documentElement.clientWidth,
                h: document.documentElement.clientHeight
            }
        }else{
            return {
                w: document.body.clientWidth,
                h: document.body.clientHeight
            }
        }
    }
}
```

###### 元素的几何尺寸

```js
domEle.getBoundingClientRect();
//兼容性好，返回一个对象，left和top代表元素左上角X和Y坐标，right和bottom代表右下角X和Y坐标；
//height和width老版本IE不支持
//返回结果不是实时的
```

###### 元素尺寸、位置

```js
//查看元素视觉尺寸
dom.offsetWidth  /   dom.offsetHeight
//查看元素位置   对于无定位父级，返回相对文档坐标；有定位的父级，返回相对于最近的有定位的父级的坐标
dom.offsetLeft  /   dom.offsetTop
//相对于最近的有定位的父级，无返回body    body.offsetParent返回null
dom.offsetParent

//元素相对于文档的坐标getElementPosition
function getElementPosition(element){
    let tops = 0,lefts = 0;
    for(element = element.offsetParent;element&&element.offsetParent;element = element.offsetParent){
        tops += element.offsetTop;
        lefts += element.offsetLeft;
    }
    return tops,lefts;
}
```

###### 滚动条操作

```js
//window上有三个方法
scroll(); scrollTo();  scrollBy();
//功能类似，将x、y坐标传入，实现让滚动条滚动到当前位置
//scrollBy会在之前的数据基础上累加
//利用scrollBy实现快速阅读的功能
```

