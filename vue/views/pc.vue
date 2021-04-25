<template>
  <div class="pc-preview-wrap" v-loading="isLoading">
    <div class="pc-preview">
      <div class="base-info" v-show="!isSave">
        <div class="title">{{ questionData.title }}</div>
        <div class="sub-title">{{ questionData.description }}</div>
      </div>
      <div class="line" v-show="!isSave"></div>
      <div class="q-list" v-show="!isSave">
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
          :class="{ noPage: totalPage === 0 || noPageLabel }"
        >
          <el-button @click="getPrev" v-if="noPageLabel" class="prevBtn"
            >上一页</el-button
          >
          <el-button
            type="primary"
            v-if="isSubmit && hasRes"
            @click="save"
            class="save"
            :class="{ left: totalPage === 0 && !noPageLabel }"
            >提交</el-button
          >
        </div>
      </div>
      <div class="save-succ" v-show="isSave">
        <img src="../assets/images/pc-submit.png" alt width="191" />
        <p>您已完成本次问卷，感谢您的帮助与支持～</p>
      </div>
    </div>
  </div>
</template>

<script>
import question from "../components/questionWrap.vue";
import { store, mutations } from "../store.js";
export default {
  data() {
    return {
      pageData: {},
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
      hasRes: false
    };
  },
  computed: {
    questionData() {
      return store.questionData;
    },
    isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    }
  },
  components: {
    "c-question": question
  },
  created() {
    this.isLoading = true;
    const { id, showAnswer, showAnalysis } = this.$route.query;
    if (this.isMobile) {
      this.$goRoute("/h5", {
        id: this.$route.query.id,
        appId: this.$route.query.appId,
        accountId: this.$route.query.accountId,
        token: this.$route.query.token
      });
      return;
    }
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
          this.getForm({
            id,
            showAnalysis: JSON.parse(showAnalysis),
            showAnswer: JSON.parse(showAnswer)
          });
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
      if (this.result) {
        window.form.createAnswer(
          {
            id: this.$route.query.id,
            answer: this.detail
          },
          res => {
            this.isSave = true;
            this.$message({
              showClose: true,
              message: `提交成功,id：${res.id}`,
              type: "success"
            });
          },
          err => {
            this.$message.error(err.msg);
          }
        );
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
        this.pageData = Object.assign({}, this.defaultInfo, {
          detail: this.curData
        });
        mutations.previewInit(this.pageData);
      }
    },
    getPrev() {
      this.check();
      if (this.result) {
        this.page--;
        this.curData = this.detail.filter(info => info.pageId === this.page);
        this.pageData = Object.assign({}, this.defaultInfo, {
          detail: this.curData
        });
        mutations.previewInit(this.pageData);
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
    },
    getForm(data) {
      window.form.getForm(
        data,
        res => {
          this.hasRes = true;
          // if (sessionStorage.getItem("detail")) {
          //   this.detail = JSON.parse(sessionStorage.getItem("detail"));
          // } else {
            this.detail = res.detail;
          // }
          if (this.detail.length !== 0) {
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
            this.pageData = Object.assign({}, this.defaultInfo, {
              detail: this.curData
            });
            mutations.previewInit(this.pageData);
          }
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
    },
    detail: {
      deep: true,
      handler: function(newV, oldV) {
        // console.error(newV , oldV)
        sessionStorage.setItem("detail", JSON.stringify(newV));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/_varible.scss";

.pc-preview-wrap {
  position: relative;
  width: 100%;
  background: url("../assets/images/pc-bcg.png") no-repeat;
  background-size: 100% 286px;
  padding-top: 120px;
}

.pc-preview {
  position: relative;
  width: 1066px;
  padding: 50px 80px 80px;
  margin: 0 auto;
  background-color: #fff;
  box-shadow: $box-shadow;
  border-radius: $box-shadow;

  .base-info {
    .title {
      font-size: 20px;
      color: #333;
      line-height: 28px;
    }

    .sub-title {
      margin-top: 15px;
      font-size: 16px;
      line-height: 22px;
    }
  }

  .line {
    width: 100%;
    height: 4px;
    margin-top: 30px;
    background: #1e89e4;
    border-radius: 2px;
  }

  .q-list {
    margin-top: 40px;
  }

  .option-btn {
    display: flex;
    justify-content: flex-start;
    &.noPage {
      height: 40px;
      margin-top: 30px;
    }

    /deep/ .el-button {
      position: absolute;
      bottom: 80px;
      width: 140px;
      background: #1e89e4;
      border-radius: 100px;
      font-weight: 400;
      color: #fff;
      &.prevBtn {
        left: 80px;
      }
      &.save {
        left: 240px;
        &.left {
          left: 80px;
        }
      }
      &:nth-child(1) {
        margin-right: 25px;
      }
    }
  }

  .save-succ {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 460px);
    // min-height: 600px;
    margin: 50px 0;

    p {
      margin-top: 30px;
      font-size: 16px;
    }
  }
}
</style>
