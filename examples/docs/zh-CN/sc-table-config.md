<script>
  export default {
    data() {
      return {
        tableHeight: 600,
        tableData: [],
        configColumns: [],
        config: [],
        dialogTableVisible: false
      };
    },

    created: function() {
      /*var _this = this;
      _this.tableHeight = window.innerHeight - 150;

      window.addEventListener('resize', function() {
        _this.tableHeight = window.innerHeight - 150;
      });*/
    },

    mounted: function() {
      // GET /someUrl
      this.$http.get('/json/data.json').then(response => {

        this.tableData = response.body;

      }, response => {
        // error callback
      });
    },

    methods: {
      openconfigtable: function() {
        this.dialogTableVisible = true;

        var ajaxData = false;
        //判断为true的时候不是第一次加载
        if (this.configColumns.length) {
          this.config = this.configColumns;
        } else {
          //第一次加载
          if (ajaxData) {
            //-----服务器返回数据
          } else {
            this.config = this.$refs.table.store.states.originColumns;
          }
        }
      },

      applyconfig: function(data) {
        this.dialogTableVisible = false;
        
        //应用配置
        this.configColumns = data;
        //更新table
        this.$nextTick(function () {
          this.$refs.table.doLayout();
        });
      }
    }
  };
</script>
## ScTableConfig 可配置列的表格

### demo
:::demo 可配置表格，分为显示表格和配置表格。显示表格按照普通的table配置，配置表格使用组件“sc-table-config” 。使用如下
```html
<template>
  <div>
    <el-table :data="tableData" :height="tableHeight" border stripe :config-columns="configColumns" ref="table" :show-config-table="true" @openconfigtable="openconfigtable">
      <el-table-column type="selection" width="36" align="center"></el-table-column>

      <el-table-column type="index" show-overflow-tooltip label="序号" width="65" align="center"></el-table-column>
    
      <el-table-column prop="instructionNo"  label="指令编号" show-overflow-tooltip sortable="custom" min-width="110" align="center"  header-align="left"></el-table-column>
    
      <el-table-column prop="transferRemark" label="划款备注" show-overflow-tooltip sortable="custom" min-width="110" align="center"  header-align="left" ></el-table-column>
    
      <el-table-column prop="transferUse" label="划款用途" show-overflow-tooltip sortable="custom" min-width="110" align="center"  header-align="left" ></el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="120"
        prop="operaColumn">
        <template scope="scope">
          <el-button
            type="text"
            size="small">
            移除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog
      class="el-sc-table-configurable-dialog"
      title="表格布局设置"
      :visible.sync="dialogTableVisible"
      size="small"
    >
      <sc-table-config :config="config" @applyconfig="applyconfig"></sc-table-config>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tableHeight: 600,
        tableData: [],
        configColumns: [],
        config: [],
        dialogTableVisible: false
      };
    },

    created: function() {
      /*var _this = this;
      _this.tableHeight = window.innerHeight - 150;

      window.addEventListener('resize', function() {
        _this.tableHeight = window.innerHeight - 150;
      });*/
    },

    mounted: function() {
      // GET /someUrl
      this.$http.get('/json/data.json').then(response => {

        this.tableData = response.body;

      }, response => {
        // error callback
      });
    },

    methods: {
      openconfigtable: function() {
        this.dialogTableVisible = true;

        var ajaxData = false;
        //判断为true的时候不是第一次加载
        if (this.configColumns.length) {
          this.config = this.configColumns;
        } else {
          //第一次加载
          if (ajaxData) {
            //-----服务器返回数据
          } else {
            this.config = this.$refs.table.store.states.originColumns;
          }
        }
      },

      applyconfig: function(data) {
        this.dialogTableVisible = false;
        
        //应用配置
        this.configColumns = data;
        //更新table
        this.$nextTick(function () {
          this.$refs.table.doLayout();
        });
      }
    }
  };
</script>
```
:::

### el-table配置参数
| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| configColumns | 表格的配置列数据| Aarry       |                       |         |
|show-config-table | 打开配置列表的按钮 | Boolean   | true,false            | false   |
| openconfigtable  | 打开配置列表的事件 | Function  |                       |         |

 使用说明： 
1.点击配置按钮的时候会调用openconfigtable方法，
这个时候请求ajax数据，如果服务器返回数据请赋数据给sc-table-config组件的config属性，
如果服务器没有返回请获取表格的数据，使用this.$refs.table.store.states.originColumns得到数据，然后赋给sc-table-config组件;
如上
2.配置的时候有个要求，右边的配置列也需要配置一个prop属性，并且只能为唯一值"operaColumn"。
3.el-table组件必须加ref属性，并且和this.$refs.table.store.states.originColumns中的$refs.(属性)   的属性一致。
4.ajax接受的sc-table-config字段说明：
必须字段 columnId 、 label 、 fixed 、 visible 、 property  ，如果有CheckBox，必须保存它的selection属性，如果最后面有操作列必须保存它的operation属性。


### sc-table-config配置参数
| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| config        | 配置表格的数据  | Aarry           |                       |         |
|applyconfig    | 应用配置的事情  | Function        |                       |         |

 使用说明：
 应用配置的时候，需要把配置数据赋值给el-table组件，请调用applyconfig方法，然后把数据赋给el-table组件的configColumns属性。并且执行如上更新代码
