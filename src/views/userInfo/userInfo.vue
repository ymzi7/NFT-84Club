<template>
  <div>
    <div class="userCenter_outer">
      <div class="userCenter_container">
        <el-container>
          <el-aside width="300px" class="aside-nav-a">
            <ul class="user-info-nav">
              <li :class="{ active: !active }" @click="activeClick(0)">
                <div class="user-info-nav-img">
                  <img
                    v-if="active"
                    src="../../assets/img/Assets conversion/ic-ucenter-off.png"
                    alt
                  />
                  <img v-else src="../../assets/img/Assets conversion/ic-ucenter-on.png" alt />
                </div>
                <span>{{$t('lang.User_center')}}</span>
              </li>
              <li @click="activeClick(1)" :class="{ active: active }" ref="accsetCenterRef">
                <div class="user-info-nav-img">
                  <img
                    v-if="!active"
                    src="../../assets/img/Assets conversion/ic-acenter-off.png"
                    alt
                  />
                  <img v-else src="../../assets/img/Assets conversion/ic-acenter-on.png" alt />
                </div>
                <span>{{$t('lang.Asset_center')}}</span>
              </li>
            </ul>
            <ul class="asset-center-lis" v-show="active" ref="assetRef">
              <li @click="assetClick(0)" class="assetActive">{{$t('lang.My_assets')}}</li>
              <li @click="assetClick(1)">{{$t('lang.Asset_records')}}</li>
              <li @click="assetClick(2)">{{$t('lang.Withdrawal_address')}}</li>
            </ul>
          </el-aside>
          <el-main class="mian">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </el-main>
        </el-container>
      </div>
    </div>
    <foot-bar></foot-bar>
  </div>
</template>

<script>
import { request, price } from '../../network/request'
import FootBar from '../../components/common/footer.vue'

export default {
  data() {
    return {
      active: false,
      activeIndex: 0
    }
  },
  created() {},
  watch: {
    '$route.path': 'getPath'
  },
  mounted() {
    var ulTitil = document.querySelector('.current')
    if (ulTitil) {
      ulTitil.className = ''
    }

    if (this.$route.path.indexOf('myassets') != -1) {
      this.activeClick(1)
    }
  },
  methods: {
    getPath() {
      if (this.$route.path.indexOf('usercenter') != -1) {
        this.activeClick(0)
      } else if (this.$route.path.indexOf('myassets') != -1) {
        this.activeClick(1)
      } else if (this.$route.path.indexOf('withdraw-address') != -1) {
        this.assetClick(2)
      }
    },

    // 激活选择
    activeClick(index) {
      this.active = index == 0 ? false : true
      if (index == 0) {
        this.$router.push('/userinfo/usercenter')
        var asset = this.$refs.assetRef
        var lis = asset.querySelectorAll('li')
        for (var i = 0; i < lis.length; i++) {
          lis[i].className = ''
        }
      } else if (index == 1) {
        this.$router.push('/userinfo/usercenter')
        var asset = this.$refs.assetRef
        var lis = asset.querySelectorAll('li')
        lis[0].className = 'assetActive'

        this.$router.push('/userinfo/myassets')
      }
    },
    // 激活选择
    assetClick(index) {
      var asset = this.$refs.assetRef
      var lis = asset.querySelectorAll('li')
      for (var i = 0; i < lis.length; i++) {
        lis[i].className = ''
      }
      lis[index].className = 'assetActive'

      switch (index) {
        case 0:
          this.$router.push('/userinfo/myassets')
          break
        case 1:
          this.$router.push('/userinfo/asset-records')
          break
        case 2:
          this.$router.push('/userinfo/withdraw-address')
          break
      }
    }
    // 账户信息
  },
  components: {
    FootBar
  }
}
</script>

<style  lang="less" scope>
.footbar-user {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
}
// .user-info-aside {
//   // overflow-x: hidden;
//   width: 100%;
//   height: 100%;
//   .el-container {
//     width: 100%;
//     height: 100%;
//   }
// }

.userCenter_outer {
  // overflow-x: scroll;
  display: flex;
  justify-content: center;
  width: 100%;
  // height: 100%;
  /deep/ button:not(.el-dialog__headerbtn) {
    cursor: pointer;
    position: relative;
  }
  /deep/
    button:not(.is-disabled):not(.el-dialog__headerbtn):not(.el-button--default):hover {
    background-color: #4b81fd;
  }

  /deep/
    button:not(.is-disabled):not(.el-dialog__headerbtn):not(.el-button--default):active:after {
    opacity: 0.3;
    //设置初始状态
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: 0s;
  }
  /deep/
    button:not(.is-disabled):not(.el-dialog__headerbtn):not(.el-button--default):after {
    content: '';
    display: block;
    position: absolute;
    //扩大伪类元素4个方向各10px
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    pointer-events: none;
    border-radius: 15px;
    background-color: #3461c8;
    background-repeat: no-repeat;
    background-position: 50%;
    opacity: 0;
    transition: all 0.3s;
  }
}
.userCenter_container {
  box-sizing: border-box;
  // min-width: 1440px;
  width: 100%;
  // margin-bottom: 100px;
  // height: 100%;
  .el-container {
    min-height: calc(100vh - 56px);
    width: 100%;
    // height: 100%;
    background: #f4f4f4;
    // justify-content: center;
    // .el-aside {
    //   // width: 250px;
    //   // flex: 250px 0 0;
    // }
    .el-main {
      // padding: 0 200px 0 0;
      background: #f4f4f4;
      flex: 860px 1 0;
      // margin-bottom: 100px;
    }
    .el-main::-webkit-scrollbar {
      width: 0px;
    }
  }
}
.el-aside {
  width: 299px;
  // height: 865px;
  background: #eff0f5;

  .icon-title-a {
    margin: 40px 0 0 40px;
  }
  .user-info-nav {
    margin: 0 auto;
    margin-top: 63px;

    li {
      margin-bottom: 33px;
      height: 30px;
      line-height: 20px;
      display: flex;
      align-items: center;
      cursor: pointer;

      .user-info-nav-img {
        width: 14px;
        height: 18px;
        display: inline-block;

        img {
          width: 100%;
          height: 100%;
          vertical-align: top;
        }
      }
      span {
        display: inline-block;
        margin-left: 33px;
        font-size: 14px;
        height: 20px;
        line-height: 20px;
        font-weight: 500;
        font-family: PingFangSC-Medium, PingFang SC;
        vertical-align: top;
      }
    }
  }
  .asset-center-lis {
    margin-left: 45px;
    width: 130px;
    height: 85px;
    font-size: 14px;
    font-family: Helvetica;
    color: #343532;
    line-height: 17px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    li {
      cursor: pointer;
    }
  }
  .active {
    color: #0161cc;
    border-right: 3px solid #0161cc;
  }
  .assetActive {
    color: #ff02d0;
  }
}
// .el-container {
//   background: #f4f4f4;
//   // justify-content: center;
//   .el-aside {
//     justify-self: flex-start;
//   }
// }
// .el-main {
//   // padding: 0 200px 0 0;
//   background: #f4f4f4;
// }
// .el-main::-webkit-scrollbar {
//   width: 0px;
// }
.aside-nav-a {
  position: relative;
  // height: 100vh;
}
</style>
