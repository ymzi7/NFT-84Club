<template>
  <div class="my-assets">
    <h3 class="title">{{ $t("lang.Assets_conversion") }}</h3>
    <div class="assets-conversion">
      <div class="assets-btc">
        <h5>
          <span v-if="assetsShow">{{ accountInfo.totalBtc }}</span>
          <span v-else>*****</span>BTC
          <div class="assets-img" @click="changeClick">
            <img
              v-if="assetsShow"
              src="../../../assets/img/Assets conversion/ic-detailsmall-on.png"
              alt
            />
            <img v-else src="../../../assets/img/Assets conversion/ic-viewasset-off.png" alt />
          </div>
        </h5>
        <p>
          ≈
          <span v-if="assetsShow">
            {{
            $i18n.locale == "zh_cn"
            ? accountInfo.totalCny
            : accountInfo.totalUsd
            }}
          </span>
          <span v-else>*****</span>
          {{ $i18n.locale == "zh_cn" ? "CNY" : "USD" }}
        </p>
      </div>
    </div>
    <!-- 卡片视图区域 -->
    <div class="assets-card">
      <el-card class="box-card">
        <!-- 顶部区域 -->
        <div class="card-header">
          <!-- 隐藏资产 -->
          <div class="hiding-small">
            <div class="hiding-small-img" @click="hiddingSmallClick">
              <img
                v-if="hiddimgSmall"
                src="../../../assets/img/Assets conversion/ic-selectmor-off.png"
                alt
              />
              <img v-else src="../../../assets/img/Assets conversion/ic-selectmor-on.png" alt />
            </div>
            <span>{{ $t("lang.hiding_small") }}</span>
          </div>
          <!-- 提现额度 -->
          <div class="withdrawal-limit">
            <h5>
              {{ $t("lang.24H_limit") }}
              <span class="limit-left">
                {{ accountInfo.withdrawLimitIn24Hours
                }}{{ accountInfo.withdrawLimitCurrencyIn24Hours }}
              </span>
              /
              <span class="limit-right">{{ accountInfo.withdrawIn24Hours }}BTC</span>
            </h5>
          </div>
          <!-- 搜索 -->
          <div class="search">
            <input
              type="text"
              :placeholder="$t('lang.search')"
              v-model="searchCurrency"
              @input="changeSearch()"
            />
            <div class="search-img">
              <img src="../../../assets/img/Assets conversion/ic-searchsmall.png" alt />
            </div>
          </div>
        </div>
        <!-- 内容表格区域 -->
        <el-table :data="assetsInfoAll" style="width: 100%" :empty-text="$t('lang.No_data')">
          <el-table-column prop="currency" :label="$t('lang.Currency')"></el-table-column>
          <el-table-column prop="total" :label="$t('lang.TotalAssets')"></el-table-column>
          <el-table-column prop="available" :label="$t('lang.Available')"></el-table-column>
          <el-table-column prop="frozen" :label="$t('lang.Frozen')"></el-table-column>
          <el-table-column :label="$t('lang.Action')" width="300">
            <template slot-scope="scope">
              <div class="action-item">
                <span
                  class="action"
                  @click="rechargeClick(scope.$index, scope.row)"
                >{{ $t("lang.Recharge") }}</span>
                <span @click="withdrawClick(scope.$index, scope.row)">{{ $t("lang.Mention") }}</span>
                <span @click="goMarkerClick">{{ $t("lang.Transaction") }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 充币 -->
    <el-dialog
      custom-class="dialogPadding"
      :title="$t('lang.ETH_Recharge')"
      :visible.sync="rechargeDialogVisible"
      width="670px"
    >
      <div class="dialog-text">
        <p>{{ $t("lang.plz_do_not") }}</p>
        <p>{{ $t("lang.number_of") }}</p>
      </div>
      <!-- 充币地址 -->
      <div class="recharge-address">
        <div class="recharge-address-header">
          <button>ETH</button>
          <span>{{ $t("lang.Cash_address") }} (ETH)*</span>
        </div>
        <div class="recharge-address-text">
          <p>{{ rechargeAddress }}</p>
          <button
            ref="copyRef"
            :data-clipboard-text="rechargeAddress"
            @click.stop="copy"
            @mouseover="copy"
          >{{ $t("lang.copy") }}</button>
          <div class="ic-qcode" @mouseover="qcodeShow" @mouseleave="qcodeHide">
            <img src="../../../assets/img/Assets conversion/ic-qcode.png" alt />
          </div>
          <!-- 二维码 -->
          <div id="qrcode" ref="qrcodeRef"></div>
        </div>
      </div>
      <!-- 充币记录 -->
      <div class="recharge-history">
        <p>{{ $t("lang.Recharge_records") }} ({{ $t("lang.last5") }})</p>
        <el-table :data="rechareHistory" style="width: 100%" :empty-text="$t('lang.No_data')">
          <el-table-column prop="addTime" :label="$t('lang.Date')"></el-table-column>
          <el-table-column prop="status" :label="$t('lang.state_')"></el-table-column>
          <el-table-column prop="total" :label="$t('lang.Number')"></el-table-column>
          <el-table-column :label="$t('lang.Action')">
            <template slot-scope="scope" class="more-dele">
              <div @click="rechargeShowClick(scope.$index, scope.row)">
                <img src="../../../assets/img/Assets conversion/ic-detailsmall-off.png" alt />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="recharge-footer">
        <!-- <button @click="rechargeDialogVisible = false">{{$t('lang.Charge')}}</button> -->
      </div>
    </el-dialog>
    <!-- 提币对话框 -->
    <el-dialog
      :before-close="withdrawClose"
      custom-class="dialogPadding"
      :title="$t('lang.ETH_Withdraw')"
      :visible.sync="withdrawDialogVisible"
      width="670px"
    >
      <div class="dialog-text">
        <p>{{ $t("lang.minimun_with") + listInfo.withdrawMin }} ETH</p>
        <p>{{ $t("lang.plz_make_sure") }}</p>
      </div>
      <!-- 提币地址 -->
      <div class="withdraw-address">
        <span>{{ $t("lang.Withdrawal_address") }}</span>
        <div class="addr-wrap">
          <input type="text" v-model="withdrawInfo.hashAddress" @click="SelectAddr" />
          <i class="el-icon-arrow-down" v-if="show_addr" @click="SelectAddr"></i>
          <i class="el-icon-arrow-up" v-else @click="SelectAddr"></i>
          <!-- 提币地址列表 -->
          <transition name="fade">
            <div class="addr_list" v-if="!show_addr" @mouseleave="show_addr = true">
              <li
                v-for="(item, index) in AddrLists"
                :key="index"
                @click="chooseAddr(item)"
              >{{ item.address }}</li>
              <li class="Add_withdraw" @click="add_withdraw_addr">
                <p>{{ $t("lang.add_addr") }}</p>
                <i class="el-icon-right"></i>
              </li>
            </div>
          </transition>
        </div>
      </div>

      <div class="number">
        <span>{{ $t("lang.number") }}*</span>
        <div class="number-content">
          <button>ETH</button>
          <input
            type="text"
            maxlength="10"
            v-model="withdrawInfo.withdrawNumber"
            onkeyup="value=value.replace(/[^\d\.]/g,'')"
            @input="actualReceiChange"
          />
          <span class="extract-all" @click="extractAllClick">
            {{
            $t("lang.Extract_all")
            }}
          </span>
          <span class="number-limit">{{ $t("lang.limit") }}:{{ listInfo.withdrawMax }} ETH</span>
        </div>
      </div>
      <div class="cost">
        <div class="service-charge">
          <span>{{ $t("lang.Service_Charge") }}</span>
          <h3>
            <i>{{ listInfo.currency }}</i>
            {{ listInfo.withdrawFee }}
          </h3>
        </div>
        <div class="actual-recei">
          <span>{{ $t("lang.Actual_recei") }}</span>
          <h3>
            <i>{{ listInfo.currency }}</i>
            {{ actualRecei }}
          </h3>
        </div>
      </div>

      <div class="withdrawal-records">
        <h4>{{ $t("lang.Withdrawal_records") }} ({{ $t("lang.last5") }})</h4>
        <el-table :data="widthrawHistory" style="width: 100%" :empty-text="$t('lang.No_data')">
          <el-table-column prop="addTime" :label="$t('lang.Date')"></el-table-column>
          <el-table-column prop="status" :label="$t('lang.state_')"></el-table-column>
          <el-table-column prop="total" :label="$t('lang.Number')"></el-table-column>
          <el-table-column :label="$t('lang.Action')">
            <template slot-scope="scope" class="more-dele">
              <div @click="withdrewShowClick(scope.$index, scope.row)">
                <img src="../../../assets/img/Assets conversion/ic-detailsmall-off.png" alt />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <button @click="withdrawSubmit">{{ $t("lang.withdraw") }}</button>
        <span @click="withdrawClose">{{ $t("lang.cancel") }}</span>
      </div>
    </el-dialog>

    <!-- 验证码 -->
    <el-dialog
      :modal="false"
      top="20vh"
      width="22%"
      :title="$t('lang.please_code')"
      :visible.sync="emailCodeDialog"
      :before-close="CodeDialogClose"
      center
    >
      <div class="codeStyle" v-show="emailInputShow">
        <el-input v-model="withdrawInfo.emailCode" :placeholder="$t('lang.plz_email_code')"></el-input>
        <el-button
          :type="emailCodeInfo.type"
          @click="getEmailCode"
          :disabled="emailCodeInfo.disabled"
        >{{ emailCodeInfo.name }}</el-button>
      </div>
      <div class="codeStyle phoneCodeStyle" v-show="phoneInputShow">
        <el-input
          v-model="withdrawInfo.phoneCode"
          class="phone-code"
          :placeholder="$t('lang.plz_phone_code')"
        ></el-input>
        <el-button
          @click="getPhoneCode"
          :type="phoneCodeInfo.type"
          :disabled="phoneCodeInfo.disabled"
        >{{ phoneCodeInfo.name }}</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <button
          class="verify-btn"
          v-loading="codeLoading"
          @click.prevent="getWithdrawClick"
          :disabled="getWithdrawClickDisabled"
        >{{ $t("lang.comfirm") }}</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request, price } from 'network/request'
