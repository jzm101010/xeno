import {hx} from '../../common/_tools.js'

var XPicker = Vue.extend({
    props: {
        value: Boolean,
        data: Array,
        title: String,
        disable: Boolean,

        onConfirm: {
            type: Function,
            default: _ => {
                console.log('confirm')
            }
        },
        onCancel: {
            type: Function,
            default: _ => {
                console.log('cancel')
            }
        },
        onChange: {
            type: Function,
            default: _ => {
                console.log('value change')
            }
        },
    },
    computed: {
        cls () {
            
        },
    },
    data () {
        return {
            pickerId: Math.random().toString(36).substring(2),
            timerDelay: false
        }
    },
    methods: {
        getContent () {
            var me = this

            var $content = hx(`div.x-picker`)
            var $header = hx(`div.x-picker-header`)
            var $main = hx(`div.x-picker-main`)
            var $col = hx(`div.x-picker-col`)
            var $scroller = hx(`x-scroller`, {
                props: {
                    easyMode: true,
                    animationDuration: 1,
                    ref: 'scroller'
                }
            })


            this.data.map(item => {
                $scroller.push(hx(`div.x-picker-col-item`, {}, [item]))
            })

            $header
            .push(
                hx(`div.x-picker-header-left + x-picker-header-item`, {
                    on: {
                        click: this.onCancel
                    }
                }, ['取消'])
            )
            .push(hx(`div.x-picker-header-title + x-picker-header-item`, {}, [this.title]))
            .push(
                hx(`div.x-picker-header-right + x-picker-header-item`, {
                    on: {
                        click: this.onConfirm
                    }
                }, ['确定'])
            )
            .push(hx(`div.hairline-bottom`))

            $col
            .push(hx(`div.x-picker-col-mask`))
            .push(hx(`div.x-picker-col-indicator`))
            .push($scroller)

            $main.push($col)

            return $content.push($header).push($main)

        }
    },
    render (h) {
        var me = this
        
        var $container = hx(`div.x-picker-container + ${this.pickerId}`)
        
        $container
        .push(
            hx(`div.x-picker-mask`, {
                on: {
                    click: this.onCancel
                },
            })
        )
        .push(
            hx(`div.x-picker`).push(this.getContent())
        )
        
        return this.value ? $container.resolve(h) : false
        // return this.getContent().resolve(h)

    },
    mounted () {
    },
    destroyed () {
    }     
})

Vue.component('x-picker', XPicker)