<template>
  <div
    class="el-select sc-select-tree"
    v-clickoutside="handleClose">
    <el-tooltip :disabled="!showPopover" v-show="selected.length" placement="bottom" effect="light">
      <div slot="content" class='tooltip_label' v-html="getTooltipLabel"></div>
      <div
        class="el-select__tags"
        v-if="showCheckbox"
        @click.stop="toggleMenu"
        ref="tags"
        :style="{ 'max-width': inputWidth - 32 + 'px' }"     
        >
        <transition-group @after-leave="resetInputHeight">
          <el-tag
            v-for="item in selected"
            :key="item.value"
            closable
            :hit="item.hitState"
            type="primary"
            @close="deleteTag($event, item)"
            close-transition>
            <span class="el-select__tags-text">{{ item.currentLabel }}</span>
          </el-tag>
        </transition-group>
        <!-- <input 
          type="button"
          class="el-select__input"
          :class="`is-${ size }`"
          @focus="visible = true"
          :disabled="disabled"
          @keyup="managePlaceholder"
          @keydown="resetInputState"
          @keydown.esc.prevent="visible = false"
          @keydown.delete="deletePrevTag"
          v-model="selectlabel"
          :debounce="remote ? 300 : 0"
          v-if="filterable"
          :style="{ width: inputLength + 'px', 'max-width': inputWidth - 42 + 'px' }"
          ref="input"> -->
      </div>
    </el-tooltip>
    <el-input
      class="lable"
      style="overflow: hidden"
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
      @keydown.native.esc.prevent="visible = false"
      @keydown.native.tab="visible = false"
      @paste.native="debouncedOnInputChange"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
      :icon="getIconClass()"
    >
    </el-input>
    <transition
      name="el-zoom-in-top"
      @after-leave="doDestroy"
      @after-enter="handleMenuEnter">
      <el-select-menu
        ref="popper"
        v-show="visible && emptyText !== false">
        <el-input v-model="search" ref="serchInput"  v-if="filterable" :icon="search ? 'circle-close' : ''" :on-icon-click="searchHandleIconClick" @handleevent="getFilterNode"></el-input>
        <el-scrollbar
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          :class="{ 'is-empty': !allowCreate && filteredOptionsCount === 0 }"
        >
          <div class="el-tree sc-el-tree" :class="{ 'el-tree--highlight-current': highlightCurrent }">
            <sc-tree
              ref="sctree"
              :data="innerData"
              :props="props"
              :node-key="nodeKey"
              :default-all-check="defaultAllCheck"
              :show-checkbox="showCheckbox"
              @check-change="handleNodeCheck"
              @node-click="handleNodeClick"
              @current-change="handleCurrentChange"
              @node-expand="handleNodeExpand"
              @node-collapse="handleNodeCollapse"
              :filter-node-method="filterNode"
              accordion>
            </sc-tree>
            <div class="el-tree__empty-block" v-if="!root.childNodes || root.childNodes.length === 0">
              <span v-if="false" class="el-tree__empty-text">{{ emptyText }}</span>
            </div>
          </div>
          <slot></slot>
        </el-scrollbar>
      </el-select-menu>
    </transition>
  </div>
</template>

