<template>
  <el-row>
    <el-row class="mt30">
      <el-col class="pl30">
        <el-button type="success" @click="back">返回</el-button>
      </el-col>
    </el-row>
    <div class="app-container container calendar-list-container " id="proposalsDetail-print">
      <el-row :gutter="10" style="margin-top:10px;">
        <el-col :span="16">
          <el-row class="border">
            <el-col :span="5">
              <span>提交事项</span>
            </el-col>
            <el-col :span="19">
              <span class="last_one">{{data.proposal_title}}</span>
            </el-col>
          </el-row>
          <el-row class="border border-top">
            <el-col :span="5">
              <span>提交人</span>
            </el-col>
            <el-col :span="7">
              <span>{{data.apply_nickname}}</span>
            </el-col>
            <el-col :span="5">
              <span>决策结果</span>
            </el-col>
            <el-col :span="7">
              <span class="last_one">{{pass_status_map[data.pass_status]}}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="16">
          <el-row class="border border-top">
            <label>事项内容:</label>
            <span class="content_span" v-html="data.content"></span>
          </el-row>
        </el-col>
        <el-col :span="16">
          <el-row class="border border-top">
            <el-col :span="5">
              <span>交办人</span>
            </el-col>
            <el-col :span="19">
              <span class="last_one">{{data.designated_uid_nickname}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="border border-top">
              <span class="last_one">任务进度
                <el-button v-if="is_designated === 1" type="success" @click="proposalsUpdate()">保存</el-button>
              </span>
            </el-col>
            <el-col :span="24">
              <span class="last_one">
                <el-input type="textarea" autosize :readonly=" is_designated !== 1" v-model="data.designated_rate"></el-input>
              </span>
            </el-col>
          </el-row>
          <el-row v-if="is_designated === 1" class="border border-top">
            <el-col :span="5">
              <span>是否完成</span>
            </el-col>
            <el-col :span="19">
              <el-button style="margin-left:20px;" @click="endProposals(1)" type="success" v-waves>是</el-button>
              <el-button type="success" @click="endProposals(2)" v-waves>否</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-row>

</template>
<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import '@/styles/meet-vue-style.scss'
  import {
    proposalDeatil
  } from '@/api/meeting/proposals'
  import {
    proposalsUpdateRate,
    proposalsEnd
  } from '@/api/meeting/proposals_date'
  import {
    mapGetters
  } from 'vuex'
  export default {
    directives: {
      waves
    },
    data() {
      return {
        data: {},
        id: null,
        form: {},
        is_designated: 0,
        pass_status_map: {
          0: '未使用',
          1: '通过',
          2: '不通过'
        }
      }
    },
    created() {
      this.id = this.$route.query.id || null
      // this.getUserList()
      if (this.id > 0) {
        this.getDeatil(this.id)
      }
      console.log(this.is_designated)
    },
    computed: {
      ...mapGetters([
        'userinfo'
      ])
    },
    methods: {
      getDeatil(id) {
        proposalDeatil(id).then(res => {
          this.data = res.data
          if (this.userinfo.id === this.data.designated_uid) {
            this.is_designated = 1
          }
        })
      },
      back() {
        this.$router.back()
      },
      endProposals(designated_status) {
        proposalsEnd(designated_status, this.id).then((res) => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.$emit('endProposals')
            this.$router.back()
            return
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      proposalsUpdate() {
        proposalsUpdateRate(this.data.designated_rate, this.id).then((res) => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.$emit('endProposals')
            this.$router.back()
            return
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }

</script>
<style lang="scss" scoped>
  .container {
    span {
      line-height: 24px;
    }
    .border {
      border: 1px solid #cccccc;
      line-height: 36px;
      span {
        display: block;
        width: 100%;
        text-align: center;
        line-height: 36px;
        border-right: 1px solid #cccccc;
      }
      .last_one {
        border: none;
      }
      label {
        float: left;
        padding-left: 10px;
        font-weight: normal;
        line-height: 24px;
      }
      .content_span {
        float: left;
        width: auto;
        min-height: 100px;
        line-height: 24px;
        padding-left: 10px;
        text-align: left;
        overflow: hidden;
        display: block;
        border: none;
        p {
          padding: 0;
          margin: 0;
        }
      }
    }
    .border-top {
      border-top: none;
    }
    .print_btn {
      margin-top: 20px;
      float: right;
    }
  }

</style>
