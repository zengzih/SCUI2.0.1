<template>
  <div id="ScSelectMultipleSearchInput">
    <el-input
      :placeholder="placeholder"
      @change="handleChange"
      autofocus
      v-model="text"
    >
    </el-input>
  </div>
</template>
<script>
let timer = null;

export default {
  name: 'ScSelectMultipleSearchInput',
  props: {
    placeholder: {
      type: String,
      default: '快速定位'
    }
  },
  data: () => ({
    text: ''
  }),
  methods: {
    handleChange(value) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => {
        this.$emit('change', value);
      }, 300);
    },
    empty() {
      this.text = '';
      this.$emit('change', '');
    }
  }
};
</script>
