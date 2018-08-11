import { getCell, getColumnByCell, getRowIdentity, columnBorder } from './util';
import { hasClass, addClass, removeClass } from 'element-ui/src/utils/dom';
import ElCheckbox from 'element-ui/packages/checkbox';
import ElTooltip from 'element-ui/packages/tooltip';
import debounce from 'throttle-debounce/debounce';

export default {
  components: {
    ElCheckbox,
    ElTooltip
  },

  props: {
    store: {
      required: true
    },
    stripe: {
      type: Boolean,
      default: true
    },
    context: {},
    layout: {
      required: true
    },
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    fixed: String,
    highlight: Boolean
  },

  render(h) {
    const columnsHidden = this.columns.map((column, index) => this.isColumnHidden(index));
    const originColumns = this.store.states.originColumns;
    columnBorder(originColumns);
    return (
      <table
        class="el-table__body"
        style={ 'margin-top:' + (this.store.states.fitColumn ? '-40px' : '')}
        cellspacing="0"
        cellpadding="0"
        border="0">
        <colgroup>
          {
            this._l(this.columns, column =>
              <col
                name={ column.id }
                width={ column.realWidth || column.width }
              />)
          }
        </colgroup>
        <tbody>
          {
            this._l(this.data, (row, $index) =>
              [<tr
                style={ this.rowStyle ? this.getRowStyle(row, $index) : null }
                key={ this.table.rowKey ? this.getKeyOfRow(row, $index) : $index }
                on-dblclick={ ($event) => this.handleDoubleClick($event, row) }
                on-click={ ($event) => this.handleClick($event, row) }
                on-contextmenu={ ($event) => this.handleContextMenu($event, row) }
                on-mouseenter={ _ => this.handleMouseEnter($index) }
                on-mouseleave={ _ => this.handleMouseLeave() }
                class={ [this.getRowClass(row, $index)] }>
                {
                  this._l(this.columns, (column, cellIndex) =>
                    <td
                      style={this.setTdStyle(row, column, columnsHidden[cellIndex])}
                      rowSpan={this.setTdRowSpan(row, column)}
                      colSpan={this.setTdColSpan(row, column)}
                      class={[column.id, column.align, column.className || '', columnsHidden[cellIndex] ? 'is-hidden' : '', column.leftBorder && !columnsHidden[cellIndex] ? 'is_left_br' : '', column.rightBorder ? 'is_r_br' : '', !column.leftBorder ? 'no_left_br' : '', !column.rightBorder ? 'no_right_br' : ''] }
                      on-mouseenter={ ($event) => this.handleCellMouseEnter($event, row) }
                      on-mouseleave={ this.handleCellMouseLeave }>
                      {
                        column.renderCell.call(this._renderProxy, h, { row, column, $index, store: this.store, _self: this.context || this.table.$vnode.context }, columnsHidden[cellIndex])
                      }
                    </td>
                  )
                }
                {
                  !this.fixed && this.layout.scrollY && this.layout.gutterWidth ? <td class="gutter" /> : ''
                }
              </tr>,
                this.store.states.expandRows.indexOf(row) > -1
                ? (<tr>
                    <td colspan={ this.columns.length } class="el-table__expanded-cell">
                      { this.table.renderExpanded ? this.table.renderExpanded(h, { row, $index, store: this.store }) : ''}
                    </td>
                  </tr>)
                : ''
              ]
            ).concat(
              this._self.$parent.$slots.append
            ).concat(
              <el-tooltip effect={ this.table.tooltipEffect } placement="top" ref="tooltip" content={ this.tooltipContent }></el-tooltip>
            )
          }
        </tbody>
      </table>
    );
  },

  watch: {
    'store.states.hoverRow'(newVal, oldVal) {
      if (!this.store.states.isComplex) return;
      const el = this.$el;
      if (!el) return;
      let rows;
      for (var i = 0;i < el.children.length;i++) {
        if (el.children[i].tagName === 'TBODY') {
          rows = el.children[i].children;
        }
      }
      const oldRow = rows[oldVal];
      const newRow = rows[newVal];
      if (oldRow) {
        removeClass(oldRow, 'hover-row');
      }
      if (newRow) {
        addClass(newRow, 'hover-row');
      }
    },
    'store.states.currentRow'(newVal, oldVal) {
      if (!this.highlight) return;
      const el = this.$el;
      if (!el) return;
      const data = this.store.states.data;
      let rows;
      for (var i = 0;i < el.children.length;i++) {
        if (el.children[i].tagName === 'TBODY') {
          rows = el.children[i].children;
        }
      }
      let oldRow = [];
      let newRow = [];
      [].forEach.call(oldVal || [], val => oldRow.push(rows[data.indexOf(val)]));
      [].forEach.call(newVal, val => newRow.push(rows[data.indexOf(val)]));
      const existSec = (oldVal !== newVal);
      [].forEach.call(rows, row => removeClass(row, 'current-row'));
      if (existSec) {
        if (newRow) {
          [].forEach.call(newRow, row => addClass(row, 'current-row'));
        }
      } else if (newRow && newRow.length) {
        addClass(newRow[newRow.length - 1], 'current-row');
      }
      this.store.states.selection = newVal;
    }
  },

  computed: {
    table() {
      return this.$parent;
    },

    data() {
      return this.store.states.data;
    },

    columnsCount() {
      return this.store.states.columns.length;
    },

    leftFixedCount() {
      return this.store.states.fixedColumns.length;
    },

    rightFixedCount() {
      return this.store.states.rightFixedColumns.length;
    },

    columns() {
      return this.store.states.columns;
    }
  },

  data() {
    return {
      tooltipContent: '',
      fitColumnAllWidth: 0
    };
  },

  created() {
    this.activateTooltip = debounce(50, tooltip => tooltip.handleShowPopper());
  },

  methods: {
    setTdRowSpan(row, column) {
      if (column.property) {
        if (row[column.property + 'rowspan']) {
          return row[column.property + 'rowspan'];
        }
      }
    },

    setTdColSpan(row, column) {
      if (column.property) {
        if (row[column.property + 'colspan']) {
          return row[column.property + 'colspan'];
        }
      }
    },
    headIsHidden() {
      if (!this.store.states.fitColumn) {
        return ';display:none';
      }
    },
    setTdStyle(row, column, isHidden) {
      var vStyle = '';
      // if (column.leftBorder && !isHidden) {
      //   vStyle += ';border-left: 1px solid #b1bddd';
      // }
      // if (column.rightBorder) {
      //   vStyle += ';border-right: 1px solid #b1bddd';
      // }
      // if (column.leftBorder === false) {
      //   vStyle += ';border-left: none!important';
      // }
      // if (column.rightBorder === false) {
      //   vStyle += ';border-right: none!important';
      // }
      // debugger;
      if (column.property) {
        if (row[column.property + 'dis'] !== undefined) {
          vStyle += ';display:' + (row[column.property + 'dis']) + '';
        }
      }
      return vStyle;
    },
    getKeyOfRow(row, index) {
      const rowKey = this.table.rowKey;
      if (rowKey) {
        return getRowIdentity(row, rowKey);
      }
      return index;
    },

    isColumnHidden(index) {
      if (this.fixed === true || this.fixed === 'left') {
        return index >= this.leftFixedCount;
      } else if (this.fixed === 'right') {
        return index < this.columnsCount - this.rightFixedCount;
      } else {
        return (index < this.leftFixedCount) || (index >= this.columnsCount - this.rightFixedCount);
      }
    },

    getRowStyle(row, index) {
      const rowStyle = this.rowStyle;
      if (typeof rowStyle === 'function') {
        return rowStyle.call(null, row, index);
      }
      return rowStyle;
    },

    getRowClass(row, index) {
      const classes = ['el-table__row'];

      if (this.stripe && index % 2 === 1) {
        classes.push('el-table__row--striped');
      }
      const rowClassName = this.rowClassName;
      if (typeof rowClassName === 'string') {
        classes.push(rowClassName);
      } else if (typeof rowClassName === 'function') {
        classes.push(rowClassName.call(null, row, index) || '');
      }

      return classes.join(' ');
    },

    handleCellMouseEnter(event, row) {
      const table = this.table;
      const cell = getCell(event);

      if (cell) {
        const column = getColumnByCell(table, cell);
        const hoverState = table.hoverState = {cell, column, row};
        table.$emit('cell-mouse-enter', hoverState.row, hoverState.column, hoverState.cell, event);
      }

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

      const oldHoverState = this.table.hoverState;
      this.table.$emit('cell-mouse-leave', oldHoverState.row, oldHoverState.column, oldHoverState.cell, event);
    },

    handleMouseEnter(index) {
      this.store.commit('setHoverRow', index);
    },

    handleMouseLeave() {
      this.store.commit('setHoverRow', null);
    },

    handleContextMenu(event, row) {
      this.handleEvent(event, row, 'contextmenu');
    },

    handleDoubleClick(event, row) {
      this.handleEvent(event, row, 'dblclick');
    },

    handleClick(event, row) {
      event.stopPropagation();
      var target = event.target.parentElement;
      if (!target || !hasClass(target, 'el-checkbox__input')) {
        this.store.commit('rowSelectedChanged', row);
        this.store.commit('setCurrentRow', row);
      }
      this.handleEvent(event, row, 'click');
    },

    handleEvent(event, row, name) {
      const table = this.table;
      const cell = getCell(event);
      let column;
      if (cell) {
        column = getColumnByCell(table, cell);
        if (column) {
          table.$emit(`cell-${name}`, row, column, cell, event);
        }
      }
      table.$emit(`row-${name}`, row, event, column);
    },

    handleExpandClick(row) {
      this.store.commit('toggleRowExpanded', row);
    },
    isCellHidden(index, columns) {
      if (this.fixed === true || this.fixed === 'left') {
        return index >= this.leftFixedCount;
      } else if (this.fixed === 'right') {
        let before = 0;
        for (let i = 0; i < index; i++) {
          before += columns[i].colSpan;
        }
        return before < this.columnsCount - this.rightFixedCount;
      } else {
        return (index < this.leftFixedCount) || (index >= this.columnsCount - this.rightFixedCount);
      }
    },
    handleMouseOut() {
      if (this.$isServer) return;
      document.body.style.cursor = '';
    }
  },
  updated() {
    const fitColumn = this.store.states.fitColumn;
    this.fitColumnAllWidth = 0;
    if (fitColumn) {
      var thead = this.table.$el.querySelectorAll('.el-table__body-wrapper .el-table__body thead th');
      if ((this.table.layout.gutterWidth && thead.length > 1) || (!this.table.layout.gutterWidth && thead.length > 0)) {
        let len = thead.length;
        if (this.table.layout.gutterWidth) {
          len = thead.length - 1;
        }
        for (var i = 0; i < len; i++) {
          this.columns[i]['width'] = thead[i].offsetWidth;
          this.fitColumnAllWidth += thead[i].offsetWidth;
        }
        this.$set(this.columns, this.columns);
        this.store.states.fitColumnAllWidth = this.fitColumnAllWidth;
        this.layout.update(this.columns);
      }
    }
  }
};
