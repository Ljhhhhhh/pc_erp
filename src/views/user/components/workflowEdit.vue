<template>
  <div class="container">
    <el-header height="30px">流程基本信息：</el-header>

    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span=5>
          <el-form-item label="流程标识">
            <el-input v-model="form.sign" placeholder="请填写流程标识"></el-input>
          </el-form-item>
          <el-form-item label="流程名称">
            <el-input v-model="form.workflow_name" placeholder="请填写流程名称"></el-input>
          </el-form-item>
          <el-form-item label="流程描述">
            <el-input v-model="form.description" placeholder="请填写流程描述"></el-input>
          </el-form-item>
          <el-form-item label="流程排序">
            <el-input v-model="form.sort" placeholder="请填写流程排序"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-header height="30px">流程详情：</el-header>
      <el-row>
        <el-select filterable v-model="newRole.id" placeholder="请选择审核角色">
          <el-option v-for="item in roleList" :key="item.id" :label="item.role_name" :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="newStep" placeholder="请选择新步骤">
          <el-option v-for="(item,index) in stepList" :key="item.index" :label="item" :value="index">
          </el-option>
        </el-select>
        <el-button type="primary" plain @click.native="addWorkflow" :disabled="addBtnShow">添加到流程</el-button>
      </el-row>
      <div class="workflow_list">
        <span v-for="(item, index) in workflowList" :key="index" @click="deleteUser(index)">
          {{item.role_name}}
        </span>
      </div>
      <el-button type="primary" @click="onSubmit">确认流程</el-button>
      <el-button type="info" @click="back">取消</el-button>
    </el-form>
  </div>
</template>
<script>
  import {
    workflowDetail,
    createWorkflow,
    updateWorkflow
  } from '@/api/user/workflow.js'
  import {
    rolesList
  } from '@/api/user/role'

  export default {
    name: 'workflowEdit',
    created() {
      this.getWorkflowDetail()
      this.getUser()
    },
    data() {
      return {
        workflowList: [],
        roleList: [],
        newRole: {},
        newStep: null,
        form: {}
      }
    },
    methods: {
      back() {
        this.$confirm('此操作将会放弃当前修改项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.back()
        })
      },
      onSubmit() {
        const data = this.form
        this.workflowList.forEach((item, index) => {
          console.log('item:', item)
          if (!item.role_id) {
            item.role_id = item.id
            delete item.id
          }
          item.step = index + 1
        })
        data.detail = this.workflowList
        console.log('上传的数据：', data)
        const id = this.$route.query.id
        let uploadFunc = null
        let msg = ''
        if (id) {
          uploadFunc = updateWorkflow
          msg = '修改成功'
        } else {
          uploadFunc = createWorkflow
          msg = '添加成功'
        }
        uploadFunc(data, id).then(res => {
          console.log('返回的数据：', res)
          if (res.code === 200) {
            this.$message.success(msg)
            this.$router.back()
            return
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      getWorkflowDetail() {
        const id = this.$route.query.id
        if (!id) {
          return
        }
        workflowDetail(id).then(res => {
          console.log(res)
          this.workflowList = res.data.detail
          this.form = res.data
        })
      },
      deleteUser(index) {
        this.workflowList.splice(index, 1)
      },
      addWorkflow() {
        this.roleList.forEach(item => {
          if (item.id === this.newRole.id) {
            this.newRole.role_name = item.role_name
          }
        })
        this.workflowList.splice(this.newStep, 0, this.newRole)
        this.newRole = {}
        this.newStep = null
      },
      getUser() {
        rolesList().then(res => {
          this.roleList = res.data
          console.log(this.roleList, 888)
        })
      }
    },
    computed: {
      stepList() {
        const len = this.workflowList.length
        const list = []
        for (var i = 0; i <= len; i++) {
          list.push(i + 1)
        }
        return list
      },
      addBtnShow() {
        if (this.newStep === null) {
          return true
        }
        if (!this.newRole.id) {
          return true
        }
        return false
      }
    }
  }

</script>
<style lang="scss" scoped>
  .el-header {
    margin: 30px 0 15px;
    font-size: 18px;
    color: #333;
    border-bottom: 1px solid #999;
  }

  .container {
    padding: 0 25px;
  }

  .workflow_list {
    margin: 15px 0;
    span {
      display: inline-block;
      width: auto;
      min-width: 4em;
      height: 40px;
      text-align: center;
      border-radius: 10px;
      border: 1px solid #CCC;
      line-height: 40px;
      padding: 0 15px;
      position: relative;
      &+span {
        margin-left: 60px;
      }
      &:before {
        position: absolute;
        content: '删除';
        color: #FF0000;
        background: #CCC;
        line-height: 38px;
        width: 100%;
        left: 0;
        border-radius: 8px;
        cursor: pointer;
        opacity: 0;
        filter: opacity(0);
        transition: all 0.2s ease-in;
      }
      &:after {
        position: absolute;
        right: -40px;
        top: 0;
        content: '→';
        display: inline-block;
        width: 22px;
        color: red;
        transform: scale(2.5);
        line-height: 30px;
        z-index: -1;
      }
      &:last-child:after {
        display: none;
      }
      &:hover:before {
        opacity: 1;
        filter: opacity(100);
      }
    }
  }

</style>
