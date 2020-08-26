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
      console.log(1)
      let selectedColumns = []
      // 初始化
      if (this.table.name && this.columns && Array.isArray(this.columns) && this.columns.length) {
        console.log(2)
        let cachedColumns = window.localStorage.getItem(this.table.name)
        console.log(3, cachedColumns)
        try {
          console.log(4)
          if (cachedColumns) {
            console.log(5)
            cachedColumns = JSON.parse(cachedColumns) || []
            const columns = this.columns.filter(column => column.attrs)
            cachedColumns.forEach(cachedColumn => {
              for (const column of columns) {
                if (column.attrs.prop === cachedColumn) {
                  selectedColumns.push(column)
                  break
                }
              }
            })
            console.log(6)
          } else {
            console.log(7)
            selectedColumns = this.columns
            console.log(8)
          }
        } catch (error) {
          console.error('parse columns error', error)
        }
      } else {
        console.log(9)
        selectedColumns = this.columns
      }

      this.updateColumns(selectedColumns)
    },
    updateColumns (columns) {
      console.log(columns)
      if (this.table.name && columns && Array.isArray(columns) && columns.length) {
        this.selectedColumns = columns
        const handledColumns = columns.filter(column => column.attrs && column.attrs.prop).map(column => column.attrs.prop)
        // 初始化 checkbox
        this.selectedColumnProps = this.selectedColumns.filter(column => column.attrs).map(column => column.attrs.prop)
        // 缓存
        window.localStorage.setItem(this.table.name, JSON.stringify(handledColumns))
      }
    },
    handleCheckboxChange (val, prop) {
      /**
       * TODO 优化交互体验
       * 点击勾选框时实时展示预览效果
       * 点击确定按钮后更新数据
       * 点击取消按钮会还原数据
       */
      // console.log('handleCheckboxChange', val, prop)
      let selectedColumns = []
      if (val) {
        this.selectedColumnProps.push(prop)
      } else {
        const index = this.selectedColumnProps.findIndex(item => item === prop)
        if (index !== -1) {
          this.selectedColumnProps.splice(index, 1)
        }
      }

      this.selectedColumnProps.forEach(prop => {
        for (const column of this.columns) {
          if (prop === column.attrs.prop) {
            selectedColumns.push(column)
          }
        }
      })
      this.updateColumns(selectedColumns)
    },
    // handleCloseDrawer (e) {
    //   this.drawerVisible = false
    // },
  },
  render () {
    // console.log('render:', this.selectedColumns)
    return (
      <div class="table-ai-wrapper">
        <el-button class="btn-custom-column" type="primary" circle size="mini" icon="el-icon-setting" on-click={() => this.drawerVisible = true}></el-button>

        <el-drawer
          ref="drawer"
          visible={this.drawerVisible}
          title="自定义字段（选中顺序会决定展示顺序）"
          with-header={true}
          size="30%"
          direction="btt"
          custom-class="drawer-wrapper"
          wrapperClosable={false}
          on-close={() => this.drawerVisible = false}>
          <div class="drawer__content">
            <div class="drawer__form">
              <el-checkbox-group value={this.selectedColumnProps}>
                {
                  this.checkboxColumns.map((column, index) => (
                    <el-checkbox
                      key={index}
                      label={column.prop}
                      on-change={(e) => this.handleCheckboxChange(e, column.prop)}>
                      {column.label}
                    </el-checkbox>
                  ))
                }
              </el-checkbox-group>
            </div>
            <div class="drawer__footer">
              <el-button on-click={() => this.drawerVisible = false}>取 消</el-button>
              <el-button type="primary" onClick={() => this.$refs.drawer.closeDrawer()}>确定</el-button>
            </div>
          </div>
        </el-drawer>

        <el-table data={this.data} fit border stripe highlight-current-row>
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
      </div>
    )
  }
}
</script>
