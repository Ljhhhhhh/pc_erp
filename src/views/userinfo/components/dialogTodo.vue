<template>
  <el-dialog :visible="visible" :before-close="handleClose" width="950px" title="流程详情">
    <div class="need_workflow">
      <el-steps :active="cur_step" process-status="finish" finish-status="success" :align-center="true" :simple="true">
        <el-step v-for="(item,index) in needWorkflow" :key="index" :title="item.step_nickname"></el-step>
      </el-steps>
    </div>
    <div class="basic_info">
      <p>
        <span>申请人：</span>
        <em>{{detail.apply_nickname}}</em>
      </p>
      <p>
        <span>流程名称：</span>
        <em>{{detail.workflow_name}}</em>
      </p>
      <p>
        <span>申请时间：</span>
        <em>{{detail.create_time | formatUnixDate}}</em>
      </p>
      <p>
        <span>流程状态：</span>
        <em>{{detail.status_name}}</em>
      </p>
    </div>
    <relFlowDetail :relFlowDetailData="relFlowDetailData"></relFlowDetail>
    <div class="process_workflow">
      <el-steps finish-status="success" :align-center="true" direction="vertical" space="60px">
        <template v-for="(item,index) in processWorkflow">
          <el-step v-if="item.status===1" :key="index" :description="item.content" :title="item.nickname+item.result" class="active_step" icon="el-icon-success"></el-step>
          <el-step v-else-if="item.status===2" :key="index" :description="item.content" :title="item.nickname+item.result" class="reject_step" icon="el-icon-error"></el-step>
          <el-step v-else-if="item.status===3" :key="index" :description="item.content" :title="item.nickname+item.result" class="recall_step" icon="el-icon-remove"></el-step>
          <el-step v-else :key="index" :title="item.nickname+item.result" :description="item.content"></el-step>
        </template>
      </el-steps>
    </div>
    <el-input v-model="option" placeholder="请输入意见" class="option_input" type="textarea"></el-input>
    <el-row class="group_btn" v-if="canHandle && !myApplyFlag">
      <el-button type="danger" @click="workflowHandle(-1)">驳回</el-button>
      <el-button type="success" @click="workflowHandle(1)">通过</el-button>
    </el-row>
    <el-row class="group_btn" v-if="canHandle && myApplyFlag && !editHandle">
      <el-button type="warning" @click="workflowHandle(0)">取回</el-button>
    </el-row>
    <el-row class="group_btn" v-if="editHandle">
      <el-button type="warning" @click="workflowHandle('edit')">去修改</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
  import '@/styles/meet-vue-style.scss'
  import {
    workflowDetail,
    workflowApplyAllow,
    workflowApplyNoAllow,
    workflowApplyTakeback
  } from '@/api/user/todo'
  import todoConfig from './todo_config'
  import {
    mapGetters
  } from 'vuex'
  import relFlowDetail from './relFlowDetail'
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      applyId: {
        type: Number,
        required: true
      },
      applyType: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        detail: {},
        cur_step: null,
        /* 目前的流程 */
        needWorkflow: [],
        /* 需要走的所有流程 */
        processWorkflow: [],
        myApplyFlag: false,
        relFlowDetailData: [],
        statusNameMap: ['未处理', '同意', '驳回', '被取回', '重新提交', '申请者已删除'],
        option: ''
      }
    },
    watch: {
      visible: function(val) {
        if (!val) {
          return
        }
        this.workflowDetail()
      }
    },
    methods: {
      workflowHandle(next) { // next判断当前选择的操作 1 => 通过 -1 => 驳回 0 => 取回 'edit' => 重新修改
        let nextStep = this.cur_step + next
        if (next === -1) {
          nextStep = 0
        }
        const data = {
          next_step: nextStep,
          workflow_content: this.option
        }
        let func = ''
        if (next === 1) {
          func = workflowApplyAllow
        }
        if (next === -1) {
          func = workflowApplyNoAllow
        }
        if (next === 0) {
          func = workflowApplyTakeback
        }
        if (next === 'edit') {
          this.$router.push({
            path: todoConfig[this.detail.apply_model],
            query: {
              id: this.detail.apply_id
            }
          })
          return
        }
        func(this.applyId, data).then(res => {
          console.log(res)
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.handleClose()
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      workflowDetail() {
        workflowDetail(this.applyId).then(res => {
          this.detail = res.data
          switch (this.detail.status) {
            case '0':
              this.detail.status_name = '进行中'
              break
            case '1':
              this.detail.status_name = '已完成'
              break
            case '-1':
              this.detail.status_name = '已删除'
              break
          }
          this.needWorkflow = res.data.workflow_data.workflow_detail
          this.cur_step = +res.data.cur_step
          this.processWorkflow = res.data.process
          this.processWorkflow.forEach(item => {
            if (item.is_master !== '1') {
              item.result = '(' + this.statusNameMap[item.status] + ')'
            }
          })
          this.relFlowDetailData = res.data.workflow_form_build
          if (this.applyType === 0) {
            this.myApplyFlag = true
          } else {
            this.myApplyFlag = false
          }
        })
      },
      handleClose() {
        this.$emit('update:visible', false)
        this.$emit('updateList')
      }
    },
    computed: {
      ...mapGetters([
        'userinfo'
      ]),
      canHandle() {
        if (this.$route.name === 'done') {
          return false
        } else {
          return true
        }
      },
      editHandle() {
        if (this.detail.is_back_to_own === '1' && +this.detail.user_id === this.userinfo.id) {
          return true
        } else {
          return false
        }
      }
    },
    components: {
      relFlowDetail
    }
  }

</script>
<style lang="scss" scoped>
  .basic_info {
    display: flex;
    flex-wrap: wrap;
    p {
      flex: 1;
      min-width: 25%;
    }
  }

  .group {
    margin-top: 15px;
  }

  .process_workflow {
    max-height: 300px;
    overflow-y: auto;

  }
  .option_input{
    width: 200px;
    margin-bottom: 20px;
  }

</style>
