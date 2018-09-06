<template>
  <el-dialog :visible="visible" :before-close="handleClose" width="800px">
    <div class="container" id="subProposals-print">
      <el-row>
        <el-col :span="24">
          <h2 class="title">{{data!=null?data.meet_type:''}}</h2>
        </el-col>
        <el-col :span="24">
          <p class="title">(请按次序提交)</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" :push="1">
          <span>时间:</span>
          <span class="content">{{data!=null?data.start_time:''}}</span>
        </el-col>
        <el-col :span="16" :push="1">
          <span>地点:</span>
          <span class="content">{{data!=null?data.meet_address:''}}</span>
        </el-col>
      </el-row>
      <el-row :span="23" :push="1">
        <el-col>
          <el-table :data="data.meet_proposal_data" border>
            <el-table-column type="index" label="序号" class="index"></el-table-column>
            <el-table-column label="提交事项">
              <template slot-scope="scope">
                {{scope.row.proposal_title}}
              </template>
            </el-table-column>
            <el-table-column label="提交领导">
              <template slot-scope="scope">
                {{scope.row.apply_nickname}}
              </template>
            </el-table-column>
            <el-table-column label="事项结果">
              <template slot-scope="scope">
                {{pass_status_map[scope.row.pass_status]}}
              </template>
            </el-table-column>
            <el-table-column label="交办人">
              <template slot-scope="scope">
                {{scope.row.designated_uid_nickname}}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span="5" :push="1" class="print_btn">
        <el-button type="success" @click="PrintDialog" v-waves>打印页面</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令

  export default {
    props: {
      parentGroup: {
        type: Object,
        required: true,
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
      }
    },
    data() {
      return {
        showLeaderDialog: false,
        data: {},
        pass_status_map: {
          0: '未使用',
          1: '通过',
          2: '不通过'
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit('update:visible', false)
      },
      PrintDialog() {
        var newstr = document.getElementById('subProposals-print').innerHTML
        document.body.innerHTML = newstr
        const oldContent = document.body.innerHTML
        document.body.innerHTML = newstr
        window.print()
        window.location.reload()
        document.body.innerHTML = oldContent
        return false
      }
    },
    components: {

    }
  }

</script>
<style lang="scss" scoped>
  .container {
    span {
      line-height: 24px;
    }

    h2,
    p.title {
      text-align: center;
    }

    span.content {
      padding-left: 10px;
      padding-right: 15px;
    }

    .print_btn {
      margin-top: 20px;
    }

    .index {
      text-align: center;
    }
  }

  @media print {
    span {
      line-height: 24px;
    }

    h2,
    p.title {
      text-align: center;
    }

    span.content {
      padding-left: 10px;
      padding-right: 15px;
    }

    .index {
      text-align: center;
    }

    table,
    th,
    td {
      border: 1px solid #ccc;
    }
  }

</style>
