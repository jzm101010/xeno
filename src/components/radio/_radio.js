import {isArray, inArray, hx} from '../../common/_tools.js'
import instance from '../../common/_instance.js'
// import { RFormItem } from '../form/_form'

var XRadio = Vue.extend({
    model: {
        prop: 'checkedValue',
        event: 'input',
    },
    props: {
        checkedValue: [String, Number, Boolean],
        value: {
            type: [String, Number, Boolean],
            default: true,
        },
        label: [String, Number],
        subLabel: [String, Number],
        indeterminate: Boolean,
        disabled: Boolean,
    },
    computed: {
        cls () {
            var cls = ['x-radio']
            
            if (this.checked){
                cls.push('x-radio-checked')
            }
            
            if (this.disabled){
                cls.push('x-radio-disabled')
            }
    
            return cls
        },
        isGroupParent () {
            return this.$parent instanceof XRadioGroup
          },
        realCheckedValue () {
            var checkedValue = this.checkedValue
        
            if (this.isGroupParent){
                checkedValue = this.$parent.checkedValue
            }
        
            return checkedValue
        },
        checked () {
            if (isArray(this.realCheckedValue)){
                return inArray(this.value, this.realCheckedValue)
            }else {
                return (this.value === this.realCheckedValue) || (this.realCheckedValue === true)
            }
        },
        formItem () {
            return false
            // return instance.getParent(this, RFormItem)
        },
    },
    methods: {
        _setCheckedValue () {
            var checkedValue
      
            if (this.checked){
                checkedValue = ''
            }else {
                checkedValue = this.value
            }
      
            if (this.isGroupParent){
              this.$parent.$emit('input', checkedValue)
            }else {
              this.$emit('input', checkedValue)
            }
        },
        clickEvent () {
            if (this.disabled) {
                return
            }

            this._setCheckedValue()

            if (this.formItem) {
                this.formItem.validate()
            }
        }
    },
    render (h) {
        var me = this

        var $radio = hx(`div.${this.cls.join('+')}`)

        $radio.push(
            hx('x-list', {
                props: {
                    title: this.label,
                    subTitle: this.subLabel,
                    rightIcon: this.checked ? 'checkmark-round' : '',
                    lineBorder: this.isGroupParent,
                    onClick: me.clickEvent
                }
            })
        )

        return $radio.resolve(h)
    }
})

var XRadioGroup = Vue.extend({
    model: {
        prop: 'checkedValue',
        event: 'input',
    },
    props: {
        checkedValue: [String, Number, Array],
        header: [String, Number]
    },
    computed: {
        cls () {
            var cls = ['x-radio-group']
            return cls
        },
    },
    render (h) {
        var $group = hx(`div.x-radio-group`)
        var $header = hx(`div.x-radio-group-header`, {}, [this.header])
        var $body = hx(`div.x-radio-group-body`, {}, [this.$slots.default]).push(hx('div.hairline-top')).push(hx('div.hairline-bottom'))

        if (this.header) {
            $group.push($header)
        }
    
        return $group.push($body).resolve(h)
    }
})

Vue.component('x-radio', XRadio)
Vue.component('x-radio-group', XRadioGroup)