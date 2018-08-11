import ScSelect from './src/select';

/* istanbul ignore next zzh*/
ScSelect.install = function(Vue) {
  Vue.component(ScSelect.name, ScSelect);
};

export default ScSelect;
