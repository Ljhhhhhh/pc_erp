<template>
  <div>
    <el-dialog :title="textMap[formType]" :visible="visible" :before-close="handleClose" width="800px">
      <el-row>
        <el-col :span="18" :offset="4">

          <div class="box-card">

            <el-row>
              <el-form :model="editInfo" :rules="rules" ref="customerForm">
                <el-form-item label="上级节点" label-width="80px" prop="sex">
                  <el-select v-model="editInfo.pid" placeholder="请选择上级节点" style="width:178px;">
                    <el-option v-for="item in parentNodeOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="节点名称" label-width="80px" prop="name">
                  <el-input v-model="editInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="Module" label-width="80px">
                  <el-input v-model="editInfo.module_name"></el-input>
                </el-form-item>
                <el-form-item label="Controller" label-width="80px">
                  <el-input v-model="editInfo.controller_name"></el-input>
                </el-form-item>
                <el-form-item label="Action" label-width="80px">
                  <el-input v-model="editInfo.action_name"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="80px">
                  <el-input v-model="editInfo.remark"></el-input>
                </el-form-item>
              </el-form>
            </el-row>

          </div>
        </el-col>

      </el-row>


      <div slot="footer" class="dialog-footer" style="width:100%;margin:auto;text-align: center;">
        <el-button @click="handleClose">取 消</el-button>
        <el-button v-if="formType=='create'" type="primary" @click="createNode()">确 定</el-button>
        <el-button v-else type="primary" @click="updateNode">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { createNode, updateNode } from '@/api/user/user_nodes.js'

  export default {
    props: {
      parentNode: {
        type: Array,
        default: function() {
          return [{ value: '0', label: '作为一级部门' }]
        }
      },
      editInfo: {
        type: Object,
        default: {
          pid: 0
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
      parentNode: function() {
        this.parentNodeOption = [{ value: '0', label: '作为一级部门' }]
        this.parentNode.map(v => {
          v.name = v.name.replace(/\&nbsp;/g, ' ')
          this.parentNodeOption.push({ value: v.id, label: v.name })
        })
      }
    },
    data() {
      return {
        parentNodeOption: [],
        rules: {
          name: [
            { required: true, message: '节点名必填', trigger: 'blur' }
          ]
        },
        textMap: {
          update: '编辑节点',
          create: '创建节点'
        }
      }
    },
    created() {

    },
    methods: {
      createNode() {
        this.$refs['customerForm'].validate((valid) => {
          if (valid) {
            createNode(this.editInfo).then(response => {
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
      updateNode() {
        this.$refs['customerForm'].validate((valid) => {
          if (valid) {
            updateNode(this.editInfo.id, this.editInfo).then(response => {
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
