import {hx, isdef} from '../../common/_tools.js'
import instance from '../../common/_instance.js'

export var XSearchBar = Vue.extend({
  props: {
    value: [String, Number],
    placeholder: {
      type: String,
      default: '请输入',
    },
    disabled: Boolean,
    maxlength: [Number, String],
    // 是否trim
    trim: Boolean,
    onCancel: Function,
    cancelText: {
      type: String,
      default: '取消'
    }
  },
  computed: {
    cls () {
      var cls = ['x-search']

      if (this.inFocus || (this.value || this.value === 0)) {
        cls.push('x-search-start')
      }

      if (this.disabled) {
        cls.push('x-search-disabled')
      }

      return cls
    },
  },
  data () {
      return {
        params: {},
        inFocus: false
      }
  },
  render (h) {
    var me = this
    
    var $search = hx(`div.${this.cls.join('+')}`)
    var $content = hx('div.x-search-content')
    var $synthetic = hx('div.x-search-synthetic')

    params = {
      domProps: {
        value: isdef(this.value) ? this.value : '',
        type: 'search'
      },
      attrs: {
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
          me.inFocus = true
        },
        blur (e) {
          me.$emit('blur', e)

          if (!(this.value || this.value === 0)) {
            me.inFocus = false
          }

          if (me.trim){
            me.$emit('input', e.target.value.trim())
          }
        },
      },
    }

    $synthetic.push(
      hx('span.x-search-synthetic-content').push(
        hx('x-icon.x-search-synthetic-content-searchIcon', {
          props: {
            type: 'ios-search',
            size: 'xs'
          }
        })
      ).push(
        hx('span.x-search-synthetic-content-placeholder', {
          style: {
            visibility: this.value || this.value === 0 ? 'hidden' : 'visible'
          }
        }, [this.placeholder])
      )
    )

    $content.push(
      $synthetic
    )
    .push(
      hx(`input.x-search-input`, params)
    )

    // if (this.value || this.value === 0) {
    //   $content.push(
    //     hx('x-icon.x-search-clear', {
    //       props: {
    //         type: 'close-circled',
    //         size: 'xxs'
    //       },
    //       nativeOn: {
    //         click: _=> {
    //           me.$emit('input', '')
    //         }
    //       }
    //     })
    //   )
    // }

    return $search
      .push($content)
      .push(
          hx('div.x-search-cancel', {
            on: {
              click: _=> {
                if (me.onCancel) {
                  me.onCancel()
                }
                me.inFocus = false
                me.$emit('input', '')
              }
            }
        }, [this.cancelText])
      )
      .resolve(h)
  }
})

Vue.component('x-searchbar', XSearchBar)