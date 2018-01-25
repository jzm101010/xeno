import {hx} from '../../common/_tools.js'

var XBadge = Vue.extend({
  props: {
    value: [Number, String]
  },
  computed: {
    cls () {
    }
  },
  render (h) {
      var $badge = hx(`div.x-badge`).push(hx(`div.x-badge-num`, {}, [this.value]))

      return this.value ? $badge.resolve(h) : false
  }
})


Vue.component('x-badge', XBadge)