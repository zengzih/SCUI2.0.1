<template>
  <div class="el-table wesc-table"
       :class="{
      'el-table--fit': fit,
      'el-table--striped': stripe,
      'el-table--border': border,
      'el-table--fluid-height': maxHeight}"
       @mouseleave="handleMouseLeave($event)"><!--  'el-table--enable-row-hover': !store.states.isComplex  'el-table--enable-row-transition': (store.states.data || []).length !== 0 && (store.states.data || []).length < 100-->
    <div class="hidden-columns" ref="hiddenColumns"><slot></slot></div>
    <div class="el-table__header-wrapper" ref="headerWrapper" v-if="showHeader">
      <!-- header -->
      <table-header
        :store="store"
        :layout="layout"
        :style="{ width: layout.bodyWidth ? layout.bodyWidth + 'px' : '' }">
      </table-header>
    </div>
    <div
      class="el-table__body-wrapper"
      :style="[bodyHeight]"
      @scroll="handleScroll($event)"
      ref="bodyWrapper">
      <table-body
        :store="store"
        :column="store.states.columns"
        :table="this"
        :stripe="stripe"
        @column-mouseenter="handlerColumnMouse"
        :layout="layout"
        :style="{ width: bodyWidth}">
      </table-body>
      <div class="el-table__empty-block" v-if="!data.length" :style="{ width: bodyWidth}">
      </div>
    </div>

    <div class="el-table__fixed" ref="fixedWrapper"  
        v-mousewheel="handleFixedMousewheel"
        v-if="fixedColumns.length > 0"
        :style="[{ width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' },
        fixedHeight]">
      <div class="el-table__fixed-header-wrapper" ref="fixedHeaderWrapper" v-if="showHeader">
        <fixed-table-header
          fixed="left"
          :store="store"
          :column="store.states.fixedColumns"
          :layout="layout"
          :style="{ width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' }">
        </fixed-table-header>
      </div>
      <div class="el-table__fixed-body-wrapper" ref="fixedBodyWrapper" :style="[
          { top: layout.headerHeight + 'px' },
          fixedBodyHeight
        ]">
        <fixed-table-body
          fixed="left"
          :store="store"
          :column="store.states.fixedColumns"
          :stripe="stripe"
          :table="this"
          :layout="layout"
          @column-mouseenter="handlerColumnMouse"
          :style="{ width: layout.fixedWidth + 'px'}">
        </fixed-table-body>
      </div>
    </div>
    <div class="el-table__fixed-right" 
      v-mousewheel="handleFixedMousewheel"
      ref="rightFixedWrapper" 
      v-if="store.states.rightFixedColumns.length"
      :style="[ 
      { width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' }, 
      { right: layout.scrollY ? (border ? layout.gutterWidth : (layout.gutterWidth || 1)) + 'px' : '' }, fixedHeight ]">
      <div class="el-table__fixed-header-wrapper" ref="rightFixedHeaderWrapper" v-if="showHeader">
        <fixed-table-header
          fixed="right"
          :store="store"
          :column="store.states.rightFixedColumns"
          :layout="layout"
          :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' }">
        </fixed-table-header>
      </div>
      <div class="el-table__fixed-body-wrapper" ref="rightFixedBodyWrapper" v-if="store.states.rightFixedColumns.length" 
      :style="[ { top: layout.headerHeight + 'px' }, fixedBodyHeight ]">
        <fixed-table-body
          fixed="right"
          :store="store"
          :column="store.states.columns"
          :table="this"
          :stripe="stripe"
          :layout="layout"
          @column-mouseenter="handlerColumnMouse"
          :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : ''}">
        </fixed-table-body>
      </div>
    </div>

    <div class="config-column-btn" v-if="showConfigTable" :style="configBtnStyle" @click="openconfigtable">
      <i class="el-icon-setting"></i>
    </div>
    <div class="el-table__fixed-right-patch">
    </div>
  </div>

</template>

