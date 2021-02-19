<template>
  <div
    class="collectin-list-item"
    @click="DetailClick"
    @mouseenter="hovershow=true"
    @mouseleave="mouseleaveHandler"
  >
    <div class="hovershow" v-show="isdelete && hovershow">
      <div class="delete_icon" @click.stop="deleteshow=true" v-show="!deleteshow"></div>
      <div class="confirm_delete" v-show="deleteshow" @click.stop>
        <div class="confirm_text">{{$t('lang.unfavorite')}}？</div>
        <div class="deletebtn_group">
          <button class="btn_yes" @click="deleteFavorites">{{$t('lang.yes')}}</button>
          <button class="btn_no" @click="cancelCancel">{{$t('lang.no')}}</button>
        </div>
      </div>
    </div>
    <div class="item-img">
      <el-image :src="collectionItemListInfo.imageUrl" fit="contain">
        <div slot="placeholder" class="image-slot">
          <i class="el-icon-loading"></i>
        </div>
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </div>
    <div class="item-title">
      <h5>{{ collectionItemListInfo.name | nameLeng }}</h5>
      <!-- <span
        :class="{
          greenIn: collectionItemListInfo.status == 0,
          yellow: collectionItemListInfo.status == 1,
          grey: collectionItemListInfo.status == 2,
          wait: collectionItemListInfo.status == 3,
        }"
      >{{ status }}</span>-->
    </div>
    <div class="item-price">
      <div class="item-price-header">
        <div class="price_title">
          <slot name="newest">
            <div class="newest">{{$t('lang.salePrice')}}</div>
          </slot>
          <span
            :class="{
          greenIn: collectionItemListInfo.status == 0,
          yellow: collectionItemListInfo.status == 1,
          grey: collectionItemListInfo.status == 2,
          wait: collectionItemListInfo.status == 3,
        }"
          >{{ status }}</span>
        </div>
        <div class="item-price-img">
          <img src="../../assets/img/ic.Ethereum.png" alt />
        </div>
        <span>{{ Number(collectionItemListInfo.price).toFixed(2)}}</span>
        <p>{{ collectionItemListInfo.priceSymbol }}</p>
      </div>
      <p class="last-price">
        <!-- {{ $t("lang.lastest_price") }}  -->
        &#8776; {{ price }}
      </p>
    </div>
  </div>
</template>

<script>
import { request } from '../../network/request'
export default {
  props: {
    collectionItemListInfo: {
      type: Object,
      default: null
    },
    // 判断类型（市场首页 goods）(我的藏品，收藏 mygoods)
    collectionType: {
      type: String,
      default: 'goods'
    },
    isdelete: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      price: '0',
      // 确认删除 界面
      deleteshow: false,
      // 是否 hover
      hovershow: false
    }
  },
  created() {
    const _this = this
    var language = localStorage.getItem('lang')
    if (language == '') {
      language = 'en_us'
    }
    if (language == 'en_us') {
      if (_this.collectionItemListInfo.priceUsd) {
        _this.price = '$' + _this.collectionItemListInfo.priceUsd.toFixed(2)
      }
    } else if (language == 'zh_cn') {
      if (_this.collectionItemListInfo.priceCny) {
        this.price = '￥' + this.collectionItemListInfo.priceCny.toFixed(2)
      }
    }
  },
  watch: {
    collectionItemListInfo(val){
      console.log(val);
    },
    
    lang(val) {
      const _this = this
      if (val == 'en_us') {
        if (_this.collectionItemListInfo.priceUsd) {
          this.price = '$' + this.collectionItemListInfo.priceUsd.toFixed(2)
        }
      } else if ((val = 'zh_cn')) {
        if (_this.collectionItemListInfo.priceCny) {
          this.price = '￥' + this.collectionItemListInfo.priceCny.toFixed(2)
        }
      }
    }
  },
  computed: {
    lang() {
      return this.$store.state.lang
    },
    status() {
      let router_path = this.$route.path
      if (router_path == '/mycollection') {
        this.collectionItemListInfo.status = 3
        return this.$t('lang.wait')
      }
      if (this.collectionType == 'goods') {
        switch (this.collectionItemListInfo.status) {
          case 0:
            return this.$t('lang.Unsold')
            break
          case 1:
            return this.$t('lang.Locking')
            break
          case 2:
            return this.$t('lang.Sold')
        }
      } else if (this.collectionType == 'mygoods') {
        switch (this.collectionItemListInfo.status) {
          case 0:
            return this.$t('lang.locking')
            break
          case 1:
            return this.$t('lang.lockingsSuccess')
            break
          case 2:
            return this.$t('lang.Sold')
        }
      }
    }
  },
  methods: {
    cancelCancel() {
      this.deleteshow = false
    },
    mouseleaveHandler() {
      this.hovershow = this.deleteshow
    },
    DetailClick() {
      this.$router.push(
        `/assets/${this.collectionItemListInfo.contractAddress}/${this.collectionItemListInfo.tokenId}`
      )
    },
    // 删除藏品
    async deleteFavorites() {
      let token = document.cookie.split(';')[0].split('=')[1]
      const { data: res } = await request.post('/web/favorite/cancelFavorite', {
        assetId: this.collectionItemListInfo.id,
        language: this.$i18n.locale,
        token
      })
      if (res.status == 0) {
        this.$emit('deleteItem', this.collectionItemListInfo.id)
      } else {
        this.$message.error('删除失败')
      }
      this.deleteshow = false
      this.hovershow = false
    }
  },
  filters: {
    nameLeng(val) {
      if (val.length > 20) {
        var a = val.substring(0, 18)
        return (val = a + '...')
      } else {
        return val
      }
    }
  },
  components: {}
}
</script>

