/**
 * watcher模块负责把compile模块与observe模块关联起来
 */
class Watcher{
  /**
   * 
   * @param {string} vm 当前Vue实例
   * @param {string} expr data中数据的名字
   * @param {string} cb 当数据发生改变，需要调用cb
   */
  constructor (vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb

    // 需要把wxpr的旧值保存起来
    // this.oldValue = this.getVMValue(vm, expr)

    // this表示的就是新创建的watcher对象
    // 存储到Dep.target属性上
    Dep.target = this
    // 需要把expr的旧值给存储起来
    this.oldValue = this.getVMValue(vm, expr)
    // 清空Dep.target
    Dep.target = null
  }

  /**
   * 对外暴漏的一个方法，这个方法用于更新页面
   */
  update() {
    // 对比expr是否发生了改变，有改变 ==> 调用cb
    let oldValue = this.oldValue
    let newValue = this.newValue

    if(oldValue != newValue) {
      this.cb(newValue, oldValue)
    }
  }

  /**
   * 用于获取vm中的数据
   * @param {string} vm 
   * @param {string} expr 
   */
  getVMValue(vm, expr) {
    // 获取到data中的数据
    let data = vm.$data
    expr.split(".").forEach(key => {
      data = data[key]
    })
    return data
  }

}


/**
 * dep对象用于管理所有的订阅者和通知这些订阅者
 */
class Dep {
  constructor() {
    // 用于管理订阅者
    this.subs = []
  }

  // 添加订阅者
  addSub(watcher) {
    this.subs.push(watcher)
  }

  // 通知
  notify() {
    // 遍历所有的订阅者，调用watcher的update方法
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}