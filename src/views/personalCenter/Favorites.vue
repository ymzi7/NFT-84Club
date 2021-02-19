<template>
  <div class="favorites">
    <outer-container @navClick="navClick" totalType="favorites" type="myCollection">
      <div class="favorites-main">
        <filter-control @selectFilter="selectFilter" :total="total"></filter-control>
        <!-- 项目列表 -->
        <div
          class="scroll_items"
          ref="ScrollItem"
          v-loading="holeLoading"
          element-loading-background="rgba(246,247,249,1)"
        >
          <scroll-load ref="scrollLoad" @pullingUp="loadMore" v-if="no_data">
            <transition-group tag="ul" name="items_list" class="items_list" mode="out-in">
              <li class="items" v-for="item in favoritesList" :key="item.id">
                <collection-list-item
                  :collection-item-list-info="item"
                  :isdelete="true"
                  @deleteItem="deleteItemHanler"
                ></collection-list-item>
              </li>
              <li class="items empty" key="e0"></li>
              <li class="items empty" key="e1"></li>
              <li class="items empty" key="e2"></li>
              <li class="items empty" key="e3"></li>
              <li class="items empty" key="e4"></li>
            </transition-group>

            <div v-if="isPullUpLoad" class="after-trigger">
              <p class="pullup-txt">{{ $t("lang.load") }}...</p>
            </div>
          </scroll-load>
          <div class="no-data" v-else>
            <img src="../../assets/img/ic-404.png" alt />
            <p>{{ $t("lang.No_data") }}</p>
          </div>
        </div>
      </div>
    </outer-container>
  </div>
</template>

<script>
import OuterContainer from '../../components/common/OuterContainer.vue'
import FilterControl from '../../components/common/FilterControl.vue'
import collectionListItem from 'components/collectionInfo/collectionListItem'
import ScrollLoad from 'components/common/ScrollLoad.vue'
import { getToken } from '@/utils/utils.js'

import { request } from 'network/request'
export default {
  data() {
    return {
      token: '',
      //  收藏列表
      favoritesList: [],
      // 总条数
      total: 0,
      // 请求参数
      favoritesParam: {
        contractId: '',
        keyword: '',
        language: '',
        page: 1,
        pageSize: 12,
        sortType: '',
        token: ''
      },
      // 遮罩层
      holeLoading: false,
      //  加载中
      isPullUpLoad: false,
      // 没有数据
      no_data: true,
    
    }
  },
  created() {
    this.token = getToken()
    this.getFavorites()
  },
  methods: {
    // 删除藏品
    deleteItemHanler(id) {
      console.log(id)
      this.favoritesList = this.favoritesList.filter((item) => {
        return item.id !== id
      })
    },
    // 接收合约id(未添加)
    navClick(index) {
      this.favoritesParam.page = 1
      this.$refs.scrollLoad && this.$refs.scrollLoad.scrollTop()
      this.favoritesList = []
      this.favoritesParam.contractId = index
      this.getFavorites()
    },
    // 接收筛选条件
    selectFilter(index) {
      this.favoritesParam.page = 1
      this.favoritesList = []
      this.favoritesParam.sort = index
      this.getFavorites()
    },
    // 获取收藏数据
    async getFavorites() {
      // this.holeLoading = true
      this.favoritesParam.language = this.$i18n.locale
      this.favoritesParam.token = this.token
      const { data: res } = await request.post(
        '/web/favorite/myFavorites',
        this.favoritesParam
      )
      if (res.status == 0) {
        
        var contentLength = res.data.content.length
        if (contentLength == 0 && this.favoritesParam.page == 1) {
          this.no_data = false
          this.holeLoading = false
          this.total = res.data.total
          return
        }

        if (this.favoritesParam.page != 1 && contentLength == 0) {
          this.isPullUpLoad = !this.isPullUpLoad
          this.holeLoading = false
          this.total = res.data.total
          return
        }

        this.favoritesList.push(...res.data.content)
        this.no_data = true
        this.holeLoading = false
        this.total = res.data.total
      }
      this.$nextTick(() => {
        this.refs()
      })
    },

    // 下拉加载更多
    loadMore() {
      if (!this.no_data) return
      this.isPullUpLoad = true
      this.favoritesParam.page += 1
      this.getFavorites()
    },
    // 重新渲染
    refs() {
      if (this.$refs.scrollLoad && this.$refs.scrollLoad.refresh) {
        this.$refs.scrollLoad.finishPullUp()
        this.$refs.scrollLoad.refresh()
      }
    }
  },
  components: {
    OuterContainer,
    FilterControl,
    collectionListItem,
    ScrollLoad
  }
}
</script>

<style lang="less" scope>
.items {
  transition: all 0.8s;
}

.items_list-leave-active {
  position: absolute;
}

.items_list-enter,
.items_list-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}

.favorites {
  .favorites-main {
    height: 100%;
    padding: 0 35px;
    display: flex;
    flex-direction: column;

    .scroll_items {
      width: 100%;
      flex: 1;

      .wrapper {
        height: 700px;
        overflow: hidden;
      }

      .items_list {
        padding: 35px 46px 46px 50px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        li {
          list-style: none;
          background: #fff;
          margin-bottom: 20px;
          box-shadow: 0px 10px 40px 0px rgba(0, 0, 0, 0.15);
          border-radius: 5px;
          cursor: pointer;
          position: relative;

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
    }
  }
  .no-data {
    height: 500px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
}
</style>
