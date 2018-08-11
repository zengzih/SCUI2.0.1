<template>
  <transition name="dialog-fade">
    <div class="el-dialog__wrapper" ref="dialogWrapper" v-show="visible" @click.self="handleWrapperClick">
      <div
        class="el-dialog"
        :class="[sizeClass, customClass]"
        ref="dialog"
        :style="style">
        <div class="el-dialog__header" @mousedown="handleMouseDown($event)">
          <slot name="title">
            <span class="el-dialog__title">{{title}}</span>
          </slot>
          <button type="button" class="el-dialog__headerbtn" aria-label="Close"
                  v-if="showClose" @click="handleClose">
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="el-dialog__body" :style="getDiaBodyStyle" v-if="rendered"><slot></slot></div>
        <div class="el-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Popup from 'element-ui/src/utils/popup';
  import emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'ElDialog',

    mixins: [Popup, emitter],

    props: {
      title: {
        type: String,
        default: ''
      },

      modal: {
        type: Boolean,
        default: true
      },

      drag: {
        type: Boolean,
        default: false
      },

      maxHeight: [String, Number],

      modalAppendToBody: {
        type: Boolean,
        default: true
      },

      lockScroll: {
        type: Boolean,
        default: true
      },

      closeOnClickModal: {
        type: Boolean,
        default: true
      },

      closeOnPressEscape: {
        type: Boolean,
        default: true
      },

      showClose: {
        type: Boolean,
        default: true
      },

      size: {
        type: String,
        default: 'small'
      },

      customClass: {
        type: String,
        default: ''
      },

      top: {
        type: String,
        default: '15%'
      },
      beforeClose: Function
    },

    watch: {
      visible(val) {
        this.$emit('update:visible', val);
        if (val) {
          this.$emit('open');
          this.$el.addEventListener('scroll', this.updatePopper);
          this.$nextTick(() => {
            this.$refs.dialog.scrollTop = 0;
            if (this.drag) {
              if (this.isInit) {
                const dialog = this.$refs.dialog;
                const dialogWrapper = this.$refs.dialogWrapper;
                /* dialog.style.transform = 'translateX(0)';
                dialog.style.left = dialog.offsetLeft - (dialog.offsetWidth / 2) + 'px';
                dialog.style.top = dialog.offsetTop - (dialog.offsetHeight / 2) + 'px'; */
                dialog.style.cssText += ';transform: translate(0, 0)';
                dialog.style.cssText += ';left: ' + (dialogWrapper.offsetWidth - dialog.offsetWidth) / 2 + 'px';
                dialog.style.cssText += ';top: ' + (dialogWrapper.offsetHeight - dialog.offsetHeight) / 2 + 'px !important';
                this.isInit = false;
              }
            }
          });
        } else {
          this.broadcast('ElTransferPanel', 'clearSearch');
          this.$el.removeEventListener('scroll', this.updatePopper);
          this.$emit('close');
        }
      }
    },

    computed: {
      sizeClass() {
        return `el-dialog--${ this.size }`;
      },
      style() {
        return this.size === 'full' ? {} : { 'top': this.top };
      },
      getDiaBodyStyle() {
        if (this.maxHeight) {
          return ';max-height:' + this.maxHeight + 'px;';
        }
      }
    },

    data() {
      return {
        isInit: true
      };
    },

    methods: {
      handleMouseDown(ev) {
        if (!this.drag) {
          return;
        }
        const dialog = this.$refs.dialog;
        const dialogWrapper = this.$refs.dialogWrapper;
        const distanceWidth = dialogWrapper.offsetWidth - dialog.offsetWidth;
        const distanceHeight = dialogWrapper.offsetHeight - dialog.offsetHeight;
        const disX = ev.clientX - dialog.offsetLeft;
        const disY = ev.clientY - dialog.offsetTop;
        document.onmousemove = function(e) {
          let elLeft = e.clientX - disX;
          let elTop = e.clientY - disY;
          if (elLeft >= distanceWidth) {
            elLeft = distanceWidth;
          } else if (elLeft < 0) {
            elLeft = 0;
          }
          if (elTop >= distanceHeight) {
            elTop = distanceHeight;
          } else if (elTop < 0) {
            elTop = 0;
          }
          dialog.style.cssText += ';top:' + elTop + 'px !important' + ';left:' + elLeft + 'px';
        };
        document.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      },
      handleWrapperClick() {
        if (!this.closeOnClickModal) return;
        this.handleClose();
      },
      handleClose() {
        if (typeof this.beforeClose === 'function') {
          this.beforeClose(this.hide);
        } else {
          this.hide();
        }
      },
      hide(cancel) {
        if (cancel !== false) {
          this.$emit('update:visible', false);
          this.$emit('visible-change', false);
        }
      },
      updatePopper() {
        this.broadcast('ElSelectDropdown', 'updatePopper');
        this.broadcast('ElDropdownMenu', 'updatePopper');
      }
    },

    mounted() {
      if (this.visible) {
        this.rendered = true;
        this.open();
      }
    }
  };
</script>

<style scope>
  .el-dialog__title {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>