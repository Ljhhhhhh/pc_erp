<template>
<div class="container">
    <el-row class="mt30">
      <el-col :span=6>
        <el-tree
          :data="nodesTree"
          show-checkbox
          default-expand-all 
          node-key="id" 
          ref="tree" 
          highlight-current 
          :props="defaultProps"
          @check='checked'
          >
        </el-tree>
      </el-col>
    </el-row>
    <el-button @click="submit" class="btn" type="success" icon="el-icon-check">确定</el-button>
    <router-view></router-view>
</div>
</template>


<script>
  import { getNodesTree } from '@/api/user/user_nodes'
  import { roleAuth, getAuth } from '@/api/user/role'

  export default {
    data() {
      return {
        checkedNode: '',
        checkedKeys: [],
        nodesTree: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    created() {
      this.getNodesTree()
      this.getUserAuth()
    },
    methods: {
      submit() {
        console.log(this.$route)
        const id = this.$route.query.id
        const data = {
          role_id: id,
          node_ids: this.checkedNode
        }
        roleAuth(data).then(res => {
          if (res.code === 200) {
            this.$message.success('保存成功')
            this.$destroy()
          }
        })
      },
      checked(checknode, checkData) {
        this.checkedNode = checkData.checkedKeys.join(',')
      },
      getNodesTree() {
        getNodesTree().then(res => {
          this.nodesTree = res.data
        })
      },
      getUserAuth() {
        const query = {
          role_id: this.$route.query.id
        }
        getAuth(query).then(res => {
          if (res.code === 200) {
            this.checkedKeys = res.data.map(v => parseInt(v))
            this.$refs.tree.setCheckedKeys(this.checkedKeys)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
 .container{
   margin: 30px;
   .btn{
     margin-top: 15px;
   }
 }
</style>
