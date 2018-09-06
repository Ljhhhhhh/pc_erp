<template>
  <div>
    <el-row class="mt30">
      <el-col :span="16" :push="1">
        <p class="title"></p>
      </el-col>
      <el-col :span="5" :push="1">
        <el-button type="success" @click="addPrintProposalsDetail" v-waves>事项详情</el-button>
        <el-button type="success" @click="PrintProposals" v-waves>打印事项</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" :push="1">
        <div class="userList">
          <div class="item_title">事项标题：</div>
          <span>{{form.proposal_title}}</span>
          <div class="item_title">事项领导：</div>
          <span>{{form.apply_nickname}}</span>
          <div class="item_title">事项内容</div>
          <span class="span_user" v-html="form.content"></span>
          <div class="item_title">其他班子成员意见</div>
          <el-table :data="form.meet_proposal_vote_data" border style="width:100%">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="成员名称" width="100">
              <template slot-scope="scope">
                {{scope.row.nickname}}
              </template>
            </el-table-column>
            <el-table-column label="是否通过" width="100">
              <template slot-scope="scope">
                {{proporsals_status_map[scope.row.status]}}
              </template>
            </el-table-column>
            <el-table-column label="成员意见">
              <template slot-scope="scope">
                <template slot-scope="scope">
                  {{scope.row.content}}
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <printProposalsDetail :parent-group="form" :visible.sync="showprintProposalsDeatail"></printProposalsDetail>
    <printClerkProposals :parent-group="form" :visible.sync="showprint"></printClerkProposals>
  </div>
</template>
<script>
  import printProposalsDetail from './printProposalsDetail'
  import printClerkProposals from './printClerkProposals'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {
    proposalDeatil
  } from '@/api/meeting/proposals'
  import {
    fetchList
  } from '@/api/user/user'
  import '@/styles/meet-vue-style.scss'
  export default {
    name: 'proposalsDetail',
    data() {
      return {
        id: null,
        showprintProposalsDeatail: false,
        showprint: false,
        form: {},
        workflow: [],
        screenWidth: document.documentElement.clientWidth,
        is_open: true,
        proporsals_status_map: {
          0: '未表决',
          1: '同意',
          2: '不同意',
          3: '弃权'
        }
      }
    },
    directives: {
      waves
    },
    components: {
      printProposalsDetail,
      printClerkProposals
    },
    created() {
      this.id = this.$route.query.id || null
      // this.getUserList()
      if (this.id > 0) {
        this.getDeatil(this.id)
      }
    },
    methods: {
      PrintProposals() {
        this.showprint = true
      },
      addPrintProposalsDetail() {
        this.showprintProposalsDeatail = true
      },
      getDeatil(id) {
        proposalDeatil(id).then(res => {
          console.log(res)
          this.form = res.data
        })
      }
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
