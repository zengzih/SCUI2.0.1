<template>
    <div>
        <div class="nav_list">
            <el-button v-for="item in data" @click='handlerClick(item)'>{{ item.label }}</el-button>
        </div>
        <div class="content">
            <iframe ref="iframe" :src="src"></iframe>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                data: [],
                src: 'http://192.168.74.36:8080/SCUIDemo/pld_skip.html'
            }
        },
        created() {
            var v_webRoot = 'http://192.168.72.62:8099/scxx-web'
            this.data = [
                { label: '用户管理', src: v_webRoot + '/userController/manager?customer=CJ&username=YWRtaW4=&password=K21IdEViRUUwNyt6K0xDaHFsd2UzUT09' },
                { label: '资金账户信息', src: v_webRoot + '/bankrollAccountMessageController/manager?customer=CJ&username=YWRtaW4=&password=K21IdEViRUUwNyt6K0xDaHFsd2UzUT09' },
                { label: '新股一', src: v_webRoot + '/ipoCalendarController/ipoNewEvent?customer=CJ&username=YWRtaW4=&password=K21IdEViRUUwNyt6K0xDaHFsd2UzUT09' },
                { label: '新股二', src: v_webRoot + '/ipoCalendarController/manager?customer=CJ&username=YWRtaW4=&password=K21IdEViRUUwNyt6K0xDaHFsd2UzUT09' },
                { label: '今日待办', src: v_webRoot + '/ipoTodayController/ipoTodayInner?customer=CJ&username=YWRtaW4=&password=K21IdEViRUUwNyt6K0xDaHFsd2UzUT09' },
                { label: '今日待办-客户', src: v_webRoot + '/ipoTodayController/manager?customer=CJ&username=YWRtaW4=&password=K21IdEViRUUwNyt6K0xDaHFsd2UzUT09' }
            ]
        },
        methods: {
            handlerClick(item) {
                // console.log(this.$refs.iframe);
                var iframe = this.$refs.iframe;
                console.log(iframe.src);
            }
        }
    }
</script>

<style>
    html,
    body,
    #app {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    #app {
        padding: 20px;
        box-sizing: border-box;
    }

    .nav_list {
        width: 10%;
        border: 1px solid #E5E9F2;
        float: left;
        height: 100%;
        box-sizing: border-box;
    }

    .content {
        width: 90%;
        border: 1px solid #E5E9F2;
        height: 100%;
        box-sizing: border-box;
        float: left;
        margin-left: -1px;
    }

    iframe {
        width: 100%;
        height: 100%;
        border: none;
    }

    .el-button {
        margin: 0 !important;
        margin-bottom: 10px;
        display: block;
        width: 120px;
    }
</style>