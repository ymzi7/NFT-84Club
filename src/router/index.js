import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from "../utils/utils";


Vue.use(VueRouter)
// PC端页面
const AboutAccounts = () => import('views/aboutAccount/AboutAccounts')
// import Login from '../views/loginAndRegister/Login.vue'
// const Home = () => import('../views/home/Home.vue')
import Home from '../views/home/Home.vue'
// const Detail = () => import('../views/detail/Detail.vue')
import Detail from '../views/detail/Detail.vue'
// const userInfo = () => import('../views/userInfo/userInfo.vue')
import userInfo from '../views/userInfo/userInfo.vue'
// const userCenter = () => import('../views/userInfo/userCenter/userCenter.vue')
import userCenter from '../views/userInfo/userCenter/userCenter.vue'
// const MyAssets = () => import('../views/userInfo/assetCenter/MyAssets.vue')
import MyAssets from '../views/userInfo/assetCenter/MyAssets.vue'
// const AssetRecord = () => import('../views/userInfo/assetCenter/assetRecords.vue')
import AssetRecord from '../views/userInfo/assetCenter/assetRecords.vue'
// const WithdrawAddr = () => import('../views/userInfo/assetCenter/withdraw.vue')
import WithdrawAddr from '../views/userInfo/assetCenter/withdraw.vue'
// const Market = () => import('../views/market/index.vue')
import Market from '../views/market/Market.vue'
const KYC = () => import('../views/userInfo/userCenter/KYC.vue')
// 个人中心
const PersonalCenter = () => import('../views/personalCenter/PersonalCenter.vue')
const MyCollection = () => import('../views/personalCenter/MyCollection.vue')
const Favorites = () => import('../views/personalCenter/Favorites.vue')
const TransactionHistory = () => import('../views/personalCenter/TransactionHistory.vue')

const TermOfService = () => import('../views/termAndPriacy/TermOfService.vue')
const PrivacyPolicy = () => import('../views/termAndPriacy/PrivacyPolicy.vue')




const routes = [
  {
    path: '/', component: Home, redirect: '/home', meta: {
      title: '84club | Buy| Sell| Explore Digital Items'
    }
  },

  { path: '/login', component: AboutAccounts,
    meta: {
      title: '84club | Login'
    }
  },
    { path: '/register', component: AboutAccounts,
    meta: {
      title: '84club | Register'
    }
  },
    { path: '/forget', component: AboutAccounts ,
    meta: {
      title: '84club | Forget'
    }
  },
  { path: '/termofservice', component: TermOfService,
  meta: {
    title: '84club | Term of service'
  }

},
{ path: '/privacypolicy', component: PrivacyPolicy ,
meta:{

  title: '84club | Term of privacy'

}},

  { path: '/personalcenter', name: '', component: PersonalCenter,
    children: [
      { path: '/', component: MyCollection,redirect: 'mycollection' },
      { path: 'mycollection', component: MyCollection },
      { path: 'favorites', component: Favorites },
      { path: 'transactionhistory', component: TransactionHistory }
    ]
  },
  {
    path: '/home', component: Home, meta: {
      title: '84club | Buy | Sell | Explore Digital Items'
    }
  },
  {
    path: '/market', component: Market, meta: {
      title: '84club | Market'
    }
  },

  {
    path: '/assets/:contractAddress/:id', component: Detail, meta: {
      title: '84club | Digital Items'
    }
  },
  {
    path: '/userinfo', component: userInfo,
    children: [
      { path: '/', component: userCenter, redirect: 'usercenter' },
      {
        path: 'usercenter', component: userCenter, meta: {
          title: '84club | User Center'
        }
      },
      {
        path: 'myassets', component: MyAssets, meta: {
          title: '84club | Assets'
        }
      },
      {
        path: 'asset-records', component: AssetRecord,
        meta: {
          title: '84club | Assets History'
        }
      },
      {
        path: 'withdraw-address', component: WithdrawAddr, name: 'WithdrawAddr',
        meta: {
          title: '84club | Assets Address'
        }
      },
      {
        path: 'kyc', component: KYC, meta: {
          title: '84club | KYC'
        }
      }
    ]
  },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})



// 解决导航栏或者底部导航tabBar中的vue-router在3.0版本以上频繁点击菜单报错的问题。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


router.beforeEach((to, from, next) => {
  if (to.path.indexOf('personalcenter') != -1 || to.path.indexOf('userinfo') != -1) {
    var  token = getToken()
    if (token) {
      next()
    } else {
      next({
        path: "/login"
      })
    }
  }
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
  // next()
})


export default router

