<template>
  <div>

    <sc-select-tree 
      v-model="model" 
      :data="data" 
      @check-change="checkChange" 
      :default-props="defaultProps"
      filterable 
      show-checkbox 
      ref="tree" 
      clearable>
    </sc-select-tree>

    <el-button @click="setChecked()">设置选中数据</el-button>
    <el-button @click="getChecked()">获取选中数据</el-button>
    <el-button @click="setEmpty()">清空</el-button>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    data() {
      return {
        data: [],
        defaultProps: {
          children: 'treeModels',
          label: 'moduleName',
          nodeKey: 'id'
        },
        model: ''
        // model: '00019007000847,00019007000400,00019007000928,00019007001014,0007900100111257,0007900100111258,0007900100111259,0007900100111260,0007900100111263,0007900100111270,00019007001261,00019007001377,00019007001387,00019007001389,00019007001413,00019007001701,00019007001739,00019007001779,00019007001851,00019007002674,00019007002785,00019007003009,00019007003011,00019007003013,00019007003060,00019007003071,00019007003079,00019007003081,00019007003083,00019007003085,00019007003089,00019007003145,00019007003334,00019007003670,00019007003678,00019007003926,00019007004008,00019007004065,00019007004067,00019007004212,00019007004272,00019007004671,00019007005142,00079001123990,00079001161666,00079001161669,0007900116166912,00079001161669123,00019007168201,00019007168202,00019007168203,00019007168204,00019007168205,00019007511930,00079001799001,00079001799301,00079001888888,00079001899001,00079001999002,0007900800111251,00079008001112565,0007900800111265,0007900800111273,0007900800111274,00079008999004'
      }
    },
    watch: {
      model(val) {
        console.log(val);
      }
    },
    methods: {
      setChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
      getChecked() {
        console.log(this.$refs.tree.getCheckedKeys());
      },
      checkChange(node, parent, all, nodeCheck) {
        console.log(node);
      },
      Change(nodeAll) {
        /*console.log({
          nodeAll: nodeAll
        });*/
      },
      setEmpty() {
        // this.model = '';
      }
    },
    created() {
      axios.get('../JsonData/productTree.json').then((response) => {
        console.log(response);  
        this.data = response.data;
      });
    }
  };
</script>

<style>

</style>
