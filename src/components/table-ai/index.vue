<script>
import TableColumn from './table-column'
import Pagination from './Pagination'
import './drawer.css'

export default {
  name: 'TableAi',
  components: { TableColumn, Pagination },
  props: {
    /**
     * @description 表名，应保证全局唯一
     */
    table: {
      type: Object,
      default: () => ({
        name: '', // 表名，应保证全局唯一
        pagination: true, // 是否需要显示分页
        currentPage: 1, // 分页，当前页
        total: 0, // 分页，总条数
        customColumns: true, // 是否需要开启自定义列
      })
    },
    /**
     * @description 字段值列表
     * [
     *   {
     *      attrs: { label: string, prop: string, width?: number, fixed?: boolean | string, ... },
     *      render: () => any
     *   }
     * ]
     */
    columns: {
      type: Array,
      default: () => ([])
    },
    /**
     * @description 源数据
     */
    data: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      selectedColumns: [],
      selectedColumnProps: [],
      drawerVisible: false,
      checkAll: false,
      isIndeterminate: false,
    }
  },
  computed: {
    checkboxColumns () {
      return this.columns.filter(column => column.attrs).map(column => column.attrs)
    },
  },
  mounted () {
    this.initColumns()
  },
  methods: {
    initColumns () {
      let selectedColumns = []
      if (this.table.name && this.columns && Array.isArray(this.columns) && this.columns.length) {
        let cachedColumns = window.localStorage.getItem(this.table.name)
        console.log(1, cachedColumns)
        try {
          console.log(2)
          const columns = this.columns.filter(column => column.attrs)
          if (cachedColumns) {
            console.log(3)
            cachedColumns = JSON.parse(cachedColumns) || []
            cachedColumns.forEach(cachedColumn => {
              for (const column of columns) {
                if (column.attrs.prop === cachedColumn) {
                  selectedColumns.push(column)
                  break
                }
              }
            })
          } else {
            selectedColumns = columns
            console.log(4)
          }
        } catch (error) {
          console.error('parse columns error:', error)
        }
      }

      this.updateColumns(selectedColumns)
    },
    updateColumns (selectedColumns) {
      console.log('updateselectedColumns:', this.table.name, selectedColumns)
      if (this.table.name && selectedColumns && Array.isArray(selectedColumns)) {
        this.selectedColumns = selectedColumns
        // 更新 checkbox
        this.selectedColumnProps = selectedColumns.filter(column => column.attrs).map(column => column.attrs.prop)
        this.checkAll = this.selectedColumnProps.length === this.checkboxColumns.length
        this.isIndeterminate = this.selectedColumnProps.length > 0 && this.selectedColumnProps.length < this.checkboxColumns.length
        // 更新缓存
        const handledColumns = selectedColumns.filter(column => column.attrs && column.attrs.prop).map(column => column.attrs.prop)
        window.localStorage.setItem(this.table.name, JSON.stringify(handledColumns))
      }
    },
    handleCheckAllChange (val) {
      // console.log('handleCheckAllChange:', val)
      const selectedColumns = val ? this.columns.filter(column => column.attrs) : []
      this.updateColumns(selectedColumns)
    },
    handleCheckboxChange (val, prop) {
      // console.log('handleCheckboxChange', val, prop)
      if (val) {
        this.selectedColumnProps.push(prop)
      } else {
        const index = this.selectedColumnProps.findIndex(item => item === prop)
        if (index !== -1) {
          this.selectedColumnProps.splice(index, 1)
        }
      }

      const selectedColumns = []
      this.selectedColumnProps.forEach(prop => {
        for (const column of this.columns) {
          if (prop === column.attrs.prop) {
            selectedColumns.push(column)
          }
        }
      })
      this.updateColumns(selectedColumns)

      // this.doLayout()
    },
    // doLayout () {
    //   this.$nextTick(() => {
    //     this.$refs.tableRef.doLayout()
    //   })
    // },
    /** TODO 优化：
     * 点击勾选框时实时展示预览效果
     * 点击确定按钮后更新数据
     * 点击取消按钮会还原数据
     */
    // handleDrawerCancel () {
    //   this.drawerVisible = false
    //   // TODO reset
    // },
    // handleDrawerConfirm () {
    //   // this.$refs.drawer.closeDrawer()
    //   this.drawerVisible = false
    //   // this.updateColumns(this.selectedColumns)
    // },
  },
  render () {
    // console.log('render:', this.selectedColumns)
    return (
      <div class="table-ai-wrapper">
        <el-table ref="tableRef" data={this.data} fit border stripe highlight-current-row>
          {
            this.selectedColumns.map((column) => (
              <table-column column-data={column}></table-column>
            ))
          }
        </el-table>

        <pagination
          currentPage={this.table.currentPage}
          total={this.table.total}
          on-reloadResult={(e) => this.$emit('reloadResult', e)}
        />

        <el-button class="btn-custom-column" type="primary" circle size="mini" icon="el-icon-setting" on-click={() => this.drawerVisible = true}></el-button>

        <el-drawer
          ref="drawer"
          visible={this.drawerVisible}
          title="自定义字段（选中顺序会影响展示顺序，切换全选可重置顺序）"
          with-header={true}
          modal={true}
          size="25%"
          direction="btt"
          custom-class="drawer-wrapper"
          wrapperClosable={false}
          on-close={() => this.drawerVisible = false}>
          <div class="drawer__content">
            <div class="drawer__form">
              <el-checkbox
                indeterminate={this.isIndeterminate}
                v-model={this.checkAll}
                on-change={this.handleCheckAllChange}>
                全选
              </el-checkbox>
              <el-checkbox-group value={this.selectedColumnProps}>
                {
                  this.checkboxColumns.map((column) => (
                    <el-checkbox
                      key={column.prop}
                      label={column.prop}
                      on-change={(e) => this.handleCheckboxChange(e, column.prop)}>
                      {column.label}
                    </el-checkbox>
                  ))
                }
              </el-checkbox-group>
            </div>
            {/*<div class="drawer__footer">
              <el-button on-click={this.handleDrawerCancel}>取 消</el-button>
              <el-button type="primary" onClick={this.handleDrawerConfirm}>确 定</el-button>
            </div>*/}
          </div>
        </el-drawer>
      </div>
    )
  }
}
</script>
