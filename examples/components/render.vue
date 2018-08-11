<template>
  <div>
    <sc-render :data="data">
      <template scope='scope'>
        <span>
          {{ scope.row.name }}
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
          /* return h('ul',
            ctx.props.data.map(function (item) {
              return h('li', item.name)
            })
          )*/
          let _this = ctx.parent;
          return(
            <ul>
              {
                _this._l(ctx.props.data, (item, index) =>
                  <li class={ _this.getSlotScope(item, ctx) }>
                    { 
                      ctx.data.scopedSlots.default ? ctx.data.scopedSlots.default({
                        row: item,
                        $index: index
                      }) : item.name 
                    }
                  </li>
                )
              }
            </ul>
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
      }
    }
  };
</script>

<style>

</style>