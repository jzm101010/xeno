import {hx} from '../../common/_tools.js'

var XHeader = Vue.extend({
    props: {
        title: [String, Number],
        onLeftClick: Function,
        onRightClick: Function,

        type: {
            type: String,
            default: 'white'
        }
    },
    computed: {
        cls () {
            
        },
        
    },
    render (h) {
        var me = this

        var $header = hx(`div.x-header + x-header-${this.type}`)

        if (this.type === 'white') {
            $header.push(hx(`div.hairline-bottom`))
        }
        if (me.onLeftClick) {
            $header.push(
                hx(`div.x-header-left`, {on: {click () {me.onLeftClick()}}}, [this.$slots.headerLeft])
            )
        }else {
            $header.push(
                hx(`div.x-header-left`, {}, [this.$slots.headerLeft])
            )
        }
        

        $header.push(
            hx(`div.x-header-title`, {}, [this.title])
        )

        if (me.onRightClick) {
            $header.push(
                hx(`div.x-header-right`, {on: {click () {me.onRightClick()}}}, [this.$slots.headerRight])
            )
        }else {
            $header.push(
                hx(`div.x-header-right`, {}, [this.$slots.headerRight])
            )
        }

        

        return $header.resolve(h)
    }
})

Vue.component('x-header', XHeader)