import {hx} from '../../common/_tools.js'

// modal的zindex从1000开始递增
var zindex = 1000

var XDialog = Vue.extend({
  props: {
    value: Boolean,
    title: String,
    footer: {
        type: Array,
        default: _=> {
            return [
                {text: '取消', onPress: null},
                {text: '确定', onPress: null},
            ]
        }
    },
    animationType: {
        type: String,
        default: 'bounce'
    }
  },
  data () {
    return {
      zindex: zindex,
      delay: false,
      alreadyMask: false
    }
  },
  watch: {
    value () {
      if (this.value){
        zindex ++
        this.zindex = zindex
        this.delay = true
      } else {
        setTimeout(_=> {
            this.delay = false
        }, 250)
      }
    }
  },
  computed: {
      cls () {
        var cls = ['x-dialog-content']

        return cls
      },
      footerCls () {
        var cls = ['x-dialog-footer']

        if (this.footer.length < 2) {
            cls.push('x-dialog-footer-gourp-v')
        }else {
            cls.push('x-dialog-footer-group-h')
        }

        return cls
      },
  },
  methods: {
    hide () {
        this.$emit('input', false)
    },
    delayChange () {
        this.delay = false
    }
  },
  render (h) {
    var me = this

    var $wrapper = hx('div.x-dialog-wrapper')

    // modal
    var $content = hx(`div.${this.cls.join('+')}`, {
        style: {
            'z-index': me.zindex,
            
        },
    })

    // mask
    var $mask = hx(`div.x-dialog-mask`, {
        on: {
            click: me.hide
        }
    })

    // head
    $content.push(
      hx('div.x-dialog-header').push(
        hx('div.x-dialog-header-inner', {}, [this.title])
      )
    )

    // body
    $content.push(
      hx('div.x-dialog-body').push(
          hx('div.x-dialog-body-content', {}, [this.$slots.default])
      )
    )

    // footer
    var $footer = hx(`div.${this.footerCls.join('+')}`)
    this.footer.map(item=> {
        $footer.push(
            hx('a.x-dialog-button', {
                on: {
                    click: item.onPress || me.hide
                }
            }, [item.text])
        )
    })

    $content.push($footer)

    var $transition = hx('transition', {
        props: {
            name: this.animationType,
            appear: true
        }
    }, [this.value ? $content : null])

    var $transition_mask = hx('transition', {
        props: {
            name: 'popup-mask',
            appear: true
        }
    }, [this.value && !this.alreadyMask ? $mask : null])

    $wrapper
    .push($transition_mask)
    .push(
        hx('div.x-dialog').push(
            $transition
        )
    )
    

    return this.value || this.delay ? hx('div.x-dialog-container').push($wrapper).resolve(h) : false
  },
  mounted () {
      this.alreadyMask = document.getElementsByClassName('x-dialog-mask').length ? true : false
  }
})

Vue.component('x-dialog', XDialog)

// 全局注入alert
var XAlert = Vue.extend({
  template: `
    <x-dialog v-model="value" :title="title" :footer="[{text: buttonText, onPress: _=> {this.okClick()}}]">
      <div>{{content}}</div>
    </x-dialog>
  `,
  data () {
    return {
      title: '',
      content: '',
      onOk: ()=>{},
      value: false,
      buttonText: '确定'
    }
  },
  methods: {
    show (content, title, onOk, buttonText) {
      this.content = content || ''
      this.title = title || document.title

      if (onOk){
        this.onOk = onOk
      }

      if (buttonText) {
          this.buttonText = buttonText
      }

      this.value = true
    },
    hide () {
      this.value = false
    },
    okClick () {
      this.onOk()
      this.value = false
    }
  }
})

var getAlert = function (){
  var alert = null

  return function (){
    if (alert){
      return alert
    }

    alert = new XAlert
 
    alert.$mount(document.createElement('div'))
    document.body.appendChild(alert.$el)

    return alert
  }
}()

// 全局注入confirm
var XConfirm = Vue.extend({
  template: `
    <x-dialog v-model="value" :title="title" :footer="[{text: cancelText, onPress: _=> {this.cancelClick()}}, {text: okText, onPress: _=> {this.okClick()}}]">
        <div>{{content}}</div>
    </x-dialog>
  `,
  data () {
    return {
      title: '',
      content: '',
      cancelText: '取消',
      okText: '确定',
      onOk: ()=>{},
      onCancel: ()=>{},
      value: false,
    }
  },
  methods: {
    show (options) {
        this.content = options.content || ''
        this.title = options.title || document.title
      
        if (options.onOk){
            this.onOk = options.onOk
        }

        if (options.onCancel){
            this.onCancel = options.onCancel
        }

        if (options.cancelText) {
            this.cancelText = cancelText
        }

        if (options.okText) {
            this.okText = okText
        }

        this.value = true
    },
    hide () {
      this.value = false
    },
    okClick () {
      this.onOk()
      this.value = false
    },
    cancelClick () {
      this.onCancel()
      this.value = false
    }
  }
})

var getConfirm = function (){
  var confirm = null

  return function (){
    if (confirm){
      return confirm
    }

    confirm = new XConfirm()
 
    confirm.$mount(document.createElement('div'))
    document.body.appendChild(confirm.$el)

    return confirm
  }
}()

Vue.mixin({
  methods: {
    $alert (content, title, onOk, buttonText) {
      getAlert().show(content, title, onOk, buttonText)
    },
    $confirm (options) {
      getConfirm().show(options || {})
    }
  }
})