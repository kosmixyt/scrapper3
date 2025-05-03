<template>
    <div class="profile-page">
        <div class="profile-container">
            <!-- Entête avec tabs -->
            <div class="profile-header">
                <h1>Votre Espace Personnel</h1>
                <div class="tabs">
                    <button class="tab-button" :class="{ 'active': activeTab === 'profile' }"
                        @click="activeTab = 'profile'">
                        <i class="fas fa-user"></i> Profil
                    </button>
                    <button class="tab-button" :class="{ 'active': activeTab === 'tokens' }"
                        @click="activeTab = 'tokens'">
                        <i class="fas fa-key"></i> Tokens API
                    </button>
                </div>
            </div>

            <!-- Section de profil -->
            <div v-if="activeTab === 'profile'" class="tab-content profile-section">
                <div class="card profile-card">
                    <div v-if="loading" class="loader-container">
                        <div class="loader"></div>
                        <p>Chargement de votre profil...</p>
                    </div>

                    <div v-else-if="error" class="error-container">
                        <div class="error-icon">!</div>
                        <p>{{ error }}</p>
                        <button @click="loadProfile" class="action-button retry-btn">
                            <i class="fas fa-sync"></i> Réessayer
                        </button>
                    </div>

                    <form v-else @submit.prevent="updateProfile" class="profile-form">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <div class="input-wrapper">
                                <i class="fas fa-envelope input-icon"></i>
                                <input type="email" id="email" v-model="profileData.email" required />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="name">Nom</label>
                            <div class="input-wrapper">
                                <i class="fas fa-user input-icon"></i>
                                <input type="text" id="name" v-model="profileData.name" required />
                            </div>
                        </div>
                        
                        <!-- Nouveaux champs pour les clés API -->
                        <div class="api-keys-section">
                            <h3><i class="fas fa-key"></i> Clés API</h3>
                            
                            <div class="form-group">
                                <label for="deepseek-api">Clé API DeepSeek</label>
                                <div class="input-wrapper">
                                    <i class="fas fa-robot input-icon"></i>
                                    <input 
                                        type="password" 
                                        id="deepseek-api" 
                                        v-model="profileData.DeepSeekApiKey" 
                                        placeholder="Clé API DeepSeek" 
                                        autocomplete="off"
                                    />
                                    <button type="button" class="toggle-password-btn" @click="togglePasswordVisibility('deepseek-api')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                                <p class="input-hint">Utilisée pour accéder aux services DeepSeek</p>
                            </div>
                            
                            <div class="form-group">
                                <label for="chatgpt-api">Clé API ChatGPT</label>
                                <div class="input-wrapper">
                                    <i class="fas fa-comment-dots input-icon"></i>
                                    <input 
                                        type="password" 
                                        id="chatgpt-api" 
                                        v-model="profileData.ChatgptApiKey" 
                                        placeholder="Clé API ChatGPT" 
                                        autocomplete="off"
                                    />
                                    <button type="button" class="toggle-password-btn" @click="togglePasswordVisibility('chatgpt-api')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                                <p class="input-hint">Utilisée pour accéder aux services ChatGPT</p>
                            </div>
                            
                            <!-- Bouton de sauvegarde spécifique pour les clés API -->
                            <button type="button" class="action-button save-api-btn" @click="updateProfile">
                                <i class="fas fa-save"></i> Sauvegarder les clés API
                            </button>
                        </div>

                        <div class="account-details" v-if="profileData.createdAt">
                            <div class="detail">
                                <span class="detail-label">Membre depuis</span>
                                <span class="detail-value">{{ formatDate(profileData.createdAt) }}</span>
                            </div>
                            <div class="detail" v-if="profileData.updatedAt">
                                <span class="detail-label">Dernière mise à jour</span>
                                <span class="detail-value">{{ formatDate(profileData.updatedAt) }}</span>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="action-button primary" :disabled="updating">
                                <i class="fas fa-save"></i> {{ updating ? 'Mise à jour en cours...' : 'Mettre à jour' }}
                            </button>
                        </div>

                        <transition name="fade">
                            <div v-if="updateSuccess" class="success-message">
                                <i class="fas fa-check-circle"></i> Profil mis à jour avec succès !
                            </div>
                        </transition>

                        <transition name="fade">
                            <div v-if="updateError" class="error-message">
                                <i class="fas fa-exclamation-circle"></i> {{ updateError }}
                            </div>
                        </transition>
                    </form>
                </div>
            </div>

            <!-- Section des tokens API -->
            <div v-if="activeTab === 'tokens'" class="tab-content tokens-section">
                <div class="card tokens-card">
                    <h2><i class="fas fa-key"></i> Vos Tokens d'API</h2>

                    <div v-if="loadingTokens" class="loader-container">
                        <div class="loader"></div>
                        <p>Chargement des tokens...</p>
                    </div>

                    <div v-else-if="tokenError" class="error-container">
                        <div class="error-icon">!</div>
                        <p>{{ tokenError }}</p>
                        <button @click="loadTokens" class="action-button retry-btn">
                            <i class="fas fa-sync"></i> Réessayer
                        </button>
                    </div>

                    <div v-else>
                        <!-- Nouveau token généré -->
                        <transition name="slide-fade">
                            <div v-if="newToken" class="new-token-container">
                                <div class="alert-header">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    <span>Votre token d'authentification - Copiez-le maintenant, il ne sera plus visible
                                        ensuite.</span>
                                </div>
                                <div class="token-display">
                                    <div class="token-label">Auth Token:</div>
                                    <div class="token-code">
                                        <code>{{ newToken.token }}</code>
                                        <button @click="copyToken" class="icon-button copy-btn" title="Copier le token">
                                            <i class="fas fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="token-info">
                                    <span class="token-name">{{ newToken.name }}</span>
                                    <span class="token-expiry" v-if="newToken.expiresAt">
                                        Expire le {{ formatDate(newToken.expiresAt) }}
                                    </span>
                                </div>
                                <div class="token-usage-hint">
                                    <i class="fas fa-info-circle"></i>
                                    Utilisez ce token en l'incluant dans l'en-tête "Authorization: Bearer [votre-token]"
                                </div>
                                <div class="hide-token-btn-container">
                                    <button @click="hideNewToken" class="action-button" style="margin-top:12px;">
                                        <i class="fas fa-eye-slash"></i> Masquer ce token
                                    </button>
                                </div>
                            </div>
                        </transition>

                        <!-- Liste des tokens existants -->
                        <div class="tokens-list-container">
                            <h3>Tokens Actifs</h3>
                            <div v-if="tokens.length === 0" class="empty-state">
                                <i class="fas fa-key empty-icon"></i>
                                <p>Vous n'avez pas encore créé de tokens API</p>
                                <p class="hint">Les tokens API permettent d'accéder à votre compte via des applications
                                    externes</p>
                            </div>

                            <transition-group name="list" tag="div" class="tokens-list">
                                <div v-for="token in tokens" :key="token.id" class="token-item">
                                    <div class="token-details">
                                        <div class="token-name">
                                            <i class="fas fa-key"></i> {{ token.name }}
                                        </div>
                                        <div class="token-meta">
                                            <span class="meta-item">
                                                <i class="fas fa-calendar-plus"></i> Créé le {{
                                                    formatDate(token.createdAt) }}
                                            </span>
                                            <span class="meta-item" v-if="token.expiresAt">
                                                <i class="fas fa-calendar-times"></i> Expire le {{
                                                    formatDate(token.expiresAt) }}
                                            </span>
                                            <span class="meta-item status"
                                                v-if="token.expiresAt && isExpired(token.expiresAt)">
                                                <i class="fas fa-exclamation-circle"></i> Expiré
                                            </span>
                                            <span class="meta-item status active" v-else>
                                                <i class="fas fa-check-circle"></i> Actif
                                            </span>
                                        </div>
                                    </div>
                                    <button @click="deleteToken(token.id)" class="icon-button delete-btn"
                                        title="Supprimer ce token">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </transition-group>
                        </div>

                        <!-- Formulaire de création de token -->
                        <div class="create-token-container">
                            <h3>Créer un Nouveau Token</h3>
                            <div class="create-token-form">
                                <div class="form-group">
                                    <label for="token-name">Nom du token</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-tag input-icon"></i>
                                        <input type="text" id="token-name" v-model="tokenForm.name"
                                            placeholder="Ex: Application mobile" required />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="token-expires">Validité (jours)</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-hourglass-half input-icon"></i>
                                        <input type="number" id="token-expires" v-model="tokenForm.expiresIn" min="1"
                                            placeholder="Laisser vide pour aucune expiration" />
                                    </div>
                                </div>
                                <div class="form-actions">
                                    <button @click="createToken" :disabled="creatingToken || !tokenForm.name"
                                        class="action-button primary">
                                        <i class="fas fa-plus-circle"></i>
                                        {{ creatingToken ? 'Création en cours...' : 'Créer un token' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { app_url } from '../main'

interface ProfileData {
    id: string;
    email: string;
    name: string;
    DeepSeekApiKey: string | null;
    ChatgptApiKey: string | null;
    createdAt: string;
    updatedAt: string;
}

interface TokenData {
    id: string;
    name: string;
    createdAt: string;
    expiresAt: string | null;
}

interface NewTokenData extends TokenData {
    token: string;
}

// État actif
const activeTab = ref('profile')
const loading = ref(true)
const error = ref<string | null>(null)
const updating = ref(false)
const updateSuccess = ref(false)
const updateError = ref<string | null>(null)

// État des tokens
const loadingTokens = ref(true)
const tokenError = ref<string | null>(null)
const tokens = ref<TokenData[]>([])
const newToken = ref<NewTokenData | null>(null)
const creatingToken = ref(false)
const tokenForm = reactive({
    name: '',
    expiresIn: ''
})

// Données du profil
const profileData = reactive<ProfileData>({
    id: '',
    email: '',
    name: '',
    DeepSeekApiKey: '',
    ChatgptApiKey: '',
    createdAt: '',
    updatedAt: ''
})

// Formatage de date
const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date)
}

