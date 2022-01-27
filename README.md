## LiveDatabase

## Usage

```ts
import createDatabase, { dataType } from 'live-database'

const db = createDatabase({
  strictModeForProd: false, // 关闭生产环境严格模式
})

const userTable = db.createTable({
  name: 'user',
  primaryKey: 'id',
  body: {
    id: {
      type: dataType.string,

      /* 以下为可选参数 */
      required: true,
      transform(rawVal) => { // 如果数据类型不正确，尝试执行此函数。
        const result = doSomething(rawVal) // 自行处理数据
        return result
      },
    },
    userName: {
      type: dataType.string.extends({
        maxLength: 16,
      }),
      /* 以下为可选参数 */
      defaultValue: () => 'Random UserName', // 可以直接填写 value 或者使用函数生成
    },
    age: {
      type: dataType.number, // NaN 不能通过此校验
    },
    permission: {
      type: dataType.enumerate(0, 1, 2), // 数字类型和字符串类型枚举不能兼容
    },
    avatar: {
      type: (val) => checkType(val), // 有效的
    },
  },
})
```
