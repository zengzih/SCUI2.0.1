<template>
  <sc-template :data="data">
    <template scope="scope">
      <span :calss="getScope(scope)">{{ scope.row.label }} slot</span>
    </template>
  </sc-template> 
</template>

<script>
  export default {
    data() {
      return {
        data: [
          {
            value: '选项1111',
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
      getScope(scope) {
        debugger;
        console.log(scope);
      }
    }
  };
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    line-height: 30px;
    border: 1px solid rgb(218, 214, 214);
    margin-top: -1px;
    padding-left: 20px;
  }
</style>