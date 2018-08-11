import { convertToRows, columnBorder } from './utils';

const doFlattenColumns = (columns) => {
  const result = [];
  columns.forEach((column) => {
    if (column.children) {
      result.push.apply(result, doFlattenColumns(column.children));
    } else {
      result.push(column);
    }
  });
  return result;
};

const TableStore = function(table, initialState = {}) {
  if (!table) {
    throw new Error('Table is required.');
  }
  this.table = table;
  this.states = {
    rowKey: null,
    _columns: [],
    originColumns: [],
    columns: [],
    fixedColumns: [],
    rightFixedColumns: [],
    isComplex: false,
    _data: null,
    filteredData: null,
    data: null,
    sortingColumn: null,
    sortProp: null,
    sortOrder: null,
    isAllSelected: false,
    selection: [],
    selectionAll: false,
    reserveSelection: false,
    selectable: null,
    currentRow: {},
    hoverRow: null,
    filters: {},
    expandRows: [],
    defaultExpandAll: false,
    fitColumnAllWidth: null,
    fitColumn: true,
    checkKey: ''
  };
  for (let prop in initialState) {
    if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
      this.states[prop] = initialState[prop];
    }
  }
};

TableStore.prototype.mutations = {
  setData(states, data) {
    states.data = data;
    const getChecked = (row) => {
      return typeof checked === 'undefined' ? row['checked'] : true;
    };
    let obj = {};
    states.data.forEach((child) => {
      obj[child[states.rowKey]] = getChecked(child);
    });
    states.checkKey = obj;
  },
  insertColumn(states, columns) {
    let column = columns.filter((item) => {
      return item.visibleBool !== false;
    });
    column.forEach((col, index) => {
      if (col.type === 'selection') {
        col.prop = 'checkbox';
        states.selectable = true;
      }
      col.property = col.prop;
      col.width = col.width;
      let width = col.width;
      col.className = 'el-table_1_column_' + index;
      if (width !== undefined) {
        width = parseInt(width, 10);
        if (isNaN(width)) {
          width = null;
        }
      }
      let minWidth = col.minWidth;
      if (minWidth !== undefined) {
        minWidth = parseInt(minWidth, 10);
        if (isNaN(minWidth)) {
          minWidth = 80;
        }
      }
      col.realWidth = col.width || col.minWidth || 80;
    });
    // 可能会使用表格布局设置来动态设置表格的固定列
    let noFixedColumn = column.filter((col) => {
      return col.fixed !== true && col.fixed !== 'left' && col.fixed !== 'right';
    });
    states.fixedColumns = column.filter((col) => {
      return col.fixed === true || col.fixed === 'left';
    });
    states.rightFixedColumns = column.filter((col) => {
      return col.fixed === 'right';
    });
    states.columns = states.fixedColumns.concat(noFixedColumn, states.rightFixedColumns);
    states.originColumns = convertToRows(states.columns);
    columnBorder(states.columns);
  },
  handlerCellDblClick(states, row, col) {
    this.table.$emit('cell-dblclick', row, col);
  },
  handleSelection(states, row, checked) {
    states.checkKey[row[states.rowKey]] = checked;
    const selction = [];
    const rowKey = states.rowKey;
    if (states.selectable) {
      states.data.map((item) => {
        if (states.checkKey[item[rowKey]]) {
          selction.push(item);
        }
      });
      states.selectionAll = selction.length === states.data.length;
      this.table.$emit('selection-change', selction);
    } else {
      // states.currentRow.splice(0, states.currentRow.length, row);
      states.currentRow = row;
    }
  },
  handleSelectionAll(states) {
    states.selectionAll = !states.selectionAll;
    Object.keys(states.checkKey).some((item) => {
      states.checkKey[item] = states.selectionAll;
    });
    // this.states.checkKey = Object.assign({}, this.states.checkKey);
    this.table.$emit('selection-change', states.selectionAll ? states.data : []);
  },
  changeSortCondition(states) {
    // states.data = sortData((states.filteredData || states._data || []), states);
    this.table.$emit('sort-change', {
      column: this.states.sortingColumn,
      prop: this.states.sortProp,
      order: this.states.sortOrder
    });
   // Vue.nextTick(() => this.table.updateScrollY());
  }

};

TableStore.prototype.commit = function(name, ...args) {
  const mutations = this.mutations;
  if (mutations[name]) {
    mutations[name].apply(this, [this.states].concat(args));
  } else {
    throw new Error(`Action not found: ${name}`);
  }
};

TableStore.prototype.updateColumns = function() {
  const states = this.states;
  const _columns = states._columns || [];
  let configData = this.configColumns;
  states.fixedColumns = _columns.filter((column) => column.fixed === true || column.fixed === 'left');
  states.rightFixedColumns = _columns.filter((column) => column.fixed === 'right');

  if (states.fixedColumns.length > 0 && _columns[0] && _columns[0].type === 'selection' && !_columns[0].fixed) {
    _columns[0].fixed = true;
    states.fixedColumns.unshift(_columns[0]);
  }
  states.originColumns = [].concat(states.fixedColumns).concat(_columns.filter((column) => !column.fixed)).concat(states.rightFixedColumns);
  if (configData && configData.length) {
    states.originColumns = this.sortColumns(configData, states.originColumns, states);
  }
  states.columns = doFlattenColumns(states.originColumns);
  states.isComplex = states.fixedColumns.length > 0 || states.rightFixedColumns.length > 0;
};
export default TableStore;
