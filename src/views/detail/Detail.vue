<template>
  <div id="detail">
    <detail-navbar class="detailnav" @titleClick="titleClick" ref="nav" />
    <scroll
      class="detailcontent"
      ref="scroll"
      @scroll="contentScroll"
      :probe-type="3"
    >
      <detail-swiper :top-images="this.topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-images-info :imagesInfo="detailInfo" @imgLoad="imgLoad" />
      <detail-params-info ref="params" :paramInfo="paramInfo" />
      <detail-comment-info ref="comment" :commentInfo="commentInfo" />
      <goods-list ref="recommend" :cgoods="recommend" />
    </scroll>

    <detail-buttom-bar @addToCart="addToCart" />

    <back-top @click.native="backClick" v-show="isShowBack" />
  </div>
</template>

<script>
// 子组件
import DetailNavbar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailImagesInfo from "./childComps/DetailImagesInfo";
import DetailParamsInfo from "./childComps/DetailParamsInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailButtomBar from "./childComps/DetailButtomBar";

// 公共组件
import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/contents/goods/GoodsList";

import { debounce } from "common/utils";
import { itemListenerMixin } from "common/mixin";
import { backTopMixin } from "common/mixin";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParams,
  getReCommend,
} from "network/detail";

export default {
  name: "Detail",
  mixins: [itemListenerMixin, backTopMixin],
  components: {
    DetailNavbar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailImagesInfo,
    DetailParamsInfo,
    DetailCommentInfo,
    DetailButtomBar,
    Scroll,
    GoodsList,
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommend: [],
      // itemListener: null,
      themeTopYs: [],
      getThemeTop: null,
      currentIndex: 0,
    };
  },
  created() {
    // 1.保存iid
    this.iid = this.$route.params.iid;

    // 2.根据iid获取详情
    getDetail(this.iid).then((res) => {
      // console.log(res);
      const data = res.result;
      // 顶部轮播图数据
      this.topImages = res.result.itemInfo.topImages;
      // console.log(this.topImages);

      //商品信息数据
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      //商家信息数据
      this.shop = new Shop(data.shopInfo);

      //商品详情数据
      this.detailInfo = data.detailInfo;

      //参数信息
      this.paramInfo = new GoodsParams(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    });

    // 3.请求推荐数据
    getReCommend().then((res) => {
      this.recommend = res.data.list;
    });

    this.$nextTick(() => {
      // 对应dom已渲染,但图片为加载完
      // this.themeTopYs = [];
      // this.themeTopYs.push(0);
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      // console.log(this.themeTopYs);
    });

    this.getThemeTop = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44);
      this.themeTopYs.push(Number.MAX_VALUE);
    });
  },
  mounted() {
    // const refresh = debounce(this.$refs.scroll.refresh, 500);
    // // 监听item中图片加载完成
    // this.itemListener = () => {
    //   refresh();
    // };
    // this.$bus.$on("itemImageLoad", this.itemListener);
  },
  destroyed() {
    // 取消全局事件监听
    // this.$bus.$off("itemImageLoad", this.itemListener);
  },
  methods: {
    imgLoad() {
      // console.log("--");
      this.$refs.scroll.refresh();

      this.getThemeTop();
    },
    // 点击标题跳转对应位置
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
    },
    // 滚动自动切换标题
    contentScroll(position) {
      // 1.获取Y值
      const positionY = -position.y;
      // 2.对比
      for (let i = 0; i < this.themeTopYs.length - 1; i++) {
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
    },
    // 显示回到顶部
    contentScroll(position) {
      this.isShowBack = -position.y > 1000;
    },
    // 加入购物车
    addToCart() {
      // 获取信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      // 添加购物车
      // this.$store.commit("addCart", product);
      this.$store.dispatch("addCart", product).then((res) => {
        this.$toast.show(res, 2000);
      });
    },
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detailcontent {
  height: calc(100% - 44px - 49px);
}
.detailnav {
  position: relative;
  z-index: 9;
  background: #fff;
}
</style>
