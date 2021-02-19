<template>
  <div class="my-collection">
    <outer-container @navClick="navClick" totalType="mycollection" type="myCollection">
      <div class="my-collection-main">
        <filter-control @selectFilter="selectFilter" :total="total" collectionType='myCollection'>
          <template slot="addCollection">
            <div class="add-collection" @click="addCollectionClick">
              <i class="el-icon-circle-plus-outline"></i>
              {{ $t("lang.TransferToCollection") }}
            </div>
          </template>
        </filter-control>

        <div
          class="scroll_items"
          ref="ScrollItem"
          v-loading="holeLoading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(246,247,249,1)"
        >
          <scroll-load ref="scrollLoad" @pullingUp="loadMore" v-if="no_data">
            <ul class="items_list">
              <li class="items" v-for="(item, index) in myCollectionList" :key="index">
                <collection-list-item :collection-item-list-info="item" collectionType="mygoods">
                  <template v-slot:newest>
                    <div class="newest">{{$t('lang.newestPrice')}}</div>
                  </template>
                </collection-list-item>
              </li>
              <li class="items empty"></li>
              <li class="items empty"></li>
              <li class="items empty"></li>
              <li class="items empty"></li>
              <li class="items empty"></li>
            </ul>

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
import FilterControl from '../../components/common/FilterControl.vue'
import OuterContainer from '../../components/common/OuterContainer.vue'
import { request } from 'network/request'
import collectionListItem from 'components/collectionInfo/collectionListItem'
import ScrollLoad from 'components/common/ScrollLoad.vue'
import { getToken } from '@/utils/utils.js'

export default {
  data() {
    return {
      token: '',
      // 藏品列表
      myCollectionList: [],
      // 总条数
      total: 0,
      // 请求参数
      myCollectionParam: {
        keyword: '',
        language: '',
        page: 1,
        pageSize: 10,
        sort: '',
        token: '',
        contractId: ''
      },
      // 遮罩层
      holeLoading: false,
      //  加载中
      isPullUpLoad: false,
      // 没有数据
      no_data: true,
      // 我的藏品数据


    }
  },
  created() {
    this.token = getToken()
    this.getMyColllection()
  },
  methods: {
    // 接收合约id(未添加)
    navClick(index) {
      this.myCollectionParam.page = 1
      this.$refs.scrollLoad && this.$refs.scrollLoad.scrollTop()
      this.myCollectionList = []
      this.myCollectionParam.contractId = index
      this.getMyColllection()
    },
    // 接收筛选条件
    selectFilter(index) {
      this.myCollectionParam.page = 1
      this.myCollectionList = []
      this.myCollectionParam.status = index
      this.getMyColllection()
    },

    // 获取我的藏品数据
    async getMyColllection() {
      // this.holeLoading = true
      this.myCollectionParam.language = this.$i18n.locale
      this.myCollectionParam.token = this.token
      const { data: res } = await request.post(
        '/web/asset/my/list',
        this.myCollectionParam
      )
      if (res.status == 0) {

       
        var contentLength = res.data.content.length
        if (contentLength == 0 && this.myCollectionParam.page == 1) {
          this.no_data = false
          this.total = res.data.total
          this.holeLoading = false
          return
        }

        if (this.myCollectionParam.page != 1 && contentLength == 0) {
          this.isPullUpLoad = !this.isPullUpLoad
          this.holeLoading = false
          this.total = res.data.total
          return
        }

        this.myCollectionList.push(...res.data.content)
        this.no_data = true
        this.holeLoading = false
        this.total = res.data.total
      }

      this.$nextTick(() => {
        this.refs()
      })
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
      if (!this.no_data) return
      this.isPullUpLoad = true
      this.myCollectionParam.page += 1
      this.getMyColllection()
    },

    addCollectionClick() {}
  },
  components: {
    OuterContainer,
    FilterControl,
    collectionListItem,
    ScrollLoad
  }
}
</script>

<style  lang="less" scope>
.my-collection {
  .newest {
    font-size: 6px;
    color: #596675;
    margin-bottom: 5px;
  }
  .my-collection-main {
    height: 100%;
    padding: 0 35px;
    display: flex;
    flex-direction: column;

    .add-collection {
      cursor: pointer;
      width: 200px;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ff01d6;
    }

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
