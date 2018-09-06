<template>
  <el-dialog title="事项处理" :visible="visible" :before-close="handleClose" width="800px">
    <el-row>
      <el-col :span="12">
        <div>
          <span class="title" style="margin:0">表决意见：</span>
          <el-radio-group v-model="form.tmp_pass_status">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="0">否决</el-radio>
          </el-radio-group>
        </div>
        <div class="select_content" style="margin-top:15px">
          <span class="title">交办人员：</span>
          <el-select v-model="role_user_list" multiple placeholder="请选择交办人员" :filterable="true" @change="listChange"
            @remove-tag="listRemove ">
            <el-option v-for="(user, index) in userList" :key="index" :label="user.label" :value="user.key"></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <span>理由：</span>
          <el-input type="textarea" autosize v-model="form.reason"></el-input>
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer" style="width:100%;margin:auto;text-align: center;">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="assignProposal">确 定</el-button>
    </div>
  </el-dialog>

</template>
<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {
    fetchList
  } from '@/api/user/user'
  import {
    assignProposal
  } from '@/api/meeting/proposals'
  export default {
    props: {
      parentGroup: {
        type: Object,
        default: function() {
          return {}
        }
      },
      proposalId: {
        type: ''
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
        form: {},
        id: null,
        userId: null,
        vnote_status: '',
        reason: '',
        userList: [],
        role_user_list: []
      }
    },
    watch: {
      parentGroup: function(val) {
        this.form = val
        console.log(val)
      },
      proposalId: function(val) {
        if (this.form.designated_uid === '') {
          this.role_user_list.push(this.form.apply_uid)
        } else {
          this.form.designated_uid.split(',').forEach(item => {
            this.role_user_list.push(item / 1)
          })
        }
        this.userId = this.userId / 1
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      handleClose() {
        this.$emit('update:visible', false)
      },
      assignProposal() {
        const params = {
          designated_uid: this.role_user_list.join(','),
          pass_status: this.form.tmp_pass_status,
          reason: this.form.reason
        }
        assignProposal(params, this.proposalId).then((res) => {
          if (res.code === 200) {
            this.$message.success('交办成功')
            this.$emit('assignProposal')
            this.handleClose()
            return
          } else {
            this.$message.error(res.msg + ':' + res.error_msg)
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
      getUserList() {
        const data = {
          page: 1,
          page_size: 1000,
          search_key: ''
        }
        fetchList(data).then(res => {
          res.data.forEach(item => {
            this.userList.push({
              key: item.id,
              label: item.nickname
            })
          })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .title {
    display: inline-block;
    line-height: 32px;
    height: 32px;
    margin-top: 10px
  }

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

</style>