<script>
  import TableBody from './table-body.js';
  import TableHeader from './table-header';
  import FixedTableHeader from './fixed-table-header';
  import FixedTableBody from './fixed-table-body';
  import TableStore from './model/table.store';
  import TableLayout from './model/table.layout';
  import throttle from 'throttle-debounce/throttle';
  import debounce from 'throttle-debounce/debounce';
  import { addResizeListener } from 'element-ui/src/utils/resize-event';
  import TdRender from './td-render';

  import { mousewheel, cloneData } from './model/utils';
  import Mousewheel from './mousewheel';
  export default {
    name: 'WescTable',
    directives: {
      Mousewheel
    },
    props: {
      data: {
        type: Array,
        default: function() {
          return [];
        }
      },

      column: {
        type: Array,
        default: function() {
          return [];
        }
      },

      width: [String, Number],

      height: [String, Number],

      maxHeight: [String, Number],

      fit: {  // zzh
        type: Boolean,
        default: true
      },

      autoRowMerge: {  // zzh
        type: Array,
        default() {
          return [];
        }
      },

      autoColMerge: {  // zzh
        type: Array,
        default() {
          return [];
        }
      },
      fitColumn: Boolean,

      stripe: {  // zzh
        type: Boolean,
        default: true
      },

      border: {  // zzh
        type: Boolean,
        default: true
      },

      rowKey: [String, Function],

      context: {},

      showHeader: {
        type: Boolean,
        default: true
      },

      showSummary: Boolean,

      sumText: String,

      summaryMethod: Function,

      rowClassName: [String, Function],

      rowStyle: [Object, Function],

      highlightCurrentRow: Boolean,

      currentRowKey: [String, Number],

      emptyText: String,

      expandRowKeys: Array,

      defaultExpandAll: Boolean,

      defaultSort: Object,

      tooltipEffect: String,

      configColumns: Array,

      showConfigTable: {
        type: Boolean,
        default: false
      },
      columnConfig: Array
    },
    data() {
      const store = new TableStore(this, {
        rowKey: this.rowKey
      });
      const layout = new TableLayout({
        store,
        table: this,
        fit: this.fit
      });
      return {
        store,
        layout,
        scopeSlotRow: {},
        scopeSlotColumn: {},
        scopeSlotRender: Function
      };
    },
    watch: {
      data: {
        handler(val) {
          this.store.commit('setData', val);
          if (this.$ready) this.doLayout();
          this.store.states.selectionAll = false;
        },
        deep: true
      },
      height(val) {
        this.layout.setHeight(val);
      },
      column: {
        handler(val) {
          this.store.commit('insertColumn', cloneData(this.column));
        },
        deep: true
      },
      columnConfig: {
        handler(val) {
          this.getConfigColumn(val);
        },
        deep: true
      }
    },
    components: {
      TableBody,
      TableHeader,
      TdRender,
      FixedTableHeader,
      FixedTableBody
    },
    created() {
      this.store.commit('insertColumn', cloneData(this.column));
      this.store.commit('setData', this.data);
      this.debouncedLayout = debounce(50, () => this.doLayout());
    },
    computed: {
      bodyWrapper() {
        return this.$refs.bodyWrapper;
      },

      shouldUpdateHeight() {
        return typeof this.height === 'number' ||
          this.fixedColumns.length > 0 ||
          this.rightFixedColumns.length > 0;
      },

      fixedColumns() {
        return this.store.states.fixedColumns;
      },

      rightFixedColumns() {
        return this.store.states.rightFixedColumns;
      },

      bodyHeight() {
        let style = {};

        if (this.height) {
          style = {
            height: this.layout.bodyHeight ? this.layout.bodyHeight + 'px' : ''
          };
        } else if (this.maxHeight) {
          style = {
            'max-height': (this.showHeader
              ? this.maxHeight - this.layout.headerHeight - this.layout.footerHeight
              : this.maxHeight - this.layout.footerHeight) + 'px'
          };
        }
        return style;
      },

      bodyWidth() {
        const { bodyWidth, scrollY, gutterWidth } = this.layout;
        return bodyWidth ? bodyWidth - (scrollY ? gutterWidth : 0) + 'px' : '';
      },

      configBtnStyle() {
        return ';height: ' + this.layout.headerHeight + 'px;line-height: ' + this.layout.headerHeight + 'px;';
      },

      fixedHeight() {
        let style = {};

        if (this.maxHeight) {
          style = {
            bottom: (this.layout.scrollX && this.data.length) ? this.layout.gutterWidth + 'px' : ''
          };
        } else {
          style = {
            height: this.layout.viewportHeight ? this.layout.viewportHeight + 'px' : ''
          };
        }
        return style;
      },

      fixedBodyHeight() {
        let style = {};

        if (this.height) {
          style = {
            height: this.layout.fixedBodyHeight ? this.layout.fixedBodyHeight + 'px' : ''
          };
        } else if (this.maxHeight) {
          let maxHeight = this.layout.scrollX ? this.maxHeight - this.layout.gutterWidth : this.maxHeight;

          if (this.showHeader) {
            maxHeight -= this.layout.headerHeight;
          }

          style = {
            'max-height': maxHeight + 'px'
          };
        }

        return style;
      }
    },
    mounted() {
      if (this.fit) {
        this.windowResizeListener = throttle(50, () => {
          if (this.$ready) this.doLayout();
        });
        addResizeListener(this.$el, this.windowResizeListener);
      }
      this.$ready = true;
    },
    methods: {
      getConfigColumn(configColumn) {
        for (let i = 0; i < configColumn.length; i++) {
          for (let n = 0; n < this.column.length; n++) {
            if (configColumn[i].prop === this.column[n].prop) {
              for (let o in this.column[n]) {
                if (!configColumn[i].hasOwnProperty(o)) {
                  this.$set(configColumn[i], o, this.column[n][o]);
                  // configColumn[i][o] = this.column[n][o];
                }
              }
            }
          }
        }
        this.store.commit('insertColumn', configColumn);
      },
      handlerColumnMouse(e, row, col, render) {
        this.scopeSlotRow = row;
        this.scopeSlotColumn = col;
        this.scopeSlotRender = render;
      },
      doLayout() {
        this.$nextTick(() => {
          this.layout.update();
          this.layout.updateScrollY();
          if (this.height) {
            this.layout.setHeight(this.height);
          } else if (this.maxHeight) {
            this.layout.setMaxHeight(this.maxHeight);
          } else if (this.shouldUpdateHeight) {
            this.layout.updateHeight();
          }
        });
      },
      handleFixedMousewheel(event, data) {
        const bodyWrapper = this.bodyWrapper;
        if (Math.abs(data.spinY) > 0) {
          const currentScrollTop = bodyWrapper.scrollTop;
          if (data.pixelY < 0 && currentScrollTop !== 0) {
            event.preventDefault();
          }
          if (data.pixelY > 0 && bodyWrapper.scrollHeight - bodyWrapper.clientHeight > currentScrollTop) {
            event.preventDefault();
          }
          bodyWrapper.scrollTop += Math.ceil(data.pixelY / 5);
        } else {
          bodyWrapper.scrollLeft += Math.ceil(data.pixelX / 5);
        }
      },
      handleScroll(e) {
        const { headerWrapper } = this.$refs;
        const refs = this.$refs;
        if (headerWrapper) headerWrapper.scrollLeft = e.target.scrollLeft;
        if (refs.fixedBodyWrapper) refs.fixedBodyWrapper.scrollTop = e.target.scrollTop;
        if (refs.rightFixedBodyWrapper) refs.rightFixedBodyWrapper.scrollTop = e.target.scrollTop;

        const scrollBodyWrapper = event => {
          const deltaX = event.deltaX;

          if (deltaX > 0) {
            this.bodyWrapper.scrollLeft += 10;
          } else {
            this.bodyWrapper.scrollLeft -= 10;
          }
        };
        if (headerWrapper) {
          mousewheel(headerWrapper, throttle(16, scrollBodyWrapper));
        }
        // if (footerWrapper) {
        //   mousewheel(footerWrapper, throttle(16, scrollBodyWrapper));
        // }
      },
      handleMouseLeave(e) {

      },
      openconfigtable() {
        this.$emit('openconfigtable');
      },
      resetScroll() {
        this.bodyWrapper.scrollTop = 0;
        this.bodyWrapper.scrollLeft = 0;
      }
    }

  };
</script>
