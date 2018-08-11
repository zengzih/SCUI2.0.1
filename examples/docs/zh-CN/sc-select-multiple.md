<script>
  export default {
    data: function() {
      return {
        data: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
      }
    },
    methods: {
      checkChange(values) {
        console.log(values)
      }
    }
  };
</script>

## ScSelectMultiple 下拉多选框
自定义组件，用于下拉多选。

:::demo `data`是提供给用户选择的数组, `change`事件用于接收复选按钮的变化
```html
<template>
  <sc-select-multiple :data="data" @change="checkChange"></sc-select-multiple>
</template>

<script>
export default {
  data: function() {
    return {
      data: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  },
  methods: {
    checkChange(values) {
      console.log(values)
    }
  }
};
</script>
```
:::