import { timestampToTime, accSub, getToken } from '../../../utils/utils'
import QRCode from 'qrcodejs2'
import { BASE_URL } from '@/utils/data.js'
export default {
  data() {
    return {
      // 邮箱Loading
      codeLoading: false,
      // token值
      token: '',
      //  隐藏资产
      assetsShow: true,
      //  隐藏小额资产
      hiddimgSmall: true,
      //  提币对话框
      withdrawDialogVisible: false,
      // 提币表单数据
      withdrawInfo: {
        hashAddress: '',
        withdrawNumber: 0.0,
        emailCode: '',
        phoneCode: ''
      },
      // 充币对话框
      rechargeDialogVisible: false,
      // 提币记录切换
      withdrewShow: [],
      // 充币地址
      rechargeAddress: '',
      // 充币记录状态切换
      rechargeShow: [],
      // 当前选中信息
      listInfo: {},
      // 用户信息,
      userInfo: {},
      //  账户信息
      accountInfo: {},
      // 资产信息
      assetsInfoAll: [],
      // 充币记录
      rechareHistory: [],
      rechareHistoryCopy: [],
      // 提币记录
      widthrawHistory: [],
      widthrawHistoryCopy: [],
      // 备份资产列表
      assetInfoBack: [],
      // 邮箱验证码
      emailCodeDialog: false,
      //搜索
      searchCurrency: '',
      // 提币实际到账数量
      actualRecei: 0,
      // 验证码
      emailInputShow: false,
      emailCodeInfo: {
        disabled: false,
        type: '',
        interval1: null,
        name: this.$t('lang.get_captcha')
      },
      phoneInputShow: false,
      phoneCodeInfo: {
        disabled: false,
        type: '',
        interval2: null,
        name: this.$t('lang.get_captcha')
      },

      show_addr: true,
      //提币地址
      AddrLists: [],
      // 总资产
      totalPrice: 0,
      language: '',
      getWithdrawClickDisabled: false
    }
  },
  created(){
    this.token = getToken();
  },

  mounted() {

    this.language = localStorage.getItem('lang')
    //    获取账户信息
    this.getAccountInfo()
    //    获取用户信息
    this.getUserInfo()
    this.getAddress(1)
  },
  watch: {
    // 监听语言改变价格
    lang(val) {
      if (val == 'en_us') {
        this.totalPrice = this.accountInfo.totalUsd.toFixed(2) + 'USD'
      } else if ((val = 'zh_cn')) {
        this.totalPrice = this.accountInfo.totalCny.toFixed(2) + 'CNY'
      }
    },
    '$route.path': function () {
      if (this.$route.path.indexOf('myassets')) {
        
        this.getUserInfo()
        this.emailInputShow = false
        this.phoneInputShow = false
      }
    },
    '$i18n.locale': function () {
      this.emailCodeInfo.name = this.$t('lang.get_captcha')
      this.phoneCodeInfo.name = this.$t('lang.get_captcha')
    }
  },
  computed: {
    lang() {
      return this.$store.state.lang
    }
  },
  methods: {
    // 点击展示下拉框
    SelectAddr() {
      this.show_addr = !this.show_addr
    },
    actualReceiChange() {
      if (this.withdrawInfo.withdrawNumber - this.listInfo.withdrawFee < 0) {
        this.actualRecei = 0
      } else {
        this.actualRecei = accSub(
          this.withdrawInfo.withdrawNumber,
          this.listInfo.withdrawFee
        )
      }
    },
    // 选择地址
    chooseAddr(item) {
      this.withdrawInfo.hashAddress = item.address
      this.show_addr = true //关闭下拉框
    },
    // 添加去添加地址
    add_withdraw_addr() {
      // let href = "http://84club.chuangjisu.com/userinfo/withdraw-address";
      // window.open(href, "_blank");
      this.withdrawDialogVisible = false
      this.$router.push({ name: 'WithdrawAddr' })
    },
    // 提币地址
    async getAddress(page) {
      // 获取用户ID
      let lang = localStorage.getItem('lang') || 'en_us'
      let res = await request.post('/web/address/withdraw/list', {
        language: this.language,
        page: page,
        pageSize: 20,
        token: this.token,
        currency: 'ETH'
      })
      if (res.data.status == 0) {
        this.AddrLists = res.data.data.content
      } else {
        this.$message.error(res.data.msg)
      }
    },
    // 搜索
    changeSearch() {
      const _this = this
      let NewItems = []
      if (this.searchCurrency) {
        var reg = new RegExp(_this.searchCurrency, 'ig')
        this.assetInfoBack.map((item) => {
          if (item.currency.match(reg)) {
            NewItems.push(item)
          }
        })
        this.assetsInfoAll = JSON.parse(JSON.stringify(NewItems))
      } else {
        this.assetsInfoAll = JSON.parse(JSON.stringify(this.assetInfoBack))
      }
    },
    //    隐藏资产
    changeClick() {
      this.assetsShow = !this.assetsShow
    },
    //    点击隐藏小额资产
    hiddingSmallClick() {
      this.hiddimgSmall = !this.hiddimgSmall
      const _this = this
      // false为选中---隐藏小于0.001BTC的为小额资产
      if (!this.hiddimgSmall) {
        _this.assetsInfoAll.forEach((item, index) => {
          if (item.totalBtc < 0.001) {
            _this.assetsInfoAll.splice(index, 1)
          }
        })
        _this.assetsInfoAll = JSON.parse(JSON.stringify(_this.assetsInfoAll))
      } else {
        _this.assetsInfoAll = JSON.parse(JSON.stringify(this.assetInfoBack))
      }
    },

    // 充币
    async rechargeClick(index, row) {
      this.rechargeDialogVisible = true
      this.listInfo = row
      const _this = this
      // 获取冲币地址
      const { data: res } = await request.post('/web/address/recharge', {
        token: this.token,
        currency: 'ETH'
      })
      if (res.status == 0) {
        this.rechargeAddress = res.data
        var qcodeIndex = 0
        // 二维码生成
        this.$refs.qrcodeRef.innerHTML = ''
        let qrcode = new QRCode(this.$refs.qrcodeRef, {
          width: 132,
          height: 132,
          text: this.rechargeAddress // 二维码地址
        })
        // 获取充币流水记录
        const { data: resList } = await request.post(
          '/web/account/transaction',
          {
            currency: this.listInfo.currency,
            id: this.listInfo.id,
            page: 1,
            pageSize: 5,
            token: this.token,
            type: 1
          }
        )
        resList.data.content.forEach((item) => {
          item.addTime = timestampToTime(item.addTime)
          item.total = Math.abs(item.total)
          switch (item.status) {
            case 0:
              item.status = _this.$t('lang.confirming')
              break
            case 1:
              item.status = _this.$t('lang.completed')
              break
            case 2:
              item.status = _this.$t('lang.failed')
              break
          }
        })
        this.rechareHistory = resList.data.content
        this.rechareHistoryCopy = JSON.parse(
          JSON.stringify(resList.data.content)
        )
      }
    },
    // 充币隐藏
    rechargeShowClick(index, row) {
      if (this.rechargeShow.indexOf(index) == '-1') {
        row.total = '****'
        this.rechargeShow.push(index)
      } else {
        row.total = this.rechareHistoryCopy[index].total
        var i = this.rechargeShow.indexOf(index)
        this.rechargeShow.splice(i, 1)
      }
    },

    // 提币
    async withdrawClick(index, row) {
      this.withdrawDialogVisible = true
      const _this = this
      // 保存当前选中
      this.listInfo = row
      // 获取提币历史记录
      const { data: resList } = await request.post('/web/account/transaction', {
        currency: this.listInfo.currency,
        id: this.listInfo.id,
        page: 1,
        pageSize: 5,
        token: this.token,
        type: 2
      })
      resList.data.content.forEach((item) => {
        item.addTime = timestampToTime(item.addTime)
        item.total = Math.abs(item.total)
        switch (item.status) {
          case 0:
            item.status = _this.$t('lang.confirming')
            break
          case 1:
            item.status = _this.$t('lang.completed')
            break
          case 2:
            item.status = _this.$t('lang.failed')
            break
        }
      })
      this.widthrawHistory = resList.data.content
      this.widthrawHistoryCopy = JSON.parse(
        JSON.stringify(resList.data.content)
      )
    },
    // 提币隐藏
    withdrewShowClick(index, row) {
      if (this.withdrewShow.indexOf(index) == '-1') {
        row.total = '****'
        this.withdrewShow.push(index)
      } else {
        row.total = this.widthrawHistoryCopy[index].total
        var i = this.withdrewShow.indexOf(index)
        this.withdrewShow.splice(i, 1)
      }
    },

    // 全部提取
    extractAllClick() {
      if (this.listInfo.available >= this.listInfo.withdrawMax) {
        this.withdrawInfo.withdrawNumber = this.listInfo.withdrawMax
      } else {
        this.withdrawInfo.withdrawNumber = this.listInfo.available
      }
    },
    // 提币确认
    async withdrawSubmit() {
      this.withdrawInfo.withdrawNumber = Number(
        this.withdrawInfo.withdrawNumber
      )
      if (this.withdrawInfo.hashAddress == '') {
        this.$message.error(this.$t('lang.enter_address'))
        return
      } else if (
        this.withdrawInfo.withdrawNumber < this.listInfo.withdrawMin ||
        this.withdrawInfo.withdrawNumber > this.listInfo.withdrawMax
      ) {
        this.$message.error(this.$t('lang.plz_cor_num'))
        return
      }
      if (this.userInfo.email != null) {
        this.emailInputShow = true
      }
      if (this.userInfo.phone != null) {
        this.phoneInputShow = true
      }
      this.emailCodeDialog = true
    },

    // 提币请求
    async getWithdrawClick() {
      this.codeLoading = true
      this.getWithdrawClickDisabled = true
      setTimeout(() => {
        this.getWithdrawClickDisabled = false
      }, 3000)
      const { data: res } = await request.post('/web/account/withdraw', {
        accountId: this.listInfo.id,
        currency: this.listInfo.currency,
        token: this.token,
        total: this.withdrawInfo.withdrawNumber,
        hashAddress: this.withdrawInfo.hashAddress,
        emailCode: this.withdrawInfo.emailCode,
        phoneCode: this.withdrawInfo.phoneCode
      })
      if (res.status != 0) {
        this.codeLoading = false
        this.$message.error(res.msg)
        this.withdrawInfo.emailCode = ''
        this.withdrawInfo.phoneCode = ''
        this.emailCodeDialog = false

        window.clearInterval(this.emailCodeInfo.interval1)
        window.clearInterval(this.phoneCodeInfo.interval2)
        this.emailCodeInfo.type = ''
        this.phoneCodeInfo.type = ''
        this.emailCodeInfo.disabled = false
        this.phoneCodeInfo.disabled = false
        this.emailCodeInfo.name = this.$t('lang.get_captcha')
        this.phoneCodeInfo.name = this.$t('lang.get_captcha')

        return
      }

      if (res.status == 0) {
        this.codeLoading = false
        this.$message.success(this.$t('lang.success'))
        this.withdrawDialogVisible = false
        this.withdrawInfo.emailCode = ''
        this.withdrawInfo.phoneCode = ''
        this.emailCodeDialog = false
        window.clearInterval(this.emailCodeInfo.interval1)
        window.clearInterval(this.phoneCodeInfo.interval2)
        this.emailCodeInfo.disabled = false
        this.phoneCodeInfo.disabled = false
        this.emailCodeInfo.type = ''
        this.phoneCodeInfo.type = ''
        this.emailCodeInfo.name = this.$t('lang.get_captcha')
        this.phoneCodeInfo.name = this.$t('lang.get_captcha')
        this.getAccountInfo(currency)
      }
    },
    withdrawClose() {
      this.withdrawInfo.hashAddress = ''
      this.withdrawInfo.withdrawNumber = ''
      this.withdrawDialogVisible = false
      this.actualRecei = 0
    },
    CodeDialogClose() {
      this.withdrawInfo.emailCode = ''
      this.withdrawInfo.phoneCode = ''
      this.emailCodeDialog = false

      window.clearInterval(this.emailCodeInfo.interval1)
      window.clearInterval(this.phoneCodeInfo.interval2)
      this.emailCodeInfo.type = ''
      this.phoneCodeInfo.type = ''
      this.emailCodeInfo.disabled = false
      this.phoneCodeInfo.disabled = false
      this.emailCodeInfo.name = this.$t('lang.get_captcha')
      this.phoneCodeInfo.name = this.$t('lang.get_captcha')
    },
  
    //    请求账户信息
    async getAccountInfo(currency) {
      let lang = this.$i18n.locale
      const { data: res } = await request.post('/web/account/info', {
        token: this.token,
        language: lang,
        currency: currency
      })
      if (res.status == 0) {
        this.accountInfo = res.data

        this.assetsInfoAll = res.data.itemList
        this.assetInfoBack = JSON.parse(JSON.stringify(res.data.itemList))
        if (this.language == 'zh_cn') {
          this.totalPrice = res.data.totalCny.toFixed(2) + 'CNY'
        } else if (this.language == 'en_us') {
          this.totalPrice = res.data.totalUsd.toFixed(2) + 'USD'
        }
      }
    },
    // 获取用户数据
    async  getUserInfo(){
      const {data:res} = await request.post('/web/user/info',{
          token:this.token,
          language:this.$i18n.locale
      })
      if(res.status == 0){
       
          this.userInfo = res.data
          }
    },

    // 获取邮箱验证码
    async getEmailCode() {
      var count = 60
      this.emailCodeInfo.disabled = true
      this.emailCodeInfo.type = 'info'
      this.emailCodeInfo.interval1 = window.setInterval(() => {
        this.emailCodeInfo.name = this.$t('lang.reacquire') + '(' + count + 'S)'
        --count
        if (count < 0) {
          this.emailCodeInfo.disabled = false
          this.emailCodeInfo.type = ''
          ;(this.emailCodeInfo.name = this.$t('lang.get_captcha')),
            window.clearInterval(this.emailCodeInfo.interval1)
        }
      }, 1000)
      const { data: res } = await request.post('/web/authCode/email', {
        language: this.language,
        name: this.userInfo.name
      })
    },
    // 获取手机验证码
    async getPhoneCode() {
      var count = 60
      this.phoneCodeInfo.disabled = true
      this.phoneCodeInfo.type = 'info'
      this.phoneCodeInfo.interval2 = window.setInterval(() => {
        this.phoneCodeInfo.name = this.$t('lang.reacquire') + '(' + count + 'S)'
        --count
        if (count < 0) {
          this.phoneCodeInfo.disabled = false
          this.phoneCodeInfo.type = ''
          ;(this.phoneCodeInfo.name = this.$t('lang.get_captcha')),
            window.clearInterval(this.phoneCodeInfo.interval2)
        }
      }, 1000)

      const { data: res } = await request.post('/web/authCode/phone', {
        language: this.language,
        name: this.userInfo.name
      })
    },
    // 复制
    copy() {
      const _this = this
      if(this.clipboard != null){
         var clipboard = new this.clipboard(this.$refs.copyRef)
      clipboard.on('success', function (val) {
        _this.$message.success(_this.$t('lang.Copy_Success'))
      })
      clipboard.on('error', function () {
        _this.$message.error(_this.$t('lang.Copy_failed'))
      })

      }
     
      this.clipboard = null
    },
    // 二维码展示
    qcodeShow() {
      this.$refs.qrcodeRef.style.display = 'block'
    },
    // 二维码隐藏
    qcodeHide() {
      this.$refs.qrcodeRef.style.display = 'none'
    },
    // market跳转
    goMarkerClick() {
      this.$router.push('/market')
    }
  },
  components: {}
}
</script>

