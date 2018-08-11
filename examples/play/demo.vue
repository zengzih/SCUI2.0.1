<template>
  <div>
    <el-table :data="tableData" :height="tableHeight" border stripe :config-columns="configColumns" ref="table" :show-config-table="true" @openconfigtable="openconfigtable">
      <el-table-column type="selection" width="50" align="center" origin-id="columnId1"></el-table-column>

      <el-table-column type="index" prop="bbb" width="80" show-overflow-tooltip label="序号" align="center" origin-id="columnId2"></el-table-column>
        
      <el-table-column prop="productName" label="资产组合" show-overflow-tooltip sortable="custom" align="center"  header-align="left" origin-id="columnId4"></el-table-column>
    
      <!-- <el-table-column prop="bizType" label="业务类型" show-overflow-tooltip sortable="custom" align="center"  header-align="left" origin-id="columnId5"></el-table-column>
     -->
     <!-- <el-table-column prop="transferType" label="划款类型" show-overflow-tooltip sortable="custom" align="center"  header-align="left" origin-id="columnId6"></el-table-column> -->

      <el-table-column label="划款类型" show-overflow-tooltip sortable="custom" align="center"  header-align="left" origin-id="columnId6">
        <template scope="scope">
            <div v-if="scope.row.type === 'text'">{{scope.row.text}}</div>
            <el-switch
              v-model="scope.row.visibleBool"
              on-text="是"
              off-text="否"
              :on-value="true"
              :off-value="false"
              v-if="scope.row.type === 'visibleBool'"
            >
            </el-switch>
            <el-input
              type="text"
              size="mini"
              v-model="scope.row.input"
              v-if="scope.row.type === 'input'"
              :change="inputChange"
            ></el-input>
            <el-button
              v-if="scope.row.type === 'btn'"
              @click="cClick"
            >按钮</el-button>
          </template>
      </el-table-column>
    
      <el-table-column prop="seqNo" label="业务流水号" show-overflow-tooltip sortable="custom" min-width="110" align="center"  header-align="left" origin-id="columnId7"></el-table-column>
          
      <el-table-column prop="transferDate" label="划款日期" show-overflow-tooltip sortable="custom" align="center"  header-align="left" origin-id="columnId8"></el-table-column>
          
      <el-table-column prop="instructionDate" label="指令日期" show-overflow-tooltip sortable="custom" min-width="110" align="center"  header-align="left" origin-id="columnId9"></el-table-column>
          
      <el-table-column prop="instructionStatus" label="指令状态" show-overflow-tooltip sortable="custom" min-width="110" align="center"  header-align="left" origin-id="columnId10"></el-table-column>
          
      <el-table-column prop="instructionLevel" label="指令级别" show-overflow-tooltip sortable="custom" min-width="110" align="center"  header-align="left" origin-id="columnId11"></el-table-column>
          
      <el-table-column prop="instructionSource" label="指令来源" show-overflow-tooltip sortable="custom" min-width="110" align="center"  header-align="left" origin-id="columnId12"></el-table-column>
          
      <el-table-column prop="payeeName" label="收款人" show-overflow-tooltip sortable="custom" min-width="110" align="center"  header-align="left" origin-id="columnId13"></el-table-column>
          
      <el-table-column prop="openAcctBrbank" label="收款人开户行" show-overflow-tooltip sortable="custom" min-width="110" align="center"  header-align="left" origin-id="columnId14"></el-table-column>
          
      <el-table-column prop="acctCode" label="收款账号" show-overflow-tooltip sortable="custom" min-width="110" align="center"  header-align="left" origin-id="columnId15"></el-table-column>
          
      <el-table-column prop="transferAmount" label="划款金额" show-overflow-tooltip sortable="custom" min-width="110" align="center"  header-align="left" origin-id="columnId16"></el-table-column>
      
      <el-table-column
        fixed="right"
        label="操作"
        width="120"
        prop="operaColumn"
        origin-id="columnId19">
        <template scope="scope">
          <el-button
            type="text"
            size="small">
            移除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <sc-table-config :config="config" @applyconfig="apply" ref="config" :origin-data="originData"></sc-table-config>
  </div>
</template>

<style>
  body {
    margin:0;
    padding: 0px;
  }
  .sc-skin1>div {
    padding: 50px;
  }
</style>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        tableHeight: 600,
        tableData: [],
        configColumns: [],
        config: [],
        originData: [],
        checked: '',
        ccc: true
      };
    },

    created: function() {
      // console.log(window)
      var _this = this;
      _this.tableHeight = window.innerHeight - 150;

      window.addEventListener('resize', function() {
        _this.tableHeight = window.innerHeight - 150;
      });
    },

    mounted: function() {
      // GET /someUrl
      this.$http.get('/json/data.json').then(response => {

        this.tableData = response.body;

      }, response => {
        // error callback
      });
      // this.originData = this.$refs.table.store.states.originColumns;
      console.log(this);
    },

    methods: {
      aClick() {
        this.ccc = !this.ccc;
      },
      cClick: function() {

      },

      inputChange: function(val) {

      },

      openconfigtable: function() {
        this.$refs.config.openDialog();

        if (this.configColumns.length) {
          this.config = this.configColumns;
        } else {
          this.config = this.$refs.table.store.states.originColumns;
        }
      },

      apply: function(data) {
        this.$refs.config.closeDialog();

        this.configColumns = data;

        this.$nextTick(function() {
          this.$refs.table.doLayout();
          this.$refs.table.doLayout();

        });
      }
    }
  };
</script>
