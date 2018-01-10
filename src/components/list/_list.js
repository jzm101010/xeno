import {hx} from '../../common/_tools.js'

var XList = Vue.extend({
    props: {
        type: {
            type: String,
            default: 'text'
        },
        isTel: Boolean,
        isTitle: Boolean,
        isLink: Boolean,
        noTopBorder: Boolean,
        noBottomBorder: Boolean,
        rightIcon: String,
        leftIcon: String,
        title: [Number, String],
        value: [Number, String]
    },
    computed: {
        cls () {
            var cls = ['x-list']
            var $leftIconSlot = this.$slots.leftIcon
            var $rightIconSlot = this.$slots.rightIcon

            if (this.leftIcon || $leftIconSlot) {
                cls.push('x-list-hasIcon-left')
            }

            if (this.rightIcon || this.isLink || $leftIconSlot) {
                cls.push('x-list-hasIcon-right')
            }

            if (this.isTitle) {
                cls.push('x-list-title')
            }

            return cls
        },
        valueCls () {
            var cls = []

            if (this.type == 'textarea') {
                cls.push('x-list-textarea')
            }

            if (this.isTel) {
                cls.push('x-list-tel')
            }

            return cls
        },
        telValue () {
            if (this.value) {
                return this.isTel && this.type == 'textarea' ? this.value.split('\n')[1] : this.value
            }
        }
    },
    render (h) {
        var me = this
        var $leftIconSlot = this.$slots.leftIcon
        var $rightIconSlot = this.$slots.rightIcon

        var $list = hx(`div.${this.cls.join('+')}`)

        if (!this.noBottomBorder) {
            $list.push(
                hx('div.hairline-bottom')
            )
        }

        if (!this.noTopBorder) {
            $list.push(
                hx('div.hairline-top')
            )
        }

        $list.push(
            hx('span.x-list-text', {}, [this.title])
        )

        $list.push(
            hx(`span.x-list-value + ${this.valueCls.join('+')}`, {}, [this.value])
        )

        if (this.isTel) {
            $list.push(
                hx('a.x-list-mask-tel', {attrs: {href: 'tel:' + this.telValue}})
            )
        } else {
            $list.push(
                hx('span.x-list-mask')
            )
        }

        if (this.leftIcon) {
            $list.push(
                hx(`div.x-list-icon + x-list-icon-left`).push(
                    hx(`x-icon`, {
                        props: {
                            type: this.leftIcon
                        }
                    })
                )
            )
        }else if ($leftIconSlot) {
            $list.push(
                hx(`div.x-list-icon + x-list-icon-left`, {}, [$leftIconSlot])
            )
        }

        if (this.rightIcon && !this.isLink) {
            $list.push(
                hx(`div.x-list-icon + x-list-icon-right`).push(
                    hx(`x-icon`, {
                        props: {
                            type: this.rightIcon
                        }
                    })
                )
            )
        }else if (this.isLink) {
            $list.push(
                hx(`div.x-list-icon + x-list-icon-right`).push(
                    hx(`x-icon`, {
                        props: {
                            type: 'ios-arrow-right'
                        },
                        style: {
                            color: '#ddd'
                        }
                    })
                )
            )
        }else if($rightIconSlot) {
            $list.push(
                hx(`div.x-list-icon + x-list-icon-right`, {}, [$rightIconSlot])
            )
        }

        
        
        return $list.resolve(h)
    }
})

Vue.component('x-list', XList)