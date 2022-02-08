// Imports
import Vue from 'vue'
import Router from 'vue-router'
import MapView from '../components/MapView'
import Gallery from '../components/Gallery'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash }
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes: [
    { path: '/', component: MapView },
    { name:"Gallery",path: '/gallery', component: Gallery, props:true }
  ],
})

router.beforeEach(async (to, from, next) => {
    //check if user is logged in
    // if not, redirect to login page.
  return next();
  return to.path.endsWith('/') ? next() : next(trailingSlash(to.path))
})

export default router
