import {hx} from '../../common/_tools.js'
import {getRender} from '../../common/_render.js'
import {Scroller} from '../../common/_scroller.js'

var reg = /^[\d]+(\%)?$/

function whValidator (v) {
    return reg.test(v)
}

var XSroller = Vue.extend({
    props: {
        onScroll: Function,
        onRefresh: Function,

        easyMode: Boolean,

        snapping: {
            type: Boolean,
            default: false
        },
    
        snapWidth: {
            type: Number,
            default: 100
        },
    
        snapHeight: {
            type: Number,
            default: 90
        },
    
        animating: {
            type: Boolean,
            default: true
        } ,
    
        animationDuration: {
            type: Number,
            default: 250
        },
    
        bouncing: {
            type: Boolean,
            default: true
        },

        width: {
            type: String,
            default: '100%',
            validator: whValidator
          },
    
        height: {
            type: String,
            default: '100%',
            validator: whValidator
        },

        loadingText: {
            type: String,
            default: '正在加载'
        },

        loadingIcon: {
            type: String,
            default: 'load-a'
        },

        refreshIcon: {
            type: String,
            default: 'arrow-up-c'
        },

        refreshText: {
            type: String,
            default: '下拉刷新'
        },

        noDataText: {
            type: String,
            default: '没有更多数据'
        },

        minContentHeight: {
            type: Number,
            default: 0 
          }
    },
    computed: {
        refreshCls () {
            var cls = []

            if(this.refreshStatus === 1) {
                cls.push('active')
            }

            if(this.refreshStatus === 2) {
                cls.push('active')
                cls.push('refreshing')
            }

            return cls
        },

        showLoadingContent () {
            var contentHeight = 0 

            if(this.content) {
                contentHeight = this.content.offsetHeight
            }

            return this.onScroll && (contentHeight > this.minContentHeight)
        }
        
    },
    data () {
        return {
            containerId: Math.random().toString(36).substring(2),
            contentId: Math.random().toString(36).substring(2),
            refreshStatus: 0, // 0: pull, 1: release, 2: refreshing
            loadingStatus: 0, // 0: stop, 1: loading, 2: stopping loading
            showLoading: false,

            container: undefined,
            content: undefined,
            scroller: undefined,
            mousedown: false,
            scrollTimer: undefined,
            resizeTimer: undefined
        }
    },
    methods: {
        getRefresh () {
            var $refresh = hx(`div.x-scroller-refresh+${this.refreshCls.join('+')}`)
            var $refreshContent = hx(`span.x-scroller-spinner`)

            if(this.refreshStatus !== 2) {
                $refreshContent
                .push(
                    hx(`x-icon`, {
                        props: {
                            type: this.refreshIcon.replace(/^ion-/, '')
                        }
                    })
                )
                .push(
                    hx(`span.x-scroller-spinner-text`, {
                        style: {
                            color: '#ddd'
                        }
                    }, [this.refreshText])
                )
                
            }

            if(this.refreshStatus === 2) {
                $refreshContent.push(
                    hx(`x-icon`, {
                        props: {
                            size: 'lg',
                            autoRotate: true,
                            type: this.loadingIcon.replace(/^ion-/, '')
                        }
                    })
                )
            }

            return $refresh.push($refreshContent)
        },

        getLoading () {
            var $loading = hx(`div.x-scroller-loading`)

            if(this.showLoading) {
                $loading.push(
                    hx(`span.x-scorller-spinner`, {
                        style: {
                            color: '#ddd'
                        }
                    }).push(
                        hx(`x-icon`, {
                            props: {
                                autoRotate: true,
                                type: this.loadingIcon.replace(/^ion-/, '')
                            }
                        })
                    )
                )
            }

            $loading.push(
                hx(`span.x-scorller-spinner+no-data-text`, {
                    'class': {
                        active: !this.showLoading && this.loadingStatus === 2
                    },
                    style: {
                        color: '#ddd'
                    }
                }, [this.noDataText])
            )

            return $loading
        },

        finishPullToRefresh() {
            this.scroller.finishPullToRefresh()
          },

        finishScroll (hideSpinner) {
            this.loadingStatus = hideSpinner ? 2 : 0
            this.showLoading = false
    
            if (this.loadingStatus == 2) {
                this.resetLoadingStatus()
            }
        },

        resize() {
            var container = this.container;
            var content = this.content;
            this.scroller.setDimensions(container.clientWidth, container.clientHeight, content.offsetWidth, content.offsetHeight);
        },

        resetLoadingStatus() {
            var {left, top, zoom} = this.scroller.getValues()
            var container = this.container;
            var content = this.content;
    
            if (top + 60 > this.content.offsetHeight - this.container.clientHeight) {
                setTimeout(() => {
                    this.resetLoadingStatus()
                }, 1000)
            } else {
                this.loadingStatus = 0
            }
        },

        touchStart(e) {
            if (e.target.tagName.match(/input|textarea|select/i)) {
              return
            }
            this.scroller.doTouchStart(e.touches, e.timeStamp)
        },
    
        touchMove(e) {
            e.preventDefault()
            this.scroller.doTouchMove(e.touches, e.timeStamp)
        },
    
        touchEnd(e) {
            this.scroller.doTouchEnd(e.timeStamp)
        },
    
        mouseDown(e) {
            if (e.target.tagName.match(/input|textarea|select/i)) {
              return
            }
            this.scroller.doTouchStart([{
              pageX: e.pageX,
              pageY: e.pageY
            }], e.timeStamp)
            this.mousedown = true
        },
    
        mouseMove(e) {
            if (!this.mousedown) {
              return
            }
            this.scroller.doTouchMove([{
              pageX: e.pageX,
              pageY: e.pageY
            }], e.timeStamp)
            this.mousedown = true
        },
    
        mouseUp(e) {
            if (!this.mousedown) {
              return
            }
            this.scroller.doTouchEnd(e.timeStamp)
            this.mousedown = false
        },

        triggerPullToRefresh() {
            this.scroller.triggerPullToRefresh()
          },
    
        scrollTo(x, y, animate) {
            this.scroller.scrollTo(x, y, animate)
        },

        scrollBy(x, y, animate) {
            this.scroller.scrollBy(x, y, animate)
        },

        getPosition() {
            var pos = this.scroller.getValues()
    
            return {
              left: parseInt(pos.left),
              top: parseInt(pos.top)
            }
        },
    },
    render (h) {
        var me = this
        
        var $container = hx(`div.x-scroller + container-${this.containerId}`, {
            style: {
                width: me.width[me.width.length] - 1 !== '%' ? me.width + 'px' : me.width,
                height: me.height[me.height.length] - 1 !== '%' ? me.height + 'px' : me.height
            },
            on: {
                touchstart: this.touchStart,
                touchmove: this.touchMove,
                touchend: this.touchEnd,
                mousedown: this.mouseDown,
                mousemove: this.mouseMove,
                mouseup: this.mouseUp
            }
        })
        var $content = hx(`div.x-scroller-content + content-${this.contentId}`)

        if(this.onRefresh) {
            $content.push(this.getRefresh())
        }
        
        $content.push(hx(`div.x-scroller-main`, {}, [this.$slots.default]))
        
        if(this.showLoadingContent) {
            $content.push(this.getLoading())
        }

        $container.push($content)


        return $container.resolve(h)
    },
    mounted () {
        this.container = document.getElementsByClassName(`container-${this.containerId}`)[0]
        this.content = document.getElementsByClassName(`content-${this.contentId}`)[0]

        // if(this.easyMode) {
        //     this.scroller = new Scroller(getRender(this.content), {
        //         scrollingX: false,
        //         snapping: this.snapping,
        //     })
        // }else {
        //     this.scroller = new Scroller(getRender(this.content), {
        //         scrollingX: false,
        //         snapping: this.snapping,
        //         animating: this.animating,
        //         animationDuration: this.animationDuration,
        //         bouncing: this.bouncing
        //     })
        // }

        this.scroller = new Scroller(getRender(this.content), {
            scrollingX: false,
            snapping: this.snapping,
            animating: this.animating,
            animationDuration: this.animationDuration,
            bouncing: this.bouncing
        })
        
        if(this.onRefresh) {
            this.scroller.activatePullToRefresh(60, _ => {
                this.refreshStatus = 1
            }, () => {
                this.refreshStatus = 0
            }, () => {
                this.refreshStatus = 2
      
                this.$on('$finishPullToRefresh', _ => {
                  setTimeout(_ => {
                    this.refreshStatus = 0
                    this.finishPullToRefresh()
                  })
                })
      
                this.onRefresh(this.finishPullToRefresh)
            })
        }

        if (this.onScroll) {
            this.scrollTimer = setInterval(() => {
                var {left, top, zoom} = this.scroller.getValues()
    
                if (this.content.offsetHeight > 0 && 
                    top + 60 > this.content.offsetHeight - this.container.clientHeight) {
                    if (this.loadingStatus) return
                    this.loadingStatus = 1
                    this.showLoading = true
                    this.onScroll(this.finishScroll)
                }
            }, 10);
        }

        if (this.snapping) {
            this.scroller.setSnapSize(this.snapWidth, this.snapHeight)
        }

        var rect = this.container.getBoundingClientRect()
        this.scroller.setPosition(rect.left + this.container.clientLeft, rect.top + this.container.clientTop)

        var [contentWidth, contentHeight] = [this.content.offsetWidth, this.content.offsetHeight]
        
        this.resizeTimer = setInterval(() => {
            var [width, height] = [this.content.offsetWidth, this.content.offsetHeight]
            if (width !== contentWidth || height !== contentHeight) {
                contentWidth = width
                contentHeight = height
                this.resize()
            }
        }, 10);

        this.resize()
    },
    destroyed () {
        clearInterval(this.resizeTimer);
        if (this.scrollTimer) {
            clearInterval(this.scrollTimer);
        }
    }     
})

Vue.component('x-scroller', XSroller)