import {Node} from './node';

export default {
  name: 'SelectNode',
  props: {
    showCheckbox: Boolean,
    data: Array,
    defaultProps: Object,
    defaultCheckAll: Boolean,
    store: Object
  },
  data() {
    return {
      root: [],
      tempResult: []
    };
  },
  watch: {
    data: {
      handler() {
        this.inIt();
      },
      deep: true
    }
  },
  render(h) {
    const _this = this;
    let num = 0;
    this.fn = function(node, parent) {
      num++;
      return (
        <ul class={num > 1 ? '' : 'sc-select-tree'} id={parent && parent.expand}
            style={'display:' + (num > 1 && parent && !parent.expanded ? 'none' : 'block')}>
          {
            _this._l(node, (child, $index) =>
              <li style={'display:' + (child.visible !== false ? '' : 'none')} key={child[_this.defaultProps.nodeKey]}
                  class={[child.disabled ? 'is-disabled' : '']}>
                <div style={'padding-left:' + (child.level - 1) * 18 + 'px'}>
                     <span on-click={($event) => _this.handlerExpand(child)}
                           class={['tree-icon', child.expanded ? 'sc-tree-expanded' : 'sc-tree-collapsed']}>{
                       child.childNodes.length ? <span></span> : ''
                     }</span>
                  {
                    this.showCheckbox ? <label>
                      {
                        child.disabled ? (child.checked ? <input type='checkbox' checked disabled
                                                                 on-change={($event) => _this.handlerChange($event, child)}/> : <input type='checkbox' on-change={($event) => _this.handlerChange($event, child)}
                                 disabled/>) : (child.checked ? <input type='checkbox' on-change={($event) => _this.handlerChange($event, child)} checked/> : <input type='checkbox' on-change={($event) => _this.handlerChange($event, child)}/>)
                      }
                      <span
                        class={['select-check ', child.checked ? 'select-checked' : '', child.indeterminate ? 'select-indeterminate' : '', child.disabled ? 'is-disabled' : '']}></span><span class='select-label'>{child.data[_this.defaultProps.label]}</span>
                    </label> : <span class='select-label'
                                     on-click={($event) => _this.handlerSelect($event, child)}>{child.data[_this.defaultProps.label]}</span>
                  }</div>
                {
                  child.childNodes ? _this.fn(child.childNodes, child) : ''
                }
              </li>
            )
          }
        </ul>
      );
    };
    return (
      this.fn(this.root.childNodes)
    );
  },
  mounted() {

  },
  created() {
    this.inIt();
  },
  methods: {
    inIt() {
      this.root = new Node({
        data: this.data,
        store: this.store
      });
      const checkedNode = [];
      const temporary = (node) => {
        const childNodes = node.childNodes || [];
        childNodes.forEach((child) => {
          if (child.childNodes.length) {
            temporary(child);
          } else {
            if (child.checked) {
              checkedNode.push(child.data);
            }
            this.getNodeDisabled(child);
          }
        });
      };
      temporary(this.root);
      if (this.showCheckbox) {
        if (this.defaultCheckAll) {
          this.$emit('check-change', {}, {}, checkedNode);
        } else if (this.root.childNodes.length) {
          this.setCheckedKeys(this.store.checkModel);
        } else {
          this.$emit('check-change', {}, {}, []);
        }
      }
    },
    getNodeDisabled(node) {
      const parent = node.parent;
      let isDisabled = true;
      parent.childNodes.forEach((child) => {
        if (!child.disabled) {
          isDisabled = false;
        }
      });
      parent.disabled = isDisabled;
      if (parent.parent) {
        this.getNodeDisabled(parent);
      }
    },
    handlerExpand(child) {
      this.$set(child, 'expanded', !child.expanded);
    },
    handlerChange(e, node) {
      this.setChecked(e.target.checked, node);
      this.$nextTick(() => {
        this.$emit('check-change', e.target.checked ? node : [], e.target.checked ? (node.level === 1 ? [] : node.parent) : [], this.getCheckedNodes(), {
          node: node.data,
          checked: node.checked
        });
      });
    },
    handlerSelect(e, child) { // 单选事件
      if (!this.showCheckbox) {
        this.$set(child, 'expanded', !child.expanded);
        if (!child.childNodes || !child.childNodes.length) {
          this.$emit('check-change', child, child.parent, [], []);
        }
      }
    },
    setExpand() {
      const expand = (node) => {
        const childNodes = node.childNodes || [];
        childNodes.forEach((child) => {
          child.expanded = false;
          if (child.childNodes && child.childNodes.length) {
            expand(child);
          }
        });
      };
      expand(this.root);
    },
    getCheckedNodes() {
      let result = [];
      const getCheckAll = (node) => {
        const childNodes = node.childNodes || [];
        childNodes.forEach((child) => {
          if (child.childNodes && child.childNodes.length) {
            getCheckAll(child);
          }
          if (child.checked && !child.childNodes.length) { //  && !child.disabled
            result.push(child.data);
          }
        });
      };
      getCheckAll(this.root);
      return result;
    },
    setChecked(isCheck, node) {
      const _this = this;
      if (!node.disabled) {
        if (node.indeterminate) {
          if (this.getDisabledCheck(node)) {
            isCheck = true;
          } else {
            isCheck = !isCheck;
          }
          _this.$set(node, 'checked', isCheck);
        } else {
          _this.$set(node, 'checked', isCheck);
        }
      }
      const handleDescendants = function(node) {
        var child = node.childNodes;
        child.forEach((item) => {
          if (!item.disabled && item.visible) {
            _this.$set(item, 'checked', isCheck);
          }
          if (item.childNodes) {
            handleDescendants(item);
          }
        });
        if (child.level === 0 || !child.length) {
          _this.setInitCheck(node);
        }
      };
      handleDescendants(node);
      var root = this.root;
      this.root = [];
      this.$nextTick(() => {
        this.root = root;
      });
    },
    getDisabledCheck(node) {
      var isDisCheck = false;
      const trans = (nodes) => {
        const childNodes = nodes.childNodes;
        childNodes.forEach((child) => {
          if (child.disabled && child.checked) {
            isDisCheck = true;
          } else if (child.childNodes && child.childNodes.length) {
            trans(child);
          }
        });
      };
      trans(node);
      return isDisCheck;
    },
    setInitCheck(node) {
      const parent = node.parent;
      let isAllCheck = true;
      let indeterminate = false;
      parent.childNodes.forEach((child) => {
        if (!child.checked || !child.visible) { //  && !child.disabled
          isAllCheck = false;
        }
        if ((child.checked || child.indeterminate) && child.visible) { // !child.disabled &&
          indeterminate = true;
        }
      });
      parent.checked = isAllCheck;
      parent.indeterminate = isAllCheck !== indeterminate;
      if (parent.parent) {
        this.setInitCheck(parent);
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
    filerTreeNode(val) {
      const filter = (node) => {
        const childNodes = node.childNodes;
        childNodes.forEach((child) => {
          const Initials = child.data[this.defaultProps.label];
          if (child.letter) {
            child.visible = ((Initials.indexOf(val) !== -1) || (child.letter && child.letter.indexOf(val) !== -1));
          } else {
            child.visible = (Initials.indexOf(val) !== -1);
          }
          if (child.parent.filterCheck) {
            child.filterCheck = true;
          } else {
            child.filterCheck = ((Initials.indexOf(val) !== -1) || (child.letter && child.letter.indexOf(val) !== -1));
          }
          filter(child);
        });
        if (node.visible && node.filterCheck && node.childNodes.length) {
          const setChildShow = (node) => {
            node.childNodes.forEach((child) => {
              child.visible = true;
              node.expanded = true;
              child.childNodes.length && setChildShow(child);
            });
          };
          setChildShow(node);
        }
        if (!node.visible && node.childNodes.length) {
          let allHidden = true;
          childNodes.forEach((child) => {
            if (child.visible) {
              allHidden = false;
            }
          });
          node.expanded = allHidden === false;
          node.visible = allHidden === false;
        }
        if (!val) {
          node.expanded = false;
          node.visible = true;
        }
      };
      filter(this.root);
    },
    handlerEnter() { // 回车事件
      this.tempResult = [];
      const handler = (node) => {
        const childNodes = node.childNodes;
        childNodes.forEach((child) => {
          if (!child.checked && !child.disabled) {
            if (child.filterCheck) {
              this.tempResult.push(child);
            }
            this.$set(child, 'checked', child.filterCheck);
          }
          if (child.filterCheck) {
            this.getIndeterminate(child);
          }
          if (child.childNodes.length) {
            handler(child);
          }
        });
      };
      handler(this.root);
      this.$nextTick(() => {
        this.$emit('check-change', {}, {}, this.getCheckedNodes());
      });
    },
    getIndeterminate(node) {
      let isCheckAll = true;
      let isCheck = false;
      const parent = node.parent || [];
      if (node.checked) {
        const childCheckd = (par) => {
          par.childNodes.forEach((item) => {
            this.$set(item, 'checked', par.checked);
            if (item.childNodes && item.childNodes.length) {
              childCheckd(item);
            }
          });
        };
        childCheckd(node);
      }
      parent.childNodes.forEach((child) => {
        if (child.checked || child.indeterminate) {
          isCheck = true;
        }
        if (!child.checked || !child.visible) {
          isCheckAll = false;
        }
      });
      parent.checked = isCheckAll;
      parent.indeterminate = !isCheck ? false : !isCheckAll;
      if (parent.parent) {
        this.getIndeterminate(parent);
      }
    },
    setCheckedKeys(checkNode) {
      let cachedOptions = {};
      let checkNodes = [];
      const setCheck = (node) => {
        const childNodes = node.childNodes || [];
        childNodes.forEach((child) => {
          if (checkNode.indexOf(child.data[this.defaultProps.nodeKey]) !== -1) {
            if (!this.showCheckbox) {
              cachedOptions = child;
            } else {
              child.checked = true;
              child.indeterminate = false;
              this.getIndeterminate(child);
              const setChildCheck = (childs) => {
                const iChilds = childs.childNodes;
                iChilds.forEach((node) => {
                  node.checked = true;
                  if (!node.childNodes.length) {
                    checkNodes.push(node.data);
                  }
                  if (node.childNodes && node.childNodes.length) {
                    setChildCheck(node);
                  }
                });
              };
              if (child.childNodes && child.childNodes.length) {
                setChildCheck(child);
              } else if (!child.childNodes.length && child.checked) {
                checkNodes.push(child.data);
              }
            }
          } else {
            if (!child.disabled) {
              child.checked = false;
              child.indeterminate = false;
              this.getIndeterminate(child);
            } else {
              const getDisCheck = (node) => {
                const childNodes = node.childNodes;
                childNodes.forEach((childs) => {
                  if (!childs.childNodes.length && childs.disabled && childs.checked && checkNodes.indexOf(child.data) === -1) {
                    checkNodes.push(childs.data);
                  } else if (childs.childNodes && childs.childNodes.length) {
                    getDisCheck(childs);
                  }
                });
              };
              getDisCheck(child);
            }
          }
          if (child.childNodes && child.childNodes.length && !child.checked) {
            setCheck(child);
          }
        });
      };
      setCheck(this.root);
      this.$emit('check-change', this.showCheckbox ? [] : cachedOptions, [], checkNodes);
    },
    setNodeExpand(val) {
      const done = (node) => {
        const childNodes = node.childNodes || [];
        childNodes.forEach((child) => {
          if (val.indexOf(child.data[this.defaultProps.nodeKey]) !== -1) {
            child.expanded = true;
            const parentExpand = (child) => {
              const parent = child.parent;
              parent.expanded = true;
              if (parent.parent) {
                parentExpand(parent);
              }
            };
            if (child.parent) {
              parentExpand(child);
            }
          } else {
            if (child.childNodes.length) {
              done(child);
            }
          }
        });
      };
      done(this.root);
    }
  }
};
