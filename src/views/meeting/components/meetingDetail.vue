<template>
  <div>
    <el-row class="mt30">
      <el-col :span="16" :push="1">
        <span class="title">{{data.meet_type}}</span>
        <el-button type="success" v-if="isAdmin == 1" @click="endMeeting" v-waves>会议结束</el-button>
      </el-col>
      <el-col :span="5" :push="1">
        <el-button type="success" @click="addDetailDialog" v-waves>签到情况</el-button>
        <el-button type="success" @click="addPrintDialog" v-waves>打印会议</el-button>
        <el-button type="success" @click="addPrintProposals" v-waves>打印事项</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="9" :push="1">
        <div class="userList">
          <div class="item_title">会议地点：</div>
          <span>{{data.meet_address}}</span>
          <div class="item_title">会议时间：</div>
          <span>{{data.start_time}}</span>
          <div class="item_title">出席人员：</div>
          <span v-for="user in join_user_list" :key="user" class="span_user">{{user}}</span>
          <div class="item_title">列席人员：</div>
          <span v-for="(roles, index) in role_user_list" :key="index" class="span_user">{{roles}}</span>
          <div class="item_title">其他人员：</div>
          <el-input type="textarea" autosize placeholder="其他人员" @blur="change()" v-model="other_people">
          </el-input>
          <div class="item_title">记录人员：</div>
          <el-input placeholder="记录人员" v-model="recorder"></el-input>
          <div class="item_title">{{meetLog[isMeetType]}}
            <el-button type="success" v-if="isAdmin == 1" @click="editMeetLog(isedit)" v-waves v-html="btnText[isedit]"></el-button>
          </div>
          <el-input v-if="isedit == 0" type="textarea" autosize placeholder="请输入内容" v-html="meetlog">
          </el-input>
          <tinymce v-if="isedit == 1" :height="360" v-model="data.meet_content"></tinymce>
        </div>
      </el-col>
      <el-col :span="12" :push="2" class="userList">
          <div class="item_title">会议事项：</div>
          <el-table :data="data.meet_proposal_data" stripe border>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="提交事项">
              <template slot-scope="scope">
                {{scope.row.proposal_title}}
              </template>
            </el-table-column>
            <el-table-column label="提交领导" width="100">
              <template slot-scope="scope">
                {{scope.row.apply_nickname}}
              </template>
            </el-table-column>
            <el-table-column label="表决比例/(未表决:同意:不同意:弃权)" width="180" :render-header="renderheader">
              <template slot-scope="scope">
                {{scope.row.abstention_vote+':'+scope.row.agree_vote+':'+scope.row.oppose_vote+':'+scope.row.not_vote}}
              </template>
            </el-table-column>
            <el-table-column label="事项状态" width="100">
              <template slot-scope="scope">
                {{proposal_status_map[scope.row.status]}}
              </template>
            </el-table-column>
            <el-table-column label="负责人" width="100">
              <template slot-scope="scope">
                {{scope.row.designated_uid_nickname}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-view" type="success" @click="goProposal(scope.row.id)">
                </el-button>
                <el-button v-if="isAdmin == 1" size="mini" type="success" @click="dealProposal(scope.row)">
                  处理
                </el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-col>
    </el-row>
    <signDetailDialog :parent-group="data" :visible.sync="showSignDetailDialog"></signDetailDialog>
    <printDialog :parent-group="data" :other-people="other_people" :recorder="recorder" :visible.sync="showPrintDialog"></printDialog>
    <printProposals :parent-group="data" :visible.sync="showprintProposals"></printProposals>
    <DealProposal :parent-group="row" :proposal-id="proposalId" :visible.sync="showDealProposal" @assignProposal="meetingDetail"></DealProposal>
  </div>
</template>
<script>
  import '@/styles/meet-vue-style.scss'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import Tinymce from '@/components/Tinymce'
  import printDialog from './printDialog.vue'
  import printProposals from './printProposals'
  import DealProposal from './dealProposal'
  import signDetailDialog from './signDetailDialog'
  import {
    mapGetters
  } from 'vuex'
  import {
    meetingEdit,
    editMeetingLog,
    endMeetingLog
  } from '@/api/meeting/meeting'
  import ErrorMsg from '@/utils/error'
  import {
    fetchList
  } from '@/api/user/user'

  export default {
    directives: {
      waves
    },
    components: {
      Tinymce,
      printDialog,
      printProposals,
      DealProposal,
      signDetailDialog
    },
    data() {
      return {
        data: {},
        isedit: 0,
        isAdmin: 0,
        btnText: {
          0: '编辑',
          1: '保存'
        },
        other_people: '',
        recorder: '',
        proposals_list: [],
        join_user_list: [],
        role_user_list: [],
        meetlog: '',
        isMeetType: '',
        row: {},
        meet_proposal_ids_arr: [],
        showPrintDialog: false,
        showprintProposals: false,
        showDealProposal: false,
        showSignDetailDialog: false,
        proposalId: '',
        meetLog: {
          0: '会议记录',
          1: '工作布置'
        },
        proposal_status_map: {
          0: '草稿',
          1: '流程中',
          10: '流程完成',
          11: '事项进行中',
          20: '事项'
        }
      }
    },
    computed: {
      ...mapGetters([
        'userinfo'
      ])
    },
    created() {
      this.meetingDetail()
      this.isAdmin = this.userinfo.id
    },
    methods: {
      change() {
        console.log(this.other_people)
      },
      renderheader(h, {
        column,
        $index
      }) {
        return h('span', {}, [
          h('span', {}, column.label.split('/')[0]),
          h('br'),
          h('span', {}, column.label.split('/')[1])
        ])
      },
      endMeeting() {
        const id = this.$route.query.id
        const _this = this
        endMeetingLog(this.data.meet_content, id).then((res) => {
          if (res.code === 200) {
            _this.$message.success('成功结束会议')
            _this.$emit('endMeeting')
            _this.meetingDetail()
            return
          } else {
            _this.$message.error(res.msg)
          }
        })
        this.isedit = 0
      },
      editMeetLog(ins) {
        const _this = this
        if (ins === 0) {
          this.isedit = 1
        } else {
          const id = this.$route.query.id
          editMeetingLog(this.data.meet_content, id).then((res) => {
            if (res.code === 200) {
              _this.$message.success('编辑成功')
              _this.$emit('editMeetLog')
              _this.meetingDetail()
              return
            } else {
              _this.$message.error(res.msg)
            }
          })
          this.isedit = 0
        }
      },
      addDetailDialog() {
        this.showSignDetailDialog = true
      },
      addPrintDialog() {
        this.showPrintDialog = true
      },
      dealProposal(row) {
        this.proposalId = row.id
        this.row = row
        this.showDealProposal = true
      },
      addPrintProposals() {
        this.showprintProposals = true
      },
      meetingDetail() {
        const id = this.$route.query.id
        meetingEdit(id).then(res => {
          this.join_user_list = []
          this.role_user_list = []
          ErrorMsg(res)
          this.data = res.data
          this.meetlog = this.data.meet_content.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          this.data.meet_content = this.data.meet_content.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          const join_user_list = this.data.meet_join_nicknames_leaders
          join_user_list.split(',').forEach(item => {
            this.join_user_list.push(item)
          })
          const role_user_list = this.data.join_user_list_nicknames
          role_user_list.split(',').forEach(item => {
            this.role_user_list.push(item)
          })
          this.isMeetType = res.data.meet_type_id === '1' ? 1 : 0
          res.data.meet_proposal_ids.split(',').forEach(item => {
            if (item !== '') {
              this.meet_proposal_ids_arr.push(+item)
            }
          })
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
      getUsername(id) {
        let name = id
        this.userList.forEach(item => {
          if (item.key === id) {
            name = item.label
            return name
          }
        })
        return name
      }
    }
  }

</script>
<style lang="scss" scoped>
  .userList {
    div.item_title {
      padding-left: 15px;
      font-size: 1.2em;
      color: #007ad7;
      position: relative;
      margin: 20px 0 10px;

      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 0;
        border-left: 5px solid #007ad7;
      }

      small {
        font-size: 0.7em;
      }
    }

    span.span_user {
      display: inline-block;
      padding: 0 5px;
      line-height: 25px;
    }
  }

  button.title {
    margin-left: 20%;
    padding: 4px 6px;
    border-radius: 4px;
    background-color: #2fa6ff;
    border: 1px solid #cccccc;
    color: white;
  }

</style>
