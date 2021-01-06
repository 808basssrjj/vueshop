<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <tab-control
      :ctitles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tControl"
      v-show="isTabFixed"
    />

    <scroll
      class="scroll"
      ref="scroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <home-swiper :cbanners="banners" @swiperImageLoad="swiperImageLoad" />
      <home-recommend :crecommend="recommends" />
      <home-feature />
      <tab-control
        :ctitles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <goods-list :cgoods="showGoods" />
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBack" />
  </div>
</template>

<script>
// 子组件
import HomeSwiper from "./childComps/HomeSwiper";
import HomeRecommend from "./childComps/HomeRecommend";
import HomeFeature from "./childComps/HomeFeature";

// 公共组件
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/contents/tabControl/TabControl";
import GoodsList from "components/contents/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
// import BackTop from "components/contents/backtop/BackTop";

import { getHomeMultidata, getHomeGoods } from "network/home";
import { debounce } from "common/utils";
import { itemListenerMixin } from "common/mixin";
import { backTopMixin } from "common/mixin";

export default {
  name: "Home",
  mixins: [itemListenerMixin, backTopMixin],
  components: {
    HomeSwiper,
    HomeRecommend,
    HomeFeature,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    // BackTop,
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      // isShowBack: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      // itemListener: null,
    };
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata();
    // 2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  //挂载
  mounted() {
    // const refresh = debounce(this.$refs.scroll.refresh, 500);
    // // 监听item中图片加载完成
    // this.itemListener = () => {
    //   refresh();
    // };
    // this.$bus.$on("itemImageLoad", this.itemListener);
  },
  deactivated() {
    // 取消全局事件监听
    // this.$bus.$off("itemImageLoad", this.itemListener);
  },
  methods: {
    /**
     * 网络请求方法
     */
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        //保存数据
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        //上拉加载刷新
        this.$refs.scroll.finishPullUp();
      });
    },

    /**
     * 事件监听方法
     */
    // 不同类型数据
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }

      this.$refs.tabControl2.currentIndex = index;
      this.$refs.tabControl1.currentIndex = index;
    },
    // 回到顶部
    // backClick() {
    //   // $fefs.scroll 组件中scrollTo方法
    //   this.$refs.scroll.scrollTo(0, 0);
    // },
    //回到顶部隐藏和显示
    contentScroll(position) {
      // 1.判断backtop是否显示
      this.isShowBack = -position.y > 1000;
      // 2.判断tabControl是否吸顶
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    //上啦加载更多
    loadMore() {
      this.getHomeGoods(this.currentType);
    },
    //topControl吸顶效果:  获取tabcontrol的offsettop
    swiperImageLoad() {
      // 所有组件都有一个$el属性 用来拿组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  /* vh 视口高度 */
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  position: relative;
  width: 100%;

  /* position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;*/
  z-index: 9;
}

/* .tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
} */

.scroll {
  /* height: 500px; */
  /* overflow: hidden; */
  position: absolute;
  top: 44px;
  bottom: 49px;
}

.tControl {
  position: relative;
  z-index: 9;
}

/* .fixed{
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
} */
</style>
