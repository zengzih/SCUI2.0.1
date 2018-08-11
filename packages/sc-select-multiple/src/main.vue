<template>
  <div class="el-sc-select-multiple">
    <el-select
      multiple
      v-model="values"
      @remove-tag="tagOnRemove"
      ref="select"
      :disabled="disabled"
    >
      <SearchInput @change="handleSearch" ref="searchInput"></SearchInput>
      <!-- all -->
      <div>
        <el-checkbox
          v-model="isAll"
          @change="isAllOnChange"
          style="padding: 8px 10px; display: block;"
        >
          {{isAll ? '反选' : '全选'}}
        </el-checkbox>
      </div>
      <!-- options -->
      <el-option
        class="sc-select-multiple-option"
        v-for="(item, index) in this.data"
        :key="item[props.key]"
        :value="item[props.value]"
        :label="item[props.label]"
      >
        <el-checkbox v-model="optionsStatus[index]" @change="updateValues">
          {{item[props.label]}}
        </el-checkbox>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import ElSelect from 'element-ui/packages/select';
import ElCheckbox from 'element-ui/packages/checkbox';
import SearchInput from './search-input.vue';
import { isEqual } from 'lodash';

export default {
  name: 'ScSelectMultiple',
  components: {
    ElSelect,
    ElOption: ElSelect.components.ElOption,
    ElCheckbox,
    SearchInput
  },
  props: {
    value: {},
    data: {
      default: []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data: function() {
    return {
      // 已选内容
      values: [],
      // 勾选对应的状态树
      optionsStatus: {},
      // 是否全选
      isAll: false
    };
  },
  methods: {
    /**
     * 更新已选内容
     * 点击option的checkbox之后，会执行该函数
     */
    updateValues: function() {
      let obj = this.optionsStatus;
      let arr = [];
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] !== false) {
          arr.push(this.data[key]);
        }
      }
      this.isAll = arr.length === this.data.length;
      this.values = arr.map((item) => item[this.props.label]);
      this.$emit('input', arr.map((item) => item[this.props.value]));
      this.$emit('change', arr);
    },
    /**
     * 全选切换
     */
    isAllOnChange: function(e) {
      let obj = {};
      for (var i = 0; i < this.data.length; i++) {
        obj[i] = this.isAll;
      }
      this.optionsStatus = obj;
      this.updateValues();
    },
    /**
     * 标签移除
     */
    tagOnRemove: function(e) {
      let index;
      this.data.map((item, i) => {
        if (item[this.props.label] === e.currentLabel) {
          index = i;
        }
      });
      if (index >= 0) {
        this.$set(this.optionsStatus, index, false);
      }
      this.$emit('remove-tag', e, this.data[index]);
    },
    /**
     * 标签初始化
     */
    tagInit: function(val) {
      this.optionsStatus = {};
      this.data.map((item, index) => {
        if (val.indexOf(item[this.props.value]) === -1) return ;
        this.$set(this.optionsStatus, index, true);
      });
      this.updateValues();
    },
    /**
     * 搜索
     * 搜索框输入变化时，执行该函数
     */
    handleSearch: function(value) {
      this.$refs.select.query = value;
      this.$refs.select.broadcast('ElOptionGroup', 'queryChange');
    },
    empty() {
      this.values = [];
      this.$refs.searchInput.empty();
      this.initOptionsStatus();
      this.isAll = false;
      this.$emit('change', []);
    },
    initOptionsStatus() {
      let obj = {};
      this.data.map((item, index) => (obj[index] = false));
      this.optionsStatus = obj;
    }
  },
  watch: {
    value: function(val, oldVal) {
      if (isEqual(val, oldVal)) return ;
      this.tagInit(val);
    },
    data: function(val, oldVal) {
      if (isEqual(val, oldVal)) return ;
      this.initOptionsStatus();
    }
  },
  mounted() {
    this.tagInit(this.value);
    this.initOptionsStatus();
  }
};
</script>
