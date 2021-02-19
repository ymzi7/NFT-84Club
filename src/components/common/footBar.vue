    <template>
  <div class="foot-bar-bg">
    <div class="foot-bar">
      <div class="foot-bar-left">
        <div class="login-true" v-if="isLogin">
          <div class="foot-bar-left-img">
            <img src="../../assets/img/touxiang.png" alt />
          </div>
          <el-popover placement="top" width="120" v-model="UserVisible" trigger="hover">
            <ul class="lang_list">
              <li
                v-for="(item, index) in UserList"
                :key="index"
                @click="SelectInfo(item, index)"
              >{{ $t(item) }}</li>
            </ul>
            <div class="foot-bar-left-text" slot="reference">
              <h5 @click="goUserInfo">{{ $t("lang.Hi") }},{{ userInfo.name | length }}</h5>
              <span>{{ accoutnInfo&&fixedPrice(accoutnInfo.totalBtc) }} BTC</span>
            </div>
          </el-popover>
        </div>
        <div class="login-false" v-else>
          <span
            @click="loginClick"
            :class="{activeLink:this.$route.query.value !== 'signup'}"
          >{{ $t("lang.Login")}}</span>
          <span
            @click="tosign"
            :class="{activeLink:this.$route.query.value == 'signup'}"
          >{{ $t("lang.Sign_Up") }}</span>
          <div :class="swtichClass"></div>
        </div>
      </div>

      <div class="foot-bar-right" ref="footBarRight">
        <ul class="foot-bar-right-first">
          <li
            @click="
              active(0);
              goHome();
            "
            class="current"
          >{{ $t("lang.Home") }}</li>
          <li
            @click="
              active(1);
              gomarket();
            "
            class="market"
          >{{ $t("lang.Market") }}</li>
        </ul>
        <ul class="foot-bar-right-second">
          <li
            @click="
              active(2);
              goMyCollection();
            "
            class="mycollection"
          >{{ $t("lang.My_items") }}</li>

          <li class="foot-bar-right-second-line"></li>
          <el-popover placement="top" width="120" v-model="visible" trigger="hover">
            <ul class="lang_list">
              <li
                v-for="(item, index) in LanguageList"
                :key="index"
                @click="SelectLang(item)"
              >{{ item.text }}</li>
            </ul>
            <li style="width: 100px" slot="reference">
              <p style="display: inline-block; padding-right: 15px">{{ language }}</p>
              <i class="el-icon-caret-bottom" v-if="!visible"></i>
              <i class="el-icon-caret-top" v-else></i>
            </li>
          </el-popover>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// 导入网络请求
import { request } from '../../network/request'

