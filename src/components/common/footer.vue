<template>
  <div class="footer_container">
    <div class="footer_info">
      <div class="main_info">
        <div class="web_logo" @click="$router.push('/home')"></div>
        <div class="info">{{ $t("lang.footer_info") }}</div>
      </div>
      <div class="main_router">
        <div class="router_group" v-for="(group, index) in routerGrounps" :key="index">
          <div class="router_title">{{ group.title }}</div>
          <a
          target="_blank"
            class="router_link"
            :href="link.path"
            v-for="link in group.links"
            :key="link.name"
          >{{ link.name }}</a>
        </div>
      </div>
    </div>

    <div class="footer_link">
      <div class="_info">{{ $t("lang.Join_community") }}</div>
      <div class="link_group">
        <a href="https://twitter.com/84clubglobal" target="_blank">
          <img src="../../assets/img/位图32.png" />
        </a>
        <a :href="telegramLink" target="_blank">
          <img src="../../assets/img/位图.png" />
        </a>
        <a @click.prevent>
          <el-popover placement="top" width="200" trigger="hover">
            <img class="qrcode" src="../../assets/img/wechatqrcode.png" />
            <img src="../../assets/img/WeChat.png" slot="reference" />
          </el-popover>
        </a>
        <a @click.prevent>
          <el-popover placement="top" width="200" trigger="hover">
            <img class="qrcode" src="../../assets/img/qqqrcode.png" />
            <img src="../../assets/img/QQ.png" slot="reference" />
          </el-popover>
        </a>
        <a href="https://weibo.com/u/7517664778" target="_blank">
          <img src="../../assets/img/Weibo.png" />
        </a>
      </div>
    </div>
    <div class="copyRight">
      <span>© 2020 84club. All rights reserved.</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      telegramLink: 'https://t.me/cn84club'
    }
  },
  computed: {
    routerGrounps() {
      return [
        {
          title: this.$t('lang.my_account'),
          links: [
            { name: this.$t('lang.User_Center'), path: '/userinfo' },
            { name: this.$t('lang.My_assets'), path: '/userinfo/myassets' },
            { name: this.$t('lang.My_items'), path: '/mycollection' }
          ]
        },
        {
          title: this.$t('lang.Terms_conditions'),
          links: [
            { name: this.$t('lang.Terms_service'), path: '/termofservice' },
            { name: this.$t('lang.pp'), path: '/privacypolicy' }
          ]
        },
        {
          title: this.$t('lang.about_us'),
          links: [
            { name: '84Club blog', path: 'https://84clubblog.wordpress.com/' }
          ]
        },
        {
          title: this.$t('lang.Business_collaboration'),
          links: [
            { name: 'sales@84club.com', path: 'mailto:sales@84club.com' }
          ]
        }
      ]
    }
  },
  created() {
    this.telegramLink =
      this.$i18n.locale == 'en_us'
        ? 'https://t.me/global84club'
        : 'https://t.me/cn84club'
  },
  watch: {
    '$i18n.locale': function (val) {
      this.telegramLink =
        val == 'en_us' ? 'https://t.me/global84club' : 'https://t.me/cn84club'
    }
  }
}
</script>

<style lang="less" scoped>
.qrcode {
  width: 200px;
}
.footer_container {
  height: 446px;
  max-width: 100%;
  min-width: 860px;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  background: radial-gradient(
    farthest-side,
    rgba(176, 50, 135, 1) 10%,
    rgba(126, 30, 108, 1) 100%
  );
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  padding: 70px 130px 0;
  box-sizing: border-box;
  .footer_info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 40px;
    border-bottom: 1px solid #7b0e67;
    .main_info {
      display: flex;
      flex-direction: column;
      flex: 300px 1 0;
      .web_logo {
        width: 178px;
        height: 75px;
        background: url('../../assets/img/编组 12.png') no-repeat center;
        background-size: contain;
        cursor: pointer;
      }
      .info {
        padding-left: 14px;
        width: 100%;
        line-height: 17px;
        margin-top: 20px;
      }
    }
    .main_router {
      display: flex;
      flex-direction: row;
      flex: 400px 0.8 0;
      justify-content: space-between;
      margin-left: 133px;

      .router_group {
        margin-left: 20px;

        .router_link {
          display: block;
          margin-top: 20px;
          cursor: pointer;
          white-space: nowrap;
          color: #d6d6d6;
          text-decoration: none;
        }
        .router_link:hover {
          color: #ffffff;
        }
      }
    }
  }
  .footer_link {
    height: 133px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #7b0e67;

    ._info {
      padding-left: 14px;
      flex: 500px 0 1;
      white-space: nowrap;
    }
    .link_group {
      flex: 400px 0 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-left: 133px;
      a {
        margin-left: 20px;
        border-radius: 50%;
        img {
          width: 47px;
          height: 47px;
          border-radius: 50%;
        }
      }
      a:hover {
        box-shadow: -1px -6px 10px 1px rgb(190, 155, 178, 0.8);
      }
      a:focus {
        outline: none;
      }
    }
  }
  .copyRight {
    flex: 1;
    align-self: center;
    justify-self: flex-end;
    display: flex;
    align-items: center;
    color: rgba(216, 216, 216, 1);
  }
}
</style>