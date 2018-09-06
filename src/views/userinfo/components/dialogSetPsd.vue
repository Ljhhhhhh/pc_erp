<template>
  <el-dialog title="修改密码" :visible="visible" :before-close="handleClose" width="300px">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="原始密码" prop="old_password">
        <el-input v-model="form.old_password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input v-model="form.new_password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="new_password_repeat">
        <el-input v-model="form.new_password_repeat" type="password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="resetPassword" :disabled="btnDisable">修改密码</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
  import {
    resetPassword
  } from '@/api/user/user'
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        form: {},
        rules: {
          old_password: [{
            required: true,
            message: '请输入原始密码',
            trigger: 'blur'
          }],
          new_password: [{
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          }],
          new_password_repeat: [{
            required: true,
            message: '请重复输入新密码',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      resetPassword() {
        if (this.form.new_password !== this.form.new_password_repeat) {
          this.$message.error('两次密码输入不同，请重新填写')
        }
        resetPassword(this.form).then(res => {
          console.log(res)
          if (res.code === 200) {
            this.$message.success('修改密码成功，请重新登录')
            this.$store.dispatch('LogOut').then(() => {
              setTimeout(() => {
                location.reload() // In order to re-instantiate the vue-router object to avoid bugs
              }, 1000)
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      handleClose() {
        this.$emit('update:visible', false)
      }
    },
    computed: {
      btnDisable() {
        if (!this.form.old_password) {
          return true
        }
        if (this.form.new_password === undefined) {
          return true
        }
        if (this.form.new_password !== this.form.new_password_repeat) {
          return true
        }
        return false
      }
    }
  }

</script>
<style lang="scss" scoped>


</style>
