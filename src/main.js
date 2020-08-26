import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

import Action from './components/action.vue'

Vue.config.productionTip = false

Vue.use(ElementUI, {
  size: 'mini'
})

Vue.component('Action', Action)

new Vue({
  render: h => h(App),
}).$mount('#app')
