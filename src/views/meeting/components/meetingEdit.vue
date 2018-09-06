<template>
  <div class="container">

    <el-row class="mt30">
      <el-col :xl="12" :md="24">
        <el-form ref="form" :model="form" label-width="100px" :inline="true">
          <div>
            <el-form-item label="会议类型：">
              <el-select v-model="form.meet_type_id" placeholder="请选择" @change="meetTypeChange">
                <el-option v-for="item in meet_type_arr" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="会议标题：">
            <el-input v-model="meet_title"></el-input>
          </el-form-item>
          <el-form-item label="会议时间：">
            <el-date-picker v-model="form.start_time" type="datetime" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="会议地点：">
            <el-input v-model="form.meet_address"></el-input>
          </el-form-item>
          <el-form-item label="会议事项：">
            <el-select v-model="meet_proposal_ids_arr" placeholder="请选择" multiple>
              <el-option v-for="item in proposals_list" :key="item.id" :label="item.proposal_title" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <div>
            <el-form-item label="是否公开：">
              <el-switch v-model="is_open_bool" active-text="公开" inactive-text="不公开">
              </el-switch>
            </el-form-item>
          </div>
          <br />
          <div>
            <el-form-item v-if="id" label="会议记录：">
              <tinymce :height="360" v-model="form.content"></tinymce>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
      <el-col :xl="10" :md="18" :push="1">
        <!--   -->
        <el-row>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>出席人员：</span>
            </div>
            <el-steps :align-center="true">
              <el-step v-for="(item, index) in workflow" :key="index" :title="item.role_name"></el-step>
            </el-steps>
            <div class="select_content">
              <template v-for="(v, i) in role_user_list">
                <div :key="i" v-if="v.placeholder">
                  <label>{{v.placeholder}}：</label>
                  <el-select v-model="v.list" multiple :placeholder="v.placeholder" :filterable="true" @change="listChange"
                    @remove-tag="listRemove ">
                    <el-option v-for="(user, index) in userList" :key="index" :label="user.label" :value="user.key"
                      v-if="user.role_ids.indexOf(String(v.role_id))>-1" :disabled="user.disabled"></el-option>
                  </el-select>
                </div>
              </template>
            </div>
          </el-card>
        </el-row>
        <el-row class=" mt30">
          <el-col :span="14" type="flex" justify="center">
            <el-transfer filterable v-model="join_user_list" :data="normalList" :titles="['所有人员','列席人员']" :button-texts="['移除列席','选为列席']"></el-transfer>
          </el-col>

          <el-col :span="8">
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
  import '@/styles/meet-vue-style.scss'
  import Tinymce from '@/components/Tinymce'
  import {
    createMeeting,
    updateMeeting,
    meetingEdit,
    meetingTypePerson
  } from '@/api/meeting/meeting'
  import {
    proposalsPassList
  } from '@/api/meeting/proposals'
  import {
    workflowsign
  } from '@/api/meeting/workflow'
  import {
    fetchList
  } from '@/api/user/user'

  export default {
    name: 'meetingEdit',
    data() {
      return {
        uploadMethod: {
          uploadtype: 'other'
        },
        uploadUrl: process.env.UPLOAD_FILE_URL,
        id: null,
        form: {},
        is_open_bool: false,
        userList: [],
        workflow: [],
        proposals_list: [],
        join_user_list: [],
        role_user_list: [],
        proposals_list_id: [],
        file_ids: [],
        normalList: [],
        meet_proposal_ids_arr: [],
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
    computed: {
      meet_title() {
        let meet_title = ''
        const date = new Date()
        const dateFormat = date.toLocaleDateString()
        this.meet_type_arr.forEach(item => {
          if (+item.key === +(this.form.meet_type_id)) {
            meet_title = item.name + dateFormat
          }
        })
        return meet_title
      }
    },
    methods: {
      meetTypeChange(val) {
        this.getProposalsList(val)
        meetingTypePerson(val).then(res => {
          this.role_user_list.forEach((item, index) => {
            res.data !== '' ? res.data.forEach(v => {
              if (+v.role_id === 0) {
                this.join_user_list = v.users_id.split(',').map(v => +v)
              }
              if (+v.role_id === +item.role_id) {
                this.role_user_list[index].list = v.users_id.split(',').map(v => +v)
              }
            }) : ''
          })
        })
      },
      goProposal(id) {
        let query = {}
        if (id) {
          query = {
            id,
            type: 0
          }
        }
        this.$router.push({
          name: 'proposalsEdit',
          query
        })
      },
      getUsername(id) {
        let name = id
        this.userList.forEach(item => {
          if (item.key === id) {
            name = item.label
            return name
          }
        })
        return name
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
      file_upload_success(response, file, fileList) {
        this.form.file_ids_arr = []
        fileList.forEach(item => {
          this.form.file_ids_arr.push(item.uid)
        })
      },
      onSubmit(type) {
        this.form.meet_title = this.meet_title
        this.role_user_list.push({
          list: this.join_user_list,
          role_id: 0
        })
        if (this.is_open_bool === true) {
          this.form.is_open = 1
        } else {
          this.form.is_open = 0
        }
        this.form.role_user_list = {}
        this.role_user_list.forEach(item => {
          this.form.role_user_list[item.role_id] = item.list.join(',')
        })
        this.form.role_user_list = JSON.stringify(this.form.role_user_list)
        this.form.to_workflow = type
        this.form.meet_proposal_ids = this.meet_proposal_ids_arr.join(',')
        if (this.form.file_ids_arr && this.form.file_ids_arr.length > 0) {
          this.form.file_ids = this.form.file_ids_arr.join(',')
        }
        let msg = null
        let doFunc = null
        if (this.id) {
          msg = '更新成功'
          doFunc = updateMeeting
        } else {
          msg = '创建成功'
          doFunc = createMeeting
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
        meetingEdit(id).then(res => {
          this.form = res.data
          this.is_open_bool = this.form.is_open === 1
          this.form.start_time_unix = +new Date(this.form.start_time) || +new Date()
          res.data.join_user_list && res.data.join_user_list.forEach(item => {
            this.join_user_list.push(+item)
          })
          this.role_user_list.forEach((item, index) => {
            res.data.role_user_list.forEach(v => {
              if (+v.role_id === +item.role_id) {
                this.role_user_list[index].list = v.list
              }
            })
          })
          res.data.meet_proposal_ids.split(',').forEach(item => {
            if (item !== '') {
              this.meet_proposal_ids_arr.push(+item)
            }
          })
        })
      },
      getWorkflow() {
        workflowsign('meet').then(res => {
          this.workflow = res.data.detail
          this.workflow.forEach(item => {
            const data = {
              role_id: item.role_id,
              step: item.step,
              list: [],
              placeholder: `请选择${item.role_name}`
            }
            this.role_user_list.push(data)
          })
        }).then(() => {
          const data = {
            page: 1,
            page_size: 1e4,
            search_key: ''
          }
          fetchList(data).then(res => {
            this.role_user_list.forEach(item => {
            })
            res.data.forEach(v => {
              if (v.role_ids.split(',').indexOf('3') < 0 && v.role_ids.split(',').indexOf('10') < 0 && v.role_ids.split(',').indexOf('1') < 0) {
                this.normalList.push({
                  key: v.id,
                  label: v.nickname,
                  role_ids: v.role_ids.split(','),
                  disabled: false
                })
              } else if (v.role_ids.split(',').indexOf('3') > -1) {
                this.role_user_list[0].list.push(v.id)
              } else if (v.role_ids.split(',').indexOf('10') > -1) {
                this.role_user_list[1].list.push(v.id)
              }
            })
          })
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
      getProposalsList(index) {
        this.proposals_list =
        this.meet_proposal_ids_arr = []
        proposalsPassList().then(res => {
          res.data.forEach(item => {
            if (item.meet_type_id === (index / 1)) {
              this.proposals_list.push(item)
              this.id === null ? this.meet_proposal_ids_arr.push(item.id) : ''
            }
          })
        })
      }
    },
    components: {
      Tinymce
    }
  }
</script>
<style lang="scss" scoped>
  .container {
    margin-bottom: 30px;

    .pr30 {
      float: right;
      padding-right: 30px;
    }
  }

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
