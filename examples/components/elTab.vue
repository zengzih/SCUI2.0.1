<template>
    <div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-tabs v-model="activeName2" type="border-card" @tab-click="handleClick">
                <el-tab-pane label="用户管理" name="first" v-if="false">用户管理</el-tab-pane>
                <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
                <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="AAAA">定时任务补偿-AAAA</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="BBBB">定时任务补偿-BBBB</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="CCCC">定时任务补偿-CCCC</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="DDDD">定时任务补偿-DDDD</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="EEEE">定时任务补偿-EEEE</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="FFFF">定时任务补偿-FFFF</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="GGGG">定时任务补偿-GGGG</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="HHHH">定时任务补偿-HHHH</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="JJJJ">定时任务补偿-JJJJ</el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
   
</template>
<script>
    export default {
        data() {
            return {
                activeName2: 'first',
                dialogVisible: true
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => { });
            }
        }
    };
</script>