<style  lang="less" scope>
.collectin-list-item {
  // width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 3px;
  margin-right: 50px;
  padding: 10px;
  box-sizing: border-box;
  width: 220px;
  position: relative;

  box-shadow: 0px 10px 40px 0px rgba(0, 0, 0, 0.15);
  .hovershow {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 200;
    top: 0;
    left: 0;
    .delete_icon {
      position: absolute;
      top: 0;
      right: 0;
      width: 35px;
      height: 38px;
      background: url('../../assets/img/delete.png');
    }
    .confirm_delete {
      width: 100%;
      height: 100%;
      background: #00000080;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: default;

      .confirm_text {
        font-size: 20px;
        color: #fff;
        font-weight: 300;
        width: 100%;
        text-align: center;
      }
      .deletebtn_group {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 15px;
        padding: 0 40px;
        box-sizing: border-box;
        button {
          width: 60px;
          height: 28px;
          text-align: center;
          border-radius: 14px;
          font-size: 16px;
          outline: none;
          cursor: pointer;
        }
        .btn_yes {
          background-color: #ff02d0;
          border: none;
          color: #fff;
        }
        .btn_no {
          border: 1px solid #ff02d0;
          color: #ff02d0;
        }
      }
    }
  }
  .item-img {
    padding: 2px;
    width: 194px;
    height: 194px;
    cursor: pointer;

    .el-image,
    .image-slot {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      height: 100%;
      width: 100%;
      .image-slot {
        background: #dad8d84b;
        border-radius: 50%;
      }
    }

    .el-icon-picture-outline,
    .el-icon-loading {
      width: 30px;
      height: 30px;
      font-size: 30px;
      color: #63606075;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      margin: auto;
    }
  }
  .item-title {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 22px;

    h5 {
      // width: 113px;
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #121b25;
      line-height: 22px;
      // text-overflow: ellipsis;
      white-space: nowrap;
    }
    .greenIn {
      background: linear-gradient(218deg, #1bd42d 0%, #0aaf04 100%);
      // background: linear-gradient(218deg, #f5b301 0%, #d5ba01 100%);
    }
    .yellow {
      background: linear-gradient(218deg, #f5b301 0%, #d5ba01 100%);
    }
    .grey {
      background: linear-gradient(218deg, #b5b5b5 0%, #d4d4d4 100%);
    }
    .red {
      background: linear-gradient(218deg, #ff5248 0%, #ff02d0 100%);
    }
    .wait {
      background: linear-gradient(218deg, #ff5248 0%, #ff02d0 100%);
    }
    .greenIn,
    .grey,
    .yellow,
    .red,
    .wait {
      display: block;
      padding: 0 8px;
      height: 15px;
      box-shadow: 0px 20px 40px 0px rgba(62, 85, 103, 0.2);
      color: #ffffff;
      font-size: 12px;
      text-align: center;
      line-height: 15px;
    }
  }
  .item-price {
    margin-top: 15px;
    display: flex;
    flex-direction: column;

    .price_title {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .newest {
        font-size: 6px;
        color: #596675;
        margin-bottom: 5px;
      }
      .greenIn {
        background: linear-gradient(218deg, #1bd42d 0%, #0aaf04 100%);
        // background: linear-gradient(218deg, #f5b301 0%, #d5ba01 100%);
      }
      .yellow {
        background: linear-gradient(218deg, #f5b301 0%, #d5ba01 100%);
      }
      .grey {
        background: linear-gradient(218deg, #b5b5b5 0%, #d4d4d4 100%);
      }
      .red {
        background: linear-gradient(218deg, #ff5248 0%, #ff02d0 100%);
      }
      .wait {
        background: linear-gradient(218deg, #ff5248 0%, #ff02d0 100%);
      }
      .greenIn,
      .grey,
      .yellow,
      .red,
      .wait {
        display: block;
        padding: 0 8px;
        height: 15px;
        box-shadow: 0px 20px 40px 0px rgba(62, 85, 103, 0.2);
        color: #ffffff;
        font-size: 12px;
        text-align: center;
        line-height: 15px;
        justify-self: flex-end;
      }
    }

    .item-price-header {
      // height: 21px;
      margin-bottom: 5px;

      .item-price-img {
        width: 12px;
        height: 20px;
        display: inline-block;

        img {
          width: 100%;
          height: 100%;
          vertical-align: top;
        }
      }

      span {
        display: inline-block;
        font-size: 21px;
        color: #ff2495;
        line-height: 21px;
        margin-left: 10px;
        vertical-align: top;
      }

      p {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        color: #b2b2b2;
        // line-height: 21px;
        margin-left: 8px;
      }
    }

    p {
      font-size: 12px;
      color: #b2b2b2;
      margin-top: 2px;
      // padding-bottom: 10px;
    }
  }
}
</style>