<style  lang="less" scope>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.my-assets {
  height: 906px;
  background: #f4f4f4;
  padding-top: 30px;
  box-sizing: border-box;
  .title {
    margin: 0;
    margin-left: 40px;
    height: 38px;
    font-size: 32px;
    font-family: Helvetica;
    color: #202224;
    line-height: 38px;
    font-weight: 500;
  }
  .assets-conversion {
    margin-left: 40px;
    margin-top: 74px;

    h5 {
      margin: 0;
      height: 32px;
      font-size: 30px;
      font-family: 'OpenSans-Bold', 'OpenSans';
      font-weight: bold;
      color: #222b45;
      line-height: 32px;
      display: inline-block;

      .assets-img {
        display: inline-block;
        margin-left: 15px;
      }
    }

    p {
      margin-top: 6px;
      height: 16px;
      font-size: 13px;
      font-family: 'Helvetica';
      color: #222b45;
      line-height: 16px;
    }
  }
  .assets-card {
    .box-card {
      margin: 46px 32px 0 32px;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #eff4fa;
      height: 619px;

      .card-header {
        height: 61px;
        display: flex;
        align-items: center;
        padding: 0 40px 0 20px;
        justify-content: space-between;
        .hiding-small {
          height: 24px;
          display: inline-block;
          flex: 165px 0 0;

          .hiding-small-img {
            display: inline-block;
            margin-right: 13px;
            height: 24px;
            width: 24px;
            img {
              width: 100%;
              height: 100%;
              vertical-align: top;
            }
          }

          span {
            height: 24px;
            font-size: 16px;
            font-family: Helvetica;
            color: #404040;
            line-height: 24px;
          }
        }
        .withdrawal-limit {
          flex: 210px 0 0;
          margin: 0 10px;
          h5 {
            margin: 0;
            width: 300px;
            height: 22px;
            font-size: 16px;
            font-family: 'Helvetica';
            color: #404040;
            line-height: 19px;
            .limit-left {
              color: #0161cc;
            }
            .limit-right {
              color: #4ad991;
            }
          }
        }
        .search {
          display: flex;
          height: 34px;
          align-items: center;
          flex: 274px 0 1;
          input {
            // width: 274px;
            flex: 200px 1 1;
            height: 34px;
            background: #ffffff;
            border-radius: 8px;
            border: 1px solid #eff4fa;
            font-size: 13px;
            font-family: Helvetica;
            color: #222b45;
            line-height: 34px;
            padding-left: 12px;
          }
          .search-img {
            width: 20px;
            height: 20px;
            display: inline-block;
            margin-left: -25px;
            img {
              width: 100%;
              height: 100%;
              vertical-align: top;
            }
          }
        }
      }
    }
  }
}
.el-card__body {
  padding: 0px;
}
.el-table {
  font-size: 12px;

  .action-item {
    span {
      display: inline-block;
      width: 77px;
      cursor: pointer;
    }
  }
}
.action {
  color: #0095ff;
}

