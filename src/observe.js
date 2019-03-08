/**
 * observe用于给data中的所有数据添加getter / settert
 */
class Observer {
  constructor(data) {
    this.data = data
    this.walk(data)
  }
  /**
   * 核心方法
   * 遍历data中的数据，都添加上getter / settert
   * @param {string} data 
   */
  walk(data) {
    if(!data || typeof data != 'object') {
      return 
    }
    Object.keys(data).forEach(key => {
      // console.log(key)
      // 给data对象的key设置getter和setter
      this.defineReactive(data, key, data[key])
      // 如果data[key]是一个复杂的类型，递归的walk
      this.walk(data[key])
    }) 
  }

  /**
   * 定义响应式的数据（数据劫持）
   * data中的每一个数据都应该维护一个dep对象
   * @param {object} obj 
   * @param {string} key 
   * @param {string} value 
   */
  defineReactive(obj, key, value) {
    let that = this
    let dep = new dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // console. log('获取到的数据的值', value)
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set (newValue) {
        if(value === newValue ) { return }
        value = newValue
        this.walk(newValue)
        // 调用watcher update方法
        window.watcher.update()
      }
    })

  }
}