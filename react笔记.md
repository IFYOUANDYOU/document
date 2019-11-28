![img](file:///C:\Users\EDZ\AppData\Local\Temp\ksohtml14008\wps1.jpg)

library（库）：小而巧的是库，只提供特定的api；jQuery、Zepto

framework（框架）：大而全的是框架，提供了一整套的解决方案；

# Git  

参考手册 http://gitref.justjavac.com/

```js
git config --global user.name ""
git config --global user.email ""
git init
git add .
git commit -m ""
git remote add origin url
git push origin master
git checkout  -b dev
git push origin dev
git pull origin dev
git clone url 
git chekout -b dev origin/dev //克隆仓库后切换到dev分支
```

#### react和vue对比

1、组件化：vue通过.vue模板文件创建对应组件（template 结构、script 行为、style 样式）；react有组件化的概念，一切以js来表现，设计模式优秀；

2、开发团队：react是由Facebook前端开发团队创建，技术实力雄厚；vue是由雨溪；

3、社区：react诞生较早，文档、社区强大，踩坑少；vue最近几年才火，相对较弱；

4、reactNative无缝迁移到移动App开发；相对vue的weex相对不够完善；

#### react的核心概念

###### 虚拟DOM

用js对象模拟页面上的DOM及其嵌套，实现页面DOM元素的高效更新；

###### diff算法

**tree diff** 新旧DOM树逐层对比的过程，对比完毕，则所有需要更新的元素都能找到；

**component diff**  在进行tree diff时，每一层中组件级别的对比，叫做component diff；

​	对比前后，组件类型相同，则不需要更新；

​	不同则需要移除旧组件，创建新组件并追加到页面上；

**element diff**   进行组件对比时，组件相同进行元素级别的对比，即element diff；

![1574840736184](C:\Users\EDZ\AppData\Roaming\Typora\typora-user-images\1574840736184.png)

#### 创建基本的webpack项目

**注意：在webpack4.x中，默认打包入口路径是`src`目录下的`index.js`文件；**

1、运行`npm init -y` 快速初始化项目；  //会创建package.json文件

2、在项目根目录创建`src`源码和`dist`产品目录

3、在`src`目录下创建`index.html`

4、使用`npm`安装`webpack`,运行`npm i webpack webpack-cli -D`

5、根目录下创建`webpack.config.js`文件

```js
//向外配置一个打包的配置对象
//webpack是基于node构建的，所以支持所有node的API
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

//创建一个插件的实例对象
const htmlPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, "./src/index.html"),
    filename: "index.html"
})

module.exports = {
    mode: "production",  //4.x新增 development、production
    plugins: {
        htmlPlugin
    }
}
//export default 是es6的导出模块
```

6、在`src`目录下创建`index.js`文件，作为打包入口路径；

7、安装`webpack-dev-server`,运行`npm i webpack-dev-server  -D`;

​	webpack-dev-server打包后的`main.js`是托管到了内存中，在根目录下看不到；

```json
//package.json
{
    ...
    "scripts": {
        "test": "",
        "dev": "webpack-dev-server --open --port 3000 --progress --compress"  //compress压缩
        //--host 127.0.0.1
        //Firefox 。。。用什么浏览器打开
    }
}
```

8、安装`html-webpack-plugin`，运行`npm i html-webpack-plugin -D`,将HTML页面生成到内存中；

#### 项目中使用react

1、运行`npm i react react-dom -S`

​	react：用于创建组件和虚拟DOM，同时组件的生命周期都在这个包里；

​	react-dom：进行DOM操作的，主要应用场景`ReactDOM.render()`

2、在`index.html`页面重创建容器

```html
<!--react创建的虚拟DOM元素，会渲染到容器里-->
<div id="app"></div>
```

3、导入包

```js
import React from "react";
import ReactDOM from "react-dom";
```

4、`createElement`创建虚拟DOM元素

```js
//参数1 创建的元素类型，字符串，表示元素的名称
//参数2 是对象还是null，表示元素的属性
//参数3 子节点
//参数n 其他子节点
let h1Ele = React.createElement("h1", {
    "id": "myh1",
    "title": "this is my h1"
}, "这是创建的h1的文本节点");
let divEle = React.createElement("div",null,"这是创建的div的文本节点", h1Ele);
```

5、调用`render`函数将虚拟DOM渲染到容器里面

```js
//第二个参数接收一个DOM元素,作为容器
ReactDOM.render(divEle, document.getElementById("app"));
```

6、更改创建元素的方式 JSX

```jsx

```



###  使用create-react-app搭建项目**

```js
npm install create-react-app -g  
create-react-app react-demo
cd react-demo
npm start
```

### **打包发布**

```js
npm run build
npm install -g serve
serve bulid
```

### **创建应用根组件**

```jsx
import React,{ Component } from ‘react’;
export default class App Component{
render（）{
    return <div>创建应用根组件</div>;
    }
}
```

> 引用

### 入口

```jsx
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
//将APP组件标签渲染到index页面的id为root的div上
ReactDOM.render(<App />,document.getElementById("root"))
```

#### 基本目录结构

| api        | ajax相关   |
| ---------- | ---------- |
| assets     | 公用资源   |
| components | 非路由组件 |
| config     | 配置       |
| pages      | 路由组件   |
| utils      | 工具模块   |
| App.js     | 应用根组件 |
| index.js   | 入口js     |

### 路由钩子

##### 全局钩子

```js
router.beforeEach((to,from,next){})
router.afterEach((to,from){})
```

##### 单个路由钩子

```js
const router = new VueRouter({
	routes: [{
		path: "/index",
		component: Index,
		beforeEnter(to,from,next){},
		beforeLeave(to,from,next){}
	}]
})
```

##### 组件钩子

```js
export default{
    beforeRouteLeave(to,from,next){},
    beforeRouteEnter(to,from,next){},
    beforeRouteUpdate(to,from,next){}
}
```



## 代码分割

```js
//有状态组件：有状态、生命周期，通过this来接受状态和属性：this.state.x && this.props.x
export default class EditUser extends Component {
    render() {
        return (
            <div></div>
        )
    }
}
//无状态组件：不能有状态、生命周期，通过属性实现数据传递：props.x
export default function EditUser() {
    return (
        <div></div>
    )
}
```

### 通过动态 `import()` 语法

```js
import { add } from './math';
console.log(add(16, 26));
----------------------分割之前和之后的对比-------------------------
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

**注意：**动态 `import()` 语法目前只是一个 ECMAScript (JavaScript) 提案，而不是正式的语法标准；

### `React.lazy` 函数处理动态引入（的组件）

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
//import OtherComponent from './OtherComponent';使用之前
function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

`React.lazy` 接受一个函数，这个函数需要动态调用 `import()`；

必须返回一个 `Promise`，该 Promise 需要 resolve 一个 `defalut` export 的 React 组件；

`React.lazy` 目前只支持默认导出（default exports）；

#### 使用 `Suspense` 加载指示器为此组件做优雅降级

在 `MyComponent` 渲染完成后，包含 `OtherComponent` 的模块还没有被加载完成；

`fallback` 属性接受任何在组件加载过程中你想展示的 React 元素；

用一个 `Suspense` 组件包裹多个懒加载组件；

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

### 异常捕获边界Error boundaries

模块加载失败（如网络问题），会触发错误；

可以通过[异常捕获边界（Error boundaries）](https://react.docschina.org/docs/error-boundaries.html)技术来处理，以显示良好的用户体验并管理恢复事宜；

```js
import MyErrorBoundary from './MyErrorBoundary';
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));
const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

