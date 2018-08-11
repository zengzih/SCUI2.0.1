import WescTable from './src/table';

/* istanbul ignore next */
WescTable.install = function(Vue) {
  Vue.component(WescTable.name, WescTable);
};

export default WescTable;
