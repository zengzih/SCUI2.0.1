<template>
  <div>
    <ul>
      <li v-for="(item, index) in $data.$list" @click="handlerClick(item, index)">
        <label>
          <input type="checkbox" :checked="checkList[item[nodeKey]]" :class="getClass(item)">
          <span></span>
          <span class="inner">{{ item[label] }}</span>
        </label>
      </li>
    </ul>
  </div>
</template>
<style>
  * {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  li {
    line-height: 30px;
    border: 1px solid darkgray;
    margin-top: -1px;
    padding: 0 10px;
  }

</style>

<script>
  let data = [
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
    }]
  export default {
    data() {
      return {
        $list: data,
        checkList: {},
        nodeKey: 'value',
        label: 'label'
      };
    },
    watch: {
      "$data.$list": {
        handler(val) {
          console.log(val);
        },
        deep: true
      }
    },
    computed: {},
    created() {
      this.$data.$list.forEach((item) => {
        this.checkList[item[this.nodeKey]] = false;
      })
      console.log(this.checkList);
    },
    mounted() {
    },
    methods: {
      getClass(itme) {
        return this.checkList[itme[this.nodeKey]] ? 'check' : 'no_check';
      },
      handlerClick(item, index) {
        item[this.label] = item[this.label] + index; 
       // this.checkList[item[this.nodeKey]] = !this.checkList[item[this.nodeKey]];
        // item._label = item._label + index;
      }
    }
  };
</script>

<style>

</style>
<!-- 
<template>
  <div>
    <ul>
      <li v-for="(item, index) in list" @click="handlerClick(item, index)">
        <label>
          <input type="checkbox" :checked="checkList[item[nodeKey]]" :class="getClass(item)">
          <span></span>
          <span class="inner">{{ item[label] }}</span>
        </label>
      </li>
    </ul>
  </div>
</template>
<style>
  * {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  li {
    line-height: 30px;
    border: 1px solid darkgray;
    margin-top: -1px;
    padding: 0 10px;
  }
</style>

<script>
  let data = [
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
    }]
  export default {
    data() {
      return {
        list: data,
        checkList: {},
        nodeKey: 'value',
        label: 'label'
      };
    },
    watch: {
      list: {
        handler(val) {
          console.log(val);
        },
        deep: true
      }
    },
    computed: {},
    created() {
      this.list.forEach((item) => {
        this.checkList[item[this.nodeKey]] = false;
      })
      console.log(this.checkList);
    },
    mounted() {
    },
    methods: {
      getClass(itme) {
        return this.checkList[itme[this.nodeKey]] ? 'check' : 'no_check';
      },
      handlerClick(item, index) {
        item.label = item.label + index;
        // this.checkList[item[this.nodeKey]] = !this.checkList[item[this.nodeKey]];
        // item._label = item._label + index;
      }
    }
  };
</script>

<style>
</style> -->