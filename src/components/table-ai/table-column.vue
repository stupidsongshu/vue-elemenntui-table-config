<script>
// https://juejin.im/post/6844904029542154248
export default {
  functional: true,
  name: 'TableColumn',
  props: {
    /**
     * 数据结构
     * {
     *    attrs: {
     *      label: string,
     *      prop: string,
     *      width?: number,
     *      height?: number,
     *      fixed?: boolean,
     *      sortable?: boolean,
     *    },
     *    render()?: any,
     * }
     */
    columnData: {
      type: Object,
      required: true
    }
  },
  render (h, context) {
    // console.log(h, context)
    const { columnData } = context.props
    // console.log(columnData)
    return (
      <el-table-column {...{ attrs: columnData.attrs }} key={columnData.attrs.prop}>
        {
          (columnData.attrs.children && columnData.attrs.children.length > 0)
          ?
          columnData.attrs.children.map((item) => (<table-column column-data={item}></table-column>))
          :
          columnData._render ? columnData._render : columnData.attrs.prop
        }
      </el-table-column>
    )
  }
}
</script>