.el-table .has-gutter th {
  background: rgba(239, 244, 250, 1);
  font-size: 15px;
  color: #8f9bb3;
}
.dialogPadding {
  padding: 0;
}
.el-dialog__header {
  padding: 20px 20px 0 20px;
  height: 56px;
  border-bottom: 1px solid #eff4fa;
  span {
    font-size: 17px;
    font-family: 'OpenSans-Semibold', 'OpenSans';
    font-weight: 600;
    color: #222b45;
    line-height: 56px;
  }
}

.dialog-text {
  padding: 0 20px;
  margin: 0 auto;
  margin-top: 22px;
  width: 620px;
  height: 48px;
  font-size: 12px;
  font-family: 'OpenSans-Semibold', 'OpenSans';
  font-weight: 600;
  color: #c5cee0;
  line-height: 16px;
  word-wrap: normal;
}
.withdraw-address {
  padding: 0 20px;
  margin-top: 26px;
  span {
    display: block;
    height: 16px;
    font-size: 15px;
    font-family: 'PingFangSC-Semibold', 'PingFang SC';
    line-height: 16px;
    color: #c5cee0;
    line-height: 16px;
    font-weight: 600;
  }
  .addr-wrap {
    width: 100%;
    height: 34px;
    background: #ffffff;
    border-radius: 8px;
    margin-top: 10px;
    font-family: Helvetica;
    color: #222b45;
    line-height: 34px;
    border: 1px solid #eff4fa;
    display: flex;
    align-items: center;
    position: relative;
    input {
      width: 92%;
      outline: none;
      line-height: 34px;
      font-size: 13px;
      margin-left: 12px;
    }
    i {
      font-size: 18px;
      line-height: 34px;
      color: #c5cee0;
      cursor: pointer;
    }
    .addr_list {
      position: absolute;
      top: 37px;
      left: 0;
      width: 100%;
      z-index: 9;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0px 2px 4px 0px rgba(218, 218, 218, 0.5);
      li {
        list-style: none;
        padding-left: 15px;
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #222b45;
      }
      .Add_withdraw {
        padding-left: 0px;
        padding-bottom: 5px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          color: #000000;
          font-size: 20px;
          margin-left: 10px;
        }
      }
      li:hover {
        color: #fff;
        background: #4880ff;
        cursor: pointer;
      }
    }
  }
}

