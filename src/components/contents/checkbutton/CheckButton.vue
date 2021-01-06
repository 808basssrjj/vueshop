<template>
  <!-- 选中按钮 -->
  <div class="check-button" :class="{ active: isChecked }">
    <img src="~assets/img/cart/tick.svg" alt="" />
  </div>
</template>

<script>
export default {
  name: "CheckButton",
  props: {
    isChecked: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  components: {},
};
</script>

<style scoped>
.check-button {
  background-color: #eeeeee;
  border-radius: 50%;
  border: solid 1px #aaa;
}
.active {
  border-color: #ff5777;
  border-radius: 50%;
  background-color: #ff5777;
}
</style>