### 基于路由的代码分割

```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

## Context ：一种在组件树间进行数据传递的方法

```js
// Context 可以让我们无须明确地传遍每一个组件，就能将值深入传递进组件树。
// 为当前的 theme 创建一个 context（“light”为默认值）。
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
    // 无论多深，任何组件都能读取这个值。
    // 在这个例子中，我们将 “dark” 作为当前的值传递下去。
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 中间的组件再也不必指明往下传递 theme 了。
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // 指定 contextType 读取当前的 theme context。
  // React 会往上找到最近的 theme Provider，然后使用它的值。
  // 在这个例子中，当前的 theme 值为 “dark”。
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
```

Context 主要应用场景在于*很多*不同层级的组件需要访问同样一些的数据；

**注意：**请谨慎使用，因为这会使得组件的复用性变差；

#### 创建Context 对象React.createContext

```js
const MyContext = React.createContext(defaultValue);
<MyContext.Provider value={/* 某个值 */}>
//Provider 接收一个 value 属性，传递给消费组件
```

当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 `Provider` 中读取到当前的 context 值；

当 Provider 的 `value` 值发生变化时，它内部的所有消费组件都会重新渲染；

**注意：**当传递对象给 `value` 时，检测变化的方式会导致一些问题；

## 生命周期钩子函数（有状态组件）

```js
**constructor()**   ========   调用父级super(props)；设置状态state； es6的方法

**componentWillMount()**   ==========   修改状态；

componentWillReceiveProps()

shouldComponentUpdate()

componentWillUpdate()

componentDisUpdate()

componentDisCatch()

**componentDidMount()**    =========   创建虚拟DOM；更新DOM；

componentWillUnmount()

