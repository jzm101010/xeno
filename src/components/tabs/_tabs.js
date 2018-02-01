import {hx} from '../../common/_tools.js'

var XTabs = Vue.extend({
  props: {
    value: [String, Number],
  },
  data () {
    return {
      paneConfs: []
    }
  },
  computed: {
    cls () {
      var cls = []
      cls.push('x-tabs')

      return cls
    },
  },
  methods: {
    _getPaneConfs () {
      var confs = []

      if (!this.$slots.default){
        return
      }

      var propList = ['name', 'label', 'icon', 'disabled', 'badge']

      this.$slots.default.forEach(slot=>{
        var options = slot.componentOptions
        var instance = slot.componentInstance

        if (!options || (options.tag != 'x-tab-pane') ){
          return
        }

        var conf = {
          slot: instance.$slots.default
        }

        propList.forEach(prop=>{
          conf[prop] = instance[prop]
        })

        confs.push(conf)
      })

      this.paneConfs = confs
    }
  },
  render (h) {
    var me = this
    var $wrapper = hx(`div.${this.cls.join('+')}`, {})
      .push(
        this.$slots.default
      )

    // 当前选中索引
    var activeIdx = 0
    this.paneConfs.some( (conf, idx) =>{
      if (conf.name === this.value){
        activeIdx = idx
        return true
      }
      else {
        return false
      }
    })

    // tabs-head
    var $head = hx('div.x-tabs-head')

    this.paneConfs.forEach( (conf, idx) =>{
      var $tab = hx('div.x-tabs-tab', {
        'class': {
          'x-tabs-tab-active': activeIdx === idx
        },
        on: {
          click () {
            me.$emit('input', conf.name)
          }
        }
      })

      if (conf.icon) {
        $tab.push(
          hx('x-icon', {
            props: {
              type: conf.icon
            }
          })
        )
      }

      if (conf.badge) {
        $tab.push(
            hx('x-badge', {
                props: {
                    value: conf.badge
                }
            })
        )
      }

      $tab.push(conf.label)
      $head.push($tab)
    })


    // tabs-body
    var $body = hx('div.x-tabs-body')

    this.paneConfs.forEach( (conf, idx) =>{
      var $pane = hx('div.x-tabs-pane', {
        style: {
          display: activeIdx === idx ? 'block' : 'none'
        }
      })
      .push(conf.slot)

      $body.push($pane)
    })

    return $wrapper
      .push($head)
      .push($body)
      .resolve(h)
  }
})

var XTabPane = Vue.extend({
  props: {
    name: [String, Number],
    label: String,
    icon: String,
    disabled: String,
    badge: Number
  },
  mounted () {
    this.$parent._getPaneConfs()
  },
  beforeDestroy () {
    this.$parent._getPaneConfs()
  },
  updated () {
    this.$parent._getPaneConfs()
  },
  render () {
  }
})

Vue.component('x-tab-pane', XTabPane)
Vue.component('x-tabs', XTabs)