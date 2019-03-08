/**
 * 负责解析模板内容
 * @param el {object} new Vue 选择器
 * @param vm {object} new Vue Vue实例
 */

 class Compile{

   constructor(el ,vm ) {
     // 参数
     this.el = typeof el === 'string' ? document.querySelector(el) : el 
     this.vm = vm
     // 编模模板
     if(this.el) {
       // 1. 把el中所有的子节点放入内存中  fragment

       // 1-1 创建node2Fragment的核心方法
       // 1-2 创建toArray的工具方法
       // 1-3 打印consol.dir(fragment) 查看控制台内容
       let fragment = this.node2Fragment(this.el)
       //  console.dir(fragment)

       // 2. 在内存中编译fragment
       this.compile(fragment)

       // 3. 把fragment一次性的添加到页面
       this.el.appendChild(fragment)
      
     }
   }


  //  核心方法
   /**
    * 把el中所有的子节点添加到文档碎片中
    * @param {string} node 
    */
   node2Fragment(node){
    let fragment = document.createDocumentFragment()
    
    // 把el中所有的子节点添加到文档碎片中
    let childNodes = node.childNodes
    // console.log(childNodes)

    this.toArray(childNodes).forEach(node => {
      // 把所有的字点添加到fragment
      fragment.appendChild(node)
    })
    return fragment
   }

   
   /**
    * 在内存中编译文档碎片
    * @param {string} fragment 
    */
   compile(fragment) {
    let childNodes = fragment.childNodes
    this.toArray(childNodes).forEach(node=>{
      // 编译子节点
      // console.log(node)
      if(this.isElementNode(node)) {
         // 是元素节点 需要解析指令
        this.compileElement(node)
      }
      if(this.isTextNode(node)) {
        // 是文本节点 需要解析插值表达式
        this.compileText(node)
      }
      if(node.childNodes && node.childNodes.length > 0) {
        // <div>{{msg}}</div>
        // 当前节点还有子节点 需要递归解析
        this.compile(node)
      }
    })
   }

   /**
    * 解析html标签
    * @param {string} node 
    */
   compileElement(node){
    // 1. 获取当前节点下所有的属性
    let attributes = node.attributes
    // console.log(attributes)
    this.toArray(attributes).forEach(attr=> {
      // console.log("attr", attr)
      // console.dir(attr)

      // 2. 解析Vue的指令（所有以v-开头的指令）
      let attrName = attr.name
      

      if(this.isDirective(attrName)) {
        // console.log(attrName)
        let type = attrName.slice(2)
      //   console.log("type", type)
       let expr = attr.value
        // 如果是v-text指令
        // if(type === 'text') {
        //   // node.textContent = expr
        //   // node.textContent = this.vm.$data[expr]
        //   // console.log("node", node)

        //   // 简化1 
        //   CompileUtil['text'](node, this.vm, expr)
        // }
        // // 如果是v-html指令
        // if(type === "html") {
        //   node.innerHTML = this.vm.$data[expr]
        //   // console.log("node", node)
        // }
        // // 如果是v-model指令
        // if(type === "model") {
        //   node.value = this.vm.$data[expr]
        //   // console.log("node", node)
        // }



        // 如果是v-on指令
        // if(type === "on") { console.log("on") }
        if(this.isEventDirective(type)){ 
          // console.log("on")
          // 给当前元素注册时间
          // let eventType = type.split(":")[1]
          // node.addEventListener(eventType, this.vm.$methods[expr].bind(this.vm)) 
          //  简化2
          CompileUtil["eventHandler"](node, this.vm, type, expr)
        }else {
          CompileUtil[type] && CompileUtil[type](node. this.vm, expr)
        }
      }
    })
   

   }

   /**
    * 解析文本节点
    * @param {string} node 
    */
    compileText(node) {
      // let txt = node.textContent
      // let reg = /\{\{(.+)\}\}/
      // if(reg.test(txt)){
      //   let expr = RegExp.$1
      //   // console.log(expr)
      //   // node.textContent = txt.replace(reg, this.vm.$data[expr])
      //   node.textContent = txt.replace(reg, this.getVMValue(vm, expr))
      // }
      CompileUtil.mustache(node, this.vm)

      // 通过watcher对象，监听expr的数据变化，当数据发生变化，就执行回调函数
      new Watcher(vm, expr, (newValue) => {
        node.textContent = newValue
      })
    }

   /**
    * Array转换
    * @param {string} likeArray 
    */
   toArray(likeArray) {
    return [].slice.call(likeArray)
   }

   /**
    * nodeType 节点的类型
    *  1. 元素节点
    * @param {string} node 
    */
   isElementNode(node) {
     return node.nodeType === 1
   }
   
   /**
    * nodeType 节点的类型
    * 3. 文本节点
    * @param {string} node 
    */
   isTextNode(node) {
     return node.nodeType === 3
   }


   /**
    * 是否是v-开头的指令
    * @param {string} attrName 
    */
   isDirective(attrName) {
    return attrName.startsWith('v-')
   }

   /**
    * 是否是on的指令
    * @param {string} type 
    */
   isEventDirective(type) {
    return type.split(":")[0] === "on"
   }


   let CompileUtil = {

    mustache(node, vm) {
      let txt = node.textContent
      let reg = /\{\{(.+)\}\}/
      if(reg.test(txt)){
        let expr = RegExp.$1
        node.textContent = txt.replace(reg, this.getVMValue(vm, expr))
        // 添加监听watcher
        new Watcher(vm, expr, newValue => {
          node.innerHTML = txt.replace(reg, newValue)
        })
      }
    },
    text(node, vm, expr) {
      node.textContent = vm.$data[expr]
      // 添加监听watcher
      new Watcher(vm, expr, (newValue) => {
        node.textContent = newValue
      })
    },
    html(node, vm, expr) {
      node.innerHTML = vm.$data[expr]
      // 添加监听watcher
      new Watcher(vm, expr, (newValue) => {
        node.innerHTML = newValue
      })
    },
    model(node, vm, expr) {
      node.value = vm.$data[expr]
      // 实现双向的数据绑定， 给node注册input事件，当前元素的value值发生改变，修改对应的数据
      node.addEventListener("input", function() {
        // this.$data[expr] = this.value
        self.setVMValue(vm, expr, this.value)
      })
      // 添加监听watcher
      new Watcher(vm, expr, (newValue) => {
        node.value = newValue
      })
    },
    eventHandler(node, vm, type, expr) {
      let eventType = type.split(":")[1]
      let fn = vm.$methods && vm.$methods[expr]
      if(eventType && fn) {
        node.addEventListener(eventType, fn.bind(vm))
      }
    },
    getVMValue(vm, expr) {
      let data = vm.$data
      expr.split(".").forEach( key=> {
        data = data[key]
      })
      return data
    },
    setVMValue(vm, expr, value) {
      let data = vm.$data
      // car brand
      let arr = expr.split(".")
  
      arr.forEach((key, index) => {
        // 如果index是最后一个
        if (index < arr.length - 1) {
          data = data[key]
        } else {
          data[key] = value
        }
      })
    }
   }

  }
 
