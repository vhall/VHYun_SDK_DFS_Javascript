<template>
  <div class="container" v-loading="loading">
    <div class="login-box">
      <h1 style="font-size:25px;">表单SDK</h1>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="appId">
          <el-input v-model="form.appId" placeholder="appId"></el-input>
        </el-form-item>
        <el-form-item label="accountId">
          <el-input v-model="form.accountId" placeholder="accountId"></el-input>
        </el-form-item>
        <el-form-item label="token">
          <el-input v-model="form.token" placeholder="token"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="创建问卷" value="create" checed></el-option>
            <el-option label="回答问卷" value="answer"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="textAlign:left">
          <el-button type="primary" @click="onSubmit">初始化问卷</el-button>
        </el-form-item>
      </el-form>

      <el-dialog :visible.sync="dialogVisible" @opened="getFormList">
        <div class="dialog-header">
          <h5>选择问卷</h5>
        </div>
        <div class="body">
          <div class="search">
            <el-input :placeholder="searchPlaceholder" v-model="keyword" class="input-with-select" @input="onInput">
              <el-select v-model="select" slot="prepend" @change="selectChange" placeholder="请选择">
                <el-option label="id" value="id"></el-option>
                <el-option label="title" value="title"></el-option>
                <el-option label="extension" value="extension"></el-option>
              </el-select>
              <el-button type="primary" slot="append" class="search-btn" @click="onSearch">搜索</el-button>
            </el-input>
          </div>
          <el-table
            :data="tableData"
            class="table"
            ref="table"
            cell-class-name="table-cell"
            header-cell-class-name="table-head-cell"
          >
            <el-table-column label="问卷ID" prop="id" align="center" min-width="50"></el-table-column>
            <el-table-column
              label="问卷标题"
              prop="title"
              align="center"
              min-width="100"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="操作" align="center" min-width="150">
              <template slot-scope="{ row }">
                <!-- <el-button type="text"> -->
                <a
                  v-bind:href="
                    `${toAnswerUrl}?id=${row.id}&appId=${form.appId}&accountId=${form.accountId}&token=${
                      form.token
                    }&showAnswer=${row.showAnswer}&showAnalysis=${row.showAnalysis}`
                  "
                  style="color:#1e89e4;text-decoration:none;margin-right:10px;"
                  target="_blank"
                  >去答题</a
                >
                <!-- </el-button> -->
                <el-button type="text" @click="toUpdate(row)">修改</el-button>
                <el-button type="text" @click="deleteForm(row)">删除</el-button>
                <el-button type="text" @click="getAnswerList(row)">答卷列表</el-button>
                <div>显示答案：<el-switch v-model="row.showAnswer"></el-switch></div>
                <div>显示解析：<el-switch v-model="row.showAnalysis"></el-switch></div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-wrapper" v-if="pagination">
          <el-pagination
            background
            :total="pagination['total']"
            @current-change="currentChange"
            :page-size="pageSize"
            layout="prev, pager, next"
          ></el-pagination>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="answerListVisible">
        <div class="dialog-header">
          <h5>答卷列表</h5>
        </div>
        <div class="body">
          <el-table :data="answerTable" style="width: 100%">
            <el-table-column label="答卷id" prop="id" width="180"> </el-table-column>
            <el-table-column label="答题用户" prop="userId"></el-table-column>
            <el-table-column label="答题时间" prop="createDate"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="value">
                <el-button type="text" @click="getAnswer(value.row)">查看答卷信息</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <el-drawer title="答卷信息" :visible.sync="answerDrawer" :with-header="false">
        <div class="drawer-content">
          <el-row>
            <el-col :span="12" class="title">答题数量</el-col>
            <el-col :span="12" class="value">{{ answerForm.answerNum }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="title">正确答案数量</el-col>
            <el-col :span="12" class="value">{{ answerForm.rightNum }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="title">答卷得分</el-col>
            <el-col :span="12" class="value">{{ answerForm.naireScore }}</el-col>
          </el-row>
          <div class=""></div>
          <el-row>
            <el-col :span="24" class="title">得分信息</el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="value">
              <el-table :data="answerForm.questions" style="width: 100%">
                <el-table-column label="id" prop="id" />
                <el-table-column label="答案" prop="answer" />
                <el-table-column label="其它" prop="custom_val" />
                <el-table-column label="分数" prop="score" />
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-drawer>
    </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data() {
    return {
      select: 'id',
      searchPlaceholder: `请输入要搜索的id`,
      nowFormId: '',
      isLogin: false,
      dialogVisible: false,
      answerListVisible: false,
      answerDrawer: false,
      tableData: [],
      answerTable: [],
      pageSize: 5,
      currentPage: 1,
      pagination: null,
      form: {
        appId: 'd317f559',
        accountId: `form_${Math.floor(1000 + Math.random() * 9000)}`,
        token: 'access:d317f559:b3acfa862ae09232',
        type: 'create'
      },
      answerForm: {
        answerNum: '', //答题数量
        rightNum: '', // 正确答案数量
        naireScore: '', // 答卷得分
        answerTable: [],
        questionsTable: []
      },
      loading: false,
      keyword: ''
    }
  },
  computed: {
    toAnswerUrl() {
      const href = window.document.location.href
      let url = href.split('//')[0] + '//'
      const urlArr = href
        .split('//')[1]
        .split('/')
        .splice(0, window.location.href.split('//')[1].split('/').length - 1)

      for (var i in urlArr) {
        url += ''.concat(urlArr[i], '/')
      }
      url = url + 'pc'
      return url
    }
  },
  methods: {
    onInput() {
      this.getFormList()
    },
    onSearch() {
      this.keyword && this.getFormList()
    },
    onSubmit() {
      this.loading = true
      VhallForm.createInstance(
        {
          appId: this.form.appId,
          accountId: this.form.accountId,
          token: this.form.token
        },
        res => {
          window.form = res.interface
          this.loading = false
          if (this.form.type === 'create') {
            this.$goRoute('/create')
          } else {
            this.dialogVisible = true
          }
        },
        err => {
          this.loading = false
          this.$message.error(err.msg)
        }
      )
    },
    selectChange(res) {
      this.searchPlaceholder = `请输入要搜索的${res}`
    },
    toAnwser(data) {
      const { id, showAnalysis, showAnswer } = data
      this.$goRoute('/pc', {
        id,
        showAnswer,
        showAnalysis,
        appId: this.form.appId,
        accountId: this.form.accountId,
        token: this.form.token
      })
    },
    toUpdate(data) {
      const { id, showAnalysis, showAnswer } = data
      this.$goRoute('/create', {
        id,
        // showAnswer,
        // showAnalysis,
        isUpdate: true
      })
    },
    currentChange(current) {
      this.currentPage = current
      this.getFormList(this.keyword)
    },
    getFormList() {
      let params = {
        pageSize: this.pageSize,
        currPage: this.currentPage
      }
      params[this.select] = this.keyword
      window.form.getFormList(
        params,
        res => {
          const data = []
          for (const key in res.detail) {
            if (res.detail.hasOwnProperty(key)) {
              const item = res.detail[key]
              item['showAnswer'] = true
              item['showAnalysis'] = true
              data[key] = item
            }
          }
          // this.tableData = res.detail;
          this.tableData = data

          this.pagination = {
            total: res.total
          }
        },
        e => {
          this.$message.error(e.msg)
        }
      )
    },
    deleteForm(data) {
      const { id } = data
      window.form.deleteForm(
        { id },
        res => {
          this.$message({
            message: `删除成功`,
            type: 'success'
          })
          this.getFormList(this.keyword)
        },
        err => {
          this.$message.error(err.msg)
        }
      )
    },
    getAnswerList(data) {
      const { id } = data
      this.nowFormId = id
      this.answerListVisible = true
      window.form.getAllAnswer(
        {
          id
        },
        res => {
          const data = []
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              const item = res[key]
              data.push({
                id: key,
                userId: item.third_party_user_id,
                createDate: item.created_at
              })
            }
          }
          this.answerTable = data
          // console.error(res);
        },
        err => {
          // console.error(err);
        }
      )
    },
    getAnswer(data) {
      const answerId = data.id
      const id = this.nowFormId
      this.answerDrawer = true
      window.form.getAnswer(
        { id, answerId },
        res => {
          this.answerForm = res
        },
        err => {
          // console.error(err);
          this.$message.error(err.msg)
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/_varible.scss';
@import '../assets/css/cover-ele-style.scss';

.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #f0f2f5;
  .login-box {
    padding: 0 30px;
    box-shadow: $box-shadow;
    border-radius: $box-radius;
    background: #fff;
  }
}
.drawer-content {
  padding: 0 30px;
  .el-row {
    margin-bottom: 15px;
  }
  .title {
    color: rgb(96, 98, 102);
    font-size: 14px;
    text-align: center;
  }
  .value {
    color: rgb(96, 98, 102);
    font-size: 14px;
    text-align: center;
  }
}

/deep/.el-dialog--center {
  width: 891px;
  background: #f3f4f8;
  border-radius: $box-radius !important;
}

/deep/.el-dialog__header {
  padding: 0;
  background: #fff;
  border-top-left-radius: $box-radius;
  border-top-right-radius: $box-radius;
}

/deep/.el-dialog__body {
  padding: 0 !important;
}

.dialog-header {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 0;
  background: #fff;

  h5 {
    text-align: center;
    width: 100%;
    font-size: 16px;
    color: #555;
  }

  span {
    position: absolute;
    right: 20px;
    cursor: pointer;
  }

  .icon-danchuangguanbianniu:hover {
    color: $hover-color;
  }
}

.body {
  padding: 20px 40px;
}

/deep/ .el-pagination.is-background .el-pager li,
/deep/ .el-pagination.is-background .btn-prev,
/deep/ .el-pagination.is-background .btn-next {
  background: #fff;
  color: #999;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding-bottom: 30px;
}

.search {
  display: inline-flex;
  align-items: center;
  box-shadow: $box-shadow;
  border-radius: $box-radius;
  background: #fff;
  width: 100%;
  .el-input {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    .el-select {
      width: 130px;
      border: 0;
    }
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .search-btn {
    color: #fff;
  }
  i {
    font-size: 17px;
    padding: 0 20px;
    color: #c0c0c0;
  }

  /deep/ .el-input {
    // width: 350px;

    /deep/ .el-input__inner {
      border: none;
      outline: none;
      // padding-left: 0;
      text-align: center;
    }
  }

  /deep/ .el-button {
    background: $color;
    font-size: 14px;
    line-height: 20px;
    width: 0px;
    width: 68px;
    padding: 10px 20px;
    border: none;
  }
}

@include cover-table();

.table {
  margin-top: 20px;

  .el-button--text {
    color: #1e89e4;
  }
}
</style>