<script type="text/babel">
  import TreeStore from './model/tree-store';
  import { sortBy, isEqual, cloneDeep } from 'lodash';
  import Emitter from 'element-ui/src/mixins/emitter';
  import Locale from 'element-ui/src/mixins/locale';
  import ElSelectMenu from './select-dropdown.vue';
  import scTree from './tree.vue';
  import ElTag from 'element-ui/packages/tag';
  import debounce from 'throttle-debounce/debounce';
  import Clickoutside from 'element-ui/src/utils/clickoutside';
  import {addClass, removeClass, hasClass} from 'element-ui/src/utils/dom';
  import {addResizeListener, removeResizeListener} from 'element-ui/src/utils/resize-event';
  import {t} from 'element-ui/src/locale';
  import {getValueByPath} from 'element-ui/src/utils/util';

  const sizeMap = {
    'large': 42,
    'small': 30,
    'mini': 22
  };

  function hasChildren(obj, key) {
    return obj.hasOwnProperty(key) &&
      Array.isArray(obj[key]) &&
      obj[key].length > 0;
  }

  export default {
    mixins: [Emitter, Locale],
    name: 'ScSelectTree',
    componentName: 'ElSelect',
    computed: {
      children: {
        set(value) {
          this.data = value;
        },
        get() {
          return this.data;
        }
      },
      debounce() {
        return this.remote ? 300 : 0;
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

      showNewOption() {
        let hasExistingOption = this.options.filter(option => !option.created)
          .some(option => option.currentLabel === this.query);
        return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption;  // 布尔语句  控制下拉框是否出现
      }
    },
    components: {
      ElTreeNode: require('./tree-node.vue'),
      ElSelectMenu,
      ElTag,
      scTree
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
      showPopover: Boolean,
      popoverWidth: {
        type: String,
        default: '400'
      },
      props: {
        default() {
          return {
            children: 'children',
            label: 'label',
            icon: 'icon',
            disabled: 'disabled'
          };
        }
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
      defaultCheckedGroup: {
        type: Array,
        default: function() {
          return [];
        }
      }
    },

    data() {
      return {
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
        selDropDownStyle: ''
      };
    },

    watch: {
      placeholder(val) {  // 监控placeholder
        this.cachedPlaceHolder = this.currentPlaceholder = val;
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
        this.setSelected();
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
        this.$emit('change', val);
        // this.dispatch('ElFormItem', 'el.form.change', val);
      },
      selectedLabel(val) {
        if (val && this.clearable) {
          this.criteria = true;
        } else {
          this.criteria = false;
        }
      },
      visible(val) {
        this.search = '';
        if (!val) {
          this.autofocus = false;
          this.$refs.reference.$el.querySelector('input').blur();
          this.setTreeExpand();
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
            this.$refs.serchInput.$el.getElementsByTagName('input')[0].focus();
          });
          this.$nextTick(function() {
            const dropDown = document.querySelectorAll('.el-select-dropdown');
            if (dropDown) {
              for (var i = 0; i < dropDown.length; i++) {
                if (this.getSelectStyle(dropDown[i], 'display') !== 'none') {
                  this.selDropDownStyle = dropDown[i].offsetTop;
                  dropDown[i].style.zIndex = +this.getSelectStyle(dropDown[i], 'zIndex') + 80;
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
      defaultCheckedKeys(newVal) {
        this.store.defaultCheckedKeys = newVal;
        this.store.setDefaultCheckedKey(newVal);
      },
      defaultExpandedKeys(newVal) {
        this.store.defaultExpandedKeys = newVal;
        this.store.setDefaultExpandedKeys(newVal);
      },
      currentNodeKey(newVal) {
        this.store.setCurrentNodeKey(newVal);
        this.store.currentNodeKey = newVal;
      },
      data(newVal, oldVal) {
        if (isEqual(newVal, oldVal)) return;
        this.checkGroup();
        this.store.setData(newVal);
      },
      search(val, oldVal) {
        this.$refs.sctree.filter(val);
        setTimeout(() => {
          this.$refs.serchInput.$el.getElementsByTagName('input')[0].focus();
        });
        this.filterNodeData = this.$refs.sctree.store.filterNodeData;
        this.$nextTick(() => {
          this.broadcast('ElSelectDropdown', 'updatePopper');
        });
        if (val === '') {
          this.setTreeExpand();
          this.$nextTick(function() {
            const dropDown = document.querySelectorAll('.el-select-dropdown');
            for (var i = 0; i < dropDown.length; i++) {
              if (this.getSelectStyle(dropDown[i], 'display') !== 'none') {
                dropDown[i].style.top = this.selDropDownStyle + 'px';
                break;
              }
            }

          });
        }
      }
    },

    methods: {
      getSelectStyle(el, attr) {
        return el.currentStyle ? el.currentStyle[attr] : getComputedStyle(el, false)[attr];
      },
      getFilterNode() {
        var datas = this.filterNodeData.map(function(item) {
          return item.data;
        });
        const getCheckNode = this.$refs.sctree.getCheckedNodes(true);
        datas = datas.concat(getCheckNode);
        this.$refs.sctree.setCheckedNodes(datas);
      },
      setTreeExpand() {
        var treeData = this.$refs.sctree.store.nodesMap;
        for (var i in treeData) {
          if (treeData[i].expanded) {
            treeData[i].expanded = false;
          }
        }
      },
      getIconClass() {
        this.iconClass = this.criteria && !this.disabled ? 'circle-close is-show-close' : (this.remote && this.filterable ? '' : 'caret-top');
        return this.criteria && !this.disabled ? 'circle-close is-show-close' : (this.remote && this.filterable ? '' : 'caret-top');
      },
      getCheckedNodes(data) {
        this.$refs.sctree.getCheckedNodes(data);
      },
      setCheckedNodes(data) {
        this.$refs.sctree.setCheckedNodes(data);
      },
      getCheckedKeys(data) {
        this.$refs.sctree.getCheckedKeys(data);
      },
      setCheckedKeys(data, bool) {
        this.$refs.sctree.setCheckedKeys(data, bool);
      },
      setChecked(data, ischech, ischhild) {
        this.$refs.sctree.setChecked(data, ischech, ischhild);
      },
      empty() {
        this.deleteSelected();
      },
      // tree方法
      handleCurrentChange(data, nodeData) {
        this.$emit('current-change', data, nodeData);
      },
      handleNodeExpand(node, nodeData, nodeEvent) {
        this.$emit('node-expand', node, nodeData, nodeEvent);
      },
      handleNodeCollapse(node, nodeData, nodeEvent) {
        this.$emit('node-collapse', node, nodeData, nodeEvent);
      },
      handleNodeClick: function(obj, node, component) {
        if (this.showCheckbox) {
          let selectedData = cloneDeep(obj);
          if (selectedData[this.props.children]) {
            delete selectedData[this.props.children];
          }
          this.$emit('node-click', obj, node, component);
          return;
        } else {
          if (hasChildren(obj, this.props.children)) return;
          this.visible = false;
          this.selectedLabel = obj[this.props.label];
          this.$emit('change', obj);
        }
      },
      handleNodeCheck: function(obj, isChecked, isCheckedChildren) {
        var data = this.$refs.sctree.getCheckedNodes(true, true);
        this.selectedVal = data;
        if (!this.showCheckbox) {
          if (data.length > 0) {
            this.selectedLabel = data[0][this.props.label];
          } else {
            this.selectedLabel = '';
          }
        }
        // this.getRecursionLabel(data, this.selectedVal);
        if (!this.showCheckbox) {
          data = data[0];
        }
        this.$emit('check-change', obj, isChecked, isCheckedChildren, data);
      },
      checkGroup() {
        this.innerData = this.addKeyToData();
        /**
         * 默认勾选的组，根据传入的组名决定
         */
        this.defaultCheckedGroup.map((groupName) => {
          this.innerData.map((obj) => {
            if (groupName !== obj[this.props.label]) return;
            this.$nextTick(() => {
              // this.$refs.sctree.setChecked(obj[this.nodeKey], true, true);
            });
          });
          this.innerData = sortBy(this.innerData, o => o[this.props.label] !== groupName);
        });
      },
      addKeyToData() {
        let data = this.data;
        let stack = data.map((item) => (item));
        let id = 1;
        while (stack.length > 0) {
          let node = stack.shift();
          if (!node[this.nodeKey]) {
            node[this.nodeKey] = 'sc-node-key' + id++;
          }
          if (hasChildren(node, this.props.children)) {
            stack = [...stack, ...node[this.props.children]];
          }
        }
        return data;
      },
      updateValues: function() {
        // let nodes = this.$refs.sctree.getCheckedNodes(true);
        // this.values = nodes.map(item => item[this.props.label]);
        // this.$emit('change', nodes);
      },
      filterNode(value, data) {
        if (!value) return true;
        return data[this.props.label].indexOf(value) !== -1;
      },
      getRecursionLabel(data, value) {
        for (var i in data) {
          value.push(data[i][this.props.label]);
        }
      },
      resetInputState(e) {
        if (e.keyCode !== 8) this.toggleLastOptionHitState(false);
        this.inputLength = this.$refs.input.value.length * 15 + 20;
        this.resetInputHeight();
      },
      managePlaceholder() {
        if (this.currentPlaceholder !== '') {
          this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
        }
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
          this.setTreeExpand();
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
      setSelected() {
        if (!this.showCheckbox) {
          let option = this.getOption(this.selectedVal);
          if (option.created) {
            this.createdLabel = option.currentLabel;
            this.createdSelected = true;
          } else {
            this.createdSelected = false;
          }
          if (option.value.length > 0) {
            this.selectedLabel = option.value[0][this.props.label];
          }
          this.selected = option;
          if (this.filterable) this.query = this.selectedLabel;
          return;
        }
        let result = [];
        if (Array.isArray(this.selectedVal)) {
          /* this.selectedVal.forEach(value => {
            result.push(this.getOption(value));
          });*/
          for (var i = 0; i < this.selectedVal.length; i++) {
            result.unshift({
              value: this.selectedVal[i][this.nodeKey],
              currentLabel: this.selectedVal[i][this.props.label]
            });
          }
        }
        this.selected = result;
        this.$nextTick(() => {
          this.resetInputHeight();
        });
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
        if (this.showCheckbox) {
          newOption.hitState = false;
        }
        return newOption;
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
        this.$emit('clear');
        if (this.showCheckbox) {
          this.$refs.sctree.setCheckedKeys([]);
        } else {
          this.$refs.sctree.setCheckedKeys([]);
          this.selectedLabel = '';
        }
        this.visible = false;
      },

      deleteTag(event, tag) {
        let index = this.selected.indexOf(tag);
        if (index > -1 && !this.disabled) {
          /* const value = this.selectedVal.slice();
          value.splice(index, 1);
          this.selectedVal = value;
          this.$refs.sctree.setCheckedNodes(value);*/
          this.selectedVal.reverse().splice(index, 1);
          this.$refs.sctree.setCheckedNodes(this.selectedVal);
        }
        this.$emit(event, tag, this.selectedVal);
        event.stopPropagation();
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
      this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
      if (this.showCheckbox && !Array.isArray(this.value)) {
        this.$emit('input', []);
      }
      if (!this.showCheckbox && Array.isArray(this.value)) {
        this.$emit('input', '');
      }

      this.debouncedOnInputChange = debounce(this.debounce, () => {
        //  this.onInputChange();
      });

      this.isTree = true;
      this.store = new TreeStore({
        key: this.nodeKey,
        data: this.data,
        lazy: this.lazy,
        props: this.props,
        load: this.load,
        currentNodeKey: this.currentNodeKey,
        checkStrictly: this.checkStrictly,
        defaultCheckedKeys: this.defaultCheckedKeys,
        defaultExpandedKeys: this.defaultExpandedKeys,
        autoExpandParent: this.autoExpandParent,
        defaultExpandAll: this.defaultExpandAll,
        filterNodeMethod: this.filterNodeMethod,
        filterNodeData: [],
        defaultAllCheck: this.defaultAllCheck
      });

      this.root = this.store.root;
    },

    mounted() {
      this.checkGroup();
      if (this.showCheckbox && Array.isArray(this.value) && this.value.length > 0) {
        this.currentPlaceholder = '';
      }
      addResizeListener(this.$el, this.handleResize);
      if (this.remote && this.showCheckbox) {
        this.resetInputHeight();
      }
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

<style type="text/css" scope>
    .sc-el-tree {
      border: none!important;
    }
    .el-select .select__tags .el-select__tags-text {
      font-size: 12px;
    }
</style>

