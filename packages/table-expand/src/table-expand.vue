<template>
   <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition"
        style="width: 100%;position: relative;" :style="{height: height + 'px'}">
        <div class="el-table__header-wrapper" ref='headerWrapper'>
           <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" :style="{'width': this.store.bodyWidth + 'px'}">
               <colgroup>
                  <col v-for="(c, index) in originColumns" :width='c.realWidth' :name="getColClass(index)">
               </colgroup>
               <thead>
                 <tr v-if="false">
                   <th  v-for='item in columns' :colspan='item.colspan' :style="{'text-align' : item.headAlign  }">{{item.colName}}</th>
                   <th class='gutter' style="width: 17px"></th>
                 </tr>
                 <tr>
                   <th v-for='(col, index) in originColumns' :class="getColClass(index)" :style="{'text-align' : col.headAlign  }">
                     <div v-if="col.type == 'checkbox'">
                        <template>
                          <el-checkbox v-model="isAll" @change="handleCheckAll"></el-checkbox>
                        </template>
                     </div>
                     <div v-else>{{col.colName}}</div>
                   </th>
                   <th class='gutter' style="width: 17px"></th>
                 </tr>
               </thead>
           </table>
        </div>
        <div class="el-table__body-wrapper" ref="bodyWrapper" :style="{height: heights + 'px'}" @scroll = 'handlerScroll($event)'>
           <table cellspacing="0" cellpaddingv="0" border="0" class="el-table__body" :style="{'width': this.store.bodyWidth + 'px'}">
               <colgroup>
                  <col v-for="c in originColumns" :width='c.realWidth'>
               </colgroup>
               <tbody>
                <template v-for='(d, index) in datas'>
                  <!-- parent -->
                  <tr :key='d[defaultProps.nodeKey]' class="el-table__row parent-tr" :class="[checkTree[d[defaultProps.nodeKey]] ? 'check-row' : '']">
                    <td>
                      <div class="cell"  style="text-align: center">
                        <template>
                          <el-checkbox
                            v-model="checkTree[d[defaultProps.nodeKey]]"
                            :disabled="d[defaultProps.disableKey]"
                            @change="handleParentCheck(d, $event)"
                          >
                          </el-checkbox>
                        </template>
                      </div>
                    </td>
                    <td>
                      <div class="cell expand-tr"  style="text-align: center" v-show="hasChildren(d)"
                           @click.stop.prevent="handleExpand(d, index)">
                        <i class="el-icon-arrow-right" v-show='!expandTree[d[defaultProps.nodeKey]]'></i>
                        <i class="el-icon-arrow-down" v-show='expandTree[d[defaultProps.nodeKey]]'></i>
                      </div>
                    </td>
                    <td  :colspan='d.colspan' @click.stop="handleParentClick(d)">
                      <div  class='cell' >
                        <span><b v-html="d[defaultProps.parentProp]"></b></span>
                      </div>
                    </td>
                  </tr>
                  <!-- child -->
                  <template>
                    <tr  v-for='(item, index) in d[defaultProps.childKey]' :key='item[defaultProps.nodeKey]' class='children-tr' v-show='expandTree[d[defaultProps.nodeKey]]'>
                      <td style="text-align: center">
                         <div class="cell">
                            <el-checkbox :disabled="item[defaultProps.disableKey]" @change="handleChildCheck(item, d, $event)"  v-model="checkTree[joinKey(d[defaultProps.nodeKey], item[defaultProps.nodeKey])]"></el-checkbox>
                        </div>
                      </td>
                      <td style="text-align: center">
                        <div class="cell"></div>
                      </td>
                      <td v-for='col in getOriginColumns()' :style="{'text-align': col.align}" @click.stop.prevent="handleChildClick(item, d)">
                        <el-tooltip class="item" effect="dark" :disabled="!col.tooltip" :content="item[col.prop]" placement="top">
                          <el-popover
                            placement="right"
                            trigger="hover"
                            v-if="col.popover && col.popover(item, index)">
                            <div
                              class="cell"
                              v-if="col.renderPopover"
                              v-html="col.renderPopover(item, index)">
                            </div>
                            <div
                              class="render cell"
                              slot="reference"
                              v-html="col.render ? col.render(item, index) : item[col.prop]">
                            </div>
                          </el-popover>
                          <div class="cell" v-if="!col.popover && col.type !== 'checkbox' && col.type !=='expand'" v-html='col.render(item)'></div>
                        </el-tooltip>
                      </td>
                    </tr>
                  </template>
                </template>
               </tbody>
           </table>
        </div>
       <div class="el-table__column-resize-proxy" style="display: none;"></div>
       <div class="el-table__fixed-right-patch"></div>
       <div class="resize-triggers">
           <div class="expand-trigger">
               <div style="width: 761px; height: 201px;"></div>
           </div>
           <div class="contract-trigger"></div>
       </div>
       <span v-if="data.length == 0" class="data-empty">暂无数据</span>
   </div>
