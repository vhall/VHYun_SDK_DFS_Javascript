<template>
  <div>
    <div class="create-wrap">
      <div class="control-area">
        <div class="categroys control-often-use">
          <h5 class="category">常用</h5>
          <span @click="createText($event, `name`)">姓名</span>
          <span @click="createRadio($event, `sex`)">性别</span>
          <span @click="createDate">日期/时间</span>
          <span @click="createArea">城市</span>
        </div>
        <div class="categroys control-common-use">
          <h5 class="category">通用</h5>
          <span @click="createRadio">单选</span>
          <span @click="createCheckbox">多选</span>
          <span @click="createText">文本</span>
          <span @click="createRadioMatrix">单选表格</span>
          <span @click="createCheckboxMatrix">多选表格</span>
          <span @click="chooseInStore">题库中选择</span>
        </div>
        <div class="categroys remarks">
          <h5 class="category">备注</h5>
          <span @click="createPage">分页</span>
          <span @click="createLine">分割线</span>
          <span @click="createRemark">图文备注</span>
        </div>
      </div>
      <div class="question-content">
        <div class="base-info">
          <div class="title">
            <c-edit
              :maxLength="30"
              v-model="question.title"
              :isTitle="true"
            ></c-edit>
          </div>
          <c-edit
            :maxLength="500"
            v-model="question.description"
            :isSubTitle="true"
            type="textarea"
            :isDescriptionNull="true"
          />
          <c-edit
            style="marginTop:20px;"
            :maxLength="500"
            v-model="question.extension"
            :isSubTitle="true"
            type="textarea"
            :isDescriptionNull="true"
          />
        </div>
        <div class="default-img" v-if="!this.question.detail.length">
          <img src="../assets/images/default-bgc.png" alt width="168" />
          <div>
            <i class="iconfont icon-dianjitubiao"></i>
            <span>点击题型创建问卷</span>
          </div>
        </div>
        <div class="question-info">
          <draggable
            ref="drag"
            v-model="question.detail"
            v-bind="{ handle: '.sort', animation: 200 }"
            @start="drag = true"
            @end="handleDragEnd"
          >
            <transition-group type="transition">
              <question-wrap
                v-for="(item, index) in question.detail"
                :detail="question.detail"
                @remove="remove"
                :key="`${index}${item}`"
                @copy="copyquestion"
                :value.sync="item"
                :index="index"
                @merge="mergePage"
                @copyPage="copyPage"
                @delPage="delPage"
                :totalPage="totalPage"
                :ref="`question${index}`"
              />
            </transition-group>
          </draggable>
        </div>
        <div class="save" v-if="this.question.detail.length">
          <!-- <p class="text">您已创建完成本次问卷！</p> -->
          <el-button
            v-if="!isUpdate"
            @click="save"
            :disabled="!this.question.detail.length"
            >创建表单</el-button
          >
          <el-button
            v-if="!isUpdate"
            @click="batchCreateQuestion"
            :disabled="!this.question.detail.length"
            >批量创建题目</el-button
          >
          <el-button
            v-else
            @click="updateForm"
            :disabled="!this.question.detail.length"
            >修改表单</el-button
          >
        </div>
      </div>
    </div>
    <q-store ref="choose-dialog" @add="addInStore"></q-store>
  </div>
