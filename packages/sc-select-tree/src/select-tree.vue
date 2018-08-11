<template>
  <div
    class="el-select"
    v-clickoutside="handleClose">
    <el-tooltip :disabled="!showPopover" v-show="selected.length" placement="bottom" effect="light">
      <div slot="content" class='tooltip_label' v-html="getTooltipLabel"></div>
    <div
      class="el-select__tags"
      @click.stop="toggleMenu"
      ref="tags"
      :style="{ 'max-width': inputWidth - 32 + 'px' }"
      :class="{'is-disabled': disabled}"
      >
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
        <span class="el-select__tags-text">{{ getTagVal }}</span>  
    </div>
    </el-tooltip>
    <el-input
      ref="reference"
      v-model="selectedLabel"
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
      @keydown.native.tab="visible = false"
      @paste.native="debouncedOnInputChange"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
      :icon="iconClass">
    </el-input>
    <transition
      name="el-zoom-in-top"
      @before-enter="handleMenuEnter"
      @after-leave="doDestroy">
      <el-select-menu
        ref="popper"
        v-show="visible">
        <el-input v-model="search" ref="serchInput" @keydown.native.esc.stop.prevent="visible = false" v-if="filterable" @handleevent="getFilterNode"></el-input>
        <el-scrollbar
          tag="ul"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          :class="{ 'is-empty': !allowCreate && filteredOptionsCount === 0 }"
          v-show="data.length > 0">
          <tree-node
            :show-checkbox="showCheckbox"
            @check-change="checkChange"
            ref="treeNode"
            :store="getStore"
            :data="treeNode"
            :default-props='defaultProps'
            :default-check-all="defaultCheckAll"
            @node-expand="nodeExpand"
            @node-collapse="nodeCollapse"
          ></tree-node>
        </el-scrollbar>
        <p class="el-select-dropdown__empty" v-if="data.length === 0">{{ emptyText }}</p>
      </el-select-menu>
    </transition>

  </div>
</template>

