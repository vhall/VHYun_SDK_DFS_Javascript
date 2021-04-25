<template>
  <div class="q-text" :class="{'preview-pc': !value.edit}">
    <div class="q-title">
      <!-- 区分编辑和预览 -->

      <div
        v-if="!value.edit"
        class="preview"
        :class="{'must':!value.edit&&value.required}"
      >{{value.title}}</div>
      <img class="preview-img" v-if="value.imgUrl&&!value.edit" :src="value.imgUrl" alt />
      <c-edit
        v-if="value.edit"
        v-model="value.title"
        :canUpload="true"
        @upload="titleupload"
        @uploadFail="titleuploadFail"
        :maxLength="50"
        :imgUrl="value.imgUrl"
      ></c-edit>
    </div>
    <div class="content">
      <c-edit
        v-if="value.edit"
        v-model="val"
        :isQues="true"
        @blur="blur"
        :isPreview="!value.edit"
        :maxLength="value.max"
      ></c-edit>
      <div class="h5-text" v-if="!value.edit">
        <div class="content">
          <c-edit
            :maxLength="50"
            :isQues="true"
            v-model="val"
            @blur="blur"
            :type="type"
            :isPreview="!value.edit"
          ></c-edit>
        </div>
        <i :class="['iconfont', icon]" @click="changeType"></i>
      </div>
    </div>
    <!-- 答题状态和有错误信息是显示 -->
    <div class="error" v-if="errorTip">{{errorTip}}</div>
  </div>
</template>

<script>
import { store, mutations } from "../../store.js";
import CEdit from "../c-edit.vue";
export default {
  props: {
    index: Number,
  },
  components: {
    CEdit
  },
  computed: {
    value() {
      return store.questionData.detail[this.index];
    }
  },
  data() {
    return {
      errorTip: "",
      val: "",
      type: "text",
      icon: "icon-ziyuan"
    };
  },
  created() {
    if (this.value.edit && this.value.answer) {
      this.val = this.value.answer;
    } else if (!this.value.edit && this.value.replys) {
      this.val = this.value.replys;
    }
  },
  methods: {
    changeType() {
      if (this.type === "text") {
        this.type = "textarea";
        this.icon = "icon-jianshao";
      } else {
        this.type = "text";
        this.icon = "icon-ziyuan";
      }
    },
    blur() {
      if (this.value.edit) {
        mutations.getTextAnswer(this.val, this.index);
      } else if ( !this.value.edit) {
        mutations.getTextRelys(this.val, this.index);
      }
    },
    titleupload(src) {
      this.errorTip = "";
      mutations.getTextTitleImgUrl(src, this.index);
    },
    titleuploadFail(msg) {
      this.errorTip = msg;
    },
    check() {
      if (this.value.required && !this.value.edit && !this.value.replys) {
        this.errorTip = "该题必填";
        return false;
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

.q-text {
  text-align: left;

  .q-title {
    margin-bottom: 10px;
  }

  .show-content {
    display: inline-block;
    height: 38px;
    line-height: 38px;
    font-size: $normal-font-size;
  }

  .error {
    margin-top: 10px;
    color: $error-color;
    font-size: $second-min-font-size;
  }

  &.preview-pc {
    .q-title {
      margin-bottom: 18px;

      .preview-img {
        max-width: 500px;
        margin: 10px 0 0;
      }

      .preview {
        font-size: 16px;
        line-height: 22px;

        &.must {
          &::after {
            content: "*";
            color: red;
          }
        }
      }
    }

    .h5-text {
      position: relative;
      width: 100%;
      display: flex;

      .content {
        flex: 1;
      }

      i {
        position: relative;
        top: 5px;
        font-size: 25px;
        margin-left: 8px;
        color: $color;
        cursor: pointer;
      }
    }

    @media screen and (max-width: 768px) {
      .q-title {
        margin: 0 0 15px 15px;

        .preview-img {
          max-width: 100%;
          margin-left: -15px;
        }
      }
    }
  }
}
</style>
