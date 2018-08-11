import ScTable from './src/table';

/* istanbul ignore next */
ScTable.install = function(Vue) {
  Vue.component(ScTable.name, ScTable);
};

export default ScTable;
