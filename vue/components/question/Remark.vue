<template>
  <div class="q-remark" :class="{'preview-pc': !value.edit}">
    <c-edit
      v-if="value.edit"
      v-model="value.title"
      :canUpload="true"
      @upload="upload"
      :imgUrl="value.imgUrl"
      @uploadFail="uploadFail"
    ></c-edit>
    <div v-if="!value.edit">{{value.title}}</div>
    <img v-if="!value.edit&&value.imgUrl" :src="value.imgUrl" alt />
    <div class="error" v-if="errorTip">{{errorTip}}</div>
  </div>
</template>

<script>
import CEdit from "../c-edit.vue";
import { store, mutations } from "../../store.js";
export default {
  components: {
    CEdit
  },
  props: {
    index: Number
  },
  data() {
    return {
      errorTip: ""
    };
  },
  computed: {
    value() {
      return store.questionData.detail[this.index];
    }
  },
  methods: {
    check() {
      // 上传图片失败问题
      if (!this.value.title) {
        this.errorTip = "备注标题不能为空";
        return;
      } else {
        this.errorTip = "";
        return true;
      }
    },
    upload(src) {
      this.errorTip = "";
      mutations.getRemarkUrl(src, this.index);
    },
    uploadFail(msg) {
      this.errorTip = msg;
    }
  }
};
</script>

<style lang="scss" scoped>
.q-remark {
  width: 100%;
  text-align: left;
  font-size: 16px;
  line-height: 22px;
  .error {
    margin-top: 10px;
    font-size: 12px;
    color: red;
    text-align: left;
    line-height: 20px;
  }
  &.preview-pc {
    img {
      margin-top: 10px;
      width: 100%;
      max-width: 100%;
    }
    @media screen and(max-width: 768px) {
      img {
        max-width: 100%;
      }
    }
  }
}
</style>
