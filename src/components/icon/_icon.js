import {hx} from '../../common/_tools.js'

var XIcon = Vue.extend({
    props: {
        type: String,
        size: {
            type: String,
            default: 'md'
        },
        pxSize: [String, Number],
        color: String,
        autoRotate: Boolean,
        isButton: Boolean
    },
    computed: {
        cls () {
            var cls = []
            cls.push(`ion-${this.type}`)

            if (this.autoRotate){
                cls.push('x-icon-rotate')
            }

            if (this.size) {
                cls.push(`x-icon-${this.size}`)
            }

            if (this.isButton) {
                cls.push('x-icon-button')
            }

            return cls
        },
        style () {
            var style = {}

            if (this.pxSize){
                style['font-size'] = this.pxSize + 'px'
            }
            if (this.color){
                style['color'] = this.color
            }

            return style
        }
    },
    render (h) {
        return hx(`i.x-icon + ${this.cls.join('+')}`, {
            style: this.style
        }).resolve(h)
    }
})

Vue.component('x-icon', XIcon)