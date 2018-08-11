<template>
    <el-table :data="tableData" style="width: 100%" highlight-current-row  @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="date" label="日期" min-width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" min-width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址" min-width="300">
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }]
            }
        },
        methods: {
            handleSelectionChange(row) {
                console.log(row);
            }
        }
    }
</script>

<style>
    .el-checkbox {
        line-height: 34px;
    }
</style>