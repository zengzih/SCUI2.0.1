import { PinYin } from 'element-ui/src/utils/unicode';
export const Node = function(options) {
  this.init(options);
};
Node.prototype.init = function(options) {
  this.text = null;
  this.indeterminate = false;
  this.data = null;
  this.letter = '';
  if (options.store.defaultExpandAll) {
    this.expanded = true;
  } else {
    this.expanded = false;
  }
  this.parent = null;
  if (options.store.defaultCheckAll) {
    this.checked = true;
  } else {
    this.checked = false;
  }
  this.filterCheck = false;
  this.disabled = false;
  this.visible = true;
  this.store = {};
  for (var name in options) {
    if (options.hasOwnProperty(name)) {
      this[name] = options[name];
      for (var n in options.data) {
        if (this.hasOwnProperty(n)) {
          if (n === 'disabled') {
            if (options.data[n] === 'true') {
              options.data[n] = true;
            }
            if (options.data[n] === 'false' || options.data[n] === '') {
              options.data[n] = false;
            }
          }
          this[n] = options.data[n];
        }
      }
    }
  }
  if (this.store.defaultExpandedKeys && this.store.defaultExpandedKeys.indexOf(this.data[this.store.defaultProps.nodeKey]) !== -1) {
    this.NodeExpand();
  }
  this.level = 0;
  this.childNodes = [];
  if (this.parent) {
    this.level = this.parent.level + 1;
    if (!this.disabled) {
      this.disabled = this.parent.disabled;
    }
  }
  // this.expanded = !this.level === 1;
  if (this.data) {
    this.setData(this.data);
    // this.transNodeInitials(this.data);
  }
};

Node.prototype.setData = function(data) {
  this.data = data;
  this.childNodes = [];
  var children;
  if (this.level === 0 && this.data instanceof Array) {
    children = this.data;
  } else {
    children = data[this.store.defaultProps.children] || [];
  }

  for (var i = 0, j = children.length; i < j; i++) {
    // this.transNodeInitials(children[i]);
    this.insertChild({data: children[i]});
  }
};

Node.prototype.insertChild = function(child) {
  if (!(child instanceof Node)) {
    Object.assign(child, {
      parent: this,
      store: this.store
    });
    var childs = new Node(child);
  }
  childs.level = this.level + 1;
  this.childNodes.push(childs);
};

Node.prototype.NodeExpand = function() {
  const done = () => {
    let parent = this.parent;
    while (parent && parent.level > 0) {
      parent.expanded = true;
      parent = parent.parent;
    }
    this.expanded = true;
  };
  done();
};

Node.prototype.transNodeInitials = function(data) {
  const label = this.store.defaultProps.label;
  if (data instanceof Array) {
    if (!data.length) {
      return;
    } else {
      data = data[0];
    }
  } else if (JSON.stringify(data) === '{}') {
    return;
  }
  for (var i = 0; i < data[label].length; i++) {
    for (var n in PinYin) {
      if (PinYin[n].indexOf(data[label][i]) !== -1) {
        if (n.length > 1) {
          this.letter += n.charAt(0);
        } else {
          this.letter += n;
        }
      }
    }
  }
};
