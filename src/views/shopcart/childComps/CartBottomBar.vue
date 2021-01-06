<template>
  <!-- 底部 -->
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        class="check-button"
        :is-checked="isSelectAll"
        @click.native="checkClick"
      ></check-button>
      <span>全选</span>
    </div>

    <div class="count">合计: {{ totalPrice }}</div>

    <div class="calc">去支付: {{ checklength }}</div>
  </div>
</template>

<script>
import CheckButton from "components/contents/checkbutton/CheckButton";

import { mapGetters } from "vuex";

export default {
  name: "CartBottomBar",
  data() {
    return {};
  },
  components: {
    CheckButton,
  },
  computed: {
    ...mapGetters(["cartList"]),
    totalPrice() {
      return this.cartList
        .filter((item) => {
          return item.checked;
        })
        .reduce((prvValue, item) => {
          return prvValue + item.price * item.count;
        }, 0);
    },
    checklength() {
      return this.cartList
        .filter((item) => {
          return item.checked;
        })
        .reduce((prvValue, item) => {
          return prvValue + item.count;
        }, 0);
    },
    isSelectAll() {
      if (this.cartList.length === 0) return false;
      //1.
      // return !this.cartList.filter((item) => !item.checked).length;
      //2.
      return !this.cartList.find((item) => !item.checked);
      //3.
      //   for (let item of this.cartList) {
      //     if (!item.checked) {
      //       return false;
      //     }
      //     return true;
      //   }
    },
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) {
        this.cartList.forEach((item) => (item.checked = false));
      } else {
        this.cartList.forEach((item) => (item.checked = true));
      }
      //   this.cartList.forEach((item) => (item.checked = !this.isSelectAll));
    },
  },
};
</script>

<style scoped>
.bottom-bar {
  background-color: #dbe5ec;
  position: relative;
  display: flex;
  height: 40px;
  line-height: 40px;
}
.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 10px;
}
.check-content {
  display: flex;
  align-items: center;
  font-size: 13px;
  margin-left: 10px;
  width: 60px;
}
.count {
  color: #ff5777;
  padding-left: 50px;
  flex: 1;
  font-size: 13px;
}
.calc {
  width: 90px;
  color: white;
  text-align: center;
  background-color: #ff8198;
  font-size: 14px;
}
</style>
