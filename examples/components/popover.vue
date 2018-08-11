<template>
    <div>
      <el-popover
        placement="top-start"
        title="标题"
        width="200"
        trigger="hover"
        content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
        <el-button slot="reference">hover 激活</el-button>
      </el-popover>

      <el-popover
        placement="bottom"
        title="标题"
        width="200"
        trigger="click"
        content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
        <el-button slot="reference">click 激活</el-button>
      </el-popover>

      <el-popover
        ref="popover"
        placement="right"
        title="标题"
        width="200"
        trigger="focus"
        content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
      </el-popover>
      <el-button v-popover:popover>focus 激活</el-button>
    </div>

</template>

<script>
    export default {
        data() {
          return {
            msg: '111',
            name: '2222'
          }
        },
        methods: {
        }
    }
</script>