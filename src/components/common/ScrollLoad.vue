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
      scrollY: true,
      probeType: 3,
      pullUpLoad: true,
      click: true,
      scrollbar: false,
      preventDefault: true,
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300
      }
      // momentum: false,
      // bounceTime: 300,
      // bounce: false
      // bounce: {
      //   top: false,
      //   bottom: true,
      //   left: true,
      //   right: true
      // }
    })

    // 监听上拉加载事件
    this.scroll.on('pullingUp', () => {
      this.$emit('pullingUp')
    })

    this.scroll.refresh()
  },

  methods: {
    //  重新加载
    refresh() {
      this.scroll.refresh()
    },
    finishPullUp() {
      this.scroll.finishPullUp()
    },
    // 回到顶部
    scrollTop() {
      this.scroll.scrollTo(0, 0, 500)
    }
  },
  components: {}
}
</script>

<style  lang="less" scope>
</style>
