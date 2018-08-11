<script>
  export default {
    data() {
      return {
        data: [
          {
            test1: '测试内容1',
            test2: '测试内容2',
            test3: '测试内容3',
            test4: '测试内容4',
            test5: '测试内容5'
          }
        ],
        config: []
      };
    },
    created() {
      this.config = [1, 2, 3, 4, 5].map((item) => {
        return {
          field: `test${item}`,
          name: `测试字段${item}`,
          visible: true,
          order: item,
          width: '',
          format: ''
        };
      });
    }
  };
</script>

## ScTableConfigurable 可配置列的表格

### demo
:::demo `data`是表格的数据, `config`是配置的数据
```html
<template>
  <sc-table-configurable
    :config="config"
    :data="data">
  </sc-table-configurable>
</template>
<script>
  export default {
    data() {
      return {
        data: [
          {
            test1: '测试内容1',
            test2: '测试内容2',
            test3: '测试内容3',
            test4: '测试内容4',
            test5: '测试内容5'
          }
        ],
        config: []
      };
    },
    created() {
      this.config = [1, 2, 3, 4, 5].map((item) => {
        return {
          field: `test${item}`,
          name: `测试字段${item}`,
          visible: true,
          order: item,
          width: '',
          format: ''
        };
      });
    }
  };
</script>
```
:::
