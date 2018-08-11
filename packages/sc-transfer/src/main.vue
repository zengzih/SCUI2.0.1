<template>
  <div class="el-transfer">
    <transfer-panel
      v-if="childType === 0"
      v-bind="$props"
      :data="sourceData"
      :title="titles[0] || t('el.transfer.titles.0')"
      :default-checked="leftDefaultChecked"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      @checked-change="onSourceCheckedChange">
      <slot name="left-footer"></slot>
    </transfer-panel>
    <transfer-tree
      v-if="childType === 1"  
      v-bind="$props"
      :data="sourceData"
      :value="firstValue"
      :value-data="leftValueData"
      :filterable="filterable"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      :title="titles[0] || t('el.transfer.titles.0')"
      :default-checked="leftDefaultChecked"
      @checked-change="onSourceCheckedChange">
      <slot name="left-footer"></slot>
    </transfer-tree>
    <div class="el-transfer__buttons">
      <el-button
        type="primary"
        size="small"
        @click.native="addToLeft"
        :disabled="rightChecked.length === 0">
        <i class="el-icon-arrow-left"></i>
        <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click.native="addToRight"
        :disabled="leftChecked.length === 0">
        <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
        <i class="el-icon-arrow-right"></i>
      </el-button>
    </div>
     <transfer-panel
      v-if="childType === 0"
      v-bind="$props"
      :data="targetData"
      :title="titles[1] || t('el.transfer.titles.1')"
      :default-checked="rightDefaultChecked"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      @checked-change="onTargetCheckedChange">
      <slot name="right-footer"></slot>
    </transfer-panel>
    <transfer-tree
      v-if="childType === 1"
      v-bind="$props"
      :value="value"
      :value-data="rightValueData"
      :filterable="filterable"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      :data="targetData"
      :title="titles[1] || t('el.transfer.titles.1')"
      :default-checked="rightDefaultChecked"
      @checked-change="onTargetCheckedChange">
      <slot name="right-footer"></slot>
    </transfer-tree>
  </div>
</template>

<script>
  import ElButton from 'element-ui/packages/button';
  import Emitter from 'element-ui/src/mixins/emitter';
  import Locale from 'element-ui/src/mixins/locale';
  import TransferPanel from './transfer-panel.vue';
  import TransferTree from './transfer-tree.vue';

  export default {
    name: 'ScTransfer',

    mixins: [Emitter, Locale],

    components: {
      TransferPanel,
      TransferTree,
      ElButton
    },

    props: {
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      titles: {
        type: Array,
        default() {
          return ['Source', 'Target'];
        }
      },
      buttonTexts: {
        type: Array,
        default() {
          return [];
        }
      },
      filterPlaceholder: {
        type: String,
        default: ''
      },
      filterMethod: Function,
      leftDefaultChecked: {
        type: Array,
        default() {
          return [];
        }
      },
      rightDefaultChecked: {
        type: Array,
        default() {
          return [];
        }
      },
      renderContent: Function,
      value: {
        type: Array,
        default() {
          return [];
        }
      },
      footerFormat: {
        type: Object,
        default() {
          return {};
        }
      },
      filterable: {
        type: Boolean,
        default() {
          return true;
        }
      },
      props: {
        type: Object,
        default() {
          return {
            label: 'label',
            key: 'key',
            children: 'children'
          };
        }
      }
    },

    data() {
      return {
        leftChecked: [],
        rightChecked: [],
        firstValue: [],
        leftValueData: [],
        rightValueData: [],
        childType: 0
      };
    },

    computed: {
      sourceData() {
        return this.childType ? this.onErgodic(JSON.parse(JSON.stringify(this.data))) : this.data.filter(item => this.value.indexOf(item[this.props.key]) === -1);
      },

      targetData() {
        return this.childType ? this.onErgodic(JSON.parse(JSON.stringify(this.data)), []) : this.data.filter(item => this.value.indexOf(item[this.props.key]) > -1);
      }
    },
    created() {
      this.childType = this.data.every(item => item[this.props.children] === undefined) ? 0 : 1;
    },

    watch: {
      value(val, oldval) {
        this.dispatch('ElFormItem', 'el.form.change', val);
      },
      sourceData(val) {
        if (this.childType) {
          const ids = this.onErgodic(JSON.parse(JSON.stringify(this.data)), [], true);
          const idsAll = [];
          const idsAllData = [];
          const idsAllLeft = [];
          const ldata = [];
          const rdata = [];
          ids.forEach(item => {
            if (idsAll.indexOf(item.id) === -1) {
              idsAll.push(item.id);
              idsAllData.push(item);
              if (this.value.indexOf(item.id) === -1) {
                idsAllLeft.push(item.id);
                ldata.push(item);
              } else if (this.value.indexOf(item.id) > -1) {
                rdata.push(item);
              }
            }
          });
          this.leftValueData = ldata;
          this.rightValueData = idsAllData.filter(item => this.value.indexOf(item.id) > -1);
          this.firstValue = idsAllLeft;
        }
      },
      targetData(val) {

      }
    },

    methods: {
      onErgodic(edata, tdata, math) {
        if (edata && edata.length > 0) {
          for (var i = 0; i < edata.length; i++) {
            if (math !== undefined) tdata.push({id: edata[i].id, label: edata[i].label, prentId: edata[i].prentId || false});
            for (var j = 0; j < this.value.length; j++) {
              if (edata[i] && this.value[j] === edata[i].id) {
                if (tdata !== undefined && math === undefined) {
                  tdata.push({id: edata[i].id, label: edata[i].label, prentId: edata[i].prentId || false});
                } else if (math === undefined) {
                  edata.splice(i, 1);
                  i = i - 1;
                }
              }
            }
            if (edata[i] && edata[i][this.props.children] && edata[i][this.props.children].length && edata[i][this.props.children].length > 0) {
              this.onErgodic(edata[i][this.props.children], tdata, math);
            }
          };
        }
        return tdata === undefined ? edata : tdata || [];
      },
      onSourceCheckedChange(val) {
        this.leftChecked = val;
      },

      onTargetCheckedChange(val) {
        this.rightChecked = val;
      },

      addToLeft() {
        let currentValue = this.value.slice();
        this.rightChecked.forEach(item => {
          const index = currentValue.indexOf(item);
          if (index > -1) {
            currentValue.splice(index, 1);
          }
        });
        this.$emit('input', currentValue);
        this.$emit('change', currentValue, 'left', this.rightChecked);
      },

      addToRight() {
        let currentValue = this.value.slice();
        this.leftChecked.forEach(item => {
          if (this.value.indexOf(item) === -1) {
            currentValue = currentValue.concat(item);
          }
        });
        this.$emit('input', currentValue);
        this.$emit('change', currentValue, 'right', this.leftChecked);
      }
    }
  };
</script>
