<template>
  <div>
    <div class="nav-bar" v-if="showNva" v-cloak>
      <div class="nav-bar-content">
        <!-- 左侧导航 -->
        <div class="content-left">
          <img @click="activeClick(0)" src="../../assets/img/icon_logo.png" alt />
          <span
            @click="activeClick(0)"
            class="left-home"
            :class="{ activeIndex: activeIndex == 0 ? true : false }"
          >{{ $t("lang.Home") }}</span>
          <span
            @click="activeClick(1)"
            class="left-market"
            :class="{ activeIndex: activeIndex == 1 ? true : false }"
          >{{ $t("lang.Market") }}</span>

          <div class="search-input" @keyup.enter="searhClick">
            <el-input :placeholder="$t('lang.SearchPlace')" v-model.trim="searchContent">
              <i @click="searhClick" slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
        </div>
        <!-- 右侧导航 -->
        <div class="content-right">
          <!-- 登录状态 -->
          <div class="login-true" v-if="isLogin">
            <!-- 订单区域 -->
            <div
              class="order-content"
              @mouseenter="orderShow = true"
              @mouseleave="orderShow = false"
            >
              <span class="right-order">{{ $t("lang.Order") }}</span>
              <ul class="order-link" v-show="orderShow" @click="orderShow = false">
                <li
                  @click="$router.push('/personalcenter/mycollection')"
                >{{$t('lang.My_collection')}}</li>
                <li @click="$router.push('/personalcenter/favorites')">{{$t('lang.Favorites')}}</li>
                <li
                  @click="$router.push('/personalcenter/transactionhistory')"
                >{{$t('lang.TransactionHistory')}}</li>
              </ul>
            </div>

            <!-- 个人中心 -->
            <div
              class="user-info"
              @mouseenter="userLinkShow = true"
              @mouseleave="userLinkShow = false"
            >
              <img src="../../assets/img/touxiang.png" alt />
              <span class="user-info-name">Hi,{{userInfo.name}}</span>
              <ul class="user-info-link" v-show="userLinkShow" @click="userLinkShow = false">
                <li @click="$router.push('/userinfo/usercenter')">{{$t('lang.User_center')}}</li>
                <li @click="$router.push('/userinfo/myassets')">{{$t('lang.Asset_center')}}</li>
                <li @click="logoOutClick">{{$t('lang.logout')}}</li>
              </ul>
            </div>
          </div>

          <!-- 未登陆状态 -->
          <div class="login-false" v-else>
            <span
              :class="{ activeLink: activeLink }"
              @click="goLoingClick"
              class="nav-login-btn"
            >{{ $t("lang.Login") }}</span>
            <span
              class="nav-singup-btn"
              @click="goRegisterClick"
              :class="{ activeLink: !activeLink }"
            >{{ $t("lang.Sign_Up") }}</span>
            <div class="showActive" :class="activeLink ? 'activeLogin' : 'activeSignup'"></div>
          </div>
          <!-- 分割线 -->
          <span class="right-line"></span>
          <!-- 语言切换框 -->
          <el-popover placement="bottom" width="60" v-model="visible" trigger="hover">
            <ul class="lang-list">
              <li
                v-for="(item, index) in LanguageList"
                :key="index"
                @click="SelectLang(item)"
              >{{ item.text }}</li>
            </ul>
            <li style="margin-left: 30px; width: 100px" slot="reference">
              <p style="display: inline-block; padding-right: 15px">{{ language }}</p>
              <i class="el-icon-caret-bottom" v-if="!visible"></i>
              <i class="el-icon-caret-top" v-else></i>
            </li>
          </el-popover>
        </div>
      </div>
    </div>
    <!-- 个人中心nav-bar -->
    <div class="my-center-nav-bar" v-else v-cloak>
      <div class="my-center-nav-bar-l">
        <p @click="activeClick(0)">
          <i class="el-icon-s-home"></i>
          84club{{$t('lang.Home')}}
        </p>
        <p @click="activeClick(1)">{{ $t("lang.Market") }}</p>
      </div>
      <div class="my-center-nav-bar-r">
        <el-popover placement="bottom" width="100" v-model="visible" trigger="hover">
          <ul class="nav-lang-list">
            <li
              v-for="(item, index) in LanguageList"
              :key="index"
              @click="SelectLang(item)"
            >{{ item.text }}</li>
          </ul>
          <li slot="reference" class="nav-bar-style">
            <p style="display: inline-block;padding-right: 8px">{{ language }}</p>
            <i class="el-icon-caret-bottom" v-if="!visible"></i>
            <i class="el-icon-caret-top" v-else></i>
          </li>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from 'network/request'