</template>
<script>
import { types as TYPE } from "../common/contant";
import { store, mutations } from "../store";
import draggable from "vuedraggable";
import Wrap from "../components/questionWrap.vue";
import cEdit from "../components/c-edit.vue";
import Store from "../components/Store.vue";
import { EVENT } from "../common/contant";
export default {
  name: "create",
  props: {
    id: {
      type: [Number, String],
      default: ""
    }
  },
  components: {
    draggable,
    cEdit,
    "question-wrap": Wrap,
    qStore: Store
  },
  data() {
    return {
      isSaving: false,
      page: 0,
      errorTip: "",
      drag: false, // 拖动状态
      question: store.questionData,
      isUpdate: this.$route.query.isUpdate
    };
  },
  beforeCreate() {
    !window.form && this.$goRoute("/login");
  },
  created() {
    if (this.$route.query.isUpdate) {
      const { id } = this.$route.query;
      window.form.getForm({ id }, res => {
        res.detail.forEach(el => {
          el.edit = true;
          if (el.type === "matrix" && el.format === "checkbox") {
            el.row.forEach(item => {
              item.selected = [];
            });
          }
          if (el.format === "radio") {
            el.row.forEach(item => {
              item.selected = "";
            });
          }
        });

        store.questionData = res;
        this.question = store.questionData;
        this.handlePageId();
      });
    } else {
      mutations.reset();
      this.question = store.questionData;
    }
  },
  methods: {
    addQuestion: mutations.addQuestion,
    createText(e, type) {
      let data = null;
      switch (type) {
        case "name":
          data = {
            title: "请问你的姓名是什么？"
          };
          break;
        default:
          break;
      }
      this.addQuestion(mutations.getText(data));
    },
    createRadio(e, type) {
      let data = null;
      switch (type) {
        case "sex":
          data = {
            title: "你的性别是什么？",
            custom_ques:2,
            items: [
              {
                value: "男",
                key: "A",
                imgUrl: "",
                custom_opt:2,
                disabled:false 
              },
              {
                value: "女",
                key: "B",
                imgUrl: "",
                custom_opt:2,
                disabled:false 
              }
            ]
          };
          break;

        default:
          break;
      }
      this.addQuestion(mutations.getRadio(data));
    },
    createDate() {
      this.addQuestion(mutations.getDate());
    },
    createArea() {
      this.addQuestion(mutations.getArea());
    },
    createCheckbox() {
      this.addQuestion(mutations.getCheckbox());
    },
    createRadioMatrix() {
      this.addQuestion(mutations.getRadioMatrix());
    },
    createCheckboxMatrix() {
      this.addQuestion(mutations.getCheckboxMatrix());
    },
    createLine() {
      this.addQuestion(mutations.getLine());
    },
    createRemark() {
      this.addQuestion(mutations.getRemark());
    },
    handleDragEnd() {
      this.drag = false;
      this.handlePageId();
    },
    copyquestion(index) {
      // let question = this.question.detail[index];
      // let getDataMethod = this.handleQuesType(question); // 数据结构方法
      // this.addQuestion(JSON.parse(JSON.stringify(mutations[getDataMethod](question)))   );
      // this.handlePageId();
      // this.$nextTick(function() {
      //   document.documentElement.scrollTop = document.body.scrollHeight;
      // });
      const detail = this.question.detail;
      let arr = [];
      arr.push(detail[index].clone());
      this.question.detail = detail.concat(arr);
      this.handlePageId();
      this.$nextTick(function() {
        document.documentElement.scrollTop = document.body.scrollHeight;
      });
    },
    save() {
      this.checkPage();
      const details = this.question.detail;
      if (details[0].type === TYPE.PAGE) {
        this.$message.error("第一道题不应是分页题");
        return;
      }
      window.form.createForm(
        this.question,
        res => {
          this.question.title = "问卷标题";
          this.question.description = "问卷简介";
          this.question.detail = [];
          this.question.extension = "扩展信息";
          this.$message({
            message: `创建成功,id为:${res.id}`,
            type: "success"
          });
        },
        err => {
          this.$message.error("创建失败，表单校验未通过");
        }
      );
    },
    batchCreateQuestion() {
      const detail = this.question.detail;
      window.form.batchCreateQuestion(
        { detail },
        res => {
          this.$message({
            message: `创建成功`,
            type: "success"
          });
        },
        err => {
          // console.error("批量创建失败");
        }
      );
    },
    updateForm() {
      this.checkPage();
      const details = this.question.detail;
      if (details.length === 1 && details[0].type === TYPE.PAGE) {
        this.$message.error("不能只创建分页题");
        return;
      }
      window.form.updateForm(
        this.question,
        res => {
          this.question.title = "问卷标题";
          this.question.description = "问卷简介";
          this.question.detail = [];
          this.$message({
            message: `修改成功`,
            type: "success"
          });
          this.$goRoute("/login");
        },
        err => {
          console.error(err);
          this.$message.error("修改失败，表单校验未通过");
        }
      );
    },
    // 校验分页
    checkPage() {
      const detail = this.question.detail;
      const len = detail.length;

      if (len < 2) {
        return;
      }

      for (let i = 0; i < len - 1; i++) {
        let item = detail[i];
        let nextItem = detail[i + 1];
        if (item.type === TYPE.PAGE && nextItem.type === TYPE.PAGE) {
          this.$message.error("不可连续添加分页");
          break;
        }
      }
    },
    remove(id) {
      this.question.detail.splice(id, 1);
      this.handlePageId();
    },
    mergePage(index) {
      this.question.detail.splice(index, 1);
      this.handlePageId();
    },
    createPage() {
      const detailArr = this.question.detail;
      if (detailArr.length === 0) {
        this.$message.error("请先添加题目");
        return;
      }
      if (detailArr[detailArr.length - 1].type === TYPE.PAGE) {
        this.$message.error("不可连续添加分页");
        return;
      }
      this.page++;
      this.addQuestion(mutations.getPage(this.page));
      this.handlePageId();
    },
    delPage(pageId) {
      // 过滤出删除后的数组
      const curData = this.question.detail.filter(
        info => info.pageId !== pageId
      );
      this.question.detail = curData;
      this.handlePageId();
    },
    copyPage(pageId) {
      const detail = this.question.detail;
      const curData = detail.filter(info => info.pageId === pageId);

      let arr = [];
      curData.forEach(item => {
        // console.error(item, item.clone());
        arr.push(item.clone());
      });

      this.question.detail = detail.concat(arr);
      this.handlePageId();
    },
    chooseInStore() {
      this.$refs["choose-dialog"].show();
    },
    addInStore(data) {
      if (data.type === TYPE.MATRIX && !data.format) {
        this.$message.error("数据格式错误");
        return;
      }
      if (data.type === TYPE.SCANTRON) {
        this.$message.error("暂不支持该题型");
        return;
      }
      const question = this.handleQuesType(data);
      this.addQuestion(mutations[question](data));
      this.handlePageId();
      this.$refs["choose-dialog"].hide();
    },
    handlePageId() {
      // 给所有题添加pageId，用于区分第几页
      const detail = this.question.detail;
      let tempPage = 0;
      for (let i = 0; i < detail.length; i++) {
        let info = detail[i];
        this.$set(info, "pageId", tempPage);
        info.pageId = tempPage;
        if (info.type === "page") {
          tempPage += 1;
        }
      }
    },
    handleQuesType(data) {
      // 不是点击控件添加题型时根据type值来判断
      let type = data.type;
      let t = "get" + data.type.charAt(0).toUpperCase() + data.type.slice(1);
      if (type === "matrix") {
        if (data.format === "radio") {
          t = "getRadioMatrix";
        } else if (data.format === "checkbox") {
          t = "getCheckboxMatrix";
        }
      }
      return t;
    }
  },
  computed: {
    totalPage() {
      let total = 0;
      this.question.detail.forEach(el => {
        if (el.type === "page") {
          total += 1;
        }
      });
      return total;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/_varible.scss";

.create-wrap {
  margin: auto;
  display: flex;
  width: 1200px;
  padding-top: 20px;

  .control-area {
    position: fixed;
    // width: 100px;
    margin-right: 20px;
    padding: 0 30px;
    box-shadow: $box-shadow;
    border-radius: $box-radius;
    background: #fff;
    height: 800px;
    overflow-y: scroll;
    /* 定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background-color: rgba(240, 240, 240, 1);
    }
    /*定义滚动条轨道 内阴影+圆角*/
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
      border-radius: 10px;
      background-color: rgba(240, 240, 240, 0.5);
    }

    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
      background-color: rgba(240, 240, 240, 0.5);
    }
    .categroys {
      padding: 30px 0;
      border-bottom: 1px dashed $color;
      overflow: hidden;

      .category {
        margin: 0px 0 15px;
        color: $normal-color;
        line-height: 22px;
        text-align: left;
        font-size: $normal-font-size;
        font-weight: 400;
      }

      &.remarks {
        border-bottom: none;
      }

      span {
        display: block;
        width: 100px;
        height: 36px;
        margin-bottom: 10px;
        color: $color;
        line-height: 36px;
        font-size: $second-min-font-size;
        border: 1px solid $color;
        box-sizing: border-box;
        border-radius: $box-radius;
        cursor: pointer;

        &:last-child {
          margin-bottom: 0px;
        }

        &:hover {
          color: $hover-color;
          border-color: #fff;
          box-shadow: $box-shadow;
          border-radius: 4px 0px 4px 4px;
        }
      }
    }
  }

  .default-img {
    width: 100%;
    padding: 30px 0;
    margin: 20px 0;
    font-size: 16px;
    border: 2px dashed #e2e2e2;
    border-radius: 4px;
    text-align: center;

    img {
      margin: 18px 0 30px;
    }

    i {
      font-size: 20px;
    }

    span {
      margin-left: 5px;
    }
  }

  .question-content {
    margin-left: 190px;
    width: calc(100% - 120px);
    flex-grow: 1;

    .base-info {
      padding: 15px 30px;
      text-align: left;
      box-shadow: $box-shadow;
      border-radius: 4px;
      background: #fff;

      .title {
        margin-bottom: 15px;
      }
    }
  }

  .save {
    margin: 20px 0 50px;
    padding: 65px 0;
    background: #fff;
    border-radius: 4px;
    box-shadow: $box-shadow;

    .text {
      font-size: 16px;
      color: #555;
      line-height: 22px;
      margin: 0;
    }

    .el-button {
      width: 140px;
      margin-top: 50px;
      background: $color;
      color: #fff;
      border-radius: 100px;
      font-size: 16px;
      font-weight: 400;
    }
  }
}
</style>
