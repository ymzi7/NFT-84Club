<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'
import ScrollBar from '@better-scroll/scroll-bar'
import MouseWheel from '@better-scroll/mouse-wheel'
BScroll.use(MouseWheel)
BScroll.use(Pullup)
BScroll.use(ScrollBar)

export default {
  name: 'Scroll',
  data() {
    return {
      scroll: null
    }
  },

  mounted() {
    this.scroll = new BScroll(this.$refs.wrapper, {
      scrollX: true,
      scrollY: false,
      probeType: 3,
      pullUpLoad: true,
      click: true,
      scrollbar: {
        fade: false,
        interactive: true
      },
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300
      }
    })
    // 最大滚动距离
    const maxScrollX = this.scroll.maxScrollX

    this.scroll.on('scroll', (pos) => {
      var p = Math.ceil((-pos.x + 277 * 3) / 277)
      this.$emit('scrollPos', p)
    })

    this.scroll.on('scrollEnd', (pos) => {
      if (pos.x < maxScrollX + 50) {
        this.$emit('pullingUp')
      }
    })
    this.scroll.refresh()
  },

  methods: {
    //  重新加载
    refresh() {
      this.scroll.refresh()
    }
  },
  components: {}
}
</script>

<style  lang="less" scope>
.content {
  display: inline-block;
}
</style>