<script type="text/babel">
  import TreeNode from './model/tree-node.js';
  import Emitter from 'element-ui/src/mixins/emitter';
  import Locale from 'element-ui/src/mixins/locale';
  import ElInput from 'element-ui/packages/input';
  import ElSelectMenu from './select-dropdown.vue';
  import ElTag from 'element-ui/packages/tag';
  import ElScrollbar from 'element-ui/packages/scrollbar';
  import debounce from 'throttle-debounce/debounce';
  import Clickoutside from 'element-ui/src/utils/clickoutside';
  import {addClass, removeClass, hasClass} from 'element-ui/src/utils/dom';
  import {addResizeListener, removeResizeListener} from 'element-ui/src/utils/resize-event';
  import scrollIntoView from 'element-ui/src/utils/scroll-into-view';
  import {getValueByPath} from 'element-ui/src/utils/util';

  const sizeMap = {
    'large': 42,
    'small': 30,
    'mini': 22
  };

  export default {
    mixins: [Emitter, Locale],

    name: 'ScSelectTree',

    componentName: 'ScSelectTree',

    computed: {
      getStore() {
        return this.store;
      },
      getTooltipLabel() {
        let vHtml = '';
        for (var i = 0; i < this.selected.length; i++) {
          if (!this.selected[i]) {
            this.selected.splice(i, 1);
            i--;
          }
        }
        this.selected.forEach((child) => {
          vHtml += '<div style="padding: 4px;">' + child + '</div>';
        });
        return vHtml;
      },
      getTagVal() {
        for (var i = 0; i < this.selected.length; i++) {
          if (!this.selected[i]) {
            this.selected.splice(i, 1);
            i--;
          }
        }
        var str = this.selected.join(',');
        try {
          if (str && str.indexOf(',') === 0) {
            var vStr = str.split(',');
            vStr.shift();
            return vStr.join(',');
          } else {
            return str;
          }
        } catch (e) {
        }
      },

      iconClass() {
        let criteria = this.clearable &&
          !this.disabled &&
          this.inputHovering &&
          !this.multiple &&
          this.selected.length > 0 &&
          this.selected !== '';
        return criteria ? 'circle-close is-show-close' : (this.remote && this.filterable ? '' : 'caret-top');
      },

      debounce() {
        return this.remote ? 300 : 0;
      },

      emptyText() {
        if (this.loading) {
          return this.loadingText || this.t('el.select.loading');
        } else {
          if (this.remote && this.query === '' && this.options.length === 0) return false;
          if (this.filterable && this.options.length > 0 && this.filteredOptionsCount === 0) {
            return this.noMatchText || this.t('el.select.noMatch');
          }
          if (this.options.length === 0) {
            return this.noDataText || this.t('el.select.noData');
          }
        }
        return null;
      },

      showNewOption() {
        let hasExistingOption = this.options.filter(option => !option.created)
          .some(option => option.currentLabel === this.query);
        return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption;
      }
    },

    components: {
      ElInput,
      ElSelectMenu,
      ElTag,
      ElScrollbar,
      TreeNode
    },

    directives: {Clickoutside},

    props: {
      data: {
        type: Array,
        default: []
      },
      defaultProps: {
        type: Object,
        default() {
          return {};
        }
      },
      value: [Array, String, Number],
      inputShow: Boolean,
      name: String,
      showCheckbox: Boolean,
      size: String,
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
      multiple: Boolean,
      multipleLimit: {
        type: Number,
        default: 0
      },
      placeholder: {
        type: String,
        default() {
          return '请选择';
        }
      },
      defaultFirstOption: Boolean,
      valueKey: {
        type: String,
        default: 'value'
      },
      defaultExpandedKeys: {
        type: Array,
        default() {
          return [];
        }
      },
      defaultCheckAll: Boolean,
      defaultExpandAll: Boolean,
      popoverWidth: {
        type: String,
        default: '400'
      },
      showPopover: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        search: '',
        treeNode: [],
        props: [],
        checkNodeList: [],
        filterNode: [],

        options: [],
        cachedOptions: [],
        createdLabel: null,
        createdSelected: false,
        // selected: this.multiple ? [] : {},
        selected: [],
        isSelect: true,
        inputLength: 20,
        inputWidth: 0,
        cachedPlaceHolder: '',
        optionsCount: 0,
        filteredOptionsCount: 0,
        visible: this.inputShow,
        selectedLabel: '',
        hoverIndex: -1,
        query: '',
        optionsAllDisabled: false,
        inputHovering: false,
        currentPlaceholder: '',
        checkAll: [],
        checkModel: [],
        store: {}
      };
    },

    watch: {
      data: {
        handler(val) {
          this.treeNode = val;
        },
        deep: true
      },
      placeholder(val) {
        this.cachedPlaceHolder = this.currentPlaceholder = val;
      },
      cachedOptions: {
        handler(val) {
          this.setSelected(val);
        },
        deep: true
      },
      search(val) {
        this.filerTreeNode(val);
      },
      visible(val) {
        this.search = '';
        if (!val) {
          this.$refs.reference.$el.querySelector('input').blur();
          this.handleIconHide();
          if (!this.defaultExpandedKeys.length && !this.defaultExpandAll) {
            this.$refs.treeNode.setExpand();
          }
          if (this.defaultExpandedKeys.length) {
            this.$refs.treeNode.setExpand();
            this.setNodeExpand(this.defaultExpandedKeys);
          }
          this.broadcast('ElSelectDropdown', 'destroyPopper');
          if (this.$refs.input) {
            this.$refs.input.blur();
          }
          this.search = '';
          this.inputLength = 20;
          this.resetHoverIndex();
          this.$nextTick(() => {
            if (this.$refs.input &&
              this.$refs.input.value === '' &&
              this.selected.length === 0) {
              this.currentPlaceholder = this.cachedPlaceHolder;
            }
          });
          if (!this.multiple) {
            if (this.selected) {
              if (this.filterable && this.allowCreate &&
                this.createdSelected && this.createdOption) {
                this.selectedLabel = this.createdLabel;
              } else {
                this.selectedLabel = this.selected.currentLabel;
              }
              if (this.filterable) this.query = this.selectedLabel;
            }
          }
        } else {
          setTimeout(() => {
            this.$refs.serchInput.$el.getElementsByTagName('input')[0].focus();
          });
          this.autofocus = true;
          this.handleIconShow();
          this.broadcast('ElSelectDropdown', 'updatePopper');
          if (this.filterable) {
            if (this.multiple) {
              this.$refs.input.focus();
            } else {
              if (!this.remote) {
                this.broadcast('ElOption', 'queryChange', '');
                this.broadcast('ElOptionGroup', 'queryChange');
              }
              this.broadcast('ElInput', 'inputSelect');
            }
          }
        }
        this.$emit('visible-change', val);
      },
      value: {
        handler(val) {
          if (val) {
            if (this.defaultCheckAll) {
              return;
            }
            let keys = val;
            const checkAll = this.$refs.treeNode.getCheckedNodes();
            const oldVal = checkAll.map((item) => {
              return item[this.defaultProps.nodeKey];
            });
            if (val instanceof Array) {
              if (this.arrayEquals(val, oldVal.sort())) {
                return;
              }
            }
            if (typeof val === 'string') {
              if (this.arrayEquals(val.split(',').sort(), (oldVal.join(',')).split(',').sort())) {
                return;
              }
            }
            if (typeof val === 'number') {
              if (val === oldVal[0]) {
                return;
              }
            }
            if (!(val instanceof Array)) {
              if (typeof val === 'number') {
                keys = [];
                keys.push(val);
              }
              if (typeof val === 'string') {
                keys = keys.toString().split(',');
              }
            }
            this.store.checkModel = keys;
            if (this.data.length) {
              this.setCheckedKeys(keys);
            }
          } else {
            this.store.checkModel = val;
            if (this.data.length) {
              this.setCheckedKeys([]);
            }
          }
        },
        deep: true
      },
      defaultExpandedKeys(val) {
        this.setNodeExpand(val);
      }
    },
    methods: {
      setNodeExpand(val) {
        this.$refs.treeNode.setNodeExpand(val);
      },
      nodeExpand(expandNode) {
        this.$emit('node-expand', expandNode);
      },
      nodeCollapse(collapseNode) {
        this.$emit('node-collapse', collapseNode);
      },
      checkChange(node, parentNode, checkAll, nodeCheck) {
        const nodeList = [];
        // 处理数据 让新勾选的项在最前面显示
        if (this.showCheckbox) {
          try {
            if (node instanceof Object && node && node.childNodes && !node.childNodes.length && node.visible) {
              nodeList.push(node.data);
            } else {
              const filerNode = (node) => {
                var childNodes;
                try {
                  childNodes = node.childNodes ? node.childNodes : (node instanceof Array ? node : []);
                } catch (e) {
                  // console.log('tree-checkChange捕获异常:' + e);
                }
                for (var i in childNodes) {
                  if (childNodes[i].childNodes && childNodes[i].childNodes.length && !childNodes[i].disabled) {
                    filerNode(childNodes[i]);
                  } else {
                    if (childNodes[i].visible && !childNodes[i].disabled && childNodes[i].checked) {
                      nodeList.unshift(childNodes[i].data);
                    }
                  }
                }
              };
              filerNode(node);
            }
          } catch (e) {
            // console.log('tree-checkChange捕获异常:' + e);
          }
          var cachedOptions = checkAll;
          for (var i = 0; i < cachedOptions.length; i++) {
            if (nodeList.indexOf(cachedOptions[i]) !== -1) {
              cachedOptions.splice(i, 1);
              i--;
            }
          }
          for (var n in nodeList) {
            cachedOptions.unshift(nodeList[n]);
          }
          this.cachedOptions = cachedOptions;
        } else {
          this.cachedOptions = [];
          if (node.data) {
            this.cachedOptions.push(node.data);
          }
        }
        this.setSelected(this.cachedOptions);
        let model = [];
        if (!this.showCheckbox && node.data) {
          checkAll.push(node.data);
        }
        checkAll.map((item) => {
          if (item[this.defaultProps.nodeKey]) {
            model.push(item[this.defaultProps.nodeKey]);
          }
        });
        model = model.length === 1 ? model[0] : model.join(',');
        this.checkAll = checkAll;
        this.$emit('check-change', node.data ? node.data : [], parentNode.data ? parentNode.data : [], checkAll, nodeCheck);
        this.$emit('input', model);
        this.dispatch('ElFormItem', 'el.form.change', model);
        this.$emit('change', checkAll);
      },

      getCheckedKeys() {
        if (this.showCheckbox) {
          return this.$refs.treeNode.getCheckedNodes();
        }
      },

      setCheckedKeys(keys) {
        this.store.checkModel = keys;
        if (!this.$refs.treeNode) {
          this.$nextTick(() =>{
            this.$refs.treeNode.setCheckedKeys(keys);
          });
        } else {
          this.$refs.treeNode.setCheckedKeys(keys);
        }
      },

      getFilterNode() { // 搜索框回车事件
        if (this.showCheckbox) {
          this.$refs.treeNode.handlerEnter();
        }
      },

      filerTreeNode(val) {
        this.$refs.treeNode.filerTreeNode(val);
      },

      handleIconHide() {
        let icon = this.$el.querySelector('.el-input__icon');
        if (icon) {
          removeClass(icon, 'is-reverse');
        }
      },

      handleIconShow() {
        let icon = this.$el.querySelector('.el-input__icon');
        if (icon && !hasClass(icon, 'el-icon-circle-close')) {
          addClass(icon, 'is-reverse');
        }
      },

      scrollToOption(className = 'selected') {
        const menu = this.$refs.popper.$el.querySelector('.el-select-dropdown__wrap');
        scrollIntoView(menu, menu.getElementsByClassName(className)[0]);
      },

      handleMenuEnter() {
        this.$nextTick(() => this.scrollToOption());
      },

      getOption(value) {
        let option;
        const type = typeof value;
        const isObject = type !== 'string' && type !== 'number' && type !== 'boolean';
        for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
          const cachedOption = this.cachedOptions[i];
          const isEqual = isObject
            ? getValueByPath(cachedOption.value, this.valueKey) === getValueByPath(value, this.valueKey)
            : cachedOption.value === value;
          if (isEqual) {
            option = cachedOption;
            break;
          }
        }
        if (option) return option;
        const label = !isObject
          ? value : '';
        let newOption = {
          value: value,
          currentLabel: label
        };
        if (this.multiple) {
          newOption.hitState = false;
        }
        return newOption;
      },

      setSelected(checkNode) {
        let result = [];
        if (Array.isArray(checkNode)) {
          if (checkNode.length) {
            this.currentPlaceholder = '';
          } else {
            this.currentPlaceholder = this.placeholder;
          }
          checkNode.forEach(child => {
            result.push(child[this.defaultProps.label]);
          });
          this.selected = result;
          this.$nextTick(() => {
            this.resetInputHeight();
          });
        }
        if (!this.showCheckbox && !this.inputShow) {
          this.visible = false;
        }
      },

      handleFocus() {
        this.visible = true;
      },

      handleIconClick(event) {
        if (this.iconClass.indexOf('circle-close') > -1) {
          this.deleteSelected(event);
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
        this.$refs.popper && this.$refs.popper.doDestroy();
        this.dropdownUl = null;
      },

      handleClose() {
        this.visible = false;
      },

      toggleLastOptionHitState(hit) {
        if (!Array.isArray(this.selected)) return;
        const option = this.selected[this.selected.length - 1];
        if (!option) return;

        if (hit === true || hit === false) {
          option.hitState = hit;
          return hit;
        }

        option.hitState = !option.hitState;
        return option.hitState;
      },

      deletePrevTag(e) {
        if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
          const value = this.value.slice();
          value.pop();
          this.$emit('input', value);
        }
      },

      resetInputState(e) {
        if (e.keyCode !== 8) this.toggleLastOptionHitState(false);
        this.inputLength = this.$refs.input.value.length * 15 + 20;
        this.resetInputHeight();
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
          if (!this.multiple) {
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

      handleOptionSelect(option) {
        if (this.multiple) {
          const value = this.value.slice();
          const optionIndex = this.getValueIndex(value, option.value);
          if (optionIndex > -1) {
            value.splice(optionIndex, 1);
          } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
            value.push(option.value);
          }
          this.$emit('input', value);
          if (option.created) {
            this.query = '';
            this.inputLength = 20;
          }
          if (this.filterable) this.$refs.input.focus();
        } else {
          this.$emit('input', option.value);
          this.visible = false;
        }
        this.$nextTick(() => this.scrollToOption());
      },

      getValueIndex(arr = [], value) {
        const type = typeof value;
        const isObject = type !== 'string' && type !== 'number' && type !== 'boolean';
        if (!isObject) {
          return arr.indexOf(value);
        } else {
          const valueKey = this.valueKey;
          let index = -1;
          arr.some((item, i) => {
            if (getValueByPath(item, valueKey) === getValueByPath(value, valueKey)) {
              index = i;
              return true;
            }
            return false;
          });
          return index;
        }
      },

      toggleMenu() {
        if (this.filterable && this.query === '' && this.visible) {
          return;
        }
        if (!this.disabled) {
          this.visible = !this.visible;
        }
      },

      navigateOptions(direction) {
        if (!this.visible) {
          this.visible = true;
          return;
        }
        if (this.options.length === 0 || this.filteredOptionsCount === 0) return;
        this.optionsAllDisabled = this.options.length === this.options.filter(item => item.disabled === true).length;
        if (!this.optionsAllDisabled) {
          if (direction === 'next') {
            this.hoverIndex++;
            if (this.hoverIndex === this.options.length) {
              this.hoverIndex = 0;
            }
            if (this.options[this.hoverIndex].disabled === true ||
              this.options[this.hoverIndex].groupDisabled === true ||
              !this.options[this.hoverIndex].visible) {
              this.navigateOptions('next');
            }
          }
          if (direction === 'prev') {
            this.hoverIndex--;
            if (this.hoverIndex < 0) {
              this.hoverIndex = this.options.length - 1;
            }
            if (this.options[this.hoverIndex].disabled === true ||
              this.options[this.hoverIndex].groupDisabled === true ||
              !this.options[this.hoverIndex].visible) {
              this.navigateOptions('prev');
            }
          }
        }
        this.$nextTick(() => this.scrollToOption('hover'));
      },

      selectOption() {
        if (this.options[this.hoverIndex]) {
          this.handleOptionSelect(this.options[this.hoverIndex]);
        }
      },

      deleteSelected(event) {
        this.cachedOptions.splice(0, this.cachedOptions.length);
        this.$refs.treeNode.setCheckedKeys([]);
        this.$emit('check-change', [], [], [], {});
        event.stopPropagation();
        this.$emit('input', '');
        this.visible = false;
        this.$emit('clear');
      },

      deleteTag(event, tag) {
        let index = this.selected.indexOf(tag);
        if (index > -1 && !this.disabled) {
          this.cachedOptions.splice(index, 1);
          let nodeKeyList = [];
          this.cachedOptions.map((item) => {
            if (item[this.defaultProps.nodeKey]) {
              nodeKeyList.push(item[this.defaultProps.nodeKey]);
            }
          });
          /* const nodeKeyList = this.cachedOptions.map((item) => {
            if (!item instanceof Function) {
              return item[this.defaultProps.nodeKey];
            }
          });*/
          this.$refs.treeNode.setCheckedKeys(nodeKeyList);
          // this.setSelected(this.cachedOptions);
          this.$emit('input', this.cachedOptions);
          this.$emit('remove-tag', tag);
        }
        event.stopPropagation();
      },

      onInputChange() {
        if (this.filterable) {
          this.query = this.selectedLabel;
        }
      },

      onOptionDestroy(option) {
        this.optionsCount--;
        this.filteredOptionsCount--;
        let index = this.options.indexOf(option);
        if (index > -1) {
          this.options.splice(index, 1);
        }
        this.broadcast('ElOption', 'resetIndex');
      },

      resetInputWidth() {
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
      },

      handleResize() {
        this.resetInputWidth();
        if (this.multiple) this.resetInputHeight();
      },

      getValueKey(item) {
        const type = typeof item.value;
        if (type === 'number' || type === 'string') {
          return item.value;
        } else {
          return getValueByPath(item.value, this.valueKey);
        }
      },
      arrayEquals(array, array1) {
        if (!array) {
          return false;
        }
        if (array1.length !== array.length) {
          return false;
        }
        for (var i = 0, l = array1.length; i < l; i++) {
          if (array1[i] instanceof Array && array[i] instanceof Array) {
            if (!array1[i].equals(array[i])) {
              return false;
            }
          } else if (array1[i] !== array[i]) {
            return false;
          }
        }
        return true;
      }
    },

    created() {
      this.treeNode = this.data;
      this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
      if (this.value) {
        this.setCheckedKeys(this.value.split(','));
      }
     /* if (this.multiple && !Array.isArray(this.value)) {
        this.$emit('input', []);
      }
      if (!this.multiple && Array.isArray(this.value)) {
        this.$emit('input', '');
      }*/
      this.setSelected();

      this.debouncedOnInputChange = debounce(this.debounce, () => {
        this.onInputChange();
      });
      this.store = {
        defaultProps: this.defaultProps,
        defaultExpandedKeys: this.defaultExpandedKeys,
        defaultExpandAll: this.defaultExpandAll,
        defaultCheckAll: this.defaultCheckAll,
        checkModel: []
      };
    },

    mounted() {
      if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
        this.currentPlaceholder = '';
      }
      addResizeListener(this.$el, this.handleResize);
      if (this.remote && this.multiple) {
        this.resetInputHeight();
      }
      this.$nextTick(() => {
        if (this.$refs.reference && this.$refs.reference.$el) {
          this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
        }
      });
      window.addEventListener('keydown', (event) => {
        if (event.keyCode === 27) {
          this.visible = false;
        }
      });
    },

    beforeDestroy() {
      if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
    }
  };
