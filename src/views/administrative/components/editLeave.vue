<template>
  <div class="container">
    <el-row class="mt30">
      <el-col :xl="12" :md="12">
        <el-form ref="form" :model="form" label-width="130px" :inline="true">
          <div>
            <el-form-item label="姓名：">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="职务：">
              <el-input v-model="form.duty"> </el-input>
            </el-form-item>
            <el-form-item label="参加工作时间：">
              <el-date-picker v-model="form.startwork_time" type="date" placeholder="选择日期" style="width:175px">
              </el-date-picker>
            </el-form-item>

          </div>
          <div>
            <el-form-item label="累计工作年限：">
              <el-input v-model="form.work_years"></el-input>
            </el-form-item>
            <el-form-item label="年休假天数：">
              <el-input v-model="form.annual_vacation_days"></el-input>
            </el-form-item>
            <el-form-item label="已休天数：">
              <el-input v-model="form.done_vacation_days"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="本次请假天数">
              <el-input v-model="form.leave_days"></el-input>
            </el-form-item>
            <el-form-item label="请假起止时间：">
              <el-col :span="11">
                <el-date-picker v-model="form.start_leave_time" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-date-picker v-model="form.end_leave_time" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
              </el-col>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="请假类型：">
              <el-radio-group v-model="form.leave_type">
                <el-radio :label="1">年休假</el-radio>
                <el-radio :label="2">产假</el-radio>
                <el-radio :label="3">事假</el-radio>
                <el-radio :label="4">病假</el-radio>
                <el-radio :label="5">工会疗养</el-radio>
                <el-radio :label="6">其他</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="本人申请理由：">
              <el-input v-model="form.apply_reason"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
      <el-col v-if="form.status != 10" :xl="9" :lg="9" :md="12">
        <el-row>
          <el-col class="pl30">
            <el-button type="primary" @click="onSubmit(0)">保存</el-button>
            <el-button type="success" @click="onSubmit(1)">提交到流程</el-button>
            <el-button @click="back">返回</el-button>
          </el-col>
        </el-row>
        <el-row class="mt30">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>请假流程：</span>
            </div>
            <el-steps :align-center="true">
              <el-step v-for="(item, index) in workflow" :key="index" :title="item.role_name"></el-step>
            </el-steps>
            <div class="select_content">
              <template v-for="(v, i) in role_user_list">
                <div :key="i" v-if="v.placeholder">
                  <label>{{v.placeholder}}：</label>
                  <el-select v-model="v.list" multiple :placeholder="v.placeholder" :filterable="true" @change="listChange"
                    @remove-tag="listRemove ">
                    <el-option v-for="(user, index) in userList" :key="index" :label="user.label" :value="user.key"
                      v-if="user.role_ids.indexOf(String(v.role_id))>-1" :disabled="user.disabled"></el-option>
                  </el-select>
                </div>
              </template>
            </div>
          </el-card>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {
    createLeave,
    leaveInfo,
    updateLeave
  } from '@/api/administrative/leave'
  import {
    workflowsign
  } from '@/api/meeting/workflow'
  import {
    fetchList
  } from '@/api/user/user'
  export default {
    name: 'addCarApply',
    data() {
      return {
        id: null,
        form: {},
        userList: [],
        join_user_list: [],
        workflow: [],
        role_user_list: []
      }
    },
    created() {
      this.id = this.$route.query.id || null
      this.getUserList()
      this.getWorkflow()
    },
    methods: {
      getWorkflow() {
        workflowsign('manage_leave').then(res => {
          this.workflow = res.data.detail
          this.workflow.forEach(item => {
            const data = {
              role_id: item.role_id,
              step: item.step,
              list: [],
              placeholder: `请选择${item.role_name}`
            }
            this.role_user_list.push(data)
          })
        }).then(() => {
          if (this.id > 0) {
            this.getDeatil(this.id)
          }
        })
      },
      listChange(val) {
        const arr = Array.from(val)
        this.userList.forEach((item, index) => {
          if (arr.indexOf(item.key) > -1) {
            item.disabled = true
          }
        })
      },
      listRemove(val) {
        this.userList.forEach((item, index) => {
          if (item.key === val) {
            item.disabled = false
          }
        })
      },
      back() {
        this.$confirm('确认返回吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.back()
        })
      },
      getDeatil(id) {
        leaveInfo(id).then(res => {
          this.form = res.data
          this.role_user_list.forEach((item, index) => {
            res.data.role_user_list.forEach(v => {
              if (+v.role_id === +item.role_id) {
                this.role_user_list[index].list = v.list
              }
            })
          })
        })
      },
      getUserList() {
        const data = {
          page: 1,
          page_size: 1e4,
          search_key: ''
        }
        fetchList(data).then(res => {
          res.data.forEach(item => {
            this.userList.push({
              key: item.id,
              label: item.nickname,
              role_ids: item.role_ids.split(','),
              disabled: false
            })
          })
        })
      },
      onSubmit(type) {
        this.form.to_workflow = type
        this.form.role_user_list = {}
        this.role_user_list.forEach(item => {
          this.form.role_user_list[item.role_id] = item.list.join(',')
        })
        this.form.role_user_list = JSON.stringify(this.form.role_user_list)
        let msg = null
        let doFunc = null
        if (this.id) {
          msg = '更新成功'
          doFunc = updateLeave
        } else {
          msg = '创建成功'
          doFunc = createLeave
        }
        if (type === 0) {
          msg = '保存成功'
        }
        console.log(this.form)
        doFunc(this.form, this.id).then(res => {
          if (res.code === 200) {
            this.$message.success(msg)
            this.$router.back()
            return
          } else {
            this.$message.error(res.msg + ':' + res.error_msg)
          }
        })
      }
    }
  }

</script>
<style lang="scss" scoped>
  .hidden {
    display: none;
  }

  .line {
    text-align: center;
  }

  .box-card {
    padding-bottom: 15px;

    .select_content {
      display: flex;
      flex-wrap: wrap;

      label {
        font-size: 14px;
        display: inline-block;
        width: 140px;
      }

      div {
        flex: 1;
        min-width: 50%;
        max-width: 50%;
        margin-top: 10px;
      }
    }
  }

</style>
