import ScTableColumn from '../sc-table/src/table-column';

/* istanbul ignore next */
ScTableColumn.install = function(Vue) {
  Vue.component(ScTableColumn.name, ScTableColumn);
};

export default ScTableColumn;