export default {
  computed: {
    // 返回价格
    fixedPrice() {
      return (value) => {
        if (value == 0) {
          return 0
        }
        if (value) {
          value = value.toFixed(3)
          value = value.substring(0, value.lastIndexOf('.') + 3)
          return value
        }
      }
    },
    // 切换动画的样式
    swtichClass() {
      return {
        showActive: true,
        activeLogin:
          this.$route.query.value !== 'signup' && this.$route.path == '/login',
        activeSignup: this.$route.query.value == 'signup'
      }
    }
  },
  data() {
    return {
      // 目前选中的页面
      choseLogin: true,
      //目前所在的页面
      isActive: '0',
      isLogin: false,
      userInfo: null,
      accoutnInfo: null,
      language: 'English',
      token: '',
      LanguageList: [
        {
          value: 'en_us',
          text: 'English'
        },
        {
          value: 'zh_cn',
          text: '中文'
        }
      ],
      visible: false,
      UserList: ['lang.logout', 'lang.Asset_center', 'lang.User_center'],
      UserVisible: false
    }
  },
  watch: {
    '$route.path': function () {
      if (
        this.$route.path.indexOf('home') == -1 &&
        this.$route.path.indexOf('market') == -1 &&
        this.$route.path.indexOf('login') == -1 &&
        this.$route.path.indexOf('assets') == -1
      ) {
        this.getAccountInfo()
      }
      if (this.$route.path.indexOf('assets') !== -1) {
        this.active(2323)
      }
    }
  },
  created() {
    this.token = sessionStorage.getItem('token')
    if(this.token != null && this.token != 'null'){
      this.isLogin = true
    }

    var lag = localStorage.getItem('lang')
    if (lag == 'zh_cn') {
      this.language = '中文'
    }
    if (
      this.$route.path.indexOf('home') == -1 &&
      this.$route.path.indexOf('market') == -1 &&
      this.$route.path.indexOf('login') == -1 &&
      this.$route.path.indexOf('assets') == -1
    ) {
      this.getAccountInfo()
    }
    var userInfo = localStorage.getItem('userInfo')
    var accoutnInfo = localStorage.getItem('accountInfo')
    if (accoutnInfo !== null) {
      this.accoutnInfo = JSON.parse(accoutnInfo)
    }
    if (userInfo !== null) {
      this.userInfo = JSON.parse(userInfo)
    }
  },
  watch: {
    '$route.path': function () {
      if (
        this.$route.path.indexOf('home') == -1 &&
        this.$route.path.indexOf('market') == -1
      ) {
        this.getAccountInfo()
      }
    }
  },

  methods: {
    tosign() {
      this.$router.push({
        path: '/login',
        query: { value: 'signup' }
      })
    },

    // 请求账户信息
    async getAccountInfo() {
      const { data: res } = await request.post('/web/account/info', {
        token: this.token
      })
      if (res.status == 0) {
        var accountInfo = JSON.stringify(res.data)
        
        localStorage.setItem('accountInfo', accountInfo)
      }
    },
    // 点击切换语言
    SelectLang(item) {
      this.$i18n.locale = item.value
      this.$store.commit('changeLnag', item.value)
      localStorage.setItem('lang', item.value)
      this.visible = false
      this.language = item.text
    },
    SelectInfo(item, index) {
      switch (index) {
        case 0:
          this.logoOutClick()
          break
        case 1:
          this.goAssetCenterClick()
          break
        case 2:
          this.goUserCenterClick()
          break
      }
    },
    // 激活
    active(index) {
      var footBarRight = this.$refs.footBarRight
      var lis = footBarRight.querySelectorAll('li')
      for (var i = 0; i < lis.length; i++) {
        lis[i].className = ''
      }
      lis[index].className = 'current'
    },

    // 信息显示
    userInfoOver() {
      this.$refs.userInfoRef.style.display = 'block'
    },
    // 信息隐藏
    userInfoLeave() {
      var uls = this.$refs.userInfoRef
      var lis = uls.querySelectorAll('li')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.color = '#121B25'
        lis[i].style.background = ''
      }
      this.$refs.userInfoRef.style.display = 'none'
    },

    //    登录跳转
    loginClick() {
      this.$router.push('/login')
    },
    //    详细信息跳转
    goUserInfo() {
      this.$router.push('/userinfo')
    },
    // 首页跳转
    goHome() {
      this.$router.push('/home')
    },
    // market跳转
    gomarket() {
      this.$router.push('/market')
    },
    // 资产中心跳转
    goAssetCenterClick() {
      this.$bus.$emit('goAssetCenterClick')
      this.$router.push('/userinfo/myassets')
    },
    // 用户中心跳转
    goUserCenterClick() {
      this.$router.push('/userinfo/usercenter')
    },
    // 退出
    logoOutClick() {
      this.$confirm(this.$t('lang.ConfirmLogOut'), {
        confirmButtonText: this.$t('lang.ok'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      })
        .then(() => {

          document.cookie="token=null"
          sessionStorage.clear()
          this.$router.push('/login')
        })
        .catch(() => {
          return
        })
    },
    //我的藏品跳转
    goMyCollection() {
      var footBarRight = this.$refs.footBarRight
      var lis = footBarRight.querySelectorAll('li')
      lis[0].className = ''
      lis[2].className = 'current'
      this.$router.push('/mycollection')
    },
    userUlInfoOver() {
      var uls = this.$refs.userInfoRef
      var lis = uls.querySelectorAll('li')
      for (let i = 0; i < lis.length; i++) {
        lis[i].onmouseover = function () {
          for (var j = 0; j < lis.length; j++) {
            lis[j].style.color = '#121B25'
            lis[j].style.background = ''
          }
          lis[i].style.color = '#FF02D0'
          lis[i].style.background = '#E9EBF1'
        }
      }
    },
    languageUlInfoOver() {
      var uls = this.$refs.languageRef
      var lis = uls.querySelectorAll('li')
      for (let i = 0; i < lis.length; i++) {
        lis[i].onclick = function () {
          for (var j = 0; j < lis.length; j++) {
            lis[j].style.color = '#121B25'
            lis[j].style.background = ''
          }
          lis[i].style.color = '#FF02D0'
          lis[i].style.background = '#E9EBF1'
        }
      }
    }
  },
  filters: {
    length(val) {
      if (val.length >= 12) {
        return (val = val.substring(0, 8) + '...')
      } else {
        return val
      }
    },
    lastPrice(val) {
      return val.toFixed(2)
    }
  },
  components: {}
}
</script>
<style scoped>
@keyframes switchLogin {
  from {
    left: 85px;
  }
  to {
    left: -15px;
  }
}
@keyframes switchsignup {
  from {
    left: -15px;
  }
  to {
    left: 85px;
  }
}
.lang_list li {
  font-size: 16px;
  font-family: Helvetica;
  color: #121b25;
  list-style: none;
  padding: 5px 0;
  text-align: center;
  cursor: pointer;
}
.lang_list li:hover {
  color: #ff02d0;
}
.change-language p {
  display: inline-block !important;
  padding-right: 15px;
}
.foot-bar-bg {
  /* position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0; */
  /* overflow-x: hidden; */
  width: 100vw;
  background: #f9fafc;
  box-shadow: 0px 0px 60px 0px rgba(62, 85, 103, 0.1);
  box-sizing: border-box;
}

