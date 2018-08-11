<template>
  <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition"
       style="width: 100%;position: relative;" :style="{height: height + 'px'}">
    <div class="el-table__header-wrapper" ref="headerWrapper">
      <table cellspacing="0" cellpadding="0" ref="table" border="0" class="el-table__header" :style="{'width': bodyWidth + 'px'}">
        <colgroup>
          <col  :name="getColClass(0)" v-show="showCheckbox" width="50"/>
          <!-- <col  :name="getColClass(1)" width="50"/> -->
          <col v-for="(c, index) in columns" :width='c.realWidth' :name="getColClass(index + 1)">
        </colgroup>
        <thead>
        <tr class="draggable" style="border-bottom: 1px solid #b1bddd;">
          <th :class="getColClass(0)" style="text-align: center" v-show="showCheckbox">
            <el-checkbox v-model="isAll" @change="handleCheckAll"></el-checkbox>
          </th>
          <!-- <th :class="getColClass(1)">expand</th> -->

          <th
            v-for="(th, index) in columns"
            :style="getParentStyle(th)"
            :class="getColClass(index + 1)"
          >  <!--  @mousedown="mousedown(index + 1, $event)"
                   @mouseup="mouseup" -->
            <div
              class="render"
              v-html="th.renderHead(th, index)"
              v-if="th.renderHead"
            >
            </div>
            <template v-else>{{th.colName}}</template>
            <span v-show="th.delable" class="el-table__column-del-trigger" @click="headerDelClick(th)">
              <i class="is-del-able">
                <i></i>
                <i></i>
              </i>
            </span>
          </th>
          <th class='gutter'  :style="{width: (scrollY ? this.gutterWidth : 0) + 'px'}"></th>
        </tr>
        </thead>
      </table>
    </div>
    <div class="el-table__body-wrapper" ref="bodyWrapper" :style="{height: heights + 'px'}" @scroll = 'handlerScroll($event)'>
      <table cellspacing="0" cellpaddingv="0" border="0" class="el-table__body" :style="{'width': (scrollY ? bodyWidth - gutterWidth : bodyWidth) + 'px'}">
        <colgroup>
          <col  :name="getColClass(0)" v-show="showCheckbox" width="50"/>
         <!--  <col  :name="getColClass(1)" width="50"/> -->
          <col v-for="(c, index) in columns" :width='c.realWidth' :name="getColClass(index + 1)">
        </colgroup>
        <tbody>
        <template v-for="(tr, index) in tableData">
          <!-- parent -->
          <tr
            :key="tr[props.nodeKey]"
            class="parent"
            style="text-align: center"
            :style="props.trStyle || ''"
            :class="{
              'highlight': checkTree[tr[props.nodeKey]]
            }">
            <td v-show="showCheckbox">
              <el-checkbox
                v-model="checkTree[tr[props.nodeKey]]"
                :disabled="tr[props.disableKey]"
                @change="handleParentCheck(tr, $event)"
              >
              </el-checkbox>
            </td>
            <td style="text-align: center">
              <el-button
                type="text"
                v-show="hasChildren(tr)"
                @click.stop="handleExpand(tr, index)"
                style="padding: 0; min-width: auto; height: auto;"
              >
                <i class="el-icon-arrow-right" v-show="!expandTree[tr[props.nodeKey]]"></i>
                <i class="el-icon-arrow-down" v-show="expandTree[tr[props.nodeKey]]"></i>
              </el-button>
            </td>
            <td
              :colspan="columns.length - 1"
              style="text-align: left;padding-left: 15px"
              :style="props.tdStyle || ''"
              @click="handleParentClick(tr)">
              <div
                class="render"
                v-html="tr[props.parentProp]"
                v-if="tr[props.parentProp]"
              >
              </div>
              <template v-else>{{columns[0].title}}</template>
            </td>
          </tr>
          <!-- children -->
          <template v-if="hasChildren(tr)">
            <tr
              class="child"
              :class="[{
                'highlight': checkTree[joinKey(tr[props.nodeKey], childTr[props.nodeKey])]
              }, rowClassName && rowClassName(childTr, childTrIndex)]"
              v-show="expandTree[tr[props.nodeKey]]"
              v-for="(childTr, childTrIndex) in tr[props.childKey]"
              :key="childTr[props.nodeKey]">
              <td style="text-align: center" v-show="showCheckbox">
                <el-checkbox
                  v-model="checkTree[joinKey(tr[props.nodeKey], childTr[props.nodeKey])]"
                  @change="handleChildCheck(childTr, tr, $event)"
                  :disabled="childTr[props.disableKey]"
                >
                </el-checkbox>
              </td>
              <td
                v-for="(td, tdIndex) in columns"
                :style="getChildStyle(td)"
                @click="handleChildClick(childTr, tr, td)"
                @mouseenter="handleCellMouseEnter($event, td)"
                @mouseleave="handleCellMouseLeave($event)"
              >

                <el-popover
                  placement="left"
                  trigger="hover"
                  v-if="td.popover && td.popover(childTr, childTrIndex)">
                  <div
                    class="cell"
                    v-if="td.renderPopover"
                    v-html="td.renderPopover(childTr, childTrIndex)">
                  </div>
                  <div
                    class="render cell"
                    slot="reference"
                    v-html="td.render ? td.render(childTr, index) : childTr[td.prop]">
                  </div>
                </el-popover>

                <div
                  class="render cell"
                  :class="td.tooltip ? 'el-tooltip' : ''"
                  v-else
                  v-html="td.render ? td.render(childTr, index) : childTr[td.prop]">
                </div>
              </td>
            </tr>
          </template>
        </template>
        </tbody>
      </table>
    </div>
    <span v-if="tableData.length == 0" class="data-empty">暂无数据</span>
    <el-tooltip  placement="top" ref="tooltip" :content="tooltipContent"></el-tooltip>
  </div>
