<template>
  <div class="market">
    <outer-container @navClick="navClick">
      <div class="market-main">
        <filter-control
          @selectFilter="selectFilter"
          :searchContent="pageParam.keyword"
          :total="total"
        ></filter-control>
        <!-- 项目列表 -->
        <div
          class="scroll_items"
          ref="ScrollItem"
          v-loading="holeLoading"
          element-loading-background="rgba(246,247,249,1)"
        >
          <scroll-load ref="scrollLoad" @pullingUp="loadMore">
            <ul class="items_list">
              <li class="items" v-for="(item, index) in collectionInfo" :key="index">
                <collection-list-item :collection-item-list-info="item"></collection-list-item>
              </li>
              <li class="items empty"></li>
              <li class="items empty"></li>
              <li class="items empty"></li>
              <li class="items empty"></li>
              <li class="items empty"></li>
              <li class="items empty"></li>
            </ul>

            <div v-if="isPullUpLoad" class="after-trigger">
              <p class="pullup-txt">{{ $t("lang.load") }}...</p>
            </div>
            <div class="no-data" v-if="no_data">
              <img src="../../assets/img/ic-404.png" alt />
              <p>{{ $t("lang.No_data") }}</p>
            </div>
          </scroll-load>
        </div>
      </div>
    </outer-container>
  </div>
</template>

<script>
import { request } from 'network/request'
import OuterContainer from 'components/common/OuterContainer.vue'
import collectionListItem from 'components/collectionInfo/collectionListItem'
import ScrollLoad from 'components/common/ScrollLoad.vue'
import FilterControl from 'components/common/FilterControl.vue'

export default {
  data() {
    return {
      // 请求数据
      pageParam: {
        contractId: 1,
        page: 1,
        pageSize: 12,
        sort: '',
        language: '',
        keyword: ''
      },
      // 藏品数据
      collectionInfo: [],
      total: 0,
      // 加载遮罩层
      holeLoading: true,
      //  加载中
      isPullUpLoad: false,
      // 没有数据
      no_data: false,
      // flage
      searchFlag: true,
      // 下拉加载判断
      loadMoreFlag: false,
      // 搜索执行
      searchIndex: 0
    }
  },
  methods: {
    // 计算当前需要的个数
    itemCount() {
      let clientWidth = document.querySelector('.wrapper').clientWidth
      this.pageParam.pageSize =
        clientWidth < 1475 && clientWidth >= 1246 ? 10 : 12
    },
    // 接收合约id
    navClick(index) {
      if (!this.searchFlag) return
      this.holeLoading = true
      this.pageParam.page = 1
      this.$refs.scrollLoad && this.$refs.scrollLoad.scrollTop()
      this.collectionInfo = []
      this.pageParam.contractId = index
      this.itemCount()
      this.getCollectionInfo()
    },
    // 接收筛选条件
    selectFilter(index) {
      this.pageParam.page = 1
      this.collectionInfo = []
      this.pageParam.sort = index
      this.getCollectionInfo()
    },
    //  搜索
    searchContent(val) {
      this.searchIndex += 1
      this.pageParam.keyword = val
      this.pageParam.page = 1
      this.collectionInfo = []
      this.searchFlag = false
      this.getCollectionInfo()
    },
    // 请求藏品数据
    async getCollectionInfo() {
      // this.holeLoading = true
      this.pageParam.language = this.$i18n.locale
      const { data: res } = await request.post(
        '/web/asset/list',
        this.pageParam
      )
      if (res.status == 0) {
        var contentLength = res.data.content.length
        if (contentLength < 5) {
          this.loadMoreFlag = true
          this.holeLoading = false
          this.isPullUpLoad = false
        } else {
          this.loadMoreFlag = false
        }
        if (contentLength == 0 && this.pageParam.page == 1) {
          this.no_data = true
          this.isPullUpLoad = false
          this.holeLoading = false
          this.total = res.data.total
          return
        }

        if (this.pageParam.page != 1 && contentLength == 0) {
          this.isPullUpLoad = false
          this.holeLoading = false
          this.total = res.data.total
          return
        }

        this.collectionInfo.push(...res.data.content)
        this.no_data = false
        this.holeLoading = false
        this.total = res.data.total
      }

      this.$nextTick(() => {
        this.refs()
      })
      this.searchFlag = true
    },
    // 重新渲染
    refs() {
      if (this.$refs.scrollLoad && this.$refs.scrollLoad.refresh) {
        this.$refs.scrollLoad.finishPullUp()
        this.$refs.scrollLoad.refresh()
      }
    },
    // 下拉加载更多
    loadMore() {
      if (this.loadMoreFlag) return
      this.isPullUpLoad = true
      this.pageParam.page += 1
      this.getCollectionInfo()
    }
  },
  computed: {
    listenSearch() {
      return this.$store.state.searchContent
    }
  },
  created() {
    if (this.$store.state.searchContent.length > 0) {
      this.searchContent(this.$store.state.searchContent)
    }
  },
  watch: {
    listenSearch(val) {
      this.collectionInfo = []
      this.searchContent(val)
    }
  },

  components: {
    OuterContainer,
    collectionListItem,
    ScrollLoad,
    FilterControl
  }
}
</script>

<style  lang="less" scope>
.market {
  .market-main {
    height: 100%;
    padding: 0 35px;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;

    .scroll_items {
      width: 100%;
      flex: 1;

      .wrapper {
        min-height: 600px;
        max-height: 700px;
        // flex: 1;
        padding-bottom: 100px;
        margin-bottom: -10px;
        overflow: hidden;
      }

      .items_list {
        padding: 35px 46px 46px 50px;
        display: flex;
        justify-content: space-between;
        // justify-content: flex-start;
        flex-wrap: wrap;

        li {
          // margin-right: 20px;
          margin-right: 10px;
          list-style: none;
          background: #fff;
          margin-bottom: 30px;
          box-shadow: 0px 10px 40px 0px rgba(0, 0, 0, 0.15);
          border-radius: 5px;
          cursor: pointer;

          .collectin-list-item {
            box-shadow: none;
            margin-right: 0;
          }
        }
        .empty {
          width: 220px;
          background: none;
          box-shadow: none;
        }
      }

      .after-trigger {
        text-align: center;
      }
      .no-data {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}
</style>
