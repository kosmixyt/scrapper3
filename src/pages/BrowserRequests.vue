<template>
    <div class="browser-requests">

        <div v-if="!isAuthenticated" class="not-authenticated">
            <h2>Authentication Required</h2>
            <p>Please log in to use this feature.</p>
            <router-link to="/" class="login-btn">Go to Login</router-link>
        </div>

        <div v-else class="request-container">
            <!-- Left column - Request parameters -->
            <div class="request-params">
                <h2>Make a GET Request</h2>

                <div class="form-group">
                    <label for="url">URL:</label>
                    <input type="text" id="url" v-model="url" placeholder="https://example.com" :disabled="isLoading" />
                </div>

                <div class="form-group">
                    <label for="session_id">Session ID (optional):</label>
                    <input type="text" id="session_id" v-model="session_id" placeholder="Leave empty for new session"
                        :disabled="isLoading" />
                </div>

                <div class="form-group">
                    <label for="ai_extractor">AI Extractor (optional):</label>
                    <input type="text" id="ai_extractor" v-model="aiExtractor"
                        placeholder="Optional extraction parameters" :disabled="isLoading" />
                </div>

                <!-- Cookies section -->
                <div class="cookies-section">
                    <h3>Cookies</h3>
                    <div class="cookies-controls">
                        <button @click="addCookie" :disabled="isLoading" class="add-cookie-btn">Add Cookie</button>
                    </div>

                    <div class="cookies-list">
                        <div v-for="(cookie, index) in cookies" :key="index" class="cookie-item">
                            <div class="cookie-header">
                                <span class="cookie-title">Cookie #{{ index + 1 }}</span>
                                <button @click="removeCookie(index)" :disabled="isLoading" class="remove-btn">×</button>
                            </div>

                            <div class="cookie-params">
                                <div class="cookie-param">
                                    <label>Name:</label>
                                    <input type="text" v-model="cookie.name" :disabled="isLoading"
                                        placeholder="Cookie name" />
                                </div>
                                <div class="cookie-param">
                                    <label>Value:</label>
                                    <input type="text" v-model="cookie.value" :disabled="isLoading"
                                        placeholder="Cookie value" />
                                </div>
                            </div>
                        </div>
                        <div v-if="cookies.length === 0" class="no-cookies">
                            <p>No cookies added yet. Cookies will be set before the page loads.</p>
                        </div>
                    </div>
                </div>

                <!-- Actions section -->
                <div class="actions-section">
                    <h3>Browser Actions</h3>
                    <div class="actions-controls">
                        <select v-model="newActionType" :disabled="isLoading">
                            <option value="">Select action type</option>
                            <option value="reload">Reload Page</option>
                            <option value="wait">Wait</option>
                            <option value="click">Click Element</option>
                            <option value="waitForSelector">Wait for Element</option>
                            <option value="type">Type Text</option>
                            <option value="evaluate">Evaluate JavaScript</option>
                        </select>
                        <button @click="addAction" :disabled="!newActionType || isLoading" class="add-action-btn">Add
                            Action</button>
                    </div>

                    <div class="actions-list">
                        <div v-for="(action, index) in actions" :key="index" class="action-item">
                            <div class="action-header">
                                <span class="action-type">{{ action.type }}</span>
                                <div class="action-controls">
                                    <button @click="moveActionUp(index)" :disabled="index === 0 || isLoading"
                                        class="move-btn">↑</button>
                                    <button @click="moveActionDown(index)"
                                        :disabled="index === actions.length - 1 || isLoading"
                                        class="move-btn">↓</button>
                                    <button @click="removeAction(index)" :disabled="isLoading"
                                        class="remove-btn">×</button>
                                </div>
                            </div>

                            <div class="action-params">
                                <!-- Wait action params -->
                                <div v-if="action.type === 'wait'">
                                    <label>Time (ms):</label>
                                    <input type="number" v-model="action.time" :disabled="isLoading" min="100" />
                                </div>

                                <!-- Click or waitForSelector params -->
                                <div v-if="action.type === 'click' || action.type === 'waitForSelector'">
                                    <label>Selector:</label>
                                    <input type="text" v-model="action.selector" :disabled="isLoading"
                                        placeholder="CSS selector (e.g. #submit-button)" />
                                </div>

                                <!-- Type action params -->
                                <div v-if="action.type === 'type'">
                                    <label>Selector:</label>
                                    <input type="text" v-model="action.selector" :disabled="isLoading"
                                        placeholder="CSS selector (e.g. #input-field)" />
                                    <label>Text:</label>
                                    <input type="text" v-model="action.text" :disabled="isLoading"
                                        placeholder="Text to type" />
                                </div>

                                <!-- Evaluate action params -->
                                <div v-if="action.type === 'evaluate'">
                                    <label>JavaScript:</label>
                                    <textarea v-model="action.function" :disabled="isLoading"
                                        placeholder="JavaScript function to execute"></textarea>
                                </div>
                            </div>
                        </div>
                        <div v-if="actions.length === 0" class="no-actions">
                            <p>No actions added yet. Actions will be executed in order after the page loads.</p>
                        </div>
                    </div>
                </div>

                <button @click="copyRequestJson" :disabled="isLoading" class="send-request-btn"
                    style="background-color:#1976d2;margin-bottom:8px;">
                    Copier JSON de la requête
                </button>

                <button @click="makeRequest" :disabled="isLoading" class="send-request-btn">
                    {{ isLoading ? 'Loading...' : 'Send Request' }}
                </button>

                <!-- Nouveau bouton pour téléchargement proxy -->
                <button @click="downloadViaProxy" :disabled="isLoading || !url || !session_id" class="send-request-btn"
                    style="background-color:#388e3c;margin-top:8px;">
                    Télécharger via Proxy
                </button>

                <div v-if="error" class="error">
                    {{ error }}
                </div>
            </div>

            <!-- Right column - Response display -->
            <div class="response-display">
                <div v-if="isLoading" class="loader-container">
                    <div class="loader"></div>
                    <p>Processing request...</p>
                </div>

                <div v-else-if="response" class="response">
                    <h3>Response:</h3>
                    <div v-if="screenshotUrl" class="screenshot-button-container">
                        <button @click="showScreenshot" class="screenshot-btn">View Screenshot</button>
                    </div>
                    <pre>{{ response }}</pre>
                </div>

                <div v-else class="no-response">
                    <p>No response yet. Submit a request to see results here.</p>
                </div>
            </div>
        </div>

        <!-- Screenshot Modal -->
        <div v-if="showModal" class="modal-overlay" @click="hideScreenshot">
            <div class="modal-content" @click.stop>
                <button class="modal-close" @click="hideScreenshot">&times;</button>
                <h3>Screenshot</h3>
                <div class="screenshot-container">
                    <img :src="screenshotUrl" alt="Page Screenshot" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { app_url } from '../main';

