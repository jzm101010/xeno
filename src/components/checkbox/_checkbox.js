import {isArray, inArray, hx} from '../../common/_tools.js'
import instance from '../../common/_instance.js'
import { XFormItem } from '../form/_form'

var XCheckbox = Vue.extend({
    model: {
        prop: 'checkedValue',
        event: 'input',
    },
    props: {
        checkedValue: [String, Number, Boolean, Array],
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
            var cls = ['x-checkbox']
            
            if (this.checked){
                cls.push('x-checkbox-checked')
            }
            
            if (this.disabled){
                cls.push('x-checkbox-disabled')
            }
    
            return cls
        },
        isGroupParent () {
            return this.$parent instanceof XCheckboxGroup
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
            // return false
            return instance.getParent(this, XFormItem)
        },
    },
    methods: {
        _setCheckedValue () {
            var checkedValue
      
        if (isArray(this.realCheckedValue)){
              checkedValue = this.realCheckedValue
      
              if (this.checked){
                    var idx = checkedValue.indexOf(this.value)
                    checkedValue.splice(idx, 1)
              }else {
                    checkedValue.push(this.value)
              }
            }
            else {
                if (this.checked){
                    checkedValue = ''
                }else {
                    checkedValue = this.value
                }
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

        var $checkbox = hx(`div.${this.cls.join('+')}`)

        $checkbox.push(
            hx('x-list', {
                props: {
                    title: this.label,
                    subTitle: this.subLabel,
                    leftIcon: this.checked ? 'ios-checkmark' : 'ios-circle-outline',
                    lineBorder: this.isGroupParent,
                    onClick: me.clickEvent
                }
            })
        )

        return $checkbox.resolve(h)
    }
})

var XCheckboxGroup = Vue.extend({
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
            var cls = ['x-checkbox-group']
            return cls
        },
    },
    render (h) {
        var $group = hx(`div.x-checkbox-group`)
        var $header = hx(`div.x-checkbox-group-header`, {}, [this.header])
        var $body = hx(`div.x-checkbox-group-body`, {}, [this.$slots.default]).push(hx('div.hairline-top')).push(hx('div.hairline-bottom'))
    
        return $group.push($header).push($body).resolve(h)
    }
})

// var XListGroup = Vue.extend({
//     props: {
//         header: [String, Number]
//     },
//     render (h) {
//         var me = this
//         var $group = hx(`div.x-list-group`)
//         var $header = hx(`div.x-list-group-header`, {}, [this.header])
//         var $body = hx(`div.x-list-group-body`, {}, [this.$slots.default]).push(hx('div.hairline-top')).push(hx('div.hairline-bottom'))

//         return $group.push($header).push($body).resolve(h)
//     }
// })

Vue.component('x-checkbox', XCheckbox)
Vue.component('x-checkbox-group', XCheckboxGroup)