import { getToken } from '../../utils/utils'
export default {
  name: 'NavBar',
  data() {
    return {
      // 判断显示的nvabar
      showNva: true,
      // 订单跳转显示
      orderShow: false,
      // 用户中心跳转
      userLinkShow: false,
      // 搜索内容
      searchContent: '',
      // 登录状态
      isLogin: false,
      // token值
      token: '',
      // 当前激活索引
      activeIndex: 0,
      // 激活状态
      activeLink: false,
      // 文字对话框
      visible: false,
      // 当前展示语言
      language: 'English',
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
      // 用户数据
      userInfo: {}
    }
  },

  methods: {
    // 路由判断
    activePath() {
      const path = this.$route.path
      if (path == '/home') {
        this.activeIndex = 0
      } else if (path == '/market') {
        this.activeIndex = 1
      } else {
        this.activeIndex = -1
      }
      this.activeLink = path == '/login' ? true : false
      this.showNva = path.indexOf('/personalcente') != -1 ? false : true
    },
    // 语言切换
    SelectLang(item) {
      this.$i18n.locale = item.value
      // this.$store.commit("changeLnag", item.value);
      localStorage.setItem('lang', item.value)
      this.visible = false
      this.language = item.text
    },
    // 首页市场样式切换及跳转
    activeClick(index) {
      console.log(index)
      this.activeIndex = index
      if (index == 0) {
        this.$router.push('/home')
      } else if (index == 1) {
        this.$router.push('/market')
      }
    },
    // 登录跳转
    goLoingClick() {
      this.activeLink = !this.activeLink
      this.$router.push('/login')
    },
    // 注册跳转
    goRegisterClick() {
      this.activeLink = !this.activeLink
      this.$router.push('/register')
    },
    // 判断登录状态
    loginStatus(val) {
      this.isLogin = val

      if (document.cookie.indexOf('token') != -1) {
        this.token = getToken()

        this.getNavUserInfo()
        this.isLogin = true
      } else {
        this.isLogin = false
      }
    },
    // 搜索
    searhClick() {
      this.$store.commit('searchClick', this.searchContent)
      this.$router.push('/market')
    },
    // 获取用户数据
    async getNavUserInfo() {
      const { data: res } = await request.post('/web/user/info', {
        token: this.token,
        language: this.$i18n.locale
      })
      if (res.status == 0) {
        this.userInfo = res.data
      }
    },
    // 退出
    logoOutClick() {
      this.isLogin = false
      var exp = new Date()
      exp.setTime(exp.getTime() - 10)
      document.cookie =
        'token' + '=' + this.token + ';expires=' + exp.toUTCString()
      this.$store.commit('loginSuccess', false)
      this.$router.push('/login')
      // location.reload()
    }
  },
  computed: {
    listenIsLogin() {
      return this.$store.state.isLogin
    },
    listenSearch() {
      return this.$store.state.searchContent
    }
  },
  watch: {
    '$route.path': function (val) {
      if (val == '/home') {
        this.activeIndex = 0
      } else if (val == '/market') {
        this.activeIndex = 1
      } else {
        this.activeIndex = -1
      }

      this.activeLink = val == '/login' ? true : false

      this.showNva = val.indexOf('/personalcente') != -1 ? false : true
    },
    listenIsLogin(val) {
      this.loginStatus(val)
    },
    listenSearch(val) {
      if (val == '') {
        this.searchContent = ''
      }
    }
  },
  created() {
    getToken()
    // 判断登录状态
    this.loginStatus()
    //判断当前路由
    this.activePath()
    // 判断当前语言
    this.language = this.$i18n.locale == 'zh_cn' ? '中文' : 'English'
  },

  components: {}
}
</script>

<style  lang="less" scope>
[v-cloak] {
  display: none !important;
}

