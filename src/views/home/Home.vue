<template>
  <div class="home">
    <outer-container @navClick="navClick">
      <div class="home-mian">
        <div class="home-header">
          <!-- 左侧标题 -->
          <div class="home-header-title">
            <h3>{{ contractName }}</h3>
            <h3>{{ name }}</h3>
          </div>
          <!-- 右侧图片 -->
          <div class="home-header-img">
            <el-image :src="imgUrl" fit="contain">
              <div slot="placeholder" class="image-slot">
                <i class="el-icon-loading"></i>
              </div>
              <div slot="error" class="image-slot">
                <i class="el-icon-loading"></i>
              </div>
            </el-image>
          </div>
        </div>
        <div class="home-collection">
          <!-- <h3>{{ $t("lang.Featured_Collection") }}</h3> -->
          <!-- 轮播区域 -->
          <div class="collection-scroll">
            <h3>{{ $t("lang.Featured_Collection") }}</h3>
            <scroll ref="scrollRef" @pullingUp="loadMore" @scrollPos="scrollPos">
            <ul class="scroll-lis">
              <li v-for="(item,index) in collectionInfo" :key='index'>
                <collection-list-item :collectionItemListInfo="item"></collection-list-item>
              </li>
            </ul>
            </scroll>
          </div>
        </div>
      </div>
    </outer-container>
    <foot-bar></foot-bar>
  </div>
</template>

<script>
import { request } from 'network/request'
import OuterContainer from 'components/common/OuterContainer.vue'
import collectionList from 'components/collectionInfo/collectionList'
import collectionListItem from 'components/collectionInfo/collectionListItem'
import Scroll from 'components/common/Scroll.vue'
import FootBar from 'components/common/footer.vue'
import CollectionListItem from '../../components/collectionInfo/collectionListItem.vue'

export default {
  data() {
    return {
      // 请求数据
      pageParam: {
        contractId: 1,
        page: 1,
        pageSize: 10,
        sort: '',
        language: '',
        keyword: ''
      },
      // 总条数
      total: 0,
      // 数据信息
      collectionInfo: [],
      // 第一条内容
      contractName: '',
      name: '',
      imgUrl: '',
      no_data: false,
      // 滚动限制
      loadingFlag: true
    }
  },
  methods: {
    //  接收合约id
    navClick(index) {
      this.pageParam.page = 1
      this.contractName = ''
      this.name = ''
      this.imgUrl = ''
      this.collectionInfo = []
      this.pageParam.contractId = index
      this.getCollectionInfo()
    },

    // 请求藏品数据
    async getCollectionInfo() {
      this.pageParam.language = this.$i18n.locale
      const { data: res } = await request.post(
        '/web/asset/list',
        this.pageParam
      )
      if (res.status == 0) {
        this.loadingFlag = true
        this.collectionInfo.push(...res.data.content)
        if (this.pageParam.page == 1) {
          this.contractName = this.collectionInfo.length > 0 ? this.collectionInfo[2].contractName : '',
          this.name = this.collectionInfo[2].name
          this.imgUrl = this.collectionInfo[2].imageUrl
        }
        this.total = res.data.total
      }
      this.$nextTick(() => {
        this.refs()
      })
    },
    // 加载更多
    loadMore() {
      if (!this.loadingFlag) {
        return false
      }
      this.loadingFlag = false
      var that = this
      setTimeout(() => {
        this.pageParam.page += 1
        that.getCollectionInfo()
      }, 2000)
    },
    // 重新渲染
    refs() {
      if (this.$refs.scrollRef && this.$refs.scrollRef.refresh) {
        this.$refs.scrollRef.refresh()
      }
    },
    // 监滚动片位置
    scrollPos(p) {
      this.contractName = this.collectionInfo.length > 0 ?  this.collectionInfo[p - 1].contractName : ''
      this.name = this.collectionInfo[p - 1].name
      this.imgUrl = this.collectionInfo[p - 1].imageUrl
    }
  },
  components: {
    OuterContainer,
    collectionListItem,
    Scroll,
    FootBar,
    CollectionListItem
  }
}
</script>

<style lang="less" scope>
.home {
  .el-main {
    flex: 660px 1 0;
  }
  .home-mian {
    padding-left: 50px;
    padding-right: 50px;
    height: 100%;
    position: relative;
    display: flex;
    // width: 100%;
    flex-direction: column;
    // margin-bottom: -10vh;
    .home-header {
      display: flex;
      justify-content: space-between;

      .home-header-title {
        @media screen and (max-height: 700px) {
          margin-top: 0px;
          h3 {
            margin-bottom: 0;
          }
        }
        margin-top: 100px;

        h3 {
          font-size: 34px;
          font-family: Helvetica;
          color: #121b25;
          margin-left: 10px;
          line-height: 46px;
          font-weight: 500;
        }
      }
      .home-header-img {
        margin-top: 20px;
        width: 512px;
        height: 512px;
        @media screen and (max-height: 700px) {
          width: 450px;
          height: 450px;
          padding-bottom: 62px;
        }
        .image-slot {
          width: 498px;
          height: 498px;
          border-radius: 50%;
          background: #f5f4f4;
          position: relative;
          .el-icon-picture-outline,
          .el-icon-loading {
            position: absolute;
            width: 30px;
            height: 30px;
            font-size: 30px;
            color: #4b4a4a7a;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            margin: auto;
          }
        }
      }
    }
    .home-collection {
      // position: absolute;
      position: relative;
      height: 30vh;
      // margin-bottom: 30px;
      // top: 370px;
      > :nth-child(n) {
        position: absolute;
        top: 60%;
        transform: translate(0, -100%);
        @media screen and (max-height: 700px) {
          top: 10%;
        }
      }
      h3 {
        display: inline-block;
        height: 30px;
        font-size: 20px;
        font-family: 'PingFangSC-Regular', 'PingFang SC';
        font-weight: 400;
        color: #121b25;
        line-height: 30px;
        margin-left: 10px;
      }
      .collection-scroll {
        height: 350px;
        margin-top: 31px;

        .wrapper {
          width: calc(100vw - 400px);
          overflow-x: hidden;
          height: 350px;
          position: relative;
        }
        .scroll-lis{
          display: flex;
        }
      }
    }
  }
}
</style>