export default {
    name: 'BrowserRequests',
    data() {
        return {
            isAuthenticated: true, // Assuming user is authenticated as topbar handles this
            url: '',
            session_id: '',
            aiExtractor: '', // Updated property for AI extractor
            isLoading: false,
            error: null,
            response: null,
            screenshotUrl: null,
            showModal: false,
            // New data for actions
            actions: [],
            newActionType: '',
            // New data for cookies
            cookies: []
        }
    },
    methods: {
        async makeRequest() {
            if (!this.url) {
                this.error = 'URL is required';
                return;
            }

            this.isLoading = true;
            this.error = null;
            this.response = null;
            this.screenshotUrl = null;

            try {
                const requestBody = {
                    url: this.url,
                    session_id: this.session_id || '',
                    actions: this.actions,
                    cookies: this.cookies
                };

                if (this.aiExtractor) {
                    requestBody.ai_extractor = this.aiExtractor; // Include AI extractor only if not empty
                }

                const response = await fetch(app_url + '/browser/get', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 401) {
                        document.location.href = app_url + "/auth/signin";
                    }
                    throw new Error(errorData.message || 'Request failed');
                }

                const data = await response.json();
                this.response = JSON.stringify(data, null, 2);

                // Extract screenshot URL if available
                if (data && data.screenshot) {
                    this.screenshotUrl = app_url + data.screenshot;
                }
            } catch (error) {
                this.error = error.message || 'An unexpected error occurred';
            } finally {
                this.isLoading = false;
            }
        },
        showScreenshot() {
            this.showModal = true;
        },
        hideScreenshot() {
            this.showModal = false;
        },
        // New action-related methods
        addAction() {
            if (!this.newActionType) return;

            let newAction = { type: this.newActionType };

            // Add necessary properties based on action type
            switch (this.newActionType) {
                case 'wait':
                    newAction.time = 1000;
                    break;
                case 'click':
                case 'waitForSelector':
                    newAction.selector = '';
                    break;
                case 'type':
                    newAction.selector = '';
                    newAction.text = '';
                    break;
                case 'evaluate':
                    newAction.function = '() => { /* Your code here */ }';
                    break;
            }

            this.actions.push(newAction);
            this.newActionType = '';
        },
        removeAction(index) {
            this.actions.splice(index, 1);
        },
        moveActionUp(index) {
            if (index === 0) return;
            const actionToMove = this.actions.splice(index, 1)[0];
            this.actions.splice(index - 1, 0, actionToMove);
        },
        moveActionDown(index) {
            if (index === this.actions.length - 1) return;
            const actionToMove = this.actions.splice(index, 1)[0];
            this.actions.splice(index + 1, 0, actionToMove);
        },
        // New cookie-related methods
        addCookie() {
            this.cookies.push({ name: '', value: '' });
        },
        removeCookie(index) {
            this.cookies.splice(index, 1);
        },
        copyRequestJson() {
            const req = {
                url: this.url,
                session_id: this.session_id || '',
                actions: this.actions,
                cookies: this.cookies
            };
            if (this.aiExtractor) {
                req.ai_extractor = this.aiExtractor; // Include in the copied JSON only if not empty
            }
            navigator.clipboard.writeText(JSON.stringify(req, null, 2))
                .then(() => {
                    alert('Requête JSON copiée dans le presse-papier');
                })
                .catch(() => {
                    alert('Erreur lors de la copie');
                });
        },
        async downloadViaProxy() {
            if (!this.url || !this.session_id) {
                this.error = "URL et Session ID requis pour le téléchargement proxy";
                return;
            }
            this.isLoading = true;
            this.error = null;
            try {
                // Utilise POST pour éviter les limites d'URL et pour la cohérence
                const resp = await fetch(app_url + '/browser/download', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        url: this.url,
                        session_id: this.session_id
                    })
                });
                if (!resp.ok) {
                    const err = await resp.json();
                    throw new Error(err.message || "Erreur lors du téléchargement proxy");
                }
                // Récupère le nom de fichier depuis l'en-tête
                const disposition = resp.headers.get('Content-Disposition');
                let filename = "downloaded_file";
                if (disposition && disposition.includes('filename=')) {
                    filename = disposition.split('filename=')[1].replace(/['"]/g, '');
                }
                // Télécharge le fichier
                const blob = await resp.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }, 100);
            } catch (e) {
                this.error = e.message || "Erreur lors du téléchargement proxy";
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>

<style scoped>
.browser-requests {
    height: 100%;
    width: 100%;
    margin: 0;
    margin-top: 10px;
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: #e0e0e0;
}

h1,
h2,
h3 {
    color: #81c784;
}

.request-container {
    display: flex;
    gap: 20px;
    padding: 0 20px 20px 20px;
    flex: 1;
    overflow: hidden;
}

.request-params {
    flex: 1;
    padding: 20px;
    background-color: #1e1e1e;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    max-height: 100%;
    box-sizing: border-box;
}

.response-display {
    flex: 1;
    padding: 20px;
    background-color: #1e1e1e;
    border-radius: 8px;
    position: relative;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    max-height: 100%;
    box-sizing: border-box;
}

.form-group {
    margin-bottom: 15px;
    width: 100%;
    box-sizing: border-box;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 8px;
    border: 1px solid #444;
    border-radius: 4px;
    background-color: #2d2d2d;
    color: #e0e0e0;
    box-sizing: border-box;
}

button {
    background-color: #2e7d32;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:disabled {
    background-color: #1b5e20;
    opacity: 0.6;
    cursor: not-allowed;
}

.error {
    color: #ef5350;
    margin-top: 10px;
}

.response {
    padding: 15px;
    background-color: #2d2d2d;
    border-radius: 4px;
    border: 1px solid #444;
    height: calc(100% - 30px);
    display: flex;
    flex-direction: column;
}

.response pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    flex: 1;
    overflow-y: auto;
    margin: 0;
    color: #a5d6a7;
}

