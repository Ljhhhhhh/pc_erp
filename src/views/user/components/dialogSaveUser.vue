<template>
  <div>
    <el-dialog :title="textMap[formType]" :visible="visible" :before-close="handleClose" width="800px">
      <el-row>
        <el-col :span="6">
          <div class="box-card" style="margin:auto;">
            <el-upload :action="uploadUrl" name="fileList" list-type="picture-card" class="div-center" :show-file-list="false" :on-success="Jt_upload_success">
              <img v-if="avatar" :src="avatar" class="avatar" width="145" height="145">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>

        </el-col>

        <el-col :span="18">

          <div class="box-card">

            <el-row>
              <el-form :model="editInfo" :inline="true" :rules="rules" ref="customerForm">

                <div class="header_info">
                  基本信息
                </div>
                <el-form-item label="用户名" label-width="80px" prop="username">
                  <el-input v-model="editInfo.username"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" label-width="80px" prop="nickname">
                  <el-input v-model="editInfo.nickname"></el-input>
                </el-form-item>
                <el-form-item label="性别" label-width="80px" prop="sex">
                  <el-select v-model="editInfo.sex" placeholder="请选择性别" style="width:178px;">
                    <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="用户密码" label-width="80px" prop="nickname">
                  <el-input v-model="editInfo.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="地址" label-width="80px" prop="address">
                  <el-input v-model="editInfo.address" type="text"></el-input>
                </el-form-item>
                <el-form-item label="角色" label-width="80px" prop="role">
                  <el-select v-model="role" multiple filterable placeholder="请选择角色">
                    <el-option aria-selected="selected" v-for="item in role_options" :label="item.role_name" :value="item.role_id" :key="item.role_id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <div class="header_info">
                  联系方式
                </div>
                <el-form-item label="手机" label-width="80px" prop="phone">
                  <el-input v-model="editInfo.phone"></el-input>
                </el-form-item>
                <el-form-item label="QQ" label-width="80px">
                  <el-input v-model="editInfo.qq"></el-input>
                </el-form-item>
                <el-form-item label="微信" label-width="80px">
                  <el-input v-model="editInfo.wechat"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" label-width="80px">
                  <el-input v-model="editInfo.email"></el-input>
                </el-form-item>
                <div class="header_info">
                  其他
                </div>
                <div class="clearfix;">
                  <el-form-item label="备注" prop="desc" label-width="80px">
                    <el-input type="textarea" style="width:300px;" v-model="editInfo.remark"></el-input>
                  </el-form-item>
                </div>
              </el-form>
            </el-row>

          </div>
        </el-col>

      </el-row>


      <div slot="footer" class="dialog-footer" style="width:100%;margin:auto;text-align: center;">
        <el-button @click="handleClose">取 消</el-button>
        <el-button v-if="formType=='create'" type="primary" @click="createUser()">确 定</el-button>
        <el-button v-else type="primary" @click="updateUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {
    createUser,
    updateUser
  } from '@/api/user/user'
  import {
    rolesList
  } from '@/api/user/role'
  // import { getToken } from '@/utils/auth'
  const sexOptions = [{
    value: 0,
    label: '未知'
  },
  {
    value: 1,
    label: '男'
  },
  {
    value: 2,
    label: '女'
  }
  ]
  export default {
    props: {
      editInfo: {
        type: Object,
        default: {
          headimg: '',
          sex: 1
        }
      },
      formType: {
        type: String,
        default: 'create'
      },
      title: {
        type: String,
        default: ''
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
      visible: function(val) {
        if (!val) {
          return
        }
        this.getRoleList()
        if (this.editInfo.headimg) {
          this.avatar = process.env.BASE_API + this.editInfo.headimg
        } else {
          this.avatar = ''
        }
      }
    },
    data() {
      return {
        role: [],
        role_options: [],
        sexOptions,
        avatar: this.editInfo.headimg,
        uploadUrl: process.env.BASE_API + 'file/index/uploadimage',
        rules: {
          username: [{
            required: true,
            message: '用户名必填',
            trigger: 'change'
          }],
          nickname: [{
            required: true,
            message: '昵称必填',
            trigger: 'change'
          }]
        },
        textMap: {
          update: '编辑客户',
          create: '创建客户'
        }
      }
    },
    methods: {
      Jt_upload_success(response, file, fileList) {
        this.avatar = process.env.BASE_API + response.url
        this.editInfo.headimg = response.url
        this.editInfo.cover_id = response.fileid
      },
      createUser() {
        this.$refs['customerForm'].validate((valid) => {
          if (valid) {
            this.editInfo.role_ids = this.role.join(',')
            createUser(this.editInfo).then(response => {
              if (response.code === 200) {
                this.$message.success('添加成功')
                this.$emit('update:visible', false)
                this.$emit('updateList')
              } else {
                this.$message.error(response.msg)
              }
            })
          } else {
            this.$message.error('添加失败')
          }
        })
      },
      updateUser() {
        this.$refs['customerForm'].validate((valid) => {
          if (valid) {
            this.editInfo.role_ids = this.role.join(',')
            updateUser(this.editInfo.id, this.editInfo).then(response => {
              if (response.code === 200) {
                this.$message.success('更新成功')
                this.$emit('update:visible', false)
                this.$emit('updateList')
              } else {
                this.$message.error(response.msg)
              }
            })
          } else {
            this.$message.error('更新失败')
          }
        })
      },
      handleClose() {
        this.$emit('update:visible', false)
      },
      getRoleList() {
        this.role_options = []
        this.role = this.editInfo.role_ids ? this.editInfo.role_ids.split(',') : []
        rolesList().then(response => {
          response.data.forEach(item => {
            this.role_options.push({
              role_name: item.role_name,
              role_id: item.id
            })
          })
        })
      }
    }
  }

</script>
<style lang="scss" type="text/css">
  .header_info {
    font-weight: 700;
    padding: 10px 0;
    border-bottom: 1px solid #d1dbe5;
    margin-bottom: 10px;
  }

</style>
