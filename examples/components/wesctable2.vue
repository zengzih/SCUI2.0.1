<template>
    <div>
        <wesc-table :data="data" :column="column" highlight-current-row :row-class-name="tableRowClassName" row-key="date"></wesc-table>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                tableRowClassName: 'rowClassName',
                data: [{
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
                }],
                column: [
                    //{ type: 'selection', width: 80, align: 'center' },
                    { prop: 'date', label: '日期' },
                    { prop: 'name', label: '姓名' },
                    { prop: 'address', label: '地址' },
                ]
            }
        },
        methods: {

        }
    };
</script>