<template>
  <div class="container">
    <el-row class="mt30">
      <el-col :xl="12" :md="24">
        <el-form ref="form" :model="form" label-width="150px" :inline="true">
          <div>
            <el-form-item label="申请科室(工作片)：">
              <el-input v-model="form.apply_nickname"></el-input>
            </el-form-item>
            <el-form-item label="申请时间：">
              <el-date-picker v-model="form.create_time" type="datetime" placeholder="申请时间">
              </el-date-picker>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="物品清单：">
              <el-input type="textarea" autosize v-model="form.goods_list" style="width:550px"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="预算：">
              <el-input v-model="form.budget" style="width:550px"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="申请理由：">
              <el-input type="textarea" autosize v-model="form.apply_reason" style="width:550px"></el-input>
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
    createPurchases,
    editPurchases,
    updatePurchases
  } from '@/api/administrative/purchases'
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
        editPurchases(id).then(res => {
          this.form = res.data
        })
      },
      onSubmit(type) {
        this.form.to_workflow = type
        let msg = null
        let doFunc = null
        if (this.id) {
          msg = '更新成功'
          doFunc = createPurchases
        } else {
          msg = '创建成功'
          doFunc = updatePurchases
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
      }
    }
  }

</script>
<style lang="scss" scoped>
  .line {
    text-align: center;
  }

</style>

