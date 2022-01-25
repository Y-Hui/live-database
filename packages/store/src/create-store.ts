import {
  EqualityFn,
  Listener,
  ListenerKey,
  RemoveListenerFn,
  SetStateAction,
} from './types/index'

type SetStateFn<S> = (
  action: SetStateAction<S>,
  equalityFn?: EqualityFn,
) => void

export interface Store<S> {
  /**
   * 获取 State
   */
  readonly getState: () => S
  /**
   * 修改 State
   *
   * 若新旧值相等，则跳过触发 listener
   *
   * @param equalityFn 比较新值旧值是否相等的函数，默认使用 `Object.is` 比较。
   */
  readonly setState: SetStateFn<S>
  /**
   * 添加监听器
   *
   * @param key 设置唯一值，拥有 key 的监听器拥有优先调用权
   */
  readonly addListener: (
    listener: Listener<S>,
    key?: ListenerKey,
  ) => RemoveListenerFn
  /**
   * 移除指定监听器
   */
  readonly removeListener: (key: ListenerKey) => void
  /**
   * 清空所有监听器
   */
  readonly clearAllListener: RemoveListenerFn
}

export type GetState<T> = T extends Store<infer U> ? U : T

interface StoreMethods<S> extends Store<S> {
  /**
   * 使用自定义函数代理 store api
   */
  readonly extend: <T>(middleware: (store: Store<S>) => T) => T
}

function setStateAction<S>(action: SetStateAction<S>, prevState: S): S {
  if (typeof action === 'function') {
    return (action as (prevState: S) => S)(prevState)
  }
  return action
}

function createStore<S>(initialState: S): StoreMethods<S> {
  const state = {
    entity: initialState,
    get value() {
      return this.entity
    },
    set value(newState) {
      this.entity = newState
    },
  }

  const listeners = new Set<Listener<S>>()
  const namedListeners = new Map<ListenerKey, Listener<S>>()

  const getState = () => state.value

  const setState: SetStateFn<S> = (action, equalityFn = Object.is) => {
    const prevState = getState()
    const nextState = setStateAction(action, prevState)
    if (equalityFn(prevState, nextState)) {
      return
    }
    state.value = nextState
    const dispatch = (listener: Listener<S>) => listener(nextState, prevState)
    // 优先调用命名的监听器
    namedListeners.forEach(dispatch)
    listeners.forEach(dispatch)
  }

  const addListener = (listener: Listener<S>, key?: ListenerKey) => {
    if (typeof key === 'string') {
      namedListeners.set(key, listener)
      return () => {
        namedListeners.delete(key)
      }
    }
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  const removeListener = (key: ListenerKey) => {
    namedListeners.delete(key)
  }

  const clearAllListener = () => {
    namedListeners.clear()
    listeners.clear()
  }

  const stateMethods: Store<S> = Object.freeze({
    getState,
    setState,
    addListener,
    removeListener,
    clearAllListener,
  } as const)

  const extend = <T>(middleware: (store: Store<S>) => T) => {
    return middleware(stateMethods)
  }

  return {
    getState,
    setState,
    addListener,
    removeListener,
    clearAllListener,
    extend,
  } as const
}

export default createStore
