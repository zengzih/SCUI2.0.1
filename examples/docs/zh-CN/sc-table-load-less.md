<script>
  export default {
    data: function() {
      return {
        data: []
      };
    },
    mounted() {
      for (var i = 0; i < 500; i++) {
        this.data.push({
          id: i,
          a: `${i} - ${Math.random()}`,
          b: `${i} - ${Math.random()}`,
          c: `${i} - ${Math.random()}`,
          d: `${i} - ${Math.random()}`,
          e: `${i} - ${Math.random()}`,
          f: `${i} - ${Math.random()}`
        });
      };
    },
    methods: {
      select: console.log,
      selectAll: console.log
    }
  };
</script>

## ScTableLoadLess 表格初始最小化加载

### demo
:::demo `tr-height`是一行的高度，用于计算一屏的滚动高度。`check-width`是复选框那列的宽度。
```html
<template>
  <sc-table-load-less
    :data="data"
    :height="500"
    :tr-height="30"
    :check-width="50"
    @select="select"
    @select-all="selectAll"
  >
    <el-table-column prop="a" label="a" :sortable="true"></el-table-column>
    <el-table-column prop="b" label="b" :sortable="true"></el-table-column>
    <el-table-column prop="c" label="c" :sortable="true"></el-table-column>
    <el-table-column prop="d" label="d" :sortable="true"></el-table-column>
    <el-table-column prop="e" label="e" :sortable="true"></el-table-column>
    <el-table-column prop="f" label="f" :sortable="true"></el-table-column>
  </sc-table-load-less>
</template>

<script>
  export default {
    data: function() {
      return {
        data: []
      };
    },
    mounted() {
      for (var i = 0; i < 500; i++) {
        this.data.push({
          id: i,
          a: `${i} - ${Math.random()}`,
          b: `${i} - ${Math.random()}`,
          c: `${i} - ${Math.random()}`,
          d: `${i} - ${Math.random()}`,
          e: `${i} - ${Math.random()}`,
          f: `${i} - ${Math.random()}`
        });
      };
    }
  };
</script>
```
:::
