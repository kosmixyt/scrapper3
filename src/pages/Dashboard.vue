<template>
    <section class="dashboard">
        <h1>Dashboard</h1>
        <p>Bienvenue sur votre espace personnel !</p>

        <div class="sessions-container">
            <div class="sessions-header">
                <h2>Vos sessions</h2>
                <button @click="createNewSession" class="btn create-btn">
                    <i class="fas fa-plus"></i> Nouvelle session
                </button>
            </div>

            <div v-if="loading" class="sessions-loading">
                <div class="spinner"></div>
                <span>Chargement des sessions...</span>
            </div>

            <div v-else-if="sessions.length === 0" class="no-sessions">
                <i class="fas fa-info-circle"></i>
                <p>Aucune session active. Créez une nouvelle session pour commencer.</p>
            </div>

            <transition-group name="session-list" tag="ul" class="sessions-list">
                <li v-for="session in sessions" :key="session" class="session-item">
                    <div class="session-info">
                        <i class="fas fa-key"></i>
                        <span class="session-id" @click="copyToClipboard(session)" title="Cliquez pour copier">{{
                            session }}</span>
                    </div>
                    <div class="session-actions">
                        <button @click="openDownloadModal(session)" class="btn download-btn"
                            title="Télécharger un fichier">
                            <i class="fas fa-download"></i>
                        </button>
                        <button @click="deleteSession(session)" class="btn delete-btn" title="Supprimer la session">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </li>
            </transition-group>
        </div>

        <!-- Modal de téléchargement de fichier -->
        <div v-if="downloadModal.show" class="modal-overlay" @click.self="closeDownloadModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Télécharger un fichier</h3>
                    <button @click="closeDownloadModal" class="btn close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="fileUrl">URL du fichier :</label>
                        <input type="url" id="fileUrl" v-model="downloadModal.fileUrl"
                            placeholder="https://exemple.com/fichier.pdf" class="form-control" />
                    </div>
                    <p class="session-info-text">
                        Session sélectionnée: <code>{{ downloadModal.sessionId }}</code>
                    </p>
                </div>
                <div class="modal-footer">
                    <button @click="closeDownloadModal" class="btn cancel-btn">Annuler</button>
                    <button @click="downloadFile" class="btn download-confirm-btn" :disabled="!isValidUrl">
                        <i class="fas fa-download"></i> Télécharger
                    </button>
                </div>
            </div>
        </div>

        <div v-if="notification" class="notification" :class="notification.type">
            {{ notification.message }}
        </div>
    </section>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { app_url } from '../main'

const router = useRouter()
const sessions = ref<string[]>([])
const loading = ref(true)
const notification = ref<{ message: string, type: string } | null>(null)

// État du modal de téléchargement
const downloadModal = ref({
    show: false,
    sessionId: '',
    fileUrl: ''
})

// Validation de l'URL
const isValidUrl = computed(() => {
    try {
        const url = new URL(downloadModal.value.fileUrl);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (e) {
        return false;
    }
})

const openDownloadModal = (sessionId: string) => {
    downloadModal.value = {
        show: true,
        sessionId: sessionId,
        fileUrl: ''
    };
}

const closeDownloadModal = () => {
    downloadModal.value.show = false;
}

const downloadFile = () => {
    if (!isValidUrl.value) {
        showNotification('URL invalide', 'error');
        return;
    }

    // Créer l'URL avec les paramètres de requête
    const downloadUrl = `${app_url}/browser/download?url=${encodeURIComponent(downloadModal.value.fileUrl)}&session_id=${downloadModal.value.sessionId}`;

    // Ouvrir l'URL dans un nouvel onglet/fenêtre pour déclencher le téléchargement
    window.open(downloadUrl, '_blank');

    // Fermer le modal et afficher une notification
    closeDownloadModal();
    showNotification('Téléchargement lancé', 'success');
}

const showNotification = (message: string, type: 'success' | 'error') => {
    notification.value = { message, type }
    setTimeout(() => {
        notification.value = null
    }, 3000)
}

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text)
        showNotification('ID de session copié dans le presse-papiers', 'success')
    } catch (err) {
        console.error('Erreur lors de la copie dans le presse-papiers:', err)
        showNotification('Impossible de copier l\'ID de session', 'error')
    }
}

const fetchSessions = async () => {
    try {
        loading.value = true
        const response = await fetch(app_url + '/session/list', {
            credentials: 'include'
        })

        if (response.ok) {
            sessions.value = await response.json()
        } else if (response.status === 401) {
            document.location.href = app_url + "/auth/signin"
        } else {
            showNotification('Erreur lors du chargement des sessions', 'error')
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des sessions: ', error)
        showNotification('Impossible de charger les sessions', 'error')
    } finally {
        loading.value = false
    }
}

const createNewSession = async () => {
    try {
        const response = await fetch(app_url + '/session/create', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        })

        if (response.ok) {
            showNotification('Nouvelle session créée avec succès', 'success')
            fetchSessions()
        } else {
            showNotification('Erreur lors de la création de la session', 'error')
        }
    } catch (error) {
        console.error('Erreur lors de la création de la session: ', error)
        showNotification('Impossible de créer une nouvelle session', 'error')
    }
}

