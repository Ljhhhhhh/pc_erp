<template>
  <el-dialog title="签到情况" :visible="visible" :before-close="handleClose" width="800px">
    <el-row>
      <el-col :span="24">
        <el-table :data="from" border>
          <el-table-column label="签到人员">
            <template slot-scope="scope">
              <span v-for="user in scope.row.sign_user_list" :key="user" class="span_user">{{user}}</span>
            </template>
          </el-table-column>
          <el-table-column label="未签到人员">
            <template slot-scope="scope">
              <span v-for="user in scope.row.unsign_user_list" :key="user" class="span_user">{{user}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      parentGroup: {
        type: Object,
        default: function() {
          return {}
        }
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        from: [{ sign_user_list: [], unsign_user_list: [] }]
      }
    },
    watch: {
      parentGroup(val) {
        const sign_user_list = val.meet_sign_nicknames
        sign_user_list.split(',').forEach(item => {
          this.from[0].sign_user_list.push(item)
        })
        const unsign_user_list = val.meet_unsign_nicknames
        unsign_user_list.split(',').forEach(item => {
          this.from[0].unsign_user_list.push(item)
        })
      }
    },
    methods: {
      handleClose() {
        this.$emit('update:visible', false)
      }
    }
  }

</script>
<style lang="scss" scoped>
  .span_user {
    display: inline-block;
    width: 20%;
    line-height: 24px;
    height: 24px;
  }
</style>
