<template>
  <div
    class="el-select zzh-select"
    v-clickoutside="handleClose">
    <el-tooltip :disabled="!showPopover" v-show="selectedVal.length" placement="bottom" effect="light">
      <div slot="content" class='tooltip_label' v-html="getTooltipLabel"></div>
      <div
        class="el-select__tags"
        @click.stop="toggleMenu"
        ref="tags"
        :style="{ 'max-width': inputWidth - 32 + 'px' }">
        <transition-group v-if="false" @after-leave="resetInputHeight">
          <el-tag
            v-for="item in selected"
            :key="getValueKey(item)"
            closable
            :hit="item.hitState"
            type="primary"
            @close="deleteTag($event, item)"
            close-transition>
            <span class="el-select__tags-text">{{ item.currentLabel }}</span>
          </el-tag>
        </transition-group>
        <span class="el-select__tags-text" :class="{ 'is-disabled': disabled  }">{{ selectedLabel }}</span>
      </div>
    </el-tooltip>
    <el-input
      class="lable"
      style="overflow: hidden"
      ref="reference"
      type="text"
      :placeholder="currentPlaceholder"
      :name="name"
      :size="size"
      :disabled="disabled"
      :readonly="!filterable || multiple"
      :validate-event="false"
      @focus="handleFocus"
      @click="handleIconClick"
      @mousedown.native="handleMouseDown"
      @keyup.native="debouncedOnInputChange"
      @keydown.native.down.prevent="navigateOptions('next')"
      @keydown.native.up.prevent="navigateOptions('prev')"
      @keydown.native.enter.prevent="selectOption"
      @keydown.native.esc.prevent="visible = false"
      @keydown.native.tab="visible = false"
      @paste.native="debouncedOnInputChange"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
      :icon="iconClass"
    >
    </el-input>
    <transition
      name="el-zoom-in-top"
      @after-leave="doDestroy"
      @after-enter="handleMenuEnter">
      <el-select-menu
        ref="popper"
        v-show="visible && emptyText !== false">
        <el-input v-model="search" @keydown.native.esc.prevent="visible = false" ref="serchInput" v-if="filterable" :icon="search ? 'circle-close' : ''"
                  :on-icon-click="searchHandleIconClick" @handleevent="getFilterNode"></el-input>
        <el-scrollbar
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          :class="{ 'is-empty': !allowCreate && filteredOptionsCount === 0 }"
          ref="scrollWarp"
        >
          <div class="el-tree sc-el-tree zzh-sc-select" :class="{ 'el-tree--highlight-current': highlightCurrent }">
            <!--<div :id='selectId'  class="zzh-sc-select" v-html="selectHtml"></div>-->
            <select-node @check-change='selectChanges' ref='selectnode' :default-checked="defaultCheckeds"
                         :default-check-all="defaultCheckAll"
                         :selection-model="selectionModel"
                         :show-checkbox="showCheckbox" :multiple-limit="multipleLimit" :default-props="defaultProps" :data="data"></select-node>
            <div class="el-tree__empty-block" v-if="data.length === 0">
              <span class="el-tree__empty-text">暂无数据</span>
            </div>
          </div>
          <slot></slot>
        </el-scrollbar>
      </el-select-menu>
    </transition>
  </div>
</template>

