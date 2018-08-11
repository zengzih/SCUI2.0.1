import Vue from 'vue';
import debounce from 'throttle-debounce/debounce';
import { orderBy, getColumnById, getRowIdentity } from './util';

const sortData = (data, states) => {
  const sortingColumn = states.sortingColumn;
  if (!sortingColumn || typeof sortingColumn.sortable === 'string') {
    return data;
  }
  return orderBy(data, states.sortProp, states.sortOrder, sortingColumn.sortMethod);
};

const getKeysMap = function(array, rowKey) {
  const arrayMap = {};
  (array || []).forEach((row, index) => {
    arrayMap[getRowIdentity(row, rowKey)] = { row, index };
  });
  return arrayMap;
};

const toggleRowSelection = function(states, row, selected) {
  let changed = false;
  const selection = states.selection;
  const index = selection.indexOf(row);
  if (typeof selected === 'undefined') {
    if (index === -1) {
      selection.push(row);
      changed = true;
    } else {
      selection.splice(index, 1);
      changed = true;
    }
  } else {
    if (selected && index === -1) {
      selection.push(row);
      changed = true;
    } else if (!selected && index > -1) {
      selection.splice(index, 1);
      changed = true;
    }
  }

  return changed;
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
    reserveSelection: false,
    selectable: null,
    currentRow: null,
    hoverRow: null,
    filters: {},
    expandRows: [],
    defaultExpandAll: false,
    autoRowMerge: [],
    autoColMerge: [],
    mergeData: []
  };

  for (let prop in initialState) {
    if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
      this.states[prop] = initialState[prop];
    }
  }
};

