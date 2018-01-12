import {hx} from '../../common/_tools.js'
import '../../common/_better-scroll.js'

var XSroller = Vue.extend({
    props: {
        scrollX: Boolean,
        scrollY: {
            type: Boolean,
            default: true
        },
        freeScroll: Boolean,
        eventPassthrough: String,
        click: {
            type: Boolean,
            default: true
        },
        tap: {
            type: [Boolean, String],
            default: false
        },
        bounce: Boolean,
        momentum: {
            type: Boolean,
            default: true
        },
        probeType: {
            type: Number,
            default: 0
        },
        refreshDelay: {
            type: Number,
            default: 20
        },
        data: {
            type: Array,
            default: null
        },
        bindToWrapper: Boolean,
        listenScroll: Boolean,
        pullup: Boolean,
        pulldown: Boolean,
        beforeScroll: Boolean,

    },
    computed: {
        
    },
    watch: {
        data () {
            setTimeout(_ => {
                this.refresh()
            }, this.refreshDelay)
        }
    },
    data () {
        return {
            containerId: Math.random().toString(36).substring(2),
            contentId: Math.random().toString(36).substring(2),
        }
    },
    methods: {
        _initScroll () {
            this.container = document.getElementsByClassName(`scroll-container-${this.containerId}`)[0]

            if (!this.container) {
                return
            }

            this.scroll = new BScroll(this.container, {
                probeType: this.probeType,
                scrollX: this.scrollX,
                scrollY: this.scrollY,
                freeScroll: this.freeScroll,
                eventPassthrough: this.eventPassthrough,
                click: this.click,
                tap: this.tap,
                bounce: this.bounce,
                momentum: this.momentum,
                refreshDelay: this.refreshDelay,
                bindToWrapper: this.bindToWrapper
            })

            if (this.listenScroll) {
                this.scroll.on('scroll', pos => {
                    this.$emit('scroll', pos)
                })
            }

            if (this.pullup) {
                this.scroll.pn('scrollEnd', _ => {
                    if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                        this.$emit('scrollToEnd')
                    }
                })
            }

            if (this.pulldown) {
                this.scroll.on('touchend', pos => {
                    if (pos.y > 50) {
                        this.$emit('pulldown')
                    }
                })
            }

            if (this.beforeScroll) {
                this.scroll.on('beforeScrollStart', _ => {
                    this.$emit('beforeScroll')
                })
            }
        },
        disable() {
            this.scroll && this.scroll.disable()
        },
        enable() {
            this.scroll && this.scroll.enable()
        },
        refresh() {
            this.scroll && this.scroll.refresh()
        },
        scrollTo() {
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement() {
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        }
    },
    render (h) {
        var me = this

        var $container = hx(`div.x-scroll + scroll-container-${this.containerId}`)
        var $content = hx(`div.x-scroll-content`, {}, [this.$slots.default])
        
        return $container.push($content).resolve(h)
    },
    mounted () {
        setTimeout(() => {
            this._initScroll()
        }, 20)
    },
    destroyed () {
    }     
})

Vue.component('x-scroller', XSroller)