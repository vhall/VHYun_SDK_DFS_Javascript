import Vue from 'vue'

export let store = Vue.observable({
  questionData: {
    id: null,
    title: '标题', // 表单标题
    description: '问卷简介',
    imgUrl: null,
    publish: false,
    detail: [],
    extension: '扩展信息'
    // max: 100
  },
  keyArr: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']
})

export const mutations = {
  addQuestion(data) {
    // if (store.questionData.detail.length < store.questionData.max) {
    store.questionData.detail.push(data)
    // }
  },
  // 获取问答数据结构
  getText(data) {
    let text = new VhallForm.TextInfo()
    if (data) {
      for (let key in data) {
        text[key] = data[key]
      }
    } else {
      text.title = '文本题'
    }
    text.min = 1
    text.max = 50
    text.edit = true
    return text
  },
  // 获取日期/时间数据结构
  getDate(data) {
    let date = new VhallForm.DateInfo()
    if (data) {
      for (let key in data) {
        date[key] = data[key]
      }
    } else {
      date.title = '请选择您的时间'
      date.format = 'Y-m-d H:i:s'
    }
    date.edit = true
    return date
  },
  // 获取城市数据结构
  getArea(data) {
    let area = new VhallForm.AreaInfo()
    if (data) {
      for (let key in data) {
        area[key] = data[key]
      }
    } else {
      area.title = '地区选择题'
      area.level = 'address'
    }
    area.edit = true
    return area
  },
  // 单选数据结构
  getRadio(data) {
    let radio = new VhallForm.RadioInfo()
    if (data) {
      for (let key in data) {
        radio[key] = data[key]
      }
    } else {
      radio.title = '单选题'
      radio.custom_ques = 2
      radio.items = [
        {
          value: '选项',
          key: 'A',
          imgUrl: '',
          custom_opt: 2,
          disabled: false
        },
        {
          value: '选项',
          key: 'B',
          imgUrl: '',
          custom_opt: 2,
          disabled: false
        }
      ]
    }
    radio.edit = true
    return radio
  },
  // 获取多选数据结构
  getCheckbox(data) {
    let checkbox = new VhallForm.CheckBoxInfo()
    if (data) {
      for (let key in data) {
        checkbox[key] = data[key]
      }
    } else {
      checkbox.title = '多选题'
      checkbox.custom_ques = 2
      checkbox.items = [
        {
          value: '选项1',
          key: 'A',
          imgUrl: '',
          custom_opt: 2,
          disabled: false
        },
        {
          value: '选项2',
          key: 'B',
          imgUrl: '',
          custom_opt: 2,
          disabled: false
        },
        {
          value: '选项3',
          key: 'C',
          imgUrl: '',
          custom_opt: 2,
          disabled: false
        },
        {
          value: '选项4',
          key: 'D',
          imgUrl: '',
          custom_opt: 2,
          disabled: false
        }
      ]
      checkbox.min = 2
      checkbox.max = 10
    }
    checkbox.edit = true
    // console.log(checkbox)
    return checkbox
  },
  // 获取单选表格数据结构
  getRadioMatrix(data) {
    let matrix = new VhallForm.MatrixInfo()
    if (data) {
      for (let key in data) {
        matrix[key] = data[key]
      }
      matrix.column.forEach(el => {
        el.isenter = false
      })
      matrix.row.forEach(el => {
        el.isenter = false
      })
    } else {
      matrix.title = '表格'
      matrix.column = [
        {
          value: '列1',
          isenter: false
        },
        {
          value: '列2',
          isenter: false
        }
      ]
      matrix.row = [
        {
          value: '行1',
          isenter: false
        },
        {
          value: '行2',
          isenter: false
        }
      ]
    }
    matrix.format = 'radio'
    matrix.edit = true

    return matrix
  },
  // 获取多选表格
  getCheckboxMatrix(data) {
    let matrix = new VhallForm.MatrixInfo()
    if (data) {
      for (let key in data) {
        matrix[key] = data[key]
      }
      matrix.column.forEach(el => {
        el.isenter = false
      })
      matrix.row.forEach(el => {
        ;(el.isenter = false), (el.selected = [])
      })
    } else {
      matrix.title = '表格'
      matrix.column = [
        {
          value: '列1',
          isenter: false
        },
        {
          value: '列2',
          isenter: false
        }
      ]
      matrix.row = [
        {
          value: '行1',
          isenter: false,
          selected: []
        },
        {
          value: '行2',
          isenter: false,
          selected: []
        }
      ]
    }
    matrix.format = 'checkbox'
    matrix.edit = true
    return matrix
  },
  // 分页
  getPage(data) {
    let page = new VhallForm.PageInfo()
    if (typeof data === 'object') {
      // 从题库中添加的分页数据
      for (let key in data) {
        page[key] = data[key]
      }
    } else {
      page.title = '分页'
    }
    page.edit = true
    return page
  },
  // 获取分割线数据结构
  getLine(data) {
    let line = new VhallForm.LineInfo()
    if (data) {
      for (let key in data) {
        line[key] = data[key]
      }
    } else {
      line.title = '分割线'
    }
    line.edit = true
    return line
  },
  // 获取备注数据结构
  getRemark(data) {
    let remark = new VhallForm.RemarkInfo()
    if (data) {
      for (let key in data) {
        remark[key] = data[key]
      }
    } else {
      remark.title = '图文备注'
    }
    remark.edit = true
    return remark
  },
  // 文本------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // 获取文本题正确答案
  getTextAnswer(data, idx) {
    store.questionData.detail[idx].answer = data
    // store.questionData.detail[idx].answer = data
  },
  // 获取文本题答题答案
  getTextRelys(data, idx) {
    store.questionData.detail[idx].replys = data
  },
  // 文本题图片
  getTextTitleImgUrl(url, idx) {
    store.questionData.detail[idx].imgUrl = url
  },
  // 单选------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // 1. 添加选项
  addItems(idx, isOther = false) {
    // const keyArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']
    // console.log(store.questionData.detail[idx].items)
    let obj = {
      value: isOther ? `自定义` : `选项`,
      key: store.keyArr[store.questionData.detail[idx].items.length],
      imgSrc: '',
      custom_opt: isOther ? 1 : 2,
      disabled: false
    }
    store.questionData.detail[idx].items.push(obj)
    store.questionData.detail[idx].custom_ques = isOther ? 1 : 2
    for (const iterator of store.questionData.detail[idx].items) {
      if (iterator.custom_opt == 1) {
        store.questionData.detail[idx].custom_ques = 1
        break
      }
    }
  },
  // 获取正确答案
  getRadioAnswer(answer, idx) {
    store.questionData.detail[idx].correctIndex = answer
  },
  // 获取答题答案
  getRaidoReplys(reply, idx) {
    store.questionData.detail[idx].replys = reply
  },
  // 删除选项
  delRaidoItems(selectIndex, idx, callback) {
    if (selectIndex === store.questionData.detail[idx].correctIndex) {
      callback()
      // 当删除的是正确打枊时，清空corrextIndex
      store.questionData.detail[idx].correctIndex = -1
    }
    store.questionData.detail[idx].items.splice(selectIndex, 1)
    // 删除选项后更改删除选项后所有的key及value值，防止再生成的value值和上次选项值一样
    store.questionData.detail[idx].items.forEach((el, index) => {
      if (index >= selectIndex) {
        console.log(index, selectIndex)

        el.key = store.keyArr[index]
      }
    })
    let temp = 2
    for (const iterator of store.questionData.detail[idx].items) {
      if (iterator.custom_opt == 1) {
        temp = 1
        break
      }
    }
    store.questionData.detail[idx].custom_ques = temp
    console.log(store.questionData.detail[idx])
  },
  // 获取单选题目title imgUrl
  getRadioTitleImgUrl(src, idx) {
    store.questionData.detail[idx].imgUrl = src
  },
  // 单选题选项上传图片url
  getRadioItemsUrl(src, index, idx) {
    store.questionData.detail[idx].items[index].imgUrl = src
  },
  // 时间------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // 时间题目 title url
  getDateTitleUrl(src, idx) {
    store.questionData.detail[idx].imgUrl = src
  },
  getDateFormat(fmt, idx) {
    store.questionData.detail[idx].format = fmt
  },
  getDateReplys(reply, idx) {
    store.questionData.detail[idx].replys = reply
  },

  // 城市------------------------------------------------------------------------------------------------------------------------------------------------------------------
  getAreaLevel(level, idx) {
    store.questionData.detail[idx].level = level
  },
  getAreaReply(val, index, idx) {
    store.questionData.detail[idx].replys[index] = val
  },
  getAreaTitleUrl(src, idx) {
    store.questionData.detail[idx].imgUrl = src
  },
  // 多选------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // 添加选项
  addCheckboxItem(idx, isOther = false) {
    const len = store.questionData.detail[idx].items.length
    // console.log(len)
    let obj = {
      value: isOther ? '自定义' : `选项${len + 1}`,
      key: store.keyArr[len],
      imgSrc: '',
      custom_opt: isOther ? 1 : 2,
      disabled: false
    }
    store.questionData.detail[idx].items.push(obj)
    store.questionData.detail[idx].custom_ques = isOther ? 1 : 2
    for (const iterator of store.questionData.detail[idx].items) {
      if (iterator.custom_opt == 1) {
        store.questionData.detail[idx].custom_ques = 1
        break
      }
    }
  },
  // 获取正确答案
  getCheckboxAnswer(val, idx) {
    store.questionData.detail[idx].correctIndex = val
  },
  // 获取答题答案
  getCheckboxReplys(reply, idx) {
    store.questionData.detail[idx].replys = reply
  },
  delCheckboxItem(index, idx) {
    store.questionData.detail[idx].items.splice(index, 1)
    let temp = 2
    for (const iterator of store.questionData.detail[idx].items) {
      if (iterator.custom_opt == 1) {
        temp = 1
        break
      }
    }
    store.questionData.detail[idx].custom_ques = temp
  },
  getCheckboxTitleUrl(src, idx) {
    store.questionData.detail[idx].imgUrl = src
  },
  getCheckboxItemsUrl(src, index, idx) {
    // this.$set(store.questionData.detail[idx].items[index], 'imgUrl', src)
    store.questionData.detail[idx].items[index].imgUrl = src
  },
  //  表格  ------------------------------------------------------------------------------------------------------------------------------------------------------------------
  getMatrixTitleUrl(src, idx) {
    store.questionData.detail[idx].imgUrl = src
  },
  addMatrixRow(idx, rowIndex) {
    let obj = {
      value: `行${rowIndex}`,
      isenter: false,
      selected: store.questionData.detail[idx].format === 'radio' ? '' : []
    }
    store.questionData.detail[idx].row.push(obj)
  },
  addMatrixCol(idx, colIndex) {
    let obj = {
      value: `列${colIndex}`,
      isenter: false
    }
    store.questionData.detail[idx].column.push(obj)
  },
  // 删除
  del(index, type, idx) {
    // this.value[type].splice(index, 1)
    store.questionData.detail[idx][type].splice(index, 1)
    mutations.martixMouseleave(index, type, idx)
  },
  // 向右/下移动
  increase(index, type, idx) {
    let value = store.questionData.detail[idx]
    let next = value[type][index + 1]
    value[type][index + 1] = value[type][index]
    value[type][index] = next
    value[type][index].isenter = false
    mutations.martixMouseleave(index, type, idx)
  },
  // 向上/左移动
  reduce(index, type, idx) {
    let value = store.questionData.detail[idx]
    let prev = value[type][index - 1]
    value[type][index - 1] = value[type][index]
    value[type][index] = prev
    // console.log(value[type][index - 1])
    // console.log(value[type][index])
    mutations.martixMouseleave(index, type, idx)
  },
  martixMouseenter(index, type, idx) {
    let value = store.questionData.detail[idx]
    value[type].forEach(el => {
      el.isenter = false
    })
    value[type][index].isenter = true
  },
  martixMouseleave(index, type, idx) {
    let value = store.questionData.detail[idx]
    value[type].forEach(el => {
      el.isenter = false
    })
  },
  getMartixAnswer(answer, idx) {
    let value = store.questionData.detail[idx]
    value.answer = answer
  },
  getMartixReplys(reply, idx) {
    let value = store.questionData.detail[idx]
    value.replys = reply
  },
  //  备注  ------------------------------------------------------------------------------------------------------------------------------------------------------------------
  getRemarkUrl(src, idx) {
    store.questionData.detail[idx].imgUrl = src
  },
  //  答题  ------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // 答题时pc/h5初始化
  previewInit(data) {
    store.questionData = data
    store.questionData.detail.forEach(el => {
      if (el.edit) el.edit = false
      if (el.format === 'checkbox') {
        el.row.forEach(item => {
          if (!el.edit && !el.replys.length) {
            // console.log('答题')
            item.selected = []
          }
        })
        // console.log(el)
      }
    })
  },

  reset() {
    store.questionData = {
      id: null,
      title: '标题', // 表单标题
      description: '问卷简介',
      imgUrl: null,
      publish: false,
      detail: [],
      max: 100,
      extension: '扩展信息'
    }
  }
}
