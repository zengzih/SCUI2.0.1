<template>
  <div>
    <!-- <wesc-table :data="data" :column="columns" :height="400" row-key="id"></wesc-table> -->
    <wesc-table :data="data" 
                :height="400" 
                :column="columns" 
                row-key="id"
                highlight-current-row 
                ref="table"
                show-config-table
                :column-config="columnConfig"
                style="width:100%" 
                @sort-change="handlerSort" 
                @row-click="handlerRowClick" 
                @cell-click="handlerCellClick"
                @openconfigtable="openconfigtable"
                ></wesc-table>
    <sc-table-config :config="config" :origin-data="originData" @applyconfig="applyconfig" ref="tableConfig"></sc-table-config>
  </div>
</template>

<script>


  import axios from 'axios';
  import Json from '../../JsonData/InstructionInfoMng.json';
  import tableConfig from '../../JsonData/tableconfig.json';
  import columnAuto from '../../JsonData/columnAuto.json';

  export default {
    data() {
      var _this = this;
      return {
        config: [], // 接口中的列
        originData: [], // 表格的列
        transferTypeList:{
          dvpType : [
            '00088019',//调入DVP账户(中债)
            '00088020',//调入DVP账户(上清所)
            '00088021',//调出DVP账户(中债)
            '00088022',//调出DVP账户(上清所)
          ],
          taType : [
            '00088010',//TA赎回款
            '00088018',//TA轧差款
            '00088055',//TA转出款
            '00088113',//上海中登TA申购款
            '00088114',//上海中登TA赎回款
            '00088115',//上海中登TA轧差款
            '00088116',//上海中登TA转出款
            '00088117',//上海中登TA转入款
            '00088120',//深圳中登TA申购款
            '00088121',//深圳中登TA赎回款
            '00088122',//深圳中登TA轧差款
            '00088123',//深圳中登TA转出款
            '00088124',//深圳中登TA转入款
          ],
          allType : [
            '00088019',//调入DVP账户(中债)
            '00088020',//调入DVP账户(上清所)
            '00088021',//调出DVP账户(中债)
            '00088022',//调出DVP账户(上清所)
            '00088010',//TA赎回款
            '00088018',//TA轧差款
            '00088055',//TA转出款
            '00088113',//上海中登TA申购款
            '00088114',//上海中登TA赎回款
            '00088115',//上海中登TA轧差款
            '00088116',//上海中登TA转出款
            '00088117',//上海中登TA转入款
            '00088120',//深圳中登TA申购款
            '00088121',//深圳中登TA赎回款
            '00088122',//深圳中登TA轧差款
            '00088123',//深圳中登TA转出款
            '00088124',//深圳中登TA转入款
          ],
        },
        columns: [
          {type: 'selection', width: 30, align: 'center', fixed: 'left', prop: 'checkbox'},
          {
            prop: 'transferType',
            label: '划款类型',
            width: 170,
            align: 'center',
            tooltip: true,
            sortable: true,
            render: function (h, params) {
              return _this.getColRender(h, params);
            }
          },
          {prop: 'prdName', label: '基金信息', width: 300, align: 'left', tooltip: true, sortable: true},
          {
            prop: 'payeeAcctName',
            label: '收款人',
            width: 220,
            align: 'left',
            tooltip: true,
            sortable: true,
          },
          {
            prop: 'payeeAcctNo',
            label: '收款人账户',
            width: 220,
            align: 'left',
            tooltip: true,
            sortable: true,
          },
          {prop: 'payeeAcctBankName', label: '收款人开户行', width: 250, align: 'left', tooltip: true, sortable: true},
          {prop: 'payeeLargePayNo', label: '收款人支付系统号', width: 220, align: 'left', tooltip: true, sortable: true},
          {
            prop: 'transferAmount',
            label: '划款金额',
            width: 150,
            align: 'right',
            tooltip: true,
            sortable: true,
            render: function (h, params) {
              return _this.getTransferAmount(h, params)
            }
          },
          {prop: 'currency', label: '币种', width: 150, align: 'center', tooltip: true, sortable: true},
          {prop: 'custom', label: '指令状态', width: 130, align: 'center', tooltip: true, sortable: true},
          {
            prop: 'bankHandleStatus',
            label: '银行处理状态',
            width: 130,
            align: 'center',
            tooltip: true,
            sortable: true,
            render: function (h, params) {
              return _this.getBankHandleRender(h, params);
            }
          },
          {prop: 'settlementStatus', label: '款项交收状态', width: 130, align: 'center', tooltip: true, sortable: true},
          {prop: 'sendWay', label: '发送渠道', width: 130, align: 'center', tooltip: true, sortable: true},
          {
            prop: 'faxSendStatus',
            label: '传真/邮箱状态',
            width: 130,
            align: 'center',
            tooltip: true,
            sortable: true,
            render: function (h, params) {
              return _this.getFaxSendRender(h, params)
            }
          },
          {prop: 'draweeAcctName', label: '付款人', width: 180, align: 'left', tooltip: true, sortable: true},
          {prop: 'draweeAcctNo', label: '付款人账户', width: 180, align: 'left', tooltip: true, sortable: true},

          {prop: 'draweeAcctBankName', label: '付款人开户行', width: 220, align: 'left', tooltip: true, sortable: true},
          {prop: 'draweeLargePayNo', label: '付款人大额支付号', width: 180, align: 'left', tooltip: true, sortable: true},
          {prop: 'instructionNo', label: '指令编号', width: 180, align: 'center', tooltip: true, sortable: true},
          {
            prop: 'transferDate',
            label: '划款日期',
            width: 180,
            align: 'center',
            tooltip: true,
            sortable: true,
            formatter: _this.formatter
          },
          {prop: 'productionTime', label: '生成日期', width: 180, align: 'center', tooltip: true, sortable: true},
          {prop: 'sendTime', label: '发送时间', width: 180, align: 'center', tooltip: true, sortable: true},
          {
            prop: 'bizDateB',
            label: '开始日期',
            width: 180,
            align: 'center',
            tooltip: true,
            sortable: true,
            formatter: _this.formatter
          },
          {
            prop: 'bizDateE',
            label: '截止日期',
            width: 180,
            align: 'center',
            tooltip: true,
            sortable: true,
            formatter: _this.formatter
          },
          {prop: 'orgName', label: '机构名称', width: 180, align: 'left', tooltip: true, sortable: true},
          {prop: 'seatNo', label: '席位信息', width: 180, align: 'left', tooltip: true, sortable: true},

          {prop: 'secCode', label: '证券代码', width: 180, align: 'center', tooltip: true, sortable: true},
          {prop: 'secName', label: '证券名称', width: 180, align: 'left', tooltip: true, sortable: true},
          {prop: 'contactName', label: '联系人', width: 180, align: 'left', tooltip: true, sortable: true},
          {prop: 'contactMobilephone', label: '联系电话', width: 180, align: 'left', tooltip: true, sortable: true},
          {
            prop: 'isManual',
            label: '指令来源',
            width: 180,
            align: 'left',
            tooltip: true,
            sortable: true,
            render: function (h, params) {
              return h('span', {
                domProps: {
                  innerHTML: params.row.isManual === 1 ? '手动' : '自动'
                }
              });
            }
          },
          {prop: 'custom', label: '指令状态', align: 'center', tooltip: true, sortable: true },
          {prop: 'manager', label: '经办人', width: 180, align: 'left', tooltip: true, sortable: true},
          {prop: 'reviewer', label: '复核人', width: 180, align: 'left', tooltip: true, sortable: true},
          {prop: 'approver', label: '审批人', width: 180, align: 'left', tooltip: true, sortable: true, fixed: 'right'}
        ],
        data: [],
        columnConfig: []
      };
    },
    created() {
      for (var i in this.columns) {
        this.columns[i].width = 200;
        this.columns[i].tooltip = true;
      }
      console.log(Json);
      this.data = Json.rows;

      this.config = this.columns;
      
      this.columnConfig = []
      this.getColumnAuto();

      // this.originData = this.columns;
    },
    watch: {
      columns: {
        handler(val) {
          console.log('---------columnsWatch------------')
          console.log(val);
          console.log('---------columnsWatch------------')
        },
        deep: true
      }
    },
    components: {
      simpleTabel: {}
    },
    methods: { // columnAuto
      getColumnAuto() {
        axios.get('../../JsonData/columnAuto.json', {}).then((response) => {
          var columnConfig = [];
          console.log(data);
          var data = response.data.rows;
          data.forEach(function (item) {
            columnConfig.push({
              label: item.label,
              prop: (item.type === 'selection' || item.label == 'checkbox') ? 'checkbox' : item.originId,
              fixed: item.fixed,
              visibleBool: (item.type === 'selection' || item.label == 'checkbox') ? true : item.visibleBool
            });
          });
          console.log(columnConfig);
          this.columnConfig = columnConfig;
        })
      },
      getFaxSendRender: function (h, params) {
        var _this = this;
        if (params.row.sendWayCode == '00163002' || params.row.sendWayCode == '00163005') {
          if (params.row.faxSendStatus != '-') {
            return h('ElPopover', {
              props: {
                isClose: true,
                placement: 'right',
                trigger: 'click'
              }
            }, [
              h('p', {
                style: {
                  fontSize: '12px'
                }
              }, [
                h('b', '传真发送状态')
              ]),
              h('div', {
                style: {
                  marginTop: '10px'
                }
              }),
              h('div', {
                slot: 'reference'
              }, [
                h('span', {
                  'class': _this.findFaxStatus(params.row.faxSendStatusCode),
                  domProps: {
                    innerHTML: params.row.faxSendStatus
                  }
                })
              ])
            ]);
          } else {
            return h('div', [
              h('div', {
                slot: 'reference'
              }, [
                h('span', {
                  style: {
                    color: 'black'
                  },
                  domProps: {
                    innerHTML: params.row.faxSendStatus
                  }
                })
              ])
            ]);
          }
        } else if (params.row.sendWayCode == '00163003' || params.row.sendWayCode == '00163006') {
          if (params.row.emailSendStatus == '发送失败') {
            return h('div', [
              h('div', {
                slot: 'reference'
              }, [
                h('span', {
                  style: {
                    color: 'red'
                  },
                  domProps: {
                    innerHTML: params.row.emailSendStatus
                  }
                })
              ])
            ]);
          } else if (params.row.emailSendStatus == '发送成功') {
            return ('div', [
              h('div', {
                slot: 'reference'
              }, [
                h('span', {
                  style: {
                    color: 'green'
                  },
                  domProps: {
                    innerHTML: params.row.emailSendStatus
                  }
                })
              ])
            ])
          } else {
            h('div', [
              h('span', params.row.emailSendStatus)
            ])
          }
        } else {
          return h('div', [
            h('span', '-')
          ])
        }
      },
      getBankHandleRender: function (h, params) {
        var label = '';
        var vColor = '';
        if (params.row.bankHandleStatusCode == '202' || params.row.bankHandleStatusCode == '202') {
          label = '错误信息';
          vColor = 'blue';
        }
        if (params.row.bankHandleStatusCode == '1') {
          label = '作废原因';
          vColor = 'black';
        }
        if (label) {
          return h('ElPopover', {
            props: {
              placement: 'right',
              trigger: 'hover'
            }
          }, [
            h('div', {
              style: {
                marginTop: '10px'
              }
            }, [
              h('p', {
                style: {
                  fontSize: '12px'
                }
              }, [
                h('span', {
                  'class': {
                    'popover-span3': true
                  },
                  domProps: {
                    innerHTML: label + ':' + params.row.errorMsg
                  }
                })
              ])
            ]),
            h('div', {
              slot: 'reference'
            }, [
              h('span', {
                style: {
                  color: vColor
                },
                domProps: {
                  innerHTML: params.row.bankHandleStatus
                }
              })
            ])
          ]);
        } else {
          return h('div', {
            slot: 'reference'
          }, [
            h('span', {
              style: {
                color: 'black',
                domProps: {
                  innerHTML: params.row.bankHandleStatus
                }
              }
            })
          ])
        }
      },
      getTransferAmount: function (h, params) {
        var vColor = '';
        var _this = this;
        switch (params.row.fcheakup) {
          case 1:
            vColor = '#13ce66';
            break;
          case 2:
            vColor = 'red';
            break;
          default:
            vColor = 'black';
            break;
        }
        return h('div', {
          slot: 'reference'
        }, [
          h('span', {
            domProps: {
              // innerHTML: this.$options.filters['tFormatterValue'](params.row.transferAmount, _this.formats.transferAmount)
            },
            style: {
              color: vColor
            }
          })
        ])
      },
      getColRender: function (h, params) {
        var _this = this;
        var showParam = '';
        var title = '';
        var tableCol = [];
        var tableData = [];
        if (this.checkStatus(params.row, 'OTHER')) {
          return h('div', {
            slot: 'reference'
          }, [
            h('span', {
              style: {
                backgroundColor: 'yellow',
                display: (params.row.verifyAccount == 2 || params.row.verifyAccount == 3) ? 'inline' : 'none'
              },
              domProps: {
                innerHTML: '!'
              }
            }),
            h('span', {
              style: {
                color: 'black'
              },
              domProps: {
                innerHTML: params.row.transferType
              }
            })
          ]);
        }

        if (this.checkStatus(params.row, 'DVP')) {
          showParam = 'DVP';
          title = '成交单信息';
          tableCol = this.dvpTableColumn;
          tableData = this.dealInfo;
        }

        if (this.checkStatus(params.row, 'TA')) {
          showParam = 'TA';
          title = 'TA元数据详情';
          // tableCol = this.taTableColumn;
          // tableData = this.taDataInfo;
        }
        return h('ElPopover', {
            props: {
              isClose: true,
              placement: 'right',
              trigger: 'hover'
            },
            on: {
              show: function () {
                // _this.popoverShow(params.row, showParam)
              }
            }
          }, [
            h('p', {
              style: {
                fontSize: '12px'
              },
              domProps: {
                innerHTML: title
              }
            }),
            h('div', {
              style: {
                marginTop: '10px',
                maxHeight: '400px',
                maxWidth: '600px',
                overFlow: 'auto'
              }
            }),
            h('div', {
              slot: 'reference'
            }, _this.getPopoverSlot(h, params))
          ]
        );
      },
      getPopoverSlot: function (h, params) {
        return [
          h('span', {
            style: {
              backgroundColor: 'yellow',
              display: (params.row.verifyAccount == 2 || params.row.verifyAccount == 3) ? "inline-block" : 'none'
            },
            domProps: {
              innerHTML: '!'
            }
          }),
          h('span', {
            style: {
              color: 'blue'
            },
            domProps: {
              innerHTML: params.row.transferType
            }
          })
        ];
      },
      checkStatus: function (row, type) {  //当前全部
        var _this = this;
        if ("DVP" == type) {
          if (_this.transferTypeList.dvpType.indexOf(row.transferTypeCode) != -1) {
            return true;
          } else {
            return false;
          }
        }
        if ("TA" == type) {
          if (_this.transferTypeList.taType.indexOf(row.transferTypeCode) != -1) {
            return true;
          } else {
            return false;
          }
        }
        if ("OTHER" == type) {
          if (_this.transferTypeList.allType.indexOf(row.transferTypeCode) != -1) {
            return false;
          } else {
            return true;
          }
        }
      },
      handlerRowClick(row, event, column) {
        debugger;
        console.log(arguments);
      },
      handlerCellClick(row, column, cell, event) {
        console.log(arguments);
      },
      handlerSort(val) {
        console.log(val);
      },
      applyconfig(data) {
        const configCol = [];
        data.forEach((item) => {
          configCol.push({
            labl: item.label,
            prop: item.originId,
            fixed: item.fixed,
            visibleBool: item.visibleBool
          });
        });
        this.columnConfig = configCol;
        this.$refs.tableConfig.closeDialog();
        this.$refs.table.doLayout();
        console.log(data);
      },
      openconfigtable() {
        this.$refs.tableConfig.openDialog();
        console.log(this.columns);
        axios.get('../../JsonData/columnConfig.json').then((response) =>{
          var data = response.data.rows;
          console.log(data);
          this.config = data;
          // this.originData = this.columns;
        })
      }
    }
  };
</script>

<style>
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: transparent;
  }

</style>