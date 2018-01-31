import Vue from 'vue'
import App from './App'
import router from '../js/router/index'

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    template: '<App />'
})