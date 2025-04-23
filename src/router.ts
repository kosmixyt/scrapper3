import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './pages/LandingPage.vue'
import Profile from './pages/Profile.vue'
import Dashboard from './pages/Dashboard.vue'
import BrowserRequests from './pages/BrowserRequests.vue'

const routes = [
    { path: '/', name: 'Landing', component: LandingPage },
    { path: '/profile', name: 'Profile', component: Profile },
    { path: "/dashboard", name: "Dashboard", component: Dashboard },
    { path: "/browser-requests", name: "BrowserRequests", component: BrowserRequests }

    // Ajoutez d'autres routes ici si besoin
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
