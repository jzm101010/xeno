import {hx} from '../../common/_tools.js'

var XCell = Vue.extend({
  props: {
    noLine: Boolean
  },
  computed: { 
      cls () {
          var cls = ['x-cell']

          if (!this.noLine) {
              cls.push('x-cell-line')
          }

          return cls
      }   
  },
  render (h) {
        return hx(`div.${this.cls.join('+')}`, {}, [this.$slots.default]).resolve(h)
  }
})

var XCellRow = Vue.extend({
    props: {
    },
    computed: {
        colNum () {
            var col = 0;
            this.$slots.default.map(node => {
                if (node.tag && node.tag.indexOf('x-cell-item') != -1) {
                    col += 1
                }
            })

            return col
        }
    },
    render (h) {
        return hx('div.x-cell-row', {}, [this.$slots.default]).resolve(h)
    }
})

var XCellItem = Vue.extend({
  props: {
    
  },
  computed: {
    style () {

    }
  },
  render (h) {
    var $item = hx(`div.x-cell-item + column-num-${this.$parent.colNum}`, {
        style: {
            width: `${100 / this.$parent.colNum}%`
        }
    }).push(
        hx('div.x-cell-item-content').push(
            hx('div.x-cell-item-content-inner', {}, [this.$slots.default])
        )
    )
    
    return $item.resolve(h)
  }
})

Vue.component('x-cell', XCell)
Vue.component('x-cell-row', XCellRow)
Vue.component('x-cell-item', XCellItem)