TableStore.prototype.mutations = {
  setData(states, data) {
    for (var p = 0; p < data.length; p++) {
      for (var d in data[p]) {
        if (d.indexOf('colspan') > -1 || d.indexOf('rowspan') > -1 || d.indexOf('dis') > -1 || d.indexOf('mergeLabel') > -1 || d.indexOf('operationList') > -1) {
          delete data[p][d];
        }
      }
    }
    const dataInstanceChanged = states._data !== data;
    states._data = data;
    states.data = sortData((data || []), states);

    // states.data.forEach((item) => {
    //   if (!item.$extra) {
    //     Object.defineProperty(item, '$extra', {
    //       value: {},
    //       enumerable: false
    //     });
    //   }
    // });

    this.updateCurrentRow();

    if (!states.reserveSelection) {
      if (dataInstanceChanged) {
        this.clearSelection();
      } else {
        this.cleanSelection();
      }
      this.updateAllSelected();
    } else {
      const rowKey = states.rowKey;
      if (rowKey) {
        const selection = states.selection;
        const selectedMap = getKeysMap(selection, rowKey);

        states.data.forEach((row) => {
          const rowId = getRowIdentity(row, rowKey);
          const rowInfo = selectedMap[rowId];
          if (rowInfo) {
            selection[rowInfo.index] = row;
          }
        });

        this.updateAllSelected();
      } else {
        // console.warn('WARN: rowKey is required when reserve-selection is enabled.');
      }
    }

    const defaultExpandAll = states.defaultExpandAll;
    if (defaultExpandAll) {
      this.states.expandRows = (states.data || []).slice(0);
    }

    Vue.nextTick(() => this.table.updateScrollY());
    var _this = this;
    // states.mergeData = JSON.parse(JSON.stringify(states.data));
    if (states.data.length === 0) {
      return false;
    }
    if (states.columns.length === 0) {
      setTimeout(() =>{
        _this.mutations.mergeTable(states);
      });
    } else {
      _this.mutations.mergeTable(states);
    }
  },
  mergeTable(states) {
    var autoMerge = states.autoColMerge;
    var column = states.columns;
     // states.mergeData = JSON.parse(JSON.stringify(states.data));
    // 将条件重复的合并规则删除，并取后面的的合并规则
    /* for (var a = 0; a < autoMerge.length; a++) {
      for (var f = a + 1; f < autoMerge.length; f++) {
        if (autoMerge[a].startRow === autoMerge[f].startRow && autoMerge[a].endRow === autoMerge[f].endRow) {
          autoMerge.splice(a, 1);
          a--;
        }
      }
    }*/
    for (var i = 0 ; i < autoMerge.length; i++) {
      var startRow = autoMerge[i].startRow;
      if (startRow > states.data.length) {
        return false;
      }
      var endRow = autoMerge[i].endRow;
      if (endRow > states.data.length) {
        endRow = states.data.length;
      }
      var startCol = autoMerge[i].startCol;
      var endCol = autoMerge[i].endCol;
      if (startCol >= states.columns.length) {
        return false;
      }
      if (endCol > states.columns.length) {
        endCol = states.columns.length;
      }
      var mergeLabel = autoMerge[i].mergeLabel;
      for (var r = startRow - 1; r < endRow; r++) {
        var k = startCol - 1;
        while (k < endCol) {
          states.data[r][column[k].property + 'colspan'] = 1;
          states.data[r][column[k].property + 'dis'] = '';
          for (var x = k + 1; x < endCol; x++) {
            states.data[r][column[k].property + 'colspan']++;
            column[k]['mergeLabel'] = column[k].property + 'mergeLabel';
            states.data[r][column[k].property + 'mergeLabel'] = mergeLabel ? mergeLabel : (states.data[r][column[k].property]);
            states.data[r][column[k].property + 'dis'] = '';
            states.data[r][column[x].property + 'colspan'] = 1;
            states.data[r][column[x].property + 'dis'] = 'none'; // true
          }
          k = x;
        }
      }
      for (var s = startRow - 1; s < endRow; s++) {
        for (var z = autoMerge[i].startCol - 1; z < autoMerge[i].endCol; z++) {
          if (s === startRow - 1) {
            states.data[s][column[z].property + 'rowspan'] = endRow - s;
          } else {
            states.data[s][column[z].property + 'dis'] = 'none';
          }
        }
      }
    }
    // states.mergeData = JSON.parse(JSON.stringify(states.data));
    this.mergeTableRow(states);
  },

  mergeTableRow(states) {
    var autoMerge = states.autoRowMerge;
    for (var c in states.columns) {
      if (states.columns[c].type === 'selection') {
        states.columns[c]['property'] = 'selection';
      }
      if (states.columns[c].type === 'default' && !states.columns[c].property) { // 合并操作列
        states.columns[c]['property'] = 'operation' + c;
      }
    }
    var column = states.columns;
    var mergeIndex = [];
    // 将条件重复的合并规则删除，并取后面的的合并规则
    for (var a = 0; a < autoMerge.length; a++) {
      for (var f = a + 1; f < autoMerge.length; f++) {
        if (autoMerge[a].startCol === autoMerge[f].startCol && autoMerge[a].endCol === autoMerge[f].endCol) {
          autoMerge.splice(a, 1);
          a--;
        }
      }
    }
    for (var n in autoMerge) {
      var mergeField = autoMerge[n].mergeField || [];
      var fieldName = autoMerge[n].fieldName;
      var mergeNull = autoMerge[n].mergeNull;
      for (var m = 0; m < mergeField.length; m++) {
        for (var e = 0; e < column.length; e++) {
          if (mergeField[m] === column[e].property) {
            mergeIndex.push(e);
          }
        }
      }
      if (mergeIndex.length > 0) {
        for (var i = 0; i < mergeIndex.length; i++) {
          this.autoFieldMerge(mergeIndex[i], fieldName, column, states, autoMerge[n], mergeNull);
        }
      }
      for (var z = autoMerge[n].startCol - 1;z < autoMerge[n].endCol; z++) {
        this.autoFieldMerge(z, fieldName, column, states, autoMerge[n], mergeNull);
      }
    }
  },

  autoFieldMerge(index, fieldName, column, states, autoMerge, mergeNull) {
    var startRow = (autoMerge.startRow ? autoMerge.startRow : 0);
    var endRow = (autoMerge.endRow ? autoMerge.endRow : states.data.length);
    var k = startRow;
    while (k < endRow) {
      if (states.data[k][column[index].property + 'colspan'] > 1 && states.data[k][column[index].property + 'rowspan'] > 1) {
      } else {
        states.data[k][column[index].property + 'rowspan'] = 1;
      }
      for (var x = k + 1; x <= endRow - 1; x++) {
        if (ScUtil.isArray(fieldName)) {
          var fieldValX = fieldName.map(function(item) {
            return states.data[x][item];
          });
          var fieldValK = fieldName.map(function(item) {
            return states.data[k][item];
          });
          fieldValX = ScUtil.getArrFilter(fieldValX);
          fieldValK = ScUtil.getArrFilter(fieldValK);
        }
        if (states.data[k][column[index].property + 'dis'] === 'none' || states.data[k][column[index].property + 'colspan'] > 1) {
          break;
        }
        if (states.data[k][column[index].property] === states.data[x][column[index].property] && (mergeNull ? true : states.data[k][column[index].property]) && ((ScUtil.isArray(fieldName) ? (fieldValX.toString() !== '' && fieldValX.toString() === fieldValK.toString()) : (fieldName && (states.data[x][fieldName] !== undefined && fieldName && (states.data[x][fieldName] === states.data[k][fieldName]))) || !fieldName))) {
          if (states.data[x][column[index].property + 'dis'] === 'none' || states.data[x][column[index].property + 'colspan'] > 1) {
            break;
          }
          states.data[k][column[index].property + 'rowspan']++;
          states.data[k][column[index].property + 'dis'] = '';
          states.data[x][column[index].property + 'rowspan'] = 1;
          states.data[x][column[index].property + 'dis'] = 'none';
        } else {
          break;
        }
      }
      k = x;
    }
    for (var i = 0;i < states.data.length; i++) {
      if (states.data[i].operationdis !== undefined && states.data[i].operationdis !== 'none') {
        if (states.data[i]['operationList'] !== 'object') {
          [].push.call(states.data[i]['operationList'] = [], JSON.parse(JSON.stringify(states.data[i])));
          for (var n = i + 1; n < states.data.length; n++) {
            if (states.data[n].operationdis === 'none') {
              states.data[i].operationList.push(JSON.parse(JSON.stringify(states.data[n])));
            } else {
              i = n;
              break;
            }
          }
        }
      }
    }
   /* for (var p = 0; p < states.data.length; p++) {
      for (var o in states.data[p].operationList) {
        for (var d in states.data[p].operationList[o]) {
          if (d.indexOf('colspan') > -1 || d.indexOf('rowspan') > -1 || d.indexOf('dis') > -1 || d.indexOf('mergeLabel') > -1 || d.indexOf('operationList') > -1) {
            delete states.data[p].operationList[o][d];
          }
        }
      }
    }*/
    // states.mergeData = JSON.parse(JSON.stringify(states.data));
  },

  changeSortCondition(states) {
    states.data = sortData((states.filteredData || states._data || []), states);
    this.table.$emit('sort-change', {
      column: this.states.sortingColumn,
      prop: this.states.sortProp,
      order: this.states.sortOrder
    });
    Vue.nextTick(() => this.table.updateScrollY());
  },

  filterChange(states, options) {
    let { column, values, silent } = options;
    if (values && !Array.isArray(values)) {
      values = [values];
    }

    const prop = column.property;
    const filters = {};

    if (prop) {
      states.filters[column.id] = values;
      filters[column.columnKey || column.id] = values;
    }

    let data = states._data;

    Object.keys(states.filters).forEach((columnId) => {
      const values = states.filters[columnId];
      if (!values || values.length === 0) return;
      const column = getColumnById(this.states, columnId);
      if (column && column.filterMethod) {
        data = data.filter((row) => {
          return values.some(value => column.filterMethod.call(null, value, row));
        });
      }
    });

    states.filteredData = data;
    states.data = sortData(data, states);

    if (!silent) {
      this.table.$emit('filter-change', filters);
    }

    Vue.nextTick(() => this.table.updateScrollY());
  },

  insertColumn(states, column, index, parent) {
    let array = states._columns;
    if (parent) {
      array = parent.children;
      if (!array) array = parent.children = [];
    }

    if (typeof index !== 'undefined') {
      array.splice(index, 0, column);
    } else {
      array.push(column);
    }

    if (column.type === 'selection') {
      states.selectable = column.selectable;
      states.reserveSelection = column.reserveSelection;
    }

    this.updateColumns();  // hack for dynamics insert column
    this.scheduleLayout();
  },

  removeColumn(states, column) {
    let _columns = states._columns;
    if (_columns) {
      _columns.splice(_columns.indexOf(column), 1);
    }

    this.updateColumns();  // hack for dynamics remove column
    this.scheduleLayout();
  },

  setHoverRow(states, row) {
    states.hoverRow = row;
  },

  setCurrentRow(states, row) {
    const oldCurrentRow = states.currentRow;
    states.currentRow = row;

    if (oldCurrentRow !== row) {
      this.table.$emit('current-change', row, oldCurrentRow);
    }
  },

  rowSelectedChanged(states, row, index) {
    const changed = toggleRowSelection(states, row);
    var selections = [];
    var selectionList = [];
    const selection = states.selection;
    for (var n = 0; n < selection.length; n++) {
      if (selection[n] && selection[n].selectionspan > 1) {
        for (var i = selection[n].selIndex; i < (+selection[n].selectionspan + selection[n].selIndex); i++) {
          selections.push(states.data[i]);
        }
      } else {
        if (selection[n].selectiondis !== 'none') {
          selections.push(selection[n]);
        }
      }
    }
    selectionList = JSON.parse(JSON.stringify(selections));
   /* for (var a in selectionList) {
      for (var b in selectionList[i]) {
        if (b.indexOf('selection') === -1 && b.indexOf('colspan') > -1 || b.indexOf('rowspan') > -1 || b.indexOf('dis') > -1) {
          delete selectionList[a][b];
        }
      }
    }*/
    if (changed) {
      const table = this.table;
      table.$emit('selection-change', selectionList);
      table.$emit('select', selectionList, row);
    }
    this.updateAllSelected();
  },

  toggleRowExpanded: function(states, row, expanded) {
    const expandRows = states.expandRows;
    if (typeof expanded !== 'undefined') {
      const index = expandRows.indexOf(row);
      if (expanded) {
        if (index === -1) expandRows.push(row);
      } else {
        if (index !== -1) expandRows.splice(index, 1);
      }
    } else {
      const index = expandRows.indexOf(row);
      if (index === -1) {
        expandRows.push(row);
      } else {
        expandRows.splice(index, 1);
      }
    }
    this.table.$emit('expand', row, expandRows.indexOf(row) !== -1);
  },

  toggleAllSelection: debounce(10, function(states) { // debounce: 10毫秒后，才会执行方法，若在这10毫秒内又调用此动作则将重新计算执行时间。
    const data = states.data || [];
    const value = !states.isAllSelected;
    const selection = this.states.selection;
    let selectionChanged = false;

    data.forEach((item, index) => {
      if (states.selectable) {
        if (states.selectable.call(null, item, index) && toggleRowSelection(states, item, value)) {
          selectionChanged = true;
        }
      } else {
        if (toggleRowSelection(states, item, value)) {
          selectionChanged = true;
        }
      }
    });

    const table = this.table;
    if (selectionChanged) {
      table.$emit('selection-change', selection);
    }
    table.$emit('select-all', selection);
    states.isAllSelected = value;
  }),

  setAutoRowMerge(states, autoMerge) {
    if (autoMerge.length === 0) {
      return false;
    }
    autoMerge.forEach((merge) => {
      states.autoRowMerge.push(merge);
    });
  },

  setAutoColMerge(states, autoMerge) {
    if (autoMerge.length === 0) {
      return false;
    }
    autoMerge.forEach((merge) => {
      states.autoColMerge.push(merge);
    });
  }
};

