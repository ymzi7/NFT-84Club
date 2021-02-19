<template>
  <div class="personal-center">
    <div class="personal-center-nav">
      <div class="personal-center-nav-left">
        <img src="../../assets/img/icon_logo.png" alt @click="$router.push('/home')" />
        <div
          @click="$router.push('/personalcenter/mycollection')"
          :class="{ 'active-link': activeLink == 0 }"
        >{{ $t("lang.My_items") }}</div>
        <div
          @click="$router.push('/personalcenter/favorites')"
          :class="{ 'active-link': activeLink == 1 }"
        >{{ $t("lang.Favorites") }}</div>
        <div :class="{ 'active-link': activeLink == 2 }">{{ $t("lang.TransactionHistory") }}</div>
      </div>
      <div
        class="personal-center-nav-right"
        @mouseenter="userLinkShow = true"
        @mouseleave="userLinkShow = false"
      >
        <img src="../../assets/img/touxiang.png" alt />
        <span>Hi,{{ userInfo.name }}</span>

        <ul class="user-info-link" v-show="userLinkShow" @click="userLinkShow = false">
          <li @click="$router.push('/userinfo/usercenter')">{{$t('lang.User_center')}}</li>
          <li @click="$router.push('/userinfo/myassets')">{{$t('lang.Asset_center')}}</li>
          <li @click="logoOutClick">{{$t('lang.logout')}}</li>
        </ul>
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import { request } from 'network/request'
import { getToken } from '@/utils/utils.js'
export default {
  data() {
    return {
      activeLink: 0,
      token: '',
      userInfo: {},
      userLinkShow: false
    }
  },
  methods: {
    async getUserInfo() {
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
      var exp = new Date()
      exp.setTime(exp.getTime() - 10)
      document.cookie =
        'token' + '=' + this.token + ';expires=' + exp.toUTCString()
      this.$store.commit('loginSuccess', false)
      this.$router.push('/login')

      // location.reload()
    }
  },

  watch: {
    '$route.path': function (val) {
      if (val == '/personalcenter/mycollection') {
        this.activeLink = 0
      } else if (val == '/personalcenter/favorites') {
        this.activeLink = 1
      } else if (val == '/personalcenter/transactionhistory') {
        this.activeLink = 2
      }
    }
  },
  created() {
    this.token = getToken()
    this.getUserInfo()

    var val = this.$route.path
    if (val == '/personalcenter/mycollection') {
      this.activeLink = 0
    } else if (val == '/personalcenter/favorites') {
      this.activeLink = 1
    } else if (val == '/personalcenter/transactionhistory') {
      this.activeLink = 2
    }
  },
  components: {}
}
</script>

<style  lang="less" scope>
.personal-center {
  .personal-center-nav {
    background: #f7f8fa;
    box-shadow: 0px 0px 60px 0px rgba(62, 85, 103, 0.1);
    height: 56px;
    padding: 0 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .personal-center-nav-left {
      display: flex;
      align-items: center;
      img {
        max-height: 56px;
        cursor: pointer;
        margin-right: 30px;
      }

      div {
        margin-right: 30px;
        cursor: pointer;
        padding: 0 20px;
        text-align: center;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #868c93;
        height: 30px;
        line-height: 30px;
      }
      .active-link {
        height: 30px;
        background: #ff02d0;
        border-radius: 14px;
        color: #ffffff;
      }
    }
    .personal-center-nav-right {
      display: flex;
      align-items: center;
      position: relative;
      img {
        width: 34px;
        height: 34px;
        border-radius: 50%;
      }
      span {
        margin-left: 5px;
        display: block;
      }
      .user-info-link {
        top: 35px;
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
}
</style>
