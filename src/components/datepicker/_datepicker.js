import {hx, paddingZero} from '../../common/_tools.js'
import instance from '../../common/_instance.js'
import { XFormItem } from '../form/_form'

var XDatepicker = Vue.extend({
    props: {
        value: [String, Number, Array],
        disabled: Boolean,
        type: {
            type: String,
            default: 'date'
        },
        format: {                   // a: yyyy-MM-dd
            type: String,           // b: yyyy/MM/dd
            default: 'a',
        },
        title: {
            type: String,
            default: 'datepicker'
        },
        placeholder: {
            type: String,
            default: '请选择'
        },
    },
    computed: {
        cls () {
            var cls = ['x-datepicker']

            if (this.disabled) {
                cls.push('x-datepicker-disabled')
            }

            return cls
        },
        formItem () {
            return instance.getParent(this, XFormItem)
        }
    },
    data () {
        return {
            select: undefined,
            pickerShow: false
        }
    },
    watch: {
        value () {
            if (this.formItem) {
                this.formItem.validate()
            }
        }
    },
    methods: {
        pickerShowChange () {
            if (this.disabled) {
                return
            }
            this.pickerShow = !this.pickerShow
        },
        selectConfirm (title, value) {
            this.select = undefined
            title.map((item, index) => {
                item = paddingZero(item, 2)
                let split = this.format == 'a' ? '-' : '/'
                split = this.type == 'time' || index > 2 ? ':' : split
                if(this.select === undefined) {
                    this.select = item
                }else if (index == 3) {
                    this.select += '  ' +  item
                }else {
                    this.select += split + item
                }
            })
            this.$emit('input', this.select)
        }
    },
    render (h) {
        var me = this

        var $datepicker = hx(`div.${this.cls.join('+')}`)
        var $picker = hx(`x-picker`, {
            props: {
                value: this.pickerShow,
                datepicker: true,
                datepickerType: this.type
            },
            on: {
                confirm: this.selectConfirm,
                input: this.pickerShowChange
            }
        })
        
        $datepicker
        .push(
            hx(`x-list`, {
                props: {
                    title: this.title,
                    value: this.select === undefined ? this.placeholder : this.select,
                    isLink: true,
                    borderBottom: this.formItem ? false : true
                },
                nativeOn: {
                    click: this.pickerShowChange
                }
            })
        )
        .push($picker)

        return $datepicker.resolve(h)
    }
})

Vue.component('x-datepicker', XDatepicker)