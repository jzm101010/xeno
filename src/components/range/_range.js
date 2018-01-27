import {isArray, inArray, hx, swap} from '../../common/_tools.js'

var XRange = Vue.extend({
    props: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        step: {
            type: Number,
            default: 1
        },
        degree: Array,
        unlimited: String,
        value: [Number, String, Array]
    },
    data () {
        return {
            diff: 0,
            button_leftPos: 0,
            button_rightPos: 0,
            alreadyStep: 0,
            button1_cls: 'left',
            button2_cls: 'right',
            innerValue: [0, 0]
        }
    },
    computed: {
        degreeList () {
            var arr = []

            if (this.degree) {
                arr.concat(this.degree)

                if (this.unlimited) {
                    arr.push(this.unlimited)
                }
            }

            return arr.map(item => {
                return {
                    left: 0,
                    text: item
                }
            })

        },
        lineRect () {
            var rect = {}

            if (this.$el) {
                rect = this.$el.getBoundingClientRect()
            }

            return rect
        },
        rangeStep () {
            return (this.step / (this.max - this.min)) * 100
        },
        rangeStepWidth () {
            return (this.lineRect.width) / ((this.max - this.min) / this.step)
        },
        activeLine () {
            var obj = {
                left: 0,
                width: 0
            }

            obj.left = this.button_leftPos < this.button_rightPos ? this.button_leftPos : this.button_rightPos
            obj.width = Math.abs(this.button_rightPos - this.button_leftPos)

            return obj
        }
    },
    methods: {
        setUp () {

        },
        touchStart (e) {
            this.diff = e.touches[0].pageX - this.lineRect.width;
            if (e.target.className.indexOf('left') !== -1) {
                this.alreadyStep = Math.ceil(this.button_leftPos / this.rangeStep)
            } else if (e.target.className.indexOf('right') !== -1) {
                this.alreadyStep = Math.ceil(this.button_rightPos / this.rangeStep)
            }
        },
        touchMove (e) {
            e.preventDefault()

            var left = e.touches[0].pageX - this.lineRect.width - this.diff;
            var changeStep = Math.ceil(left / this.rangeStepWidth)  + this.alreadyStep
            var change = changeStep * this.rangeStep
            if (change >= 100) {
                change = 100
                changeStep = (this.max - this.min) / this.step
            } else if (change<=0) {
                change = 0
                changeStep = 0
            }

            if (e.target.className.indexOf('left') !== -1) {
                this.button_leftPos = change
                this.changeValue(changeStep, 'left')
            } else if (e.target.className.indexOf('right') !== -1) {
                this.button_rightPos = change
                this.changeValue(changeStep, 'right')
            }
        },
        touchEnd (e) {
            var value = this.value
            if (value[0] > value[1]) {
                [value[0], value[1]] = [value[1], value[0]];
                [this.button_leftPos, this.button_rightPos] = [this.button_rightPos, this.button_leftPos]
                this.$emit('input', value)
            }
        },
        changeValue (step, target) {
            var value = this.value
            var index = target == 'left' ? 0 : 1
            value[index] = step * this.step
            this.$emit('input', value)
        }  
    },
    render (h) {
        var me = this

        var $range = hx(`div.x-range`)
        var $degrees = hx(`div.x-range-degree-group`)
        var $lineBox = hx(`div.x-range-line-box`)
        var $button1 = hx(`div.x-range-button + x-range-button-left`, {
            style: {
                left: this[`button_leftPos`] + '%'
            },
            on: {
                touchstart: this.touchStart,
                touchmove: this.touchMove,
                touchend: this.touchEnd
            }
        })
        var $button2 = hx(`div.x-range-button + x-range-button-right`, {
            style: {
                left: this[`button_rightPos`] + '%'
            },
            on: {
                touchstart: this.touchStart,
                touchmove: this.touchMove,
                touchend: this.touchEnd
            }
        })

        $lineBox
        .push(hx(`div.x-range-line`))
        .push(hx(`div.x-range-line-active`, {
            style: {
                left: this.activeLine.left + '%',
                width: this.activeLine.width + '%'
            }
        }))
        .push($button1)
        .push($button2)

        $range.push($degrees).push($lineBox)
        return $range.resolve(h)
    }
})

Vue.component('x-range', XRange)