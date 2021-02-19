<template>
  <div
    class="deatil-bg"
    @click.self="deatilClick"
    :class="{ bgLoading: detailLoading }"
  >
    <div class="detail">
      <!-- 内容区域 -->
      <div class="detail-content" @click.self="deatilClick">
        <!-- 左侧详情内容 -->
        <div class="detail-content-l">
          <!-- 图片 -->
          <div class="content-left-img">
            <el-image
              :src="detailInfo.imageUrl"
              fit="contain"
              @click="bigImgClick"
            >
              <div slot="placeholder" class="image-slot">
                <i class="el-icon-loading"></i>
              </div>
              <div slot="error" class="image-slot">
                <i class="el-icon-loading"></i>
              </div>
            </el-image>
          </div>

          <!-- 卡片视图 -->
          <div class="content-left-card">
            <!-- 标题 -->
            <div class="content-left-card-title">
              <h3>{{ detailInfo.contractName }}</h3>
              <h3>{{ detailInfo.name }}</h3>
            </div>

            <!-- 拥有者 -->
            <div class="content-letf-card-owner">
              <span class="owner-l">{{ $t("lang.Owner") }}</span>

              <el-tooltip
                class="item"
                popper-class="owner-change"
                effect="light"
                :content="detailInfo.ownerAddress"
                placement="bottom"
              >
                <span
                  class="owner-r"
                  :data-clipboard-text="detailInfo.ownerAddress"
                  ref="ownerRef"
                >
                  {{ detailInfo.ownerAddress | owner }}
                </span>
              </el-tooltip>
            </div>

            <!-- 详情 -->
            <div class="content-letf-card-detail">
              <span>{{ $t("lang.Detail") }}</span>
            </div>
            <p class="card-description">{{ detailInfo.description }}</p>
            <!-- 关于 -->
            <div class="content-letf-card-detail">
              <span>{{ $t("lang.about") }} {{ detailInfo.contractName }}</span>
            </div>
            <p class="card-description">
              {{
                this.$i18n.locale == "en_us"
                  ? detailInfo.aboutEn
                  : detailInfo.aboutZh
              }}
            </p>
          </div>
        </div>
        <!-- 右侧详情内容 -->
        <div class="detail-content-r" @click.self="socialSharing = false">
          <!-- 标题 -->
          <div class="content-right-title" @click.self="socialSharing = false">
            <span>{{ detailInfo.name }}</span>
            <ul class="content-right-title-icons">
              <!-- 收藏 -->
              <li class="favorites-change">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :visible-arrow="false"
                  :content="$t('lang.Favorite')"
                  placement="top"
                >
                  <i
                    class="el-icon-star-off"
                    @click="addFavoritesClick"
                    v-if="favoritesChange"
                  ></i>
                  <i
                    class="el-icon-star-on"
                    @click="delFavoritesClick"
                    v-else
                    style="color: red"
                  ></i>
                </el-tooltip>
              </li>
              <!-- 刷新 -->
              <li class="reset" @click="resetClick">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :visible-arrow="false"
                  :content="$t('lang.refresh')"
                  placement="top"
                >
                  <i class="el-icon-ico_reset iconfont"></i>
                </el-tooltip>
              </li>
              <!-- 转移 -->
              <li class="transfer">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :visible-arrow="false"
                  :content="$t('lang.Transfer')"
                  placement="top"
                >
                  <i class="el-icon-zhuanyi iconfont"></i>
                </el-tooltip>
              </li>
              <!-- 跳转链接 -->
              <li>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :visible-arrow="false"
                  :content="$t('lang.ViewOn') + '' + detailInfo.name"
                  placement="top"
                >
                  <a
                    :href="detailInfo.externalLink"
                    target="_blank"
                    class="view-on"
                  >
                    <i class="el-icon-fenxiang_2 iconfont"></i>
                  </a>
                </el-tooltip>
              </li>
              <!-- 社交分享 -->
              <li class="social-sharing">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :visible-arrow="false"
                  :content="$t('lang.Share')"
                  placement="top"
                >
                  <i
                    class="el-icon-share"
                    @click="socialSharing = !socialSharing"
                  ></i>
                </el-tooltip>
                <!-- 社交分享区域 -->
                <ul v-show="socialSharing">
                  <li
                    :data-clipboard-text="shareUrl"
                    ref="shareLinkRef"
                    @click="copyUrlClick(0)"
                    @mouseover="copyUrlClick(0)"
                  >
                    <i class="el-icon-link"></i>
                    {{ this.$t("lang.copyUrl") }}
                  </li>
                  <li @click="shareFacebookClick">
                    <i class="el-icon-facebook iconfont"></i>
                    {{ this.$t("lang.shareFacebook") }}
                  </li>
                  <li @click="shareTwiterClick">
                    <i class="iconfont el-icon-twitter"></i>
                    {{ this.$t("lang.sharTwiter") }}
                  </li>
                  <li @click="sharePictrueClick">
                    <i class="el-icon-tickets"></i>
                    {{ this.$t("lang.CreatePictorial") }}
                  </li>
                  <li>
                    <i class="el-icon-zitidaima iconfont"></i>
                    {{ this.$t("lang.embedAsset") }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <!-- 价格区域 -->
          <div class="content-right-price">
            <!-- 左侧价格 -->
            <div class="price-l">
              <span>{{ $t("lang.Sale_Price") }}</span>
              <div class="price-l-name">
                <img src="../../assets/img/ic.Ethereum.png" alt />
                <p>
                  <span>{{
                    detailInfo.price && detailInfo.price.toFixed(2)
                  }}</span>
                  {{
                    "" + detailInfo.priceSymbol ? detailInfo.priceSymbol : ""
                  }}
                </p>
              </div>

              <div class="last-price">&#8776; {{ price }}</div>
            </div>
            <!-- 右侧按钮 -->
            <div class="price-btns">
              <button
                v-loading="buyLoading"
                :class="detailInfo.status == 0 ? 'btn-buy' : 'no-buy'"
                @click="buyClick"
              >
                <div>
                  <img src="../../assets/img/ic.Combined.png" alt />
                  {{ $t("lang.Buy") }}
                </div>
              </button>
              <button class="btn-make">
                <div>{{ $t("lang.Makeoffer") }}</div>
              </button>
            </div>
          </div>
          <!-- 价格历史折线图 -->
          <div class="content-right-price-history">
            <!-- 标题 -->
            <div class="content-right-price-history-title">
              <img src="../../assets/img/pricehistoryicon.png" alt="" />
              <span>{{ $t("lang.priceHistory") }}</span>
            </div>
            <!-- 下拉选择 -->
            <div class="content-right-price-history-select">
              <el-select
                v-model="priceHistoryParams.limit"
                :placeholder="$t('lang.allday')"
                @change="secchange"
              >
                <el-option
                  v-for="item in dataOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <div class="content-right-price-history-assetAvgPrice">
                <p class="assetAvgPrice-text">{{ assetAvgPriceText }}</p>
                <p class="assetAvgPrice-price">
                  Ξ{{
                     priceHistoryInfo.assetAvgPrice && priceHistoryInfo.assetAvgPrice.toFixed(2)
           
                   
                  }}
                </p>
              </div>
            </div>
            <!-- 折线图 -->
            <!-- 有数据 -->
            <div class="price-history">
              <div
                v-show="priceHistoryData"
                id="echartsCard"
                class="price-history-hasdata"
                style="width: 445px; height: 270px"
                ref="priceHistoryRef"
              ></div>

              <!-- 无数据 -->
              <div  v-show="!priceHistoryData" class="price-history-nodata">
                <img src="../../assets/img/nopricehistory.png" alt="" />
                <span>{{ $t("lang.noPriceHistory") }}</span>
              </div>
            </div>
            <div class="content-right-price-history-contractAvgPrice">
              <img :src="contractImg" alt="">
              <i></i><span>{{ detailInfo.contractName }}</span>

              <div class="price-history-contractAvgPrice">
                <p class="contractAvgPrice-text">{{ assetAvgPriceText }}</p>
                <p class="contractAvgPrice-price">
                  Ξ{{
                    
                    priceHistoryInfo.contractAvgPrice && priceHistoryInfo.contractAvgPrice.toFixed(2)
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- relate模块 -->
          <div
            class="content-right-relate"
            v-loading="relateLoading"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(234,238,241,0)"
          >
            <div class="relate-title">
              <span>{{ $t("lang.Relate") }}</span>

              <div class="relate-more" @click="relateImgClick">
                <i></i>
                <i></i>
                <i></i>
              </div>
              <!-- <img
                src="../../assets/img/ic.Back.right.png"
                alt=""
                @click="relateImgClick"
              /> -->
            </div>
            <div class="relate-list">
              <ul>
                <li
                  v-for="(item, index) in relateInfo"
                  :key="index"
                  @click="goDeatilClick(index)"
                >
                  <div class="relate-img">
                    <el-image :src="item.imageUrl" fit="contain">
                      <div slot="placeholder" class="image-slot">
                        <i class="el-icon-loading"></i>
                      </div>
                      <div slot="error" class="image-slot">
                        <i class="el-icon-loading"></i>
                      </div>
                    </el-image>
                  </div>
                  <span class="relate-name">{{ item.name }}</span>
                  <p class="relate-price">
                    <span>{{ item.price && item.price.toFixed(2) }}</span>
                    {{ "" + item.priceSymbol ? item.priceSymbol : "" }}<br />
                    &#8776; {{ price }}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 购买成功 -->
      <el-dialog
        :title="this.$t('lang.Notice')"
        :visible.sync="buySucessDialogVisible"
        center
        :before-close="cancelClick"
      >
        <div class="buy-success-text">
          <h3>{{ $t("lang.Congratulations_") }}</h3>
        </div>
        <div class="buy-img">
          <div class="img">
            <img :src="detailInfo.imageUrl" alt />
          </div>
          <h5 @click="$router.push('/personalcenter/mycollection')">
            {{ $t("lang.My_collection") }}
          </h5>
        </div>

        <div class="buy-success-btns">
          <button
            class="btn-share"
            @click="copyUrlClick(1)"
            @mouseover="copyUrlClick(1)"
            :data-clipboard-text="shareUrl"
            ref="buySuccessCopyRef"
          >
            {{ $t("lang.Share") }} >
          </button>
          <button class="btn-cancel" @click="cancelClick">
            {{ $t("lang.cancel") }}
          </button>
        </div>
      </el-dialog>
      <!-- 图片分享 -->
      <div
        class="share-dialog"
        ref="shareDialog"
        @click.self="shareDialogClick($event)"
      >
        <div v-if="bigImgShow">
          <div v-show="creatLoading" class="creat-loading">
            <i class="el-icon-loading"></i>
          </div>

          <div class="share-card" v-show="!creatLoading">
            <div class="share-pictrue" ref="sharePictrue">
              <div class="share-pictrue-content">
                <div class="share-pictrue-content-header">
                  <img src="../../assets/img/card1.png" alt="" />
                </div>

                <div class="share-picture-content-text">
                  <div class="content-left"></div>
                  <div class="content-right"></div>
                  <div class="share-picture-img">
                    <!-- <img :src="detailInfo.imageUrl" alt=""> -->
                  </div>
                  <div class="share-picture-title">
                    <span>{{ detailInfo.name }}</span>
                    <p>{{ detailInfo.contractName }}</p>
                  </div>

                  <div class="shar-picture-owner-price">
                    <div class="share-picture-owner">
                      <span>{{ $t("lang.Owner") }}</span>
                      <p>{{ detailInfo.ownerAddress }}</p>
                    </div>
                    <div class="share-picture-price">
                      <span>{{ $t("lang.Sale_Price") }}</span>
                      <p>
                        <span>{{
                          detailInfo.price && detailInfo.price.toFixed(2)
                        }}</span>
                        {{
                          "" + detailInfo.priceSymbol
                            ? detailInfo.priceSymbol
                            : ""
                        }}
                      </p>
                      <p class="share-picture-price-lastprice">{{ price }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="share-pritrue-footer">
                <div class="share-pritrue-footer-l">
                  <img src="../../assets/img/logo02.png" alt="" />
                  <div class="share-pritrue-footer-l-title">
                    <img src="../../assets/img/card02.png" alt="" />
                    <p class="china-first">{{ $t("lang.ChinaFirst") }}</p>
                  </div>
                </div>
                <div class="share-ercard-r">
                  <div id="qrcode" ref="qrcodeRef"></div>
                </div>
              </div>
            </div>

            <div class="share-card-btns">
              <button @click="downPictureClick">{{ $t("lang.save") }}</button>
            </div>
          </div>
        </div>

        <div class="content-bigImg" v-else>
          <img :src="detailInfo.imageUrl" alt="" />
        </div>
      </div>
    </div>

    <div class="detail-bg-loading" v-if="detailLoading">
      <div class="detail-bg-loading-icon">
        <i class="el-icon-loading"></i>
      </div>
    </div>

    <foot-bar></foot-bar>
  </div>
</template>

<script>
import { request } from "network/request";
import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
import FootBar from "components/common/footer.vue";
import collectionListItem from "components/collectionInfo/collectionListItem";
import { getToken } from "@/utils/utils.js";

import echarts from "echarts/lib/echarts";
require("echarts/lib/chart/bar");
require("echarts/lib/chart/line");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");

export default {
  data() {
    return {
      detailLoading: true,
      // token值
      token: "",
      // 大图状态
      bigImgShow: true,
      // 登录状态
      isLogin: false,
      // relateLoading
      relateLoading: true,
      // 收藏切换
      favoritesChange: true,
      // 是否拥有
      isOwner:false,
      // 详情数据
      detailInfo: {},
      // 详情数据请求参数
      detailParam: {
        tokenId: "",
        contractAddress: "",
        language: "",
      },
      // 账户数据
      accountInfo: {},

      // relate列表
      relateInfo: [],
      // relate请求参数
      relateParam: {
        contractId: "",
        page: 1,
        pageSize: 4,
        sort: "",
        language: "",
      },
      // 价格
      price: "",
      // 购买loading
      buyLoading: false,
      // 购买成功对话框
      buySucessDialogVisible: false,
      // 分享链接
      shareUrl: "",
      // 社交分享显示
      socialSharing: false,
      // 画报生成loading
      creatLoading: true,
      // 价格历史
      priceHistoryParams: {
        assetId: 0,
        contractId: 0,
        language: 0,
        limit: 30,
      },

      // 价格历史
      priceHistoryInfo: {},
      priceHistoryInfoData: [],
      priceHistoryInfoPrice: [],

      priceHistoryData: true,
      assetAvgPriceText: this.$t("lang.30day"),

      // 日期选择
      dataOptions: [
        {
          value: 7,
          label: this.$t("lang.7day"),
        },
        {
          value: 14,
          label: this.$t("lang.14day"),
        },
        {
          value: 30,
          label: this.$t("lang.30day"),
        },
        {
          value: 60,
          label: this.$t("lang.60day"),
        },
        {
          value: 90,
          label: this.$t("lang.90day"),
        },
        {
          value: 360,
          label: this.$t("lang.360day"),
        },        {
          value: 0,
          label: this.$t("lang.allday"),
        },
      ],
      //  合约列表
      contractImg: '',
    };
  },
  mounted() {},
  created() {
    // 保存当前链接
    this.shareUrl = window.location.href;
    // 判断登录状态,保存token
    if (document.cookie.indexOf("token") != -1) {
      this.token = getToken();
      this.isLogin = true;
      this.getAccountInfo();
    }
    // 保存详情的地址以及合约id
    this.detailParam.tokenId = this.$route.params.id;
    this.detailParam.contractAddress = this.$route.params.contractAddress;
    // 请求当前藏品详情
    this.getDetailInfo();
  },

  methods: {
    // 创建
    drawEcharts() {
      var myChart = echarts.init(document.querySelector("#echartsCard"));

      myChart.setOption({
        tooltip: {
          trigger: "axis",
        },
        legend: {},

        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.priceHistoryInfoData,
        },
        yAxis: {
          type: "value",
          show: true,
          min: 0,
          max: function (value) {
            return Math.ceil(value.max + value.min);
          },
        },
        series: [
          {
            name: "History Price",
            type: "line",
            smooth: true,
            data: this.priceHistoryInfoPrice,
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(44, 117, 243, 1)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(178, 238, 255, 0)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      });
    },

    // 页面点击
    deatilClick() {
      this.socialSharing = false;
      this.bigImgShow = false;
    },
        // 请求合约列表
    async getAllContract() {
      const { data: res } = await request.get('/web/Contract/findAllContract', {
        params: {
          language: this.$i18n.locale
        }
      })
      if (res.status == 0) {
        var target = res.data.filter(item =>{
          return item.id == this.detailInfo.contractId
        })
        this.contractImg = target[0].imageUrl
      }
    },

    // 点击大图
    bigImgClick() {
      this.$refs.shareDialog.style.display = "block";
      this.bigImgShow = false;
    },

    // 获取当前藏品详情数据
    async getDetailInfo() {
      this.detailParam.language = this.$i18n.locale;
      const { data: res } = await request.get("/web/asset/assetInfo", {
        params: this.detailParam,
      });
      if (res.status == 0) {
        this.detailInfo = res.data;
        // 获取相关数据
        this.getRelateInfo();
        // 获取价格历史
        this.getPriceHistory();
        // 获取合约图
        this.getAllContract()
        if (this.isLogin) {
          this.booleanFavorite();
        }
        if (this.detailInfo.priceCny || this.detailInfo.priceUsd) {
          this.price =
            this.$i18n.locale == "zh_cn"
              ? "￥" + this.detailInfo.priceCny.toFixed(2)
              : "$" + this.detailInfo.priceUsd.toFixed(2);
        } else {
          this.price = 0;
        }
      }
    },
    // 获取当前账户信息
    async getAccountInfo() {
      const { data: res } = await request.post("/web/account/info", {
        token: this.token,
        language: this.$i18n.locale,
      });
      if (res.status == 0) {
        this.accountInfo = res.data;
      }
    },
    // 获取当前藏品的交易历史
    async getPriceHistory() {
      this.priceHistoryParams.assetId = this.detailInfo.id;
      this.priceHistoryParams.contractId = this.detailInfo.contractId;
      this.priceHistoryParams.language = this.$i18n.locale;

      const { data: res } = await request.post(
        "/web/history/priceHistory",
        this.priceHistoryParams
      );
      if (Object.keys(res.data.priceData).length == 0) {

        this.priceHistoryData = false;
      
      } else {
        this.priceHistoryData = true
        this.priceHistoryInfoData = []
        this.priceHistoryInfoPrice = []
        for (var k in res.data.priceData) {
          this.priceHistoryInfoData.push(k);
          this.priceHistoryInfoPrice.push(res.data.priceData[k]);
        }
        setTimeout(() => {
          this.drawEcharts();
        }, 1000);
      }
       this.priceHistoryInfo = res.data;

      // this.drawLine()
    },
    secchange(val) {
      this.priceHistoryParams.limit = val;
      this.priceHistoryInfo = [];
      this.getPriceHistory();

      switch (val) {
        case 0:
          this.assetAvgPriceText = this.$t("lang.allDayPrice");
          break;
        case 7:
          this.assetAvgPriceText = this.$t("lang.7dayPrice");
          break;
        case 14:
          this.assetAvgPriceText = this.$t("lang.14dayPrice");
          break;
        case 30:
          this.assetAvgPriceText = this.$t("lang.30dayPrice");
          break;
        case 60:
          this.assetAvgPriceText = this.$t("lang.60dayPrice");
          break;
        case 90:
          this.assetAvgPriceText = this.$t("lang.90dayPrice");
          break;
        case 360:
          this.assetAvgPriceText = this.$t("lang.360dayPrice");
          break;
      }
    },
    // 判断当前用户是否拥有收藏
    async booleanFavorite() {
      const { data: res } = await request.post(
        "/web/favorite/booleanFavorite",
        {
          assetId: this.detailInfo.id,
          language: this.$i18n.locale,
          token: this.token,
        }
      );
      this.favoritesChange = !res.data.isFavorite;
    },
    // 添加收藏
    async addFavoritesClick() {
      if (this.isLogin == false) {
        this.$message.error(this.$t("lang.please_login"));
        return;
      }
      const { data: res } = await request.post("/web/favorite/submitFavorite", {
        assetId: this.detailInfo.id,
        language: this.$i18n.locale,
        token: this.token,
      });
      if (res.status == 0) {
        this.$message.success(res.msg);
        this.booleanFavorite();
      } else {
        this.$message.error(res.msg);
      }
    },
    // 取消收藏
    async delFavoritesClick() {
      const { data: res } = await request.post("/web/favorite/cancelFavorite", {
        assetId: this.detailInfo.id,
        language: this.$i18n.locale,
        token: this.token,
      });
      if (res.status == 0) {
        this.$message.success(res.msg);
        this.booleanFavorite();
      } else {
        this.$message.error(res.msg);
      }
    },
    // 刷新
    async resetClick() {
      this.detailLoading = true;
      const { data: res } = await request.get("/web/asset/updateAsset", {
        params: {
          tokenId: this.detailInfo.tokenId,
          contractId: this.detailInfo.contractId,
          language: this.$i18n.locale,
        },
      });
      if (res.status == 0) {
        this.detailInfo = res.data;
      }
      this.detailLoading = false;
    },
    // 获取relate数据
    async getRelateInfo() {
      this.relateParam.contractId = this.detailInfo.contractId;
      this.relateParam.language = this.$i18n.locale;
      const { data: res } = await request.post(
        "/web/asset/list",
        this.relateParam
      );
      if (res.status == 0) {
        this.relateInfo = res.data.content;
        this.detailLoading = false;
      }
    },
    // relate跳转
    goDeatilClick(index) {
      this.$router.push(
        `/assets/${this.relateInfo[index].contractAddress}/${this.relateInfo[index].tokenId}`
      );
      location.reload();
    },
    // 购买
    buyClick() {
      if (this.isLogin == false) {
        this.$message.error(this.$t("lang.please_login"));
        return;
      }
      if (this.detailInfo.status != 0) return;
      if (this.accountInfo.totalUsd < this.detailInfo.priceUsd) {
        this.$message.error(this.$t("lang.Balance_shortfall"));
        return;
      }

      this.$confirm(this.$t("lang.confirm_purchase"), {
        confirmButtonText: this.$t("lang.ok"),
        cancelButtonText: this.$t("lang.cancel"),
        type: "warning",
      })
        .then(async () => {
          this.buyLoading = true;
          const { data: res } = await request.post("/web/asset/buy", {
            id: this.detailInfo.id,
            token: this.token,
            language: this.$i18n.locale,
          });

          if (res.status == 0) {
            this.buySucessDialogVisible = true;
            this.buyLoading = false;
          } else {
            this.$message.error(res.msg);
            this.buyLoading = false;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("lang.Cancel_purchase"),
          });
          this.buyLoading = false;
        });
    },
    // 购买成功对话框关闭
    cancelClick() {
      this.buySucessDialogVisible = false;
      this.getDetailInfo();
    },
    // 复制链接
    copyUrlClick(index) {
      const shareLinkRef = this.$refs.shareLinkRef;
      const buySuccessCopyRef = this.$refs.buySuccessCopyRef;
      const ref = index == 0 ? shareLinkRef : buySuccessCopyRef;
      const that = this;
      if (this.clipboard != null) {
        const clipboard = new this.clipboard(ref);
        clipboard.on("success", function (val) {
          that.$message({
            message: that.$t("lang.c_success"),
            type: "success",
          });
        });
        clipboard.on("error", function () {
          that.$message.error(that.$t("lang.c_failed"));
        });
      }
      this.clipboard = null;
    },
    relateImgClick() {
      this.$store.commit("detailCurrent", this.relateParam.contractId);
      this.$router.push("/market");
    },
    // facebooke分享
    shareFacebookClick() {
      var baseUrl = "http://www.facebook.com/sharer.php?u=";
      window.open(baseUrl + this.shareUrl);
    },
    // 推特分享
    shareTwiterClick() {
      var baseUrl = "https://twitter.com/intent/tweet?url=";
      window.open(baseUrl + this.shareUrl);
    },
    // 画报分享
    async sharePictrueClick() {
      this.creatLoading = true;
      this.$refs.shareDialog.style.display = "block";
      this.bigImgShow = true;

      // 图片跨域
      const { data: res } = await request.get("/file/getImgStream", {
        params: {
          url: this.detailInfo.imageUrl,
        },
        responseType: "blob",
      });
      // 生成链接
      let url = window.URL.createObjectURL(res);
      // 创建元素
      var img = document.createElement("img");
      img.src = url;
      img.style.maxWidth = "288px";
      img.style.maxHeight = "288px";
      img.style.verticalAlign = "middle";
      // 添加元素
      var shareImages = document.querySelector(".share-picture-img");
      if (!shareImages.hasChildNodes()) {
        shareImages.appendChild(img);
      }
      // 生成二维码
      this.$refs.qrcodeRef.innerHTML = "";
      let qrcode = new QRCode(this.$refs.qrcodeRef, {
        width: 78,
        height: 78,
        text: this.shareUrl, // 二维码地址
      });
      this.creatLoading = false;
    },

    // 画报保存
    downPictureClick() {
      // 延时调用，确认二维码加载完毕
      setTimeout(() => {
        this.html2canvas();
      }, 1000);
    },
    //  dom转图片
    html2canvas() {
      var that = this;
      var dataurl;
      const opts = {
        taintTest: false,
        useCORS: true,
        allowTaint: false,
        logging: false,
        scale: 3,
      };

      html2canvas(this.$refs.sharePictrue, opts).then(function (canvas) {
        dataurl = canvas.toDataURL("image/jpg");
        that.getObjectURL(that.dataURLtoBlob(dataurl));
      });
    },
    // base64转blob
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    // blob转url
    getObjectURL(file) {
      //创建下载的链接
      var link = document.createElement("a");
      // 创建url
      var href = window.URL.createObjectURL(file);
      link.href = href;
      //下载后文件名
      link.download = "share.png";
      document.body.appendChild(link);
      //点击下载
      link.click();
      //下载完成移除元素
      document.body.removeChild(link);
      //释放掉blob对象
      window.URL.revokeObjectURL(href);
    },
    // 画报分享遮罩层隐藏
    shareDialogClick() {
      this.$refs.shareDialog.style.display = "none";
    },
  },
  filters: {
    owner(value) {
      if (value && value.length > 10) {
        var subStr1 = value.substr(0, 6);
        var subStr2 = value.substr(value.substr.length - 5, 5);
        var subStr = subStr1 + "..." + subStr2;
        return subStr;
      } else {
        return value;
      }
    },

  },

  watch: {
    "$i18n.locale": function () {
      this.price =
        this.$i18n.locale == "zh_cn"
          ? "￥" + this.detailInfo.priceCny.toFixed(2)
          : "$" + this.detailInfo.priceUsd.toFixed(2);

        this.dataOptions = [
        {
          value: 7,
          label: this.$t("lang.7day"),
        },
        {
          value: 14,
          label: this.$t("lang.14day"),
        },
        {
          value: 30,
          label: this.$t("lang.30day"),
        },
        {
          value: 60,
          label: this.$t("lang.60day"),
        },
        {
          value: 90,
          label: this.$t("lang.90day"),
        },
        {
          value: 360,
          label: this.$t("lang.360day"),
        },        {
          value: 0,
          label: this.$t("lang.allday"),
        },
      ]

    },
    relateInfo() {
      this.relateLoading = false;
    },
  },

  components: {
    FootBar,
    collectionListItem,
  },
};
</script>

<style  lang="less" scope>
.deatil-bg {
  width: 100%;
  background: #eef0f4;
}

.bgLoading {
  height: calc(100vh - 56px);
  overflow: hidden;
}

.detail-bg-loading {
  position: fixed;
  bottom: 0;
  top: 56px;
  left: 0;
  right: 0;
  z-index: 9999;
  background: rgba(234, 238, 241, 1);

  .detail-bg-loading-icon {
    position: absolute;
    top: 45%;
    left: 50%;
    .el-icon-loading {
      color: #645c5c;
      font-size: 35px;
    }
  }
}

.detail {
  position: relative;
  width: 1440px;
  margin: 0 auto;
  background: #eef0f4;
  padding-top: 35px;
  // 内容区域
  .detail-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    min-height: 750px;
    // 左侧部分
    .detail-content-l {
      position: relative;
      min-width: 770px;
      .content-left-img {
        cursor: pointer;
        position: relative;
        z-index: 0;
        width: 310px;
        height: 310px;
        display: inline-block;
        vertical-align: top;

        .el-image,
        .el-slot {
          position: relative;
          width: 100%;
          height: 100%;
          .image-slot {
            width: 100%;
            height: 100%;
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
      .content-left-card {
        position: relative;
        z-index: 1;
        display: inline-block;
        width: 458px;
        // min-height: 675px;
        background: #eeeeee;
        box-shadow: 0px 40px 80px 0px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
        margin-left: -10px;
        box-sizing: border-box;
        padding: 30px 55px;

        .content-left-card-title {
          height: 100px;
          h3 {
            font-size: 25px;
            font-family: Helvetica;
            color: #121b25;
            line-height: 46px;
            font-weight: 500;
            margin: 0;
          }
        }
        .content-letf-card-owner {
          height: 28px;
          margin-top: 30px;
          position: relative;
          font-weight: 400;
          color: #121b25;
          line-height: 28px;

          .owner-l {
            display: inline-block;
            font-size: 20px;
            font-family: "PingFangSC-Regular", "PingFang SC";
          }
          .owner-r {
            cursor: pointer;
            display: inline-block;
            margin-left: 50px;
            height: 28px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
          }
          .owner-change {
            display: block;
            line-height: 20px;
            border: 1px solid #c3c3c3;
            font-size: 12px;
            border-radius: 5px;
            text-align: center;
          }
        }
        .content-letf-card-detail {
          margin-top: 50px;
          height: 28px;

          span {
            height: 28px;
            font-size: 20px;
            font-family: "PingFangSC-Regular", "PingFang SC";
            font-weight: 400;
            color: #121b25;
            line-height: 28px;
          }
        }
        .card-description {
          font-size: 14px;
          font-family: "PingFangSC-Regular", "PingFang SC";
          font-weight: 400;
          color: #121b25;
          line-height: 20px;
          margin-top: 13px;
          word-wrap: break-word;
        }
      }
    }
    // 右侧区域
    .detail-content-r {
      margin-right: 100px;
      width: 505px;
      // 标题
      .content-right-title {
        display: flex;
        height: 40px;
        align-items: center;
        justify-content: space-between;
        font-size: 24px;
        color: #9e9e9e;

        span {
          width: 250px;
          display: block;
          color: rgba(18, 27, 37, 1);
          font-size: 16px;
        }
        .content-right-title-icons {
          display: flex;
          width: 200px;
          height: 40px;
          margin: 0;
          li {
            cursor: pointer;
            border-top-left-radius: 5px;
            width: 40px;
            text-align: center;
            line-height: 40px;
            font-size: 24px;
            .iconfont {
              font-size: 24px;
            }
            .view-on {
              color: #9e9e9e;
            }
            .view-on:hover {
              color: #000;
            }
          }
          .el-icon-share:hover,
          li:hover {
            transform: scale(1.1);
            transition: all 0.2s ease-in;
            color: #000;
          }
          .social-sharing:hover {
            transform: scale(1);
          }
          .favorites-change {
            font-size: 27px;
          }
          .social-sharing {
            position: relative;
            ul {
              position: absolute;
              left: -170px;
              width: 175px;
              padding: 0;
              background: #fff;
              border: 1px solid #999;
              border-radius: 5px;
              padding: 0 15px;
              li {
                width: 100%;
                text-align: left;

                line-height: 35px;
                color: rgb(158, 158, 158);
                font-size: 15px;
                font-weight: 400;

                i {
                  font-size: 15px;
                  line-height: 35px;
                }
              }
              li:hover {
                color: #000;
                transform: scale(1);
              }
            }
          }
        }
      }
      // 价格
      .content-right-price {
        margin-top: 40px;
        display: flex;
        justify-content: space-between;

        .price-l {
          width: 250px;
          height: 130px;

          span {
            color: #596675;
            font-size: 12px;
            vertical-align: top;
            line-height: 17px;
          }

          .price-l-name {
            margin-top: 15px;
            display: flex;
            img {
              height: 17px;
              width: 12px;
            }
            p {
              margin-left: 7px;
              font-size: 20px;
              color: #b2b2b2;
              height: 36px;
              span {
                font-size: 36px;
                color: #ff2495;
              }
            }
          }
          .last-price {
            font-size: 20px;
            color: #b2b2b2;
            margin-top: 20px;
          }
        }
        .price-btns {
          width: 145px;
          height: 130px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          button {
            cursor: pointer;
            width: 143px;
            height: 59px;
            border-radius: 50px;
            border: none;
            box-shadow: 0 15px 25px 0 rgba(59, 45, 143, 0.4);
            outline: none;
          }

          .btn-buy {
            cursor: pointer;
            background: linear-gradient(#13ccd7, #379aee, #4d65db, #622ec3);
            height: 59px;
            font-size: 18px;
            font-family: Avenir-Medium, Avenir;
            font-weight: 500;
            color: #ffffff;
            line-height: 59px;
            /deep/ .el-loading-mask {
              border-radius: 28.5px;
            }
          }
          .no-buy {
            height: 59px;
            font-size: 18px;
            font-family: Avenir-Medium, Avenir;
            font-weight: 400;
            background: #c1c2c2;
            line-height: 59px;
            color: #fff;
          }
          .btn-make {
            background-color: #c1c2c2;
            font-size: 18px;
            font-family: "Avenir-Medium", "Avenir";
            font-weight: 500;
            color: #ffffff;
          }
        }
      }
      // 价格历史
      .content-right-price-history {
        width: 505px;
        height: 480px;
        background: #eeeeee;
        box-shadow: 0px 20px 40px 0px rgba(192, 192, 192, 0.25);
        border-radius: 10px;
        margin-top: 40px;
        box-sizing: border-box;
        padding: 30px;

        .content-right-price-history-title {
          display: flex;
          align-items: center;
          height: 28px;
          img {
            width: 24px;
          }
          span {
            margin-left: 3px;
            display: block;
            max-lines: 3px;

            height: 28px;
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #3b434b;
            line-height: 28px;
          }
        }
        .content-right-price-history-select {
          margin-top: 20px;
          display: flex;
          .el-select {
            .el-input__inner {
              width: 120px;
              height: 46px;
              background: #f9fafc;
              border-radius: 4px;
              border: 1px solid #c8c9c9;
            }
          }
          .content-right-price-history-assetAvgPrice {
            margin-left: 13px;
            .assetAvgPrice-text {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #868c93;
              line-height: 21px;
            }
            .assetAvgPrice-price {
              height: 25px;
              font-size: 16px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #3a94ec;
              line-height: 25px;
            }
          }
        }
        .price-history {
          height: 270px;

          .price-history-nodata {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            img {
              width: 138px;
              height: 101px;
            }
            span {
              margin-top: 10px;
              height: 17px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #868c93;
              line-height: 17px;
            }
          }
        }
        .content-right-price-history-contractAvgPrice {
          height: 35px;
          align-items: center;
          display: flex;
          img{
             width: 24px;
            height: 24px;
             border-radius: 50%;
          } 
          span {
            margin-left: 8px;
            height: 28px;
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #3b434b;
            line-height: 28px;
          }
          .price-history-contractAvgPrice {
            margin-left: 13px;
            .contractAvgPrice-text {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #868c93;

              line-height: 17px;
            }
            .contractAvgPrice-price {
              height: 25px;
              font-size: 16px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #3a94ec;

              line-height: 22px;
            }
          }
        }
      }
      // 相关
      .content-right-relate {
        margin-top: 50px;
        height: 300px;
        .relate-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 58px;

          .relate-more {
            display: flex;
            justify-content: space-between;
            width: 23px;
            height: 58px;
            cursor: pointer;
            align-items: center;
            font-size: 0;

            i {
              display: block;
              width: 5px;
              border-radius: 50%;
              height: 5px;
              background: #7a8fa6;
            }
          }
        }
        .relate-list {
          ul {
            padding: 0;
            width: 505px;
            display: flex;
            justify-content: space-between;
            li {
              width: 108px;
              cursor: pointer;
              .relate-img {
                width: 108px;
                height: 108px;
                .el-image,
                .el-slot {
                  position: relative;
                  width: 100%;
                  height: 100%;
                  .image-slot {
                    width: 100%;
                    height: 100%;
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
              .relate-name {
                display: block;
                margin: 10px 0 17px 0;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #121b25;
                line-height: 22px;
                white-space: nowrap; /* 使文本不可换行 */
                overflow: hidden; /* 隐藏溢出部分 */
                text-overflow: ellipsis;
              }
              .relate-price {
                width: 100px;
                height: 57px;
                font-size: 14px;
                font-family: Helvetica;
                color: rgba(178, 178, 178, 1);
                line-height: 17px;
                span {
                  color: rgba(255, 36, 149, 1);
                }
              }
            }
          }
        }
      }
    }
  }

  .el-dialog {
    width: 564px;
    height: 633px;
    border-radius: 35px;
    overflow: hidden;
    background: rgb(240, 240, 240);
    .el-dialog__header {
      height: 80px;
      background: #ffffff;

      .el-dialog__title {
        line-height: 80px;
        font-size: 24px;
        font-family: "Avenir-Medium", "Avenir";
        font-weight: 500;
        color: #222222;
      }
      .el-dialog__close {
        width: 40px;
        height: 40px;
        background: rgba(8, 8, 8, 1);
        border-radius: 50%;
        margin-top: 15px;
        color: #ffffff;
        font-size: 25px;
        line-height: 40px;
      }
    }
    .el-dialog__body {
      text-align: center;
      padding: 0;
      .buy-success-text {
        h3 {
          margin: 0 auto;
          margin-top: 70px;
          width: 350px;
          height: 80px;
          font-size: 30px;
          font-family: Avenir-Medium, Avenir;
          font-weight: 500;
          color: #222222;
          line-height: 40px;
        }
      }
      .buy-success-text::after {
        content: "";
        display: block;
        width: 32px;
        height: 8px;
        background: rgba(34, 34, 34, 0.25);
        margin: 0 auto;
        margin-top: 17px;
      }
      .buy-img {
        width: 182px;
        height: 154px;
        background: #ffffff;
        box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.15);
        border-radius: 5px;
        margin: 0 auto;
        margin-top: 50px;
        text-align: center;

        img {
          width: 67px;
          height: 67px;
          margin: 0 auto;
          margin-top: 28px;
          img {
            max-width: 100%;
            max-height: 100%;
            vertical-align: top;
          }
        }

        h5 {
          cursor: pointer;
          font-size: 15px;
          font-family: Avenir-Medium, Avenir;
          font-weight: 500;
          color: #666666;
          line-height: 60px;
          letter-spacing: 1px;
          margin: 0;
        }
      }

      .buy-success-btns {
        margin: 0 auto;
        margin-top: 40px;
        width: 260px;
        height: 60px;

        button {
          border: none;
          outline: none;
          width: 120px;
          height: 60px;
          border-radius: 50px;
          cursor: pointer;
        }
        .btn-share {
          background: rgba(77, 101, 219, 1);
          font-size: 18px;
          font-family: "Avenir-Medium", "Avenir";
          font-weight: 500;
          color: #ffffff;
          letter-spacing: 1px;
        }
        .btn-cancel {
          background: rgba(59, 45, 143, 0.15);
          margin-left: 20px;
          font-size: 18px;
          font-family: Avenir-Medium, Avenir;
          font-weight: 500;
          color: #ffffff;
        }
      }
    }
  }

  .share-dialog {
    display: none;
    position: fixed;
    overflow-y: hidden;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.8);
    .share-card {
      width: 380px;
      height: 650px;
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 16px;

      .share-pictrue {
        width: 380px;
        height: 675px;
        border-radius: 16px;

        .share-pictrue-content {
          height: 570px;
          background: #ac078e;
          border-radius: 16px 16px 0px 0px;

          .share-pictrue-content-header {
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 75px;

            img {
              width: 140px;
            }
          }
          .share-picture-content-text {
            width: 323px;
            height: 469px;
            background: #ffffff;
            border-radius: 16px;
            margin: 0 auto;
            padding: 0 17px;
            padding-top: 17px;
            box-sizing: border-box;
            position: relative;

            .content-left,
            .content-right {
              position: absolute;
              background: #ac078e;
              width: 23px;
              height: 23px;
              border-radius: 50%;

              top: 382px;
              z-index: 333;
            }
            .content-left {
              left: -11.5px;
            }
            .content-right {
              right: -11.5px;
            }

            .share-picture-img {
              width: 288px;
              height: 288px;
              border-radius: 5px;
              margin: 0 auto;
              text-align: center;
              img {
                max-width: 288px;
              }
            }
            .share-picture-title {
              padding-top: 8px;
              padding-bottom: 17px;
              border-bottom: 1px solid #e2e2e2;
              span {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #121b25;
                line-height: 17px;
              }
              p {
                width: 283px;
                height: 44px;
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #121b25;
                line-height: 22px;
                text-overflow: ellipsis;
              }
            }
          }
          .shar-picture-owner-price {
            display: flex;
            justify-content: space-between;
            margin: 0 3px;
            padding-top: 5px;
            .share-picture-owner {
              span {
                font-size: 10px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #8d8d8d;
                line-height: 14px;
              }
              p {
                width: 162px;
                height: 34px;
                font-size: 12px;
                font-family: PingFangSC-Light, PingFang SC;
                font-weight: 300;
                color: #121b25;
                line-height: 17px;
                word-wrap: break-word;
              }
            }
            .share-picture-price {
              width: 65px;
              span {
                font-size: 10px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #8d8d8d;
                line-height: 14px;
              }
              p {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 600;
                color: #121b25;
                line-height: 17px;
                span {
                  color: #b665a7;
                }
              }
              .share-picture-price-lastprice {
                height: 14px;
                font-size: 10px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #8d8d8d;
                line-height: 14px;
              }
            }
          }
        }
        .share-pritrue-footer {
          border-radius: 0 0 17px 17px;
          height: 105px;
          background: #ffffff;
          padding: 0 17px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .share-pritrue-footer-l {
            height: 105px;
            display: flex;
            align-items: center;
            img {
              width: 48px;
            }
            .share-pritrue-footer-l-title {
              margin-left: 10px;
              img {
                width: 72px;
              }
              p {
                font-size: 18px;
                line-height: 30px;
                font-weight: 600;
              }
              .china-first {
                width: 180px;

                font-size: 12px;
                font-family: PingFangSC-Light, PingFang SC;
                font-weight: 300;
                color: #121b25;
                line-height: 17px;
              }
            }
          }
          .share-ercard-r {
            width: 78px;
            height: 78px;

            background: #d8d8d8;
          }
        }
      }
      .share-card-btns {
        margin-top: 20px;
        width: 100%;
        text-align: center;
        button {
          cursor: pointer;
          width: 315px;
          height: 41px;
          background: #4880ff;
          border-radius: 4px;

          outline: none;
          border: none;

          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
    .content-bigImg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        min-width: 600px;
      }
    }
  }

  .creat-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    i {
      font-size: 25px;
      color: #00a9cb;
    }
  }
  //   .price-history-hasdata{
  //   width: 445px;
  //   height: 130px;

  // }
}
</style>
