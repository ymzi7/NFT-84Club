<template>
  <div class="search_wrap search" >
    <div class="search_icon">
      <img src="../../assets/img/search.png" alt="" />
    </div>
    <input
    @input="inputChangeClick"
      type="text"
      v-model="searchInfo"
      class="search_text"
      :placeholder="$t('lang.SearchPlace')"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchInfo:''
    };
  },
  created(){
    this.searchInfo = ''
  },
  methods:{
    inputChangeClick(val){
      this.$emit('inputChange',this.searchInfo)
    }
  },
  components: {},
};
</script>

<style lang='less' scope>
.search_wrap {
  height: 40px;
  background: #ffffff;
  border: 1px solid #f2f2f2;
}
.search_wrap {
  width: 230px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px;
  .search_icon {
    width: 20px;
    height: 20px;
    margin-top: -3px;
    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .search_text {
    width: 200px;
    height: 38px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #788594;
    line-height: 38px;
  }
}
</style>
