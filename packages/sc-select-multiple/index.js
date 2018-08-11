import ScSelectMultiple from './src/main';

/* istanbul ignore next */
ScSelectMultiple.install = function(Vue) {
  Vue.component(ScSelectMultiple.name, ScSelectMultiple);
};

export default ScSelectMultiple;