.not-authenticated {
    text-align: center;
    padding: 20px;
}

.login-btn {
    display: inline-block;
    background-color: #2e7d32;
    color: white;
    padding: 10px 15px;
    text-decoration: none;
    border-radius: 4px;
    margin-top: 10px;
}

.loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 200px;
}

.loader {
    border: 5px solid #333;
    border-radius: 50%;
    border-top: 5px solid #81c784;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
}

.no-response {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 200px;
    color: #9e9e9e;
    font-style: italic;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.screenshot-button-container {
    margin-bottom: 10px;
}

.screenshot-btn {
    background-color: #1976d2;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
}

.screenshot-btn:hover {
    background-color: #1565c0;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background-color: #2d2d2d;
    border-radius: 8px;
    max-width: 90%;
    max-height: 90%;
    padding: 20px;
    position: relative;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
}

.modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: #e0e0e0;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.screenshot-container {
    overflow: auto;
    margin-top: 10px;
    max-height: 80vh;
}

.screenshot-container img {
    width: 100%;
    height: auto;
    display: block;
}

/* New styles for actions section */
.actions-section {
    margin: 20px 0;
    border: 1px solid #444;
    border-radius: 8px;
    padding: 15px;
    background-color: #252525;
}

.actions-controls {
    display: flex;
    margin-bottom: 15px;
    gap: 10px;
}

