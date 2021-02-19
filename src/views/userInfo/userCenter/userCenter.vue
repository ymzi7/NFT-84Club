<template>
  <div class="center_container">
    <!-- 修改密码安全验证dialog -->
    <el-dialog
      :title="$t('lang.security_erification')"
      :visible.sync="pwdSafeVisible"
      :append-to-body="true"
      class="inner_dialog"
      @close="clearForm"
    >
      <div class="dialog_container">
        <el-form :model="PWDsafeForm">
          <el-form-item
            :label="$t('lang.phone')"
            v-show="PWDsafeForm.phone"
            style="margin-bottom:0"
          >
            <el-input v-model="PWDsafeForm.phone" disabled></el-input>
          </el-form-item>
          <div class="safe_code_container" v-show="PWDsafeForm.phone">
            <el-form-item
              :label="$t('lang.phone_code')"
              class="phone_container"
              style="margin-bottom:0"
            >
              <el-input v-model="PWDsafeForm.phoneCode" :placeholder="$t('lang.please_code')"></el-input>
            </el-form-item>
            <el-form-item class="code_container">
              <!-- 按钮样式1 点击传参判定-->
              <el-button
                :type="safeType3"
                :disabled="safeAble3"
                @click="getSafeCode('phones')"
              >{{safeTip3}}</el-button>
            </el-form-item>
          </div>
          <el-form-item
            :label="$t('lang.Email')"
            v-show="PWDsafeForm.email"
            style="margin-bottom:0"
          >
            <el-input v-model="PWDsafeForm.email" disabled></el-input>
          </el-form-item>
          <div class="safe_code_container" v-show="PWDsafeForm.email">
            <el-form-item
              :label="$t('lang.mail_code')"
              class="phone_container"
              style="margin-bottom:0"
            >
              <el-input v-model="PWDsafeForm.emailCode" :placeholder="$t('lang.please_code')"></el-input>
            </el-form-item>
            <el-form-item class="code_container" style="margin-bottom:0">
              <!-- 按钮样式1 点击传参判定-->
              <el-button
                :type="safeType4"
                :disabled="safeAble4"
                @click="getSafeCode('emails')"
              >{{safeTip4}}</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pwdSafeVisible=false">{{$t('lang.cancel')}}</el-button>
        <el-button type="primary" @click="pwdSafeSubmit">{{$t('lang.ok')}}</el-button>
      </span>
    </el-dialog>
    <!-- 修改密码dialog -->
    <el-dialog
      class="dialog"
      :visible.sync="pwdModifyVisible"
      :title="$t('lang.changePwd')"
      @close="clearForm"
    >
      <el-form :model="changePWDForm" ref="pwdForm" :rules="changePWDRule">
        <el-form-item :label="$t('lang.oldPwd')" prop="oldPWD">
          <el-input type="password" v-model="changePWDForm.oldPWD"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lang.newPwd')" prop="newPWD">
          <el-input type="password" v-model="changePWDForm.newPWD"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lang.newPwdAgain')" prop="newPWDConfrim">
          <el-input type="password" v-model="changePWDForm.newPWDConfrim"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pwdModifyVisible =false">{{$t('lang.cancel')}}</el-button>
        <el-button type="primary" @click="changePWD">{{$t('lang.ok')}}</el-button>
      </span>
    </el-dialog>
    <!-- 安全验证dialog -->
    <el-dialog
      :title="$t('lang.security_erification')"
      :visible.sync="safeVisible"
      :append-to-body="true"
      class="inner_dialog"
    >
      <div class="dialog_container">
        <div class="safa_tips" v-if="formType == 3 || formType == 5">{{$t('lang.unbundling_tips')}}</div>
        <el-form :model="safeForm">
          <el-form-item :label="$t('lang.phone')" v-show="safeForm.phone" style="margin-bottom:0">
            <el-input v-model="safeForm.phone" disabled></el-input>
          </el-form-item>
          <div class="safe_code_container" v-show="safeForm.phone">
            <el-form-item
              :label="$t('lang.phone_code')"
              class="phone_container"
              style="margin-bottom:0"
            >
              <el-input v-model="safeForm.phoneCode" :placeholder="$t('lang.please_code')"></el-input>
            </el-form-item>
            <el-form-item class="code_container">
              <el-button
                :type="safeType1"
                :disabled="safeAble1"
                @click="getSafeCode('phone')"
              >{{safeTip1}}</el-button>
            </el-form-item>
          </div>
          <el-form-item :label="$t('lang.Email')" v-show="safeForm.email" style="margin-bottom:0">
            <el-input v-model="safeForm.email" disabled></el-input>
          </el-form-item>
          <div class="safe_code_container" v-show="safeForm.email">
            <el-form-item
              :label="$t('lang.mail_code')"
              class="phone_container"
              style="margin-bottom:0"
            >
              <el-input v-model="safeForm.emailCode" :placeholder="$t('lang.please_code')"></el-input>
            </el-form-item>
            <el-form-item class="code_container" style="margin-bottom:0">
              <el-button
                :type="safeType2"
                :disabled="safeAble2"
                @click="getSafeCode('email')"
              >{{safeTip2}}</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelBtn2">{{$t('lang.cancel')}}</el-button>
        <el-button type="primary" @click="sendAnother">{{$t('lang.ok')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="formTitle"
      :visible.sync="formVisible"
      class="dialog"
      :append-to-body="true"
      @close="clearForm"
    >
      <!-- 绑定手机表单 -->
      <el-form
        :model="bindForm"
        ref="bindPhone"
        class="bindPhoneForm"
        :rules="formRules"
        v-show="formType == 2 ||formType == 3"
        label-position="top"
      >
        <el-form-item
          :label="$t('lang.phone_number')"
          prop="phone"
          class="phoneNum"
          v-if="formType != 3"
        >
          <el-input
            v-model="bindForm.phone"
            autocomplete="off"
            :placeholder="$t('lang.please_phone_number')"
            :disabled="formType == 3"
          ></el-input>
        </el-form-item>
        <div class="safe_code_container" v-if="formType == 2">
          <el-form-item :label="$t('lang.phone_code')" prop="phoneCode" class="phone_container">
            <el-input
              v-model="bindForm.phoneCode"
              autocomplete="off"
              prop="phoneCode"
              :placeholder="$t('lang.please_code')"
            ></el-input>
          </el-form-item>
          <el-form-item class="getCode_container">
            <el-button
              class="getCode"
              :type="getcodeType"
              @click="toSafeForm('phone')"
              :disabled="getCodeAbled"
            >{{getCodeTip}}</el-button>
          </el-form-item>
        </div>
        <div class="unbind_tip" v-else>
          <div>{{$t('lang.make_sure_unbind_phone')}}{{bindForm.phone}}</div>
        </div>
      </el-form>
      <!-- 绑定邮箱表单 -->
      <el-form
        :model="bindForm"
        ref="bindEmail"
        class="bindPhoneForm"
        :rules="formRules"
        v-show="formType == 4 || formType == 5"
        label-position="top"
      >
        <el-form-item :label="$t('lang.Email')" prop="email" class="phoneNum" v-if="formType != 5">
          <el-input
            v-model="bindForm.email"
            autocomplete="off"
            :placeholder="$t('lang.please_email')"
            :disabled="formType == 5"
          ></el-input>
        </el-form-item>
        <div class="safe_code_container" v-if="formType == 4">
          <el-form-item :label="$t('lang.mail_code')" prop="emailCode" class="phone_container">
            <el-input
              v-model="bindForm.emailCode"
              autocomplete="off"
              :placeholder="$t('lang.please_code')"
            ></el-input>
          </el-form-item>
          <el-form-item class="getCode_container">
            <el-button
              class="getCode"
              :type="getcodeType"
              @click="toSafeForm('email')"
              :disabled="getCodeAbled"
            >{{getCodeTip}}</el-button>
          </el-form-item>
        </div>
        <div class="unbind_tip" v-else>{{$t('lang.make_sure_unbind_email')}}{{bindForm.email}}</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelBtn">{{$t('lang.cancel')}}</el-button>
        <el-button type="primary" @click="formSubmit">{{$t('lang.ok')}}</el-button>
      </div>
    </el-dialog>
    <div class="user_block">
      <div class="user_title">{{$t('lang.User_Center')}}</div>
      <div class="user_info">
        <div class="info_title">{{$t('lang.Basic_Information')}}</div>
        <div class="user_info_container">
          <div class="info_container">
            <div class="title">{{$t('lang.Account')}}:</div>
            <div class="title_info">
              {{account}}
              <div :class="certClass">{{authStatus}}</div>
            </div>
          </div>
          <div class="info_container">
            <div class="title">UID:</div>
            <div class="title_info">{{userInfo.accountId}}</div>
          </div>
          <div class="info_container">
            <div class="title">{{$t('lang.login_password')}}:</div>
            <div class="title_info">
              {{$t('lang.Already')}}
              <div class="img_con">
                <img src="../../../assets/img/ic-righttype.png" />
              </div>
            </div>
          </div>
          <el-button
            class="modify_button"
            :disabled="modifyDisabled"
            @click="pwdSafeVisible=true"
          >{{$t('lang.Modify')}}</el-button>
        </div>
      </div>
      <div class="center_kyc_container">
        <div class="small_title_container">
          <div class="small_title">{{$t('lang.kyc_certification')}}</div>
        </div>
        <div class="block_group">
          <div class="small_block c1" @click="goKyc(1)">
            <div class="step">C1</div>
            <div class="status" v-if="userInfo.c1AuthStatus === 0 ">{{$t('lang.not_certificated')}}</div>
            <div class="status" v-if="userInfo.c1AuthStatus === 1 ">{{$t('lang.certificated')}}</div>
            <div class="status" v-if="userInfo.c1AuthStatus === 2 ">{{$t('lang.applying')}}</div>
            <!-- <div class="limit">
              {{$t('lang.c12_tips')}}
              <span class="limitC">{{$t('lang.c1_limit')}}</span>
            </div>-->
          </div>
          <div class="small_block c2" @click="goKyc(2)">
            <div class="step">C2</div>
            <div class="status" v-if="userInfo.c2AuthStatus === 0 ">{{$t('lang.not_certificated')}}</div>
            <div class="status" v-if="userInfo.c2AuthStatus === 1 ">{{$t('lang.certificated')}}</div>
            <div class="status" v-if="userInfo.c2AuthStatus === 2 ">{{$t('lang.applying')}}</div>
            <!-- <div class="limit">
              {{$t('lang.c12_tips')}}
              <span class="limitC">{{$t('lang.c2_limit')}}</span>
            </div>-->
          </div>
          <div class="small_block c3" @click="goKyc(3)">
            <div class="step">C3</div>
            <div class="status" v-if="userInfo.c3AuthStatus === 0 ">{{$t('lang.not_certificated')}}</div>
            <div class="status" v-else>{{$t('lang.applying')}}</div>
            <div class="limit">{{$t('lang.c3_tips')}}</div>
          </div>
        </div>
      </div>
      <div class="dual_container">
        <div class="small_title_container title_container">
          <div class="small_title">{{$t('lang.Dual_Authentication')}}</div>
          <div class="tow_fa_detail">{{$t('lang.Dual_tip')}}</div>
        </div>
        <div class="dual_block">
          <div class="phone_dual">
            <div :class="dualIconStyle('phone')"></div>
            <span class="dual_title">{{$t('lang.phone')}}</span>
            <span>{{phone}}</span>
            <div v-if="!userInfo.phone" class="edit" @click="toBindPhone"></div>
            <div v-else class="edit" @click="toUntiePhone"></div>
          </div>
          <div class="email_dual">
            <div :class="dualIconStyle('email')"></div>
            <span class="dual_title">{{$t('lang.Email')}}</span>
            <span>{{email}}</span>
            <div v-if="!userInfo.email" class="edit" @click="toBindEmail"></div>
            <div v-else class="edit" @click="toUntieEmail"></div>
          </div>
        </div>
      </div>
      <!-- 谷歌验证 -->
      <div class="dual_container">
        <div class="small_title_container title_container">
          <div class="small_title">{{$t('lang.google_authenticator')}}</div>
        </div>
        <div class="dual_block Ga_block" :class="{'bacg': !userInfo.googleAuthStatus}">
          <div class="status_group">
            <div class="dual_icon_right" v-if="userInfo.googleAuthStatus"></div>
            <div class="gastatus">{{GAstatus}}</div>
          </div>
          <el-button type="primary" @click="GAopen">{{GAbutton}}</el-button>
        </div>
      </div>
      <!-- 谷歌验证dialog -->
      <el-dialog
        :visible="GAvisible"
        @close="GAvisible=false,GAstep = 1,GAform ={},googleLoading=false"
        width="400px"
        :title="GAtitle"
        class="GA_container"
      >
        <div class="step" v-if="GAstep==1">
          <div class="GA_icon"></div>
          <div class="GA_tips">{{$t('lang.download_install')}}</div>
          <a
            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en"
            class="GA_link"
            target="_blank"
          >{{$t('lang.download_google')}}</a>
        </div>
        <div class="step" v-else-if="GAstep==2">
          <div class="backup_icon"></div>
          <div class="backup_tips">
            {{$t('lang.GA_tip1')}}
            <br />
            {{$t('lang.GA_tip2')}}
          </div>
          <div class="copy_container">
            <input type="text" disabled :value="serectKey" />
            <button @click="copyKey">{{$t('lang.copy')}}</button>
          </div>
        </div>
        <div class="step" v-else-if="GAstep==3">
          <el-form :model="GAform">
            <el-form-item :label="$t('lang.phone')" v-if="userInfo.phone">
              <el-input :value="userInfo.phone" disabled></el-input>
            </el-form-item>
            <div class="safe_code_container" v-if="userInfo.phone">
              <el-form-item
                :label="$t('lang.phone_code')"
                class="phone_container"
                style="margin-bottom:0"
              >
                <el-input v-model="GAform.phoneCode" :placeholder="$t('lang.please_code')"></el-input>
              </el-form-item>
              <el-form-item class="code_container">
                <!-- 按钮样式1 点击传参判定-->
                <el-button
                  :type="safeType5"
                  :disabled="safeAble5"
                  @click="getSafeCode('GAP')"
                >{{safeTip5}}</el-button>
              </el-form-item>
            </div>
            <el-form-item :label="$t('lang.Email')" v-if="userInfo.email">
              <el-input :value="userInfo.email" disabled></el-input>
            </el-form-item>
            <div class="safe_code_container" v-if="userInfo.email">
              <el-form-item
                :label="$t('lang.mail_code')"
                class="phone_container"
                style="margin-bottom:0"
              >
                <el-input v-model="GAform.emailCode" :placeholder="$t('lang.please_code')"></el-input>
              </el-form-item>
              <el-form-item class="code_container" style="margin-bottom:0">
                <!-- 按钮样式1 点击传参判定-->
                <el-button
                  :type="safeType6"
                  :disabled="safeAble6"
                  @click="getSafeCode('GAE')"
                >{{safeTip6}}</el-button>
              </el-form-item>
            </div>
            <el-form-item :label="$t('lang.google_code')">
              <el-input v-model="GAform.googleCode" :placeholder="$t('lang.please_code')"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="step" v-else-if="GAstep==4">
          <div class="GA_icon">
            <div class="succ_icon"></div>
          </div>
          <div class="succ_tips">{{$t('lang.GA_bind_succ')}}</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            class="GABtn"
            type="primary"
            @click="GAhandler"
            :loading="googleLoading"
            v-if="GAstep < 4"
          >{{GAconfirmButton}}</el-button>
          <button class="good" @click="good" v-else>好</button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { request, price } from '../../../network/request'
import { getToken } from '@/utils/utils.js'

import md5 from 'js-md5'
import QRCode from 'qrcodejs2'
export default {
  data() {
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
      } else if (value !== this.changePWDForm.newPWD) {
        callback(new Error(this.$t('lang.not_same')))
      } else {
        callback()
      }
    }
    return {
      // 谷歌验证按钮loading
      googleLoading: false,
      // 密码正则
      PWDreg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_\x21-\x7e]{6,32}$/,
      // 谷歌验证dialog是否可见
      GAvisible: false,
      // 谷歌验证 表单
      GAform: {
        phoneCode: '',
        emailCode: '',
        googleCode: ''
      },
      // 谷歌验证 步骤
      GAstep: 1,
      // 修改pwd 安全验证dialog是否可见
      pwdSafeVisible: false,
      // 修改pwd dialog是否可见
      pwdModifyVisible: false,
      // modify 按钮是否可用
      modifyDisabled: false,
      // 修改密码安全验证表单
      PWDsafeForm: {
        phone: '',
        phoneCode: '',
        email: '',
        emailCode: ''
      },
      // 修改密码页面绑定表单
      changePWDForm: {
        newPWD: '',
        newPWDConfrim: '',
        oldPWD: ''
      },
      // 修改密码校验规则
      changePWDRule: {
        newPWD: [
          {
            validator: oldPWdcheck,
            trigger: 'blur'
          }
        ],
        oldPWD: [
          {
            validator: oldPWdcheck,
            trigger: 'blur'
          }
        ],
        newPWDConfrim: [
          {
            validator: newPWDcheck,
            trigger: 'blur'
          }
        ]
      },
      // usercenter显示kyc等级的类名
      certClass: 'cert',
      userInfo: {},
      token: '',
      // 绑定解绑dialog是否可见
      formVisible: false,
      // 解绑或者绑定
      formType: '',
      // dialog标题
      formTitle: '',
      // dilog form
      formRef: '',
      // 获取验证码显示文字
      getCodeTip: this.$t('lang.get_captcha'),
      //验证码按钮是否可用
      getCodeAbled: false,
      // 验证码按钮样式
      getcodeType: 'primary',
      //定时器
      // 安全验证-邮箱计时器
      buttonAbled0: '',
      // 安全验证-手机计时器
      buttonAbled1: '',
      // 解绑绑定 获取验证码按钮 计时器
      buttonAbled2: '',
      // 修改密码验证-邮箱计时器
      buttonAbled3: '',
      // 修改密码验证-手机计时器
      buttonAbled4: '',
      // 谷歌验证 - 计时器
      buttonAbled5: '',
      buttonAbled6: '',
      // 安全验证 是否可见
      safeVisible: false,
      // 安全验证 手机 邮箱按钮样式
      safeType1: 'primary',
      safeAble1: false,
      safeType2: 'primary',
      safeAble2: false,
      safeTip1: this.$t('lang.get_captcha'),
      safeTip2: this.$t('lang.get_captcha'),
      // 修改密码安全验证 手机 邮箱
      safeType3: 'primary',
      safeType4: 'primary',
      safeAble3: false,
      safeAble4: false,
      safeTip3: this.$t('lang.get_captcha'),
      safeTip4: this.$t('lang.get_captcha'),
      // 谷歌 安全验证 手机 邮箱按钮样式
      safeType5: 'primary',
      safeAble5: false,
      safeType6: 'primary',
      safeAble6: false,
      safeTip5: this.$t('lang.get_captcha'),
      safeTip6: this.$t('lang.get_captcha'),
      // 安全验证表单
      safeForm: {
        phone: '',
        phoneCode: '',
        email: '',
        emailCode: ''
      },
      // 绑定解绑表单
      bindForm: {
        phone: '',
        phoneCode: '',
        email: '',
        emailCode: '',
        type: '',
        nationCode: '',
        token: '',
        language: ''
      },
      // 废弃
      formRules: {
        phone: [
          {
            rquired: true,
            message: '请输入手机号码',
            trigger: 'blur'
          }
        ],
        phoneCode: [
          {
            rquired: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ],
        email: [
          {
            rquired: true,
            message: '请输入手机号码',
            trigger: 'blur'
          }
        ],
        emailCode: [
          {
            rquired: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    // 谷歌验证确认btn文字
    GAconfirmButton() {
      switch (this.GAstep) {
        case 1:
          return this.$t('lang.download_next')
        case 2:
          return this.$t('lang.backup_next')
        case 3:
          return this.$t('lang.ok')
      }
    },
    // 截取字符串密钥
    serectKey() {
      const googleAuthQrBarcode = this.userInfo.googleAuthQrBarcode
      let index = googleAuthQrBarcode && googleAuthQrBarcode.indexOf('secret=')
      let key = googleAuthQrBarcode && googleAuthQrBarcode.slice(index + 7)
      return key
    },
    // 返回谷歌验证title
    GAtitle() {
      if (this.GAstep == 1) {
        return this.$t('lang.GA_step1')
      }
      if (this.GAstep == 2) {
        return this.$t('lang.GA_step2')
      }
      if (this.GAstep == 4) {
        return this.$t('lang.GAq')
      }
      if (this.userInfo.googleAuthStatus) {
        return this.$t('lang.unbind_google')
      }
      if (!this.userInfo.googleAuthStatus) {
        return this.$t('lang.bind_google')
      }
    },
    // 返回按钮文字
    GAbutton() {
      return this.userInfo.googleAuthStatus
        ? this.$t('lang.tounbind')
        : this.$t('lang.tobind')
    },
    // 返回谷歌验证的状态
    GAstatus() {
      return this.userInfo.googleAuthStatus
        ? this.$t('lang.Binded')
        : this.$t('lang.GA_unbind')
    },
    // 返回加密账户名
    account() {
      return this.encrypt(this.userInfo.name)
    },
    // 返回账户认证状态
    authStatus() {
      if (this.userInfo.c2AuthStatus == 1) {
        this.certClass = 'cert2'
        return 'C 2'
      } else if (this.userInfo.c1AuthStatus == 1) {
        return 'C 1'
      } else {
        return 'C 0'
      }
    },
    // 返回加密手机 或者去绑定
    phone() {
      if (this.userInfo.phone) {
        return this.encrypt(this.userInfo.phone)
      }
      return this.$t('lang.unbonded')
    },
    // 返回加密邮箱 或者去绑定
    email() {
      if (this.userInfo.email) {
        return this.encrypt(this.userInfo.email)
      }
      return this.$t('lang.unbonded')
    },
    // 返回绑定状态样式
    dualIconStyle() {
      return (phone) => {
        if (this.userInfo[phone]) {
          return 'dual_icon_right'
        } else {
          return 'dual_icon_error'
        }
      }
    }
  },
  methods: {
    // 打开谷歌验证
    GAopen() {
      this.GAstep = this.userInfo.googleAuthStatus ? 3 : 1
      this.GAvisible = true
    },
    // step4
    good() {
      this.GAvisible = false
      this.GAform = {}
      this.GAstep = 1
      this.clearIntervalAll()
      this.getUserInfo()
    },
    // 复制key值
    copyKey() {
      let input = document.createElement('input')
      input.setAttribute('readonly', 'readonly')
      input.setAttribute('value', this.serectKey)
      document.body.appendChild(input)
      input.select()
      input.setSelectionRange(0, 9999)
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success(this.$t('lang.c_success'))
      }
      document.body.removeChild(input)
    },
    // GA 安全验证
    async GAhandler() {
      if (this.GAstep <= 2) {
        this.GAstep++
        return false
      }
      if (this.GAstep == 3) {
        if (this.userInfo.phone && !this.GAform.phoneCode) {
          this.$message.error(this.$t('lang.plz_phone_code'))
          return false
        }
        if (this.userInfo.email && !this.GAform.emailCode) {
          this.$message.error(this.$t('lang.plz_email_code'))
          return false
        }
        if (!this.GAform.googleCode) {
          this.$message.error(this.$t('lang.please_code'))
          return false
        }
        this.googleLoading = true
        let type = this.userInfo.googleAuthStatus ? 9 : 8
        const { data: res } = await request.post('/web/security/op', {
          email: this.userInfo.email,
          emailCode: this.GAform.emailCode,
          googleCode: this.GAform.googleCode,
          language: this.$i18n.locale,
          nationCode: '86',
          phone: this.userInfo.phone,
          phoneCode: this.GAform.phoneCode,
          token: this.token,
          type
        })
        if (res.status == 0) {
          if (type == 8) {
            this.GAstep++
            return false
          }
          this.GAvisible = false
          this.GAform = {}
          this.GAstep = 1
          this.clearIntervalAll()
          this.getUserInfo()
          this.$message.success(this.$t('lang.unbind_success'))
        } else {
          this.$message.error(res.msg)
        }
        this.googleLoading = false
      }
    },
    // 清空表单
    clearForm() {
      this.PWDsafeForm.phoneCode = ''
      this.PWDsafeForm.emailCode = ''
      this.safeForm.phoneCode = ''
      this.safeForm.emailCode = ''
      this.bindForm.phoneCode = ''
      this.bindForm.emailCode = ''
      this.changePWDForm = {}
      this.$refs.pwdForm && this.$refs.pwdForm.resetFields()
    },
    // 发送修改密码安全验证
    async pwdSafeSubmit() {
      if (this.PWDsafeForm.phone && !this.PWDsafeForm.phoneCode) {
        this.$message.error(this.$t('lang.plz_phone_code'))
        return false
      }
      if (this.PWDsafeForm.email && !this.PWDsafeForm.emailCode) {
        this.$message.error(this.$t('lang.plz_email_code'))
        return false
      }
      // 发起请求
      const { data: res } = await request.post('/web/security/op', {
        email: this.PWDsafeForm.email,
        emailCode: this.PWDsafeForm.emailCode,
        phone: this.PWDsafeForm.phone,
        phoneCode: this.PWDsafeForm.phoneCode,
        token: this.token,
        type: 6,
        language: this.$i18n.locale
      })
      if (res.status == 0) {
        this.pwdSafeVisible = false
        this.pwdModifyVisible = true
      } else {
        return this.$message.error(res.msg)
      }
    },
    // 修改密码
    changePWD() {
      this.$refs.pwdForm.validate(async (valid) => {
        if (valid) {
          const { data: res } = await request.post('/web/user/updatePassword', {
            language: this.$i18n.locale,
            newPassword: md5(this.changePWDForm.newPWD),
            oldPassword: md5(this.changePWDForm.oldPWD),
            token: this.token
          })
          if (res.status == 0) {
            this.$message.success(this.$t('lang.changeSuccess'))
            var exp = new Date()
            exp.setTime(exp.getTime() - 10)
            var token = getToken()
            document.cookie =
              'token' + '=' + token + ';expires=' + exp.toUTCString()

            this.$store.commit('loginSuccess', false)
            this.$router.push('/login')
          } else {
            this.$message.error(res.msg)
          }
        } else {
          return false
        }
      })
    },
    // 清除所有计时器
    clearIntervalAll() {
      this.getcodeType = 'primary'
      this.getCodeAbled = false
      this.getCodeTip = this.$t('lang.get_captcha')
      this.safeType1 = 'primary'
      this.safeAble1 = false
      this.safeTip1 = this.$t('lang.get_captcha')
      this.safeType2 = 'primary'
      this.safeAble2 = false
      this.safeTip2 = this.$t('lang.get_captcha')
      this.safeType3 = 'primary'
      this.safeAble3 = false
      this.safeTip3 = this.$t('lang.get_captcha')
      this.safeType4 = 'primary'
      this.safeAble4 = false
      this.safeTip4 = this.$t('lang.get_captcha')
      this.safeType5 = 'primary'
      this.safeAble5 = false
      this.safeTip5 = this.$t('lang.get_captcha')
      this.safeType6 = 'primary'
      this.safeAble6 = false
      this.safeTip6 = this.$t('lang.get_captcha')
      clearInterval(this.buttonAbled0)
      clearInterval(this.buttonAbled1)
      clearInterval(this.buttonAbled2)
      clearInterval(this.buttonAbled3)
      clearInterval(this.buttonAbled4)
      clearInterval(this.buttonAbled5)
      clearInterval(this.buttonAbled6)
    },
    // 绑定dialog取消
    cancelBtn() {
      this.formVisible = false
    },
    // 安全验证dialog取消
    cancelBtn2() {
      this.safeVisible = false
    },
    toBindPhone() {
      this.formType = 2
      this.formTitle = this.$t('lang.Binding_Mobile_number')
      this.formRef = 'bindPhone'
      // this.formVisible = true
      this.safeVisible = true
    },
    toBindEmail() {
      this.formType = 4
      this.formTitle = this.$t('lang.Binding_Email')
      this.formRef = 'bindEmail'
      // this.formVisible = true
      this.safeVisible = true
    },
    toUntiePhone() {
      // 手机注册用户无法解绑手机
      if (this.userInfo.type == 1) {
        this.$message.error(this.$t('lang.phone_cant'))
        return
      }
      this.formType = 3
      this.formTitle = this.$t('lang.unbun_phone')
      this.formRef = 'bindPhone'
      // this.formVisible = true
      this.safeVisible = true
    },
    toUntieEmail() {
      // 邮箱注册用户无法解绑邮箱
      if (this.userInfo.type == 0) {
        this.$message.error(this.$t('lang.email_cant'))
        return
      }
      this.formType = 5
      this.formTitle = this.$t('lang.unbun_email')
      this.formRef = 'bindEmail'
      // this.formVisible = true
      this.safeVisible = true
    },
    // 获取验证码 更改验证码按钮样式
    async getSafeCode(type) {
      let url = ''
      let buttonAbled, safeType, safeAble, safeTip
      let postparam = {
        language: this.$i18n.locale,
        name: '',
        nationCode: '86'
      }
      // type phone 手机安全验证 phone1 绑定手机验证 email 邮箱安全验证 email1 绑定邮箱验证
      if (type == 'phone') {
        url = '/web/authCode/phone'
        postparam.name = this.bindForm.phone
        buttonAbled = 'buttonAbled0'
        safeType = 'safeType1'
        safeAble = 'safeAble1'
        safeTip = 'safeTip1'
      }
      if (type == 'email') {
        url = '/web/authCode/email'
        postparam.name = this.bindForm.email
        buttonAbled = 'buttonAbled1'
        safeType = 'safeType2'
        safeAble = 'safeAble2'
        safeTip = 'safeTip2'
      }
      if (type == 'phones') {
        url = '/web/authCode/phone'
        postparam.name = this.userInfo.phone
        buttonAbled = 'buttonAbled3'
        safeType = 'safeType3'
        safeAble = 'safeAble3'
        safeTip = 'safeTip3'
      }
      if (type == 'emails') {
        url = '/web/authCode/email'
        postparam.name = this.userInfo.email
        buttonAbled = 'buttonAbled4'
        safeType = 'safeType4'
        safeAble = 'safeAble4'
        safeTip = 'safeTip4'
      }
      if (type == 'phone1') {
        url = '/web/authCode/phone'
        postparam.name = this.bindForm.phone
        buttonAbled = 'buttonAbled2'
        safeType = 'getcodeType'
        safeAble = 'getCodeAbled'
        safeTip = 'getCodeTip'
      }
      if (type == 'email1') {
        url = '/web/authCode/email'
        postparam.name = this.bindForm.email
        buttonAbled = 'buttonAbled2'
        safeType = 'getcodeType'
        safeAble = 'getCodeAbled'
        safeTip = 'getCodeTip'
      }
      if (type == 'GAP') {
        url = '/web/authCode/phone'
        postparam.name = this.userInfo.phone
        buttonAbled = 'buttonAbled5'
        safeType = 'safeType5'
        safeAble = 'safeAble5'
        safeTip = 'safeTip5'
      }
      if (type == 'GAE') {
        url = '/web/authCode/email'
        postparam.name = this.userInfo.email
        buttonAbled = 'buttonAbled6'
        safeType = 'safeType6'
        safeAble = 'safeAble6'
        safeTip = 'safeTip6'
      }
      let count = 60
      this[safeType] = 'info'
      this[safeAble] = true
      this[buttonAbled] = setInterval(() => {
        this[safeTip] = `${this.$t('lang.reacquire')}(${count}S)`
        if (count <= 0) {
          this[safeType] = 'primary'
          this[safeAble] = false
          this[safeTip] = this.$t('lang.get_captcha')
          clearInterval(this[buttonAbled])
          return
        }
        count--
      }, 1000)
      const { data: res } = await request.post(url, postparam)
      if (res.status == 0) {
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    async sendAnother() {
      this.bindForm.emailCode = this.safeForm.emailCode
      this.bindForm.phoneCode = this.safeForm.phoneCode
      if (this.formType == 3 || this.formType == 5) {
        if (!this.safeForm.emailCode || !this.safeForm.phoneCode) {
          this.$message.error(this.$t('lang.please_code'))
          return
        }
        this.safeVisible = false
        this.formVisible = true
      } else if (this.formType == 2 && !this.safeForm.emailCode) {
        this.$message.error(this.$t('lang.please_code'))
        return
      } else if (this.formType == 4 && !this.safeForm.phoneCode) {
        this.$message.error(this.$t('lang.please_code'))
        return
      } else {
        this.safeVisible = false
        this.formVisible = true
      }
    },
    // 获取验证码前对手机和邮箱进行正则检测 并发起请求
    toSafeForm(type) {
      if (type == 'phone' && !this.bindForm.phone) {
        this.$message.error(this.$t('lang.please_phone_number'))
        return
      } else if (type == 'phone') {
        const reg = /^1[3-9]\d{9}$/
        if (!reg.test(this.bindForm.phone)) {
          this.$message.error(this.$t('lang.please_right_phone'))
          return
        }
        this.getSafeCode('phone1')
      }
      if (type == 'email' && !this.bindForm.email) {
        this.$message.error(this.$t('lang.please_email'))
        return
      } else if (type == 'email') {
        const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
        if (!reg.test(this.bindForm.email)) {
          this.$message.error(this.$t('lang.please_right_email'))
          return
        }
        this.getSafeCode('email1')
      }
    },
    // 提交表单
    async formSubmit() {
      this.bindForm.type = this.formType
      if (!this.bindForm.phoneCode || !this.bindForm.emailCode) {
        this.$message.error(this.$t('lang.please_code'))
        return
      }
      // if (!this.bidnForm.phone) {
      //   this.$message.error('请输入手机号码')
      //   return
      // }
      // if (!this.bindForm.email) {
      //   this.$message.error('请输入邮箱')
      //   return
      // }
      const regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (!regEmail.test(this.bindForm.email)) {
        this.$message.error(this.$t('lang.please_right_email'))
        return
      }
      const regPhone = /^1[3-9]\d{9}$/
      if (!regPhone.test(this.bindForm.phone)) {
        this.$message.error(this.$t('lang.please_right_phone'))
        return
      }

      const { data: res } = await request.post(
        '/web/security/op',
        this.bindForm
      )
      if (res.status == 0) {
        this.$message.success(res.msg)
        this.formVisible = false
        this.clearIntervalAll()
        this.bindForm = {
          phone: '',
          phoneCode: '',
          email: '',
          emailCode: '',
          type: '',
          nationCode: '',
          token: '',
          language: ''
        }
        this.safeForm = {
          phone: '',
          phoneCode: '',
          email: '',
          emailCode: ''
        }
        this.getUserInfo()
        this.getLocalUserInfo()
      } else {
        this.$message.error(res.msg)
      }
    },
    // 获取用户信息
    getLocalUserInfo() {
      const userIn = localStorage.getItem('userInfo')
      if (userIn) {
        this.userInfo = JSON.parse(userIn)
        this.bindForm.token = this.token
        this.bindForm.nationCode = this.userInfo.nationCode || '86'
        this.bindForm.language = this.$i18n.locale
        this.bindForm.phone = this.userInfo.phone
        this.bindForm.email = this.userInfo.email
        this.safeForm.email = this.userInfo.email
        this.safeForm.phone = this.userInfo.phone
        this.bindForm.phone = this.userInfo.phone
        this.bindForm.email = this.userInfo.email
        this.PWDsafeForm.email = this.userInfo.email
        this.PWDsafeForm.phone = this.userInfo.phone
      }
    },
    // 获取安全信息
    encrypt(name) {
      if (name) {
        const start =
          name.indexOf('@') == -1
            ? name.indexOf('@')
            : Math.ceil(name.length / 2)
        name = name.split('')
        name.splice(start - 3, 3, '****')
        return name.join('')
      }
    },
    goKyc(step) {
      this.$router.push({
        path: './kyc',
        query: {
          step
        }
      })
    },
    async getUserInfo() {
      const { data: res } = await request.post('./web/user/info', {
        language: this.$i18n.locale,
        token: this.token
      })
      if (res.status == 0) {
        var userInfO = JSON.stringify(res.data)

        localStorage.removeItem('userInfo')
        localStorage.setItem('userInfo', userInfO)
        this.getLocalUserInfo()
      }
    }
  },
  created() {
    this.token = getToken()
  },
  mounted() {
    //created
    this.getUserInfo()
    this.getLocalUserInfo()
  },
  beforeDestroy() {
    this.clearIntervalAll()
  },
  watch: {
    '$i18n.locale': function () {
      this.getCodeTip = this.$t('lang.get_captcha')
      this.safeTip1 = this.$t('lang.get_captcha')
      this.safeTip2 = this.$t('lang.get_captcha')
      this.safeTip3 = this.$t('lang.get_captcha')
      this.safeTip4 = this.$t('lang.get_captcha')
    }
  }
}
</script>

<style lang="less" scoped>
.changePWd {
  .el-form-item {
    margin-bottom: 5px;
  }
}
.inner_dialog {
  width: 800px;
  margin: auto;
}
.dialog {
  width: 1000px;
  margin: auto;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  /deep/ button {
    cursor: pointer;
    position: relative;
  }

  /deep/ button:active:after {
    opacity: 0.3;
    //设置初始状态
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: 0s;
  }
  /deep/ .el-button--primary:after {
    content: '';
    display: block;
    position: absolute;
    //扩大伪类元素4个方向各10px
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    pointer-events: none;
    border-radius: 8px;
    background-color: #3c6fe4;
    background-repeat: no-repeat;
    background-position: 50%;
    opacity: 0;
    transition: all 0.3s;
  }
}

.safe_code_container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0;
  .phone_container {
    flex: 2;
  }
  .code_container,
  .getCode_container {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    flex: 135px 0 0;
    margin-left: 20px;

    /deep/ button {
      position: relative;
      width: 135px;
    }
    /deep/ button:not(.is-disabled):hover {
      background-color: #4b81fd;
    }

    /deep/ button:not(.is-disabled):active:after {
      opacity: 0.3;
      //设置初始状态
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      transition: 0s;
    }
    /deep/ button:after {
      content: '';
      display: block;
      position: absolute;
      //扩大伪类元素4个方向各10px
      top: -6px;
      left: -6px;
      right: -6px;
      bottom: -6px;
      pointer-events: none;
      border-radius: 5px;
      background-color: #4b81fd;
      background-repeat: no-repeat;
      background-position: 50%;
      opacity: 0;
      transition: all 0.3s;
    }
  }
}
.unbind_tip {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #111111;
  font-family: Helvetica;
  font-size: 20px;
}
.safe_code_container {
  .el-form-item {
    margin-bottom: 0px;
  }
}

.el-form-item /deep/ label {
  padding: 0;
}

.center_container {
  width: 100%;
  // height: 100%;

  .dialog_container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: center;
    .safa_tips {
      margin-top: -200px;
    }
  }
  .bindPhoneForm {
    display: flex;
    flex-direction: column;
    justify-items: center;
    .phone_container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .phone_container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        flex: 2;
      }
      .getCode_container {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        flex: 1;
      }
      .getCode {
        margin-left: 20px;
      }
    }
  }
  background: #f4f4f4;
  .user_block {
    .user_title {
      font-size: 32px;
      font-family: Helvetica;
      color: #202224;
      line-height: 38px;
      padding: 30px 0 0 40px;
    }
    .user_info {
      background: #ffffff;
      border-radius: 14px;
      border: 0px solid #b9b9b9;
      margin: 25px 32px 0 31px;
      padding: 40px 52px 52px 58px;
      box-sizing: border-box;
      overflow: hidden;
      .user_info_container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .modify_button {
          width: 173px;
          height: 54px;
          background: #4880ff;
          border-radius: 12px;
          font-size: 16px;
          font-family: OpenSans-Semibold, OpenSans;
          font-weight: 600;
          color: #ffffff;
          line-height: 22px;
        }
        // .modify_button:hover {
        //   opacity: 70%;
        // }
        .info_container {
          background: #ffffff;
          flex-direction: column;
          .title {
            font-size: 16px;
            font-family: Helvetica;
            color: #404040;
            line-height: 19px;
            margin: 15px 0 0 0;
          }
          .title_info {
            font-size: 14px;
            font-family: Helvetica;
            color: #565656;
            line-height: 17px;
            margin: 7px 0 0 0;
            display: flex;
            .img_con {
              width: 21px;
              height: 21px;
              display: inline-block;
              margin-left: 9px;
              img {
                height: 100%;
                width: 100%;
                vertical-align: top;
              }
            }
            .cert {
              width: 54px;
              height: 20px;
              line-height: 20px;
              background: #e4e4ff;
              border-radius: 8px;
              text-align: center;
              margin: 0 0 0 9px;
              color: #a69494;
              font-family: OpenSans-Semibold, OpenSans;
              font-weight: 600;
              font-size: 13px;
            }
            .cert2 {
              width: 54px;
              height: 20px;
              line-height: 20px;
              background: rgba(74, 217, 145, 0.21);
              border-radius: 8px;
              text-align: center;
              margin: 0 0 0 9px;
              color: #4ad991;
              font-family: OpenSans-Semibold, OpenSans;
              font-weight: 600;
              font-size: 13px;
            }
          }
        }
      }
    }
    .small_title_container {
      font-size: 20px;
      font-family: Helvetica;
      color: #202224;
      line-height: 24px;
      margin: 42px 0 27px 40px;
    }
    .block_group {
      margin: 0 26px 0 32px;
      border: 1px solid #eff4fa;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .c1 {
        .step {
          background: rgba(130, 128, 255, 0.21);
          color: rgba(166, 148, 148, 1);
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
      .small_block:nth-child(2) {
        margin: 0 38px;
      }
      .small_block {
        // height: 118px;
        flex: 336px 1 1;
        background: #ffffff;
        border-radius: 8px;
        padding: 14px 30px 14px 19px;
        box-sizing: border-box;
        text-align: center;
        position: relative;
        cursor: pointer;
        .step {
          width: 74px;
          height: 60px;
          font-size: 30px;
          line-height: 60px;
          font-family: OpenSans-Bold, OpenSans;
          margin-left: 3px;
          font-weight: bold;
          border-radius: 25px;
        }
        .status {
          position: absolute;
          top: 14px;
          right: 32px;
          font-size: 16px;
          font-family: Helvetica;
          color: #b2b2b2;
        }
        .limit {
          font-size: 14px;
          font-family: Helvetica;
          color: #565656;
          line-height: 17px;
          // margin: 13px 0 14px 0;
          margin: 13px 0 0 0;

          text-align: left;
        }
      }
    }
    .dual_container {
      .title_container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .tow_fa_detail {
          font-size: 13px;
          font-family: Helvetica;
          color: #8f9bb3;
          margin-right: 32px;
        }
      }
      .dual_block {
        height: 80px;
        background: #ffffff;
        font-size: 12px;
        font-family: OpenSans-Semibold, OpenSans;
        font-weight: 600;
        color: #222b45;
        border-radius: 8px;
        border: 1px solid #eff4fa;
        margin: 0 32px 30px 31px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding-left: 80px;
        box-sizing: border-box;
        .phone_dual,
        .email_dual {
          display: flex;
          justify-content: flex-start;
          flex-direction: row;
          align-items: center;
          flex: 1;
          .dual_title {
            margin: 0 32px 0 22px;
          }
          .edit {
            margin-left: 80px;
          }
        }
        .dual_icon_right {
          width: 21px;
          height: 21px;
          border-radius: 10px;
          background: #00e096 url('../../../assets/img/IconColor.png') no-repeat
            center;
          background-size: 9px;
        }
        .dual_icon_error {
          width: 21px;
          height: 21px;
          border-radius: 10px;
          background: #ff3b70 url('../../../assets/img/cross.png') no-repeat
            center;
          background-size: 9px;
        }
        .edit {
          background: url('../../../assets/img/01) Icons／Line／arrow-circle-down Copy.png')
            no-repeat center;
          background-size: 18.84px;
          width: 21px;
          height: 21px;
          cursor: pointer;
        }
      }
      .bacg {
        background: url('../../../assets/img/img_google authenticator.png')
          no-repeat #fff 20px;
        background-size: contain;
      }
      .Ga_block {
        justify-content: space-between;
        padding: 0 52px 0 80px;
        .status_group {
          display: flex;
          flex-direction: row;
          align-items: center;
          .gastatus {
            margin-left: 22px;
            margin-right: 20px;
            flex: 1 0 0;
            font-weight: 400;
            display: inline-flex;
          }
        }
        .el-button {
          background-color: #4880ff;
          border-radius: 16px;
          padding: 13px 70px;
          font-size: 16px;
          font-weight: 400;
        }
      }
    }
  }

  /deep/.GA_container {
    .el-dialog__header {
      border-bottom: none;
    }
    .step {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
    .GA_icon {
      width: 125px;
      height: 125px;
      background: url('../../../assets/img/img_google authenticator@3x.png')
        no-repeat center;
      background-size: contain;
      position: relative;
      .succ_icon {
        position: absolute;
        background: url('../../../assets/img/编组 2.png') no-repeat center;
        width: 40px;
        height: 40px;
        background-size: contain;
        right: 0;
        bottom: 0;
      }
    }
    .succ_tips {
      font-size: 14px;
      margin: 50px 0;
      color: #bfb5c7;
    }
    .GA_tips {
      color: #bfb5c7;
      margin-top: 30px;
      font-size: 14px;
    }
    .GA_link {
      color: #4880ff;
      border: 1px solid #4880ff;
      border-radius: 8px;
      padding: 10px 25px;
      margin-top: 40px;
    }
    .GABtn {
      width: 85%;
      box-sizing: border-box;
      text-align: center;
      padding: 13px 0;
      background-color: #4880ff;
    }
    .GABtn:hover:not(#dsds) {
      background-color: #5889fd;
    }

    .backup_icon {
      width: 63px;
      height: 63px;
      background: url('../../../assets/img/img_backups@3x.png') no-repeat center;
      background-size: contain;
    }
    .backup_tips {
      font-size: 14px;
      color: #7e718a;
      line-height: 20px;
      padding: 0 20px;
      margin-top: 20px;
    }
    .copy_container {
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 20px;
      input {
        text-align: center;
        background-color: #fff;
        color: #4880ff;
        border: 1px solid #e4e4e4;
        border-radius: 4px;
        padding: 10px 40px;
        font-size: 10px;
        width: 66%;
        box-sizing: border-box;
      }
      button {
        text-align: center;
        background-color: #fff;
        color: #4880ff;
        border: 1px solid #4880ff;
        border-radius: 4px;
        padding: 0 20px;
      }
      button:hover {
        background-color: #fafafa;
      }
      button:after {
        background-color: #f1f1f1;
      }
    }
    .good {
      width: 80%;
      background-color: #fff;
      color: #4880ff;
      border: 1px solid #4880ff;
      border-radius: 4px;
      padding: 10px 25px;
    }
    .good:hover {
      background-color: #fafafa !important;
    }
    .good::after {
      background-color: #f1f1f1 !important;
    }
  }
}
</style>