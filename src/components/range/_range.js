import {isArray, hx} from '../../common/_tools.js'

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
        dot: Boolean,
        degree: Object,
        disabled: Boolean,
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
        cls () {
            var cls = ['x-range']

            if (this.disabled) {
                cls.push('x-range-disabled')
            }

            return cls
        },
        degreeList () {
            var arr = []

            if (this.degree) {
                for(let key in this.degree) {
                    let obj = {
                        left: (this.degree[key] * this.rangeStep) / this.step,
                        title: key,
                        value: this.degree[key]
                    }
                    arr.push(obj)
                }
            }

            return arr
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

            if (isArray(this.value)) {
                obj.left = this.button_leftPos < this.button_rightPos ? this.button_leftPos : this.button_rightPos
                obj.width = Math.abs(this.button_rightPos - this.button_leftPos)
            } else {
                obj.width = this.button_leftPos
            }

            return obj
        }
    },
    methods: {
        setUp () {
            if (isArray(this.value)) {
                this.button_leftPos = (this.value[0] * this.rangeStep) / this.step
                this.button_rightPos = (this.value[1] * this.rangeStep) / this.step
            }else {
                this.button_leftPos = (this.value * this.rangeStep) / this.step
            }
        },
        touchStart (e) {
            if (this.disabled) {
                return 
            }

            this.diff = e.touches[0].pageX - this.lineRect.width;
            if (e.target.className.indexOf('left') !== -1) {
                this.alreadyStep = Math.ceil(this.button_leftPos / this.rangeStep)
            } else if (e.target.className.indexOf('right') !== -1) {
                this.alreadyStep = Math.ceil(this.button_rightPos / this.rangeStep)
            }
        },
        touchMove (e) {
            e.preventDefault()

            if (this.disabled) {
                return 
            }

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

            if (this.dot && this.degreeList.length) {
                let flag = false

                this.degreeList.map(item => {
                    if (Math.ceil(change) == Math.ceil(item.left)) {
                        flag = true
                    }
                })

                if (!flag) {
                    return
                }
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
            if (this.disabled) {
                return 
            }

            var value = this.value
            if (isArray(value) && value[0] > value[1]) {
                [value[0], value[1]] = [value[1], value[0]];
                [this.button_leftPos, this.button_rightPos] = [this.button_rightPos, this.button_leftPos]
                this.$emit('input', value)
            }
        },
        changeValue (step, target) {
            var value = this.value
            var index = target == 'left' ? 0 : 1
            if (isArray(value)) {
                value[index] = step * this.step
            } else {
                value = step * this.step
            }
            
            this.$emit('input', value)
        }  
    },
    render (h) {
        var me = this

        var $range = hx(`div.${this.cls.join('+')}`)
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

        if (this.degreeList.length) {
            this.degreeList.map(item => {
                let active = false
                let bias = item.value < 10 ? 1 : 2

                if (isArray(this.value)) {
                    active = this.value[0] <= item.value && item.value <= this.value[1] ? true : false
                } else {
                    active = this.value == item.value
                }

                $degrees.push(
                    hx(`div.x-range-degree + ${active ? 'x-range-degree-active' : ''}`, {
                        style: {
                            left: (item.left - bias) + '%',
                        }
                    }, [item.title])
                )
            })

            $range.push($degrees)
        }

        $lineBox
        .push(hx(`div.x-range-line`))
        .push(hx(`div.x-range-line-active`, {
            style: {
                left: this.activeLine.left + '%',
                width: this.activeLine.width + '%'
            }
        }))
        .push($button1)

        if (isArray(this.value)) {
            $lineBox.push($button2)
        }


        $range.push($lineBox)
        return $range.resolve(h)
    },
    mounted () {
        this.setUp()
    }
})

Vue.component('x-range', XRange)