.number {
  padding: 0 20px;
  margin-top: 15px;
  span {
    width: 64px;
    height: 16px;
    font-size: 15px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #c5cee0;
    line-height: 16px;
  }
  .number-content {
    position: relative;
    button {
      width: 74px;
      height: 24px;
      background: #f1f4f9;
      border-radius: 3px;
      position: absolute;
      left: 11px;
      top: 5px;
    }
    input {
      width: 270px;
      height: 34px;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #eff4fa;
      font-size: 13px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #222b45;
      line-height: 34px;
      padding-left: 97px;
    }
    .extract-all {
      margin-left: 16px;
      width: 63px;
      height: 34px;
      font-size: 13px;
      font-family: OpenSans-Semibold, OpenSans;
      font-weight: 600;
      color: #0161cc;
      line-height: 34px;
      cursor: pointer;
    }
    .number-limit {
      margin-left: 22px;
      width: 107px;
      height: 34px;
      font-size: 15px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #c5cee0;
      line-height: 34px;
    }
  }
}

.cost {
  padding: 0 20px;
  margin-top: 32px;
  display: flex;
  span {
    height: 16px;
    font-size: 15px;
    font-family: 'PingFangSC-Semibold', 'PingFang SC';
    font-weight: 600;
    color: #c5cee0;
    line-height: 16px;
  }
  h3 {
    margin-top: 23px;
    height: 16px;
    font-size: 24px;
    font-family: 'PingFangSC-Semibold', 'PingFang SC';
    font-weight: 600;
    color: #222b45;
    line-height: 16px;
    i {
      margin-right: 3px;
      font-size: 13px;
      color: #000000;
    }
  }
  .service-charge {
    flex: 1;
  }
  .actual-recei {
    flex: 1;
  }
}

