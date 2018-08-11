import ElTableConfig from './src/index';

/* istanbul ignore next */
ElTableConfig.install = function(Vue) {
  Vue.component(ElTableConfig.name, ElTableConfig);
};
export default ElTableConfig;
