import ScTableConfig from './src/main';

/* istanbul ignore next */
ScTableConfig.install = function(Vue) {
  Vue.component(ScTableConfig.name, ScTableConfig);
};

export default ScTableConfig;
