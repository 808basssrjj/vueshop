import { debounce } from "common/utils";
import BackTop from "components/contents/backtop/BackTop";

export const itemListenerMixin = {
    data() {
        return {
            itemListener: null,
        }
    },
    mounted() {
        console.log('混入mm');
        const refresh = debounce(this.$refs.scroll.refresh, 500);
        // 监听item中图片加载完成
        this.itemListener = () => {
            refresh();
        };
        this.$bus.$on("itemImageLoad", this.itemListener);
    },
    deactivated() {
        console.log('混入dd');
        // 取消全局事件监听
        this.$bus.$off("itemImageLoad", this.itemListener);
    },
}


export const backTopMixin = {
    components: {
        BackTop
    },
    data() {
        return {
            isShowBack: false,
        }
    },
    methods: {
        backClick() {
            this.$refs.scroll.scrollTo(0, 0);
        },
    }
}
