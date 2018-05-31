import Vue from 'vue'
import App from './App.vue'

// import Vuex from "vuex"
// Vue.use(Vuex)
// const store=new Vuex.Store({
// 	state: {
// 		randomArr: [],
// 		x: 0,
// 		y: 0
// 	},
// })

new Vue({
    el: '#app',
    // store,
    render: h => h(App)
})