**render()**   ============    组件渲染完毕；不要更新状态；
```

```js
constructor => componentWillMount => render => 加载所有子组件 => componentDidMount
```

![](D:\serviceWWW\document\imgs\react生命周期.png)

#### 生命周期钩子函数（更新）

```js
componentWillReceiveProps(nextProps)  //组件发送改变触发
shouldComponentUpdate(nextProps,nextState)   //控制组件是否重现渲染
componentWillUpdate(nextProps,nextState)    //进入重现渲染流程
render()
//更新相关子组件
componentDidUpdate(prevProps,prevState)    //组件渲染完毕
```

![](D:\serviceWWW\document\imgs\react更新组件.png)

#### react生命周期函数参数

![](D:\serviceWWW\document\imgs\react生命周期函数参数.png)

#### 注意！！！

在react 17 版本后将会改变几个生命周期函数：

```js
componentWillReceiveProps   //组件将接受参数
componentWillMount   //组件将安装
componentWillUpdate  // 组件将更新
```

**使用static getDerivedStateFromProps（nextProps, prevState） 代替**：从props获取派生的state

```js
class NewState extends Component{
    //static getDerviedStateFromProps  必须在constructor中初始化state
    //注意：使用static getDerviedStateFromProps 必须有一个返回值 否则会报错
    constructor(props){
        super(props);
        this.state = {}; 
    }
    static getDerviedStateFromProps(nextProps,prevState){
        console.log("静态生命周期函数")
        //return null;
        //函数返回结果会被更新至 state 中
        return {
            title: "静态生命周期函数"
        }
    }
    render(){
        return (
            <div className="title">静态生命周期函数</div>
        )
    }
    componentDidMount(){
        console.log("componentDidMount")
    }
    shouldComponentUpdate(){
        console.log("shouldComponentUpdate")
    }
    componentDidUpdate(){
        console.log("componentDidUpdate")
    }
    componentWillUnmount(){
        console.log("componentWillUnmount")
    }
}
```



![](D:\serviceWWW\document\imgs\react新生命周期.png)

#### `getSnapshotBeforeUpdate` 更改DOM之前获取快照

在 `render` 方法之后执行；

这个方法返回的 `return` 将会传递给 `componentDidUpdate`；

与方法中 `含有will `的，都不兼容；

```js
componentDidUpdate(prevProps, prevState, info);   
//info为getSnapshotBeforeUpdate 传递的参数
```



## Redux 状态state存储容器

## state

`state` 只能在组件的 `constructor` 中初始化；

```js
constructor(){
    this.state = {
        name: "state"
    }
}
```

`state` 只能使用 `setState` 方法更新；

```js
this.setState({
    name: "setState"
})
```

`setState` 会导致 `render` 重新执行，渲染组件和子组件；

##  props 组件间的参数

props用于接收子组件使用来自父组件传递过来的参数；

```js
<Nav title={"titleName"}>
    <span>children</span>
</Nav>
class Nav extends Component{
    //在构造函数需要使用this.props时，constructor(props)
    constructor(props){
        super(props);//继承父组件的props
        //this.props.title === 上面Nav的title属性值
        //this.props.children === Nav 下 <span>children</span>
    }
    render(){
        return (
        	<div className="information">
            	<h2 className="title">{this.props.title}</h2>
            	<div className="desc">{this.props.children}</div>
    		</div>
        )
    }
}
const Nav = function(props){
    return (
    	<div className="information">
        	<h2 className="title">{props.title}</h2>
            <div className="desc">{props.children}</div>
    	</div>
    )
}
```

##  状态提升

1、将组件的状态提升至共同的父组件中；

2、组件共享父组件的状态；props向下传递；

3、方法下放：将父组件的函数传递给子组件；

``` jsx
<Button handleClick={(title)=>this.handleClick(title)}  />  //父组件
//子组件  在Button组件中使用父组件传递的handleClick方法
class Button extends Component{
    render(){
        return (
        	<button onClick={()=>this.props.handleClick("hello")}>点击一下</button>
        )
    }
}
```

## 默认defaultProps

设置默认defaultProps，在组件没有被传入props是生效；

```js
class Demo extends Component{
    static defaultProps = {
        name: "defaultProps"
    }
	render(){
        return (
        	<div className="name">{this.props.name}</div>
        )
    }
}
```

## propTypes类型检查

安装prop-types第三方组件，并引入；  

```js
//父组件
import PropTypes from 'prop-types';
class Demo extends Component{
    static proptypes = {
        name: PropTypes.string
    }
}

```

#### context 上下文类型检查propTypes

父组件用childContextTypes静态属性的类型检查；

在getChildContext返回子组件需要的context；

```js
//父组件
import PropTypes from 'prop-types';
class App extends Component{
    static childContextTypes = {
        themecolor: PropTypes.string
    }
	getChildContext(){
        //返回给子组件的数据
        return {
            themecolor: "#f00"
        }
    }
    render(){
        return (
        	<Button />
        )
    }
}
```

子组件用contextTypes静态属性的类型检查；

```js
//子组件
import PropTypes from 'prop-types';
class DemoChild extends Component{
    static contextTypes = {
        themecolor: PropTypes.string
    }
}
//子组件获取数据  this.context
```



