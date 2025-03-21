<template>
  <footer class="footer">
    <span class="brand">Virtara Group - Kitap yönetim sistemi. Bütün hakları saklıdır.</span>
    <span class="user-info">
      <CurrencyBar/>
    </span>
  </footer>
</template>

<script setup>
import { useStore } from "vuex";
import CurrencyBar from "@/components/currency/CurrencyBar.vue";
import {computed} from "vue";

const store = useStore();

const theme = computed(() => store.state.ui.theme);
</script>

<style scoped>
:scope {
  --footer-background-color: var(--light-color);
  --footer-text-color: var(--dark-color);
}

.footer[data-theme="dark"] {
  --footer-background-color: var(--dark-color);
  --footer-text-color: var(--light-color);
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1150px;
  margin: auto;
  padding: 16px 24px;
  font-size: 16px;
  background-color: var(--footer-background-color);
  color: var(--footer-text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.brand {
  font-size: 14px;
  color: var(--footer-text-color);
  transition: color 0.3s ease;
}

.user-info {
  font-weight: bold;
  color: var(--footer-text-color);
  transition: color 0.3s ease;
}
</style>