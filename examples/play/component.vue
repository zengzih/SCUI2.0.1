<template>
  <div style="padding: 100px;">
    <select-tree ref="sctree"  :data="datas"  filterable  show-checkbox clearable @change="Change" @check-change="checkChange" :default-props="defaultProps" :open-nodes="openNodes" show-popover></select-tree>
    <el-button @click="resetChecked">getNode</el-button>
    <el-button @click="setCheckedKey">setNode</el-button>
    <el-button @click="rest()">重置11</el-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        datas: [],
        model: [],
        defaultProps: {
          labelKey: 'moduleName',
          nodeKey: 'id',
          childKey: 'treeModels'
        },
        openNodes: ['00079001']
      };
    },
    watch: {
      model: {
        handler(val) {
          console.log(val);
        },
        deep: true
      }
    },
    methods: {
        Change(node) {
        },
      checkChange(node, nodeParent, checkAll, checkNode) {
         if (checkNode.node[this.defaultProps.labelKey] == '全部') {
            /*if (checkNode.checked) {
              var result = this.datas.map((item) => {
                return item.id;
              });
              this.$refs.sctree.setCheckedKeys(result);     
            } */
            this.$refs.sctree.setCheckedKeys(['00019001000278', '00019001000466']);
         }
      },
      setCheckedKey() { // 00079001
        this.$refs.sctree.setCheckedKeys(['00019001000278', '00019001000466']);
      },
      rest() {
        /*this.$refs.sctree.setCheckedKeys([]);*/
      },
      resetChecked() {
       console.log(this.$refs.sctree.getCheckedNodes());
      }
    },
    mounted() {
      this.model = [2,3,4,5];
      var _this = this;
      var xhr = new XMLHttpRequest();
      xhr.open('get', 'json/selecttree.json');
      xhr.send();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log(JSON.parse(xhr.response));
            _this.datas = JSON.parse(xhr.response);
            _this.datas.unshift({ moduleName: '全部', treeModels: [], id: '000'});
            setTimeout(()=> {
            //  _this.$refs.sctree.setCheckedKeys(['00019001000278']);
              _this.$refs.sctree.visible = true;
            });
          }
        }
      };

      setTimeout(function() {
        _this.$refs.sctree.openNodeEvent();
      }, 6000)
    }
  }
</script>

<style>

</style>
