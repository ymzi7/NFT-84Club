<template>
  <div id="record-container">
    <div class="record-wrap">
      <!-- 标题 -->
      <h3>{{ $t("lang.asset_records") }}</h3>
      <!-- tab -->
      <div class="tab-wrap">
        <!-- tab选项 -->
        <ul class="tab-header">
          <li
            v-for="(item, index) in tabList"
            :key="index"
            :class="{ activeTab: tabIndex == index }"
            @click="changeTab(index)"
          >
            {{ $t(item) }}
          </li>
        </ul>
        <!-- 记录--列表 -->
        <div class="record-table">
          <div class="record-inner">
            <!-- tab-01 -->
            <div class="tab-content" v-show="tabIndex == 0">
              <el-table
                :data="ChargeData"
                style="width: 100%"
                height="590"
                :empty-text="$t('lang.empty_text')"
                :header-cell-style="headerStyle"
              >
                <el-table-column
                  v-for="(item, index) in ChargeTable"
                  :key="index"
                  :prop="item.prop"
                  :label="$t(item.label)"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="action"
                  :label="$t('lang.action')"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div
                      @click="HiddenCharge(scope.$index, scope.row)"
                      class="hidden"
                    >
                      <img src="../../../assets/img/hidden.png" alt />
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页 -->
              <div class="pagination">
                <div class="page-icon" @click="chargePrev">
                  <img src="../../../assets/img/ic-leftnav.png" alt />
                  <span>{{ $t("lang.prev") }}</span>
                </div>
                <el-pagination
                  layout="pager"
                  :total="ChargeTotal"
                  :page-size="20"
                ></el-pagination>
                <div class="page-icon" @click="chargeNext">
                  <span>{{ $t("lang.next") }}</span>
                  <img src="../../../assets/img/ic-rightnav.png" alt />
                </div>
              </div>
            </div>
            <!-- tab-02 -->
            <div class="tab-content" v-show="tabIndex == 1">
              <el-table
                :data="WithdrawData"
                style="width: 100%"
                height="590"
                :header-cell-style="headerStyle"
                :empty-text="$t('lang.empty_text')"
              >
                <el-table-column
                  v-for="(item, index) in WithdrawTable"
                  :key="index"
                  :prop="item.prop"
                  :label="$t(item.label)"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="action"
                  :label="$t('lang.action')"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div
                      @click="HiddenWithdraw(scope.$index, scope.row)"
                      class="hidden"
                    >
                      <img src="../../../assets/img/hidden.png" alt />
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页 -->
              <div class="pagination">
                <div class="page-icon" @click="WithdrawPrev">
                  <img src="../../../assets/img/ic-leftnav.png" alt />
                  <span>{{ $t("lang.prev") }}</span>
                </div>
                <el-pagination
                  layout="pager"
                  :total="WithdrawTotal"
                  :page-size="20"
                ></el-pagination>
                <div class="page-icon" @click="WithdrawNext">
                  <span>{{ $t("lang.next") }}</span>
                  <img src="../../../assets/img/ic-rightnav.png" alt />
                </div>
              </div>
            </div>
            <!-- tab-03 -->
            <div class="tab-content" v-show="tabIndex == 2">
              <el-table
                :data="TransactionData"
                style="width: 100%"
                height="590"
                :header-cell-style="headerStyle"
                :empty-text="$t('lang.empty_text')"
              >
                <el-table-column
                  v-for="(item, index) in TransactionTable"
                  :key="index"
                  :prop="item.prop"
                  :label="$t(item.label)"
                  align="center"
                ></el-table-column>
              </el-table>
              <!-- 分页 -->
              <div class="pagination">
                <div class="page-icon" @click="TransPrev">
                  <img src="../../../assets/img/ic-leftnav.png" alt />
                  <span>{{ $t("lang.prev") }}</span>
                </div>
                <el-pagination
                  layout="pager"
                  :total="TransactionTotal"
                  :page-size="20"
                ></el-pagination>
                <div class="page-icon" @click="TransNext">
                  <span>{{ $t("lang.next") }}</span>
                  <img src="../../../assets/img/ic-rightnav.png" alt />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { request } from "network/request.js";
