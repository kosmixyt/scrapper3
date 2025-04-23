<template>
    <section class="landing">
        <div class="hero-section">
            <h1>Bienvenue sur MyApp</h1>
            <p class="tagline">Une solution puissante pour la navigation automatisée et l'exploration web</p>
            <button class="cta">Commencer maintenant</button>
        </div>

        <div class="features-section">
            <h2>Fonctionnalités principales</h2>

            <div class="feature-cards">
                <div class="feature-card">
                    <div class="feature-icon">🔍</div>
                    <h3>Browser Requests</h3>
                    <p>Effectuez des requêtes web automatisées avec un navigateur complet et récupérez tous les détails
                        de la réponse.</p>
                    <img src="https://via.placeholder.com/400x250/1e1e1e/81c784?text=Browser+Requests+Demo"
                        alt="Browser Requests Demo" class="feature-img" />
                </div>

                <div class="feature-card">
                    <div class="feature-icon">🔐</div>
                    <h3>Gestion des sessions</h3>
                    <p>Créez et gérez facilement plusieurs sessions de navigation pour organiser votre travail.</p>
                    <img src="https://via.placeholder.com/400x250/1e1e1e/81c784?text=Sessions+Dashboard"
                        alt="Sessions Dashboard" class="feature-img" />
                </div>

                <div class="feature-card">
                    <div class="feature-icon">👤</div>
                    <h3>Profils utilisateurs</h3>
                    <p>Gérez vos informations personnelles et préférences dans un espace sécurisé.</p>
                    <img src="https://via.placeholder.com/400x250/1e1e1e/81c784?text=User+Profile" alt="User Profile"
                        class="feature-img" />
                </div>
            </div>
        </div>

        <div class="demo-section">
            <h2>Comment ça marche</h2>

            <div class="demo-steps">
                <div class="demo-step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>Connexion</h3>
                        <p>Connectez-vous à votre compte pour accéder à toutes les fonctionnalités.</p>
                    </div>
                </div>

                <div class="demo-step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>Créez une session</h3>
                        <p>Depuis le dashboard, créez une nouvelle session de navigation.</p>
                    </div>
                </div>

                <div class="demo-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h3>Effectuez des requêtes</h3>
                        <p>Utilisez l'interface Browser Requests pour naviguer et extraire des données.</p>
                    </div>
                </div>

                <div class="demo-step">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <h3>Analysez les résultats</h3>
                        <p>Examinez les réponses complètes incluant headers, cookies et contenu HTML.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="code-example-section">
            <h2>Exemple de réponse</h2>

            <div class="code-container">
                <pre class="code-block">
{
  "status": 200,
  "headers": {
    "content-type": "text/html; charset=UTF-8",
    "date": "Wed, 15 May 2023 14:22:30 GMT",
    "server": "nginx/1.18.0"
  },
  "cookies": [
    { "name": "session_id", "value": "xyz123", "domain": "example.com" }
  ],
  "title": "Example Domain",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/98.0.4758.102",
  "content": "&lt;!DOCTYPE html&gt;&lt;html&gt;..."
}</pre>
            </div>
        </div>

        <div class="cta-section">
            <h2>Prêt à commencer?</h2>
            <p>Inscrivez-vous maintenant et profitez de toutes les fonctionnalités de notre plateforme.</p>
            <button class="cta">Créer un compte</button>
            <button class="cta secondary">En savoir plus</button>
        </div>
    </section>
</template>

<style scoped>
.landing {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    color: #e0e0e0;
    overflow-y: auto;
    overflow-x: hidden;
}

h1,
h2,
h3 {
    color: #81c784;
}

h1 {
    font-size: 3rem;
    background: linear-gradient(90deg, #81c784 0%, #64b5f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    margin-bottom: 1rem;
}

h2 {
    font-size: 2.2rem;
    margin: 1.5rem 0;
    text-align: center;
}

h3 {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
}

p {
    color: #b0bec5;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
}

.hero-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 5rem 2rem;
    background-color: #161b22;
}

.tagline {
    font-size: 1.4rem;
    max-width: 800px;
    margin-bottom: 2rem;
}

.cta {
    padding: 0.8em 2em;
    font-size: 1.2em;
    border-radius: 30px;
    border: none;
    background: linear-gradient(90deg, #2e7d32 0%, #1976d2 100%);
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
}

.cta:hover {
    background: linear-gradient(90deg, #388e3c 0%, #1e88e5 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    transform: translateY(-2px);
}

.cta.secondary {
    background: transparent;
    border: 2px solid #2e7d32;
    margin-left: 1rem;
}

.cta.secondary:hover {
    background: rgba(46, 125, 50, 0.2);
}

.features-section {
    padding: 5rem 2rem;
    background-color: #0d1117;
}

.feature-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    margin-top: 3rem;
}

.feature-card {
    background-color: #1e1e1e;
    border-radius: 12px;
    padding: 2rem;
    max-width: 400px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.feature-card:hover {
    transform: translateY(-10px);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-img {
    width: 100%;
    border-radius: 8px;
    margin-top: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.demo-section {
    padding: 5rem 2rem;
    background-color: #161b22;
}

.demo-steps {
    max-width: 800px;
    margin: 0 auto;
    margin-top: 3rem;
}

.demo-step {
    display: flex;
    margin-bottom: 2rem;
    align-items: flex-start;
}

.step-number {
    background: linear-gradient(135deg, #2e7d32 0%, #1976d2 100%);
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
    margin-right: 1.5rem;
    flex-shrink: 0;
}

.step-content {
    flex: 1;
}

.code-example-section {
    padding: 5rem 2rem;
    background-color: #0d1117;
}

.code-container {
    max-width: 900px;
    margin: 2rem auto 0;
    background-color: #1e1e1e;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

.code-block {
    padding: 2rem;
    margin: 0;
    overflow: auto;
    color: #a5d6a7;
    font-family: monospace;
    font-size: 0.95rem;
    line-height: 1.6;
}

.cta-section {
    padding: 5rem 2rem;
    background-color: #161b22;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.cta-section p {
    max-width: 600px;
    margin: 0 auto 2rem;
}

@media (max-width: 768px) {
    h1 {
        font-size: 2.2rem;
    }

    h2 {
        font-size: 1.8rem;
    }

    .feature-cards {
        flex-direction: column;
        align-items: center;
    }

    .cta-section button {
        margin: 0.5rem;
    }

    .demo-step {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .step-number {
        margin-bottom: 1rem;
        margin-right: 0;
    }
}
</style>
