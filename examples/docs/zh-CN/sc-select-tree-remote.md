<script>
export default {
  methods: {
    change(values) {
      console.log(values);
    }
  }
};
</script>

## ScSelectTreeRemote 下拉树选择远程数据
自定义组件，用于下拉树状选择，数据通过远程获取。

:::demo `url`是接口地址, `method`是调用接口的方法, `query-key`是接口查询的参数名称, 其他的请参考`sc-select-tree`组件。
```html
<template>
  <sc-select-tree-remote
    url="http://demo9594961.mockable.io/tree"·
    method="get"
    query-key="search"
    :is-multiple="true"
    node-key="id"
    value-key="id"
    @change="change"
  >
  </sc-select-tree-remote>
</template>

<script>
export default {
  methods: {
    change(values) {
      console.log(values);
    }
  }
};
</script>
```
:::