.withdrawal-records {
  margin-top: 38px;
  border-top: 1px solid #eff4fa;
  border-bottom: 1px solid #eff4fa;
  height: 382px;
  padding: 0 20px;
  h4 {
    margin-top: 26px;
    margin-bottom: 15px;
    height: 16px;
    font-size: 15px;
    font-family: 'PingFangSC-Semibold', 'PingFang SC';
    font-weight: 600;
    color: #c5cee0;
    line-height: 16px;
  }
  .el-table {
    margin-bottom: 16px;
  }
  .el-table::before {
    display: none;
  }
}
.footer {
  position: relative;
  height: 60px;
  button {
    width: 88px;
    height: 26px;
    background: #0095ff;
    border-radius: 8px;
    font-size: 13px;
    font-family: 'OpenSans-Semibold', 'OpenSans';
    font-weight: 600;
    color: #ffffff;
    line-height: 26px;
    position: absolute;
    right: 101px;
    top: 20px;
    cursor: pointer;
  }
  span {
    cursor: pointer;
    display: block;
    width: 41px;
    font-size: 13px;
    font-family: Helvetica;
    color: #8f9bb3;
    position: absolute;
    top: 25px;
    right: 30px;
  }
}

.recharge-address {
  margin-top: 30px;
  .recharge-address-header {
    margin-left: 20px;
    button {
      width: 83px;
      height: 34px;
      background: #f1f4f9;
      border-radius: 3px;
      font-size: 24px;
      font-family: OpenSans-Semibold, OpenSans;
      font-weight: 600;
      color: #0161cc;
      line-height: 16px;
    }
    span {
      margin-left: 45px;
      width: 151px;
      height: 34px;
      font-size: 15px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #c5cee0;
      line-height: 34px;
    }
  }
  .recharge-address-text {
    margin-top: 20px;
    height: 62px;
    background: #eff4fa;
    display: flex;
    align-items: center;
    position: relative;

    p {
      height: 62px;
      font-size: 17px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #222b45;
      line-height: 62px;
      margin-left: 20px;
    }
    button {
      position: absolute;
      right: 60px;
      width: 88px;
      height: 34px;
      background: #00e096;
      border-radius: 8px;
      font-size: 13px;
      font-family: OpenSans-Semibold, OpenSans;
      font-weight: 600;
      color: #ffffff;
      line-height: 16px;
      margin-left: 68px;
      cursor: pointer;
    }
    .ic-qcode {
      cursor: pointer;
      width: 24px;
      height: 24px;
      margin-left: 20px;
      position: absolute;
      right: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    #qrcode {
      background: #fff;
      position: absolute;
      top: -120px;
      right: 0;
      display: none;
    }
  }
}
.recharge-history {
  box-sizing: border-box;
  margin-top: 44px;
  width: 100%;
  border-top: 1px solid #eff4fa;
  padding: 0 20px;
  padding-top: 26px;

  p {
    height: 16px;
    font-size: 15px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #c5cee0;
    line-height: 16px;
    margin-bottom: 15px;
  }
}
.recharge-footer {
  height: 60px;
  position: relative;
  button {
    width: 88px;
    height: 26px;
    background: #0095ff;
    border-radius: 8px;
    font-size: 13px;
    font-family: 'OpenSans-Semibold', 'OpenSans';
    font-weight: 600;
    color: #ffffff;
    line-height: 26px;
    position: absolute;
    right: 101px;
    top: 20px;
    cursor: pointer;
  }
}

.verify-btn {
  width: 100%;
  height: 50px;
  background: #000000;
  border-radius: 100px;
  font-size: 16px;
  font-family: Helvetica;
  color: #ffffff;
  line-height: 19px;
  letter-spacing: 1px;
  vertical-align: top;
  cursor: pointer;
}
.phone-code {
  margin-top: 25px;
}

.codeStyle {
  height: 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;

  input {
    width: 230px;
  }
  button {
    min-width: 120px;
    padding: 0 10px;
  }

  .phone-code {
    margin-top: 0;
  }
}
.phoneCodeStyle {
  margin-top: 20px;
}
</style>
