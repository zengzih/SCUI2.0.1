<template>
  <div :class="[
    type === 'textarea' ? 'el-textarea' : 'el-input',
    size ? 'el-input--' + size : '',
    {
      'is-disabled': disabled,
      'el-input-group': $slots.prepend || $slots.append,
      'el-input-group--append': $slots.append,
      'el-input-group--prepend': $slots.prepend
    }
  ]">
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="el-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <!-- input 图标 -->
      <slot name="icon">
        <i class="el-input__icon iconfont"
          :class="[ icon.indexOf('sc') !== -1 ? icon : 'el-icon-' + icon,
            onIconClick ? 'is-clickable' : ''
          ]"
          v-if="icon"
          @click="handleIconClick">
          <i></i>
        </i>
      </slot>
      <input
        v-if="type !== 'textarea'"
        class="el-input__inner"
        v-bind="$props"
        :autocomplete="autoComplete"
        :value="currentValue"
        ref="input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="handleEnterEvent"
      >
      <i class="el-input__icon el-icon-loading" v-if="validating"></i>
      <!-- 后置元素 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      class="el-textarea__inner"
      :value="currentValue"
      @input="handleInput"
      ref="textarea"
      v-bind="$props"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur">
    </textarea>
  </div>
</template>
<script>
  import emitter from 'element-ui/src/mixins/emitter';
  import calcTextareaHeight from './calcTextareaHeight';
  import merge from 'element-ui/src/utils/merge';

  export default {
    name: 'ElInput',

    componentName: 'ElInput',

    mixins: [emitter],

    data() {
      return {
        currentValue: this.value,
        textareaCalcStyle: {}
      };
    },

    props: {
      value: [String, Number],
      placeholder: String,
      size: String,
      resize: String,
      readonly: Boolean,
      autofocus: Boolean,
      icon: String,
      disabled: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      name: String,
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      rows: {
        type: Number,
        default: 2
      },
      autoComplete: {
        type: String,
        default: 'off'
      },
      form: String,
      maxlength: Number,
      minlength: Number,
      max: {},
      min: {},
      step: {},
      validateEvent: {
        type: Boolean,
        default: true
      },
      onIconClick: Function,
      amount: Boolean
    },

    computed: {
      validating() {
        return this.$parent.validateState === 'validating';
      },
      textareaStyle() {
        return merge({}, this.textareaCalcStyle, { resize: this.resize });
      }
    },

    watch: {
      'value'(val) {
        if (typeof val === 'string') {
          this.setCurrentValue(val.trim());
        } else {
          this.setCurrentValue(val);
        }
      },
      'currentValue'(val) {
        if (typeof val === 'string') {
          this.currentValue = val.trim();
        } else {
          this.currentValue = val;
        }
      }
    },

    methods: {
      StrTrim(param) {
        let vRet = '';
        if ((vRet = param) === '') { return vRet; }
        while (true) {
          if (vRet.indexOf(' ') === 0) {
            vRet = vRet.substring(1, parseInt(vRet.length, 10));
          } else if ((parseInt(vRet.length, 10) !== 0) && (vRet.lastIndexOf(' ') === parseInt(vRet.length, 10) - 1)) {
            vRet = vRet.substring(0, parseInt(vRet.length, 10) - 1);
          } else {
            return vRet;
          }
        }
      },
      handleEnterEvent() {
        this.$emit('handleevent');
      },
      handleBlur(event) {
        this.$emit('blur', event);
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.blur', this.currentValue);
        }
      },
      inputSelect() {
        this.$refs.input.select();
      },
      resizeTextarea() {
        if (this.$isServer) return;
        var { autosize, type } = this;
        if (!autosize || type !== 'textarea') return;
        const minRows = autosize.minRows;
        const maxRows = autosize.maxRows;

        this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
      },
      handleFocus(event) {
        this.$emit('focus', event);
      },
      stripscript(str) {
        var inputVal = '';
        var pattern = new RegExp("[`%+~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        let isMinus = false;
        for (var i = 0; i < str.length; i++) {
          var letter = str.substr(i, 1);
          if (i === 0 && letter === '-') {
            isMinus = true;
          }

          if (i < 1 && letter === '.') {
            letter = '@';
          } else if (i === 1 && letter === '.' && isMinus) {
            letter = '@';
          }
          inputVal = inputVal + letter.replace(pattern, '');
        }
        /* 输入千分位 */
        inputVal = inputVal.replace(/[a-zA-Z\u4e00-\u9fa5\s]/g, '');
        if (inputVal === '' || inputVal === '-') return inputVal;

        let resultArr = [];
        let arr = inputVal.split('.');
        let integerStr = arr[0].split(',').join('');
        let decimalStr = arr[1];
        if (decimalStr === undefined) {
          decimalStr = '';
        } else {
          decimalStr = '.' + decimalStr;
        }

        if (integerStr.substr(0, 1) === '-') {
          integerStr = integerStr.substring(1);
          isMinus = true;
        }

        while (integerStr > 999) {
          var length = integerStr.length;
          resultArr.push(integerStr.substr(length - 3, 3));
          integerStr = integerStr.substr(0, length - 3);
        }
        resultArr.push(parseFloat(integerStr));
        resultArr.reverse();

        if (isMinus) {
          inputVal = '-' + resultArr.join(',') + decimalStr;
        } else {
          inputVal = resultArr.join(',') + decimalStr;
        }
        return inputVal;
      },
      handleInput(event) {
        const val = event.target.value;
        const value = typeof val === 'string' ? val.trim() : val;
        this.$emit('input', value);
        this.setCurrentValue(value);
        this.$emit('change', value);
      },
      handleIconClick(event) {
        if (this.onIconClick) {
          this.onIconClick(event);
        }
        this.$emit('click', event);
      },
      setCurrentValue(value) {
        if (value === this.currentValue) return;
        this.$nextTick(() => {
          this.resizeTextarea();
        });
        if (this.amount) {
          this.currentValue ? this.currentValue = '' : this.currentValue = '!';
          this.currentValue = this.stripscript(value);
        } else {
          this.currentValue = value;
        }
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.change', this.currentValue);
        }
      }
    },

    created() {
      this.$on('inputSelect', this.inputSelect);
    },

    mounted() {
      this.resizeTextarea();
    }
  };
</script>
