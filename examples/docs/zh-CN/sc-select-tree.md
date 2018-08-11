<script>
  export default {
    data: function() {
      return {
        data: [{
          id: '1',
          label: '一级 2',
          children: [{
            id: '3',
            label: '二级 2-1',
            children: [{
              id: '4',
              label: '三级 3-1-1'
            }, {
              id: '5',
              label: '三级 3-1-2'
            }]
          }, {
            id: '2',
            label: '二级 2-2',
            children: [{
              id: '6',
              label: '三级 3-2-1'
            }, {
              id: '7',
              label: '三级 3-2-2'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label',
          nodeKey: 'id'
        },
        value: '',
        filterable: true,
        defaultExpandedKeys: ['1'],
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

## ScSelectTree 下拉树选择框
自定义组件，下拉树形结构选择框。

### 单选
```html
<template>
    <sc-select-tree
      :data="data"
      v-model="value"
      :default-props="defaultProps"
      @change="handlerChange"
      @visible-change="visibleChange">
    </sc-select-tree>
</template>

<script>
  export default {
    data: function() {
      return {
        data: [{
          id: 1,
          label: '一级 2',
          children: [{
            id: 3,
            label: '二级 2-1',
            children: [{
              id: 4,
              label: '三级 3-1-1'
            }, {
              id: 5,
              label: '三级 3-1-2'
            }]
          }, {
            id: 2,
            label: '二级 2-2',
            children: [{
              id: 6,
              label: '三级 3-2-1'
            }, {
              id: 7,
              label: '三级 3-2-2'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label',
          nodeKey: 'id'
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
:::demo `show-checkbox`为true以及`filterable`为true时，设置下拉树为多选以及过滤功能
```html
<template>
    <sc-select-tree
      :data="data"
      show-checkbox
      filterable
      :default-props="defaultProps"
      :is-multiple="true"
      :default-expanded-keys="defaultExpandedKeys"
      ref="selectTree">
    </sc-select-tree>
</template>

<script>
  export default {
    data: function() {
      return {
        data: [{
          id: 1,
          label: '一级 2',
          children: [{
            id: 3,
            label: '二级 2-1',
            children: [{
              id: 4,
              label: '三级 3-1-1'
            }, {
              id: 5,
              label: '三级 3-1-2'
            }]
          }, {
            id: 2,
            label: '二级 2-2',
            children: [{
              id: 6,
              label: '三级 3-2-1'
            }, {
              id: 7,
              label: '三级 3-2-2'
            }]
          }]
        }],
        defaultExpandedKeys: ['1'],
        defaultProps: {
          children: 'children',
          label: 'label',
          nodeKey: 'id'
        }
      };
    }
  };
</script>

```
:::

### ScSelectTree Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| data          | 类型   | array  | — | [] |
| v-model       | 绑定值           | string  | — | — |
| placeholder   | 输入框占位文本    | string          | — | — |
| disabled      | 禁用            | boolean         | — | false   |
| filterable    | 是否可搜索   | boolean  | — | false |
| show-checkbox   | 是否是多选 | boolean          | false | — |
| clearable      | 单选时是否可以清空选项            | boolean         | — | false   |
| defaultExpandedKeys      | 默认展开的节点，值为nodeKey            | string         | — |    |
| defaultExpandAll      | 默认展开所有节点 | boolean         | — |  false  |
| defaultCheckAll      | 默认选中所有节点  | boolean         | — |  false  |
| showPopover      | 当选中的节点的值过多时，使用popover来显示所有选中的节点的label   | string         | — |  false  |
| popoverWidth      | 设置popover的宽度  | string         | — |  400px  |


### ScSelectTree Events
| 事件名称 | 说明 | 回调参数 |
|---------|---------|---------|
| change | 选中值发生变化时触发 | 目前的选中值/所有选中的值 |
| visible-change | 下拉框出现/隐藏时触发 | 出现则为 true，隐藏则为 false |
| clear | 可清空的单选模式下用户点击清空按钮时触发 | — |
| change | 选中值发生变化时触发 | 所有选中的节点值 |
| check-change | 选中值发生变化时触发 | 当前选中的节点，当前节点的父节点，所有选中的节点，当前节点对象(当前节点数据，是否选中当前节点) |
| node-expand | 节点被展开时触发的事件 | 当前节点 |
| node-collapse | 节点被关闭时触发的事件 | 当前节点 |

### ScSelectTree 方法
`ScSelectTree` 拥有如下方法，假如ScSelectTree的ref为tree：
| 事件名称 | 说明 | 参数 |
|---------|---------|---------|
| setNodeExpand | 手动设置节点的展开 | 值为数组 (nodeKey)|
| getCheckedKeys | 手动获取当前所有选中的节点(多选模式下可用) |  |
| setCheckedKeys | 手动设置选中节点 | string  (nodekey) |