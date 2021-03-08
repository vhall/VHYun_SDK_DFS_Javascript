<template>
  <div class="preview-h5" v-loading="isLoading">
    <img src="../assets/images/h5-bcg.png" alt />
    <div class="content" v-show="!isSave">
      <div class="title">{{questionData.title}}</div>
      <div class="sub-title">{{questionData.description}}</div>
      <c-question
        v-for="(item, index) in questionData.detail"
        :detail="questionData.detail"
        :key="item.aIndex"
        :value.sync="item"
        :index="index"
        @getNext="getNext"
        @getPrev="getPrev"
        :finalPage="nextPageBtn"
        :firstPage="prevPageBtn"
        :ref="`q${item.aIndex}`"
      ></c-question>
      <div
        class="option-btn"
        v-if="noPageLabel || isSubmit"
        :class="{'noPage': totalPage === 0 || noPageLabel, 'left': totalPage !== 0&& !noPageLabel}"
      >
        <el-button @click="getPrev" v-if="noPageLabel" class="prevBtn">上一页</el-button>
        <el-button
          type="primary"
          v-if="isSubmit&&hasRes"
          @click="save"
          class="save"
          :class="{'left': !noPageLabel}"
        >提交</el-button>
      </div>
    </div>

    <div class="save-succ" v-show="isSave">
      <img src="../assets/images/h5-submit.png" alt />
      <p>您已完成本次问卷，感谢您的帮助与支持～</p>
    </div>
  </div>
</template>

<script>
import question from "../components/questionWrap.vue";
import { store, mutations } from "../store.js";
export default {
  data() {
    return {
      pageData: new Map(),
      page: 0, // 当前在第几页
      detail: [],
      nextPageBtn: true, // 是否是最后一页
      prevPageBtn: true, // 是否是第一页
      noPageLabel: false, // 当最后一道题不是分页时，显示上一页
      isSubmit: true,
      result: false,
      curData: [],
      totalPage: 0,
      keys: [],
      defaultInfo: {},
      isLoading: false,
      isSave: false,
      hasRes:false
    };
  },
  computed: {
    questionData() {
      return store.questionData;
    }
  },
  components: {
    "c-question": question
  },
  created() {

    this.isLoading = true;
    if (
      this.$route.query.appId &&
      this.$route.query.accountId &&
      this.$route.query.token
    ) {
      VhallForm.createInstance(
        {
          appId: this.$route.query.appId,
          accountId: this.$route.query.accountId,
          token: this.$route.query.token
        },
        res => {
          this.isLoading = false;
          window.form = res.interface;
          this.getForm(this.$route.query.id);
        },
        err => {
          this.isLoading = false;
        }
      );
    } else {
      this.isLoading = false;
      this.$goRoute("/login");
    }
  },
  methods: {
    save() {
      this.check();
      let option = {
        id: this.$route.query.id,
        answer: this.detail
      };
      let success = res => {
        this.isSave = true;
      };
      let fail = e => {
        console.log(e);
      };
      if (this.result) {
        window.form.createAnswer(option, success, fail);
      }
    },
    check() {
      this.keys = [];
      this.result = true;
      let data = {};
      this.keys = Object.keys(this.$refs);
      const size = this.keys.length;
      let curRefs = [];
      for (let key in this.$refs) {
        if (this.$refs[`${key}`].length) {
          curRefs.push(this.$refs[`${key}`]);
        }
      }
      for (let i = 0, len = curRefs.length; i < len; i++) {
        let _data = curRefs[i][0].check();
        if (!_data) {
          this.result = false;
          break;
        }
      }
    },
    getNext() {
      this.check();
      if (this.result) {
        this.page++;
        this.curData = this.detail.filter(info => info.pageId === this.page);
        mutations.previewInit({ ...this.defaultInfo, detail: this.curData });
      }
    },
    getPrev() {
      this.check();
      if (this.result) {
        this.page--;
        this.curData = this.detail.filter(info => info.pageId === this.page);
        mutations.previewInit({ ...this.defaultInfo, detail: this.curData });
      }
    },
    handlerData() {
      let tempPage = 0;
      for (let i = 0; i < this.detail.length; i++) {
        let info = this.detail[i];
        info.pageId = tempPage;
        if (info.type === "page") {
          tempPage += 1;
        }
      }
      this.totalPage = this.detail[this.detail.length - 1].pageId;
    },
    handerBtn(cur) {
      if (this.totalPage === 0) {
        this.prevPageBtn = false;
        this.nextPageBtn = false;
        this.noPageLabel = false;
        this.isSubmit = true;
      } else {
        if (this.page === 0) {
          this.prevPageBtn = false;
          this.nextPageBtn = true;
          this.noPageLabel = false;
          this.isSubmit = false;
        } else if (this.page > 0 && this.page < this.totalPage) {
          this.prevPageBtn = true;
          this.nextPageBtn = true;
          this.noPageLabel = false;
          this.isSubmit = false;
        } else if ((this.page = this.totalPage)) {
          if (this.detail[this.detail.length - 1].type === "page") {
            // 最后一页是分页
            this.nextPageBtn = false;
            this.prevPageBtn = true;
            this.noPageLabel = false;
            this.isSubmit = true;
          } else {
            this.nextPageBtn = false;

            this.noPageLabel = true;
            this.isSubmit = true;
          }
        }
      }

      // console.error(this.isSubmit)
    },
    getForm(id) {
      window.form.getForm(
        {
          id
        },
        res => {
          this.hasRes = true;
          this.detail = res.detail;
          let i = 1;
          this.detail.forEach((el, index) => {
            if (
              el.type !== "page" &&
              el.type !== "remark" &&
              el.type !== "line"
            ) {
              el.idx = i++;
            }
            el.aIndex = index;
          });
          this.handlerData();
          this.curData = this.detail.filter(info => info.pageId === 0);
          this.handerBtn();
          this.defaultInfo = {
            app_id: res.app_id,
            created_at: res.created_at,
            description: res.description,
            finishTime: res.finishTime,
            id: res.id,
            imgUrl: res.imgUrl,
            publish: res.publish,
            start_time: res.start_time,
            third_party_user_id: res.third_party_user_id,
            title: res.title,
            updated_at: res.updated_at
          };
          mutations.previewInit({
            ...this.defaultInfo,
            detail: this.curData
          });
        },
        e => {
          console.log(e);
        }
      );
    }
  },
  watch: {
    page(val) {
      this.handerBtn();
    }
  }
};
</script>


<style lang="scss" scoped>
.preview-h5 {
  min-height: 100vh;
  width: 100%;
  background: #fff;

  img {
    width: 100%;
  }

  .content {
    position: relative;
    padding: 36px 5% 40px;

    .title {
      font-size: 20px;
      line-height: 28px;
      color: #333;
      font-weight: 500;
    }

    .sub-title {
      margin-top: 8px;
      font-size: 14px;
      line-height: 20px;
      color: #555;
    }
  }

  .option-btn {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    &.noPage {
      height: 40px;
    }
    &.left {
      width: 44%;
      position: absolute;
      right: 0;
      // padding: 0 5%;
      bottom: 40px;
      margin-right: 5%;
      justify-content: flex-end;
      /deep/ .el-button {
        width: 100%;
      }
    }

    /deep/ .el-button {
      width: 49%;
      background: #1e89e4;
      border-radius: 4px;
      font-weight: 400;
      color: #fff;
    }
  }

  .save-succ {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // margin: 50px 0;
    height: calc(100vh - 203px);

    img {
      width: 175px;
      margin-bottom: 20px;
    }
  }
}
</style>
