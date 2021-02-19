<template>
  <div>
    <div
      class="about-accounts"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="about-accounts-content">
        <!-- logo -->
        <div class="about-accounts-logo">
          <img src="../../assets/img/icon_logo.png" alt />
        </div>
        <!-- 左侧标题 -->
        <div class="about-accounts-left">
          <h3>{{ pageTitle }}</h3>
          <p>{{ pageInfo }}</p>
        </div>
        <!-- 右侧表单区域 -->
        <div class="about-accounts-right">
          <h3>{{ loginTitle }}</h3>
          <!-- 登录表单 -->
          <div class="login-form" v-if="$route.path == '/login'">
            <el-form :rules="loginRules" :model="loginForm" ref="loginValidateForm" key="1">
              <el-form-item :label="$t('lang.Account')" prop="name">
                <el-input v-model="loginForm.name"></el-input>
              </el-form-item>
              <el-form-item :label="$t('lang.Password')" prop="password">
                <el-input v-model="loginForm.password" type="password"></el-input>
              </el-form-item>
              <div class="login-form-text">
                <h3>
                  <a @click.prevent="$router.push('/forget')">{{ $t("lang.Forgot_Password") }}?</a>
                </h3>
                <span>
                  <a @click.prevent="$router.push('/register')">
                    {{
                    $t("lang.Sign_Up")
                    }}
                  </a>
                </span>
              </div>
              <button
                class="login-btn"
                :disabled="loginDisabled"
                @click.prevent="sendLoginCode"
              >{{ $t("lang.LogIN") }}</button>
            </el-form>
          </div>

          <!-- 注册表单 -->
          <div class="sign_form" v-else-if="$route.path == '/register'">
            <div class="sign_tap">
              <span
                :class="{ asctiveTap: signType == 'phone' }"
                @click="signByPhone"
              >{{ $t("lang.sign_by_phone") }}</span>
              <span
                :class="{ asctiveTap: signType == 'email' }"
                @click="signByEmail"
              >{{ $t("lang.sign_by_email") }}</span>
            </div>
            <el-form
              class="sign_sub_form"
              :model="signForm"
              :rules="changePWDRule"
              ref="signForm"
              key="2"
            >
              <el-form-item :label="$t('lang.phone')" v-if="signType == 'phone'" prop="phone">
                <el-input v-model="signForm.phone"></el-input>
              </el-form-item>
              <el-form-item :label="$t('lang.Email')" v-if="signType == 'email'" prop="email">
                <el-input v-model="signForm.email"></el-input>
              </el-form-item>
              <el-form-item :label="$t('lang.set_pwd')" prop="pwd">
                <el-input type="password" v-model="signForm.pwd"></el-input>
              </el-form-item>
              <el-form-item :label="$t('lang.comfirm_pwd')" prop="comfirmPwd">
                <el-input type="password" v-model="signForm.comfirmPwd"></el-input>
              </el-form-item>
              <el-form-item class="tologin">
                <a @click.prevent="tologin">{{ $t("lang.account_login") }}</a>
              </el-form-item>
              <button class="login-btn" @click.prevent="toSign" :disabled="singDisabled">
                {{
                $t("lang.Sign_Up")
                }}
              </button>
            </el-form>
          </div>

          <!-- 忘记密码表单 -->
          <div class="forgot_form" v-else-if="$route.path == '/forget'">
            <div class="step1_tip">{{ $t("lang.step1tip") }}</div>
            <div class="step1" v-if="forgotStep == 1">
              <label for>
                {{ $t("lang.account") }}
                <el-input v-model="forgotForm.account"></el-input>
              </label>
              <button class="login-btn" @click="forgotStep1">
                {{
                $t("lang.nextStep")
                }}
              </button>
            </div>
            <div class="step2" v-if="forgotStep == 2">
              <label for v-if="userInfo.phone">
                {{ $t("lang.phone") }}
                <el-input v-model="forgotForm.phone"></el-input>
              </label>
              <label for v-if="userInfo.phone" class="getCode">
                {{ $t("lang.phone_code") }}
                <el-input v-model="forgotForm.phoneCode"></el-input>
                <button
                  class="forget-btn"
                  :class="{ abled: getCodeStatus1 }"
                  :disabled="!getCodeStatus1"
                  @click="getCode('phone')"
                >{{ getCodeTitle1 }}</button>
              </label>
              <label for v-if="userInfo.email">
                {{ $t("lang.Email") }}
                <el-input v-model="forgotForm.email"></el-input>
              </label>
              <label for v-if="userInfo.email" class="getCode">
                {{ $t("lang.mail_code") }}
                <el-input v-model="forgotForm.emailCode" class="getCode"></el-input>
                <button
                  class="forget-btn"
                  :class="{ abled: getCodeStatus2 }"
                  :disabled="!getCodeStatus2"
                  @click="getCode('email')"
                >{{ getCodeTitle2 }}</button>
              </label>
              <button @click="forgotStep2" class="login-btn">
                {{
                $t("lang.nextStep")
                }}
              </button>
            </div>
            <div class="step3" v-if="forgotStep == 3">
              <label for>
                {{ $t("lang.newPwd") }}
                <el-input type="password" v-model="forgotForm.newpwd"></el-input>
              </label>
              <label for>
                {{ $t("lang.comfirm_pwd") }}
                <el-input type="password" v-model="forgotForm.confirmPwd"></el-input>
              </label>
              <button class="login-btn" @click="final_forgot" @keyup.enter="final_forgot">
                {{
                $t("lang.Submit")
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 登录验证码dialog -->
      <el-dialog
        :visible="loginDialogVisible"
        :title="loginDialogTitle"
        append-to-body
        @close="closeLoginDialog"
        class="loginDialog"
        center
      >
        <el-input class="code_input" :placeholder="loginPlaceholder" v-model="loginForm.vcode"></el-input>
        <span slot="footer" class="dialog-footer">
          <button class="login-btn" @click="login_final" @keyup.enter="login_final">
            {{
            $t("lang.comfirm")
            }}
          </button>
        </span>
      </el-dialog>
      <!-- 注册验证码dialog -->
      <el-dialog
        class="signCodeDialog"
        :visible.sync="signCodeVisible"
        append-to-body
        :title="signTitle"
        center
        :show-close="false"
        @close="signUpClose"
      >
        <div class="sign_up_code" v-show="!signSuccess">
          <div class="code_tip">{{ signTip }}</div>
          <el-input
            class="code_input"
            :placeholder="$t('lang.phone_code')"
            v-if="signForm.phone"
            v-model="signForm.vcode"
          ></el-input>
          <el-input
            class="code_input"
            :placeholder="$t('lang.mail_code')"
            v-if="signForm.email"
            v-model="signForm.vcode"
          ></el-input>
          <button
            :class="{ disabled: !signGetcodeAbled, reget: true }"
            :disabled="!signGetcodeAbled"
            @click="reget"
          >{{ signReget }}</button>
        </div>
        <span slot="footer" class="dialog-footer" v-show="!signSuccess">
          <button @click="sign_final" @keyup.enter="sign_final" class="login-btn">
            {{
            $t("lang.comfirm")
            }}
          </button>
        </span>
        <div class="sign_success" v-show="signSuccess">
          <img src="../../assets/img/ic-righttype@2x.png" class="successIcon" />
          <span class="sucessTip">{{ $t("lang.sign_success") }}</span>
        </div>
        <span slot="footer" class="dialog-footer" v-show="signSuccess">
          <button @click="tologin" class="login-btn">{{ $t("lang.LogIN") }}</button>
          <div class="successSlogen">{{ $t("lang.signSuccessSlogen") }}</div>
        </span>
      </el-dialog>
    </div>
    <foot-bar></foot-bar>
  </div>
</template>

<script>
import md5 from 'js-md5'
import FootBar from 'components/common/footer.vue'
// 导入网络请求
import { request } from '../../network/request'

export default {
  data() {
    // 登录规则验证
    var checkName = (rule, value, callback) => {
      var TEL_REGEXP = /^1\d{10}$/
      var EMAIL_REGEXP = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (value === '') {
        callback(new Error(this.$t('lang.please_username')))
      } else if (!TEL_REGEXP.test(value) && !EMAIL_REGEXP.test(value)) {
        callback(new Error(this.$t('lang.please_right_username')))
      } else {
        callback()
      }
    }
    var checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('lang.plz_pwd')))
      } else {
        callback()
      }
    }
    // 注册密码正则
    var oldPWdcheck = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error(this.$t('lang.plz_pwd')))
      } else if (!this.PWDreg.test(value)) {
        return callback(new Error(this.$t('lang.pwd_limt')))
      } else {
        callback()
      }
    }
    var newPWDcheck = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error(this.$t('lang.enter_again')))
      } else if (value !== this.signForm.pwd) {
        callback(new Error(this.$t('lang.not_same')))
      } else {
        callback()
      }
    }
    var phoneCheck = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error(this.$t('lang.please_phone_number')))
      } else if (!/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error(this.$t('lang.please_right_phone')))
      } else {
        callback()
      }
    }
    var mailCheck = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error(this.$t('lang.please_email')))
      } else if (
        !/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(
          value
        )
      ) {
        callback(new Error(this.$t('lang.please_right_email')))
      } else {
        callback()
      }
    }
    return {
      //密码正则
      PWDreg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_\x21-\x7e]{6,32}$/,
      // loading
      loading: false,
      // 忘记密码显示title
      forgot_title: this.$t('lang.Forgot_Password'),
      // 登录验证
      loginRules: {
        name: [{ validator: checkName, trigger: 'blur' }],
        password: [{ validator: checkPassword, trigger: 'blur' }]
      },
      // 登录表单
      loginForm: {
        name: '',
        password: '',
        vcode: ''
      },
      // 用户信息
      userInfo: {},
      // 登录表单限制
      loginDisabled: false,
      // 登录验证码表单
      loginDialogVisible: false,
      loginDialogTitle: '',
      loginPlaceholder: '',
      // 当前注册方式
      signType: 'phone',
      // 注册表单
      signForm: {
        phone: '',
        email: '',
        pwd: '',
        comfirmPwd: '',
        vcode: ''
      },
      // 注册验证
      changePWDRule: {
        pwd: [
          {
            validator: oldPWdcheck,
            trigger: 'blur'
          }
        ],
        comfirmPwd: [
          {
            validator: newPWDcheck,
            trigger: 'blur'
          }
        ],
        phone: [
          {
            validator: phoneCheck,
            trigger: 'blur'
          }
        ],
        email: [
          {
            validator: mailCheck,
            trigger: 'blur'
          }
        ]
      },
      // 注册表单限制
      singDisabled: false,
      // 注册验证码表单
      signCodeVisible: false,
      // 注册验证码表单
      signTitle: '',
      signTip: '',
      signReget: '',
      // 注册dialog 显示内容
      signSuccess: false,
      // 注册 重新获取验证码是否可用
      signGetcodeAbled: true,
      // 忘记密码步骤
      forgotStep: 1,
      // 忘记密码显示title
      forgot_title: this.$t('lang.Forgot_Password'),
      // 忘记密码表单
      forgotForm: {
        account: '',
        phone: '',
        phoneCode: '',
        email: '',
        emailCode: '',
        newpwd: '',
        confirmPwd: ''
      },
      // 忘记密码获取验证码按钮状态
      getCodeTitle1: this.$t('lang.get_captcha'),
      getCodeTitle2: this.$t('lang.get_captcha'),
      getCodeStatus1: true,
      getCodeStatus2: true,
      timer1: '',
      timer2: ''
    }
  },
  methods: {
    // 发送登录验证码
    sendLoginCode() {
      this.$refs.loginValidateForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          this.loginDisabled = true
          if (this.loginForm.name.indexOf('@') !== -1) {
            this.loginDialogTitle = this.$t('lang.email_v')
            this.loginPlaceholder = this.$t('lang.mail_code')
          } else {
            this.loginDialogTitle = this.$t('lang.phone_v')
            this.loginPlaceholder = this.$t('lang.phone_code')
          }
          const { data: res } = await request.post('/web/user/84login', {
            language: this.$i18n.locale,
            name: this.loginForm.name,
            password: md5(this.loginForm.password)
          })
          if (res.status == 0) {
            this.loginDisabled = false
            this.loading = false
            this.userInfo = res.data
            this.loginDialogVisible = true
          } else {
            this.loginDisabled = false
            this.loading = false
            this.$message.error(res.msg)
          }
        } else {
          return false
        }
      })
    },
    // 关闭登录验证码dialog
    closeLoginDialog() {
      this.loginDialogVisible = false
      this.loginForm.vcode = ''
    },
    // 登录实现
    async login_final() {
      this.loading = true
      if (!this.loginForm.vcode) {
        this.$message.error(this.$t('lang.please_code'))
        return false
      }
      const { data: res } = await request.post('/web/user/84authCodeCheck', {
        code: this.loginForm.vcode,
        name: this.loginForm.name,
        nationCode: '86',
        type: this.userInfo.type,
        language: this.$i18n.locale
      })
      if (res.status == 0) {
        this.loginDialogVisible = false
        this.$message.success(this.$t('lang.login_succ'))
        document.cookie = ''
        var expire = new Date(new Date().getTime() + 24 * 60 * 60 * 1000) //有效期2小时
        expire = ';expires=' + expire.toUTCString()
        document.cookie = 'token=' + escape(res.data) + expire
        this.$store.commit('loginSuccess', true)
        this.$router.push('/home')
        this.loading = false
      } else {
        this.loading = false
        this.$message.error(res.msg)
      }
    },
    // 注册部分
    // 切换注册方式
    signByPhone() {
      this.$refs.signForm.resetFields()
      this.signType = 'phone'
      this.signForm = {
        phone: '',
        email: '',
        pwd: '',
        comfirmPwd: ''
      }
    },
    signByEmail() {
      this.$refs.signForm.resetFields()
      this.signType = 'email'
      this.signForm = {
        phone: '',
        email: '',
        pwd: '',
        comfirmPwd: ''
      }
    },
    //跳转登录
    tologin() {
      this.signCodeVisible = false
      this.signSuccess = false
      this.$router.push({
        path: '/login'
      })
    },
    // 注册验证码请求
    toSign() {
      this.$refs.signForm.validate(async (valid) => {
        if (valid) {
          this.singDisabled = true
          // 发送验证码
          let url = ''
          let name = ''
          if (this.signForm.phone) {
            url = '/web/authCode/phone'
            name = this.signForm.phone
            this.signTitle = this.$t('lang.phone_v')
            this.signTip =
              this.$t('lang.codeSend') +
              ' ' +
              this.$t('lang.phone') +
              ':' +
              name +
              ',' +
              this.$t('lang.pleaseCode')
            this.signReget = this.$t('lang.reGetPhone')
          } else if (this.signForm.email) {
            url = '/web/authCode/email'
            name = this.signForm.email
            this.signTitle = this.$t('lang.email_v')
            this.signTip =
              this.$t('lang.codeSend') +
              ' ' +
              this.$t('lang.Email') +
              ':' +
              name +
              ',' +
              this.$t('lang.pleaseCode')
            this.signReget = this.$t('lang.reGetEmail')
          }
          const { data: res } = await request.post(url, {
            language: this.$i18n.locale,
            name,
            nationCode: '86'
          })
          if (res.status == 0) {
            this.singDisabled = false
            //打开dialog
            this.signCodeVisible = true
          } else {
            this.singDisabled = false
            this.$message.error(res.msg)
          }
        } else {
          return false
        }
      })
    },
    // 点击旁边 清空状态
    signUpClose() {
      if (this.signSuccess) {
        this.tologin()
      }
      this.signForm.vcode = ''
      this.signSuccess = false
      clearInterval(this.timer3)
      this.signGetcodeAbled = false
    },
    // 注册重新获取验证码
    async reget() {
      let url, name
      if (this.signForm.phone) {
        url = '/web/authCode/phone'
        name = this.signForm.phone
      } else if (this.signForm.email) {
        url = '/web/authCode/email'
        name = this.signForm.email
      }
      let count = 60
      this.timer3 = setInterval(() => {
        this.signGetcodeAbled = false
        count--
        if (count <= 0) {
          this.signGetcodeAbled = true
        }
      }, 1000)
      const { data: res } = await request.post(url, {
        language: this.$i18n.locale,
        name,
        nationCode: '86'
      })
      if (res.status == 0) {
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    // 最终注册发起
    async sign_final() {
      if (this.signForm.phone && !this.signForm.vcode) {
        this.$message.error(this.$t('lang.please_code'))
        return false
      }
      if (this.signForm.email && !this.signForm.vcode) {
        this.$message.error(this.$t('lang.please_code'))
        return false
      }
      let code, name, pwd, type, language, nationCode
      code = this.signForm.vcode
      language = this.$i18n.locale
      nationCode = '86'
      name = this.signForm.phone || this.signForm.email
      type = (this.signForm.phone && 1) || (this.signForm.email && 0)
      pwd = md5(this.signForm.pwd)
      const { data: res } = await request.post('web/user/register', {
        code,
        name,
        pwd,
        type,
        language,
        nationCode
      })
      if (res.status == 0) {
        this.signSuccess = true
        this.signTitle = ''
        this.signForm = {
          phone: '',
          email: '',
          pwd: '',
          comfirmPwd: '',
          vcode: ''
        }
      } else {
        this.$message.error(res.msg)
      }
    },

    // 注册重新获取验证码
    async reget() {
      let url, name
      if (this.signForm.phone) {
        url = '/web/authCode/phone'
        name = this.signForm.phone
      } else if (this.signForm.email) {
        url = '/web/authCode/email'
        name = this.signForm.email
      }
      let count = 60
      this.timer3 = setInterval(() => {
        this.signGetcodeAbled = false
        count--
        if (count <= 0) {
          this.signGetcodeAbled = true
        }
      }, 1000)
      const { data: res } = await request.post(url, {
        language: this.$i18n.locale,
        name,
        nationCode: '86'
      })
      if (res.status == 0) {
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    // 忘记密码跳转第二步
    async forgotStep1() {
      if (this.forgotForm.account == '') {
        this.$message.error(this.$t('lang.plz_account'))
        return false
      }
      const { data: res } = await request.post(
        '/web/user/resetPassword/checkUser',
        {
          language: this.$i18n.locale,
          name: this.forgotForm.account,
          nationCode: '86'
        }
      )
      if (res.status !== 0) {
        this.$message.error(res.msg)
      } else {
        this.forgot_title = this.$t('lang.security_erification')
        this.forgotStep = 2
        this.userInfo = res.data
        // 修改title
      }
    },
    // 忘记密码校验 获取验证码
    async getCode(type) {
      if (type == 'phone' && !this.forgotForm.phone) {
        this.$message.error(this.$t('lang.please_phone_number'))
        return false
      } else if (
        type == 'phone' &&
        !/^1[3-9]\d{9}$/.test(this.forgotForm.phone)
      ) {
        this.$message.error(this.$t('lang.please_right_phone'))
        return false
      }

      if (type == 'email' && !this.forgotForm.email) {
        this.$message.error(this.$t('lang.please_email'))
        return false
      } else if (
        type == 'email' &&
        !/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(
          this.forgotForm.email
        )
      ) {
        this.$message.error(this.$t('lang.please_right_email'))
        return false
      }
      if (type == 'phone') {
        this.getCodeStatus1 = false
        let count = 60
        this.timer1 = setInterval(() => {
          this.getCodeTitle1 = this.$t('lang.reacquire') + '(' + count + 'S)'
          this.getCodeStatus1 = false
          count--
          if (count <= 0) {
            this.getCodeTitle1 = this.$t('lang.get_captcha')
            this.getCodeStatus1 = true
          }
        }, 1000)
      }
      if (type == 'email') {
        let count = 60
        this.getCodeStatus2 = false
        this.timer1 = setInterval(() => {
          this.getCodeTitle2 = this.$t('lang.reacquire') + '(' + count + 'S)'
          this.getCodeStatus2 = false
          count--
          if (count <= 0) {
            this.getCodeTitle2 = this.$t('lang.get_captcha')
            this.getCodeStatus2 = true
          }
        }, 1000)
      }
      let language, name, nationCode, url
      language = this.$i18n.locale
      name = type == 'phone' ? this.forgotForm.phone : this.forgotForm.email
      nationCode = '86'
      url = '/web/authCode/' + type
      const { data: res } = await request.post(url, {
        language,
        name,
        nationCode
      })
      if (res.status !== 0) {
        this.$message.error(res.msg)
      }
    },
    // 忘记密码跳转转三步
    async forgotStep2() {
      // 手机找回密码校验
      if (this.userInfo.phone && !this.forgotForm.phone) {
        this.$message.error(this.$t('lang.please_phone_number'))
        return false
      } else if (
        this.userInfo.phone &&
        !/^1[3-9]\d{9}$/.test(this.forgotForm.phone)
      ) {
        this.$message.error(this.$t('lang.please_right_phone'))
        return false
      } else if (this.userInfo.phone && !this.forgotForm.phoneCode) {
        this.$message.error(this.$t('lang.please_code'))
        return false
      }
      // 邮箱找回密码校验
      if (this.userInfo.email && !this.forgotForm.email) {
        this.$message.error(this.$t('lang.please_email'))
        return false
      } else if (
        this.userInfo.email &&
        !/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(
          this.forgotForm.email
        )
      ) {
        this.$message.error(this.$t('lang.please_right_email'))
        return false
      } else if (this.userInfo.email && !this.forgotForm.emailCode) {
        this.$message.error(this.$t('lang.please_code'))
        return false
      }
      const { data: res } = await request.post(
        '/web/user/resetPassword/checkAuthCode',
        {
          language: this.$i18n.locale,
          name: this.forgotForm.account,
          emailCode: this.forgotForm.emailCode,
          phoneCode: this.forgotForm.phoneCode
        }
      )
      if (res.status == 0) {
        this.forgot_title = this.$t('lang.set_pwd')
        this.forgotStep = 3
      } else {
        this.$message.error(res.msg)
      }
    },
    // 忘记密码修改提交
    async final_forgot() {
      if (!this.forgotForm.newpwd) {
        this.$message.error(this.$t('lang.plz_pwd'))
        return false
      } else if (!this.PWDreg.test(this.forgotForm.newpwd)) {
        this.$message.error(this.$t('lang.pwd_limt'))
        return false
      }
      if (!this.forgotForm.confirmPwd) {
        this.$message.error(this.$t('lang.enter_again'))
        return false
      } else if (this.forgotForm.confirmPwd != this.forgotForm.newpwd) {
        this.$message.error(this.$t('lang.not_same'))
        return false
      }

      const { data: res } = await request.post(
        '/web/user/resetPassword/doReset',
        {
          language: this.$i18n.locale,
          name: this.forgotForm.account,
          password: md5(this.forgotForm.newpwd)
        }
      )

      if (res.status == 0) {
        this.$message.success(this.$t('lang.changeSuccess'))
        this.forgotStep = 1
        this.forgot_title = this.$t('lang.Forgot_Password')
        this.forgotForm = {
          account: '',
          phone: '',
          phoneCode: '',
          email: '',
          emailCode: '',
          newpwd: '',
          confirmPwd: ''
        }
        this.$router.push('/login')
      }
    }
  },
  computed: {
    // 根据路由显示不同内容
    pageTitle() {
      if (this.$route.path == '/login' || this.$route.path == '/forget') {
        return this.$t('lang.Login')
      } else if (this.$route.path == '/register') {
        return this.$t('lang.Sign_Up')
      }
    },
    pageInfo() {
      if (this.$route.path == '/login' || this.$route.path == '/forget') {
        return this.$t('lang.Login_info')
      } else if (this.$route.path == '/register') {
        return this.$t('lang.Please_fill')
      }
    },
    // 表单区域显示内容
    loginTitle() {
      switch (this.$route.path) {
        case '/login':
          return this.$t('lang.Log_in')
          break
        case '/register':
          return this.$t('lang.Sign_Up')
          break
        case '/forget':
          return this.forgot_title
          bbreak
      }
    }
  },
  components: {
    FootBar
  }
}
</script>

<style  lang="less" scope>
.login-btn {
  width: 100%;
  background: #000000;
  border-radius: 50px;
  font-size: 16px;
  line-height: 40px;
  cursor: pointer;
  font-family: Helvetica;
  color: #ffffff;
  outline: none;
  border: none;
}
.login-btn {
  cursor: pointer;
  position: relative;
}
.login-btn:hover {
  background-color: #333;
}

.login-btn:active:after {
  opacity: 0.3;
  //设置初始状态
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0s;
}
.login-btn:after {
  content: '';
  display: block;
  position: absolute;
  //扩大伪类元素4个方向各10px
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  pointer-events: none;
  border-radius: 20px;
  background-color: #333;
  background-repeat: no-repeat;
  background-position: 50%;
  opacity: 0;
  transition: all 0.3s;
}

.about-accounts {
  box-sizing: border-box;
  height: 950px;
  box-sizing: border-box;
  overflow: hidden;
  background: url(../../assets/img/bg.login.png) no-repeat top center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow-x: hidden;

  .about-accounts-content {
    width: 1440px;
    margin: 0 auto;
    position: relative;
    .about-accounts-logo {
      width: 250px;
      position: absolute;
      left: 40px;
      top: 40px;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .about-accounts-left {
      float: left;
      margin-left: 175px;
      margin-top: 233px;

      h3 {
        height: 65px;
        font-size: 46px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000000;
        line-height: 65px;
      }

      p {
        margin-top: 39px;
        width: 344px;
        height: 66px;
        font-size: 24px;
        font-family: Avenir-Medium, Avenir;
        font-weight: 500;
        color: #000000;
        line-height: 33px;
      }
    }
    .about-accounts-right {
      float: right;
      width: 281px;
      background: #ffffff;
      border-radius: 10px;
      margin-top: 178px;
      margin-right: 175px;
      padding: 40px 30px;
      box-sizing: border-box;

      h3 {
        font-weight: normal;
        text-align: center;
        font-size: 24px;
        font-family: Helvetica;
        color: #000000;
        line-height: 42px;
        margin: 0;
      }
      .login-form {
        margin-top: 20px;

        input {
          width: 220px;
          height: 40px;
          background: #ffffff !important;
          border-radius: 54px;
          border: 1px solid #dedfe5;
        }
        .login-form-text {
          margin-top: 24px;
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-weight: 600;
          margin-bottom: 25px;

          h3 {
            width: 150px;
            height: 17px;
            font-size: 14px;
            font-family: Helvetica;
            color: #000000;
            line-height: 17px;
            text-align: left !important;
            font-weight: 600;
            cursor: pointer;
          }

          span {
            display: block;
            width: 60px;
            height: 17px;
            font-size: 14px;
            font-family: Helvetica;
            color: #000000;
            line-height: 17px;
            cursor: pointer;
          }
        }
      }
      .sign_tap {
        margin-top: 20px;
        display: flex;
        justify-content: space-around;
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #c5cee0;
        span {
          cursor: pointer;
        }
        .asctiveTap {
          color: #222b45;
          position: relative;
        }
        .asctiveTap::after {
          content: '';
          display: block;
          width: 22px;
          height: 2px;
          transform: rotateX(180deg) translateX(-50%);
          background: #0095ff;
          position: absolute;
          left: 50%;
          bottom: -10px;
        }
      }
      .sign_sub_form {
        margin-top: 18px;
        /deep/ .el-input__inner {
          border-radius: 20px;
        }

        .tologin {
          text-align: center;
          height: 20px;
          cursor: pointer;
          margin-bottom: 25px;

          a {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #e72427;
          }
        }
        .el-form-item {
          margin-bottom: 20px;
          label {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #8c9199;
          }
        }
      }

      .forgot_form {
        .step2 {
          .getCode {
            position: relative;
            .el-input__inner {
              padding-right: 100px;
            }
            .forget-btn {
              position: absolute;
              border: none;
              top: 86px;
              right: 5px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              background-color: transparent;
              outline: none;
              white-space: nowrap;
            }
            .abled {
              color: #000000;
              cursor: pointer;
            }
            .abled:hover {
              color: #4880ff;
            }
          }
        }
        .step1_tip {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #e72427;
          margin-bottom: 40px;
          text-align: center;
        }
        label {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #8c9199;
        }

        .el-input {
          margin-top: 8px;
          margin-bottom: 20px;
        }
        .el-input__inner {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #dedfe5;
        }
      }
    }
  }
}
.loginDialog {
  margin-top: 15vh;
  .el-dialog {
    width: 420px;
    background: #ffffff;
    border-radius: 8px;
  }
  .el-input__inner {
    // width: 360px;
    // height: 40px;
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid #dedfe5;
  }
}
.signCodeDialog {
  margin-top: 10vh;
  .el-dialog {
    margin-top: 25vh;
    width: 420px;
    background: #ffffff;
    border-radius: 8px;
    .el-dialog__header {
      border: none;
    }
    .sign_success {
      width: 100%;
      font-size: 22px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #000000;
      padding-bottom: 47px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      .successIcon {
        width: 32px;
        height: 32px;
        margin-right: 20px;
      }
    }
    .code_input {
      margin: 40px 0 0 0;
      .el-input__inner {
        width: 360px;
        height: 40px;
        border-radius: 20px;
        border: 1px solid #dedfe5;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }

    .reget {
      border: none;
      width: 100%;
      text-align: center;
      margin-top: 30px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #e72427;
      cursor: pointer;
      background-color: transparent;
    }
    .disabled {
      color: #cccccc;
      cursor: not-allowed;
    }

    .successSlogen {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #202224;
      margin-top: 10px;
    }

    .el-dialog__header {
      padding-top: 46px;
      padding-bottom: 10px;
    }
    .el-dialog__body {
      padding-top: 0;
      padding-bottom: 0;
    }
    .el-dialog__title {
      font-size: 22px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #000000;
    }
    .code_tip {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8c9199;
    }
  }
}
</style>
