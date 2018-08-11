import ScSelectTreeRemote from './src/main';

/* istanbul ignore next */
ScSelectTreeRemote.install = function(Vue) {
  Vue.component(ScSelectTreeRemote.name, ScSelectTreeRemote);
};

export default ScSelectTreeRemote;
