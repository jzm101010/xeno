import {hx} from '../../common/_tools.js'

var XPagination = Vue.extend({
    props: {
        value: Number,
        total: {
            type: Number,
            default: 0
        },
        pageSize: {
            type: Number,
            default: 10
        },
        mode: {                             // normal, button, number
            type: String,
            default: 'normal'
        },
        buttonText: {
            type: Array,
            default: _ => {
                return ['prev', 'next']
            }
        }
    },
    computed: {
        cls () {
            
        },
        pageCount () {
            return parseInt((this.total + this.pageSize - 1) / this.pageSize)
        }
    },
    methods: {
        goPrev () {
            var v = this.value
            this.$emit('input', --v)
            this.$emit('change', --v)
        },
        goNext () {
            var v = this.value
            this.$emit('input', ++v)
            this.$emit('change', ++v)
        },
    },
    render (h) {
        var me = this

        var $page = hx(`div.x-page`)
        var $prev = hx(`div.x-page-wrap + x-page-prev`).push(hx(`x-button`, {
            props: {
                disabled: this.value <= 1
            },
            nativeOn: {
                click: this.goPrev
            }
        }, [this.buttonText[0]]))
        var $next = hx(`div.x-page-wrap + x-page-next`).push(hx(`x-button`, {
            props: {
                disabled: this.value >= this.pageCount
            },
            nativeOn: {
                click: this.goNext
            }
        }, [this.buttonText[1]]))
        var $pagination = hx(`div.x-page-wrap + x-page-pagination`).push(
            hx(`span.active`, {}, [this.value])
        ).push(
            hx(`span`, {}, ['/' + this.pageCount])
        )

        if (this.mode != 'number') {
            $page.push($prev)
        }

        if (this.mode != 'button') {
            $page.push($pagination)
        }

        if (this.mode != 'number') {
            $page.push($next)
        }

        return $page.resolve(h)
    }
})

Vue.component('x-page', XPagination)