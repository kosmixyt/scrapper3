<script setup lang="ts">
import TopBar from './components/TopBar.vue'
</script>

<template>
  <div class="app-container">
    <TopBar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #121212;
  color: #e0e0e0;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
  /* Assure que box-sizing est hérité par tous les éléments */
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #121212;
}

.main-content {
  flex: 1;
  overflow: hidden;
  width: 100%;
}

/* Global dark mode styles */
input,
textarea,
select {
  background-color: #2d2d2d;
  color: #e0e0e0;
  border: 1px solid #444;
  box-sizing: border-box;
  max-width: 100%;
}

button {
  background-color: #2e7d32;
  color: #ffffff;
  box-sizing: border-box;
}

a {
  color: #81c784;
}
</style>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>