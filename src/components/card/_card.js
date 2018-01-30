import {hx} from '../../common/_tools.js'

var XCard = Vue.extend({
    props: {
        full: Boolean,
        title: [String, Number],
        titleExtra: [String, Number],
        img: String,
        imgStyle: Object,
        footer: [String, Number],
        footerExtra: [String, Number],
    },
    computed: {
        cls () {
            var cls = ['x-card']

            if (this.full) {
                cls.push('x-card-full')
            }

            return cls
        },
        
    },
    render (h) {
        var me = this

        var $card = hx(`div.${this.cls.join('+')}`)
        var $header = hx(`div.x-card-header`)
        var $body = hx(`div.x-card-body`, {}, [this.$slots.default])
        var $footer = hx(`div.x-card-footer`)
        var $content = hx('div.x-card-header-content')
        var $img = hx('div.x-card-header-content-img').push(hx('img', {
            attrs: {
                src: this.img
            },
            style: this.imgStyle
        }))

        if (this.img) {
            $content.push($img)
        }

        $content.push(hx('div.x-card-header-content-text', {}, [this.title]))
        $header.push($content).push(hx('div.x-card-header-extra', {}, [this.titleExtra]))
        $footer
        .push(hx('div.x-card-footer-content', {}, [this.footer]))
        .push(hx('div.x-card-footer-extra', {}, [this.footerExtra]))

        $card.push($header).push($body).push($footer)

        return $card.resolve(h)
    }
})

Vue.component('x-card', XCard)