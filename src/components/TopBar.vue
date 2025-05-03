<template>
    <nav class="topbar">
        <div class="logo">Infinite Scrapper</div>
        <div class="links">
            <router-link to="/">Accueil</router-link>
            <!-- Ajoutez d'autres liens ici -->
            <template v-if="loading">
                <span>...</span>
            </template>
            <template v-else>
                <button v-if="!isAuthenticated" class="auth-btn" @click="goToLogin">Se connecter</button>
                <template v-else>
                    <router-link to="/profile" class="nav-link">Mon Profil</router-link>
                    <button class="auth-btn" @click="goToDashboard">Dashboard</button>
                    <button class="auth-btn" @click="goToBrowserRequests">Browser Requests</button>
                    <button class="auth-btn logout-btn" @click="logout">
                        <i class="fas fa-sign-out-alt"></i> Déconnexion
                    </button>
                </template>
            </template>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { app_url } from '../main'

const isAuthenticated = ref(false)
const loading = ref(true)
const router = useRouter()

const checkAuth = async () => {
    try {
        const res = await fetch(app_url + '/users/profile', { credentials: 'include' })
        isAuthenticated.value = res.ok
    } catch {
        isAuthenticated.value = false
    } finally {
        loading.value = false
    }
}

const goToLogin = () => {
    document.location.href = (app_url + '/auth/signin')
}

const goToDashboard = () => {
    router.push('/dashboard')
}

const goToBrowserRequests = () => {
    router.push('/browser-requests')
}

const logout = async () => {

    document.location.href = (app_url + '/auth/signout')
}

onMounted(checkAuth)
</script>

<style scoped>
.topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background: linear-gradient(90deg, #646cff 0%, #42b883 100%);
    color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
    width: 100%;
    box-sizing: border-box;
}

.logo {
    font-weight: bold;
    font-size: 1.5rem;
    letter-spacing: 1px;
}

.links {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

a {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    display: inline-flex;
    align-items: center;
    height: 36px;
}

a.router-link-exact-active {
    border-bottom: 2px solid #fff;
}

a:hover {
    color: #d1d1ff;
}

.auth-btn {
    padding: 0.5em 1.2em;
    border-radius: 20px;
    border: none;
    background: #fff;
    color: #42b883;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.auth-btn:hover {
    background: #42b883;
    color: #fff;
}

.nav-link {
    padding: 0.5em 1.2em;
    color: #fff;
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    transition: color 0.2s;
    height: 36px;
}

.nav-link:hover {
    color: #d1d1ff;
}

.logout-btn {
    background-color: transparent;
    border: 2px solid #ef5350;
    color: #ef5350;
}

.logout-btn:hover {
    background-color: rgba(239, 83, 80, 0.15);
    color: #ef5350;
}

/* Ajout d'une marge pour séparer le bouton de déconnexion des autres */
.logout-btn {
    margin-left: 12px;
}

/* Support des icônes Font Awesome */
.logout-btn i {
    margin-right: 5px;
}
</style>
