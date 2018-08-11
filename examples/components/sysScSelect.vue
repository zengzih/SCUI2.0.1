<template>
  <div>
    <el-button @click="handlerClick">选中</el-button>
    <sc-select :data="options" v-model="formData.model" :default-props="defaultProps" show-checkbox filterable></sc-select>
  </div>
</template>

<script>
  var data = [
    {
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
    }];
  export default {
    data() {
      return {
        formData: {
          model: ''
        },
        options: [],
        defaultProps: {
          label: 'label',
          nodeKey: 'value'
        }
      };
    },
    mounted() {
      // this.formData.model = '选项1'
      this.$nextTick(() => {
        this.options = data;
        // this.formData = Object.assign({}, this.formData)

        this.formData.model = '选项1';
      });
    },
    methods: {
      handlerClick() {
        this.options = data;
      }
    }
  }
</script>