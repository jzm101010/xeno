import {hx, isdef} from '../../common/_tools.js'
import instance from '../../common/_instance.js'
import { XFormItem } from '../form/_form'

export var XInput = Vue.extend({
    // model: {
    //     prop: 'inputValue',
    //     event: 'changeInput'
    // },
  props: {
    type: {
      type: String,
      default: 'text',
    },
    label: String,
    value: [String, Number],
    size: String,
    placeholder: {
      type: String,
      default: '请输入',
    },
    disabled: Boolean,
    readonly: Boolean,
    maxlength: [Number, String],
    icon: String,
    rows: {
      type: [Number, String],
      default: 2,
    },
    // 是否触发校验，默认触发，当XInput被其他组件使用时候选择关闭
    shouldValidate: {
      type: Boolean,
      default: true,
    },
    // 是否trim
    trim: Boolean,
  },
  computed: {
    cls () {
      var cls = ['x-input']

      if (this.type === 'textarea'){
        cls.push('x-input-textarea')
      }
      else {
        if (this.size === 'small'){
          cls.push('x-input-small')
        }
      }

      if (this.disabled) {
        cls.push('x-input-disabled')
      }

      return cls
    },
    formItem () {
      return instance.getParent(this, XFormItem)
    }
  },
  data () {
      return {
        params: {}
      }
  },
  render (h) {
    var me = this
    var $input = hx(`div.x-input + ${this.cls.join('+')}`).push(hx('div.hairline-bottom')).push(hx('div.hairline-top'))
    var $line = hx('div.x-input-line + x-input-line-center')
    params = {
      domProps: {
        value: isdef(this.value) ? this.value : '',
        placeholder: this.placeholder || '',
      },
      attrs: {
        readonly: this.readonly,
        disabled: this.disabled,
        maxlength: this.maxlength,
      },
      on: {
        input (e) {
          me.$emit('input', e.target.value)
        },
        change (e) {
          me.$emit('change', e)
        },
        focus (e) {
          me.$emit('focus', e)
        },
        blur (e) {
          me.$emit('blur', e)

          if (me.trim){
            me.$emit('input', e.target.value.trim())
          }

          if (me.shouldValidate && me.formItem){
            me.formItem.validate()
          }
        },
      },
    }
    
    if (this.type === 'textarea'){
      params.attrs['rows'] = this.rows
    }
    else {
      params.domProps['type'] = this.type
    }

    $line.push(
      hx('div.x-input-content', {}, [this.label])
    ).push(
      hx('div.x-input-extra + x-input-extra-input').push(
        hx(`${this.type === 'textarea' ? 'textarea' : 'input'}.x-input-input`, params)
      )
    )

    return $input
      .push($line)
      .resolve(h)
  }
})

Vue.component('x-input', XInput)