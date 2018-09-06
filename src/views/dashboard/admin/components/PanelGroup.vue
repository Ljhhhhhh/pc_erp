<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' @click="goUserinfo">
        <div class="card-panel-icon-wrapper " style="padding:0;">
            <div class="personimg">
              <img :src="avatar" width="80">
            </div>

        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{userinfo.nickname}}</div>
          <p>{{role_name}}</p>
          <p>查看个人信息</p>
         <!--  <count-to class="card-panel-num" :startVal="0" :endVal="部门-职位" :duration="2600"></count-to> -->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
            <div class="card-panel-text">我的审批</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="81212" :duration="3000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel"  @click="goTodo">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="todo" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('route.todo')}}</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="todo_num" :duration="3200"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel"  @click="goDone">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <svg-icon icon-class="done" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('route.done')}}</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="done_num" :duration="3600"></count-to>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { mapGetters } from 'vuex'
import { work_num } from '@/api/user/todo'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      done_num: 0,
      todo_num: 0
    }
  },
  created() {
    this.getWorkNum()
  },
  methods: {
    getWorkNum() {
      work_num().then(res => {
        this.done_num = res.data.done_num
        this.todo_num = res.data.doing_num
      })
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    goUserinfo() {
      this.$router.push({
        path: '/userinfo/index'
      })
    },
    goTodo() {
      this.$router.push({
        path: '/todo/index'
      })
    },
    goDone() {
      this.$router.push({
        path: '/done/index'
      })
    }
  },
  computed: {
    ...mapGetters([
      'userinfo'
    ]),
    avatar() {
      return process.env.BASE_API + this.userinfo.headimg
    },
    role_name() {
      return this.userinfo.roles.join(',')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    .personimg{ width:80px; height:80px; border-radius:50%; overflow:hidden; border:1px solid #ccc; }
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3;
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 16px 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 20px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