</script>

<style>
  .el-select__tags {
    overflow: hidden;
  }

  .el-select__tags > span {
    display: inline-block;
    width: 1000000px;
    font-size: 12px;
    padding: 0 6px;
  }

  .sc-select-tree {
    margin: 0;
    padding: 5px;
  }

  .sc-select-tree ul {
    padding: 0;
  }

  .sc-select-tree, .sc-select-tree li {
    list-style: none;
    margin: 0;
  }

  .sc-select-tree li > div {
    height: 28px;
    line-height: 28px;
    cursor: pointer;
  }

  .sc-select-tree li > div:hover {
    background: #eaf2ff;
  }

  .sc-select-tree li > div .tree-icon {
    float: left;
    width: 24px;
    height: 28px;
    position: relative;
    padding-right: 8px;
  }

  .sc-select-tree li > div .tree-icon span {
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: middle;
    margin-left: 10px;
    font-size: 12px;
    border: 6px solid transparent;
    border-right-width: 0;
    border-left-color: #97a8be;
    border-left-width: 7px;
    transform: rotate(0deg);
    transition: transform .3s ease-in-out;
  }

  .sc-select-tree li > div .sc-tree-expanded span {
    transform: rotate(90deg);
    transition: transform .3s ease-in-out;
  }

  .sc-select-tree li > div .sc-tree-collapsed span {
    transform: rotate(0deg);
    transition: transform .3s ease-in-out;
  }

  .sc-select-tree li > div label {
    cursor: pointer;
    float: left;
    min-width: calc(100% - 35px);
  }

  .sc-select-tree li > div label input {
    display: none;
  }

  .sc-select-tree li > div label .select-check {
    display: inline-block;
    position: relative;
    border: 1px solid #bfcbd9;
    margin-right: 10px;
    border-radius: 2px;
    vertical-align: middle;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background: #fff;
    z-index: 1;
    transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46);
  }

  .sc-select-tree li > div label .select-check.is-disabled {
    background-color: #eef1f6;
    border-color: #d1dbe5;
    cursor: not-allowed;
  }

  .sc-select-tree li > div label .select-checked.is-disabled, .sc-select-tree li > div label .is-disabled.select-indeterminate {
    background-color: #d1dbe5;
    border-color: #d1dbe5;
    cursor: not-allowed;
  }

  .sc-select-tree li > div label .select-check:after {
    /*content: "";
    border: 2px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 7px;
    left: 3px;
    position: absolute;
    top: 0px;
    -ms-transform: rotate(45deg) scaleY(0);
    transform: rotate(45deg) scaleY(0);
    width: 5px;
    transition: transform .15s cubic-bezier(.71,-.46,.88,.6) .05s;
    -ms-transform-origin: center;
    transform-origin: center;*/
  }

  .sc-select-tree li > div label .select-checked {
    background-color: #5B7BFA;
    border-color: #5B7BFA;
  }

  .sc-select-tree li > div label .select-checked:after {
    content: "";
    border: 2px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 7px;
    left: 3px;
    position: absolute;
    top: 0px;
    -ms-transform: rotate(45deg) scaleY(1);
    transform: rotate(45deg) scaleY(1);
    width: 5px;
    /*transition: transform .15s cubic-bezier(.71,-.46,.88,.6) .05s;*/
    -ms-transform-origin: center;
    transform-origin: center;
  }

  .sc-select-tree li > div label .select-indeterminate {
    background-color: #5B7BFA;
    border-color: #5B7BFA;
  }

  .sc-select-tree li > div label .select-indeterminate:after {
    content: "";
    background: #fff;
    border-left: 0;
    border-top: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 7px !important;
    height: 2px !important;
    /*transition: transform .15s cubic-bezier(.71,-.46,.88,.6) .05s;*/
    -ms-transform-origin: center;
    transform-origin: center;
  }

  .sc-select-tree li > div .select-label {
    vertical-align: top;
    display: inline-block;
    font-size: 12px;
    width: auto!important;
  }
  .tooltip_label {
    height: 200px;
    width: 400px; 
    overflow: auto;
  }
</style>
