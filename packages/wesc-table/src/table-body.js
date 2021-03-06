import {getRowIdentity, getCell, getColumnByCell} from './model/utils';
import { hasClass } from 'element-ui/src/utils/dom';
import debounce from 'throttle-debounce/debounce';
export default {
  props: {
    store: {
      type: Object
    },
    layout: {
      type: Object
    },
    fixed: String,
    stripe: Boolean,
    table: Object,
    column: Array
  },
  data() {
    return {
      columns: [],
      tooltipContent: ''
    };
  },
  watch: {
    column: {
      handler(val) {
        this.columns = val;
      },
      deep: true
    }
  },
  created() {
    this.activateTooltip = debounce(50, tooltip => tooltip.handleShowPopper());
    this.columns = this.column;
  },
  render(h) {
    const data = this.store.states.data;
    let checkKey = this.store.states.checkKey;
    let currentRow = this.store.states.currentRow;
    let selectable = this.store.states.selectable;
    let rowKey = this.store.states.rowKey;
    return (
      <table
        cellspacing="0"
        cellpadding="0"
        border="0"
        class="el-table__body"
      >
        <colgroup>
          {
            this._l(this.columns, column =>
              <col
                name={column.id}
                width={column.realWidth || column.width}
              />)
          }
        </colgroup>
        <tbody>
        {
          this._l(data, (row, $index) =>
              <tr class="el-table__row" class={[this.table.highlightCurrentRow ? ((selectable && checkKey[row[rowKey]]) || (row[rowKey] === currentRow[rowKey]) ? 'current-row' : '') : '', this.table.rowClassName ? (typeof this.table.rowClassName === 'string' ? this.table.rowClassName : this.table.rowClassName(row)) : '' ] } key={ rowKey ? this.getKeyOfRow(row, $index) : $index } on-click={ ($event) => this.handlerClick($event, row, $index) }>
              {
                this._l(this.columns, (column, cellIndex) =>
                  <td
                    style={ this.getCellStyle(column) }
                    on-mouseenter={ ($event) => this.handleCellMouseEnter($event, row, column) }
                    on-mouseleave={ this.handleCellMouseLeave }
                    on-dblclick={ ($event) => this.handlerCelldblClick($event, row, column) }
                    class={[column.className, column.type === 'selection' ? 'el-table-column--selection' : '', column.align ? 'is-' + column.align : 'is-left', column.type === '$index' ? 'el-table-column--index' : '']}>
                    {
                      column.type === 'selection' && column.fixed !== 'left' && column.fixed !== 'right' ? <div class='cell'>
                        <label class="wesc-checkbox" on-change={($event) => this.handlerChange($event, row)}>
                          {
                              checkKey[row[rowKey]] ? <input type="checkbox" checked class="checked"/> : <input type="checkbox" class="no-checked"/>
                          }
                          <span class="wesc-checkbox__inner"></span>
                        </label>
                      </div> : <div class="cell" class={['cell', column.tooltip ? 'el-tooltip' : '']}>
                        {
                          column.render && column.fixed !== 'left' && column.fixed !== 'right' ? column.render.call(this._renderProxy, h, {
                            row,
                            column
                          }) : (column.type === '$index' ? $index : (column.formatter ? column.formatter(row, column) : row[column.prop]))
                        }</div>
                    }
                  </td>
                )
              }
              {
                !this.fixed && this.layout.scrollY && this.layout.gutterWidth ? <td class="gutter"/> : ''
              }
            </tr>).concat(
            <el-tooltip placement="top" ref="tooltip"
                        content={this.tooltipContent}>
            </el-tooltip>
          )
        }
        </tbody>
      </table>
    );
  },
  methods: {
    getCellStyle(column) {
      let vStyle = '';
      if (column.leftBorder) {
        vStyle += ';border-left: 1px solid #b1bddd';
      }
      if (column.rightBorder) {
        vStyle += ';border-right: 1px solid #b1bddd';
      }
      if (column.leftBorder === false) {
        vStyle += ';border-left: none!important';
      }
      if (column.rightBorder === false) {
        vStyle += ';border-right: none!important';
      }
      return vStyle;
    },
    handlerChange(e, row) {
      const key = this.store.states.rowKey;
      this.store.states.checkKey[row[key]] = !this.store.states.checkKey[row[key]];
      this.store.states.checkKey = Object.assign({}, this.store.states.checkKey);
      this.store.commit('handleSelection', row, this.store.states.checkKey[row[key]]);
    },
    handleCellMouseEnter(event, row, column) {
      const cell = getCell(event);
      const cellChild = event.target.querySelector('.cell');
      if (column.scopeSlot) {
        this.$emit('column-mouseenter', event, row, column, column.scopeSlot);
        /* this.scopeSlotRow = row;
         this.scopeSlotColumn = column;
         this.scopeSlotRender = column.scopeSlot;*/
      }
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
    handlerClick(e, row, index) {
      const key = this.store.states.rowKey;
      this.store.states.checkKey[row[key]] = !this.store.states.checkKey[row[key]];
      this.store.states.checkKey = Object.assign({}, this.store.states.checkKey);
      this.store.commit('handleSelection', row, this.store.states.checkKey[row[key]]);
      this.handleEvent(e, row, index, 'click');
    },
    handleEvent(e, row, index, name) {
      const table = this.table;
      const cell = getCell(e);
      let column;
      if (cell) {
        column = getColumnByCell(table, cell);
        if (column) {
          table.$emit(`cell-${name}`, row, column, cell, e);
        }
      }
      table.$emit(`row-${name}`, row, e, column, index);
    },
    handleMouseLeave() {
      this.store.commit('setHoverRow', null);
    },
    handleCellMouseLeave(e) {
      const tooltip = this.$refs.tooltip;
      if (tooltip) {
        tooltip.setExpectedState(false);
        tooltip.handleClosePopper();
      }
    },
    getKeyOfRow(row, index) {
      const rowKey = this.store.states.rowKey;
      if (rowKey) {
        return getRowIdentity(row, rowKey) + index;
      }
      return index;
    },
    handlerCelldblClick(e, row, col) {
      this.store.commit('handlerCellDblClick', row, col);
    }
  }
};
