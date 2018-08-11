<template>
  <div>
    <sc-drag ref="drag" :height="height">
      <div slot="leftSlot">
        <el-table :data="tableData" border style="width: 100%" @row-click="handlerRowClick">
          <el-table-column prop="date" label="日期" width="180">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
        </el-table>
      </div>
      <div slot="rightSlot"></div>
    </sc-drag>
   <!-- <el-button @click="showPane">展开</el-button>
    <el-button @click="showPaneR">收缩</el-button>-->
    <el-button @click="rest()">重置</el-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        height: '500'
      };
    },
    watch: {},
    computed: {},
    created() {
    },
    mounted() {
    },
    methods: {
      handlerRowClick() {
        this.$refs.drag.showPanel('right');
      },
      rest() {
        this.$refs.drag.showPanel('left');
      },
      showPane() {
        this.$refs.drag.showPanel('right');
      },
      showPaneR() {
        this.$refs.drag.showPanel('left');
      }
    }
  };
</script>

<style>

</style>