## @live-database/store

状态机。

### 基本用法

```ts
import create from '@live-database/store'

const store = create({ name: 'Andrew', age: 14 })

store.addListener((state) => {
  console.log('数据发生变化：', state.age)
})

// 必须使用 setState 才能触发 listener
store.setState((prevState) => ({ ...prevState, age: prevState.age + 1 }))

// 即使没有修改 age, 上面的 listener 依然会被触发。
store.setState((prevState) => ({ ...prevState, name: 'Helen' }))
```

### getState

```ts
import create from '@live-database/store'

const store = create({ name: 'Andrew', age: 14 })

// 使用 getState 获取最新的状态值
store.getState().name
```

### 指定 state 的 listener

```ts
import create from '@live-database/store'
import { selector } from '@live-database/store/middleware'

const store = create({ name: 'Andrew', age: 14 })
const scopeStore = store.extend(selector()) // 使用 selector 增强

scopeStore
  .selector((state) => state.age)
  .addListener((state) => {
    console.log('age 发生变化：', state.age)
  })

// 修改 age, 触发 listener
scopeStore.setState((prevState) => ({ ...prevState, age: prevState.age + 1 }))
// 与此行代码等价 
// store.setState((prevState) => ({ ...prevState, age: prevState.age + 1 }))

// 修改 name 不会触发 listener
scopeStore.setState((prevState) => ({ ...prevState, name: 'Helen' }))
// 与此行代码等价 
// store.setState((prevState) => ({ ...prevState, name: 'Helen' }))
```

### 指定 key 的 listener

携带 key 值的 listener 拥有优先调用权。

```ts
import create from '@live-database/store'

const store = create({ name: 'Andrew', age: 14 })
const KEY = 'YOUR_STRING_KEY'

store.addListener((state) => {
  console.log(state)
  console.log('即使声明在前，但是稍后调用')
})

store.addListener(() => {
  console.log('拥有优先调用权')
}, KEY)
```

### 移除 listener

```ts
const store = create({ name: 'Andrew', age: 14 })

// addListener 返回值便是该 listener 的移除函数
const removeFn = store.addListener(() => {
  console.log('listener call')
})

const KEY = 'YOUR_STRING_KEY'
store.addListener(() => {
  console.log('listener2 call')
}, KEY)

store.removeListener(KEY) // 指定 key 值移除


store.clearAllListener() // 清空所有 listener
```


### 关于 `extend`

store 的返回结果中的 `extend` 函数可创建一个代理对象，用于增强 store 的 api。

```ts
import create from '@live-database/store'

// 方式 1
const basicStore = create({ value: 2 }) // 依旧持有原始对象
const store = basicStore.extend((api) => {
  return {
    ...api,
    getDoubleValue() {
      return api.getState().value * 2
    },
  }
})

console.log(store.getState().value) // 2
console.log(store.getDoubleValue()) // 4


// 方式 2
const store = create({ value: 2 }).extend((api) => {
  return {
    ...api,
    getDoubleValue() {
      return api.getState().value * 2
    },
  }
})

console.log(store.getState().value) // 2
console.log(store.getDoubleValue()) // 4
```

extend 的返回值是没有任何约束的，你可以随心所欲做任何功能而不会影响 store api。
