import ScTransfer from './src/main';

/* istanbul ignore next */
ScTransfer.install = function(Vue) {
  Vue.component(ScTransfer.name, ScTransfer);
};

export default ScTransfer;