const ScUtil = {
  isArray: function(str) {
    return this.getDataType(str) === 'Array';
  },
  isObject: function(str) {
    return this.getDataType(str) === 'Object';
  },
  getDataType: function(str) {
    return Object.prototype.toString.call(str).slice(8, -1);
  },
  getArrFilter: function(arr) {
    var filterArr = arr.filter((item) =>{
      return item !== undefined;
    });
    return filterArr;
  }
};

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

TableStore.prototype.updateColumns = function() {
  const states = this.states;
  const _columns = states._columns || [];
  states.fixedColumns = _columns.filter((column) => column.fixed === true || column.fixed === 'left');
  states.rightFixedColumns = _columns.filter((column) => column.fixed === 'right');

  if (states.fixedColumns.length > 0 && _columns[0] && _columns[0].type === 'selection' && !_columns[0].fixed) {
    _columns[0].fixed = true;
    states.fixedColumns.unshift(_columns[0]);
  }
  states.originColumns = [].concat(states.fixedColumns).concat(_columns.filter((column) => !column.fixed)).concat(states.rightFixedColumns);
  states.columns = doFlattenColumns(states.originColumns);
  states.isComplex = states.fixedColumns.length > 0 || states.rightFixedColumns.length > 0;
};

TableStore.prototype.isSelected = function(row) {
  return (this.states.selection || []).indexOf(row) > -1;
};

