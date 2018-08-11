<template>
  <div class="el-sc-select-tree-remote">
    <el-select
      v-model="values"
      :multiple="isMultiple"
      @remove-tag="handleTagRemove"
      ref="select"
    >
      <SearchInput
        @change="handleSearch"
        placeholder="请输入关键字"
      ></SearchInput>
      <el-option
        value="value"
        class="sc-select-tree-option"
      >
        <el-tree
          ref="tree"
          :data="data"
          :props="props"
          :node-key="nodeKey"
          :show-checkbox="isMultiple"
          @check-change="handleNodeCheck"
          @node-click="handleNodeClick"
          v-loading="loading"
        >
        </el-tree>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import ElSelect from 'element-ui/packages/select';
import ElTree from 'element-ui/packages/tree';
import SearchInput from '../../sc-select-multiple/src/search-input.vue';

/**
 * 判断树节点是否包含子节点
 */
function hasChildren(obj) {
  return obj.hasOwnProperty('children') &&
    Array.isArray(obj.children) &&
    obj.children.length > 0;
};

// 更新定时器
let changeTimer = null;

export default {
  name: 'ScSelectTreeRemote',
  props: {
    isMultiple: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default: function() {
        return {
          children: 'children',
          label: 'label'
        };
      }
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    nodeKey: String,
    url: String,
    method: {
      type: String,
      default: 'get'
    },
    queryKey: {
      type: String,
      default: 'keyword'
    }
  },
  data: function() {
    return {
      data: [],
      values: [],
      nodes: {},
      loading: false
    };
  },
  methods: {
    handleSearch: function(searchValue) {
      this.data = [];

      searchValue = searchValue.trim();
      if (!searchValue) {
        this.loading = false;
        return;
      }

      this.loading = true;

      this.$http({
        url: `${this.url}?${this.queryKey}=${decodeURIComponent(searchValue)}`,
        method: this.method,
        headers: {
          contentType: 'application/json'
        }
      })
        .then(value => {
          this.data = value.data.data;
          this.loading = false;
        })
        .catch((e) => {
          // console.error(e);
          this.data = [];
          this.loading = false;
        });
    },
    handleNodeClick: function(obj, node, component) {
      if (this.isMultiple || hasChildren(obj)) return;
      this.$refs.select.visible = false;
      this.values = obj.label;
      this.$emit('change', obj[this.valueKey]);
    },
    handleNodeCheck: function(obj, isChecked, isCheckedChildren) {
      if (hasChildren(obj)) return;
      this.$set(this.nodes, obj.id, isChecked ? obj : null);
      if (changeTimer) {
        clearTimeout(changeTimer);
        changeTimer = null;
      }
      changeTimer = setTimeout(this.updateValues, 300);
    },
    updateValues: function() {
      let labels = [];
      let ids = [];
      for (var key in this.nodes) {
        let node = this.nodes[key];
        if (node) {
          labels.push(node.label);
          ids.push(node[this.valueKey]);
        }
      }
      this.values = labels;
      this.$emit('change', ids);
    },
    handleTagRemove: function(e) {
      let nodes = this.$refs.tree.getCheckedNodes(true);
      let currentNode = null;
      nodes.map((item) => {
        if (item.label !== e.currentLabel) return;
        currentNode = item;
      });
      if (!currentNode) return;
      this.$refs.tree.setChecked(currentNode[this.nodeKey], false);
    }
  },
  components: {
    ElSelect,
    ElOption: ElSelect.components.ElOption,
    ElTree,
    SearchInput
  }
};
</script>
