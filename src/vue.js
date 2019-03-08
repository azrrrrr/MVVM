/**
 *  定义一个类 Vue的构造函数，用于创建Vue实例
 */


class Vue {
  constructor(options = {}) {

    this.$el = options.el
    this.$data = options.data
    this.$methods = options.methods

    // 监视data中的数据
    new Observer(this.$data)

    // 把data中所有的数据代理到了vm上
    this.proxy(this.$data)
    // 把methods中所有的数据代理到了vm上
    this.proxy(this.$methods)
    // 如果指定了el参数，对el进行解析
    if (this.$el) {
      // compile负责解析模板的内容  模板和数据
      let c = new Compile(this.$el, this)
    }
  }

  proxy(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if (data[key] == newValue) {
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}

// class Vue {
//   constructor(options) {
//     // 设值默认参数
//     options = options || {}
//     // 给Vue添加属性 
//     this.$el = options.el
//     this.$data = options.data
//     this.$methods = options.methods
//     // Compiler主要负责解析模板指令和插值表达式，将模板中的变量转换成数据. 然后渲染整个页面和视图
  
//     // 监视data中的数据
//     new Observer(this.$data)

//     if(this.$el) {
//       // this == 整个Vue实例
//       // let c  = new Compile(this.$el, this)
//       // console.log(c)
//     }
//   }
// }