<template>
  <div class="icon-title">
    <div class="icon-img" @click="goHomeClick">
      <img src="../../assets/img/icon_logo.png" alt />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    goHomeClick() {
      this.$router.push('/home')
    }
  },
  components: {}
}
</script>

<style scope>
.icon-title {
  height: 50px;
  display: inline-block;
  cursor: pointer;
}
.icon-img {
  width: 180px;
  height: 80px;
  display: inline-block;
  vertical-align: top;
}
.icon-img img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  vertical-align: top;
}
.icon-text {
  display: inline-block;
  height: 43px;
}
.icon-title h3 {
  height: 50px;
  font-size: 36px;
  width: 150px;
  font-family: Helvetica;
  color: #121b25;
  line-height: 50px;
  display: inline-block;
  margin-left: 20px;
  vertical-align: top;
  font-weight: 500;
}
</style>
