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
import {computed} from "vue";
import CurrencyBar from "@/components/currency/CurrencyBar.vue";
const currentUser = computed(() => store.state.user);

const store = useStore();
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1150px;
  margin: auto;
  padding: 16px 24px;
  font-size: 16px;
}

.brand {
  font-size: 14px;
}

.user-info {
  font-weight: bold;
  color: #555;
}
</style>
