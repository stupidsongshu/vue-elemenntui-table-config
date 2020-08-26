<script>
// https://juejin.im/post/6844904029542154248
export default {
  functional: true,
  name: 'TableColumn',
  props: {
    columnData: {
      type: Object,
      required: true
    }
  },
  render (h, context) {
    console.log(h, context)
    const { columnData } = context.props
    // console.log(columnData)
    return (
      <el-table-column {...{ attrs: columnData.attrs }}>
        {
          (columnData.attrs.children && columnData.attrs.children.length > 0)
          ?
          columnData.attrs.children.map((item) => (<table-column column-data={item}></table-column>))
          :
          columnData.render ? columnData.render : columnData.attrs.prop
        }
      </el-table-column>
    )
  }
}
</script>
