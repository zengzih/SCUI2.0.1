<template>
<div style='margin: 20px;'>
  <!-- Write your componenttable.vue.vue -->
  <data-table
    :data='tableData'
    :auto-merge='autoMerge'
    @header-click='headerClick'
    @selection-change="selectionChange"
    ref='tableref'
    fixed
    style='width: 100%'>
    <table-col label='合并测试'>
        <table-col
                type='selection'
                width='180'>
        </table-col>
        <table-col
                filterable='filterable'
                prop='date'
                label='日期'
                width=180'>
        </table-col>
        <table-col
                prop='name'
                label='姓名'
                width='180'>
        </table-col>
        <table-col
                prop='address'
                label='地址'>
        </table-col>
    </table-col>
  ></data-table>
</div>
</template>
<script>
import DataTable from './table.vue';
import TableCol from './table-column';

export default {
  data() {
    return {
      tableData: [{
        date: '2016-05-021',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }],
      filterable: true,
      autoMerge: [{fieldName: 'date', startCol: 2, endCol: 4}]  // {fieldName: 'date', startCol: 1, endCol: 1},
    };
  },
  components: {
    DataTable,
    TableCol
  },
  methods: {
    headerClick(col, event, colindex) {
    },
    merCol(list) {
    },
    selectionChange(selction) {
    }
  },
  mounted() {
   // this.$refs.tableref.setTableHeight(200);
  }
};
</script>

<style>

</style>
