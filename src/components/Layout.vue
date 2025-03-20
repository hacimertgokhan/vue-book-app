<template>
  <div class="layout-container" :style="themedStyles.container">
    <Navbar />
    <slot></slot>
    <Footer/>
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue';
import Footer from "./Footer.vue";
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
const theme = computed(() => store.state.ui.theme);

const themedStyles = computed(() => {
  const isDarkTheme = theme.value === 'dark';
  return {
    container: {
      backgroundColor: isDarkTheme ? '#09090b' : '#FFFFFF',
      color: isDarkTheme ? '#e2e2e2' : '#333333',
      minHeight: '100vh', // Ekran yüksekliğine göre ayarla
    },
  };
});
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Tüm ekranı kaplaması için */
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>