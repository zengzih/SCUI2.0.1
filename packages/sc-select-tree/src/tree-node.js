//  import Node from './node'
import {Node, ConvertToRows} from './node';

export default {
  props: {
    showCheckbox: Boolean,
    data: Array,
    defaultProps: Object
  },
  data() {
    return {
      selectVhtml: '',
      root: []
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
        <ul class={num > 1 ? '' : 'zzh-sc-tree'} id={parent && parent.expand}
            style={'display:' + (num > 1 && parent && !parent.expanded ? 'none' : 'block')}>
          {
            _this._l(node, (child, $index) =>
              <li style={'display:' + (child.visible !== false ? '' : 'none')} key={child[_this.defaultProps.nodeKey]}
                  class={[child.disabled ? 'is-disabled' : '']}>
                <div style={'padding-left:' + (child.level - 1) * 18 + 'px'}>
                     <span on-click={($event) => _this.handlerExpand($event, child, parent)}
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
                        class={['select-check ', child.checked ? 'select-checked' : '', child.indeterminate ? 'select-indeterminate' : '', child.disabled ? 'is-disabled' : '']}></span><span class="label-text">{child.data[_this.defaultProps.label]}</span>
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
    ConvertToRows(this.defaultProps);
    this.inIt();
  },
  methods: {
    inIt() {
      this.root = new Node({
        data: this.data,
        childKey: this.defaultProps.children
      });
    },
    Change(e, child, parent) {
    },
    handlerExpand(e, child, parent) {
      this.$set(child, 'expanded', !child.expanded);
    },
    setExpand() {
      const expand = (node)=> {
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
    handlerChange(e, node) {
      this.setChecked(e.target.checked, node);
      this.$nextTick(() => {
        this.$emit('check-change', e.target.checked ? node : [], e.target.checked ? (node.level === 1 ? [] : node.parent) : [], this.getCheckedNodes(), {
          node: node.data,
          checked: node.checked
        });
      });
    },
    handlerSelect(e, child) {
      if (!this.showCheckbox) {
        this.$set(child, 'expanded', !child.expanded);
        if (!child.childNodes || !child.childNodes.length) {
          this.$emit('check-change', child, [], []);
        }
      }
    },
    getCheckedNodes() {
      let result = [];
      const getCheckAll = (node) => {
        const childNodes = node.childNodes || [];
        childNodes.forEach((child) => {
          if (child.childNodes && child.childNodes.length) {
            getCheckAll(child);
          }
          if (child.checked && !child.childNodes.length) {
            result.push(child.data);
          }
        });
      };
      getCheckAll(this.root);
      return result;
    },
    setChecked(isCheck, node) {
      const _this = this;
      _this.$set(node, 'checked', isCheck);
      const handleDescendants = function(node) {
        var child = node.childNodes;
        child.forEach((item) => {
          _this.$set(item, 'checked', isCheck);
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
    setInitCheck(node) {
      const parent = node.parent;
      let isAllCheck = true;
      let indeterminate = false;
      parent.childNodes.forEach((child) => {
        if (!child.checked) {
          isAllCheck = false;
        }
        if (child.checked || child.indeterminate) {
          indeterminate = true;
        }
      });
      parent.checked = isAllCheck;
      parent.indeterminate = isAllCheck !== indeterminate;
      if (parent.parent) {
        this.setInitCheck(parent);
      }
    },
    filerTreeNode(val) {
      const filter = (node) => {
        const childNodes = node.childNodes;
        childNodes.forEach((child) => {
          child.visible = child.data[this.defaultProps.label].indexOf(val) !== -1;
          if (child.parent.filterCheck) {
            child.filterCheck = true;
          } else {
            child.filterCheck = child.data[this.defaultProps.label].indexOf(val) !== -1;
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
      const handler = (node) => {
        const childNodes = node.childNodes;
        childNodes.forEach((child) => {
          if (!child.checked) {
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
        if (!child.checked) {
          isCheckAll = false;
        }
      });
      parent.checked = isCheckAll;
      parent.indeterminate = !isCheckAll;
      if (parent.parent) {
        this.getIndeterminate(parent);
      }
    },
    setCheckedKeys(checkNode) {
      const setCheck = (node) => {
        const childNodes = node.childNodes || [];
        childNodes.forEach((child) => {
          if (checkNode.indexOf(child.data[this.defaultProps.nodeKey]) !== -1) {
            child.checked = true;
            this.getIndeterminate(child);
            const setchildCheck = (childs) => {
              const iChilds = childs.childNodes;
              iChilds.forEach((node) => {
                node.checked = true;
                if (node.childNodes && node.childNodes.length) {
                  setchildCheck(node);
                }
              });
            };
            if (child.childNodes && child.childNodes.length) {
              setchildCheck(child);
            }
          } else {
            child.checked = false;
            child.indeterminate = false;
          }
          if (child.childNodes && child.childNodes.length) {
            setCheck(child);
          }
        });
      };
      setCheck(this.root);
      this.$nextTick(() => {
        this.$emit('check-change', [], [], this.getCheckedNodes());
      });
    }
  }
};

