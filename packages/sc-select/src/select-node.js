export default {
  name: 'SelectNode',
  props: {
    data: Array,
    defaultProps: Object,
    showCheckbox: Boolean,
    defaultChecked: Array,
    defaultCheckAll: Boolean,
    multipleLimit: {
      type: Number,
      default: 0
    },
    selectionModel: Array // 记录当前过滤勾选的全部节点
  },
  data() {
    return {
      result: [],
      jsonKey: ''
    };
  },
  watch: {
    data: {
      handler(val) {
        this.init();
      },
      deep: true
    },
    result: {
      handler(val) {
      },
      deep: true
    },
    defaultChecked(val) {
      this.setDefaultChecked(val);
    }
  },
  render(h) {
    return (
      <ul class="el-scrollbar__view el-select-dropdown__list">
        {
          this._l(this.result, (child, $index) =>
            <li style={'display:' + (child.visibile !== false ? '' : 'none')}
                class={['el-select-dropdown__item', child.disabled ? 'is-disabled' : '']}>{
              this.showCheckbox ? <label>
                {
                    child.disabled ? <input type='checkbox' class={[child.checked ? 'is-checked' : '']} disabled on-change={($event) => this.handlerChange($event, child)} /> : <input type='checkbox' class={[child.checked ? 'is-checked' : '']} on-change={($event) => this.handlerChange($event, child)} />
                }
                <span
                  class={['select-check ', child.disabled ? 'is-disabled' : '']}></span><span>{child[this.defaultProps.label]}</span>
              </label> : <span class='select-label'
                               on-click={($event) => this.handlerSelect($event, child)}>{child[this.defaultProps.label]}</span>
            }</li>
          )
        }
      </ul>
    );
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.result = JSON.parse(JSON.stringify(this.data));
      // if (this.result.length && !this.result[0].letter) {
      //   for (var i = 0; i < this.result.length; i++) {
      //     this.result[i].letter = '';
      //     const label = [this.defaultProps.label];
      //     for (var n = 0; n < this.result[i][label].length; n++) {
      //       for (var j in PinYin) {
      //         if (PinYin[j].indexOf(this.result[i][label][n]) !== -1) {
      //           if (j.length > 1) {
      //             this.result[i].letter += j.charAt(0);
      //           } else {
      //             this.result[i].letter += j;
      //           }
      //         }
      //       }
      //     }
      //   }
      // }
      if (this.showCheckbox && this.result.length > 0) {
        this.jsonKey = this.getJsonKey(this.result);
        this.handlerSelectNode();
      }
    },
    getEnCodeVal(label, encodeVal) {
      let vLabel = label.split('');
      let isHave = false;
      for (var i = 0; i < vLabel.length; i++) {
        if (encodeVal.indexOf(vLabel[i]) !== -1) {
          isHave = true;
          break;
        }
      }
      return isHave;
    },
    selectFilter(val) {
      this.result.forEach((child) => {
        if (child[this.defaultProps.label] !== '全部') {
          const Initials = child[this.defaultProps.label];
          if ((Initials.indexOf(val) !== -1) || (child.letter && child.letter.indexOf(val) !== -1)) {
            this.$set(child, 'visibile', true);
          } else {
            this.$set(child, 'visibile', false);
          }
        }
      });
      if (this.showCheckbox) {
        var isDisabled = true;
        this.result.forEach((child) => {
          if (child.visibile && child[this.defaultProps.label] !== '全部') {
            if (!child.disabled) {
              isDisabled = false;
            }
          }
        });
        this.$set(this.result[0], 'disabled', isDisabled);
        this.$set(this.result[0], 'checked', this.setCheckAllisCheck());
      }
    },
    getJsonKey(node) {
      return node.map((item) => {
        if (item[this.defaultProps.label] !== '全部') {
          return item[this.defaultProps.nodeKey];
        }
      }).join('-');
    },
    handlerSelect(e, node) {
      this.$emit('check-change', node, []);
    },
    setCheckAllisCheck() {
      var isCheck = this.result.filter((child) => {
        if (child[this.defaultProps.label] !== '全部' && child.visibile && !child.disabled) {
          return child.checked;
        }
      });
      var visibile = this.result.filter((child) => {
        if (child[this.defaultProps.label] !== '全部' && !child.disabled) {
          return child.visibile;
        }
      });
      let isAll;
      if (this.getJsonKey(isCheck) === '' && this.getJsonKey(visibile) === '') {
        isAll = false;
      } else {
        isAll = this.getJsonKey(isCheck) === this.getJsonKey(visibile);
      }
      return isAll;
    },
    handlerSelectNode() {
      var allSelect = {};
      this.result.forEach((child) => {
        if (this.defaultChecked.indexOf(child[this.defaultProps.nodeKey]) !== -1 || this.defaultCheckAll) {
          this.$set(child, 'checked', true);
        }
      });
      if (this.multipleLimit) {
        for (var i = this.multipleLimit; i < this.result.length; i++) {
          this.$set(this.result[i], 'disabled', true);
        }
      }
      allSelect[this.defaultProps.label] = '全部';
      this.result.unshift(allSelect);
      this.result.forEach((child) => {
        if (this.defaultCheckAll) {
          this.$set(child, 'checked', true);
        } else {
          this.$set(child, 'checked', child.checked || false);
        }
        this.$set(child, 'visibile', true);
      });
      if (this.defaultCheckAll) {
        const all = this.result.slice(1, this.result.length);
        this.$emit('check-change', all, all);
      }
    },
    handlerChange(e, node) {
      if (node[this.defaultProps.label] === '全部') {
        this.result[0].checked = !this.result[0].checked;
        const isCheck = this.result[0].checked;
        this.result.forEach((child) => {
          if (!child.disabled && child.visibile) {
            this.$set(child, 'checked', isCheck);
          }
        });
        const filter = this.result.filter((item) => {
          if (item[this.defaultProps.label] !== '全部') { //  && item.visibile
            return item.checked;
          }
        });
        this.$emit('check-change', filter, filter);
      } else {
        this.result.forEach((child) => {
          if (!child.disabled && child[this.defaultProps.nodeKey] === node[this.defaultProps.nodeKey] && child.visibile) {
            this.$set(child, 'checked', child.checked = !child.checked);
          }
        });
        this.$set(this.result[0], 'checked', this.setCheckAllisCheck());
        const filter = this.result.filter((item) => {
          if (item[this.defaultProps.label] !== '全部') {
            return item.checked;
          }
        });
        this.$emit('check-change', node, filter);
      }
    },
    setDefaultChecked(val) {
      if (val.length && this.result.length) {
        this.result.forEach((child) => {
          child.checked = val.indexOf(child[this.defaultProps.nodeKey]) !== -1;
        });
        const filterCheck = this.result.filter((item) => {
          if (item[this.defaultProps.label] !== '全部') {
            return item.visibile;
          }
        });
        let selectionNode = val;
        if (val.length !== this.selectionModel.length) {
          selectionNode = this.selectionModel;
        }
        if (selectionNode.length === filterCheck.length) {
          this.result[0].checked = true;
        }
      } else {
        this.result.forEach((child) => {
          child.checked = false;
        });
      }
    },
    handlerEnter(val) {
      this.result.forEach((child) => {
        if (!child.disabled && child.visibile) {
          if (val) {
            child.checked = true;
          } else {
            child.checked = false;
          }
        }
      });
      const filter = this.result.filter((item) => {
        if (item[this.defaultProps.label] !== '全部') {
          return item.checked;
        }
      });
      this.$emit('check-change', filter, filter);
    }
  }
};
