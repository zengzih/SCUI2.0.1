export default {
  name: 'TableHeader',
  data() {
    return {};
  },
  props: {
    store: Object,
    layout: Object
  },
  render(h) {
    let columnRows = this.store.states.originColumns;
    const selectionAll = this.store.states.selectionAll;
    return (
      <table
        class="el-table__header wesc-table_header"
        cellspacing="0"
        cellpadding="0"
        border="0">
        <colgroup>
          {
            this._l(this.store.states.columns, (column, cellIndex) =>
              <col
                name={column.id}
                class={'el-table_1_column_' + cellIndex }
                width={column.realWidth || column.width}
              />)
          }
          {
            !this.fixed && this.layout.gutterWidth
              ? <col name="gutter" width={ this.layout.scrollY ? this.layout.gutterWidth : '' }></col>
              : ''
          }
        </colgroup>
        <thead>
        {
          this._l(columnRows, (columns, rowIndex) =>
            <tr>
              {
                this._l(columns, (column, cellIndex) =>
                  <th
                    colspan={column.colSpan}
                    rowspan={column.rowSpan}
                    on-click={($event) => this.handleHeaderClick($event, column)}
                    style={this.getCellStyle(column)}
                    class={[column.id, column.order, column.headerAlign ? 'is-' + column.headerAlign : 'is-center', column.className || '', rowIndex === 0 && this.isCellHidden(cellIndex, columns) ? 'is-hidden' : '', column.type === 'selection' ? 'el-table-column--selection' : '', !column.children ? 'is-leaf' : '', column.labelClassName]}>
                    <div
                      class={['cell', column.filteredValue && column.filteredValue.length > 0 ? 'highlight' : '', column.labelClassName]}
                      style={'background:' + column.labelBgcolor + '!important'}
                    >
                      {
                        column.type === '$index' ? '#' : ''
                      }
                      {
                        column.type !== 'selection' ? column.label : <label class="wesc-checkbox">
                          {
                            selectionAll ? <input type="checkbox" class="checked" on-click={($event) => this.handleSelectionAll($event)}/> : <input type="checkbox" class="no-checked" on-click={($event) => this.handleSelectionAll($event)}/>
                          }
                          <span class="wesc-checkbox__inner"></span>
                        </label>
                      }
                      {
                        column.sortable
                          ? <span class="caret-wrapper" on-click={($event) => this.handleSortClick($event, column)}>
                            <i class="sort-caret ascending"
                               on-click={($event) => this.handleSortClick($event, column, 'ascending')}></i>
                            <i class="sort-caret descending"
                               on-click={($event) => this.handleSortClick($event, column, 'descending')}></i>
                          </span>
                          : ''
                      }
                      {
                        column.filterable
                          ? <span class="el-table__column-filter-trigger"
                                  on-click={($event) => this.handleFilterClick($event, column)}><i
                            class={['el-icon-arrow-down', column.filterOpened ? 'el-icon-arrow-up' : '']}></i></span>
                          : ''
                      }
                    </div>
                  </th>
                )
              }
              {
                !this.fixed && this.layout.gutterWidth
                  ? <th class="gutter" style={{ width: this.layout.scrollY ? this.layout.gutterWidth + 'px' : '0' }}></th>
                  : ''
              }
            </tr>
          )
        }
        </thead>
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
    getFitTableStyle() {
      return this.store.states.fitColumnAllWidth + 'px';
    },
    handleSelectionAll(e) {
      this.store.commit('handleSelectionAll', e.target.checked);
    },
    handleMouseOut() {
    },
    handleMouseMove() {
    },
    handleMouseDown() {
    },
    setTdStyle() {
    },
    isCellHidden() {
    },
    handleHeaderClick($event, column) {
      this.handleSortClick($event, column);
    },
    handleSortClick(event, column, givenOrder) {
      event.stopPropagation();
     /* if (column.sortable) {
        let target = event.target;
        if (target.tagName !== 'TH') {
          while (target && target.tagName !== 'TH') {
            target = target.parentNode;
          }
        }
      }*/
      if (!column.sortable) {
        return;
      }
      const order = givenOrder || this.toggleOrder(column.order);
      this.$set(column, 'order', order);
      const state = this.store.states;
      state.sortProp = column.prop;
      state.sortingColumn = column;
      state.sortOrder = column.order;
      this.store.commit('changeSortCondition');
    },
    toggleOrder(order) {
      return !order ? 'ascending' : order === 'ascending' ? 'descending' : null;
    },
    handleFilterClick() {
    }
  }
};
