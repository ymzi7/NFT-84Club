<template>
  <div class="collection-item">
    <collection-list-item
      v-for="(item,index) in collectionInfoShow"
      :key="index"
      
      :collectionItemListInfo="item"
      @deleteItem="deleteItemHanler"
    ></collection-list-item>
  </div>
</template>

<script>
import CollectionListItem from './collectionListItem'

export default {
  props: {
    collectionInfo: {
      type: Array,
      default: []
    }
  },

  watch:{
    collectionInfo(val){
      console.log(val);
    }
  },
  computed: {},
  data() {
    return {
      collectionInfoShow: this.collectionInfo
    }
  },
  methods: {
    deleteItemHanler(id) {
      console.log(id)
      this.collectionInfoShow = this.collectionInfoShow.filter((item) => {
        return item.id !== id
      })
    }
  },
  components: {
    CollectionListItem
  }
}
</script>

<style  lang="less" scope>
.collection-item {
  display: flex;
}
</style>
