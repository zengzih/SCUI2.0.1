<template>
  <div>
    <sc-table-config :column="scConfigColumn" :config="config" :origin-data="tableData" @applyconfig="applyconfig" ref="tableConfig"></sc-table-config>
    <el-table :data="tableData" @openconfigtable="openconfigtable" highlight-current-row :config-columns="configColumns" ref="table" show-config-table style="width: 100%">
      <el-table-column v-for="item in column" :origin-id="item.prop" :prop="item.prop" :label="item.label" min-width="500" :fixed="getFixed(item)">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        config: [],
        originData: [],
        column: [
          { prop: 'name', label: '姓名', menuState: true },
          { prop: 'province', label: '省份', menuState: false },
          { prop: 'city', label: '市区', menuState: true },
          { prop: 'address', label: '地址', menuState: true },
          { prop: 'zip', label: '邮编', fixed: "right", menuState: false },
        ],
        autoRowMerge: [
          { fieldName: 'name', startCol: 1, endCol: 2 }
        ],
        configColumns: [],
        scConfigColumn: [
          { label: '菜单名称', prop: 'date' },
          { label: '默认展开', prop: 'name', render(h, params) {
            return h('ElSwitch', {
              domProps: {
                value: params.menuState
              },
              on: {
                input: function (event) {
                  console.log(event);
                  self.$emit('input', event.target.value)
                }
              }
            })
          } }
        ],
        tableData: [
          {
            date: '2016-05-03',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333,
            menuState: true
          }, {
            date: '2016-05-02',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333,
            menuState: true
          }, {
            date: '2016-05-04',
            menuState: true,
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-01',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333,
            menuState: false
          }, {
            date: '2016-05-08',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333,
            menuState: true
          }, {
            date: '2016-05-06',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333,
            menuState: false
          }, {
            date: '2016-05-07',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333,
            menuState: false
          }
        ]
      };
    },
    watch: {},
    computed: {},
    created() {
      this.config = this.column;
      this.column.forEach((item) => {
        this.$set(item, 'fixed', item.fixed === undefined ? 'nulls' : item.fixed);
        this.$set(item, 'originId', item.prop);
        this.$set(item, 'visible', 1);
        this.$set(item, 'visibleBool', true);
      });
      // { "fixed": "nulls", "format": "", "id": "", "label": "编号", "originId": "index", "property": "--", "selection": false, "selectionInt": 0, "tableCode": "", "userId": "", "viewOrder": null, "visible": 1, "visibleBool": true, "width": null },
      this.originData = this.column;
    },
    mounted() {
    },
    methods: {
      getFixed(item) {
        if (item.fixed !== 'nulls') {
          return item.fixed;
        } else {
          return false;
        }
      },
      openconfigtable() {
        this.$refs.tableConfig.openDialog();
      },
      applyconfig(data) {
        // this.column.forEach((item) => {
        //   data.forEach((con) => {
        //     if (item.prop === con.originId) {
        //       this.$set(item, 'fixed', con.fixed);
        //     }
        //   })
        // })
        this.$refs.tableConfig.closeDialog();
        this.configColumns = data;
        this.$nextTick(() => {
          this.$refs.table.doLayout();
        })
      }
    }
  };
  // {"fixed":"nulls","format":"","id":"","label":"编号","originId":"index","property":"--","selection":false,"selectionInt":0,"tableCode":"","userId":"","viewOrder":null,"visible":1,"visibleBool":true,"width":null},
</script>

<style>

</style>