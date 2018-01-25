import {hx} from '../../common/_tools.js'

var XList = Vue.extend({
    props: {
        type: {
            type: String,
            default: 'text'
        },
        align: {
            type: String,
            default: 'center'
        },
        isTel: Boolean,
        isTitle: Boolean,
        isLink: Boolean,
        borderTop: {
            type: Boolean,
            default: true,
        },
        borderBottom: {
            type: Boolean,
            default: true,
        },
        lineBorder: Boolean,
        rightIcon: String,
        leftIcon: String,
        onClick: Function,
        title: [Number, String],
        subTitle: [Number, String],
        value: [Number, String],
    },
    computed: {
        cls () {
            var cls = ['x-list']

            if (this.isTitle) {
                cls.push('x-list-title')
            }

            return cls
        },
        lineCls () {
            var cls = ['x-list-line', `x-list-line-${this.align}`]

            if (this.subTitle || +this.subTitle === 0) {
                cls.push('x-list-line-multiple')
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
    methods: {
        clickEvent () {
            if (this.onClick) {
                this.onClick()
            }
        }
    },
    render (h) {
        var me = this
        var $leftIconSlot = this.$slots.leftIcon
        var $rightIconSlot = this.$slots.rightIcon
        var $line = hx(`div.${this.lineCls.join('+')}`)
        var $content = hx(`div.x-list-content`, {}, [this.title])
        if (this.isLink) {
            var $list = hx(`div.${this.cls.join('+')}`, {
                directives: [
                    {
                      name: 'fb',
                      value: {cls: 'x-list-active'}
                    }
                ],
                on: {
                    click: this.clickEvent
                }
            })
        }else {
            var $list = hx(`div.${this.cls.join('+')}`, {
                on: {
                    click: this.clickEvent
                }
            })
        }
        
        

        if (this.borderBottom && !this.lineBorder) {
            $list.push(
                hx('div.hairline-bottom')
            )
        }

        if (this.borderTop && !this.lineBorder) {
            $list.push(
                hx('div.hairline-top')
            )
        }else if (this.lineBorder) {
            $line.push(
                hx('div.hairline-top')
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

        if (this.subTitle || +this.subTitle === 0) {
            $content.push(
                hx(`div.x-list-subTitle`, {}, [this.subTitle])
            )
                
        }

        $line.push(
            $content
        ).push(
            hx('div.x-list-extra').push(
                hx(`span.x-list-value + ${this.valueCls.join('+')}`, {}, [this.value])
            )
        )

        if (this.rightIcon && !this.isLink) {
            $line.push(
                hx(`div.x-list-icon + x-list-icon-right`).push(
                    hx(`x-icon`, {
                        props: {
                            type: this.rightIcon
                        }
                    })
                )
            )
        }else if (this.isLink) {
            $line.push(
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
            $line.push(
                hx(`div.x-list-icon + x-list-icon-right`, {}, [$rightIconSlot])
            )
        }

        $list.push($line)

        if (this.isTel) {
            $list.push(
                hx('a.x-list-mask-tel', {attrs: {href: 'tel:' + this.telValue}})
            )
        } else {
            $list.push(
                hx('span.x-list-mask')
            )
        }

        

        

        
        
        return $list.resolve(h)
    }
})

var XListGroup = Vue.extend({
    props: {
        header: [String, Number]
    },
    render (h) {
        var me = this
        var $group = hx(`div.x-list-group`)
        var $header = hx(`div.x-list-group-header`, {}, [this.header])
        var $body = hx(`div.x-list-group-body`, {}, [this.$slots.default]).push(hx('div.hairline-top')).push(hx('div.hairline-bottom'))

        return $group.push($header).push($body).resolve(h)
    }
})

Vue.component('x-list', XList)
Vue.component('x-list-group', XListGroup)