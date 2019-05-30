import Vue from 'vue'
import Router from 'vue-router'
import LangtonAnt from '@/page/langtonAnt/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LangtonAnt',
      component: LangtonAnt
    }
  ]
})
