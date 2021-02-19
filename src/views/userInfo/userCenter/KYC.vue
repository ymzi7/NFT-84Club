<template>
  <div class="kyc_container">
    <div class="kyc_title">{{ $t("lang.kyc_certification") }}</div>
    <div class="step_container">
      <div
        class="step_block"
        :class="kycStyle(index)"
        v-for="(item, index) in KYCList"
        :key="index"
        @click="goKyc(index + 1)"
      >
        <div class="step">{{ item.title }}</div>
        <div class="status">
          {{ item.status }}
          <div class="errorMsg">{{ errorMsgList["c" + (index + 1)] }}</div>
        </div>
        <div class="power_Msg">
          {{ item.powerMsg }}
          <span class="limitC" v-if="item.limitC">{{ item.limitC }}</span>
        </div>
      </div>
    </div>
    <div class="form_container">
      <div class="c1_container" v-show="activeStep == 1">
        <el-form
          ref="formC1"
          :rules="c1Rules"
          :model="formC1"
          label-position="top"
          size="medium"
          class="c1_form"
          v-if="userInfo.c1AuthStatus === 0"
        >
          <div class="c1_form_input">
            <el-form-item :label="$t('lang.Name')" prop="name">
              <el-input
                v-model.trim="formC1.name"
                class="C1_input"
                :placeholder="$t('lang.namePlaceholder')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('lang.Country')" prop="codeName">
              <el-select
                v-model="formC1.codeName"
                :placeholder="$t('lang.countryPlaceholder')"
                class="C1_input"
              >
                <el-option
                  v-for="country in countryList"
                  :key="country.nameEn"
                  :value="country.codeName"
                  :label="country[countryLang]"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('lang.Document_type')" prop="certType">
              <el-select
                v-model="formC1.certType"
                :placeholder="$t('lang.documentTypePlaceholder')"
                class="C1_input"
              >
                <el-option :label="$t('lang.ID')" :value="1"></el-option>
                <el-option :label="$t('lang.passports')" :value="2"></el-option>
                <el-option :label="$t('lang.driving_licence')" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('lang.Identification_Number')" prop="certNo">
              <el-input
                v-model.trim="formC1.certNo"
                class="C1_input"
                :placeholder="$t('lang.IDNumberPlaceholder')"
              ></el-input>
            </el-form-item>
          </div>
          <div class="tips">
            <div class="tip_msg">
              {{ $t("lang.c1_submit_tip1") }}
              <br />
              {{ $t("lang.c1_submit_tip2") }}
            </div>
            <el-button @click="submit()" class="submit C1_input">
              {{
              $t("lang.Submit")
              }}
            </el-button>
          </div>
        </el-form>
        <el-form
          ref="formC1"
          :model="c1Info"
          label-position="top"
          size="medium"
          class="c1_form"
          v-else-if="userInfo.c1AuthStatus === 1"
          disabled
        >
          <div class="c1_form_input">
            <el-form-item :label="$t('lang.Name')" prop="name">
              <el-input
                v-model.trim="c1Info.Name"
                class="C1_input"
                :placeholder="$t('lang.namePlaceholder')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('lang.Country')" prop="codeName">
              <el-input v-model.trim="c1Info.Country" class="C1_input"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lang.Document_type')" prop="certType">
              <el-input v-model.trim="c1Info['Document type']" class="C1_input"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lang.Identification_Number')" prop="certNo">
              <el-input
                v-model.trim="c1Info['Identification Number']"
                class="C1_input"
                :placeholder="$t('lang.IDNumberPlaceholder')"
              ></el-input>
            </el-form-item>
          </div>
          <div class="tips">
            <div class="tip_msg">
              {{ $t("lang.c1_submit_tip1") }}
              <br />
              {{ $t("lang.c1_submit_tip2") }}
            </div>
            <el-button @click="submit()" class="submit_disab C1_input">
              {{
              $t("lang.Submit")
              }}
            </el-button>
          </div>
        </el-form>
        <div v-else class="certified">
          <div class="pass"></div>
          <div class="pass_tip">{{ KYCList[0].status }}</div>
        </div>
      </div>
      <div class="c2_container" v-show="activeStep == 2">
        <div class="c2_show_container" v-if="userInfo.c2AuthStatus !== 2">
          <div class="info_show">
            <div class="c2_info_group">
              <div class="c2_info_title">{{ $t("lang.Name") }}</div>
              <div class="c2_info_msg">{{ c1Info.Name }}</div>
            </div>
            <div class="c2_info_group">
              <div class="c2_info_title">{{ $t("lang.Country") }}</div>
              <div class="c2_info_msg">{{ c1Info.Country }}</div>
            </div>
            <div class="c2_info_group">
              <div class="c2_info_title">{{ $t("lang.Document_type") }}</div>
              <div class="c2_info_msg">{{ c1Info["Document type"] }}</div>
            </div>
            <div class="c2_info_group">
              <div class="c2_info_title">{{ $t("lang.Identification_number") }}</div>
              <div class="c2_info_msg">{{ c1Info["Identification Number"] }}</div>
            </div>
          </div>
          <div class="c2_form_contianer">
            <div class="c2_tips_container">
              <div class="c2_tips">
                <div class="c2_tips_title">{{ $t("lang.font_id_title") }}</div>
                <div class="c2_tips_msg">
                  {{ $t("lang.font_id_tip1") }}
                  <br />
                  {{ $t("lang.font_id_tip2") }}
                  <br />
                  {{ $t("lang.font_id_tip3") }}
                </div>
              </div>
              <div class="c2_tips">
                <div class="c2_tips_title">{{ $t("lang.reverse_title") }}</div>
                <div class="c2_tips_msg">
                  {{ $t("lang.reverse_tip1") }}
                  <br />
                  {{ $t("lang.reverse_tip2") }}
                  <br />
                  {{ $t("lang.reverse_tip3") }}
                  <br />
                  {{ $t("lang.reverse_tip4") }}
                </div>
              </div>
              <div class="c2_tips">
                <div class="c2_tips_title">{{ $t("lang.hold_title") }}</div>
                <div class="c2_tips_msg">
                  {{ $t("lang.hold_tip1") }}
                  <br />
                  {{ $t("lang.hold_tip2") }}
                  <br />
                  {{ $t("lang.hold_tip3") }}
                </div>
              </div>
            </div>
            <div class="upload_container">
              <el-upload
                class="avatar-uploader"
                :action="fileUpload()"
                :show-file-list="false"
                :on-success="handleAvatarSuccess.bind(this, 'c2a')"
                :before-upload="beforeAvatarUpload.bind(this, 'c2a')"
                v-loading="loadingList.c2a"
                :disabled="userInfo.c2AuthStatus !== 0"
              >
                <img v-if="c2ImgUrl.c2a" :src="c2ImgUrl.c2a" class="avatar" />
                <img
                  v-else-if="c2Info.certFront && userInfo.c2AuthStatus !== 0"
                  :src="c2Info.certFront"
                  class="avatar"
                />
                <div v-else class="upload"></div>
              </el-upload>
              <el-upload
                class="avatar-uploader"
                :action="fileUpload()"
                :show-file-list="false"
                :on-success="handleAvatarSuccess.bind(this, 'c2b')"
                :before-upload="beforeAvatarUpload.bind(this, 'c2b')"
                v-loading="loadingList.c2b"
                :disabled="userInfo.c2AuthStatus !== 0"
              >
                <img v-if="c2ImgUrl.c2b" :src="c2ImgUrl.c2b" class="avatar" />
                <img
                  v-else-if="c2Info.certHold && userInfo.c2AuthStatus !== 0"
                  :src="c2Info.certHold"
                  class="avatar"
                />
                <div v-else class="upload"></div>
              </el-upload>
              <el-upload
                class="avatar-uploader"
                :action="fileUpload()"
                :show-file-list="false"
                :on-success="handleAvatarSuccess.bind(this, 'c2c')"
                :before-upload="beforeAvatarUpload.bind(this, 'c2c')"
                v-loading="loadingList.c2c"
                :disabled="userInfo.c2AuthStatus !== 0"
              >
                <img v-if="c2ImgUrl.c2c" :src="c2ImgUrl.c2c" class="avatar" />
                <img
                  v-else-if="c2Info.certReverse && userInfo.c2AuthStatus !== 0"
                  :src="c2Info.certReverse"
                  class="avatar"
                />
                <div v-else class="upload"></div>
              </el-upload>
            </div>
            <div class="example_container">
              <div class="example example1"></div>
              <div class="example example2"></div>
              <div class="example example3"></div>
            </div>
            <div class="example_tips_container">
              <div class="example_tip">
                <span>{{ $t("lang.example1") }}</span>
              </div>
              <div class="example_tip">
                <span>{{ $t("lang.example2") }}</span>
              </div>
              <div class="example_tip">
                <span>{{ $t("lang.example3") }}</span>
              </div>
            </div>
          </div>
          <el-button
            :disabled="userInfo.c2AuthStatus !== 0"
            :class="c2_btnClass"
            @click="c2Request"
            type="primary"
          >{{ $t("lang.Submit") }}</el-button>
        </div>
        <div v-else class="certified">
          <div class="pass"></div>
          <div class="pass_tip">{{ KYCList[1].status }}</div>
        </div>
      </div>
      <div class="c3_container" v-show="activeStep == 3">
        <div class="c3_show_container" v-if="true">
          <!-- <div class="c3_show_container" v-if="userInfo.c3AuthStatus === 0"> -->
          <div class="c3_bkg">
            <el-button
              :disabled="userInfo.c3AuthStatus !== 0"
              :class="c3_btnClass"
              @click="c3Request"
              type="primary"
            >{{$t('lang.Submit_application')}}</el-button>
          </div>
          <div class="c3_tips">
            <div class="c3_tips_title">{{ $t("lang.Prompt") }}</div>
            {{ $t("lang.c3_tip1") }}
            <br />
            {{ $t("lang.c3_tip2") }}
          </div>
        </div>
        <div v-else class="certified">
          <div class="pass"></div>
          <div class="pass_tip">{{ KYCList[2].status }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { request, baseURL } from '../../../network/request'
import { getToken } from '../../../utils/utils'

export default {
  title: 'KYC',
  data() {
    return {
      token: '',
      //当前账户总btc
      totalBTC: '',
      // 当前kyc验证步骤
      activeStep: '',
      // 用户信息
      userInfo: {},
      //可选取的国家列表
      countryList: {},
      // c2验证loading
      loadingList: {
        c2a: false,
        c2b: false,
        c2c: false
      },
      errorMsgList: {
        c1: '',
        c2: '',
        c3: ''
      },
      KYCList: [
        {
          title: 'C1',
          status: '',
          powerMsg: this.$t('lang.c12_tips'),
          limitC: this.$t('lang.c1_limit')
        },
        {
          title: 'C2',
          status: '',
          powerMsg: this.$t('lang.c12_tips'),
          limitC: this.$t('lang.c2_limit')
        },
        {
          title: 'C3',
          status: '',
          powerMsg: this.$t('lang.c3_tips')
        }
      ],
      formC1: {
        certNo: '',
        certType: '',
        name: '',
        codeName: '',
        token: '',
        language: this.$i18n.locale
      },
      formC2: {
        certFront: '',
        certHold: '',
        certReverse: '',
        language: this.$i18n.locale,
        token: ''
      },
      formC3: {
        language: this.$i18n.locale,
        token: ''
      },
      c1Info: {
        Name: '',
        Country: '',
        'Document type': '',
        'Identification Number': '',
        status: 0
      },
      c2Info: {
        certFront: '',
        certHold: '',
        certReverse: ''
      },
      c2ImgUrl: {
        c2a: '',
        c2b: '',
        c2c: ''
      },
      c1Rules: {
        name: [
          {
            required: true,
            message: this.$t('lang.plz_enter_name'),
            trigger: 'blur'
          }
        ],
        codeName: [
          {
            required: true,
            message: this.$t('lang.plz_chose_country'),
            trigger: 'blur'
          }
        ],
        certType: [
          {
            required: true,
            message: this.$t('lang.plz_chose_DT'),
            trigger: 'blur'
          }
        ],
        certNo: [
          {
            required: true,
            message: this.$t('lang.plz_enter_ID'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    //country中英文
    countryLang() {
      if (this.$i18n.locale == 'zh_cn') {
        return 'nameZh'
      } else {
        return 'nameEn'
      }
    },
    //c2按钮样式
    c2_btnClass() {
      if (this.userInfo.c2AuthStatus !== 0) {
        return 'c2_btn_disab'
      } else {
        return 'c2_btn'
      }
    },
    // c3 按钮样式
    c3_btnClass() {
      if (this.userInfo.c3AuthStatus !== 0) {
        return 'c3_btn_disab'
      } else {
        return 'c3_btn'
      }
    },
    // 动态切换样式
    kycStyle() {
      return function (index) {
        let cls = 'c' + (index + 1)
        return { active: this.activeStep == index + 1, [cls]: true }
      }
    },
    // 前置认证通过后才能访问下一个
    activedStep() {
      let step = this.$route.query.step
      if (step == 3 && this.userInfo.c2AuthStatus == 1) {
        step = 3
      }
      if (step == 3 && this.userInfo.c2AuthStatus !== 1) {
        step = 2
      }
      if (step == 2 && this.userInfo.c1AuthStatus == 1) {
        step = 2
      }
      return step
    }
  },
  created() {
    this.tokne = getToken()
    this.getLocalUserInfo()
    this.getUserInfo()
    this.activeStep = this.activedStep
    this.goKyc(this.activeStep)
    this.getCountryList()
    this.getC1Info()
    this.getC2Info()
  },
  activated() {
    this.getLocalUserInfo()
    this.getUserInfo()
    this.activeStep = this.activedStep
    this.goKyc(this.activeStep)
  },
  deactivated() {},
  methods: {
    // 文件上传地址
    fileUpload() {
      return baseURL + '/file/upload'
    },
    nextReplace(step) {
      if (step != 1) {
        this.$router.replace({
          path: './kyc',
          query: {
            step: step
          }
        })
      }
    },
    async getUserInfo() {
      const { data: res } = await request.post('./web/user/info', {
        language: this.$i18n.locale,
        token: getToken()
      })
      if (res.status == 0) {
        var userInfO = JSON.stringify(res.data)

        localStorage.removeItem('userInfo')
        localStorage.setItem('userInfo', userInfO)
        this.getLocalUserInfo()
        this.getStatus()
      }
    },
    async getC1Info() {
      const { data: res } = await request.post('./web/kyc/c1/info', {
        language: this.$i18n.locale,
        token: getToken()
      })
      if (res.status == 0) {
        this.errorMsgList.c1 = res.data.remark
        this.c1Info.Name = res.data.name
        this.c1Info.Country = res.data.country
        this.c1Info['Identification Number'] = res.data.certNo
        this.c1Info.status = res.data.status
        switch (res.data.certType) {
          case 1:
            this.c1Info['Document type'] = this.$t('lang.ID')
            break
          case 2:
            this.c1Info['Document type'] = this.$t('lang.Passports')
            break
          case 3:
            this.c1Info['Document type'] = this.$t('lang.Driving Licence')
        }
      }
    },
    async getC2Info() {
      const { data: res } = await request.post('./web/kyc/c2/info', {
        language: this.$i18n.locale,
        token: getToken()
      })
      if (res.status == 0) {
        if (res.data) {
          this.c2Info.certFront = res.data.certFront
          this.c2Info.certHold = res.data.certHold
          this.c2Info.certReverse = res.data.certReverse
          this.errorMsgList.c2 = res.data.remark
        }
      }
    },
    getLocalUserInfo() {
      const userIn = localStorage.getItem('userInfo')
      if (userIn) {
        this.userInfo = JSON.parse(userIn)
      }

      this.formC1.token = this.token
      this.formC2.token = this.token
      this.formC3.token = this.token
    },
    async getCountryList() {
      const { data: res } = await request.post('./web/kyc/country', {
        language: this.$i18n.locale,
        token: this.token
      })
      this.countryList = res.data
    },
    getStatus() {
      this.KYCList.map((item, index) => {
        let step = `c${index + 1}AuthStatus`
        switch (this.userInfo[step]) {
          case 0:
            item.status = this.$t('lang.not_certificated')
            break
          case 1:
            item.status = this.$t('lang.certificated')
            break
          case 2:
            item.status = this.$t('lang.applying')
            break
        }
      })
    },
    goKyc(step) {
      if (step == 2 && this.userInfo.c1AuthStatus != 1) {
        step = 1
        this.$message.error(this.$t('lang.plz_c1'))
      }
      if (step == 3 && this.userInfo.c2AuthStatus != 1) {
        step = 2
        this.$message.error(this.$t('lang.plz_c2'))
      }
      if (step == 2 && this.userInfo.c1AuthStatus != 1) {
        step = 1
      }
      this.activeStep = step
      this.$router.push({
        path: './kyc',
        query: {
          step
        }
      })
    },
    async submit() {
      this.$refs['formC1'].validate(async (valid) => {
        if (valid) {
          const { data: res } = await request.post('./web/kyc/c1', this.formC1)
          if (res.status !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success(res.msg)
            this.errorMsgList.c1 = ''
            this.getUserInfo()
            this.getC1Info()
          }
        } else {
          return false
        }
      })
    },
    handleAvatarSuccess(name, res, file) {
      const { status, data } = res
      if (status == 0) {
        this.loadingList[name] = false
        this.c2ImgUrl[name] = URL.createObjectURL(file.raw)
        switch (name) {
          case 'c2a':
            this.formC2.certFront = data
            break
          case 'c2b':
            this.formC2.certReverse = data
            break
          case 'c2c':
            this.formC2.certHold = data
        }
      } else {
        this.$message(this.$t('lang.upload_error'))
      }
    },
    beforeAvatarUpload(name, file) {
      const isJPG =
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif' ||
        file.type === 'image/jpeg'
      const isLt3M = file.size / 1024 / 1024 < 3
      if (!isJPG) {
        this.$message.error(this.$t('lang.support_file'))
      }
      if (!isLt3M) {
        this.$message.error(this.$t('lang.less_3MB'))
      }
      if (isJPG && isLt3M) {
        this.loadingList[name] = true
        return true
      } else {
        return false
      }
    },
    async c2Request() {
      const { data: res } = await request.post('./web/kyc/c2', this.formC2)
      if (res.status == 0) {
        this.$message.success(res.msg)
        this.errorMsgList.c2 = ''
        this.getUserInfo()
        this.getC2Info()
      } else {
        this.$message.error(res.msg)
      }
    },
    async c3Request() {
      const { data: res2 } = await request.post('/web/account/info', {
        language: this.$i18n.locale,
        token: this.token
      })

      if (res2.status == 0) {
        this.totalBTC = res2.data.totalBtc
      } else {
        this.$message.error(this.$t('lang.get_btc_error'))
      }
      if (this.totalBTC < 50) {
        this.$message.error(this.$t('lang.account_less_50'))
        return false
      }
      const { data: res } = await request.post('./web/kyc/c3', this.formC3)
      if (res.status == 0) {
        this.$message.success(res.msg)
        this.errorMsgList.c3 = ''
        this.getUserInfo()
      } else {
        this.$message.error(res.msg)
      }
    }
  },
  watch: {
    '$i18n.locale': function () {
      this.KYCList[0].powerMsg = this.$t('lang.c12_tips')
      this.KYCList[1].powerMsg = this.$t('lang.c12_tips')
      this.KYCList[2].powerMsg = this.$t('lang.c3_tips')
      this.KYCList[0].limitC = this.$t('lang.c1_limit')
      this.KYCList[1].limitC = this.$t('lang.c2_limit')
      this.c1Rules.name[0].message = this.$t('lang.plz_enter_name')
      this.c1Rules.codeName[0].message = this.$t('lang.plz_chose_country')
      this.c1Rules.certType[0].message = this.$t('lang.plz_chose_DT')
      this.c1Rules.certNo[0].message = this.$t('lang.plz_enter_ID')
      this.getStatus()
      this.getC1Info()
    }
  }
}
</script>

<style lang="less" scope>
.kyc_container {
  padding: 30px 26px 0 32px;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f4f4f4;
  height: 100%;
  .kyc_title {
    font-size: 32px;
    font-family: Helvetica;
    color: #202224;
    line-height: 38px;
    align-self: flex-start;
    margin-bottom: 27px;
  }
  .step_container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .step_block:nth-child(2) {
      margin: 0 38px;
    }
    .step_block {
      flex: 336px 1 1;
      height: 118px;
      background: #ececec;
      position: relative;
      .step {
        width: 74px;
        height: 60px;
        text-align: center;
        font-size: 30px;
        font-family: OpenSans-Bold, OpenSans;
        font-weight: bold;
        color: #a69494;
        line-height: 60px;
        border-radius: 25px;
        margin: 14px 0 14px 41px;
      }
      .status {
        position: absolute;
        text-align: right;
        top: 20px;
        right: 32px;
        font-size: 16px;
        font-family: Helvetica;
        color: #b2b2b2;
        .errorMsg {
          color: #ff3b70;
        }
      }
      .power_Msg {
        margin: 13px 0 0 39px;
        font-size: 14px;
        font-family: Helvetica;
        color: #565656;
      }
    }
    .c1 {
      .step {
        background: rgba(130, 128, 255, 0.21);
      }
      .limitC {
        color: #a69494;
      }
    }
    .c2 {
      .step {
        background: rgba(74, 217, 145, 0.21);
        color: rgba(74, 217, 145, 1);
      }
      .limitC {
        color: #4ad991;
      }
    }
    .c3 {
      .step {
        background: rgba(255, 144, 102, 0.3);
        color: rgba(234, 127, 87, 1);
      }
    }
    .active {
      background-color: #fff;
    }
  }
  .form_container {
    background-color: #fff;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    .certified {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-self: center;
      margin-top: 200px;
      .pass {
        width: 100px;
        height: 100px;
        background: url('../../../assets/img/Certified.png') #00e096 no-repeat
          center center;
        background-size: 80px;
        border-radius: 50px;
      }
      .pass_tip {
        font-size: 20px;
        font-family: Helvetica;
        color: #202224;
        line-height: 24px;
        margin-top: 20px;
      }
    }
    .el-form-item.is-required:not(.is-no-asterisk)
      > .el-form-item__label:before {
      content: '';
    }
    .c1_container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: flex-start;
    }
    .c1_form {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      padding: 40px 0 30px 46px;
      box-sizing: border-box;
      label {
        font-size: 15px;
        font-family: Helvetica;
        color: #c5cee0;
        line-height: 16px;
      }
      .el-select .el-input .el-select__caret::before {
        /*content: "\e78f"*/
        content: '';
        background: url('../../../assets/img/01) Icons／Filled／arrow-circle-down-fill Copy 5@2x.png')
          center center no-repeat;
        background-size: 16px 16px;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(180deg);
      }
      .C1_input {
        width: 328px;
        background: #ffffff;
        .el-input {
          width: 328px;
          border-radius: 8px;
          box-sizing: border-box;
        }
        input {
          font-size: 13px;
          font-family: Helvetica;
          color: #222b45;
          line-height: 16px;
          padding: 12px 0 12px 9px;
        }
        input::placeholder {
          color: #cccccc;
        }
      }
      .submit {
        width: 243px;
        height: 54px;
        background: #4880ff;
        border-radius: 12px;
        font-size: 16px;
        font-family: OpenSans-Semibold, OpenSans;
        font-weight: 600;
        color: #ffffff;
      }
      .submit_disab {
        width: 243px;
        height: 54px;
        background: #cccccc;
        border-color: #cccccc;
        border-radius: 12px;
        font-size: 16px;
        font-family: OpenSans-Semibold, OpenSans;
        font-weight: 600;
        color: #ffffff;
      }
      .tips {
        margin: 133px 0 0 46px;
        height: 189px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        .tip_msg {
          width: 243px;
          font-size: 15px;
          font-family: Helvetica;
          color: #c5cee0;
          margin-bottom: 20px;
        }
      }
    }
    .c2_container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .c2_show_container {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding-bottom: 30px;
      }
      .c2_btn {
        width: 243px;
        height: 54px;
        align-self: center;
        background-color: #4880ff;
        border-color: #4880ff;
        border-radius: 12px;
        font-size: 16px;
        font-family: OpenSans-Semibold, OpenSans;
        font-weight: 600;
        color: #ffffff;
      }
      .c2_btn_disab {
        width: 243px;
        height: 54px;
        align-self: center;
        background-color: #cccccc;
        border-color: #cccccc;
        border-radius: 12px;
        font-size: 16px;
        font-family: OpenSans-Semibold, OpenSans;
        font-weight: 600;
        color: #ffffff;
      }
      .info_show {
        width: 100%;
        height: 46px;
        background: #edfff5;
        margin: 22px 0 0 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 15px 0;
        box-sizing: border-box;
        justify-content: space-around;
        .c2_info_group {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .c2_info_title {
          font-size: 15px;
          font-family: Helvetica;
          color: #c5cee0;
          line-height: 16px;
          margin-right: 19px;
        }
        .c2_info_msg {
          font-size: 13px;
          font-family: OpenSans-Semibold, OpenSans;
          font-weight: 600;
          color: #222b45;
        }
      }
      .c2_form_contianer {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding: 0 0 0 47px;
        .c2_tips_container {
          display: flex;
          flex-direction: column;
          margin-top: 22px;
          .c2_tips {
            .c2_tips_title {
              font-family: Helvetica;
              font-size: 15px;
              color: #222b45;
              margin-bottom: 20px;
            }
            .c2_tips_msg {
              font-size: 15px;
              font-family: Helvetica;
              color: #c5cee0;
              margin-bottom: 39px;
              width: 416px;
            }
          }
        }
        .upload_container {
          margin-top: 22px;
          .el-upload {
            width: 210px;
            height: 100px;
            border-radius: 8px;
            border: 1px solid #eff4fa;
            box-sizing: border-box;
            margin-bottom: 40px;
            overflow: hidden;
            img {
              height: 100px;
            }
          }
          .upload {
            width: 210px;
            height: 100px;
            background: url('../../../assets/img/btn-upload.png') no-repeat
              center center;
            background-size: 210px 100px;
          }
        }
        .example_container {
          margin-top: 18px;
          .example1 {
            background: url('../../../assets/img/c2a.png') no-repeat center
              center;
          }
          .example2 {
            background: url('../../../assets/img/c2b.png') no-repeat center
              center;
            margin: 36px 0 38px 0;
          }
          .example3 {
            background: url('../../../assets/img/c2c.png') no-repeat center
              center;
          }
          .example {
            width: 154px;
            height: 104px;
            background-size: 154px 104px;
          }
        }
        .example_tips_container {
          margin-top: 18px;
          .example_tip {
            width: 107px;
            height: 104px;
            font-size: 15px;
            font-family: Helvetica;
            color: #c5cee0;
            display: flex;
            align-items: center;
          }
          .example_tip:nth-child(2) {
            margin: 36px 0 38px 0;
          }
        }
      }
    }
    .c3_container {
      .c3_show_container {
        padding: 44px 83px 83px 0;
      }
      .c3_bkg {
        width: 917px;
        height: 315px;
        background: url('../../../assets/img/ad-sa.png') no-repeat center center;
        background-size: 917px 315px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        .c3_btn {
          width: 243px;
          height: 54px;
          background: #4880ff;
          border-radius: 12px;
          font-size: 16px;
          font-family: OpenSans-Semibold, OpenSans;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: -27px;
        }
        .c3_btn_disab {
          width: 243px;
          height: 54px;
          background: #cccccc;
          border-color: #cccccc;
          border-radius: 12px;
          font-size: 16px;
          font-family: OpenSans-Semibold, OpenSans;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: -27px;
        }
      }
      .c3_tips {
        margin-top: 37px;
        font-size: 15px;
        font-family: Helvetica;
        color: #c5cee0;
        line-height: 16px;
        padding: 20px 0;
        .c3_tips_title {
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>