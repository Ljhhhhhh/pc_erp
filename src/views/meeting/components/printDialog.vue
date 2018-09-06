<template>
<el-dialog  :visible="visible" :before-close="handleClose" width="800px">
  <div class="container" id="subOutputRank-print">
    <el-row>
      <el-col :span="24">
        <h2 class="title">{{data.meet_type}}</h2>
      </el-col>
      <el-col :span="24">
        <p class="title">(第32周)</p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16" :push="1">
        <span>时间:</span><span class="content">{{data.start_time}}</span>
      </el-col>
      <el-col :span="16" :push="1">
        <span>地点:</span><span class="content">{{data.meet_address}}</span>
      </el-col>
      <el-col :span="23" :push="1">
        <span class="per_lab">出席人员:</span><div class="per_list"><span v-for="(roles, index) in join_user_list" :key="index" class="span_user">{{roles}}</span></div>
      </el-col>
       <el-col :span="23" :push="1">
        <span class="per_lab">缺席人员:</span><div class="per_list"><span v-for="user in unsign_user_list" :key="user" class="span_user">{{user}}</span></div>
      </el-col>
       <el-col :span="23" :push="1">
        <span class="per_lab">列席人员:</span><div class="per_list"><span v-for="user in role_user_list" :key="user" class="span_user">{{user}}</span></div>
      </el-col>
      <el-col :span="23" :push="1">
        <span class="per_lab">其他人员:</span><div class="per_list">{{this.otherPeople}}</div>
      </el-col>
      <el-col :span="23" :push="1">
        <span class="per_lab">记录人员:</span><div class="per_list">{{this.recorder}}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16" :push="1"><h3>一、{{data.meet_type}}相关议题</h3></el-col>
    </el-row>
    <el-row>
      <el-col :span="16" :push="1"><h3>二、龚涛涛书记布置工作</h3></el-col>
      <el-col>
        <ul><li><p></p></li></ul>
      </el-col>
    </el-row>
  </div>
  <el-row>
    <el-col class="print_btn" :span="5" :push="1">
      <el-button  type="success" @click="PrintDialog" v-waves>打印页面</el-button>
    </el-col>
  </el-row>
 
  </el-dialog >
</template>
<script>
import waves from '@/directive/waves/index.js' // 水波纹指令

export default {
  props: {
    parentGroup: {
      type: Object,
      default: function() {
        return {}
      }
    },
    otherPeople: {
      type: ''
    },
    recorder: {
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
  watch: {
    parentGroup: function(val) {
      this.data = val
      const join_user_list = this.data.meet_join_nicknames_leaders
      join_user_list.split(',').forEach(item => {
        this.join_user_list.push(item)
      })
      const role_user_list = this.data.join_user_list_nicknames
      role_user_list.split(',').forEach(item => {
        this.role_user_list.push(item)
      })
      const unsign_user_list = this.data.meet_unsign_nicknames
      unsign_user_list.split(',').forEach(item => {
        this.unsign_user_list.push(item)
      })
    }
  },
  data() {
    return {
      data: {},
      join_user_list: [], // 出席人员
      role_user_list: [], // 列席人员
      unsign_user_list: [] // 缺席人员
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    PrintDialog() {
      var newstr = document.getElementById('subOutputRank-print').innerHTML
      document.body.innerHTML = newstr
      const oldContent = document.body.innerHTML
      document.body.innerHTML = newstr
      window.print()
      window.location.reload()
      document.body.innerHTML = oldContent
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
  .container {
    span {
      line-height: 24px;
    }
    h2,p.title {
      text-align: center;
    }
    span.content {
      padding-left: 10px;
      padding-right: 15px;
    }
    li {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .per_lab {
      float: left;
    }
    .per_list {
      float: left;
      width: 80%;
      line-height: 24px;
      padding-left: 10px; 
      span {
        display: block;
        width: 20%;
        float: left;
      }
    }
    .print_btn {
      margin-top:20px;
      float: right;
    }
  }
  @media print {
    span {
      line-height: 24px;
    }
     h2,p.title {
      text-align: center;
    }
    span.content {
      padding-left: 10px;
      padding-right: 15px;
    }
    li {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .per_lab {
      float: left;
      line-height: 24px;
    }
    .per_list {
      float: left;
      width: 80%;
      line-height: 24px;
      padding-left: 10px; 
      span {
        display: block;
        width: 20%;
        float: left;
      }
    }
  }
</style>