</template>
<script>
  import TableExpandStore from './table-expand-store';
  import debounce from 'throttle-debounce/debounce';
  import throttle from 'throttle-debounce/throttle';
  import { isArray, get } from 'lodash';
  import { addResizeListener} from 'element-ui/src/utils/resize-event';
  export default {
    name: 'TableExpand',
    data() {
      const store = new TableExpandStore(this);
      return {
        store,
        originColumns: [],
        columns: [],
        isAll: false,
        datas: [],
        Json: [],
        heights: '',
        tableData: [],
        expandTree: {},
        checkTree: {}
      };
    },
    props: {
      column: {
        type: Array,
        default: []
      },
      data: {
        type: Array,
        default: []
      },
      defaultProps: {
        type: Object,
        default() {
          return {
            childKey: 'settlements',
            checkKey: 'checked',
            disableKey: 'disabled',
            parentProp: 'prdNameAbb',
            defaultExpandAll: true,
            nodeKey: 'id',
            expandWidth: '50',
            checkboxWidth: '50'
          };
        }
      },
      height: {
        type: [Number, String],
        default: '500'
      },
      trHeight: {
        type: [Number, String],
        default: '28'
      },
      isScroll: false
    },
    watch: {
      data: {
        handler(val) {
          this.store.commit('setData', val);
          this.dataUpdate(val);
          if (this.$ready) this.doLayout();
        }
      },
      allCheck(val) {
        this.getAllCheck(val);
      },
      height(val) {
        if (val) {
          this.heights = val - this.$refs.headerWrapper.clientHeight;
        }
      }
    },
    created() {
      this.store.states.defaultProps = this.defaultProps;
      this.column.unshift({colName: '', headAlign: '', children: [
        {
          colName: '',
          align: 'center',
          type: 'checkbox',
          prop: '',
          minWidth: this.defaultProps.checkboxWidth,
          headAlign: 'center'
        }]
      },
        {colName: '', headAlign: '', children: [
          {
            colName: '',
            align: 'center',
            prop: '',
            type: 'expand',
            minWidth: this.defaultProps.expandWidth,
            headAlign: 'center'
          }]
        });
      this.store.commit('insertColumn', this.column);
    },
    methods: {
      getOriginColumns() {
        const originColumns = this.originColumns.slice();
        originColumns.splice(0, 2);
        return originColumns;
      },
      getColClass(index) {
        return 'el-table_1_column_' + index;
      },
      doLayout() {
        this.store.update();
      },
      handleChildClick(childTr, parentTr) {
        let key = this.joinKey(parentTr[this.defaultProps.nodeKey], childTr[this.defaultProps.nodeKey]);
        let checked = !this.checkTree[key];
        this.handleChildCheck(childTr, parentTr, {target: {checked: checked}});
      },
      handleParentClick(tr) {
        if (tr[this.defaultProps.disableKey]) return ;
        let checked = !this.checkTree[tr[this.defaultProps.nodeKey]];
        this.$set(this.checkTree, tr[this.defaultProps.nodeKey], checked);
        this.handleParentCheck(tr, {target: {checked: checked}});
      },
      getWidthByTwoIndex(i1, i2) {
        let total = 0;
        for (var i = i1; i <= i2; i++) {
          total += parseInt(this.widths[i], 10);
        }
        return total + 'px';
      },
      appendData() {
        let line = parseInt(this.height, 10) / parseInt(this.trHeight, 10);
        line = parseInt(line + 5, 10);
        let lineNumber = 0;
        let parentNumber = 0;
        this.json.map((item) => {
          if (lineNumber >= line) return;
          lineNumber += 1;
          if (this.hasChildren(item)) {
            lineNumber += item[this.defaultProps.childKey].length;
          };
          parentNumber++;
        });
        this.datas = this.datas.concat(this.json.splice(0, parentNumber));
      },
      mousedown(index, e) {
        this.index = index;
        this.startX = e.x;
        this.$refs.table.addEventListener('mousemove', this.mousemove);
      },
      mouseup(e) {
        this.$refs.table.removeEventListener('mousemove', this.mousemove);
        if (!this.endX) return ;
        let diff = this.endX - this.startX;
        if (diff === 0) return ;
        let result = `${parseInt(this.widths[this.index], 10) + diff}px`;
        this.$set(this.widths, this.index, result);
        this.endX = null;
      },
      mousemove(e) {
        this.endX = e.x;
      },
      joinKey(id1 = '', id2 = '') {
        return `${id1}-child-${id2}`;
      },
      initExpandTree() {
        let obj = {};
        this.data.map((item) => {
          obj[item[this.defaultProps.nodeKey]] = true;
        });
        this.expandTree = obj;
      },
      initCheckTree(checked) {
        const getChecked = (row) => {
          return typeof checked === 'undefined' ? row[this.defaultProps.checkKey] : checked;
        };

        let obj = {};
        this.data.map((parent) => {
          if (parent[this.defaultProps.disableKey]) return ;
          obj[parent[this.defaultProps.nodeKey]] = getChecked(parent);
          let children = get(parent, this.defaultProps.childKey) || [];
          children.map((child) => {
            if (child[this.defaultProps.disableKey]) return ;
            obj[this.joinKey(parent[this.defaultProps.nodeKey], child[this.defaultProps.nodeKey])] = getChecked(child);
          });
        });
        this.checkTree = obj;
      },
      hasChildren(obj) {
        return obj &&
          isArray(obj[this.defaultProps.childKey]) &&
          obj[this.defaultProps.childKey].length > 0;
      },
      handleChildCheck(row, parent, e) {
        if (row[this.defaultProps.disableKey]) return ;
        let checked = e.target.checked;
        let parentId = parent[this.defaultProps.nodeKey];
        let key = this.joinKey(parentId, row[this.defaultProps.nodeKey]);
        this.$set(this.checkTree, key, checked);
        this.testChildrenAll(parent);
        this.eventChildCheck(parent);
      },
      testChildrenAll(parent) {
        let parentId = parent[this.defaultProps.nodeKey];
        let key = this.joinKey(parentId);
        let regexp = new RegExp(key);
        let total = 0;
        for (var id in this.checkTree) {
          if (regexp.test(id) && this.checkTree[id]) total++;
        }
        let children = get(parent, this.defaultProps.childKey);
        if (!isArray(children)) return ;
        let isAll = total === this.getChildrenLength(children);
        this.$set(this.checkTree, parentId, isAll);
        this.testCheckAll();
      },
      handleParentCheck(row, e) {
        let checked = e.target.checked;
        let children = get(row, this.defaultProps.childKey) || [];
        children.map((item) => {
          if (item[this.defaultProps.disableKey]) return ;
          let key = this.joinKey(row[this.defaultProps.nodeKey], item[this.defaultProps.nodeKey]);
          this.$set(this.checkTree, key, checked);
        });
        this.testCheckAll();
        this.eventChildCheck(row);
      },
      testCheckAll() {
        let total = 0;
        this.data.map((item) => {
          if (this.checkTree[item[this.defaultProps.nodeKey]]) total++;
        });
        this.isAll = total === this.getChildrenLength(this.data);
        this.change();
      },
      handleCheckAll(e) {
        let checked = e.target.checked;
        this.initCheckTree(checked);
        this.data.map((item) => {
          if (item[this.defaultProps.disableKey]) return ;
          this.eventChildCheck(item);
        });
        this.change();
      },
      getChildrenLength(children = []) {
        let total = 0;
        children.map((item) => {
          if (!item[this.defaultProps.disableKey]) total++;
        });
        return total;
      },
      handleExpand(row, index) {
        let key = row[this.defaultProps.nodeKey];
        let expaned = !this.expandTree[key];
        this.$set(this.expandTree, key, expaned);
        this.$emit('expand', row, expaned, index);

        if (!expaned) this.appendData();
      },
      change() {
        let arr = [];
        this.data.map((parent) => {
          if (this.checkTree[parent[this.defaultProps.nodeKey]]) arr.push(parent);
          if (!parent[this.defaultProps.childKey]) return ;
          parent[this.defaultProps.childKey].map((child) => {
            let key = this.joinKey(parent[this.defaultProps.nodeKey], child[this.defaultProps.nodeKey]);
            if (this.checkTree[key]) arr.push(child);
          });
        });
        this.$emit('change', arr);
      },
      eventChildCheck(parent) {
        if (!this.hasChildren(parent)) return ;
        let arr = [];
        parent[this.defaultProps.childKey].map((child) => {
          let key = this.joinKey(parent[this.defaultProps.nodeKey], child[this.defaultProps.nodeKey]);
          if (this.checkTree[key]) arr.push(child);
        });
        this.$emit('child-check', parent, arr);
      },
      dataUpdate(val) {
        this.$refs.bodyWrapper.scrollTop = 0;
        this.datas = [];
        this.json = val.slice();
        this.initExpandTree();
        this.initCheckTree();
        this.appendData();
      },
      updateRow(row) {
        let obj = {};
        row[this.defaultProps.childKey].map((child) => {
          if (child[this.defaultProps.disableKey]) return ;
          let key = this.joinKey(row[this.defaultProps.nodeKey], child[this.defaultProps.nodeKey]);
          obj[key] = !!child[this.defaultProps.checkKey];
        });
        this.checkTree = obj;
        this.testChildrenAll(row);
        this.$set(this.tableData, row);
      },
      // 滚动加载
      handlerScroll(e) {
        const headerWrapper = this.$el.getElementsByClassName('el-table__header-wrapper');
        headerWrapper[0].scrollLeft = e.target.scrollLeft;
        if (this.json.length > 0) {
          this.scrollAppend(e);
        }
      },
      scrollAppend: debounce(10, function(e) {
        const { scrollHeight, scrollTop, offsetHeight } = e.target;
        if (scrollTop + offsetHeight >= scrollHeight) {
          this.appendData();
        }
      })
    },
    mounted() {
      this.$nextTick(function() {
        this.heights = this.height - this.$refs.headerWrapper.clientHeight;
      });
      this.$ready = true;
      this.windowResizeListener = throttle(50, () => {
        if (this.$ready) this.doLayout();
      });
      addResizeListener(this.$el, this.windowResizeListener);
    }
  };
</script>

<style type="text/css" scoped>
  table {
    table-layout:fixed;
  }
  .el-table__body-wrapper {
    overflow: auto;
  }
  .el-table .cell {
    white-space: nowrap!important;
  }
  .expand-tr {
    cursor: pointer;
  }
  .data-empty {
    display:inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(50%, 50%);
  }
</style>
