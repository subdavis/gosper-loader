import Vue from 'vue'
// Import "App" from your root gosper pug template.
import App from '../containers/simple.gpug'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
