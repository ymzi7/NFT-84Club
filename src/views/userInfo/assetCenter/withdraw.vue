<template>
  <div id="record-container">
    <div class="record-wrap">
      <!-- 标题 -->
      <h3>{{ $t("lang.withdraw_address") }}</h3>
      <!-- 添加地址 -->
      <h5>{{ $t("lang.new_address") }}</h5>
      <div class="add-wrap">
        <div class="add-inner">
          <!-- 左侧输入-->
          <div class="addr-data">
            <div class="input-line">
              <div class="curreny-select">
                <p>{{ $t("lang.curreny") }}</p>
                <el-select v-model="curreny" :placeholder="$t('lang.Please_select')">
                  <el-option
                    v-for="(item, index) in currenyList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="addr-input">
                <p>{{ $t("lang.withdraw_address") }}</p>
                <el-input v-model="address" :placeholder="$t('lang.Please_input')"></el-input>
              </div>
            </div>
            <!-- btc-wallet -->
            <div class="wallet">
              <el-input
                type="textarea"
                :rows="2"
                v-model="remark"
                resize="none"
                :placeholder="$t('lang.remarks')"
              ></el-input>
            </div>
          </div>
          <!-- 添加按钮 -->
          <button class="add-btn" @click="AddWithdraw">{{ $t("lang.add") }}</button>
        </div>
      </div>
      <!-- 地址列表 -->
      <h5>{{ $t("lang.address_list") }}</h5>
      <div class="list-wrap">
        <el-table
          :data="AddressData"
          style="width: 100%"
          height="100%"
          :header-cell-style="headerStyle"
          :empty-text="$t('lang.empty_text')"
        >
          <el-table-column
            v-for="(item, index) in AddrTable"
            :key="index"
            :prop="item.prop"
            :label="$t(item.label)"
            align="center"
            :width="item.width"
          ></el-table-column>
          <el-table-column prop="action" :label="$t('lang.action')" align="center" width="150">
            <template slot-scope="scope">
              <div @click="deleteRow(scope.$index, scope.row)" style="cursor: pointer">
                <img src="../../../assets/img/delete_addr.png" alt />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { request } from 'network/request.js'
import { getToken } from '../../../utils/utils'
export default {
  data() {
    return {
      token:"",
      AddressData: [],
      AddrTable: [
        {
          prop: 'currency',
          label: 'lang.curreny',
          width: '160'
        },
        {
          prop: 'address',
          label: 'lang.withdraw_address'
        },
        {
          prop: 'remark',
          label: 'lang.remarks'
        }
      ],
      curreny: '',
      currenyList: [
        {
          label: 'ETH',
          value: 'ETH'
        }
      ],
      address: '',
      remark: '',
      page: 1
    }
  },
  created(){
    this.token = getToken()
  },
  methods: {
    headerStyle() {
      return 'height: 60px;background:#EFF4FA;font-weight: 600;color: #8F9BB3;line-height: 16px;'
    },
    // 点击添加提币地址
    async AddWithdraw() {
      const _this = this
      if (this.curreny && this.address) {
        // 获取用户ID
        let lang = localStorage.getItem('lang') || 'en_us'
        let res = await request.post('/web/address/withdraw/add', {
          token: this.token,
          currency: _this.curreny,
          address: _this.address,
          remark: _this.remark,
          language: lang
        })
        if (res.data.status === 0) {
          // 添加成功--刷新数据
          this.$message({
            message: _this.$t('lang.add_success'),
            type: 'success'
          })
          _this.curreny = ''
          _this.address = ''
          _this.remark = ''
          _this.getAddress(_this.page)
        } else {
          this.$message.error(res.data.msg)
        }
      } else {
        this.$message.error(this.$t('lang.Please_inputdata'))
      }
    },
    // 提币地址
    async getAddress(page) {
      // 获取用户ID
      let lang = localStorage.getItem('lang') || 'en_us'
      let res = await request.post('/web/address/withdraw/list', {
        language: lang,
        page: page,
        pageSize: 20,
        token: this.token
      })
      if (res.data.status == 0) {
        this.AddressData = res.data.data.content
      } else {
        this.$message.error(res.data.msg)
      }
    },
    // 删除
    async deleteRow(index, rows) {
      const _this = this
      let id = rows.id
      let lang = localStorage.getItem('lang') || 'en_us'
      this.$confirm(this.$t('lang.DeleteAddr'), {
        confirmButtonText: this.$t('lang.ok'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      })
        .then(async () => {
          let res = await request.post('/web/address/delete', {
            language: lang,
            token: this.token,
            id: id
          })
          if (res.data.status == 0) {
            // 删除成功，提示--刷新
            this.$message({
              message: _this.$t('lang.delete_success'),
              type: 'success'
            })
            this.getAddress(this.page)
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('lang.CancelOpration')
          })
          this.buyLoading = false
        })
    }
  },
  mounted() {
    this.getAddress(this.page)
  }
}
</script>
<style lang="less" scoped>
#record-container {
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  .record-wrap {
    padding: 0 32px;
    height: 100%;
    // display: flex;
    // flex-direction: column;
    h3 {
      padding: 30px 0 32px 0;
      font-size: 32px;
      height: 38px;
      font-family: Helvetica;
      color: #202224;
      line-height: 38px;
      font-weight: 400;
    }
    h5 {
      height: 24px;
      font-size: 20px;
      font-family: Helvetica;
      color: #202224;
      line-height: 24px;
      padding: 20px 0 27px 0;
    }
    .add-wrap {
      width: 100%;
      height: 199px;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #eff4fa;
      .add-inner {
        padding: 20px 52px 22px 38px;
        position: relative;
        .addr-data {
          width: 70%;
          .input-line {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .curreny-select {
              width: 20%;
              p {
                font-size: 15px;
                font-family: Helvetica;
                color: #c5cee0;
                line-height: 16px;
                padding-bottom: 17px;
              }
            }
            .addr-input {
              width: 76%;
              p {
                font-size: 15px;
                font-family: Helvetica;
                color: #c5cee0;
                line-height: 16px;
                padding-bottom: 17px;
              }
            }
          }
          .wallet {
            width: 100%;
            height: 50px;
            margin-top: 20px;
            background: #f9fbfd;
            border-radius: 4px;
            font-size: 12px;
            font-family: Helvetica;
            color: #8f9bb3;
            line-height: 16px;
          }
        }
        .add-btn {
          width: 173px;
          height: 54px;
          background: #4880ff;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          line-height: 54px;
          text-align: center;
          position: absolute;
          top: 53px;
          right: 52px;
          cursor: pointer;
        }
        .add-btn:hover {
          background: #4478f3;
        }
      }
    }
    .list-wrap {
      height: 590px;
      margin-bottom: 10px;
    }
  }
}
</style>
<style lang="less">
.el-textarea {
  .el-textarea__inner {
    background: transparent;
    border: none;
    font-size: 12px;
    font-family: Helvetica;
    color: #8f9bb3;
    line-height: 16px;
  }
}
.el-table__body-wrapper::-webkit-scrollbar {
  width: 0px;
}
</style>