<template>
  <div class="sc-drag" ref="drag" :style="getDragStyle">
    <div class="left-content" ref="leftcontent" v-show="leftShow" :style="leftPaneStyle">
      <div class="slot-content">
        <slot name="leftSlot"></slot>
      </div>
      <div class="line" v-show="lineShow" :class="getLineClass" @mousedown="handlerDown($event)">
        <span>
          <i class="el-icon-arrow-left" v-show="leftBtnShow" @click="handlerLeftBtn"></i>
          <i class="el-icon-arrow-right" v-show="rightBtnShow" @click="handlerRightBtn"></i>
        </span>
      </div>
    </div>
    <div class="right-content" ref="rightcontent" v-show="rightShow" :style="rightPaneStyle">
      <div class="line" v-show="rightLine" :class="getLineClass" @mousedown="handlerDown($event)">
        <span>
          <i class="el-icon-arrow-left" v-show="leftBtnShow" @click="handlerLeftBtn"></i>
          <i class="el-icon-arrow-right" v-show="rightBtnShow" @click="handlerRightBtn"></i>
        </span>
      </div>
      <div class="content-body" ref="contentBody">
        <slot name="rightSlot"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ScDrag',
    data() {
      return {
        leftShow: true,
        leftBtnShow: false,
        rightBtnShow: true,
        rightShow: false,
        lineShow: false,
        leftPaneStyle: '',
        rightPaneStyle: '',
        interimWidth: '',
        rInterimWidth: '',
        lineClass: '',
        emitEvent: false,
        rightLine: false
      };
    },
    props: {
      height: {
        default: '400',
        type: [Number, String]
      }
    },
    watch: {
    },
    computed: {
      getLineClass() {
        if (!this.leftBtnShow || !this.rightBtnShow) {
          return 'line_default';
        } else {
          return '';
        }
      },
      getDragStyle() {
        return ';height:' + this.height + 'px';
      }
    },
    created() {
      this.getPanelStyle();
    },
    mounted() {
    },
    methods: {
      getPanelStyle() {
        if (this.rightShow) {
          this.rightBtnShow = true;
          this.leftPaneStyle = ';width: 75%';
          this.rightPaneStyle = ';width: 25%';
          this.emitEvent = true;
        } else {
          this.leftPaneStyle = ';width: 100%';
          this.rightBtnShow = false;
          this.leftBtnShow = true;
          this.emitEvent = true;
        }
      },
      showPanel(direction) {
        if (direction === 'left') {
          this.leftShow = true;
          this.rightShow = false;
          this.lineShow = true;
          this.rightLine = false;
        }
        if (direction === 'right') {
          this.rightShow = true;
          this.lineShow = true;
          this.leftBtnShow = true;
        }
        this.getPanelStyle();
      },
      handlerLeftBtn() {
        const rightContent = this.$refs.rightcontent;
        const contentBody = this.$refs.contentBody;
        const drag = this.$refs.drag;
        if (this.rightBtnShow) {
          this.interimWidth = parseInt(this.getStyle(rightContent, 'width'), 10) / drag.offsetWidth * 100;
          this.rightPaneStyle = ';width:100%';
          this.leftShow = false;
          this.rightShow = true;
          this.leftBtnShow = false;
          this.rightLine = true;
          contentBody.style.width = 'calc(100% - 10px)';
        } else {
          this.rightShow = true;
          this.rightBtnShow = true;
          this.rightLine = false;
          // 将实际宽度转换为百分比
          this.rightPaneStyle = ';width:' + (this.rInterimWidth && !this.emitEvent ? this.rInterimWidth + '%' : '25%');
          this.leftPaneStyle = ';width:' + (this.interimWidth && !this.emitEvent ? this.interimWidth + '%' : '75%');
        }
        this.emitEvent = false;
      },
      handlerRightBtn() {
        const rightContent = this.$refs.rightcontent;
        const leftContent = this.$refs.leftcontent;
        const drag = this.$refs.drag;
        if (!this.leftBtnShow) {
          this.leftBtnShow = true;
          this.rightLine = false;
          this.leftShow = true;
          this.rightPaneStyle = ';width:' + this.interimWidth + '%';
        } else {
          this.rInterimWidth = parseInt(this.getStyle(rightContent, 'width'), 10) / drag.offsetWidth * 100;
          this.interimWidth = parseInt(this.getStyle(leftContent, 'width'), 10) / drag.offsetWidth * 100;
          this.rightShow = false;
          this.rightLine = false;
          this.rightBtnShow = false;
          this.leftPaneStyle = ';width: 100%';
        }
        this.emitEvent = false;
      },
      handlerDown(e) {
        if (this.leftBtnShow && this.rightBtnShow) {
          const clientX = e.clientX;
          const { leftcontent, rightcontent, drag } = this.$refs;
          const leftWidth = leftcontent.offsetWidth;
          const rightWidth = rightcontent.offsetWidth;
          document.onmousemove = (e) => {
            const vWidth = leftWidth - (clientX - e.clientX);
            if (vWidth > 30 && vWidth < drag.offsetWidth - 30) {
              this.leftPaneStyle = ';width:' + (vWidth / drag.offsetWidth) * 100 + '%';
              this.rightPaneStyle = ';width:' + (rightWidth + (clientX - e.clientX)) / drag.offsetWidth * 100 + '%';
            }
          };
          document.onmouseup = (e) => {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        }
      },
      getStyle(el, attr) {
        return el.currentStyle ? el.currentStyle[attr] : getComputedStyle(el, false)[attr];
      }
    }
  };
</script>
