import {hx} from '../../common/_tools.js'

var XMessage = Vue.extend({
  props: {
  },
  data () {
    return {
      // 枚举，info, success, warning, error
      type: 'info',
      msg: '',
      isShow: false,
      timer: null,
      duration: 3000,
    }
  },
  computed: {
    cls () {
      var cls = ['x-message']
      cls.push('x-message-global')

      cls.push('x-message-' + this.type)

      return cls
    },
  },
  methods: {
    show (msg, type) {
      clearTimeout(this.timer)
      
      this.msg = msg
      this.type = type || 'info'
      this.isShow = true

      this.hide()
    },
    hide () {
      this.timer = setTimeout(_=>{
        this.isShow = false
      }, this.duration)
    }
  },
  render (h) {
    var me = this

    var $wrapper = hx(`div.${this.cls.join('+')}`, {
      style: {
        display: this.isShow ? 'block' : 'none'
      },
    })

    var iconList = {
      info: 'ios-information-outline',
      success: 'ios-checkmark-outline',
      warning: 'sad-outline',
      error: 'ios-close-outline',
      loading: 'load-a'
    }
    
    $wrapper
      .push(
        hx('x-icon.x-message-icon', {
          props: {
            type: iconList[this.type],
            size: 'lg',
            'auto-rotate': this.type == 'loading',
          }
        })
      )
      .push(
        hx('div.x-message-text', {}, [this.msg])
      )

    return $wrapper.resolve(h)
  }
})

var getMessage = function (){
  var message = null

  return function (){
    if (message){
      return message
    }

    message = new XMessage

    message.$mount(document.createElement('div'))
    document.body.appendChild(message.$el)

    return message
  }
}()

Vue.mixin({
  methods: {
    $message (msg, type) {
      var message = getMessage()
      message.show(msg, type)
    }
  }
})

