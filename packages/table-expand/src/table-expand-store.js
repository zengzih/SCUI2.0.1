function TableExpandStore(table) {
  this.table = table;
  this.states = {
    originColumns: [],
    columns: [],
    defaultProps: {}
  };
}

TableExpandStore.prototype.insertColumn = function(columns) {
  let result = [];
  for (var i in columns) {
    if (columns[i].children && columns[i].children.length > 0) {
      columns[i]['colspan'] = columns[i].children.length;
      for (var n in columns[i].children) {
        result.push(columns[i].children[n]);
      }
    } else {
      result.push(columns[i]);
    }
  }
  this.states.columns = columns;
  this.table.columns = columns;
  this.states.originColumns = result;
};

TableExpandStore.prototype.commit = function(name, ...args) {
  if (this[name]) {
    this[name].apply(this, [].concat(args));
  } else {
    throw new Error(`Action not found: ${name}`);
  }
};

TableExpandStore.prototype.update = function() {
  const bodyWidth = this.table.$el.clientWidth;
  let bodyMinWidth = 0;
  const flexColumns = this.states.originColumns;
  if (flexColumns.length > 0) {
    flexColumns.forEach((column) => {
      bodyMinWidth += parseInt(column.width || column.minWidth || 80, 10);
    });
    flexColumns.map(function(item) {
      return parseInt(item.minWidth || item.width, 10);
    });
    if (bodyMinWidth < bodyWidth) { // DON'T HAVE SCROLL BAR - this.gutterWidth
      this.scrollX = false;
      const totalFlexWidth = bodyWidth - bodyMinWidth; // - this.gutterWidth
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
  this.table.originColumns = [];
  this.table.originColumns = flexColumns;
};

TableExpandStore.prototype.setData = function(data, callback) {
  let datas = data.slice();
  this.setAttr(datas);
  callback && callback();
};

TableExpandStore.prototype.setAttr = function(datas) {
  for (var i = 0; i < datas.length; i++) {
    /* this.table.$set(datas[i], 'checked', datas[i]['checked'] || false);
    this.table.$set(datas[i], 'halfcheck', false);
    this.table.$set(datas[i], 'disabled', datas[i]['disabled'] || false);
    this.table.$set(datas[i], 'expand', this.states.defaultProps.defaultExpandAll);*/
    if (datas[i][this.states.defaultProps.childKey]) {
      datas[i]['colspan'] = this.states.originColumns.length - 2;
      if (datas[i][this.states.defaultProps.childKey].length > 0) {
        this.setAttr(datas[i][this.states.defaultProps.childKey]);
      }
    }
  }
};

export default TableExpandStore;