<script type="text/babel">
  import Emitter from 'element-ui/src/mixins/emitter';
  import Locale from 'element-ui/src/mixins/locale';
  import ElSelectMenu from './select-dropdown.vue';
  import ElTag from 'element-ui/packages/tag';
  import debounce from 'throttle-debounce/debounce';
  import Clickoutside from 'element-ui/src/utils/clickoutside';
  import {addClass, removeClass, hasClass} from 'element-ui/src/utils/dom';
  import {addResizeListener, removeResizeListener} from 'element-ui/src/utils/resize-event';
  import {t} from 'element-ui/src/locale';
  import SelectNode from './select-node';

  const sizeMap = {
    'large': 42,
    'small': 30,
    'mini': 22
  };

  export default {
    mixins: [Emitter, Locale],
    name: 'ScSelect',
    computed: {
      debounce() {
        return this.remote ? 300 : 0;
      },
      iconClass() {
        let criteria = this.clearable &&
          !this.disabled &&
          this.inputHovering &&
          this.selectedLabel !== undefined &&
          this.selectedLabel !== '';
        return criteria ? 'circle-close is-show-close' : (this.remote && this.filterable ? '' : 'caret-top');
      },
      getTooltipLabel() {
        let vHtml = '';
        // for (var i = 0; i < this.selectedVal.length; i++) {
        //   if (!this.selectedVal[i]) {
        //     this.selectedVal.splice(i, 1);
        //     i--;
        //   }
        // }
        this.selectedVal.forEach((child) => {
          vHtml += '<div style="padding: 4px;">' + child + '</div>';
        });
        return vHtml;
      },

      emptyText() {  // 控制下拉框是否一开始就出现
        if (this.loading) { // false
          return this.loadingText || this.t('el.select.loading');
        } else {
          // remote:false    query:""   options.length ==0
          if (this.remote && this.query === '' && this.options.length === 0) return false;
          // filterable:true    filteredOptionsCount:0
          if (this.filterable && this.options.length > 0 && this.filteredOptionsCount === 0) {
            return this.noMatchText || this.t('el.select.noMatch');
          }
          if (this.options.length === 0) { // 走这里   noDataText:undefined
            return this.noDataText || this.t('el.select.noData');
          }
        }
        return null;
      },

      showNewOption() {
        let hasExistingOption = this.options.filter(option => !option.created)
          .some(option => option.currentLabel === this.query);
        return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption;  // 布尔语句  控制下拉框是否出现
      }
    },
    components: {
      ElSelectMenu,
      ElTag,
      SelectNode
    },

    directives: {Clickoutside},

    props: {
      name: String,
      size: String,
      defaultCheckAll: {
        type: Boolean,
        default: false
      },
      disabled: Boolean,
      clearable: Boolean,
      filterable: Boolean,
      allowCreate: Boolean,
      loading: Boolean,
      popperClass: String,
      remote: Boolean,
      loadingText: String,
      noMatchText: String,
      noDataText: String,
      remoteMethod: Function,
      filterMethod: Function,
      multiple: {
        type: Boolean,
        default: false
      },
      multipleLimit: {
        type: Number,
        default: 0
      },
      placeholder: {
        type: String,
        default() {
          return t('el.select.placeholder');
        }
      },
      defaultFirstOption: Boolean,
      valueKey: {
        type: String,
        default: 'value'
      },
      nodeKey: {
        type: String,
        default: '$id'
      },
      checkStrictly: Boolean,
      defaultExpandAll: Boolean,
      expandOnClickNode: {
        type: Boolean,
        default: true
      },
      autoExpandParent: {
        type: Boolean,
        default: true
      },
      defaultCheckedKeys: Array,
      defaultExpandedKeys: Array,
      renderContent: Function,
      showCheckbox: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: []
      },
      defaultChange: {
        type: Boolean,
        default: false
      },
      defaultAllCheck: {
        type: Boolean,
        default: false
      },
      lazy: {
        type: Boolean,
        default: false
      },
      highlightCurrent: Boolean,
      currentNodeKey: [String, Number],
      load: Function,
      filterNodeMethod: Function,
      accordion: Boolean,
      indent: {
        type: Number,
        default: 16
      },
      showPopover: Boolean,
      defaultProps: Object,
      defaultCheckedGroup: {
        type: Array,
        default: function() {
          return [];
        }
      },
      defaultChecked: {
        type: Array,
        default: function() {
          return [];
        }
      },
      value: [String, Array]
    },

    data() {
      return {
        selectHtml: '',
        selectId: 'sc-select' + new Date().getTime(),
        message: 'test',
        innerData: this.data,
        options: [],
        cachedOptions: [],
        createdLabel: null,
        createdSelected: false,
        selected: this.multiple ? [] : {},
        isSelect: true,
        inputLength: 20,
        inputWidth: 0,
        cachedPlaceHolder: '',
        optionsCount: 0,
        filteredOptionsCount: 0,
        visible: false,
        selectedLabel: '',
        search: '',
        selectlabel: '',
        hoverIndex: -1,
        query: '',
        optionsAllDisabled: false,
        inputHovering: false,
        currentPlaceholder: '',
        selectedVal: [],
        store: null,
        root: null,
        currentNode: null,
        criteria: false,
        autofocus: false,
        selDropDownStyle: '',
        defaultCheckeds: this.defaultChecked,
        result: [],
        selectionModel: [] // 记录当前选中的节点
      };
    },

    watch: {
      value: {
        handler(val) {
          let model = [];
          if (typeof val === 'string') {
            if (val) {
              model = val.split(',');
            }
          }
          if (val instanceof Array) {
            model = val;
          }
          this.defaultCheckeds = model;
          this.getSelectLabel();
          this.dispatch('ElFormItem', 'el.form.change', val);
        },
        deep: true
      },
      placeholder(val) {  // 监控placeholder
        this.cachedPlaceHolder = this.currentPlaceholder = val;
      },
      defaultChecked: {
        handler(val, oldVal) {
          console.log({
            val: val,
            oldVal: oldVal
          });
          this.defaultCheckeds = val;
          this.getSelectLabel();
        },
        deep: true
      },
      selectedVal(val) { // 选中 下拉框中的值后触发
        if (this.showCheckbox) {
          this.resetInputHeight();
          if (val.length > 0 || (this.$refs.input && this.query !== '')) {
            this.currentPlaceholder = '';
          } else {
            this.currentPlaceholder = this.cachedPlaceHolder;
          }
        }
        if (this.filterable && !this.showCheckbox) {
          this.inputLength = 20;
        }
        if (this.clearable && val.length > 0) {
          this.criteria = true;
        } else {
          this.criteria = false;
        }
        if (!this.showCheckbox) {
          val = val[0];
        }
        // this.dispatch('ElFormItem', 'el.form.change', val);
      },
      selectedLabel(val) {
        if (val) {
          if (this.clearable) {
            this.criteria = true;
          }
          this.currentPlaceholder = '';
        } else {
          this.criteria = false;
        }
      },
      visible(val) {
        this.search = '';
        if (!val) {
          this.autofocus = false;
          this.$refs.reference.$el.querySelector('input').blur();
          this.handleIconHide();
          this.broadcast('ElSelectDropdown', 'destroyPopper');
          if (this.$refs.input) {
            this.$refs.input.blur();
          }
          this.query = '';
          // this.selectedLabel = '';
          this.inputLength = 20;
          this.resetHoverIndex();
          this.$nextTick(() => {
            if (this.$refs.input &&
              this.$refs.input.value === '' &&
              this.selected.length === 0) {
              this.currentPlaceholder = this.cachedPlaceHolder;
            }
          });
          if (!this.showCheckbox) {
            this.getOverflows();
          }
        } else {
          setTimeout(() => {
            try {
              this.$refs.serchInput.$el.getElementsByTagName('input')[0].focus();
            } catch (e) {}
          });
          this.$nextTick(function() {
            const dropDown = document.querySelectorAll('.el-select-dropdown');
            if (dropDown) {
              for (var i = 0; i < dropDown.length; i++) {
                if (this.getStyle(dropDown[i], 'display') !== 'none') {
                  this.selDropDownStyle = dropDown[i].offsetTop;
                  dropDown[i].style.zIndex = +this.getStyle(dropDown[i], 'zIndex') + 80;
                  break;
                }
              }
            }
          });
          this.autofocus = true;
          this.handleIconShow();
          this.broadcast('ElSelectDropdown', 'updatePopper');
          if (this.filterable) {
          }
        }
        this.$emit('visible-change', val);
      },
      search(val, oldVal) {
        // this.$refs.sctree.filter(val);
        this.$refs.selectnode.selectFilter(val);
        setTimeout(() => {
          this.$refs.serchInput.$el.getElementsByTagName('input')[0].focus();
        });
        this.$nextTick(() => {
          this.broadcast('ElSelectDropdown', 'updatePopper');
        });
        if (val === '') {
          this.$nextTick(function() {
            const dropDown = document.querySelectorAll('.el-select-dropdown');
            for (var i = 0; i < dropDown.length; i++) {
              if (this.getStyle(dropDown[i], 'display') !== 'none') {
                dropDown[i].style.top = this.selDropDownStyle + 'px';
                break;
              }
            }
          });
        }
      }
    },

    methods: {
      restSelect() {
        const disabledCheck = [];
        this.data.map((child) => {
          if (this.defaultCheckeds.indexOf(child[this.defaultProps.nodeKey]) !== -1 && child.disabled) {
            disabledCheck.push(child[this.defaultProps.nodeKey]);
          }
        });
        // this.defaultCheckeds = disabledCheck;
        if (this.value === undefined) {
          this.$refs.selectnode.setDefaultChecked([]);
        }
      },
      getSelectLabel() {
        this.selectedVal = [];
        var checkNode = null;
        var checkeds = this.value ? this.value.split(',') : this.defaultCheckeds;
        this.data.map((child) => {
          if (checkeds.indexOf(child[this.defaultProps.nodeKey]) !== -1) {
            this.selectedVal.push(child[this.defaultProps.label]);
            checkNode = child;
          }
        });
        if (this.defaultChange) {
          this.$emit('change', checkNode, []);
        }
        this.defaultCheckeds = checkeds;
        this.selectedLabel = this.selectedVal.join(',');
      },

      selectChanges(checkNode, checkAll) {
        var val = '';
        if (this.showCheckbox) {
          this.selectedLabel = checkAll.map((item) => {
            return item[this.defaultProps.label];
          }).join(',');
          val = checkAll.map((item) => {
            return item[this.defaultProps.nodeKey];
          }).join(',');
        } else {
          this.selectedLabel = checkNode[this.defaultProps.label];
          val = checkNode[this.defaultProps.nodeKey];
          this.visible = false;
        }
        this.selectionModel = [];
        checkAll.forEach(element => {
          if (element.visibile) {
            this.selectionModel.push(element[this.defaultProps.nodeKey]);
          }
        });
        if (this.value !== undefined) {
          this.$emit('input', val);
        } else {
          this.defaultCheckeds = val.split(',');
          this.getSelectLabel();
          this.dispatch('ElFormItem', 'el.form.change', val);
        }
        this.$emit('change', checkNode, checkAll);

      },

      handlerEnter() {
        this.filterResult.map((child) => {
          child.checked = true;
        });
        this.createSelect(this.filterResult);
      },

      getStyle(el, attr) {
        return el.currentStyle ? el.currentStyle(attr) : getComputedStyle(el, false)[attr];
      },
      getFilterNode() {
        if (this.showCheckbox) {
          this.$refs.selectnode.handlerEnter(this.search);
          // select.handlerEnter();
        }
      },
      empty() {
        this.deleteSelected();
      },
      handleIconHide() {
        let icon = this.$el.querySelector('.el-input__icon');
        if (icon) {
          removeClass(icon, 'is-reverse');
        }
      },
      searchHandleIconClick() {
        this.search = '';
      },
      handleIconShow() {
        let icon = this.$el.querySelector('.el-input__icon');
        if (icon && !hasClass(icon, 'el-icon-circle-close')) {
          addClass(icon, 'is-reverse');
        }
      },
      handleMenuEnter() {
        if (!this.dropdownUl) {
          // this.dropdownUl = this.$refs.popper.$el.querySelector('.el-select-dropdown__wrap');
          this.getOverflows();
        }
        if (!this.showCheckbox && this.dropdownUl) {
          this.resetMenuScroll();
        }
      },
      getOverflows() {
        if (this.dropdownUl && this.selected && this.selected.$el) {
          let selectedRect = this.selected.$el.getBoundingClientRect();
          let popperRect = this.$refs.popper.$el.getBoundingClientRect();
          this.bottomOverflow = selectedRect.bottom - popperRect.bottom;
          this.topOverflow = selectedRect.top - popperRect.top;
        }
      },
      resetMenuScroll() {
        if (this.bottomOverflow > 0) {
          this.dropdownUl.scrollTop += this.bottomOverflow;
        } else if (this.topOverflow < 0) {
          this.dropdownUl.scrollTop += this.topOverflow;
        }
      },
      handleFocus() {
        this.visible = true;
      },
      handleIconClick(event) {
        if (this.iconClass.indexOf('circle-close') > -1) {
          this.deleteSelected(event);

          // 滚动条回到顶部
          this.$refs.scrollWarp.$el.getElementsByClassName('el-scrollbar__wrap')[0].scrollTop = 0;
        } else {
          this.toggleMenu();
        }
      },
      handleMouseDown(event) {
        if (event.target.tagName !== 'INPUT') return;
        if (this.visible) {
          this.handleClose();
          event.preventDefault();
        }
      },
      doDestroy() {
        // this.$refs.popper && this.$refs.popper.doDestroy();
      },
      handleClose() {
        this.visible = false;
      },
      resetInputHeight() {
        this.$nextTick(() => {
          if (!this.$refs.reference) return;
          let inputChildNodes = this.$refs.reference.$el.childNodes;
          let input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0];
          input.style.height = Math.max(this.$refs.tags.clientHeight + 6, sizeMap[this.size] || 36) + 'px';
          if (this.visible && this.emptyText !== false) {
            this.broadcast('ElSelectDropdown', 'updatePopper');
          }
        });
      },

      resetHoverIndex() {
        setTimeout(() => {
          if (!this.showCheckbox) {
            this.hoverIndex = this.options.indexOf(this.selected);
          } else {
            if (this.selected.length > 0) {
              this.hoverIndex = Math.min.apply(null, this.selected.map(item => this.options.indexOf(item)));
            } else {
              this.hoverIndex = -1;
            }
          }
        }, 300);
      },
      toggleMenu() {
        if (!this.disabled) {
          this.visible = !this.visible;
        }
      },
      deleteSelected(event) {   // 赋值框删除方法
        if (event) {
          event.stopPropagation();
        }
        this.$emit('input', '');
        this.$emit('change', [], []);
        this.$emit('clear');

        if (this.showCheckbox) {
          this.restSelect();
          this.selectedLabel = '';
        } else {
          // this.$refs.sctree.setCheckedKeys([]);
          this.selectedLabel = '';
        }
        this.visible = false;
      },
      resetInputWidth() {
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
      },

      handleResize() {
        this.resetInputWidth();
        if (this.showCheckbox) this.resetInputHeight();
      },
      clearValue() {

      }
    },

    created() {
      // this.$on('change', this.selectChanges);
      this.getSelectLabel();
      this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
      /* if (this.showCheckbox && !Array.isArray(this.value)) {
        this.$emit('input', []);
      }
      if (!this.showCheckbox && Array.isArray(this.value)) {
        this.$emit('input', '');
      }*/

      this.debouncedOnInputChange = debounce(this.debounce, () => {
        //  this.onInputChange();
      });
    },

    mounted() {
      if (this.showCheckbox && Array.isArray(this.value) && this.value.length > 0) {
        this.currentPlaceholder = '';
      }
      addResizeListener(this.$el, this.handleResize);
      if (this.remote && this.showCheckbox) {
        this.resetInputHeight();
      }
      window.addEventListener('keydown', (event) => {
        if (event.keyCode === 27) {
          this.visible = false;
        }
      });
      this.$nextTick(() => {
        if (this.$refs.reference && this.$refs.reference.$el) {
          this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
        }
      });
    },
    beforeDestroy() {
      if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
    }
  };
</script>

<style scoped>
  .tooltip_label {
    height: 200px;
    width: 400px; 
    overflow: auto;
  }
</style>