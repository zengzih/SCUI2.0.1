<template>
  <transition-group
    tag="ul"
    :class="[
      'el-upload-list',
      'sc-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled }
    ]"
    name="el-list"
  >
    <li
      v-for="(file, index) in files"
      :class="['el-upload-list__item', 'is-' + file.status]"
      :key="index"
    >
      <img
        class="el-upload-list__item-thumbnail"
        v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
        :src="file.url" alt=""
      >
      <a class="el-upload-list__item-name" @click="handleClick(file)">
        <i class="el-icon-document"></i>{{file.name}}
      </a>
      <!--<label class="el-upload-list__item-status-label">
        <i :class="{
          'el-icon-upload-success': true,
          'el-icon-circle-check': listType === 'text',
          'el-icon-check': ['picture-card', 'picture'].indexOf(listType) > -1
        }"></i>
      </label>-->
      <span  v-if="file.status === 'success'" class='sc-upload-del' @click="$emit('remove', file)">删除</span>
      <!--<i class="el-icon-close" v-if="!disabled" @click="$emit('remove', file)"></i>-->
      <el-progress
        v-if="file.status === 'uploading'"
        :type="listType === 'picture-card' ? 'circle' : 'line'"
        :stroke-width="listType === 'picture-card' ? 6 : 2"
        :percentage="parsePercentage(file.percentage)">
      </el-progress>
      <span class="el-upload-list__item-actions" v-if="listType === 'picture-card'">
        <span
          class="el-upload-list__item-preview"
          v-if="handlePreview && listType === 'picture-card'"
          @click="handlePreview(file)"
        >
          <i class="el-icon-view"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="$emit('remove', file)"
        >
          <i class="el-icon-delete2"></i>
        </span>
      </span>
    </li>
  </transition-group>
</template>
<script>
  import Locale from 'element-ui/src/mixins/locale';
  import ElProgress from 'element-ui/packages/progress';

  export default {
    mixins: [Locale],

    components: { ElProgress },

    props: {
      files: {
        type: Array,
        default() {
          return [];
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      handlePreview: Function,
      listType: String
    },
    methods: {
      parsePercentage(val) {
        return parseInt(val, 10);
      },
      handleClick(file) {
        this.handlePreview && this.handlePreview(file);
      }
    }
  };
</script>

<style scope>
  .sc-upload-list .el-upload-list__item.is-success .el-upload-list__item-name {
    width: calc(100% - 40px);
    float: left;
    margin-right: 0;
    box-sizing: border-box;
  }
  .sc-upload-list .el-upload-list__item {
    overflow: hidden;
  }
  .sc-upload-list .el-upload-list__item.is-success .sc-upload-del {
    width: 40px;
    float: left;
    text-align: center;
  }
</style>