.actions-controls select {
    flex: 1;
    padding: 8px;
    border-radius: 4px;
    background-color: #2d2d2d;
    color: #e0e0e0;
    border: 1px solid #444;
}

.add-action-btn {
    background-color: #1976d2;
    padding: 8px 12px;
}

.actions-list {
    max-height: 300px;
    overflow-y: auto;
}

.action-item {
    background-color: #1e1e1e;
    border: 1px solid #444;
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 10px;
}

.action-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.action-type {
    font-weight: bold;
    color: #81c784;
}

.action-controls {
    display: flex;
    gap: 5px;
}

.move-btn {
    background-color: #333;
    color: white;
    width: 30px;
    height: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.remove-btn {
    background-color: #c62828;
    color: white;
    width: 30px;
    height: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-params {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.action-params label {
    margin-bottom: 3px;
    font-size: 0.9em;
}

.action-params input,
.action-params textarea {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    background-color: #2d2d2d;
    color: #e0e0e0;
    border: 1px solid #444;
}

.action-params textarea {
    min-height: 80px;
    font-family: monospace;
}

.no-actions {
    color: #9e9e9e;
    font-style: italic;
    text-align: center;
    padding: 20px 0;
}

.send-request-btn {
    margin-top: 20px;
    width: 100%;
}

/* New styles for cookies section */
.cookies-section {
    margin: 20px 0;
    border: 1px solid #444;
    border-radius: 8px;
    padding: 15px;
    background-color: #252525;
}

.cookies-controls {
    display: flex;
    margin-bottom: 15px;
    gap: 10px;
}

.add-cookie-btn {
    background-color: #1976d2;
    padding: 8px 12px;
}

.cookies-list {
    max-height: 300px;
    overflow-y: auto;
}

.cookie-item {
    background-color: #1e1e1e;
    border: 1px solid #444;
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 10px;
}

.cookie-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.cookie-title {
    font-weight: bold;
    color: #81c784;
}

.cookie-params {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.cookie-param label {
    margin-bottom: 3px;
    font-size: 0.9em;
}

.cookie-param input {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    background-color: #2d2d2d;
    color: #e0e0e0;
    border: 1px solid #444;
}

.no-cookies {
    color: #9e9e9e;
    font-style: italic;
    text-align: center;
    padding: 20px 0;
}

/* Checkbox styling */
.checkbox-group {
    display: flex;
    align-items: center;
}

.checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    width: auto;
    margin-right: 10px;
    cursor: pointer;
}

/* Mobile responsiveness for actions and cookies */
@media (max-width: 768px) {
    .request-container {
        flex-direction: column;
        overflow-y: auto;
    }

    .request-params,
    .response-display {
        max-height: none;
    }

    .modal-content {
        width: 95%;
        max-height: 80%;
    }

    .actions-controls,
    .cookies-controls {
        flex-direction: column;
    }
}
</style>
