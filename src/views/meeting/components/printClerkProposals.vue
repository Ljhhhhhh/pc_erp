<template>

  <el-dialog :visible="visible" :before-close="handleClose" width="800px">
    <div class="app-container container calendar-list-container " id="proposalsDetail-print">
      <el-row :gutter="10" style="margin-top:10px;">
        <el-col :span="24">
          <el-row class="border">
            <el-col :span="4">
              <span>提交事项</span>
            </el-col>
            <el-col :span="20">
              <span class="last_one">{{data.proposal_title}}</span>
            </el-col>
          </el-row>
          <el-row class="border border-top">
            <el-col :span="4">
              <span>决策结果</span>
            </el-col>
            <el-col :span="6">
              <span>{{pass_status_map[data.pass_status]}}</span>
            </el-col>
            <el-col :span="5">
              <span>落实责任人</span>
            </el-col>
            <el-col :span="9">
              <span class="last_one">{{data.designated_uid_nickname}}</span>
            </el-col>
          </el-row>

        </el-col>
        <el-col :span="24">
          <el-row class="border border-top">
            <label>事项内容:</label>
            <span class="content_span" v-html="data.content"></span>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-row>
            <el-col class="border border-top">
              <span>其他班子成员意见</span>
            </el-col>
             <el-col class="border border-top">
              <p style="min-height:50px;">
                未表决{{this.unNum}}人,同意{{this.agreeNum}}人,不同意{{this.disAgreeNum}}人,弃权{{this.waiverNum}}人
                最终结果：{{pass_status_map[this.passStatus]}}
              </p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col class="print_btn" :span="5" :push="1">
        <el-button type="success" @click="PrintDialog" v-waves>打印页面</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import '@/styles/meet-vue-style.scss'
  export default {
    props: {
      parentGroup: {
        type: Object,
        default: function() {
          return {}
        }
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    directives: {
      waves
    },
    watch: {
      parentGroup: function(val) {
        this.data = val
        this.data.meet_workflow_process.forEach(item => {
          item.status === 0 ? this.unNum++ : ''
          item.status === 1 ? this.agreeNum++ : ''
          item.status === 2 ? this.disAgreeNum++ : ''
          item.status === 3 ? this.waiverNum++ : ''
        })
        this.unNum > this.agreeNum && this.unNum > this.disAgreeNum ? this.status = 0 : this.agreeNum > this.disAgreeNum ? this.passStatus = 1 : this.status = 2
      }
    },
    data() {
      return {
        data: {},
        id: null,
        form: {},
        agreeNum: 0,
        disAgreeNum: 0,
        waiverNum: 0,
        unNum: 0,
        passStatus: 0,
        pass_status_map: {
          0: '未使用',
          1: '通过',
          2: '不通过'
        },
        proporsals_status_map: {
          0: '未表决',
          1: '同意',
          2: '不同意',
          3: '弃权'
        }
      }
    },
    created() {

    },
    methods: {
      handleClose() {
        this.$emit('update:visible', false)
      },
      PrintDialog() {
        var newstr = document.getElementById('proposalsDetail-print').innerHTML
        document.body.innerHTML = newstr
        const oldContent = document.body.innerHTML
        document.body.innerHTML = newstr
        window.print()
        window.location.reload()
        document.body.innerHTML = oldContent
        return false
      }
    }
  }

</script>
<style lang="scss" scoped>
  .container {
    span {
      line-height: 24px;
    }
    .border {
      border: 1px solid #cccccc;
      line-height: 36px;
      span {
        display: block;
        width: 100%;
        text-align: center;
        line-height: 36px;
        border-right: 1px solid #cccccc;
      }
      .last_one {
        border: none;
      }
      label {
        float: left;
        padding-left: 10px;
        font-weight: normal;
        line-height: 24px;
      }
      .content_span {
        float: left;
        width: auto;
        min-height: 100px;
        line-height: 24px;
        padding-left: 10px;
        text-align: left;
        overflow: hidden;
        display: block;
        border: none;
        p {
          padding: 0;
          margin: 0;
        }
      }
    }
    .border-top {
      border-top: none;
    }
    .print_btn {
      margin-top: 20px;
      float: right;
    }

    .el-input .el-input__inner,
    .el-input--small .el-input__inner {
      border: none;
    }

    .el-table--border,
    .el-table--group,
    .el-table {
      border: 1px solid #ccc;
      vertical-align: middle;
      border-top: none;
    }
    .el-table td,
    .el-table th.is-leaf {
      border-bottom: 1px solid #ccc !important;
    }
  }

  @media print {
    span {
      line-height: 24px;
    }
    .border {
      border: 1px solid black;
      line-height: 32px;
    }
    .border span {
      display: block;
      width: 100%;
      text-align: center;
      line-height: 36px;
      border-right: 1px solid black
    }
    .border .last_one {
      border: none;
    }
    .border .content_span {
      float: left;
      width: auto;
      min-height: 100px;
      line-height: 24px;
      padding-left: 10px;
      text-align: left;
      overflow: hidden;
      display: block;
      border: none;
    }
    .border label {
      float: left;
      padding-left: 10px;
      font-weight: normal;
      line-height: 24px;
    }
    .content_span p {
      padding: 0;
      margin: 0;
      line-height: 24px;
      padding-left: 10px;
    }
    .border-top {
      border-top: none;
    }
    .print_btn {
      margin-top: 20px;
      float: right;
    }
    .el-table--border,
    .el-table--group,
    .el-table {
      border: 1px solid black;
      border-top: none;
    }
    table tr th,
    table tr td {
      border: 1px solid #000000;
    }
    .el-table td,
    .el-table th.is-leaf,
    .el-table__row,
    .el-table th,
    .el-table tr {
      border-bottom: 1px solid #000000 !important;
    }
  }

</style>