// Vérifier si un token est expiré
const isExpired = (dateString: string) => {
    if (!dateString) return false
    return new Date(dateString) < new Date()
}

// Charger les données du profil
const loadProfile = async () => {
    loading.value = true
    error.value = null

    try {
        const response = await fetch(app_url + '/users/profile', {
            credentials: 'include'
        })

        if (!response.ok) {
            if (response.status === 401) {
                document.location.href = app_url + "/auth/signin"
                return
            }
            throw new Error(`Erreur ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        Object.assign(profileData, data)
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    } finally {
        loading.value = false
    }
}

// Mettre à jour le profil
const updateProfile = async () => {
    updating.value = true
    updateSuccess.value = false
    updateError.value = null

    try {
        const response = await fetch(app_url + '/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                name: profileData.name,
                DeepSeekApiKey: profileData.DeepSeekApiKey,
                ChatgptApiKey: profileData.ChatgptApiKey
            })
        })

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`)
        }

        const updatedData = await response.json()
        Object.assign(profileData, updatedData.user)
        updateSuccess.value = true

        setTimeout(() => {
            updateSuccess.value = false
        }, 3000)
    } catch (err) {
        updateError.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    } finally {
        updating.value = false
    }
}

// Charger les tokens
const loadTokens = async () => {
    loadingTokens.value = true
    tokenError.value = null

    try {
        const response = await fetch(app_url + '/users/tokens', {
            credentials: 'include'
        })

        if (!response.ok) {
            if (response.status === 401) {
                document.location.href = app_url + "/auth/signin"
                return
            }
            throw new Error(`Erreur ${response.status}: ${response.statusText}`)
        }

        tokens.value = await response.json()
        newToken.value = null // Effacer l'affichage du nouveau token lors du rafraîchissement
    } catch (err) {
        tokenError.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    } finally {
        loadingTokens.value = false
    }
}

