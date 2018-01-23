import {hx} from '../../common/_tools.js'

var XRow = Vue.extend({
  props: {
    gutter: [Number, String],
    alignItems: String,
    justifyContent: String,
  },
  computed: {
    style (){
        var style = {}
        if (this.alignItems) {
            style.alignItems = this.alignItems
        }

        if (this.justifyContent) {
            style.justifyContent = this.justifyContent
        }

        var gutter = this.gutter
        if (gutter > 0) {
            gutter = gutter / 2
            style.marginLeft = style.marginRight = `-${gutter}px`
        }

        return style
    }
  },
  render (h) {
        return hx('div.x-row + x-row-flex', {
            style: this.style
        }, [this.$slots.default]).resolve(h)
  }
})

var XCol = Vue.extend({
  props: {
    span: [Number, String],
    offset: [Number, String],
  },
  computed: {
    cls () {
      var cls = []
      if (!isNaN(this.span) && this.span > 0 && this.span <= 24) {
        cls.push(`x-col-span-${this.span}`)
      }

      if (!isNaN(this.offset) && this.offset > 0 && this.offset <= 24) {
        cls.push(`x-col-offset-${this.offset}`)
      }

      return cls
    },
    style () {
      var style = {}
      if (this.$parent instanceof RRow) {
        var gutter = this.$parent.gutter
        if (gutter > 0) {
          gutter = gutter / 2
          style.paddingLeft = style.paddingRight = `${gutter}px`
        }
      }
      return style
    }
  },
  render (h) {
    return hx(`div.x-col + ${this.cls.join('+')}`, {
      style: this.style,
    }, [this.$slots.default]).resolve(h)
  }
})

Vue.component('x-row', XRow)
Vue.component('x-col', XCol)