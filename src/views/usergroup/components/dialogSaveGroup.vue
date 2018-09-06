<template>
  <div>
    <el-dialog :title="textMap[formType]" :visible="visible" :before-close="handleClose" width="800px">
      <el-row>
        <el-col :span="18" :offset="4">

          <div class="box-card">

            <el-row>
              <el-form :model="editInfo" :rules="rules" ref="customerForm">

                <el-form-item label="上级部门" label-width="80px" prop="sex">
                  <el-select v-model="editInfo.pid" placeholder="请选择上级部门" style="width:178px;">
                    <el-option v-for="item in parentGroupOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="部门名称" label-width="80px" prop="group_name">
                  <el-input v-model="editInfo.group_name"></el-input>
                </el-form-item>
                <el-form-item label="负责人" label-width="80px" prop="manager_uid">
                  <el-input readonly="readonly" v-model="editInfo.manager_realname" @focus="leaderDialog()"></el-input>
                  <el-input type="hidden" readonly="readonly" v-model="editInfo.manager_uid"></el-input>
                </el-form-item>
              </el-form>
            </el-row>

          </div>
        </el-col>

      </el-row>


      <div slot="footer" class="dialog-footer" style="width:100%;margin:auto;text-align: center;">
        <el-button @click="handleClose">取 消</el-button>
        <el-button v-if="formType=='create'" type="primary" @click="createGroup()">确 定</el-button>
        <el-button v-else type="primary" @click="updateGroup">确 定</el-button>
      </div>
    </el-dialog>
    <dialogLeader :visible.sync="showLeaderDialog" @setLeader="setLeader"></dialogLeader>
  </div>

</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { createGroup, updateGroup } from '@/api/usergroup'
  import dialogLeader from './dialogLeader.vue'

  export default {
    props: {
      parentGroup: {
        type: Array,
        default: function() {
          return [{ value: '0', label: '作为一级部门' }]
        }
      },
      editInfo: {
        type: Object,
        default: {
          headimg: '',
          sex: 1,
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
      parentGroup: function() {
        this.parentGroupOption = [{ value: '0', label: '作为一级部门' }]
        this.parentGroup.map(v => {
          this.parentGroupOption.push({ value: v.id, label: v.group_name })
        })
        console.log(this.parentGroupOption)
      }
    },
    data() {
      return {
        showLeaderDialog: false,
        parentGroupOption: [],
        rules: {
          group_name: [
            { required: true, message: '部门名必填', trigger: 'change' }
          ],
          manager_uid: [
            { required: true, message: '负责人必填', trigger: 'change' }
          ]
        },
        textMap: {
          update: '编辑部门',
          create: '创建部门'
        }
      }
    },
    methods: {
      setLeader(leader) {
        this.editInfo.manager_realname = leader.manager_realname
        this.editInfo.manager_uid = leader.manager_uid
      },
      leaderDialog(id) {
        this.showLeaderDialog = true
      },
      createGroup() {
        this.$refs['customerForm'].validate((valid) => {
          if (valid) {
            createGroup(this.editInfo).then(response => {
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
      updateGroup() {
        this.$refs['customerForm'].validate((valid) => {
          if (valid) {
            updateGroup(this.editInfo.id, this.editInfo).then(response => {
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
    },
    components: {
      dialogLeader
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
