<template>
  <div class="el-sc-table-load-less">
    <el-table
      ref="table"
      :data="tableData"
      :height="height"
      :row-class-name="rowClassName"
      style="width:100%"
      fit
      border
      stripe
      @sort-change="sortChange"
    >

      <el-table-column :render-header="renderHeader" :width="checkWidth">
        <template scope="scope">
          <el-checkbox v-model="checkTree[scope.row.id]" @change="checkboxChange(scope.row, $event)"></el-checkbox>
        </template>
      </el-table-column>

      <slot></slot>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ScTableLoadLess',
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    height: {
      type: Number,
      default: 500
    },
    trHeight: {
      type: Number,
      default: 40
    },
    rowClassName: {
      type: String,
      default: ''
    },
    checkWidth: {
      type: Number,
      default: 50
    }
  },
  data() {
    return {
      tableData: [],
      checkTree: {}
    };
  },
  watch: {
    data: function(val, oldVal) {
      this.tbody.scrollTop = 0;
      this.tableData = [];
      this.checkTree = {};
      this.json = val.slice();
      this.appendData();

      // 清除全选框的勾选样式
      let checkbox = document.querySelector('.el-sc-table-load-less thead .el-checkbox__input');
      if (!checkbox) return ;
      checkbox.className = checkbox.className.replace('is-checked', '');
    }
  },
  methods: {
    handleScroll(e) {
      const { scrollHeight, scrollTop, offsetHeight } = e.target;
      if (scrollTop + offsetHeight >= scrollHeight) {
        this.appendData();
      }
    },
    appendData() {
      let line = parseInt(this.height / this.trHeight + 5, 10);
      this.tableData = this.tableData.concat(this.json.splice(0, line));
    },
    renderHeader(h, obj) {
      return h('el-checkbox', {
        on: {
          change: (e) => {
            let isChecked = e.target.checked;
            let tree = {};
            [...this.tableData, ...this.json].map((item) => {
              tree[item.id] = isChecked;
            });
            this.checkTree = tree;
            this.checkboxChange();
          }
        }
      });
    },
    checkboxChange(row) {
      let arr = [];
      this.data.map((item) => {
        if (!this.checkTree[item.id]) return ;
        arr.push(item);
      });
      if (row) {
        // 根据是否全选，修改全选框的样式
        let isAll = arr.length === this.tableData.length + this.json.length;
        let checkbox = document.querySelector('.el-sc-table-load-less thead .el-checkbox__input');
        if (isAll) {
          checkbox.className = checkbox.className + ' is-checked';
        } else {
          checkbox.className = checkbox.className.replace('is-checked', '');
        }

        this.$emit('select', arr, row);
      } else {
        this.$emit('select-all', arr);
      }
    },
    sortChange(arg) {
      this.$emit('sort-change', arg);
    }
  },
  mounted() {
    this.tbody = this.$refs.table.$el.querySelector('.el-table__body-wrapper');
    this.tbody.addEventListener('scroll', this.handleScroll);

  },
  beforeDestroy() {
    this.tbody.removeEventListener('scroll', this.handleScroll);
  }
};
</script>