// Créer un nouveau token
const createToken = async () => {
    if (!tokenForm.name) {
        tokenError.value = 'Le nom du token est requis'
        return
    }

    creatingToken.value = true
    tokenError.value = null

    try {
        const response = await fetch(app_url + '/users/tokens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                name: tokenForm.name,
                expiresIn: tokenForm.expiresIn || undefined
            })
        })

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`)
        }

        const created = await response.json()
        tokenForm.name = ''
        tokenForm.expiresIn = ''

        await loadTokens() // Charger la liste AVANT d'afficher le nouveau token
        newToken.value = created // Afficher le nouveau token après le refresh
    } catch (err) {
        tokenError.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    } finally {
        creatingToken.value = false
    }
}

// Supprimer un token
const deleteToken = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce token?')) {
        return
    }

    try {
        const response = await fetch(`${app_url}/users/tokens/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        })

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`)
        }

        loadTokens()
    } catch (err) {
        tokenError.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    }
}

// Copier un token
const copyToken = () => {
    if (newToken.value) {
        navigator.clipboard.writeText(newToken.value.token)
            .then(() => {
                alert('Token copié dans le presse-papier')
            })
            .catch(err => {
                console.error('Erreur de copie:', err)
            })
    }
}

// Masquer le nouveau token
const hideNewToken = () => {
    newToken.value = null
}

// Fonction pour basculer entre le masquage et l'affichage de la clé API
const togglePasswordVisibility = (inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
    
    // Changer aussi l'icône
    const button = input.nextElementSibling as HTMLButtonElement;
    const icon = button.querySelector('i');
    if (icon) {
        if (input.type === 'password') {
            icon.className = 'fas fa-eye';
        } else {
            icon.className = 'fas fa-eye-slash';
        }
    }
}

// Charger les données au montage du composant
onMounted(() => {
    loadProfile()
    loadTokens()
})
</script>

<style scoped>
/* Importation de Font Awesome pour les icônes */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

/* Variables CSS pour la cohérence des couleurs */
:root {
    --primary: #81c784;
    --primary-dark: #519657;
    --primary-light: #b2fab4;
    --secondary: #004d40;
    --background: #121212;
    --card-bg: #1e1e1e;
    --input-bg: #2d2d2d;
    --border: #444;
    --text: #e0e0e0;
    --text-secondary: #aaaaaa;
    --danger: #c62828;
    --danger-light: #ff5f52;
    --success: #2e7d32;
    --warning: #f9a825;
    --info: #0288d1;
}

/* Style global de la page */
.profile-page {
    min-height: 100vh;
    width: 100%;
    background-color: var(--background);
    color: var(--text);
    padding: 20px;
    display: flex;
    justify-content: center;
}

.profile-container {
    width: 100%;
    max-width: 800px;
}

/* En-tête avec tabs */
.profile-header {
    margin-bottom: 30px;
    text-align: center;
}

.profile-header h1 {
    color: var(--primary);
    font-size: 2.2rem;
    margin-bottom: 20px;
    font-weight: 600;
}

.tabs {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 10px;
}

.tab-button {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1rem;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.tab-button:hover {
    color: var(--primary);
    background-color: rgba(129, 199, 132, 0.1);
}

.tab-button.active {
    color: var(--primary);
    background-color: rgba(129, 199, 132, 0.15);
    border-bottom: 2px solid var(--primary);
    font-weight: 600;
}

.tab-button i {
    font-size: 16px;
}

/* Contenu des tabs */
.tab-content {
    animation: fadeIn 0.5s ease;
}

/* Style des cartes */
.card {
    background-color: var(--card-bg);
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    margin-bottom: 25px;
}

/* Chargement et erreurs */
.loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
}

.loader {
    border: 4px solid rgba(129, 199, 132, 0.1);
    border-radius: 50%;
    border-top: 4px solid var(--primary);
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    background-color: rgba(198, 40, 40, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(198, 40, 40, 0.2);
}

.error-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background-color: var(--danger);
    color: white;
    border-radius: 50%;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
}

/* Style du formulaire */
.profile-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

label {
    color: var(--text);
    font-weight: 500;
    font-size: 14px;
    margin-left: 4px;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 12px;
    color: var(--text-secondary);
}

input {
    width: 100%;
    padding: 12px 12px 12px 40px;
    background-color: var(--input-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 16px;
    color: var(--text);
    transition: all 0.3s ease;
}

input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(129, 199, 132, 0.2);
}

input::placeholder {
    color: var(--text-secondary);
    opacity: 0.6;
}

/* Détails du compte */
.account-details {
    background-color: rgba(45, 45, 45, 0.5);
    padding: 15px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.detail-label {
    color: var(--text-secondary);
    font-size: 14px;
}

.detail-value {
    color: var(--text);
    font-size: 14px;
}

/* Boutons */
.form-actions {
    margin-top: 10px;
}

.action-button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-button.primary {
    background-color: var(--primary);
    color: var(--secondary);
}

.action-button.primary:hover:not(:disabled) {
    background-color: var(--primary-dark);
}

.action-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.retry-btn {
    margin-top: 15px;
    background-color: var(--card-bg);
    color: var(--primary);
    border: 1px solid var(--primary);
}

.retry-btn:hover {
    background-color: rgba(129, 199, 132, 0.1);
}

.icon-button {
    width: auto;
    padding: 8px;
    background: none;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease;
}

.delete-btn {
    color: var(--danger-light);
}

.delete-btn:hover {
    background-color: rgba(198, 40, 40, 0.15);
    color: var(--danger);
    transform: scale(1.1);
}

.copy-btn {
    color: var(--primary);
    background-color: rgba(129, 199, 132, 0.1);
}

.copy-btn:hover {
    background-color: rgba(129, 199, 132, 0.2);
    transform: scale(1.1);
}

/* Messages d'état */
.success-message,
.error-message {
    padding: 12px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.success-message {
    background-color: rgba(46, 125, 50, 0.1);
    color: var(--primary);
    border: 1px solid rgba(129, 199, 132, 0.3);
}

.error-message {
    background-color: rgba(198, 40, 40, 0.1);
    color: var(--danger-light);
    border: 1px solid rgba(198, 40, 40, 0.3);
}

/* Section des tokens API */
.tokens-card h2 {
    color: var(--primary);
    font-size: 1.6rem;
    margin-bottom: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.tokens-card h3 {
    color: var(--text);
    font-size: 1.2rem;
    margin: 25px 0 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
}

/* Nouveau token */
.new-token-container {
    background-color: rgba(249, 168, 37, 0.1);
    border: 1px solid var(--warning);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 25px;
}

.alert-header {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--warning);
    font-weight: 500;
    margin-bottom: 15px;
}

.token-display {
    margin-bottom: 15px;
}

.token-label {
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 5px;
}

.token-code {
    background-color: rgba(18, 18, 18, 0.8);
    padding: 12px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    border: 1px solid var(--primary);
}

.token-usage-hint {
    margin-top: 10px;
    font-size: 13px;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: rgba(2, 136, 209, 0.1);
    padding: 8px 12px;
    border-radius: 6px;
}

/* Liste des tokens */
.tokens-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.token-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--input-bg);
    border-radius: 8px;
    padding: 15px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.token-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.token-details {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.token-name {
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
}

.token-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    font-size: 13px;
    color: var(--text-secondary);
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 5px;
}

.meta-item.status {
    color: var(--danger-light);
}

.meta-item.status.active {
    color: var(--primary);
}

/* État vide */
.empty-state {
    text-align: center;
    padding: 30px 20px;
}

.empty-icon {
    font-size: 48px;
    color: var(--border);
    margin-bottom: 15px;
}

.hint {
    font-size: 14px;
    color: var(--text-secondary);
    margin-top: 10px;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
}

/* Formulaire de création de token */
.create-token-container {
    border-top: 1px solid var(--border);
    padding-top: 20px;
}

.create-token-form {
    background-color: rgba(45, 45, 45, 0.5);
    padding: 20px;
    border-radius: 8px;
}

/* Bouton pour masquer le token */
.hide-token-btn-container {
    display: flex;
    justify-content: flex-end;
}

/* Style pour la section des clés API */
.api-keys-section {
    background-color: rgba(45, 45, 45, 0.3);
    padding: 20px;
    border-radius: 8px;
    margin: 15px 0;
    border: 1px solid var(--border);
}

.api-keys-section h3 {
    color: var(--primary);
    font-size: 1.2rem;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.toggle-password-btn {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease;
}

.toggle-password-btn:hover {
    color: var(--primary);
}

.input-hint {
    color: var(--text-secondary);
    font-size: 12px;
    margin-top: 5px;
    margin-left: 4px;
}

/* Ajouter un style pour le bouton de sauvegarde des clés API */
.save-api-btn {
    margin-top: 15px;
    background-color: var(--primary);
    color: var(--secondary);
    font-weight: 600;
}

.save-api-btn:hover:not(:disabled) {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-fade-enter-active {
    transition: all 0.3s ease;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}

.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

/* Adaptations mobiles */
@media (max-width: 600px) {
    .profile-header h1 {
        font-size: 1.8rem;
    }

    .tab-button {
        padding: 8px 12px;
        font-size: 0.9rem;
    }

    .card {
        padding: 15px;
    }

    .token-meta {
        flex-direction: column;
        gap: 5px;
    }
}
</style>
