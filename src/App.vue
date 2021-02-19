<template>
  <div id="app" >
      <nva-bar></nva-bar>
      <router-view></router-view>
  </div>
</template>

<script>
import NvaBar from './components/common/NavBar.vue'

export default {
  name: 'app',
  components: {
    NvaBar,
  }
}
</script>

<style >


</style>
