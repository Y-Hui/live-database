import type { Listener, ListenerKey, Store } from '../create-store'

type EqualityFn = (value1: unknown, value2: unknown) => boolean

type StoreWithSelector<S> = Store<S> & {
  /**
   * 指定一个值添加监听器。
   *
   * @param firstCall 注册监听器后是否立即调用一次
   */
  selector: (
    selectorState: (state: S) => unknown,
    firstCall?: boolean,
  ) => Store<S>
}

/**
 * 接收一个比较新值旧值是否相等的函数。
 *
 * 默认使用 `Object.is` 比较
 */
function selector<S>(equalityFn: EqualityFn = Object.is) {
  return (store: Store<S>): StoreWithSelector<S> => {
    const originListen = store.addListener
    return {
      ...store,
      selector(selectorState: (state: S) => unknown, firstCall = false) {
        return {
          ...store,
          addListener: (listener: Listener<S>, key?: ListenerKey) => {
            const cache = store.getState()
            let currentState = selectorState(cache)
            const proxyListener: Listener<S> = (state, prevState) => {
              const nextState = selectorState(state)
              if (!equalityFn(currentState, nextState)) {
                currentState = nextState
                listener(state, prevState)
              }
            }
            if (firstCall) {
              listener(cache, cache)
            }
            return originListen(proxyListener, key)
          },
        }
      },
    }
  }
}

export default selector
