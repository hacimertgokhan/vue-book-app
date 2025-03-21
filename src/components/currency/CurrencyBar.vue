<template>
  <div @click="goToExchangePage"  class="currency-ticker">
    <span class="currency-pair">
      {{ currentRate }} TRY
    </span>
    <span class="currency-value" :class="{ 'fade-in': fadeIn }">
      = 1 {{ currentCurrency }}
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import {useRouter} from "vue-router";

const router = useRouter();
const store = useStore();

const currencies = ['USD', 'EUR', 'GBP'];
const currentCurrencyIndex = ref(0);
const currentRate = ref(0);
const currentCurrency = ref(currencies[0]);
const fadeIn = ref(true);
let timer = null;

const updateCurrency = () => {
  fadeIn.value = false;
  setTimeout(() => {
    currentCurrencyIndex.value = (currentCurrencyIndex.value + 1) % currencies.length;
    currentCurrency.value = currencies[currentCurrencyIndex.value];
    currentRate.value = formatRate(store.state.currency.rates[currentCurrency.value]);
    fadeIn.value = true;
  }, 500);
};

const goToExchangePage = () => {
    router.push('/exchange');
}

const formatRate = (rate) => {
  return parseFloat(1 / rate).toFixed(4);
};

onMounted(() => {
  currentRate.value = formatRate(store.state.currency.rates[currencies[0]]);
  timer = setInterval(updateCurrency, 3000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.currency-ticker {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #333;
}

.currency-pair {
  margin-right: 0.5rem;
  font-weight: bold;
}

.currency-value {
  transition: opacity 0.5s ease-in-out;
  opacity: 1;
}

.currency-value.fade-in {
  opacity: 1;
}

.currency-value.fade-out {
  opacity: 0;
}
</style>