.nav-bar {
  width: 100%;
  margin: 0 auto;
  background: #f9fafc;
  box-shadow: 0px 0px 60px 0px rgba(62, 85, 103, 0.1);
  box-sizing: border-box;
  .nav-bar-content {
    height: 56px;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;

    .content-left {
      display: flex;
      align-items: center;
      img {
        max-height: 56px;
        cursor: pointer;
      }

      .left-home {
        cursor: pointer;
        margin-left: 45px;
        display: block;
        line-height: 56px;
        width: 60px;
        text-align: center;
      }
      .left-market {
        cursor: pointer;
        margin-left: 45px;
        display: block;
        line-height: 56px;
        width: 60px;
        text-align: center;
      }
      .search-input {
        max-width: 300px;
        height: 40px;
        margin-left: 45px;
        .el-input {
          input {
            width: 300px;
            border-radius: 30px;
            padding-left: 45px;
          }
          span {
            cursor: pointer;
            left: 15px;
            font-size: 20px;
          }
        }
      }
    }
    .content-right {
      display: flex;
      align-items: center;

      .login-true {
        display: flex;
        align-items: center;
        .order-content {
          position: relative;
          .right-order {
            cursor: pointer;
            display: block;
            line-height: 56px;
            width: 60px;
            text-align: center;
          }
          .order-link {
            left: -60px;
            position: absolute;
            background: #fff;
            margin: 0;
            padding: 15px 0;
            border-radius: 15px;
            z-index: 999;

            li {
              cursor: pointer;
              text-align: center;
              line-height: 35px;
              white-space: nowrap;
              min-width: 190px;
            }

            li:hover {
              color: #fff;
              background: #ff0bad;
            }
          }
        }

        .user-info {
          margin-left: 50px;
          display: flex;
          align-items: center;
          position: relative;
          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
          .user-info-name {
            margin-left: 15px;
            line-height: 56px;
          }
          .user-info-link {
            top: 56px;
            position: absolute;
            background: #fff;
            margin: 0;
            padding: 15px 0;
            border-radius: 15px;
            z-index: 999;

            li {
              cursor: pointer;
              text-align: center;
              line-height: 35px;
              white-space: nowrap;
              min-width: 190px;
            }

            li:hover {
              color: #fff;
              background: #ff0bad;
            }
          }
        }
      }
      .login-false {
        height: 56px;
        padding: 0 20px;
        width: 190px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        span {
          position: relative;
          z-index: 2;
          width: 90px;
          text-align: center;
          cursor: pointer;
          display: inline-block;
        }
      }
      .right-line {
        display: block;
        width: 1px;
        height: 35px;
        margin: 0 10px;
        background: #c3c3c3;
      }
    }
  }
  .left-home:hover,
  .left-market:hover,
  .right-order:hover {
    transition: all 0.2s ease-in;
    color: #ff02d0;
  }

  .activeIndex {
    color: #ff02d0;
    position: relative;
  }
  .activeIndex::after {
    content: '';
    display: block;
    width: 30px;
    height: 3px;
    background: #ff02d0;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: 3px;
  }

  // 登录注册样式
  .activeLink {
    color: #fff;
  }
  .showActive {
    position: absolute;
    width: 90px;
    height: 32px;
    background: #ff02d0;
    border-radius: 16px;
    font-size: 16px;
    font-family: Helvetica;
    z-index: 0;
    left: 18px;
  }

  @keyframes switchLogin {
    from {
      left: 120px;
    }
    to {
      left: 20px;
    }
  }
  @keyframes switchsignup {
    from {
      left: 20px;
    }
    to {
      left: 120px;
    }
  }

  .activeLogin {
    left: 20px;
    animation: switchLogin 200ms ease-in-out;
  }

  .activeSignup {
    left: 120px;
    animation: switchsignup 250ms ease-in-out;
  }
}
// 语言选择样式
.lang-list {
  font-size: 16px;
  font-family: Helvetica;
  color: #121b25;
  list-style: none;
  padding: 0;
  text-align: center;
  cursor: pointer;

  li {
    list-style: none;
    font-size: 16px;
    font-family: Helvetica;
    color: #121b25;
    list-style: none;
    padding: 0;
    line-height: 35px;
    text-align: center;
    cursor: pointer;
  }
  li:hover {
    color: #ff02d0;
  }
}

.my-center-nav-bar {
  margin: 0 auto;
  background: #eaeaea;
  height: 30px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .my-center-nav-bar-l {
    display: flex;
    p {
      cursor: pointer;
      font-size: 12px;
      width: 150px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #a2a2a2;
    }
  }
  .my-center-nav-bar-r {
    .nav-bar-style {
      text-align: center;
      width: 100px;
      font-size: 14px;
      font-family: Helvetica;
      color: #868c93;
    }
  }
}
.nav-lang-list {
  position: relative;
  z-index: 999;
  width: 100px;
  background: none;
  margin: 0;
  padding: 0;
  text-align: center;

  li {
    cursor: pointer;
    line-height: 35px;
  }
}
.el-popover {
  min-width: 100px !important;
}
.el-popover__reference {
  cursor: pointer;
}
</style>
