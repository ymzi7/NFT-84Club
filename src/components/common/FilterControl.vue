<template>
  <div class="main-filter">
    <!-- 左侧区域 -->
    <div class="main-filter-l" style="width:300px" v-if="searchTag">
      <el-tag closable @close="closeClick">{{ searchText }}</el-tag>
      <span class="total">{{this.total}} {{$t('lang.total')}}</span>
    </div>
    <div></div>

    <div class="main-filter-r">
      <slot name="addCollection"></slot>

      <div v-if="favoritesShow">
              <!-- 市场排序 -->
      <div class="filter_wrap" v-if="selectedFlag">
        <p class="filter_text" @click="openFilter">{{ filterItem }}</p>
        <div class="check-icon" @click="openFilter">
          <i class="el-icon-caret-top" v-if="filter"></i>
          <i class="el-icon-caret-bottom" v-else></i>
        </div>
        <transition name="fade">
          <div class="filter_items" v-if="filter" @mouseleave="CloseFilter">
            <el-checkbox-group v-model="FilterContent" @change="selectFilter">
              <el-checkbox
                v-for="(item, index) in FilterList"
                :key="index"
                :label="index"
              >{{ $t(item) }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </transition>
      </div>

      <!-- 我的藏品排序 -->
  <div class="filter_wrap" v-else>
        <p class="filter_text" @click="openFilter">{{ myfilterItem }}</p>
        <div class="check-icon" @click="openFilter">
          <i class="el-icon-caret-top" v-if="filter"></i>
          <i class="el-icon-caret-bottom" v-else></i>
        </div>
        <transition name="fade">
          <div class="filter_items" v-if="filter" @mouseleave="CloseFilter">
            <el-checkbox-group v-model="myFilterContent" @change="mySelectFilter">
              <el-checkbox
                v-for="(item, index) in myFilterList"
                :key="index"
                :label="index"
              >{{ $t(item) }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </transition>
      </div>

      </div>



    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 搜索内容
    searchContent: '',
    total: 0,
    // 判断路径 我的收藏 myCollection

    myCollection:'',

  },
  data() {
    return {
      favoritesShow:true,
      totalChange: false,
      searchText: '',
      FilterText: null, //
      filterItem: this.$t('lang.sort_order'), //筛选
      FilterContent: [],
      FilterList: ['lang.The_latest', 'lang.latest_sold'],      
      myFilterList:['lang.locking', 'lang.buySuccess','lang.Subscrib'],
      myFilterContent:[],
      myfilterItem:this.$t('lang.state'),
      myFilterText:0,
      filter: false,
      // 搜索标签
      searchTag: false,
      selectedFlag:true
    }
  },
  methods: {
    // 打开下拉筛选框
    openFilter() {
      this.filter = !this.filter
    },
    // 关闭下拉筛选
    CloseFilter() {
      this.filter = false
    },
    // 选择筛选条件
    selectFilter() {
      let i = this.FilterContent.length
      this.FilterContent = this.FilterContent.slice(-1)
      let index = this.FilterContent[0]
      this.FilterText = index + 1
      switch (index) {
        case 0:
          this.filterItem = this.$t(this.FilterList[0])
          break
        case 1:
          this.filterItem = this.$t(this.FilterList[1])
          break
        default:
          this.filterItem = this.$t('lang.sort_order')
      }
      this.$emit('selectFilter', this.FilterText)
    },
    mySelectFilter(){
      let i = this.myFilterContent.length
      this.myFilterContent = this.myFilterContent.slice(-1)
      let index = this.myFilterContent[0]
      switch (index) {
        case 0:
          this.myfilterItem = this.$t(this.myFilterList[0])
          this.myFilterText = 0
          break
        case 1:
          this.myfilterItem = this.$t(this.myFilterList[1])
           this.myFilterText = 1
          break
                  case 2:
          this.myfilterItem = this.$t(this.myFilterList[2])
           this.myFilterText = 3
          break;
                  default:
          this.filterItem = this.$t('lang.state')
      }
      this.$emit('selectFilter', this.myFilterText)
    },
    // 清除搜索
    closeClick() {
      this.searchTag = false
      this.$store.commit('searchClick', '')
    }
  },

  created() {
    if(this.$route.path.indexOf('mycollection') != -1){
       this.selectedFlag = false
    }
    if(this.$route.path.indexOf('favorites') != -1){
      this.favoritesShow = false
    }
    this.searchText = this.$store.state.searchContent
    if (this.searchText && this.searchText.length > 0) {
      this.searchTag = true
    }
  },
  watch: {
    searchContent(val) {
      if (val.length > 0) {
        this.searchText = val
        this.searchTag = true
      }
    },
    myCollection(){
      
    }
  },
  components: {}
}
</script>
<style  lang="less" scope>
.main-filter {
  height: 70px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(192, 196, 204, 0.3);

  .main-filter-l {
    height: 70px;

    display: flex;
    align-items: center;
    .total {
      display: block;
      margin-left: 15px;

      font-size: 7px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4374a9;
    }

    .el-tag {
      height: 40px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3b4957;
      line-height: 40px;
      background: #fff6fe;

      .el-tag__close {
        color: #bebebe;
      }
      .el-tag__close:hover {
        background: #fff6fe;
        color: #bebebe;
      }
    }
  }

  .main-filter-r {
    display: flex;
    align-items: center;
  }

  .filter_wrap {
    height: 40px;
    border: 1px solid #ccc;
    margin-left: 30px;
    width: 136px;
    border-radius: 8px;
    position: relative;
    color: #858585;
    font-size: 14px;
    .filter_text {
      cursor: pointer;
      min-width: 86px;
      padding: 0 32px 0 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 40px;
      margin: 0;
    }
    .check-icon {
      position: absolute;
      right: 16px;
      top: 10px;
      cursor: pointer;
    }
    .filter_items {
      padding: 14px;
      position: absolute;
      right: 0;
      top: 45px;
      z-index: 1;
      background: #ffffff;
      box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.5);
      border-radius: 8px;
      color: #858585;
    }
    .el-checkbox__label {
      color: rgb(133, 133, 133) !important;
      font-weight: 400;
    }
  }
}
</style>