.foot-bar {
  /* width: 1440px; */
  margin: 0 auto;
  height: 100px;

  box-sizing: border-box;
}
.foot-bar-left {
  float: left;
  width: 300px;
  height: 100px;
  position: relative;
}
.foot-bar-left .login-false {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  display: inline-block;
  margin-left: 40px;
  position: relative;
}
.foot-bar-left .login-false :nth-child(2) {
  margin-left: 40px;
}

.foot-bar-left .login-false span {
  width: 60px;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  font-family: Helvetica;
  color: #121b25;
  cursor: pointer;
  line-height: 32px;
}
.showActive {
  position: absolute;
  width: 88px;
  height: 32px;
  background: #ff02d0;
  border-radius: 16px;
  font-size: 16px;
  font-family: Helvetica;
  top: 0;
  z-index: -1;
  left: -15px;
}

.activeLogin {
  left: -15px;
  animation: switchLogin 200ms ease-in-out;
}

.activeSignup {
  left: 85px;
  animation: switchsignup 250ms ease-in-out;
}

.foot-bar-left .login-false .activeLink {
  color: #ffffff;
}

a {
  color: #ffffff;
}

.foot-bar-left-img {
  box-sizing: border-box;
  margin: 20px 0 0 20px;
  display: inline-block;
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.foot-bar-left-img img {
  border-radius: 50%;
  width: 100%;
  height: 100%;
  vertical-align: top;
}
.foot-bar-left-text {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  vertical-align: top;
  margin-left: 20px;
  height: 100px;
  position: relative;
  width: 200px;
}
.foot-bar-left-text h5 {
  cursor: pointer;
  height: 55px;
  font-size: 16px;
  font-family: Helvetica;
  color: #121b25;
  line-height: 80px;
  font-weight: normal;
}
.foot-bar-left-text ul {
  width: 113px;
  box-shadow: 0px 0px 1px 0px rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 25px;
  font-weight: 400;
  display: none;
  color: #121b25;
  position: absolute;
  padding: 13px 0 13px 0px;
  background: #ffffff;
  top: -100px;
  z-index: 23;
  cursor: pointer;
  box-sizing: border-box;
}
.foot-bar-left-text ul li {
  width: 100%;
  text-indent: 10px;
}
.foot-bar-right {
  padding-right: 40px;
  display: flex;
  justify-content: space-between;
}
.foot-bar-right ul {
  display: flex;
  justify-content: space-between;
  height: 100px;
  line-height: 100px;
  font-size: 18px;
  font-family: Helvetica;
  color: #121b25;
  align-items: center;
}

.foot-bar-right-first {
  width: 220px;
}
.foot-bar-right-second {
  width: 250px;
}
.foot-bar-right-second-line {
  width: 1px;
  height: 30px;
  background: #979797;
}
.current {
  color: #ff02d0;
}
.current::after {
  display: block;
  content: ' ';
  width: 30px;
  height: 5.5px;
  background-color: #ff02d0;
  margin: 0 auto;
  margin-top: -5.5px;
}

.foot-bar-right li {
  cursor: pointer;
}
.foot-bar-left-login {
  display: inline-block;
  width: 100px;
  margin-left: 15px;
}
.foot-bar-left-login h5 {
  display: inline-block;
  width: 50px;
  vertical-align: top;
  font-size: 18px;
  height: 60px;
  line-height: 60px;
  cursor: pointer;
}
.change-language {
  position: relative;
  width: 100px;
}
.change-language ul {
  cursor: pointer;
  /* background: #fff; */
  /* border: 1px solid #c3c3c3; */
  width: 50px;
  height: 60px;
  border: 1px solid #ccc;
  background: #fff;
  display: none;
  position: absolute;
  top: -60px;
  line-height: 30px;
  text-align: center;
  left: -18px;
  font-size: 12px;
  border: 2px;
}
</style>

