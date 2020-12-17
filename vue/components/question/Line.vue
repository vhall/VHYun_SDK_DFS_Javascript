<template>
  <div class="q-line"></div>
</template>

<script>
import { store, mutations } from "../../store.js";
export default {
  props: {
    index: Number
  },
  computed: {
    value() {
      return store.questionData.detail[this.index];
    }
  },
  data() {
    return {
      errorTip: ""
    };
  },
  methods: {
    check() {
      if (!this.value.title) {
        this.errorTip = "分割线标题不能为空";
        return;
      } else {
        this.errorTip = "";
        return true;
      }
    }
  }
};
</script>


<style lang="scss" scoped>
@import "../../assets/css/_varible.scss";
.q-line {
  width: 100%;
  border-bottom: 1px dashed $color;
}
</style>
