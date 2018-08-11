<template>
  <div class="el-transfer-panel">
    <p class="el-transfer-panel__header">{{ title }}</p>
    
    <div class="el-transfer-panel__body">
      <el-input
        class="el-transfer-panel__filter"
        :placeholder="placeholder"
        v-if="filterable"
        :icon="inputIcon"
        @mouseenter.native="inputHover = true"
        @mouseleave.native="inputHover = false"
        @click="clearQuery"
        v-model="filterText">
      </el-input>
      <p
        class="el-transfer-panel__empty"
        v-show="hasNoMatch">{{ t('el.transfer.noMatch') }}</p>
      <p
        class="el-transfer-panel__empty"
        v-show="data.length === 0 && !hasNoMatch">{{ t('el.transfer.noData') }}</p>
      <el-tree
        class="filter-tree el-checkbox-group el-transfer-panel__list is-filterable"
        style="border:0"
        :data="data"
        show-checkbox
        node-key="id"
        ref="tree"
        empty-text=""
        highlight-current
        :filter-node-method="filterNode"
        @check-change="checkChange">
      </el-tree>
    </div>
    
    <p class="el-transfer-panel__footer">
      <el-checkbox
        v-model="allChecked"
        @change="handleAllCheckedChange"
        :indeterminate="isIndeterminate">{{ checkedSummary }}</el-checkbox>
      <slot></slot>
    </p>
  </div>
</template>

<script>
  import ElCheckboxGroup from 'element-ui/packages/checkbox-group';
  import ElCheckbox from 'element-ui/packages/checkbox';
  import ElInput from 'element-ui/packages/input';
  import ElTree from 'element-ui/packages/tree';
  import Locale from 'element-ui/src/mixins/locale';

  export default {
    mixins: [Locale],

    name: 'ElTransferTree',

    componentName: 'ElTransferTree',

    components: {
      ElCheckboxGroup,
      ElCheckbox,
      ElTree,
      ElInput,
      OptionContent: {
        props: {
          option: Object
        },
        render(h) {
          const getParent = vm => {
            if (vm.$options.componentName === 'ElTransferTree') {
              return vm;
            } else if (vm.$parent) {
              return getParent(vm.$parent);
            } else {
              return vm;
            }
          };
          const parent = getParent(this);
          return parent.renderContent
            ? parent.renderContent(h, this.option)
            : <span>{ this.option[parent.labelProp] || this.option[parent.keyProp] }</span>;
        }
      }
    },

    props: {
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      renderContent: Function,
      placeholder: String,
      value: Array,
      valueData: Array,
      filterable: Boolean,
      title: String,
      footerFormat: Object,
      filterMethod: Function,
      defaultChecked: Array,
      props: Object
    },

    data() {
      return {
        filterText: '',
        checked: [],
        allChecked: false,
        inputHover: false
      };
    },

    watch: {
      checked(val) {
        this.updateAllChecked();
        this.$emit('checked-change', val);
      },

      data(val, oldVal) {
        const checkedData = [];
        this.checked.forEach(item => {if (val.indexOf(item) > -1) checkedData.push(item);});
        this.checked = checkedData;
      },

      defaultChecked: {
        immediate: true,
        handler(val, oldVal) {
          if (oldVal && val.length === oldVal.length &&
            val.every(item => oldVal.indexOf(item) > -1)) return;
          const checked = [];
          val.forEach(item => {
            checked.push(item);
          });
          this.checked = checked;
          const _this = this;
          setTimeout(function() {
            const valueData = _this.valueData.filter(item => val.indexOf(item[_this.props.key]) > -1);
            _this.$refs.tree.setCheckedNodes(valueData);
          }, 0);
        }
      },
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },

    computed: {
      filteredData() {
        return this.valueData.filter(item => {
          if (typeof this.filterMethod === 'function') {
            return this.filterMethod(this.filterText, item);
          } else {
            const label = item[this.labelProp] || item[this.keyProp].toString();
            return label.toLowerCase().indexOf(this.filterText.toLowerCase()) > -1;
          }
        });
      },
      checkedSummary() {
        const checkedLength = this.checked.length || 0;
        const dataLength = this.value.length;
        const { noChecked, hasChecked } = this.footerFormat;
        if (noChecked && hasChecked) {
          return checkedLength > 0
            ? hasChecked.replace(/\${checked}/g, checkedLength).replace(/\${total}/g, dataLength)
            : noChecked.replace(/\${total}/g, dataLength);
        } else {
          return checkedLength > 0
            ? this.t('el.transfer.hasCheckedFormat', { total: dataLength, checked: checkedLength })
            : this.t('el.transfer.noCheckedFormat', { total: dataLength });
        }
      },
      inputIcon() {
        return this.filterText.length > 0 && this.inputHover
          ? 'circle-close'
          : 'search';
      },

      isIndeterminate() {
        const checkedLength = this.checked.length;
        return checkedLength > 0 && checkedLength < this.value.length;
      },

      hasNoMatch() {
        return this.filterText.length > 0 && this.filteredData.length === 0;
      },

      labelProp() {
        return this.props.label || 'label';
      },

      keyProp() {
        return this.props.key || 'key';
      }
    },

    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      updateAllChecked() {
        const dataLength = this.value.length;
        const checkLength = this.checked.length;
        this.allChecked = dataLength > 0 && checkLength > 0 && dataLength.toString() === checkLength.toString();
      },
      checkChange(val) {
        const checked = this.$refs.tree.getCheckedKeys(false);
        const checkedData = [];
        checked.forEach(item => {if (this.value.indexOf(item) > -1) checkedData.push(item);});
        this.checked = checkedData;
      },
      handleAllCheckedChange(value) {
        this.$refs.tree.setCheckedNodes(this.allChecked ? this.data : []);
      },
      clearQuery() {
        if (this.inputIcon === 'circle-close') {
          this.filterText = '';
        }
      }
    }
  };
</script>
