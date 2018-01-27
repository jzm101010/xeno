import {hx} from '../../common/_tools.js'

var XTabbarItem = Vue.extend({
    props: {
        onClick: Function,
        label: String,
        icon:  String,
        badge: [Number, String],
        selected: Boolean,
        activeColor: {
            type: String,
            default: '#4a90e2'
        },
        inactiveColor: {
            type: String,
            default: '#bbb'
        }
    },
    computed: {
        cls () {
            var cls = ['x-tabbar-item']

            if (this.selected) {
                cls.push('x-tabbar-item-active')
            }

            return cls
        },
        
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
        
        var $item = hx(`div.${this.cls.join('+')}`, {
            nativeOn: {
                on: me.clickEvent
            },
            style: {
                color: this.selected ? this.activeColor : this.inactiveColor
            }
        })
        var $icon = hx('x-icon', {
            props: {
                type: this.icon,
            }
        })
        var $label = hx('')

        $item
        .push(
            hx('div.x-tabbar-item-icon').push($icon)
        )
        .push(
            hx('div.x-tabbar-item-label-wrapper').push(
                hx('div.x-tabbar-item-label', {}, [this.label])
            )
        )

        if (this.badge) {
            $item.push(hx('x-badge', {
                props: {
                    value: this.badge
                }
            }))
        }

        return $item.resolve(h)
    }
})

var XTabbar = Vue.extend({
    props: {

    },
    render (h) {
        var me =this

        var $tabbar = hx(`div.x-tabbar`, {}, [this.$slots.default])

        return $tabbar.resolve(h)
    },
    mounted () {
        // console.log(this.$el.getBoundingClientRect())
    }
})

Vue.component('x-tabbar-item', XTabbarItem)
Vue.component('x-tabbar', XTabbar)