<template>
    <div>
        <sc-render :data="data">
            <template scope='scope'>
                <span>
                    {{ scope.row.name }} + {{ scope.$index }}
                </span>
            </template>
        </sc-render>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                data: [
                    { name: 'AAAA' },
                    { name: 'BBBB' },
                    { name: 'CCCC' },
                    { name: 'DDDD' }
                ]
            };
        },
        watch: {},
        components: {
            ScRender: {
                name: 'ScRender',
                functional: true,
                props: {
                    data: Array
                },
                render(h, ctx) {
                    return h('ul',
                    //   ctx.props.data.map(function (item, index) {
                    //     return h('li', [
                    //         ctx.data.scopedSlots.default ? ctx.data.scopedSlots.default({
                    //             row: item,
                    //             $index: index
                    //         }) : item.name,
                    //     ], {
                    //         on: {
                    //             click: function () {
                    //                 console.log(111)
                    //                 ctx.parent.handlerClick(item)
                    //             }
                    //         }
                    //     })
                    //   })
                        {
                            scopedSlots: {
                                default: function (props) {
                                    return createElement('span', props.text)
                                }
                            }
                        }
                    )
                }
            }
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            getSlotScope(item, ctx) {
                // console.log(ctx.data.scopedSlots.default); 
            },
            getScope(scope) {
                console.log(scope);
            },
            handlerClick(item) {
                console.log(item);
            }
        }
    };
</script>

<style>
</style>