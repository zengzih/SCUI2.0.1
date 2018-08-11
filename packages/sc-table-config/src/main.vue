<template>
  <div class="el-sc-table-config"
       :class="{isHiddenFixedFirst: isHiddenFixedFirst, isHiddenFixedLast: isHiddenFixedLast}">
    <el-dialog
      :title="title"
      :visible.sync="dialogTableVisible"
      :size="size"
    >
      <el-table :data="filterConfig" border stripe
                @row-click="rowClick"
                :height="configHeight"
                highlight-current-row
      >

        <!-- <el-table-column property="property" label="字段编码" show-overflow-tooltip></el-table-column> -->

        <el-table-column label="序号" align="center" width="60">
          <template scope="scope">
            <div>{{calcIndex(scope.$index)}}</div>
          </template>
        </el-table-column>

        <el-table-column label="字段名称">
          <template scope="scope">
            <el-input
              type="text"
              size="mini"
              v-model="filterConfig[scope.$index].label"
              v-if="!filterConfig[scope.$index].selection && !filterConfig[scope.$index].operation && !filterConfig[scope.$index].index"
            ></el-input>
            <div v-else>{{filterConfig[scope.$index].label}}</div>
          </template>
        </el-table-column>

        <el-table-column property="visibleBool" label="可见">
          <template scope="scope">
            <el-switch
              v-model="filterConfig[scope.$index].visibleBool"
              on-text="是"
              off-text="否"
              :on-value="true"
              :off-value="false"
              v-if="setVisible(scope.$index)">
            </el-switch>
          </template>
        </el-table-column>

        <!-- <el-table-column label="显示顺序">
          <template scope="scope">
            <div v-if="setVisible(scope.$index)">
              <el-button type="text"
                @click.stop="handleOrder(scope.$index, 'up')"
                :class="setClass(scope.$index, 'up')">
                <i class="el-icon-arrow-up"></i>
              </el-button>
              <el-button type="text"
                @click.stop="handleOrder(scope.$index, 'down')"
                :class="setClass(scope.$index, 'down')">
                <i class="el-icon-arrow-down"></i>
            </el-button>
            </div>
          </template>
        </el-table-column> -->

        <el-table-column label="是否固定">
          <template scope="scope">
            <el-select v-model="filterConfig[scope.$index].fixed" placeholder="请选择" v-if="setVisible(scope.$index)"
                       @click.stop>
              <el-option
                key="nulls"
                label="不固定"
                value="nulls">
              </el-option>
              <el-option
                key="left"
                label="左固定"
                value="left">
              </el-option>
              <el-option
                key="right"
                label="右固定"
                value="right">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

      </el-table>
      <div class="bottom-actions" slot="footer">
        <div class="btn-quick">
          <span class="item-btn" @click="moveTop">
            <i class="el-icon-arrow-up"></i><span>上移</span>
          </span>
          <span class="item-btn" @click="moveBottom">
            <i class="el-icon-arrow-down"></i><span>下移</span>
          </span>
          <span class="item-btn" @click="theTop">
            <i class="el-icon-caret-top"></i><span>置顶</span>
          </span>
          <span class="item-btn" @click="theBottom">
            <i class="el-icon-caret-bottom"></i><span>置底</span>
          </span>
        </div>
        <el-button type="primary" @click="apply">保存布局</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scope="true">
  .noClick .el-icon-arrow-up, .noClick .el-icon-arrow-down {
    color: #bfc1d9;
  }

  .isHiddenFixedFirst .el-table__body-wrapper .el-table__body tbody > tr:first-child {
    display: none;
  }

  .isHiddenFixedLast .el-table__body-wrapper .el-table__body tbody > tr:last-child {
    display: none;
  }

  .btn-quick {
    display: inline-block;
    margin-right: 10px;
  }

  .btn-quick .item-btn {
    margin-right: 20px;
    cursor: pointer;
  }

  .btn-quick .item-btn span {
    margin-left: 4px;
  }

  .el-table__body tr.current-row > td {
    background: #b89047;
    color: #fff;
  }

  .el-sc-table-config .el-input__inner {
    border: none;
    background: inherit;
  }
</style>

