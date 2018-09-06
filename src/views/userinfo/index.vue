<template>
  <div>
    <el-row type="flex" justify="center" class="mt30">
      <el-col :pull="3" :span="2">
        <div class="box-card" style="margin:auto;">
          <el-upload :action="uploadUrl" name="fileList" list-type="picture-card" class="div-center" :show-file-list="false" :on-success="Jt_upload_success">
            <img v-if="avatar" :src="avatar" class="avatar" width="145" height="145">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </el-col>
      <el-col :pull="2" :span="10">
        <el-form ref="customerForm" :rules="rules" :model="userinfo" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="userinfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="性别">
            {{userinfo.sex_name}}
          </el-form-item>
          <el-form-item label="所属部门">
            <el-input v-model="userinfo.group_name" disabled></el-input>
          </el-form-item>
          <el-form-item label="职务">
            <el-input v-model="userinfo.position_name" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="userinfo.phone" disabled></el-input>
          </el-form-item>
          <el-form-item label="QQ">
            <el-input v-model="userinfo.qq"></el-input>
          </el-form-item>
          <el-form-item label="WeChat">
            <el-input v-model="userinfo.wechat"></el-input>
          </el-form-item>
          <el-form-item label="E-mail">
            <el-input v-model="userinfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="resetPassword">修改密码</el-button>
            <el-button type="primary" @click="onSubmit">确认</el-button>
            <el-button @click="back">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <dialogSetPsd  :visible.sync="showDialog"></dialogSetPsd>
  </div>
</template>
<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  import {
    setUserInfo
  } from '@/api/login'
  import {
    getToken
  } from '@/utils/auth'
  import dialogSetPsd from './components/dialogSetPsd'

  export default {
    data() {
      return {
        uploadUrl: process.env.BASE_API + '/file/index/uploadimage',
        showDialog: false,
        rules: {
          username: [{
            required: true,
            message: '用户名必填',
            trigger: 'blur'
          }],
          nickname: [{
            required: true,
            message: '昵称必填',
            trigger: 'blur'
          }],
          usergroup: [{
            required: true,
            message: '请选择所属部门',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      resetPassword() {
        this.showDialog = true
      },
      back() {
        this.$router.back()
      },
      handleChange() {},
      Jt_upload_success(response, file, fileList) {
        this.userinfo.avatar = process.env.BASE_API + response.url
        this.userinfo.headimg = response.url
        this.userinfo.cover_id = response.fileid
      },
      onSubmit() {
        this.$refs['customerForm'].validate((valid) => {
          if (valid) {
            this.userinfo.token = getToken()
            console.log(this.userinfo)
            setUserInfo(this.userinfo)
            this.$message.success('更新成功')
          } else {
            this.$message.error('请检查填写是否正确')
          }
        })
      },
      ...mapMutations({
        'setUserInfo': 'SET_USERINFO'
      })
    },
    computed: {
      avatar: {
        get: function() {
          if (this.userinfo.headimg) {
            return process.env.BASE_API + this.userinfo.headimg
          } else {
            return ''
          }
        },
        set: function() {
          if (this.userinfo.headimg) {
            return process.env.BASE_API + this.userinfo.headimg
          } else {
            return ''
          }
        }
      },
      ...mapGetters([
        'userinfo'
      ])
    },
    components: {
      dialogSetPsd
    }
  }

</script>
<style lang="scss" scoped>


</style>
