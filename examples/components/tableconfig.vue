<template>
  <div>
    <el-table-config :data="data" :column="column" row-key="id" :height="height" highlight-current-row
                     @save-config="saveConfig">
                     <div class="footer-slot" slot="footer">
                       <el-button>取消</el-button>
                     </div>
                    </el-table-config>
  </div>
</template>

<style>
  .footer-slot {
    display: inline-block;
    margin-left: 5px;
  }
</style>

<script>
  export default {
    data() {
      return {
        height: '200',
        data: [
          {
            id: '1111',
            value: '选项1111',
            label: '黄金糕',
            menuState: true
          }, {
            id: '2222',
            value: '选项2',
            label: '双皮奶',
            menuState: false
          }, {
            id: '3333',
            value: '选项3',
            label: '蚵仔煎',
            menuState: true
          }, {
            id: '4444',
            value: '选项4',
            label: '龙须面',
            menuState: false
          }, {
            id: '5555',
            value: '选项5',
            label: '北京烤鸭',
            menuState: true
          }
        ],
        column: [
          {label: '名称', prop: 'label'},
          {
            label: '开关', align: 'center' ,prop: 'menuState', render(h, params) {
            let self = this;
            // return (<el-switch on-color = "#13ce66" off-color = "#ff4949"
            //     v-model = {params.row.menuState}>
            //   </el-switch>
            // )
            return h('ElSwitch', {
              props: {
                onColor: '#13ce66',
                offColor: '#ff4949',
                value: params.row.menuState
              },
              domProps: {
                value: true
              },
              on: {
                input(val) {
                  params.row.menuState = val;
                }
              }
            })
          }
          }
        ]
      };
    },
    watch: {},
    computed: {},
    created() {
    },
    mounted() {
    },
    methods: {
      handlerRowClick() {
        console.log(arguments)
      },
      saveConfig(data) {
        console.log(data);
      }
    }
  };
</script>