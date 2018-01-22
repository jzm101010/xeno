import {hx, globalClick} from '../../common/_tools.js'

var XDropdown = Vue.extend({
    props: {
        label: String,
        mask: Boolean,
        position: {
            type: String,
            default: 'top'
        }
    },
    computed: {
       cls () {
           var cls = [`x-dropdown-pos-${this.position}`, `dropdownId-${this.dropdownId}`]

           if(!this.isExpand) {
               cls.push('x-dropdown-hidden')
           }

           return cls
       },
       maskCls () {
            var cls = []
            
            if(!this.isExpand) {
                cls.push('x-dropdown-hidden')
            }

            return cls
       }
    },
    data () {
        return {
            wrapperId: Math.random().toString(36).substring(2),
            dropdownId: Math.random().toString(36).substring(2),
            isExpand: false,
            dropdown_left: 0,
            dropdown_top: 0
        }
    },
    methods: {
        changeExpand () {
            this.isExpand = !this.isExpand
        }
    },
    render (h) {
        var me = this
        var $wrapper = hx(`div.x-dropdown-wrapper + wrapperId-${this.wrapperId}`)
        if(this.$slots.label) {
            $wrapper.push(hx(`div`, {
                on: {
                    click: me.changeExpand
                },
            }, [this.$slots.label]))
        }else {
            $wrapper.push(
                hx(`x-button`, {
                    props: {
                        icon: this.isExpand ? 'arrow-up-b' : 'arrow-down-b',
                        iconPos: 'after',
                    },
                    nativeOn: {
                        click: me.changeExpand
                    }
                }, [this.label])
            )
        }

        var $inner = hx(`div.x-dropdown-inner`)
        var $dropdown = hx(`div.x-dropdown + ${this.cls.join('+')}`, {
            style: {
                left: this.dropdown_left + 'px',
                top: this.dropdown_top + 'px'
            }
        })
        var $list = hx(`div.x-dropdown-list`).push(
            hx(`div.x-dropdown-list-wrapper`, {}, [this.$slots.default])
        )

        $dropdown.push(
            hx(`div.x-dropdown-content`)
            .push(
                hx(`div.x-dropdown-arrow`)
            ).push (
                $list
            )
        )

        if(this.mask) {
            $inner.push(hx(`div.x-dropdown-mask + ${this.maskCls.join('+')}`))
        }
        
        return $wrapper.push($inner.push($dropdown)).resolve(h)
    },
    mounted () {
        globalClick(this.$el, _=>{
            this.isExpand = false
        })

        var wrapper = document.getElementsByClassName(`wrapperId-${this.wrapperId}`)[0]
        var dropdown = document.getElementsByClassName(`dropdownId-${this.dropdownId}`)[0]
        var wrapperRect = wrapper.getBoundingClientRect()
        var dropdownRect = dropdown.getBoundingClientRect()

        switch (this.position) {
            case 'top':
                this.dropdown_left = wrapperRect.left + (wrapperRect.width - dropdownRect.width)/2
                this.dropdown_top = wrapperRect.top - dropdownRect.height - 7
                break;
            case 'topLeft':
                this.dropdown_left = wrapperRect.left 
                this.dropdown_top = wrapperRect.top - dropdownRect.height - 7
                break;
            case 'topRight':
                this.dropdown_left = (wrapperRect.left + wrapperRect.width) - dropdownRect.width
                this.dropdown_top = wrapperRect.top - dropdownRect.height - 7
                break;
            case 'bottom':
                this.dropdown_left = wrapperRect.left + (wrapperRect.width - dropdownRect.width)/2
                this.dropdown_top = wrapperRect.top + wrapperRect.height + 7
                break;
            case 'bottomLeft':
                this.dropdown_left = wrapperRect.left 
                this.dropdown_top = wrapperRect.top + wrapperRect.height + 7
                break;
            case 'bottomRight':
                this.dropdown_left = (wrapperRect.left + wrapperRect.width) - dropdownRect.width
                this.dropdown_top = wrapperRect.top + wrapperRect.height + 7
                break;
            case 'left':
                this.dropdown_left = wrapperRect.left - dropdownRect.width - 7
                this.dropdown_top = wrapperRect.top + (wrapperRect.height - dropdownRect.height)/2
                break;
            case 'leftTop':
                this.dropdown_left = wrapperRect.left - dropdownRect.width - 7
                this.dropdown_top = wrapperRect.top 
                break;
            case 'leftBottom':
                this.dropdown_left = wrapperRect.left - dropdownRect.width - 7
                this.dropdown_top = (wrapperRect.top + wrapperRect.height) - dropdownRect.height
                break;
            case 'right':
                this.dropdown_left = wrapperRect.left + wrapperRect.width + 7
                this.dropdown_top = wrapperRect.top + (wrapperRect.height - dropdownRect.height)/2
                break;
            case 'rightTop':
                this.dropdown_left = wrapperRect.left + wrapperRect.width + 7
                this.dropdown_top = wrapperRect.top 
                break;
            case 'rightBottom':
                this.dropdown_left = wrapperRect.left + wrapperRect.width + 7
                this.dropdown_top = (wrapperRect.top + wrapperRect.height) - dropdownRect.height
                break;
        
            default:
                break;
        }
    }
})

var XDropdownItem = Vue.extend({
    props: {
        icon: String,
        click: Function
    },
    methods: {
        clickEvent () {
            this.click()
            this.$parent.changeExpand()
        }
    },
    render (h) {
        var me = this

        var $item = hx(`div.x-dropdown-item`, {
            on: {
                click: me.clickEvent
            }
        })
        var $wrapper = hx(`div.x-dropdown-item-wrapper`)

        if(this.icon) {
            $wrapper.push(
                hx(`span.x-dropdown-item-icon`).push(
                    hx(`x-icon`, {
                        props: {
                            type: me.icon,
                            size: 'xs'
                        }
                    })
                )
            )
        }

        $wrapper.push(
            hx(`span.x-dropdown-item-content`, {}, [this.$slots.default])
        )

        return $item.push($wrapper).resolve(h)
    }
})

Vue.component('x-dropdown', XDropdown)
Vue.component('x-dropdown-item', XDropdownItem)