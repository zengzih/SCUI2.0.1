<template>
  <div style="width: 900px;height: 300px;" class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition"> 
     <div class="el-table__header-wrapper">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header">
            <colgroup>
              <col  v-for="col in column" :width="col.width || '300'"/>
            </colgroup>
            <thead>
              <th v-for="col in column">
                <div class="cell">{{ col.label }}</div>
              </th>
            </thead>
        </table>
     </div>

     <div class="el-table__body-wrapper" style="width: 100%;overflow: auto">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" :style="getTableWidth()">
            <colgroup>
              <col  v-for="col in column" :width="col.width || '300'"/>
            </colgroup>
            <tbody>
              <tr v-for="tr in data">
                <td v-for="col in column">
                  <div class="cell">{{ col.label }}</div>
                </td>
              </tr>
            </tbody>
        </table>
     </div>
  </div>
</template>

<script>
  var myChartone = null
  window.onresize = function () {
    myChartone && myChartone.resize()
  }
  export default {
    data () {
      return {
        column: [{ label: 'AAA' }, { label: 'BBB' }, { label: 'CCC' }],
        data: []
      }
    },
    mounted () {
      /*$('.scrollbar').scroll(function () {
        // console.log($(this).scrollTop())
        var sctoph = $(this).scrollTop()
        if (sctoph >= 0) {
          // $('.fixtr').css({'position': 'absolute'})
        } else {
          $('.fixtr').css({'position': 'static'})
        }
      })*/
    },
    methods: {
      getTableWidth() {
        return '900px';
      }
    },
    destroyed () {
    }
  }
</script>

<style scoped>

</style>