const deleteSession = async (sessionId: string) => {
    try {
        const response = await fetch(app_url + '/session/delete', {
            method: 'DELETE',
            credentials: 'include',
        })

        if (response.ok) {
            showNotification('Session supprimée avec succès', 'success')
            fetchSessions()
        } else {
            showNotification('Erreur lors de la suppression de la session', 'error')
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de la session: ', error)
        showNotification('Impossible de supprimer la session', 'error')
    }
}

const checkAuthentication = async () => {
    try {
        const response = await fetch(app_url + '/users/profile', {
            credentials: 'include'
        })

        if (!response.ok) {
            document.location.href = app_url + "/auth/signin"
        } else {
            // Si l'authentification réussit, charger les sessions
            await fetchSessions()
        }
    } catch (error) {
        console.error('Erreur lors de la vérification d authentification: ', error)
        document.location.href = app_url + "/auth/signin"
    }
}

// Vérifier l'authentification avant l'affichage du composant
onBeforeMount(checkAuthentication)
</script>

<style scoped>
.dashboard {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: #e0e0e0;
}

h1 {
    font-size: 2.5rem;
    color: #81c784;
    margin: 0.5rem 1rem;
    text-align: center;
}

p {
    color: #b0bec5;
    text-align: center;
    margin-bottom: 1rem;
}

.sessions-container {
    width: calc(100% - 40px);
    /* Pour tenir compte du padding sur les côtés */
    max-width: 900px;
    background-color: #1e1e1e;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    padding: 2rem;
    margin: 1rem auto;
    flex: 1;
    overflow: auto;
    box-sizing: border-box;
}

.sessions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #333;
    padding-bottom: 1rem;
}

.sessions-header h2 {
    font-size: 1.5rem;
    color: #81c784;
    margin: 0;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.create-btn {
    background-color: #2e7d32;
    color: white;
}

.create-btn:hover {
    background-color: #388e3c;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.delete-btn {
    background-color: transparent;
    color: #ef5350;
    padding: 0.4rem;
    border-radius: 50%;
}

.delete-btn:hover {
    background-color: rgba(239, 83, 80, 0.2);
}

.sessions-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.session-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 0.8rem;
    background-color: #2d2d2d;
    transition: all 0.2s ease;
    box-sizing: border-box;
    width: 100%;
}

.session-item:hover {
    background-color: #333333;
    transform: translateX(5px);
}

.session-info {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    overflow: hidden;
    /* Pour éviter débordement de text */
    text-overflow: ellipsis;
    flex: 1;
}

.session-id {
    font-family: monospace;
    font-size: 0.9rem;
    color: #b0bec5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.2s ease;
}

.session-id:hover {
    color: #64b5f6;
    text-decoration: underline;
}

.sessions-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    gap: 1rem;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(129, 199, 132, 0.1);
    border-radius: 50%;
    border-top-color: #81c784;
    animation: spin 1s ease-in-out infinite;
}

.no-sessions {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    color: #9e9e9e;
    text-align: center;
}

.no-sessions i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #444;
}

.notification {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.notification.success {
    background-color: #2e7d32;
}

.notification.error {
    background-color: #c62828;
}

/* Animations */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes slideIn {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}

.session-list-enter-active,
.session-list-leave-active {
    transition: all 0.3s;
}

.session-list-enter-from,
.session-list-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

/* Styles pour les boutons d'action de session */
.session-actions {
    display: flex;
    gap: 8px;
}

.download-btn {
    background-color: transparent;
    color: #64b5f6;
    padding: 0.4rem;
    border-radius: 50%;
}

.download-btn:hover {
    background-color: rgba(100, 181, 246, 0.2);
}

/* Styles pour le modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #2d2d2d;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    animation: modalFadeIn 0.3s ease;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #444;
}

.modal-header h3 {
    margin: 0;
    color: #81c784;
}

.close-btn {
    background: transparent;
    color: #b0bec5;
    padding: 0.3rem;
    border-radius: 50%;
    transition: all 0.2s;
}

.close-btn:hover {
    background-color: rgba(176, 190, 197, 0.1);
    color: #e0e0e0;
}

.modal-body {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #b0bec5;
}

.form-control {
    width: 100%;
    padding: 0.8rem;
    background-color: #3d3d3d;
    border: 1px solid #444;
    border-radius: 8px;
    color: #e0e0e0;
    font-family: inherit;
    transition: border-color 0.2s;
}

.form-control:focus {
    outline: none;
    border-color: #64b5f6;
}

.session-info-text {
    margin-top: 1rem;
    color: #9e9e9e;
    font-size: 0.9rem;
}

.session-info-text code {
    background-color: #3d3d3d;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
}

.modal-footer {
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    border-top: 1px solid #444;
}

.cancel-btn {
    background-color: transparent;
    color: #b0bec5;
    border: 1px solid #444;
}

.cancel-btn:hover {
    background-color: rgba(176, 190, 197, 0.1);
}

.download-confirm-btn {
    background-color: #1976d2;
    color: white;
}

.download-confirm-btn:hover:not(:disabled) {
    background-color: #1e88e5;
}

.download-confirm-btn:disabled {
    background-color: #444;
    color: #9e9e9e;
    cursor: not-allowed;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