TableStore.prototype.clearSelection = function() {
  const states = this.states;
  states.isAllSelected = false;
  const oldSelection = states.selection;
  states.selection = [];
  if (oldSelection.length > 0) {
    this.table.$emit('selection-change', states.selection);
  }
};

TableStore.prototype.setExpandRowKeys = function(rowKeys) {
  const expandRows = [];
  const data = this.states.data;
  const rowKey = this.states.rowKey;
  if (!rowKey) throw new Error('[Table] prop row-key should not be empty.');
  const keysMap = getKeysMap(data, rowKey);
  rowKeys.forEach((key) => {
    const info = keysMap[key];
    if (info) {
      expandRows.push(info.row);
    }
  });

  this.states.expandRows = expandRows;
};

TableStore.prototype.toggleRowSelection = function(row, selected) {
  const changed = toggleRowSelection(this.states, row, selected);
  if (changed) {
    this.table.$emit('selection-change', this.states.selection);
  }
};

TableStore.prototype.cleanSelection = function() {
  const selection = this.states.selection || [];
  const data = this.states.data;
  const rowKey = this.states.rowKey;
  let deleted;
  if (rowKey) {
    deleted = [];
    const selectedMap = getKeysMap(selection, rowKey);
    const dataMap = getKeysMap(data, rowKey);
    for (let key in selectedMap) {
      if (selectedMap.hasOwnProperty(key) && !dataMap[key]) {
        deleted.push(selectedMap[key].row);
      }
    }
  } else {
    deleted = selection.filter((item) => {
      return data.indexOf(item) === -1;
    });
  }

  deleted.forEach((deletedItem) => {
    selection.splice(selection.indexOf(deletedItem), 1);
  });

  if (deleted.length) {
    this.table.$emit('selection-change', selection);
  }
};

