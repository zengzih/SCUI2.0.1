import scrollbarWidth from 'element-ui/src/utils/scrollbar-width';
const TableLayout = function(options) {
  this.columns = null;
  this.fit = true;
  this.showHeader = true;

  this.height = null;
  this.scrollX = false;
  this.scrollY = false;
  this.bodyWidth = null;
  this.fixedWidth = null;
  this.rightFixedWidth = null;
  this.tableHeight = null;
  this.headerHeight = 44; // Table Header Height
  this.footerHeight = 44; // Table Footer Height
  this.viewportHeight = null; // Table Height - Scroll Bar Height
  this.bodyHeight = null; // Table Height - Table Header Height
  this.fixedBodyHeight = null; // Table Height - Table Header Height - Scroll Bar Height
  this.gutterWidth = scrollbarWidth();
  for (let name in options) {
    if (options.hasOwnProperty(name)) {
      this[name] = options[name];
    }
  }

  this.getFitColumnWidth = function(bodyWidth) {
    const totalFlexWidth = bodyWidth - this.gutterWidth - this.store.states.fitColumnAllWidth;
    const flexColumns = this.store.states.columns;

    if (flexColumns.length === 1) {
      flexColumns[0].realWidth = flexColumns[0].realWidth + totalFlexWidth;
    } else {
      const allColumnsWidth = flexColumns.reduce((prev, column) => prev + column.realWidth, 0);
      const flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
      let noneFirstWidth = 0;

      flexColumns.forEach((column, index) => {
        if (index === 0) return;
        const flexWidth = Math.floor(column.realWidth * flexWidthPerPixel);
        noneFirstWidth += flexWidth;
        column.realWidth = column.realWidth + flexWidth;
      });
      flexColumns[0].realWidth = flexColumns[0].realWidth + totalFlexWidth - noneFirstWidth;
    }
  };

  this.update = function() {
    const fit = this.fit;
    const columns = this.store.states.columns;
    const bodyWidth = this.table.$el.clientWidth;
    let bodyMinWidth = 0;
    const flattenColumns = [];
    columns.forEach((column) => {
      if (column.isColumnGroup) {
        flattenColumns.push.apply(flattenColumns, column.columns);
      } else {
        flattenColumns.push(column);
      }
    });
    let flexColumns = flattenColumns.filter((column) => typeof column.width !== 'number');
    if (flexColumns.length > 0 && fit) {
      flattenColumns.forEach((column) => {
        bodyMinWidth += column.realWidth;// column.width || column.minWidth || 80;
      });
      if (bodyMinWidth < bodyWidth - this.gutterWidth) { // DON'T HAVE SCROLL BAR
        this.scrollX = false;

        const totalFlexWidth = bodyWidth - this.gutterWidth - bodyMinWidth;
        if (flexColumns.length === 1) {
          flexColumns[0].realWidth = flexColumns[0].realWidth + totalFlexWidth;  // (flexColumns[0].minWidth || 80) + totalFlexWidth;
        } else {
          // 将表格的所有宽度加起来
          const allColumnsWidth = flexColumns.reduce((prev, column) =>
            // prev + (column.minWidth || 80), 0);
            prev + column.realWidth, 0);
          const flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
          let noneFirstWidth = 0;
          flexColumns.forEach((column, index) => {
            if (index === 0) return;
            const flexWidth = Math.floor((column.realWidth) * flexWidthPerPixel); // Math.floor((column.minWidth || 80) * flexWidthPerPixel);
            noneFirstWidth += flexWidth;
            column.realWidth = column.realWidth + flexWidth;  // (column.minWidth || 80) + flexWidth;
          });
          flexColumns[0].realWidth = flexColumns[0].realWidth + totalFlexWidth - noneFirstWidth;  // (flexColumns[0].minWidth || 80) + totalFlexWidth - noneFirstWidth;
        }
      } else { // HAVE HORIZONTAL SCROLL BAR
        this.scrollX = true;
        flexColumns.forEach(function(column) {
          column.realWidth = column.realWidth;
        });
      }

      this.bodyWidth = Math.max(bodyMinWidth, bodyWidth);
    } else {
      flattenColumns.forEach((column) => {
        // if (!column.width && !column.minWidth) {
        //   column.realWidth = 80;
        // } else {
        //   column.realWidth = column.width || column.minWidth;
        // }

        bodyMinWidth += column.realWidth;
      });
      this.scrollX = bodyMinWidth > bodyWidth;

      this.bodyWidth = bodyMinWidth;
    }
    const fixedColumns = this.store.states.fixedColumns;

    if (fixedColumns.length > 0) {
      let fixedWidth = 0;
      fixedColumns.forEach(function(column) {
        fixedWidth += column.realWidth;
      });

      this.fixedWidth = fixedWidth;
    }

    const rightFixedColumns = this.store.states.rightFixedColumns;
    if (rightFixedColumns.length > 0) {
      let rightFixedWidth = 0;
      rightFixedColumns.forEach(function(column) {
        rightFixedWidth += column.realWidth;
      });

      this.rightFixedWidth = rightFixedWidth;
    }
  };

  this.setHeight = function(value, prop = 'height') {
    const el = this.table.$el;
    if (typeof value === 'string' && /^\d+$/.test(value)) {
      value = Number(value);
    }

    this.height = value;

    if (!el) return;
    if (typeof value === 'number') {
      el.style[prop] = value + 'px';

      this.updateHeight();
    } else if (typeof value === 'string') {
      if (value === '') {
        el.style[prop] = '';
      }
      this.updateHeight();
    }
  };

  this.setMaxHeight = function(value) {
    return this.setHeight(value, 'max-height');
  };

  this.updateHeight = function() {
    const height = this.tableHeight = this.table.$el.clientHeight;
    const noData = !this.table.data || this.table.data.length === 0;
    const { headerWrapper, footerWrapper } = this.table.$refs;
    const footerHeight = this.footerHeight = footerWrapper ? footerWrapper.offsetHeight : 0;
    if (this.showHeader && !headerWrapper) return;
    if (!this.showHeader) {
      this.headerHeight = 0;
      if (this.height !== null && (!isNaN(this.height) || typeof this.height === 'string')) {
        this.bodyHeight = height - footerHeight + (footerWrapper ? 1 : 0);
      }
      this.fixedBodyHeight = this.scrollX ? height - this.gutterWidth : height;
    } else {
      const headerHeight = this.headerHeight = headerWrapper.offsetHeight;
      const bodyHeight = height - headerHeight - footerHeight + (footerWrapper ? 1 : 0);
      if (this.height !== null && (!isNaN(this.height) || typeof this.height === 'string')) {
        this.bodyHeight = bodyHeight;
      }
      this.fixedBodyHeight = this.scrollX ? bodyHeight - this.gutterWidth : bodyHeight;
    }
    this.viewportHeight = this.scrollX ? height - (noData ? 0 : this.gutterWidth) : height;
  };

  this.updateScrollY = function() {
    const height = this.height;
    if (typeof height !== 'string' && typeof height !== 'number') return;
    const bodyWrapper = this.table.bodyWrapper;
    if (this.table.$el && bodyWrapper) {
      const body = bodyWrapper.querySelector('.el-table__body');
      this.scrollY = body.offsetHeight > bodyWrapper.offsetHeight;
      body.scrollTop = 0;
      body.scrollLeft = 0;
    }
  };
};
export default TableLayout;
