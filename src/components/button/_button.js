import {hx} from '../../common/_tools.js'

var XButton = Vue.extend({
  props: {
    type: {
      type: String,
      default: 'default',
    },
    size: String,
    long: Boolean,
    htmlType: {
      type: String,
      default: 'button',
    },
    disabled: Boolean,
    loading: Boolean,
    icon: String,

    // icon位置，默认before
    // 枚举: before, after
    iconPos: {
      type: String,
      default: 'before'
    }
  },
  computed: {
    cls () {
      var cls = []
      cls.push(`x-btn-${this.type}`)
      
      if (this.disabled || this.loading){
        cls.push('x-btn-disabled')
      }

      if (this.size === 'small'){
        cls.push('x-btn-small')
      }

      if (this.long === true){
        cls.push('x-btn-long')
      }      

      return cls
    }
  },
  render (h) {
    var params = {
      domProps: {
        type: this.htmlType,
      },
      directives: [
          {
            name: 'fb',
            value: {cls: 'x-btn-active'}
          }
      ]
    }

    if (this.disabled || this.loading){
      params.domProps['disabled'] = 'disabled'
    }

    var $btn = hx(`button.x-btn + ${this.cls.join('+')}`, params)
    var $btnTxt = hx('span', {}, [this.$slots.default])

    var $icon = null
    var icon = this.icon
    if (this.loading){
      icon = 'load-c'
    }

    if (icon){
      $icon = hx('x-icon.x-btn-icon', {
        'class': {
          'x-icon-only': $btnTxt ? false : true,
        },
        props: {
          type: icon,
          'auto-rotate': this.loading,
        },
      })
    }

    var $children = [$icon, $btnTxt]
    if (this.iconPos === 'after'){
      var $children = [$btnTxt, $icon]
    }

    $btn.push($children)
    return $btn.resolve(h)
  }
})

var XButtonGroup = Vue.extend({
  props: {
    size: String,
  },
  computed: {
    cls () {
      var cls = ['x-btn-group']
      
      if (this.size === 'small'){
        cls.push('x-btn-group-small')
      }
      
      return cls
    }
  },
  render (h) {
    return hx(`div.${this.cls.join('+')}`, {}, [this.$slots.default]).resolve(h)
  }
})

Vue.component('x-button', XButton)
Vue.component('x-button-group', XButtonGroup)