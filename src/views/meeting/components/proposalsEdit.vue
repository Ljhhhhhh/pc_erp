<template>
  <div>
    <el-row class="mt30">
      <el-col :span="12">
        <el-form ref="form" :model="form" label-width="100px" :inline="false">
          <div>
            <el-form-item label="会议类型：">
              <el-select v-model="form.meet_type_id" placeholder="请选择" @change="meetTypeChange">
                <el-option v-for="item in meet_type_arr" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="事项标题：">
            <el-input v-model="form.proposal_title"></el-input>
          </el-form-item>
          <div>
            <el-form-item label="是否公开：">
              <el-switch v-model="is_open" active-text="公开" inactive-text="不公开">
              </el-switch>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="上传附件：">
            <el-upload class="upload-demo" :action="uploadUrl" :file-list="form.file_ids" :data="uploadMethod" name="file" :on-success="file_upload_success">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          </div>
          <el-form-item label="事项内容：">
            <tinymce :height="300" v-model="form.content"></tinymce>
          </el-form-item>

          <el-form-item v-if="form.meet_type_id==='1'" label="建议方案：">
            <tinymce :height="300" v-model="form.solution"></tinymce>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col v-if="form.status != 10" :xl="9" :lg="9" :md="18" :offset="2">
        <el-row>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>会议流程：</span>
            </div>
            <el-steps :align-center="true">
              <el-step v-for="(item, index) in workflow" :key="index" :title="item.role_name"></el-step>
            </el-steps>
            <div class="select_content">
              <div v-for="(v, i) in role_user_list" :key="i">
                <label>{{v.placeholder}}：</label>
                <el-select v-model="v.list" multiple :placeholder="v.placeholder" :filterable="true" @change="listChange"
                  @remove-tag="listRemove">
                  <el-option v-for="(user, index) in userList" :key="index" :label="user.label" :value="user.key"
                    :disabled="user.disabled" v-if="user.role_ids.indexOf(String(v.role_id))>-1"></el-option>
                </el-select>
              </div>
            </div>
          </el-card>

        </el-row>
      </el-col>
      <el-col :xl="9" :lg="9" :md="18" :offset="2">
        <el-row class="mt30" style="text-align:center">
          <el-col class="pl30">
            <el-button type="primary" @click="onSubmit(0)">保存</el-button>
            <el-button type="success" @click="onSubmit(1)">提交到流程</el-button>
            <el-button @click="back">返回</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import Tinymce from '@/components/Tinymce'
  import {
    createProposal,
    updateProposal,
    proposalDeatil
  } from '@/api/meeting/proposals'
  import {
    workflowsign
  } from '@/api/meeting/workflow'
  import {
    fetchList
  } from '@/api/user/user'
  import '@/styles/meet-vue-style.scss'
  export default {
    name: 'proposalsEdit',
    data() {
      return {
        uploadMethod: {
          uploadtype: 'other'
        },
        uploadUrl: process.env.UPLOAD_FILE_URL,
        id: null,
        form: {},
        userList: [],
        join_user_list: [],
        workflow: [],
        role_user_list: [],
        is_open: true,
        meet_type_arr: [{
          key: '1',
          name: '党政班子会议'
        },
        {
          key: '2',
          name: '三重一大会议'
        }, {
          key: '3',
          name: '党委会'
        }
        ]
      }
    },
    created() {
      this.id = this.$route.query.id || null
      this.getUserList()
      this.getWorkflow()
    },
    methods: {
      meetTypeChange(val) {
        this.getWorkflow(val)
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
      onSubmit(type) {
        // this.role_user_list.push({
        //   list: this.join_user_list,
        //   role_id: 0
        // })
        this.form.role_user_list = {}
        this.role_user_list.forEach(item => {
          this.form.role_user_list[item.role_id] = item.list.join(',')
        })
        this.form.role_user_list = JSON.stringify(this.form.role_user_list)
        console.log(this.form.role_user_list)
        if (this.is_open) {
          this.form.is_open = 1
        } else {
          this.form.is_open = 0
        }
        this.form.to_workflow = type
        let msg = null
        let doFunc = null
        if (this.id) {
          msg = '更新成功'
          doFunc = updateProposal
        } else {
          msg = '创建成功'
          doFunc = createProposal
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
      getDeatil(id) {
        proposalDeatil(id).then(res => {
          console.log(res)
          this.form = res.data
          this.role_user_list.forEach((item, index) => {
            res.data.role_user_list.forEach(v => {
              if (+v.role_id === +item.role_id) {
                this.role_user_list[index].list = v.list
              }
            })
          })
          if (this.form.is_open === 1) {
            this.is_open = true
          } else {
            this.is_open = false
          }
        })
      },
      getWorkflow(index) {
        this.role_user_list = []
        const TYPE_ID = index === '' || index !== '1' ? 'meet_proposal' : 'meet_proposal_party'
        workflowsign(TYPE_ID).then(res => {
          this.workflow = res.data.detail
          this.workflow.forEach(item => {
            const data = {
              role_id: item.role_id,
              step: item.step,
              list: [],
              placeholder: `请选择${item.role_name}`
            }
            this.role_user_list.push(data)
            console.log(data)
          })
        }).then(() => {
          if (this.id > 0) {
            this.getDeatil(this.id)
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
      },
      file_upload_success(response, file, fileList) {
        this.form.file_ids_arr = []
        fileList.forEach(item => {
          this.form.file_ids_arr.push(item.uid)
        })
      }
    },
    components: {
      Tinymce
    }
  }

</script>
<style lang="scss" scoped>
  .hidden {
    display: none;
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
