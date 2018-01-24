import {hx} from '../../common/_tools.js'

const item_height = 34

const refList = ['picker_scroller_0', 'picker_scroller_1', 'picker_scroller_2', 'picker_scroller_3', 'picker_scroller_4']
const dateUnit = {year: '年', month: '月', day: '日', hour: '时', minute: '分'}

var XPicker = Vue.extend({
    props: {
        value: Boolean,
        data: Array,
        title: String,
        disable: Boolean,
        cascader: Boolean,
        datepicker: Boolean,
        datepickerType: {
            type: String,
            default: 'date'
        },
        onChange: {
            type: Function,
            default: _ => {
                console.log('value change')
            }
        },
    },
    computed: {
        datamap () {
            var arr = []

            if (this.datepicker) {
                switch (this.datepickerType) {
                    case 'date':
                        arr = [this.yearCol, this.monthCol, this.dayCol]
                        break;
                    case 'datetime':
                        arr = [this.yearCol, this.monthCol, this.dayCol, this.hourCol, this.minuteCol]
                        break;
                    case 'time':
                        arr = [this.hourCol, this.minuteCol]
                        break;
                    default:
                        break;
                }
            } else {
                arr = this.data.map(_ => {return _})
            }

            return arr
        },
        dateList () {
            var arr = []

            if (this.datepicker) {
                switch (this.datepickerType) {
                    case 'date':
                        arr = ['year', 'month', 'day']
                        break;
                    case 'datetime':
                        arr = ['year', 'month', 'day', 'hour', 'minute']
                        break;
                    case 'time':
                        arr = ['hour', 'minute']
                        break;
                    default:
                        break;
                }
            }

            return arr
        },
        todayList () {
            var arr = []
            
            if (this.datepicker) {
                switch (this.datepickerType) {
                    case 'date':
                        arr = [this.today.getFullYear(), this.today.getMonth() + 1, this.today.getDate()]
                        break;
                    case 'datetime':
                        arr = [this.today.getFullYear(), this.today.getMonth() + 1, this.today.getDate(), this.today.getHours(), this.today.getMinutes()]
                        break;
                    case 'time':
                        arr = [this.today.getHours(), this.today.getMinutes()]
                        break;
                    default:
                        break;
                }
            }

            return arr
        },
        yearCol () {
            var years = []
            if (this.datepicker && this.datepickerType != 'time') {
                var range = this.today.getFullYear() - 1975
                var start = this.today.getFullYear() - range
                var end = this.today.getFullYear() + range
                for (let index = start; index <= end; index++) {
                    years.push(index)
                }
            }
            
            return years
        },
        monthCol () {
            var month = []

            if (this.datepicker && this.datepickerType != 'time') {
                for (let index = 1; index <= 12; index++) {
                    month.push(index)
                }
            }

            return month
        },
        dayCol () {
            var day = []
            

            if (this.datepicker && this.datepickerType != 'time') {
                if(this.firstWatch) {
                    day = this.getDayArr(this.todayList[1], this.todayList[0])
                }else {
                    day = this.getDayArr(this.monthCol[this.pickerIndex[1]], this.yearCol[this.pickerIndex[0]])
                }
                
            }

            return day
        },
        hourCol () {
            var hour = []

            if (this.datepicker && this.datepickerType != 'date') {
                for (let index = 0; index <= 23; index++) {
                    hour.push(index)
                }
            }

            return hour
        },
        minuteCol () {
            var minute = []

            if (this.datepicker && this.datepickerType != 'date') {
                for (let index = 1; index <= 60; index++) {
                    minute.push(index)
                }
            }

            return minute
        },
        cascaderCol_0Title () {
            var flag = false
            var arr = []

            this.data[0].map(item => {
                if (typeof item == 'object') {
                    flag = true
                }
                arr.push(item.label)
            })

            return flag ? arr : ['暂无数据']
        },
        cascaderCol_0Value () {
            var flag = false
            var arr = []

            this.data[0].map(item => {
                if (typeof item == 'object') {
                    flag = true
                }
                arr.push(item.value)
            })

            return flag ? arr : ['']
        },
        cascaderCol_1Title () {
            var flag = false
            var arr = []

            if (this.data[1]) {
                this.data[1].map(item => {
                    if (!this.cascader || item.parentId == this.cascaderCol_0Value[this.pickerIndex[0]]) {
                        flag = true
                        arr.push(item.label)
                    }
                })
            }

            return flag ? arr : ['暂无数据']
        },
        cascaderCol_1Value () {
            var flag = false
            var arr = []

            if (this.data[1]) {
                this.data[1].map(item => {
                    if (!this.cascader || item.parentId == this.cascaderCol_0Value[this.pickerIndex[0]]) {
                        flag = true
                        arr.push(item.value)
                    }
                })
            }

            return flag ? arr : ['']
        },
        cascaderCol_2Title () {
            var flag = false
            var arr = []

            if (this.data[2]) {
                this.data[2].map(item => {
                    if(!this.cascader || item.parentId == this.cascaderCol_1Value[this.pickerIndex[1]]) {
                        flag = true
                        arr.push(item.label)
                    }
                })
            }

            return flag ? arr : ['暂无数据']
        },
        cascaderCol_2Value () {
            var flag = false
            var arr = []

            if (this.data[2]) {
                this.data[2].map(item => {
                    if(!this.cascader || item.parentId == this.cascaderCol_1Value[this.pickerIndex[1]]) {
                        flag = true
                        arr.push(item.value)
                    }
                })
            }

            return flag ? arr : ['']
        },
    },
    data () {
        return {
            pickerId: Math.random().toString(36).substring(2),
            timerDelay: false,
            timer: undefined,
            firstWatch: true,
            pickerPos: undefined,
            pickerIndex: [],
            chooseVal: [],
            chooseTitle: [],
            today: new Date(),
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.firstWatch = true
                setTimeout(_=> {
                    this.updatePicker()
                }, 100)
            }
        }
    },
    methods: {
        onConfirm () {
            this.chooseVal = []
            this.chooseTitle = []
            this.pickerIndex.map((item, index) => {
                if (this.datepicker) {
                    this.chooseTitle.push(this[`${this.dateList[index]}Col`][item])
                } else {
                    this.chooseVal.push(this[`cascaderCol_${index}Value`][item])
                    this.chooseTitle.push(this[`cascaderCol_${index}Title`][item])
                }
                
            })
            this.$emit('confirm', this.chooseTitle, this.chooseVal)
            this.onCancel()
        },
        onCancel () {
            this.firstWatch = true
            this.$emit('input', false)
        },
        getDayArr (month, year) {
            var day = []
            var dayCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month-1]
            
            if (month == 2) {
                var isLeapYear = ( (year % 4 == 0) && (year % 100 != 0) ) || (year % 400 == 0)

                dayCount = isLeapYear ? 29 : dayCount
            }

            for (let index = 1; index <= dayCount; index++) {
                day.push(index)
            }

            return day
        },
        updatePicker () {
            if (this.firstWatch) {
                if(this.datepicker && this.pickerIndex.length < 1) {
                    this.datamap.map((item, index) => {
                        item.map((inner, innerIndex) => {
                            if(inner == this.todayList[index]) {
                                this.pickerIndex.push(innerIndex)
                            }
                        })
                        
                    })
                }

                refList.map((key, refIdx) => {
                    if (this.$refs[key] && (this.pickerIndex[refIdx] || this.pickerIndex[refIdx] === 0)) {
                        this.$refs[key].scrollTo(0, item_height * this.pickerIndex[refIdx])
                    }
                })
                this.firstWatch = false
            } else {
                this.pickerIndex = []
                refList.map((key, refIdx) => {
                    if (this.$refs[key]) {
                        let index = Math.round((this.$refs[key].getPosition().top)/34)
                        let targetCol = this.datepicker ? `${this.dateList[refIdx]}Col` : `cascaderCol_${refIdx}Title`
                        index = index < 0 ? 0 : index
                        

                        if(index >= this[targetCol].length) {
                            index = this[targetCol].length - 1
                        }
                        this.pickerIndex.push(index)
                        this.$refs[key].scrollTo(0, item_height * this.pickerIndex[refIdx])
                    }
                })
            }
            
        },
        getContent () {
            var me = this

            var $content = hx(`div.x-picker`)
            var $header = hx(`div.x-picker-header`)
            var $main = hx(`div.x-picker-main`)

            $header
            .push(
                hx(`div.x-picker-header-left + x-picker-header-item`, {
                    on: {
                        click: me.onCancel
                    }
                }, ['取消'])
            )
            .push(hx(`div.x-picker-header-title + x-picker-header-item`, {}, [this.title]))
            .push(
                hx(`div.x-picker-header-right + x-picker-header-item`, {
                    on: {
                        click: me.onConfirm
                    }
                }, ['确定'])
            )
            .push(hx(`div.hairline-bottom`))

            this.datamap.map((_, index) => {
                let $col = hx(`div.x-picker-col-${index}`)
                let $scroller = hx(`x-scroller`, {
                    ref: `picker_scroller_${index}`
                })
                let targetCol = this.datepicker ? `${this.dateList[index]}Col` : `cascaderCol_${index}Title`

                this[targetCol].map((inner, innerIndex) => {
                    $scroller.push(hx(`div.x-picker-col-item`, {
                        class: {
                            'x-picker-col-item-selected': innerIndex == this.pickerIndex[index]
                        }
                    }, [dateUnit[this.dateList[index]] ? inner + dateUnit[this.dateList[index]] : inner]))
                })

                $col
                .push(hx(`div.x-picker-col-mask`))
                .push(hx(`div.x-picker-col-indicator`))
                .push($scroller)

                $main.push($col)
            })

            

            return $content.push($header).push($main)

        },
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
    },
    mounted () {
        this.timer = setInterval(_ => {
            if(this.$refs.picker_scroller_0) {
                this.updatePicker()
            }
        }, 1000)
    },
    destroyed () {
        clearInterval(this.timer)
    }     
})

Vue.component('x-picker', XPicker)