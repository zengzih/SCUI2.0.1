<template>
    <div>
        <el-tree :data="data" show-checkbox node-key="id" :props="defaultProps">
        </el-tree>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data() {
            return {
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    disabled: 'disabled'
                }
            };
        },
        created() {
            axios('../../JsonData/tree.json').then((res) => {
                console.log(res);
                this.data = res.data;
            })
        }
    };
</script>
<!-- 
<template>
    <div>
        <el-tree :data="data3" show-checkbox node-key="id">
        </el-tree>
    </div>
</template>
<script>
     export default {
            data() {
                return {
                    data3: [{
                        id: 1,
                        label: '一级 2',
                        children: [{
                            id: 3,
                            label: '二级 2-1',
                            children: [{
                                id: 4,
                                label: '三级 3-1-1'
                            }, {
                                id: 5,
                                label: '三级 3-1-2',
                                disabled: true
                            }]
                        }, {
                            id: 2,
                            label: '二级 2-2',
                            disabled: true,
                            children: [{
                                id: 6,
                                label: '三级 3-2-1'
                            }, {
                                id: 7,
                                label: '三级 3-2-2',
                                disabled: true
                            }]
                        }]
                    }],
                    defaultProps: {
                        children: 'children',
                        label: 'label'
                    }
                };
            }
        };
</script> -->