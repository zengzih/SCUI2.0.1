<template>
    <el-select v-model="value" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
    </el-select>
</template>

<script>
    export default {
        data() {
            return {
                options: [
                    {
                        value: 1,
                        label: 'BBB'
                    }, 
                    {
                        value: 0,
                        label: 'AAA'
                    },
                    {
                        value: 2,
                        label: 'CCC'
                    }, {
                        value: 3,
                        label: 'DDD'
                    }, {
                        value: 4,
                        label: 'EEE'
                    }, {
                        value: 5,
                        label: 'FFF'
                    }],
                value: ''
            }
        }
    }
</script>