<script>
export default {
  data() {
    return {
      attachThead: [
        {
          start: 2,
          end: 2,
          text: 'title1',
          align: 'center'
        },
        {
          start: 3,
          end: 3,
          text: 'title2',
          align: 'center'
        }
      ],
      columns: [
         {
           head: '市场',
           title: 'this is a title',
           align: 'center',
           field: 'market',
           width: '50px',
           tooltip: false
         },
         {
      	   head:'业务类型',
           title: 'this is a title again',
           field: 'type',
           align: 'center',
           tooltip: false
         },
         {
           head:'代理',
           title: 'this is a title again',
           field: 'proxy',
           align: 'center',
           tooltip: true,
           width: '100px'
         }
       ],
      defaultProps:{
    		disableKey:'disabled',
      	childKey:'children',
      	nodeKey:'id',
        checkKey: 'checked'
    	},
      data: [
        {
          id: Math.random(),
          market: '市场A',
          type: '业务类型A',
          proxy: '证券代理A',
          number: 'A0001',
          total: 999999,
          title: '这是合并之后的标题文本1',
          disabled: true,
          children: [
            {
              id: Math.random(),
              market: '市场AAA',
              type: '业务类型AAA',
              proxy: '证券代理AAA',
              number: 'AAA0001',
              total: 999999
            },
            {
              id: Math.random(),
              market: '市场BBB',
              type: '业务类型BBB',
              proxy: '证券代理BBB',
              number: 'BBB0001',
              total: 999999,
              disable: true
            },
            {
              id: Math.random(),
              market: '市场CCC',
              type: '业务类型CCC',
              proxy: '证券代理CCC',
              number: 'CCC0001',
              total: 999999
            }
          ]
        },
        {
          id: Math.random(),
          market: '市场B',
          type: '业务类型B',
          proxy: '证券代理B',
          number: 'B0001',
          total: 999999,
          title: '这是合并之后的标题文本2',
          disable: true
        },
        {
          id: Math.random(),
          market: '市场C',
          type: '业务类型C',
          proxy: '证券代理C',
          number: 'C0001',
          title: '这是合并之后的标题文本3',
          total: 999999
        }
      ]
    };
  },
  methods: {
    change: console.log
  }
};
</script>

## ScTableExpand 可展开表格

### 默认
:::demo `data`是初始化数据
```html
<template>
  <sc-table-expand
    :data="data"
    :props="defaultProps"
    @change=""
    height="300px"
    @expand=""
    @child-check="change"
    :columns="columns"
    trHeight="30px"
    :attach-thead="attachThead"
    ref="table"
  >
  </sc-table-expand>
</template>

<script>
export default {
  data() {
    return {
      attachThead: [
        {
          start: 2,
          end: 2,
          text: 'title1',
          align: 'center'
        },
        {
          start: 3,
          end: 3,
          text: 'title2',
          align: 'center'
        }
      ],
      columns: [
         {
           head: '市场',
           title: 'this is a title',
           align: 'center',
           field: 'market',
           width: '50px',
           tooltip: false
         },
         {
      	   head:'业务类型',
           title: 'this is a title again',
           field: 'type',
           align: 'center',
           tooltip: false
         },
         {
           head:'代理',
           title: 'this is a title again',
           field: 'proxy',
           align: 'center',
           tooltip: true,
           width: '100px'
         }
       ],
      defaultProps:{
        disableKey:'disabled',
      	childKey:'children',
      	nodeKey:'id',
        checkKey: 'checked'
    	},
      data: [
        {
          id: Math.random(),
          market: '市场A',
          type: '业务类型A',
          proxy: '证券代理A',
          number: 'A0001',
          total: 999999,
          title: '这是合并之后的标题文本1',
          disabled: true,
          children: [
            {
              id: Math.random(),
              market: '市场AAA',
              type: '业务类型AAA',
              proxy: '证券代理AAA',
              number: 'AAA0001',
              total: 999999
            },
            {
              id: Math.random(),
              market: '市场BBB',
              type: '业务类型BBB',
              proxy: '证券代理BBB',
              number: 'BBB0001',
              total: 999999,
              disable: true
            },
            {
              id: Math.random(),
              market: '市场CCC',
              type: '业务类型CCC',
              proxy: '证券代理CCC',
              number: 'CCC0001',
              total: 999999
            }
          ]
        },
        {
          id: Math.random(),
          market: '市场B',
          type: '业务类型B',
          proxy: '证券代理B',
          number: 'B0001',
          total: 999999,
          title: '这是合并之后的标题文本2',
          disable: true
        },
        {
          id: Math.random(),
          market: '市场C',
          type: '业务类型C',
          proxy: '证券代理C',
          number: 'C0001',
          title: '这是合并之后的标题文本3',
          total: 999999
        }
      ]
    };
  },
  methods: {
    change: console.log
  }
};
</script>

```
:::

### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| data | 数据 | array | — | — |
| props | 定义子属性名称 | object | disableKey/childKey/nodeKey/checkKey | - |
| columns | 定义表格渲染 | array | - | - |
| height | 滚动高度 | string | — | 500px |
| trHeight | 一行高度（用户计算滚动加载的数量） | string | — | 30px |
| attach-thead | 附加表头 | array | — | — |

#### columns 属性说明
```
{
  head: '市场', // 表头显示
  title: 'this is a title', // 父级显示
  // 自定义父级html
  renderTitle: function(row, index) {
    return '<span>content</span>'
  },
  field: 'market', // 子级显示的属性名称
  // 自定义子级html
  render: function(row, index) {
    return '<span>content</span>'
  },
  align: 'center', // 对齐方式 left/center/right
  width: '50px', // 指定宽度（不写为自动）
  tooltip: false // 是否显示鼠标提示
  // 是否显示悬浮提示窗口
  popover: function(col, index) {
    return true;
  },
  // 自定义悬浮提示窗口的html
  renderPopover: function(row, index) {
    return `<h1>${row.bizTypeName}</h1>`
  }
}
```

#### attach-thead 属性说明
```
{
  start: 2, // 合并单元格的开始索引
  end: 2, // 合并单元格的结束索引
  text: 'title1', // 显示的内容
  align: 'center' // 对齐方式 left/center/right
}
```


### Events
| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| change | 勾选变化时触发 | selection |
| expand | 展开/关闭时触发 | (row, isExpaned, index) |
| child-check | 子级 | (parent, selection) |
