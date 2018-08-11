<template>
  <div class="config-table">
    <wesc-table :data="datas" @row-click="handlerRowClick" :column="column" :highlight-current-row="highlightCurrentRow"
                :row-key="rowKey" :height="heights"></wesc-table>
    <div class="footer">
      <div class="content">
        <el-button icon="arrow-up" :disabled="rowIndex == 0 || rowIndex === -1" @click="handlerBtnClick('up')">上移</el-button>
        <el-button icon="arrow-down" :disabled="rowIndex == datas.length - 1 || rowIndex === -1" @click="handlerBtnClick('down')">下移</el-button>
        <el-button icon="caret-top" :disabled="rowIndex == 0 || rowIndex === -1" @click="handlerBtnClick('top')">置顶</el-button>
        <el-button icon="caret-bottom" :disabled="rowIndex == datas.length - 1 || rowIndex === -1" @click="handlerBtnClick('bottom')">置底</el-button>
        <el-button type="primary" @click="handlerSave">保存</el-button>
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ElTableConfig',
    props: {
      height: [String, Number],
      data: Array,
      column: Array,
      rowKey: String,
      highlightCurrentRow: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    data() {
      return {
        datas: [],
        rowIndex: -1,
        heights: ''
      };
    },
    watch: {
      data: {
        handler(val) {
          this.datas = val;
        },
        deep: true
      },
      height: {
        handler(val) {
          this.heights = val;
        },
        deep: true
      }
    },
    created() {
      this.datas = this.data;
      this.heights = this.height;
    },
    methods: {
      handlerRowClick(row, e, column, index) {
        this.rowIndex = index;
      },
      handlerSave() {
        this.$emit('save-config', this.datas);
      },
      handlerBtnClick(type) {
        switch (type) {
          case 'up':
            if (this.rowIndex) {
              this.datas.splice(this.rowIndex - 1, 1, ...this.datas.splice(this.rowIndex, 1, this.datas[this.rowIndex - 1]));
              this.rowIndex--;
            }
            break;

          case 'down':
            if (this.rowIndex < this.datas.length - 1) {
              this.datas.splice(this.rowIndex, 1, ...this.datas.splice(this.rowIndex + 1, 1, this.datas[this.rowIndex]));
              this.rowIndex++;
            }
            break;

          case 'top':
            if (this.rowIndex > 0) {
              let del = this.datas.splice(this.rowIndex, 1);
              this.datas.unshift(del[0]);
              this.rowIndex = 0;
            }
            break;

          case 'bottom':
            if (this.rowIndex < this.datas.length - 1) {
              let del = this.datas.splice(this.rowIndex, 1);
              this.datas.push(del[0]);
              this.rowIndex = this.data.length - 1;
            }
            break;
        }
        this.$emit('change', this.datas);
      }
    }
  };
</script>