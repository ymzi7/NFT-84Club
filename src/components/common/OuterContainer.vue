<template>
  <div class="outer-container">
    <el-container>
      <el-aside width="300px">
        <el-collapse v-model="activeNames">
          <el-collapse-item :title="this.$t('lang.collections')" name="2">
            <ul class="aside-nav" style="overflow-y: auto">
              <li v-for="(item, index) in allContract" :key="index" @click="navClick(index)">
                <div class="aside-nav-img">
                  <img :src="item.imageUrl" alt />
                </div>
                <div class="aside-nav-title">
                  <h5>{{ item.name }}</h5>
                  <span>{{ item.total }} {{ $t("lang.Followers") }}</span>
                </div>
                <div :class="{ selected: isShow }" v-show="activeCon == index"></div>
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </el-aside>
      <el-main>
        <slot></slot>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { request } from '../../network/request'
import { getToken } from "@/utils/utils.js";
export default {
  props:{
    type:'',
    totalType:''

  },
  data() {
    return {
      token:"",
      // 当前展开内容
      activeNames: ['2'],
      //  合约列表
      allContract: [],
      activeCon: -1,
      isShow: false,
      navFlag: true,
      currentIndex: -1
    }
  },


  methods: {
    // 请求合约列表
    async getAllContract() {
      const { data: res } = await request.get('/web/Contract/findAllContract', {
        params: {
          language: this.$i18n.locale
        }
      })
      if (res.status == 0) {


        this.allContract = res.data
        var currentIndex = this.$store.state.detailCurrent
        if (currentIndex != -1) {
          this.allContract.forEach((item, index) => {
            if (item.id == currentIndex) {
              this.navClick(index)
              this.$store.commit('detailCurrent', -1)
            }
          })

          //  this.$emit('navClick',currentIndex)
        } else {
          if (this.$route.path == '/home' || this.$route.path == '/market') {
            this.navClick(0)
          }
        }
      }
    },
    // 请求的我的藏品合约列表
    async getMyContract(){
      var token = getToken()
      var  type = this.totalType == 'mycollection' ? 1 : 2
      const {data:res} = await request.post('/web/Contract/contractList',{
        language:this.$i18n.locale,
        token:token,
        type:type
      })
      if(res.status == 0){
         this.allContract = res.data
      }
    },

    // 发送点击事件
    navClick(index) {
      this.activeCon = index
      this.isShow = true
      var id = this.allContract[index].id
      this.$emit('navClick', id)
    }
  },
  created(){
    if(this.totalType == 'mycollection' || this.totalType == 'favorites'){
      this.getMyContract()
    }else{
      this.getAllContract()
    }

    
  },

  watch: {
    currentIndex(val) {
      this.navFlag = false
      this.$emit('navClick', val)
    },

  },
  computed(){


  },
  computed: {
    detailCurrent() {
      return (this.currentIndex = this.$store.state.detailCurrent)
    }
  },
  components: {}
}
</script>
<style  lang="less" scope>
.outer-container {
  // min-height: 915px;
  min-height: calc(100vh - 56px - 30px);
  background-color: #f6f7f9;
  /deep/ .el-container {
    min-height: calc(100vh - 56px);

    .el-main::-webkit-scrollbar {
      min-height: 100%;
      // min-height: 910px;
      width: 0;
    }
    .el-aside {
      background: #eff0f5;
      min-height: 100%;
      .el-collapse-item__header {
        background: #eff0f5;
        height: 53px;
        font-family: PingFangSC-Regular, PingFang SC;
        padding: 0 30px;
        font-size: 20px;
        line-height: 53px;
        color: #121b25;
        font-weight: 400;
      }
      .el-collapse-item__content {
        background: #eff0f5;
        padding: 0;

        .aside-nav {
          margin: 0;
          padding: 25px 0;
          box-sizing: border-box;
          li {
            display: flex;
            align-items: center;
            // height: 60px;
            cursor: pointer;
            margin-bottom: 10px;
            position: relative;
            padding: 10px 30px;
            box-sizing: border-box;

            .aside-nav-img {
              display: flex;
              align-items: center;
              width: 60px;
              height: 60px;
              border-radius: 50%;
              img {
                border-radius: 50%;
                width: 60px;
                height: 60px;
              }
            }
            .aside-nav-title {
              margin: 9px 0 0 20px;
              vertical-align: top;
              h5 {
                margin: 0px 0;
                font-size: 14px;
                font-family: Helvetica;
                color: #121b25;
                line-height: 20px;
              }
              span {
                width: 85px;
                height: 19px;
                font-size: 12px;
                font-family: Helvetica;
                color: #596675;
                line-height: 14px;
                margin-top: -10px;
              }
            }
            .selected {
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              height: 60%;
              width: 5px;
              background-color: #ff02d0;
            }
          }
          li:hover {
            background-color: #e4e4e4;
          }
        }
      }
      .is-active {
        .el-collapse-item__header {
          background: #e9ebf1;
        }
        .el-collapse-item__content {
          background: #f3f5f7;
        }
      }
    }
  }
  .el-main {
    padding: 0;
    background: #f6f7f9;
  }
}
</style>