</template>

<script>
  import { isArray, get } from 'lodash';
  import debounce from 'throttle-debounce/debounce';
  import { getCell } from './util';
  import { hasClass } from 'element-ui/src/utils/dom';
  import throttle from 'throttle-debounce/throttle';
  import { addResizeListener} from 'element-ui/src/utils/resize-event';

  export default {
    name: 'ScTableExpand',
    props: {
      data: {
        type: Array,
        default: function() {
          return [];
        }
      },
      props: {
        type: Object,
        default: function() {
          return {};
        }
      },
      height: {
        type: [String, Number],
        default: '500'
      },
      columns: {
        type: Array,
        default: function() {
          return [];
        }
      },
      rowClassName: {
        type: Function
      },
      trHeight: {
        type: String,
        default: '25'
      },
      attachThead: {
        type: Array,
        default: function() {
          return [];
        }
      },
      showCheckbox: {
        type: Boolean,
        default: true
      }
    },
    data: function() {
      return {
        expandTree: {},
        checkTree: {},
        isAll: false,
        widths: [],
        tableData: [],
        bodyWidth: '',
        heights: '',
        scrollX: false,
        scrollY: false,
        gutterWidth: 17,
        tooltipContent: ''
      };
    },
    created() {
      this.activateTooltip = debounce(50, tooltip => tooltip.handleShowPopper());
    },
    mounted() {
      // window.onresize = this.resize;
      // this.resize();
      this.initExpandTree();
      this.initCheckTree();
      this.dataUpdate(this.data);
      this.$ready = true;
      this.windowResizeListener = throttle(50, () => {
        if (this.$ready) this.doLayout();
      });
      addResizeListener(this.$el, this.windowResizeListener);
    },
    methods: {
      getParentStyle(th) {
        return ';text-align:' + th.headAlign + ';' + th.parentStyle + ';';
      },
      getChildStyle(td) {
        return ';text-align:' + td.align + ';' + td.childStyle + ';';
      },
      headerDelClick(th) {
        this.$emit('header-delclick', th);
      },
      getColClass(index) {
        return 'el-table_1_column_' + index;
      },
      handleCellMouseEnter(event, row) {
        const cell = getCell(event);
        // 判断是否text-overflow, 如果是就显示tooltip
        const cellChild = event.target.querySelector('.cell');
        if (hasClass(cellChild, 'el-tooltip') && cellChild.scrollWidth > cellChild.offsetWidth) {
          const tooltip = this.$refs.tooltip;
          this.tooltipContent = cell.innerText;
          tooltip.referenceElm = cell;
          tooltip.$refs.popper.style.display = 'none';
          tooltip.doDestroy();
          tooltip.setExpectedState(true);
          this.activateTooltip(tooltip);
        }
      },

      handleCellMouseLeave(event) {
        const tooltip = this.$refs.tooltip;
        if (tooltip) {
          tooltip.setExpectedState(false);
          tooltip.handleClosePopper();
        }
        const cell = getCell(event);
        if (!cell) return;
      },

      doLayout() {
        const bodyWidth = this.$el.clientWidth;
        let bodyMinWidth = 0;
        const flexColumns = this.columns;
        if (flexColumns.length > 0) {
          flexColumns.forEach((column) => {
            bodyMinWidth += parseInt(column.width || column.minWidth || 80, 10);
          });
          flexColumns.map(function(item) {
            return parseInt(item.minWidth || item.width, 10);
          });
          if (bodyMinWidth + 100 < bodyWidth) {
            this.scrollX = false;
            const totalFlexWidth = bodyWidth - bodyMinWidth - 100; //  - this.gutterWidth
            if (flexColumns.length === 1) {
              flexColumns[0].realWidth = (flexColumns[0].minWidth || 80) + totalFlexWidth;
            } else {
              const allColumnsWidth = flexColumns.reduce((prev, column) => prev + (parseInt(column.minWidth, 10) || 80), 0);
              const flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
              let noneFirstWidth = 0;

              flexColumns.forEach((column, index) => {
                if (index === 0) return;
                const flexWidth = Math.floor((column.minWidth || 80) * flexWidthPerPixel);
                noneFirstWidth += flexWidth;
                column.realWidth = parseInt(column.minWidth || 80, 10) + flexWidth;
              });

              flexColumns[0].realWidth = parseInt(flexColumns[0].minWidth || 80, 10) + totalFlexWidth - noneFirstWidth;
            }
          } else { // HAVE HORIZONTAL SCROLL BAR
            this.scrollX = true;
            flexColumns.forEach(function(column) {
              column.realWidth = column.minWidth;
            });
          }
          this.bodyWidth = Math.max(bodyMinWidth, bodyWidth);
        } else {
          flexColumns.forEach((column) => {
            if (!column.width && !column.minWidth) {
              column.realWidth = 80;
            } else {
              column.realWidth = column.width || column.minWidth;
            }

            bodyMinWidth += column.realWidth;
          });
          this.scrollX = bodyMinWidth > bodyWidth;

          this.bodyWidth = bodyMinWidth;
        }
        this.columns = flexColumns;
      },
      handleChildClick(childTr, parentTr, td) {
        let key = this.joinKey(parentTr[this.props.nodeKey], childTr[this.props.nodeKey]);
        let checked = !this.checkTree[key];
        this.handleChildCheck(childTr, parentTr, {target: {checked: checked}});
        if ((this.props.clickColProp instanceof Array && this.props.clickColProp.indexOf(td.prop) !== -1) || (typeof this.props.clickColProp === 'string' && this.props.clickColProp === td.prop)) {
          this.$emit('row-click', childTr);
        }
      },
      handleParentClick(tr) {
        if (tr[this.props.disableKey]) return ;
        let checked = !this.checkTree[tr[this.props.nodeKey]];
        this.$set(this.checkTree, tr[this.props.nodeKey], checked);
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
        line = parseInt(line + 10, 10);
        let lineNumber = 0;
        let parentNumber = 0;
        this.json.map((item) => {
          if (lineNumber >= line) return;
          lineNumber += 1;
          if (this.hasChildren(item)) {
            lineNumber += item[this.props.childKey].length;
          };
          parentNumber++;
        });
        this.tableData = this.tableData.concat(this.json.splice(0, parentNumber));
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
      resize() {
        let arr = this.columns.map((th) => {
          return th.width || null;
        });
        arr = ['34px', '30px', ...arr];
        let total = 0;
        let autos = [];
        arr.map((item, index) => {
          if (item) {
            total += parseInt(item, 10);
          } else {
            autos.push(index);
          }
        });
        let table = this.$refs.table;
        let avgWidth = (table.offsetWidth - total) / autos.length;
        avgWidth = Math.max(avgWidth, 56);
        autos.map((auto) => {
          arr[auto] = avgWidth + 'px';
        });
        this.widths = arr;
        // let table = this.$refs.table;
        // let ths = table.querySelectorAll('th');
        // let trs = table.querySelectorAll('tbody tr');
        // forEach(trs, tr => {
        //   forEach(tr.querySelectorAll('td'), (td, index) => {
        //     if (!ths[index]) return ;
        //     td.style.width = ths[index].offsetWidth + 'px';
        //     if (tr.classList.contains('parent') && index === 2) {
        //       let total = tr.offsetWidth - tr.children[0].offsetWidth - tr.children[1].offsetWidth;
        //       td.style.width = total + 'px';
        //     }
        //   });
        // });
      },
      joinKey(id1 = '', id2 = '') {
        return `${id1}-child-${id2}`;
      },
      initExpandTree() {
        let obj = {};
        this.data.map((item) => {
          obj[item[this.props.nodeKey]] = true;
        });
        this.expandTree = obj;
      },
      initCheckTree(checked) {
        const getChecked = (row) => {
          return typeof checked === 'undefined' ? row[this.props.checkKey] : checked;
        };

        let obj = {};
        this.data.map((parent) => {
          if (parent[this.props.disableKey]) return ;
          obj[parent[this.props.nodeKey]] = getChecked(parent);
          let children = get(parent, this.props.childKey) || [];
          children.map((child) => {
            if (child[this.props.disableKey]) return ;
            obj[this.joinKey(parent[this.props.nodeKey], child[this.props.nodeKey])] = getChecked(child);
          });
        });
        this.checkTree = obj;
      },
      hasChildren(obj) {
        return obj &&
          isArray(obj[this.props.childKey]) &&
          obj[this.props.childKey].length > 0;
      },
      handleChildCheck(row, parent, e) {
        if (row[this.props.disableKey]) return ;
        let checked = e.target.checked;
        let parentId = parent[this.props.nodeKey];
        let key = this.joinKey(parentId, row[this.props.nodeKey]);
        this.$set(this.checkTree, key, checked);
        this.testChildrenAll(parent);
        this.eventChildCheck(parent);
      },
      testChildrenAll(parent) {
        let parentId = parent[this.props.nodeKey];
        let key = this.joinKey(parentId);
        let regexp = new RegExp(key);
        let total = 0;
        for (var id in this.checkTree) {
          if (regexp.test(id) && this.checkTree[id]) total++;
        }
        let children = get(parent, this.props.childKey);
        if (!isArray(children)) return ;
        let isAll = total === this.getChildrenLength(children);
        this.$set(this.checkTree, parentId, isAll);
        this.testCheckAll();
      },
      handleParentCheck(row, e) {
        let checked = e.target.checked;
        let children = get(row, this.props.childKey) || [];
        children.map((item) => {
          if (item[this.props.disableKey]) return ;
          let key = this.joinKey(row[this.props.nodeKey], item[this.props.nodeKey]);
          this.$set(this.checkTree, key, checked);
        });
        this.testCheckAll();
        this.eventChildCheck(row);
      },
      testCheckAll() {
        let total = 0;
        this.data.map((item) => {
          if (this.checkTree[item[this.props.nodeKey]]) total++;
        });
        this.isAll = total === 0 ? false : (total === this.getChildrenLength(this.data));
        this.change();
      },
      handleCheckAll(e) {
        let checked = e.target.checked;
        this.initCheckTree(checked);
        this.data.map((item) => {
          if (item[this.props.disableKey]) return ;
          this.eventChildCheck(item);
        });
        this.change();
      },
      getChildrenLength(children = []) {
        let total = 0;
        children.map((item) => {
          if (!item[this.props.disableKey]) total++;
        });
        return total;
      },
      handleExpand(row, index) {
        let key = row[this.props.nodeKey];
        let expaned = !this.expandTree[key];
        this.$set(this.expandTree, key, expaned);
        this.$emit('expand', row, expaned, index);

        if (!expaned) this.appendData();
      },
      change() {
        let arr = [];
        this.data.map((parent) => {
          if (this.checkTree[parent[this.props.nodeKey]]) arr.push(parent);
          if (!parent[this.props.childKey]) return ;
          parent[this.props.childKey].map((child) => {
            let key = this.joinKey(parent[this.props.nodeKey], child[this.props.nodeKey]);
            if (this.checkTree[key]) arr.push(child);
          });
        });
        this.$emit('change', arr);
      },
      eventChildCheck(parent) {
        if (!this.hasChildren(parent)) return ;
        let arr = [];
        parent[this.props.childKey].map((child) => {
          let key = this.joinKey(parent[this.props.nodeKey], child[this.props.nodeKey]);
          if (this.checkTree[key]) arr.push(child);
        });
        this.$emit('child-check', parent, arr);
      },
      dataUpdate(val) {
        this.$refs.bodyWrapper.scrollTop = 0;
        this.tableData = [];
        this.json = val.slice();
        this.initExpandTree();
        this.initCheckTree();
        this.appendData();
      },
      updateRow(row) {
        let obj = {};
        if (row[this.props.disableKey]) return ;
        row[this.props.childKey].map((child) => {
          if (child[this.props.disableKey]) return ;
          let key = this.joinKey(row[this.props.nodeKey], child[this.props.nodeKey]);
          obj[key] = !!child[this.props.checkKey];
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
    updated() {
      const height = this.height;
      if (typeof height !== 'string' && typeof height !== 'number') return;
      const bodyWrapper = this.$refs.bodyWrapper;
      if (this.$el && bodyWrapper) {
        const body = bodyWrapper.querySelector('.el-table__body');
        this.scrollY = body.offsetHeight > bodyWrapper.offsetHeight;
      }
    },
    watch: {
      data: function(val, oldVal) {
        this.dataUpdate(val);
        this.testCheckAll();
      },
      columns: function(val, oldVal) {
        this.resize();
      },
      height(val) {
        if (val) {
          this.heights = val - this.$refs.headerWrapper.clientHeight;
        }
      }
    }
  };
</script>