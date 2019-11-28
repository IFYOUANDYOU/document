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

#### router-link链接跳转（go、replace、to)

```html
<router-link to="home" tag="li">Home</router-link>
<!-- 配置exact，链接只会在地址为 / 的时候被激活 -->
<router-link :to="'home'" exact>Home</router-link>
<router-link :to="{ path: 'home' }">Home</router-link>
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
<router-link :to="{ path: 'register', query: { userId: 123 }}">Register</router-link>
```

active-class: "router-link-active"，通过路由的构造选项 `linkActiveClass` 来全局配置；

exact-active-class: "router-link-exact-active"，通过路由构造函数选项 `linkExactActiveClass` 进行全局配置；

```js
const userId = '123'
router.push({ name: 'user', params: { userId }}) // -> /user/123
router.push({ path: `/user/${userId}` }) // -> /user/123
/*  如果提供了 path，params 会被忽略  */
router.push({ path: 'register', query: { 'userId': userId }})
```

**注意**： 如果目的地和当前路由相同，只有参数发生了改变 (比如从一个用户资料到另一个 `/users/1` -> `/users/2`)，你需要使用 [`beforeRouteUpdate`](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#响应路由参数的变化) 来响应这个变化 (比如抓取用户信息)。

#### 重定向

```js
{ path: '/a', redirect: '/b' }
{ path: '/a', redirect: { name: 'foo' }}
{ path: '/a', redirect: to => {
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
}}
```

#### 别名（访问a时，URL会变成/b，实际还是访问的/a)

```js
{ path: '/a', component: A, alias: '/b' }
```

```js
//路由独享的守卫
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

```js
//在路由组件内直接定义以下路由导航守卫
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

```js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(vm => {
    // 通过 `vm` 访问组件实例
  	})
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
```

#### 导航解析流程

1. 导航被触发。
2. 在失活的组件里调用离开守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 用创建好的实例调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数。

```js
//定义路由的时候可以配置 meta 字段
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```

```js
//遍历 $route.matched 来检查路由记录中的 meta 字段
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
```

```html
<!-- 使用动态的 transition name -->
<transition :name="transitionName">
  <router-view></router-view>
</transition>
```

```js
// 接着在父组件内
// watch $route 决定使用哪种过渡
watch: {
  '$route' (to, from) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  }
}
```

```js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
        return savedPosition
    } else {
        return { x: 0, y: 0 }
    }
  }
})
```

#### 路由懒加载

1、vue异步组件技术 ==== 异步加载 
vue-router配置路由 , 使用vue的异步组件技术 , 可以实现按需加载 . 
但是,这种情况下一个组件生成一个js文件

```js
/* vue异步组件技术 */
{
  path: '/home',
  name: 'home',
  component: resolve => require(['@/components/home'],resolve)
},{
  path: '/index',
  name: 'Index',
  component: resolve => require(['@/components/index'],resolve)
},{
  path: '/about',
  name: 'about',
  component: resolve => require(['@/components/about'],resolve)
} 
```

2、组件懒加载方案二 路由懒加载(使用import)

```js
// 下面2行代码，没有指定webpackChunkName，每个组件打包成一个js文件。
/* const Home = () => import('@/components/home')
const Index = () => import('@/components/index')
const About = () => import('@/components/about') */
// 下面2行代码，指定了相同的webpackChunkName，会合并打包成一个js文件。 把组件按组分块
const Home =  () => import(/* webpackChunkName: 'ImportFuncDemo' */ '@/components/home')
const Index = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '@/components/index')
const About = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '@/components/about')

//在webpack.base.conf.js文件中配置chunkFileName  
output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    chunkFilename: '[name].js', //以文件名为最终打包的名称
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
},

{
  path: '/about',
  component: About
}, {
  path: '/index',
  component: Index
}, {
  path: '/home',
  component: Home
}
```

3、webpack提供的require.ensure() 
vue-router配置路由，使用webpack的require.ensure技术，也可以实现按需加载。 
这种情况下，多个路由指定相同的chunkName，会合并打包成一个js文件。

```js
/* 组件懒加载方案三: webpack提供的require.ensure() */
{
  path: '/home',
  name: 'home',
  component: r => require.ensure([], () => r(require('@/components/home')), 'demo')
}, {
  path: '/index',
  name: 'Index',
  component: r => require.ensure([], () => r(require('@/components/index')), 'demo')
}, {
  path: '/about',
  name: 'about',
  component: r => require.ensure([], () => r(require('@/components/about')), 'demo-01')
}
```

#### State

```js
//获取vuex中的state的状态
computed: {
	count () {
      return this.$store.state.count
    }
}
```

```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'
//一个组件需要多个状态，mapState函数帮助生成计算属性
export default {
  computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,
    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',
    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

#### Getter

getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算

```js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
    //Getter 也可以接受其他 getter 作为第二个参数
    doneTodosCount: (state, getters) => {
    	return getters.doneTodos.length
  	}
  }
})
//组件中访问  store.getters.doneTodos   this.$store.getters.doneTodosCount
```

通过让 getter 返回一个函数，来实现给 getter 传参(方法访问不会缓存结果)

```js
getters: {
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}

store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

`mapGetters` 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：

```js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
    //将一个 getter 属性另取一个名字，使用对象形式
    mapGetters({
  	// 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
      doneCount: 'doneTodosCount'
    })
  }
}
```

#### 	Mutation

更改Vuex中state的唯一方法，接受 state 作为第一个参数

```js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
      //提交的参数最好是一个对象
    increment (state, n) {//调用   store.commit('increment', 10)
      // 变更状态
      state.count+=n
    }
  }
})
```

以对象形式提交mutation

```js
store.commit({
  type: 'increment',
  amount: 10
})

mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

使用常量替代 mutation 事件类型，同时把这些常量放在单独的文件中可以让你的代码的 mutation 一目了然：

```js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'

// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'
const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

**注意：  mutation 必须是同步函数**

在组件中使用 `this.$store.commit('xxx')` 提交 mutation；

或者使用 `mapMutations` 辅助函数将组件中的 methods 映射为 `store.commit` 调用；

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```

#### Action

- Action 提交的是 mutation，而不是直接变更状态。
- Action 可以包含任意异步操作。

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
      //ES2015 的 参数解构 来简化代码
    increment ({ commit }) {
        commit('increment')
    }
  }
})
```

`context.commit` 提交一个 mutation;

或者通过 `context.state` 和 `context.getters` 来获取 state 和 getters;

Action 通过 `store.dispatch` 方法触发：

```js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}

// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})

// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

```js
actions: {
  checkout ({ commit, state }, products) {
    // 把当前购物车的物品备份起来
    const savedCartItems = [...state.cart.added]
    // 发出结账请求，然后乐观地清空购物车
    commit(types.CHECKOUT_REQUEST)
    // 购物 API 接受一个成功回调和一个失败回调
    shop.buyProducts(
      products,
      // 成功操作
      () => commit(types.CHECKOUT_SUCCESS),
      // 失败操作
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

在组件中使用 `this.$store.dispatch('xxx')` 分发 action;

或者使用 `mapActions` 辅助函数将组件的 methods 映射为 `store.dispatch` 调用;

```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```

```js
//action是异步的
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}

store.dispatch('actionA').then(() => {
  // ...
})
```

```js
// 假设 getData() 和 getOtherData() 返回的是 Promise
//利用 async / await
actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
//在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行
```

#### Mudule

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

添加 `namespaced: true` 的方式使其成为带命名空间的模块:

```js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,
      // 模块内容（module assets）
      state: { ... }, // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 进一步嵌套命名空间
        posts: {
          namespaced: true,
          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```