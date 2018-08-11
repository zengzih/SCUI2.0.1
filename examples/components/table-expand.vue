<template>
  <div>
    <sc-table-expand
      :data="tableData"
      :props="defaultProps"
      :columns="column"
      :height="tableHeight"
      trHeight="0"
      :row-class-name="rowColor"
      ref="table"
    >
    </sc-table-expand>
  </div>
</template>

<script>
  export default {
    data() {
      var _this = this;
      return {
        tableData: [],
        defaultProps:{
          disableKey:'disabled',
          titleKey:'prdNameAbb',
          childKey:'settlements',
          parentProp: 'prdNameAbb',
          nodeKey:'id',
          checkKey:'checked'
        },
        column: [
          {
            colName: '',
            align: 'center',
            prop: 'index',
            minWidth: '50',
            headAlign: 'center',
            renderTitle: function(row, index) {
              if(!row.prdNameAbb){
                return '';
              }
              return '<span><b>'+row.prdNameAbb+'</b></span>'
            },
            render: function(row, index) {
              if(!row.index){
                return '';
              }
              return '<span>'+row.index+'</span>'
            }
          },
          {
            colName: '市场',
            align: 'center',
            prop: 'marketName',
            minWidth: '80',
            headAlign: 'center',
            render(row, index) {
              return '<span>' + row[this.prop] + '</span>';
            },
            renderTitle: function(row, index) {
              if(row.prdNameAbb){
                return '';
              }
              return '<span><b>'+row.prdNameAbb+'</b></span>'
            },
          },
          {
            colName: '业务类型',
            align: 'center',
            prop: 'bizTypeName',
            headAlign: 'center',
            minWidth: '300',
            render(row, index) {
              return '<span>' + ((row.bizTypeName).split('_')[0]) + '</span>_<span style="color: blue">' + ((row.bizTypeName).split('_')[1]) + '</span>';
            },
            popover: function (row, index) {
              if (row.isTransfer == '否') {
                return true;
              } else {
                return false;
              }
            },
            renderPopover(row, index) {
              return '<span>Test-Hover</span>'
            }
          },
          {
            colName: '证券代码',
            align: 'center',
            prop: 'secCode',
            headAlign: 'center',
            minWidth: '80',
            render(row, index) {
              return '<span>' + row[this.prop] + '</span>';
            },
          },

          {
            colName: '确认状态',
            align: 'center',
            prop: 'confirmTypeName',
            headAlign: 'center',
            minWidth: '100',
            render(row, index) { //子表格显示的数据
              return '<span style="color:red">' + row.confirmTypeName ? row.confirmTypeName : '' + '</span>';
            },
            renderHover(row, index) {
              return '<span>Test-Hover</span>'
            }
          },
          {
            colName: '合同状态',
            align: 'center',
            prop: 'settlementStateName',
            minWidth: '100',
            headAlign: 'center',
            render(row, index) {
              return '<span>' + row[this.prop] ? row[this.prop] : '' + '</span>';
            },
            renderPopover(row, index) {
              return '<span>Test-Hover</span>'
            }
          },
          {
            colName: '结算金额',
            align: 'center',
            prop: 'settlementAmount',
            headAlign: 'center',
            minWidth: '300',
            render(row, index) {
              return '<span style="color:red">' + row[this.prop] + '</span>';
            },
          },
          {
            colName: '已有指令',
            align: 'center',
            headAlign: 'center',
            prop: 'isTransfer',
            minWidth: '120',
            render(row, index) {
              return '<span>' + row[this.prop] + '</span>';
            },
          },

          {
            colName: '成交编号',
            align: 'center',
            prop: 'dealNo',
            headAlign: 'center',
            minWidth: '140',
            render(row, index) {
              return '<span>' + row[this.prop] + '</span>';
            },
            renderHover(row, index) {
              return '<span>Test-Hover</span>'
            }
          },
          {
            colName: '成交金额',
            align: 'center',
            prop: 'dealAmount',
            headAlign: 'center',
            minWidth: '100',
            render(row, index) {
              return '<span>' + row[this.prop] + '</span>';
            },
            renderPopover(row, index) {
              return '<span>Test-Hover</span>'
            }
          },
          {
            colName: '对手方',
            align: 'center',
            prop: 'tradeRival',
            headAlign: 'center',
            minWidth: '400',
            render(row, index) {
              return '<span>' + row[this.prop] + '</span>';
            },
          },

          {
            colName: '撤单',
            align: 'center',
            prop: 'isCancel',
            headAlign: 'center',
            minWidth: '80',
            render(row, index) {
              return '<span>' + row[this.prop] + '</span>';
            },
            renderHover(row, index) {
              return '<span>Test-Hover</span>'
            }
          },
          {
            colName: '交收文件',
            align: 'center',
            prop: 'hasFile',
            headAlign: 'center',
            minWidth: '80',
            render(row, index) {
              return '<span>' + row[this.prop] + '</span>';
            },
            renderPopover(row, index) {
              return '<span>Test-Hover</span>'
            }
          },
          {
            colName: '成功交收时间',
            align: 'center',
            headAlign: 'center',
            prop: 'successTime',
            minWidth: '110',
            render(row, index) {
              return '<span>' + row[this.prop] ? row[this.prop] : '' + '</span>';
            },
          },
          {
            colName: '操作',
            align: 'center',
            minWidth: '100',
            headAlign: 'center',
            type: 'render',
            vRender: function (h, params) {
              return h('div', [
                h('ElTooltip', {
                  props: {
                    content: '修改',
                    placement: 'left',
                    effect: 'light'
                  }
                }, [
                    h('ElButton', {
                      props: {
                        type: "text",
                        size: "small"
                      },
                      on: {

                      }
                    }, [
                        h('i', {
                          class: 'el-icon-edit'
                        })
                      ])
                  ]),
                h('ElTooltip', {
                  props: {
                    content: '查看',
                    placement: 'left',
                    effect: 'light'
                  }
                }, [
                    h('ElButton', {
                      props: {
                        type: "text",
                        size: "small"
                      },
                      on: {

                      }
                    }, [
                        h('i', {
                          class: 'el-icon-document'
                        })
                      ])
                  ]),

                h('ElTooltip', {
                  props: {
                    content: '删除',
                    placement: 'left',
                    effect: 'light'
                  }
                }, [
                    h('ElButton', {
                      props: {
                        type: "text",
                        size: "small"
                      },
                      on: {
                        click: function() {
                          debugger;
                          console.log(params);
                        }    
                      }
                    }, [
                        h('i', {
                          class: 'el-icon-delete'
                        })
                      ])
                  ]),
              ])
            }
          },
        ],
        tableHeight: ''
        /*columns: [
                                        {
                                          head: '市场',
                                          headAlign: 'center',
                                          renderTitle: function(row, index) {
                                              if(!row.prdNameAbb){
                                                  return '';
                                              }
                                            return '<span><b>'+row.prdNameAbb+'</b></span>'
                                          },
                                          render: function(row, index) {
                                              if(!row.marketName){
                                                  return '';
                                              }
                                              return '<span>'+row.marketName+'</span>'
                                           },
                                          field: 'marketName',
                                          minWidth: '50px',
                                        },
                                        {
                                          head:'业务类型',
                                          headAlign: 'center',
                                          field: 'bizTypeName',
                                          renderPopover: function(row, index) {

                                              var str = '<p style="font-size:14px;"><b>划款指令相关信息：</b></p>';
                                                  str +='<div style="margin-top: 10px;" >';
                                                  str += '<p style="font-size:14px;" class="p_popover">';
                                                  str += '<span class="popover-span1">划款类型:'+ !row.transferType ? '': row.transferType+'</span><span class="popover-span2">划款金额:'+(!row.transferAmount ?'': row.transferAmount)+'</span><br>';
                                                  str += '<span class="popover-span3">收款人:'+ !row.payeeAcctName ?'':row.payeeAcctName+' </span><br>';
                                                  str += '<span class="popover-span4">开户行:'+ !row.payeeAcctBankName ?'':row.payeeAcctBankName+'</span><br>';
                                                  str += '<span class="popover-span5">收款帐号:'+!row.payeeAcctNo? '':row.payeeAcctNo +'</span></p></div>';
                                                  return str;
                                            },
                                          popover: function(row, index) {
                                              if(row.isTransfer == '是'){
                                                  return true;
                                              }else{
                                                  return false;
                                              }

                                          },
                                          render: function(row, index) {
                                             if(!row.bizTypeName){
                                              return '';
                                             }
                                              return _this.getCellVal(row.bizTypeName);
                                           },
                                          minWidth: '100px',
                                          align: 'center',
                                          //tooltip: true
                                        },
                                        {
                                          head:'证券代码',
                                          headAlign: 'center',
                                          field: 'secCode',
                                          render: function(row, index) {
                                             if(!row.secCode){
                                              return '';
                                             }
                                             return '<span>'+row.secCode+'</span>'
                                          },
                                          minWidth: '80px',
                                          align: 'left',
                                         // tooltip: true
                                        },
                                        {
                                          head:'确认状态',
                                          headAlign: 'center',
                                          field: 'confirmTypeName',
                                          render: function(row, index) {
                                             if(!row.confirmTypeName){
                                              return '';
                                             }
                                             return '<span>'+row.confirmTypeName+'</span>'
                                          },
                                          minWidth: '100px',
                                          align: 'center',
                                          //tooltip: true
                                        },
                                        {
                                          head:'合同状态',
                                          headAlign: 'center',
                                          field: 'settlementStateName',
                                        render: function(row, index) {
                                             if(!row.settlementStateName){
                                              return '';
                                             }
                                              return '<span>'+row.settlementStateName+'</span>'
                                          },
                                          minWidth: '100px',
                                          align: 'center',
                                         // tooltip: true
                                        },
                                        {
                                          head:'结算金额',
                                          headAlign: 'center',
                                          field: 'settlementAmount',
                                         render: function(row, index) {
                                             if(!row.settlementAmount){
                                              return '';
                                             }
                                         if(_this.judgeBizType(row.bizTypeName)){
                                             return '<span style="color:#000000">'+row.settlementAmount+'</span>';
                                         }else{
                                             return '<span style="color:#FF0000">'+row.settlementAmount+'</span>';
                                         }
                                          },
                                          minWidth: '110px',
                                          align: 'right',
                                         // tooltip: true
                                        },
                                        {
                                          head:'已有指令',
                                          headAlign: 'center',
                                          field: 'isTransfer',
                                          render: function(row, index) {
                                             if(!row.isTransfer){
                                              return '';
                                             }
                                             if(row.isTransfer == '是'){
                                              return '<span style="color:#009900;">'+row.isTransfer+'</span>';
                                             }else if(row.isTransfer == '否'){
                                              return '<span style="color:#FF0000;">'+row.isTransfer+'</span>';
                                             }

                                         },
                                          minWidth: '80px',
                                          align: 'center',
                                          //tooltip: true,
                                        renderPopover: function(row, index) {
                                          var str = '<p style="font-size:14px;"><b>划款指令相关信息：</b></p>';
                                              str +='<div style="margin-top: 10px;" >';
                                              str += '<p style="font-size:14px;" class="p_popover">';
                                              str += '<span class="popover-span1">划款类型:'+(!row.transferType ? '': row.transferType)+'</span><span class="popover-span2">划款金额:'+(!row.transferAmount ?'': row.transferAmount)+'</span><br>';
                                              str += '<span class="popover-span3">收款人:'+(!row.payeeAcctName ?'':row.payeeAcctName)+' </span><br>';
                                              str += '<span class="popover-span4">开户行:'+(!row.payeeAcctBankName ?'':row.payeeAcctBankName)+'</span><br>';
                                              str += '<span class="popover-span5">收款帐号:'+(!row.payeeAcctNo ?'':row.payeeAcctNo)+'</span></p></div>';
                                              return str;
                                        },
                                      popover: function(row, index) {
                                          if(row.isTransfer == '是'){
                                              return true;
                                          }else{
                                              return false;
                                          }

                                      },
                                        },
                                        {
                                          head:'成交编号',
                                          field: 'dealNo',
                                          headAlign: 'center',
                                          render: function(row, index) {
                                              if(!row.dealNo){
                                                  return '';
                                              }
                                              return '<span>'+row.dealNo+'</span>'
                                          },
                                          minWidth: '140px',
                                          align: 'center',
                                        //  tooltip: true
                                        },
                                        {
                                          head:'成交金额',
                                          field: 'dealAmount',
                                          headAlign: 'center',
                                          render: function(row, index) {
                                              if(!row.dealAmount){
                                                  return '';
                                              }
                                              return '<span>'+row.dealAmount+'</span>'
                                          },
                                          minWidth: '110px',
                                          align: 'right',
                                        //  tooltip: true
                                        },
                                        {
                                          head:'对手方',
                                          field: 'tradeRival',
                                          headAlign: 'center',
                                          render: function(row, index) {
                                             if(!row.tradeRival){
                                                 return '';
                                             }
                                             return '<span>'+row.tradeRival+'</span>'
                                          },
                                          align: 'center',
                                          tooltip: true
                                        },
                                        {
                                          head:'撤单',
                                          field: 'isCancel',
                                          headAlign: 'center',
                                          render: function(row, index) {
                                             if(!row.isCancel){
                                                 return '';
                                             }
                                             if(row.isCancel == '是'){
                                             return '<span style="color:#FF0000;">'+row.isCancel+'</span>';
                                             }
                                             return '<span>'+row.isCancel+'</span>'
                                          },
                                          minWidth: '50px',
                                          align: 'center',
                                        //  tooltip: true
                                        },
                                        {
                                          head:'交收文件',
                                          field: 'hasFile',
                                          headAlign: 'center',
                                          render: function(row, index) {
                                          if(!row.hasFile){
                                                 return '';
                                             }
                                            return '<span>'+row.hasFile+'</span>'
                                          },
                                          minWidth: '70px',
                                          align: 'center',
                                        //  tooltip: true
                                        },
                                        {
                                          head:'成功交收时间',
                                          field: 'successTime',
                                          headAlign: 'center',
                                          render: function(row, index) {
                                          if(!row.successTime){
                                                 return '';
                                             }
                                           return '<span>'+row.successTime+'</span>'
                                          },
                                          minWidth: '130px',
                                          align: 'center',
                                       //   tooltip: true
                                        }
                                      ],
        attachThead: [
             {
               start: 2,
               end: 4,
               colspan: 3,
               text: '证券信息',
               align: 'center'
             },
             {
               start: 5,
               end: 8,
               colspan: 4,
               text: '交收信息',
               align: 'center'
             },
             {
               start: 9,
               end: 11,
               colspan: 3,
               text: '成交信息',
               align: 'center'
             },
             {
                 start: 12,
                 end: 14,
                 colspan: 3,
                 text: '系统信息',
                 align: 'center'
               }
           ],*/
      }
    },
    created:function(){
      var _this = this;
      var xhr = new XMLHttpRequest();
      xhr.open("get","JsonData/dataExpand.json");
      xhr.send();
      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
          if(xhr.status == 200){
            _this.tableData = JSON.parse(xhr.response).rows;
          }
        }
      };

    },
    updated: function() {
      this.tableHeight = 400;
    },
    methods: {
      getCellVal: function(val) {
        if (val.indexOf('_') != -1) {
          return '<span>'+(val.split('_'))[0]+'</span>_<span style="color:'+this.getCellStyle(val.split('_')[1])+'">'+(val.split('_')[1])+'</span>'
        } else {
          return val;
        }
      },
      getCellStyle: function(val) {
        var vColor = '';
        if(val.indexOf("到期")>-1 || val.indexOf("卖出")>-1){
          val = "1";
        }
        if(val.indexOf("首期")>-1 || val.indexOf("买入")>-1){
          val = "2";
        }
        switch (val) {
          case "1":
            vColor = '#e56600';
            break;
          case "2":
            vColor = '#009900';
            break;
          default:
            vColor = '#000';
            break;
        }
        return vColor;
      },
      getParentCellVal: function(val) {
        return "<b>"+val+"</b>";
      },

      judgeBizType:function(val){
        if(val.indexOf('正回购_首期')>-1 || val.indexOf('逆回购_到期')>-1 || val.indexOf('现券_卖出')>-1 || val.indexOf('债券_卖出')>-1){
          return true;
        }else if(val.indexOf('正回购_到期')>-1 || val.indexOf('逆回购_首期')>-1 || val.indexOf('现券_买入 ')>-1 || val.indexOf('债券_买入')>-1){
          return false;
        }
      },
      rowColor:function(row, index){
        if(row['isCancel'] == "是" ){
          return 'cancel-row';
        }
        else if(row['isTransfer'] == "是"
          || row['settlementStateName'] == "失败" || row['settlementStateName'] == "成功") {
          return '';
        }
        return '';
      },
    },
  };
</script>