TableStore.prototype.updateAllSelected = function() {
  const states = this.states;
  const { selection, rowKey, selectable, data } = states;
  if (!data || data.length === 0) {
    states.isAllSelected = false;
    return;
  }

  let selectedMap;
  if (rowKey) {
    selectedMap = getKeysMap(states.selection, rowKey);
  }

  const isSelected = function(row) {
    if (selectedMap) {
      return !!selectedMap[getRowIdentity(row, rowKey)];
    } else {
      return selection.indexOf(row) !== -1;
    }
  };

  let isAllSelected = true;
  let selectedCount = 0;
  for (let i = 0, j = data.length; i < j; i++) {
    const item = data[i];
    if (selectable) {
      const isRowSelectable = selectable.call(null, item, i);
      if (isRowSelectable) {
        if (!isSelected(item)) {
          isAllSelected = false;
          break;
        } else {
          selectedCount++;
        }
      }
    } else {
      if (!isSelected(item)) {
        isAllSelected = false;
        break;
      } else {
        selectedCount++;
      }
    }
  }

  if (selectedCount === 0) isAllSelected = false;

  states.isAllSelected = isAllSelected;
};

TableStore.prototype.scheduleLayout = function() {
  this.table.debouncedLayout();
};

TableStore.prototype.setCurrentRowKey = function(key) {
  const states = this.states;
  const rowKey = states.rowKey;
  if (!rowKey) throw new Error('[Table] row-key should not be empty.');
  const data = states.data || [];
  const keysMap = getKeysMap(data, rowKey);
  const info = keysMap[key];
  if (info) {
    states.currentRow = info.row;
  }
};

TableStore.prototype.updateCurrentRow = function() {
  const states = this.states;
  const table = this.table;
  const data = states.data || [];
  const oldCurrentRow = states.currentRow;

  if (data.indexOf(oldCurrentRow) === -1) {
    states.currentRow = null;

    if (states.currentRow !== oldCurrentRow) {
      table.$emit('current-change', null, oldCurrentRow);
    }
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

export default TableStore;
