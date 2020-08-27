<template>
  <div id="app">
    <table-ai
      :table="table"
      :columns="columns"
      :data="data"
      @reloadResult="reloadResult"
    />
  </div>
</template>

<script>
// import Action from './components/action'

export default {
  name: 'App',
  components: {
    // Action
  },
  data () {
    return {
      table: {
        name: 't_sts_gain',
        currentPage: 1,
        total: 500
      },
      columns: Object.freeze([
        {
          attrs: {
            label: '编号',
            prop: 'id',
            width: 80,
            fixed: true
          }
        },
        {
          attrs: {
            label: '姓名',
            prop: 'name',
            align: 'center',
            sortable: true
          }
        },
        {
          attrs: {
            label: '年龄',
            prop: 'age',
            sortable: true
          }
        },
        {
          attrs: {
            label: '性别',
            prop: 'sex',
            width: 80,
            sortable: true
          },
          _render: (scope) => {
            // console.log(scope, this)
            return scope.row.sex === 0 ? '女' : '男'
          }
        },
        {
          attrs: {
            label: '生日',
            prop: 'birth',
            sortable: true,
          },
          _render: (scope) => {
            return scope.row.birth
          }
        },
        {
          attrs: {
            label: '多级嵌套',
            prop: 'fen',
            children: [
              {
                attrs: {
                  label: '第一',
                  prop: 'fen-1',
                  children: [
                    {
                      attrs: {
                        label: 'fen-1-1',
                        prop: 'fen-1-1',
                      },
                      _render: () => {
                        return 'Hello'
                      }
                    },
                    {
                      attrs: {
                        label: 'fen-1-2',
                        prop: 'fen-1-2',
                      },
                      _render: () => {
                        return 'World'
                      }
                    }
                  ]
                }
              },
              {
                attrs: {
                  label: '第二',
                  prop: 'fen-2'
                }
              }
            ]
          },
          // render: () => {
          //   // return <>
          //   //     <el-table-column label="看"></el-table-column>
          //   //     <el-table-column label="云"></el-table-column>
          //   //   </>
          //   return '123456'
          // }
        },
        {
          attrs: {
            label: '操作',
            prop: '__action',
            // fixed: 'right',
          },
          _render: (scope) => {
            return [
              <Action onClick={(e) => this.handleEdit(e)} />,
              <el-button type="danger" onClick={() => this.handleDelete(scope)}>删除</el-button>
            ]
          }
        }
      ]),
      data: Object.freeze([
        {
          id: 1,
          name: 'hello',
          age: 18,
          birth: '2002-2-4',
          sex: 0,
          fen: 1
        },
        {
          id: 2,
          name: 'world',
          age: 28,
          birth: '1992-3-7',
          sex: 1,
        },
        {
          id: 3,
          name: 'html',
          age: 28,
          birth: '1992-2-4',
          sex: 1,
        },
        {
          id: 4,
          name: 'css',
          age: 18,
          birth: '1992-2-4',
          sex: 0,
        }
      ])
    }
  },
  methods: {
    handleEdit (val) {
      console.log(val)
    },
    handleDelete (scope) {
      console.log(scope)
    },
    reloadResult (currentPage = 1) {
      // this.condition.currentPage = currentPage
      // this.setResult()
      console.log('reloadResult:', currentPage)
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
