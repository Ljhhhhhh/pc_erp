<template>
  <div>
    <el-dialog :title="textMap[formType]" :visible="visible" :before-close="handleClose" width="400px">
      <el-row align="center" justify="center" type="flex">

        <el-col :span="18">

          <div class="box-card">

            <el-row>
              <el-form :model="editInfo" :inline="false" :rules="rules" ref="customerForm">

                <el-form-item label="职位名称" prop="name">
                  <el-input v-model="editInfo.position_name"></el-input>
                </el-form-item>

                <el-form-item label="职位描述" prop="description">
                  <el-input v-model="editInfo.position_description" type="text"></el-input>
                </el-form-item>

              </el-form>
            </el-row>

          </div>
        </el-col>

      </el-row>


      <div slot="footer" class="dialog-footer" style="width:165px;margin:auto;">
        <el-button @click="handleClose">取 消</el-button>
        <el-button v-if="formType=='create'" type="primary" @click="createUser()">确 定</el-button>
        <el-button v-else type="primary" @click="updateUser()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { createPosition, updatePosition } from '@/api/position'

  export default {
    props: {
      editInfo: {
        type: Object,
        default: {}
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
    data() {
      return {
        rules: {
          position_name: [
            { required: true, message: '职位名必填', trigger: 'blur' }
          ]
        },
        textMap: {
          update: '编辑职位',
          create: '创建职位'
        }
      }
    },
    methods: {
      createUser() {
        this.$refs['customerForm'].validate((valid) => {
          if (valid) {
            createPosition(this.editInfo).then(response => {
              if (response.code === 200) {
                this.$message.success('添加成功')
                this.$emit('update:visible', false)
                this.$emit('updateList')
              } else {
                this.$message.error(response.msg)
              }
            })
          } else {
            this.$message.error('请检查填写是否正确')
          }
        })
      },
      updateUser() {
        this.$refs['customerForm'].validate((valid) => {
          if (valid) {
            updatePosition(this.editInfo.id, this.editInfo).then(response => {
              if (response.code === 200) {
                this.$message.success('更新成功')
                this.$emit('update:visible', false)
                this.$emit('updateList')
              } else {
                this.$message.error(response.msg)
              }
            })
          } else {
            this.$message.error('请检查填写是否正确')
          }
        })
      },
      handleClose() {
        this.$emit('update:visible', false)
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