import { timestampToTime,getToken } from "@/utils/utils.js";
export default {
  data() {
    return {
      token:"",
      activeTab: "",
      tabIndex: 0,
      tabList: [
        "lang.charging_record",
        "lang.withdraw_record",
        "lang.Transaction_record",
      ],
      ChargeData: [], //tab1下数据
      ChargeTotal: 0,
      ChargePage: 1,
      ChargeTable: [
        {
          prop: "addTime",
          label: "lang.date",
        },
        {
          prop: "currency",
          label: "lang.curreny",
        },
        {
          prop: "total",
          label: "lang.number",
        },
        {
          prop: "status",
          label: "lang.state",
        },
      ],
      WithdrawData: [],
      WithdrawTable: [
        {
          prop: "addTime",
          label: "lang.date",
        },
        {
          prop: "currency",
          label: "lang.curreny",
        },
        {
          prop: "total",
          label: "lang.number",
        },
        {
          prop: "status",
          label: "lang.state",
        },
      ],
      WithdrawTotal: 0,
      WithdrawPage: 1,
      TransactionData: [],
      TransactionTable: [
        {
          prop: "addTime",
          label: "lang.commission_time",
        },
        {
          prop: "currency",
          label: "lang.curreny",
        },
        {
          prop: "type",
          label: "lang.type",
        },
        {
          prop: "total",
          label: "lang.number",
        },
        // {
        //   prop: "charge",
        //   label: "lang.service_charge",
        // },
        // {
        //   prop: "balance",
        //   label: "lang.balance",
        // },
      ],
      TransactionTotal: 0,
      TransPage: 1,
      page: 1,
      pageSize: 20,
    };
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    },
  },
  watch: {
    lang(val) {
      // 语言改变，重新渲染
      this.getRecord(1, this.ChargePage, null);
      this.getRecord(2, this.WithdrawPage, [2, 4]);
      this.getRecord(3, this.TransPage, null);
    },
  },
  methods: {
    headerStyle() {
      return "height: 60px;background:#EFF4FA;font-weight: 600;color: #8F9BB3;line-height: 16px;";
    },
    // 点击切换tab
    changeTab(index) {
      this.tabIndex = index;
    },
    HiddenWithdraw(index, row) {
      row.show = !row.show;
      if (row.show) {
        row.total = row.number;
      } else {
        row.total = "*****";
      }
    },
    HiddenCharge(index, row) {
      row.show = !row.show;
      if (row.show) {
        row.total = row.number;
      } else {
        row.total = "*****";
      }
    },
    // 获取流水记录
    async getRecord(type, page, typeList) {
      const _this = this;
      // 获取用户ID
      let lang = localStorage.getItem("lang") || "en_us";
      let res = await request.post("/web/account/transaction", {
        token: this.token,
        language: lang,
        page: page,
        pageSize: 20,
        type: type,
        typeList: typeList,
      });
      if (res.data.status == 0) {
        let data = res.data.data.content;
        let total = res.data.data.total;
        if (data.length > 0) {
          data.forEach((item) => {
            item.addTime = timestampToTime(item.addTime);
            item.total=Math.abs(item.total)
            item.number = Math.abs(item.total);
            item.show = true;
            //   状态
            switch (item.status) {
              case 0:
                item.status = _this.$t("lang.confirming");
                break;
              case 1:
                item.status = _this.$t("lang.completed");
                break;
              case 2:
                item.status = _this.$t("lang.failed");
                break;
            }
            switch (item.type) {
              case 1:
                item.type = _this.$t("lang.Charge");
                break;
              case 2:
                item.type = _this.$t("lang.withdraw");
                break;
              case 3:
                item.type = _this.$t("lang.purchase");
                break;
              case 4:
                item.type = _this.$t("lang.poundage");
                break;
            }
          });
        }

        //   根据type处理
        switch (type) {
          case 1: //充币
            _this.ChargeData = data;
            _this.ChargeTotal = total;
            break;
          case 2: //提币
            _this.WithdrawData = data;
            _this.WithdrawTotal = total;
            break;
          case 3: //全部
            _this.TransactionData = data;
            _this.TransactionTotal = total;
            break;
        }
      } else {
        _this.$message.error(res.data.msg);
      }
    },
    chargePrev() {
      if (this.ChargePage == 1) {
        return;
      } else {
        this.ChargePage = this.ChargePage - 1;
        this.getRecord(1, this.ChargePage, null);
      }
    },
    WithdrawPrev() {
      if (this.WithdrawPage == 1) {
        return;
      } else {
        this.WithdrawPage = this.WithdrawPage - 1;
        this.getRecord(2, this.WithdrawPage, [2, 4]);
      }
    },
    TransPrev() {
      if (this.TransPage == 1) {
        return;
      } else {
        this.TransPage = this.TransPage - 1;
        this.getRecord(3, this.TransPage, null);
      }
    },
    chargeNext() {
      let num = Math.floor(
        (this.ChargeTotal + this.pageSize - 1) / this.pageSize
      );
      if (this.ChargePage == num) {
        return;
      } else {
        this.ChargePage = this.ChargePage + 1;
        this.getRecord(1, this.ChargePage, null);
      }
    },
    WithdrawNext() {
      let num = Math.floor(
        (this.WithdrawTotal + this.pageSize - 1) / this.pageSize
      );
      if (this.WithdrawPage == num) {
        return;
      } else {
        this.WithdrawPage = this.WithdrawPage + 1;
        this.getRecord(2, this.WithdrawPage, [2, 4]);
      }
    },
    TransNext() {
      let num = Math.floor(
        (this.TransactionTotal + this.pageSize - 1) / this.pageSize
      );
      if (this.TransPage == num) {
        return;
      } else {
        this.TransPage = this.TransPage + 1;
        this.getRecord(3, this.TransPage, null);
      }
    },
  },
  created(){
    this.token = getToken()
  },
  mounted() {
    this.getRecord(1, this.ChargePage, null);
    this.getRecord(2, this.WithdrawPage, [2, 4]);
    this.getRecord(3, this.TransPage, null);
  },
};
</script>
<style lang="less" scoped>
#record-container {
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  .record-wrap {
    padding: 0 32px;
    height: 905px;
    display: flex;
    background: #f4f4f4;
    flex-direction: column;
    h3 {
      padding-top: 30px;
      font-size: 32px;
      height: 38px;
      font-family: Helvetica;
      color: #202224;
      line-height: 38px;
      font-weight: 400;
    }
    .tab-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-top: 57px;
      .tab-header {
        height: 40px;
        .activeTab {
          color: #222b45;
        }
        .activeTab::after {
          content: "";
          width: 22px;
          height: 2px;
          background: #0095ff;
          position: absolute;
          bottom: -18px;
          left: 50%;
          margin-left: -11px;
        }
        li {
          float: left;
          margin-right: 42px;
          font-size: 15px;
          font-family: Helvetica;
          color: #c5cee0;
          line-height: 16px;
          position: relative;
          cursor: pointer;
        }
      }
      .record-table {
        width: 100%;
        flex: 1;
        margin-top: 36px;
        .record-inner {
          width: 100%;
          height: calc(100% - 8px);
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #eff4fa;
        }
      }
    }
  }
}
.record-inner {
  .tab-content {
    height: 100%;
    width: 100%;
    // display: flex;
    // flex-direction: column;
    .pagination {
      height: 108px;
      width: 98%;
      margin: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .page-icon {
        cursor: pointer;
        span {
          font-size: 12px;
          font-weight: 600;
          color: #c5cee0;
          line-height: 8px;
          padding: 0 7px;
        }
      }
    }
    .data-wrap {
      height: 590px;
    }
  }
}
.hidden {
  cursor: pointer;
}
</style>
