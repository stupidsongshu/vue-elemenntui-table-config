import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

import Action from './components/action.vue'
import TableAi from './components/table-ai'

Vue.config.productionTip = false

Vue.use(ElementUI, {
  size: 'mini'
})

Vue.component('Action', Action)
Vue.component(TableAi.name, TableAi)

new Vue({
  render: h => h(App),
}).$mount('#app')
