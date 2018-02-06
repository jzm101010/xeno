import {hx} from '../../common/_tools.js'
import instance from '../../common/_instance.js'
import { XFormItem } from '../form/_form'

var XSelect = Vue.extend({
    props: {
        value: [String, Number, Array],
        options: Array,
        disabled: Boolean,
        cascader: Boolean,
        placeholder: {
            type: String,
            default: '请选择'
        },
        title: {
            type: String,
            default: 'select'
        },
        pickerTitle: String
    },
    computed: {
        cls () {
            var cls = ['x-select']

            if (this.disabled) {
                cls.push('x-select-disabled')
            }

            return cls
        },
        formItem () {
            return instance.getParent(this, XFormItem)
        }
    },
    data () {
        return {
            selectVal: undefined,
            selectTitle: undefined,
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
            this.selectTitle = undefined
            this.selectVal = undefined
            title.map(str => {
                if(this.selectTitle === undefined) {
                    this.selectTitle = str
                }else {
                    this.selectTitle += ', ' + str
                }
            })
            
            this.selectVal = value.length > 1 ? value : value[0]
            this.$emit('input', this.selectVal)
        }
    },
    render (h) {
        var me = this

        var $select = hx(`div.${this.cls.join('+')}`)
        var $picker = hx(`x-picker`, {
            props: {
                data: this.options,
                cascader: this.cascader,
                value: this.pickerShow,
                title: this.pickerTitle
            },
            on: {
                confirm: this.selectConfirm,
                input: this.pickerShowChange
            }
        })
        
        $select
        .push(
            hx(`x-list`, {
                props: {
                    title: this.title,
                    value: this.selectTitle === undefined ? this.placeholder : this.selectTitle,
                    isLink: true,
                    borderBottom: this.formItem ? false : true
                },
                nativeOn: {
                    click: this.pickerShowChange
                }
            })
        )
        .push($picker)

        return $select.resolve(h)
    }
})

Vue.component('x-select', XSelect)