import {hx} from '../../common/_tools.js'

const item_height = 34

const refList = ['picker_scroller_0', 'picker_scroller_1', 'picker_scroller_2']

var XPicker = Vue.extend({
    props: {
        value: Boolean,
        data: Array,
        title: String,
        disable: Boolean,
        cascader: Boolean,

        onChange: {
            type: Function,
            default: _ => {
                console.log('value change')
            }
        },
    },
    computed: {
        pickerDataTitle () {
            var flag = false
            var arr = []

            // this.data.map(item => {
            //     if (typeof item == 'object') {
            //         flag = true
            //         let child = []
            //         item.map(_ => {
            //             if(this.cascader) {
            //                 child.push([_.label, _.parentId])
            //             }else {
            //                 child.push(_.label)
            //             }
            //         })

            //         arr.push(child)
            //     }
            // })

            this.data.map(item => {
                if (typeof item == 'object') {
                    flag = true

                    if (this.cascader) {
                        var child = {}
                        item.map(_ => {
                            if (_.parentId !== undefined) {
                                if (child[_.parentId]) {
                                    child[_.parentId].push(_.label)
                                }else {
                                    child[_.parentId] = []
                                    child[_.parentId].push(_.label)
                                }
                            }else {
                                if (child['first']) {
                                    child['first'].push(_.label)
                                }else {
                                    child['first'] = []
                                    child['first'].push(_.label)
                                }
                            }
                        })
                    }else {
                        var child = []
                        item.map(_ => {
                            child.push(_.label)
                        })
                    }

                    arr.push(child)
                }
            })

            return flag ? arr : ['暂无数据']
        },
        pickerDataValue () {
            var flag = false
            var arr = []

            this.data.map(item => {
                if (typeof item == 'object') {
                    flag = true

                    if (this.cascader) {
                        var child = {}
                        item.map(_ => {
                            if (_.parentId !== undefined) {
                                if (child[_.parentId]) {
                                    child[_.parentId].push(_.value)
                                }else {
                                    child[_.parentId] = []
                                    child[_.parentId].push(_.value)
                                }
                            }else {
                                if (child['first']) {
                                    child['first'].push(_.value)
                                }else {
                                    child['first'] = []
                                    child['first'].push(_.value)
                                }
                            }
                        })
                    }else {
                        var child = []
                        item.map(_ => {
                            child.push(_.value)
                        })
                    }

                    arr.push(child)
                }
            })

            return flag ? arr : ['暂无数据']
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
            chooseTitle: []
        }
    },
    methods: {
        onConfirm () {
            this.chooseVal = []
            this.chooseTitle = []
            this.pickerIndex.map((item, index) => {
                this.chooseVal.push(this[`cascaderCol_${index}Value`][item])
                this.chooseTitle.push(this[`cascaderCol_${index}Title`][item])
            })
            this.$emit('confirm', this.chooseVal, this.chooseTitle)
            this.onCancel()
        },
        onCancel () {
            this.firstWatch = true
            this.$emit('input', false)
        },
        updatePicker () {
            if (this.firstWatch) {
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
                        var index = Math.round((this.$refs[key].getPosition().top)/34)
                        index = index < 0 ? 0 : index

                        if(index >= this[`cascaderCol_${refIdx}Title`].length) {
                            index = this[`cascaderCol_${refIdx}Title`].length - 1
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

            this.data.map((_, index) => {
                let $col = hx(`div.x-picker-col-${index}`)
                let $scroller = hx(`x-scroller`, {
                    props: {
                        animationDuration: 2
                    },
                    ref: `picker_scroller_${index}`
                })

                this[`cascaderCol_${index}Title`].map((inner, innerIndex) => {
                    $scroller.push(hx(`div.x-picker-col-item`, {
                        class: {
                            'x-picker-col-item-selected': innerIndex == this.pickerIndex[index]
                        }
                    }, [inner]))
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
        }, 100)
    },
    destroyed () {
    }     
})

Vue.component('x-picker', XPicker)