<script>
  export default {
    name: 'ScTableConfig',
    props: {
      config: {
        type: Array,
        default: function() {
          return [];
        }
      },
      size: {
        type: String,
        default: 'small'
      },
      title: {
        type: String,
        default: '表格布局设置'
      },
      originData: {
        type: Array
      },
      configHeight: {
        type: [String, Number],
        default() {
          return '400';
        }
      }
    },

    data: function() {
      return {
        upNoClick: '',
        downNoClick: '',
        filterConfig: [],
        dialogTableVisible: false,
        isHiddenFixedFirst: false,
        isHiddenFixedLast: false,
        rowId: '',
        isWactch: true
      };
    },

    watch: {
      filterConfig: {
        handler: function(val) {
          if (this.isWactch) {
            this.sortTable(val);
          }
        },
        deep: true
      },

      config: {
        handler: function(val) {
          this.filterData();
        },
        deep: true
      }
    },

    methods: {
      calcIndex: function(index) {
        if (this.filterConfig[0].selection) {
          return index;
        } else {
          return index + 1;
        }
      },
      moveTop: function() {
        for (var i = 0; i < this.filterConfig.length; i++) {
          if (this.filterConfig[i].originId === this.rowId) {
            if ((this.filterConfig[0].selection && i === 1) || i <= 0) {

            } else {
              this.filterConfig.splice(i - 1, 1, ...this.filterConfig.splice(i, 1, this.filterConfig[i - 1]));
            }
            break;
          }
        }
      },
      moveBottom: function() {
        for (var i = 0; i < this.filterConfig.length; i++) {
          if (this.filterConfig[i].originId === this.rowId) {
            if (this.filterConfig[this.filterConfig.length - 1].operation && i === this.filterConfig.length - 2) {
            } else {
              this.filterConfig.splice(i, 1, ...this.filterConfig.splice(i + 1, 1, this.filterConfig[i]));
            }
            break;
          }
        }
      },
      theTop: function() {
        if (!this.rowId) return;
        let index = '';
        let fixed = '';
        let targetIndex = '';
        for (var i = 0; i < this.filterConfig.length; i++) {
          if (this.filterConfig[i].originId === this.rowId) {
            index = i;
            fixed = this.filterConfig[i].fixed;
            break;
          }
        }
        if (fixed === 'left') {
          if (this.filterConfig[0].selection) {
            targetIndex = 1;
          } else {
            targetIndex = 0;
          }
        } else if (fixed === 'right') {
          for (var j = 0; j < this.filterConfig.length; j++) {
            if (this.filterConfig[j].fixed === 'right') {
              targetIndex = j;
              break;
            }
          }
        } else {
          for (var k = 0; k < this.filterConfig.length; k++) {
            if (this.filterConfig[k].fixed !== 'left') {
              targetIndex = k;
              break;
            }
          }
          if (targetIndex === this.filterConfig.length - 1) {
            if (this.filterConfig[0].selection) {
              targetIndex = 1;
            } else {
              targetIndex = 0;
            }
          }
        }
        let topItem = this.filterConfig[index];
        this.filterConfig.splice(index, 1);
        if (this.filterConfig[0].selection) {
          let selectionItem = this.filterConfig[0];
          this.filterConfig.splice(0, 1);
          this.filterConfig.unshift(selectionItem, topItem);
        } else {
          this.filterConfig.unshift(topItem);
        }
      },
      theBottom: function() {
        if (!this.rowId) return;
        let index = '';
        let fixed = '';
        let targetIndex = '';
        for (var i = 0; i < this.filterConfig.length; i++) {
          if (this.filterConfig[i].originId === this.rowId) {
            index = i;
            fixed = this.filterConfig[i].fixed;
            break;
          }
        }
        if (fixed === 'left') {
          for (var j = 0; j < this.filterConfig.length; j++) {
            if (this.filterConfig[j].fixed !== 'left') {
              targetIndex = j - 1;
              break;
            }
          }
        } else if (fixed === 'right') {
          if (this.filterConfig[this.filterConfig.length - 1].operation) {
            targetIndex = this.filterConfig.length - 2;
          } else {
            targetIndex = this.filterConfig.length - 1;
          }
        } else {
          for (var k = 0; k < this.filterConfig.length; k++) {
            if (this.filterConfig[k].fixed === 'right') {
              targetIndex = k - 1;
              break;
            }
          }
          if (targetIndex === this.filterConfig.length - 2) {
            targetIndex = this.filterConfig.length - 1;
          } else {
            if (this.filterConfig[this.filterConfig.length - 1].operation) {
              targetIndex = this.filterConfig.length - 2;
            } else {
              targetIndex = this.filterConfig.length - 1;
            }
          }
        }
        let bottomItem = this.filterConfig[index];
        this.filterConfig.splice(index, 1);
        if (this.filterConfig[0].operation) {
          let operationItem = this.filterConfig[this.filterConfig.length - 1];
          this.filterConfig.splice(this.filterConfig.length - 1, 1);
          this.filterConfig.push(bottomItem, operationItem);
        } else {
          this.filterConfig.push(bottomItem);
        }
      },
      rowClick: function(row, event, column) {
        this.rowId = row.originId;
      },
      openDialog: function() {
        this.dialogTableVisible = true;
      },
      closeDialog: function() {
        this.dialogTableVisible = false;
      },

      filterData: function() {
        let arr = [];
        let config = JSON.parse(JSON.stringify(this.config));
        config.forEach((item) => {
          if (!item.originId) {
            item.originId = (item.type === 'selction' ? 'checkbox' : item.prop);
          }
        });
        let originId_config = config && config.length > 0 ? config.map(function(item) {
          return item.originId || item.prop;
        }) : [];
        let originId_origin = this.originData && this.originData.length > 0 ? this.originData.map(function(item) {
          return item.originId || item.prop;
        }) : [];
        let rindex = 0;
        if (this.originData && this.originData.length > 0) {
          for (var i = 0; i < this.originData.length; i++) {
            // 多退少补
            if (originId_config.indexOf(this.originData[i].originId || this.originData[i].prop) < 0) {
              config.splice(i, 0, this.originData[i]);
              if (config[i]) config[i].visibleBool = false;
            }
            if (originId_origin.indexOf(originId_config[i]) < 0) {
              config.splice(i - rindex, 1);
              rindex++;
            }
          }
        }
        for (var n = 0; n < config.length; n++) {
          let typeVal = this.originData && this.originData.length > 0 ? this.originData[n].type : config.length > 0 && config[n].type ? config[n].type : 'default';
          if (config[n].originId === 'selection' || config[n].originId === 'checkBox') typeVal = 'selection';
          arr.push({
            originId: config[n].originId || config[n].id,
            property: !config[n].property || config[n].property === 'operaColumn' ? '--' : config[n].property,
            operation: config[n].property === 'operaColumn',
            type: typeVal,
            selection: typeVal === 'selection',
            label: typeVal === 'selection' ? 'checkbox' : config[n].label,
            index: typeVal === 'index',
            visible: config[n].visible,
            visibleBool: config[n].visibleBool === undefined ? true : config[n].visibleBool,
            fixed: config[n].fixed ? config[n].fixed === true ? 'left' : config[n].fixed : 'nulls'
          });
        }
        this.upNoClick = arr[0].selection ? 1 : 0;
        this.downNoClick = arr[arr.length - 1].operation ? arr.length - 2 : arr.length - 1;
        this.filterConfig = arr;

        if (this.filterConfig[0].selection) this.isHiddenFixedFirst = true;
        if (this.filterConfig[this.filterConfig.length - 1].operation) this.isHiddenFixedLast = true;
      },

      sortTable: function(val) {
        var arr = [];
        for (var i = 0; i < val.length; i++) {
          if (val[i].selection || val[i].fixed === 'left') {
            arr.push(val[i]);
          }
        }
        for (var j = 0; j < val.length; j++) {
          if (val[j].fixed === 'nulls' && !val[j].selection) {
            arr.push(val[j]);
          }
        }
        for (var s = 0; s < val.length; s++) {
          if (val[s].fixed === 'right' || val[s].operation) {
            arr.push(val[s]);
          }
        }
        Object.assign(val, [], arr);
      },

      apply() {
        this.$emit('applyconfig', this.filterConfig);
      },

      handleOrder: function(index, action) {
        let obj = this.filterConfig[index];
        if ((action === 'up' && this.upNoClick === index) || (action === 'down' && this.downNoClick === index)) {
          return;
        }
        if (action === 'up') {
          this.$set(this.filterConfig, index, this.filterConfig[index - 1]);
          this.$set(this.filterConfig, index - 1, obj);
        } else {
          this.$set(this.filterConfig, index, this.filterConfig[index + 1]);
          this.$set(this.filterConfig, index + 1, obj);
        }
        this.sortTable(this.filterConfig);
      },

      setClass: function(index, action) {
        if ((action === 'up' && this.upNoClick === index) || (action === 'down' && this.downNoClick === index)) {
          return 'noClick';
        }
      },

      setVisible: function(index) {
        if (this.filterConfig[index].selection || this.filterConfig[index].operation) {
          return false;
        } else {
          return true;
        }
      }
    },

    created: function() {
      if (this.config.length) {
        this.filterData();
      }
    }
  };
</script>
  