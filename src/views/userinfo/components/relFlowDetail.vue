<template>
  <div class="detail_info">
    <template v-for="item in relFlowDetailData">
      <p v-if="item.item_type !== 'list'"  :key="item.item_name" class="p">
        <span v-html="item.item_title + ':'"></span>
        <em v-html="item.item_value"></em>
      </p>
    </template>
    <div v-for="(item,index) in listData" :key="index" class="listTable">
      <p class="title">{{item.name}}:</p>
      <p v-for="(val, key) of item.arr" :key="key" class="listDataItem">
        <span v-for="(d, i) in val" :key="i" v-html="d">
          <!-- {{d}} -->
        </span>
      </p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'relFlowDetail',
    props: {
      relFlowDetailData: {
        type: Array,
        required: true
      }
    },
    data() {
      return {

      }
    },
    computed: {
      listData() {
        const listData = []
        this.relFlowDetailData.forEach((item, index) => {
          if (item.item_type === 'list') {
            item.item_value.unshift(item.item_list_title)
            listData.push({
              arr: item.item_value,
              name: item.item_title
            })
          }
        })
        return listData
      }
    }
  }

</script>
<style lang="scss" scoped>
  .detail_info{
    display: flex;
    flex-wrap: wrap;
    &>p.p{
      flex: 1;
      min-width: 25%;
    }
    em {
      display: inline-block;
    }
  }
  .listTable {
    min-width: 100%;
    margin: 0 0 15px;
    p.title{
      font-size: 14px;
      font-weight: normal;
      margin: 0;
    }
    .listDataItem {
      margin: 0;
      display: flex;
      line-height: 30px;
      border-top: 1px solid #CCC;
      &:first-child {
        background: #EEE;
      }
      &:last-child{
        border-bottom: 1px solid #CCC;
      }
      span {
        flex: 1;
        text-align: center;
        border-right: 1px solid #CCC;
        &:first-child{
          border-left: 1px solid #CCC;
        }
      }
    }
  }

</style>
