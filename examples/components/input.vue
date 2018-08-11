<template>
    <el-input v-model="input" placeholder="请输入内容"></el-input>
</template>

<script>
    export default {
        data() {
            return {
                input: 'jdbc:oracle:thin:@//192.168.72.31:1521/ORCL'
            }
        }
    }
</script>