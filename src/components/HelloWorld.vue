<script>
import TableColumn from './table-column'
import Pagination from './Pagination'

export default {
  name: 'VueElementTable',
  components: { TableColumn, Pagination },
  props: {
    /**
     * @description 表名，应保证全局唯一
     */
    table: {
      type: Object,
      default: () => ({
        name: '', // 表名，应保证全局唯一
        currentPage: 1, // 分页，当前页
        total: 0 // 分页，总条数
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
      defineColumnVisible: false,
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
    handleCloseDrawer (e) {
      console.log('handleCloseDrawer', e, this.$refs.drawer.closeDrawer)
      // this.$refs.drawer.closeDrawer()
      this.defineColumnVisible = false
    },
    handleBeforeCloseDrawer (done) {
      console.log('handleBeforeCloseDrawer', done)
      done()
    },
  },
  render () {
    // console.log('render:', this.selectedColumns)

    /**
     * 
      <el-table-column
        key={column.id}
        show-overflow-tooltip
        {...{ attrs: { ...column.attrs, sortable: column.attrs.sortable, } }}
        >
        { column.render ? column.render : column.prop }
      </el-table-column>
     */
    return (
      <div>
        <el-button icon="el-icon-setting" on-click={() => this.defineColumnVisible = true}>字段选择</el-button>

        <el-drawer
          style={{'overflow': 'auto'}}
          ref="drawer"
          visible={this.defineColumnVisible}
          title="自定义字段"
          with-header={false}
          direction="btt"
          before-close={(e) => this.handleBeforeCloseDrawer(e)}>
          <div style="padding: 20px;">
            <h4>字段选择</h4>
            <el-checkbox-group value={this.selectedColumnProps}>
              {
                this.checkboxColumns.map((column, index) => (
                  <el-checkbox
                    key={index}
                    label={column.prop}
                    disabled={column.prop === '__action'}
                    on-change={(e) => this.handleCheckboxChange(e, column.prop)}>
                    {column.label}
                  </el-checkbox>
                ))
              }
            </el-checkbox-group>

            <el-button type="info" onClick={(e) => this.handleCloseDrawer(e)}>取消</el-button>
            <el-button type="primary" onClick={() => this.$refs.drawer.closeDrawer()}>确定</el-button>
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
