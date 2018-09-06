<template>
  <div class="container">
    <el-row class="mt30">
      <el-col :xl="12" :lg="12" :md="12">
        <el-form ref="form" :model="form" label-width="150px" :inline="true">
          <div>
            <el-form-item label="用车单位(部门)：" label-width="150px">
              <el-input v-model="form.car_use_group_name"></el-input>
            </el-form-item>
            <el-form-item label="车号：">
              <el-input v-model="form.car_no"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="联系人：">
              <el-input v-model="form.linkman"></el-input>
            </el-form-item>
            <el-form-item label="驾驶员：">
              <el-input v-model="form.driver"></el-input>
            </el-form-item>
          </div>
          <div>

            <el-form-item label="联系人手机：">
              <el-input v-model="form.linkman_telephone"></el-input>
            </el-form-item>
            <el-form-item label="驾驶员手机：">
              <el-input v-model="form.driver_telephone"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="用车事由：">
              <el-radio-group v-model="form.use_car_type">
                <el-radio :label="1">重要会议用车</el-radio>
                <el-radio :label="2">重要活动用车</el-radio>
                <el-radio :label="3">重要接待用车</el-radio>
                <el-radio :label="5">机要用车</el-radio>
                <el-radio :label="6">应急用车</el-radio>
                <el-radio :label="4">重要日常活动公务用车</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="发车时间：">
              <el-date-picker v-model="form.car_set_out_time" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="天数：">
              <el-input v-model="form.car_use_days"></el-input>
            </el-form-item>
            <el-form-item label="所需车型：">
              <el-input v-model="form.car_type_name"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="发车地点：">
              <el-input v-model="form.car_set_out_address"></el-input>
            </el-form-item>
            <el-form-item label="主要行程：">
              <el-input v-model="form.main_process"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="具体事由：" style="width:660px">
              <el-input style="width:510px" type="textarea" autosize v-model="form.apply_reason"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="mt30">
      <el-col class="pl30">
        <el-button type="primary" @click="onSubmit(0)">保存</el-button>
        <el-button type="success" @click="onSubmit(1)">提交到流程</el-button>
        <el-button @click="back">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {
    createManageCars,
    editManageCars,
    readManageCars
  } from '@/api/administrative/vehicle_apply'
  import {
    fetchList
  } from '@/api/user/user'
  export default {
    name: 'addCarApply',
    data() {
      return {
        id: null,
        form: {},
        userList: []
      }
    },
    methods: {
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
        readManageCars(id).then(res => {
          this.form = res.data
        })
      },
      onSubmit(type) {
        this.form.to_workflow = type
        let msg = null
        let doFunc = null
        if (this.id) {
          msg = '更新成功'
          doFunc = editManageCars
        } else {
          msg = '创建成功'
          doFunc = createManageCars
        }
        if (type === 0) {
          msg = '保存成功'
        }
        doFunc(this.form, this.id).then(res => {
          if (res.code === 200) {
            this.$message.success(msg)
            this.$router.back()
            return
          } else {
            this.$message.error(res.msg + ':' + res.error_msg)
          }
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
      }
    }
  }

</script>
<style lang="scss" scoped>
  .line {
    text-align: center;
  }

  .el-radio-group {
    padding-left: 50px;

    .el-radio {
      width: 150px;
      margin-left: 10px;
    }
  }

</style>
