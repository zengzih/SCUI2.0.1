<script>
  export default {
    data: function() {
      return {
         options: [{
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
         value: '',
         value1: '',
         defaultProps: {
          label: 'label',
          nodeKey: 'value'
         },
      };
    },
    methods: {
      visibleChange: console.log,
      handlerChange(node) {
        console.log(node);
      }
    }
  };
</script>

## ScSelect 下拉选
自定义组件，下拉选结构选择框。

### 单选
:::demo 所有props属性请参考el-tree组件
```html
<template>
    <sc-select
      :data="options"
      v-model="value"
      :default-props="defaultProps"
      @change="handlerChange"
      @visible-change="visibleChange">
    </sc-select>
</template>

<script>
  export default {
    data: function() {
      return {
        options: [{
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
       value: '',
       filterable: true,
       clearable: true,
       defaultProps: {
        label: 'label',
        nodeKey: 'value'
       }
      };
    },
    methods: {
      handlerChange(node) {
        console.log(node);
      }
    }
  };
</script>

```
:::

### 多选/过滤
:::demo `show-checkbox`为true，filterable为true时, 可以使用多选功能以及过滤功能.
```html
<template>
    <sc-select
      :data="options"
      v-model="value1"
      show-checkbox
      filterable
      :default-props="defaultProps"
      @change="handlerChange"
      @visible-change="visibleChange">
    </sc-select>
</template>

<script>
  export default {
    data: function() {
      return {
        options: [{
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
       defaultProps: {
        label: 'label',
        nodeKey: 'value'
       }
      };
    },
    methods: {
      handlerChange(node, allNode) {
        // ...
      },
      visibleChange(vis) {
        // ...
      }
    }
  };
</script>

```
:::

### ScSelect Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| data          | 类型   | array  | — | [] |
| v-model       | 绑定值           | string  | — | — |
| placeholder   | 输入框占位文本    | string          | — | — |
| disabled      | 禁用            | boolean         | — | false   |
| filterable    | 是否可搜索   | boolean  | — | false |
| show-checkbox   | 是否是多选 | boolean          | false | — |
| clearable      | 单选时是否可以清空选项            | boolean         | — | false   |
| multiple-limit	      | 多选时用户最多可以选择的项目数，为 0 则不限制            | number         | — | 0   |

### ScSelect Events
| 事件名称 | 说明 | 回调参数 |
|---------|---------|---------|
| change | 选中值发生变化时触发 | 目前的选中值/所有选中的值 |
| visible-change | 下拉框出现/隐藏时触发 | 出现则为 true，隐藏则为 false |
| clear | 可清空的单选模式下用户点击清空按钮时触发 | — |