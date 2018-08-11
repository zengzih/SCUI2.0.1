import ScUpload from './src';

/* istanbul ignore next */
ScUpload.install = function(Vue) {
  Vue.component(ScUpload.name, ScUpload);
};

export default ScUpload;
