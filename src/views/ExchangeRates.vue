<template>
  <Layout>
    <div class="currency-container">
      <div class="header-section">
        <h2>Döviz Kurları</h2>
        <div class="controls">
          <div class="update-info">
            <button @click="manualRefresh" class="update-button" :disabled="isUpdating">
              <span class="icon" :class="{ 'rotating': isUpdating }">↻</span>
              <span>Güncelle</span>
            </button>
            <div class="auto-update-control">
              <span class="auto-update-label">Otomatik güncelleme:</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="autoUpdate">
                <span class="slider"></span>
              </label>
              <span class="next-update" v-if="autoUpdate">
                {{ nextUpdateCountdown }}s
              </span>
            </div>
          </div>
          <div class="view-toggles">
            <button
                @click="viewMode = 'grid'"
                :class="['toggle-btn', viewMode === 'grid' ? 'active' : '']"
                title="Grid Görünümü"
            >
              <span class="icon">▦</span>
            </button>
            <button
                @click="viewMode = 'list'"
                :class="['toggle-btn', viewMode === 'list' ? 'active' : '']"
                title="Liste Görünümü"
            >
              <span class="icon">≡</span>
            </button>
          </div>
        </div>
      </div>

      <div class="status-bar">
        <div class="last-update">
          Son güncelleme: {{ lastUpdateTime }}
        </div>
        <div class="search-filter">
          <input
              type="text"
              v-model="searchQuery"
              placeholder="Döviz ara (USD, EUR...)"
              class="search-input"
          />
        </div>
      </div>

      <div class="currency-wrapper" ref="scrollContainer">
        <div v-if="isLoading" class="loading-overlay">
          <div class="spinner"></div>
          <div>Veriler yükleniyor...</div>
        </div>

        <div v-if="viewMode === 'grid'" class="currency-grid">
          <CurrencyCard
              v-for="currency in filteredCurrencies"
              :key="currency.code"
              :currency="currency.code"
              :rate="currency.rate"
              :trend="currency.trend"
              :previousRate="currency.previousRate"
              class="currency-card"
          />
          <div v-if="filteredCurrencies.length === 0 && !isLoading" class="no-results">
            Aranan kriterlere uygun döviz bulunamadı.
          </div>
        </div>
        <div v-else class="currency-list">
          <div
              v-for="currency in filteredCurrencies"
              :key="currency.code"
              class="currency-list-item"
              :class="{'updated': isUpdated(currency.code)}"
          >
            <div class="currency-info">
              <div class="currency-flag">{{ getCurrencyFlag(currency.code) }}</div>
              <div class="currency-details">
                <div class="currency-code">{{ currency.code }}</div>
                <div class="currency-name">{{ getCurrencyName(currency.code) }}</div>
              </div>
            </div>
            <div class="currency-rate" :class="{'up': currency.trend > 0, 'down': currency.trend < 0}">
              <span class="rate-value">{{ formatRate(currency.rate) }}</span>
              <span class="trend-indicator">
                {{ currency.trend > 0 ? '▲' : currency.trend < 0 ? '▼' : '–' }}
                {{ Math.abs(currency.trend).toFixed(2) }}%
              </span>
            </div>
          </div>
          <div v-if="filteredCurrencies.length === 0 && !isLoading" class="no-results">
            Aranan kriterlere uygun döviz bulunamadı.
          </div>
        </div>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="['page-btn', currentPage === page ? 'active' : '']"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import Layout from '../components/Layout.vue';
import CurrencyCard from '@/components/currency/CurrencyCard.vue';

const store = useStore();
const scrollContainer = ref(null);
const viewMode = ref('grid');
const itemsPerRow = 5;
const itemsPerPage = 15;
const currentPage = ref(1);
const searchQuery = ref('');
const autoUpdate = ref(true);
const updateInterval = 5000;
const nextUpdateCountdown = ref(5);
const isUpdating = ref(false);
const isLoading = ref(true);
const lastUpdateTime = ref('--:--:--');
const updatedCurrencies = ref(new Set());
let timer = null;
let countdownTimer = null;


const previousRates = ref({});


const currencyArray = computed(() => {
  const ratesObj = store.state.currency.rates;
  return Object.keys(ratesObj).map(code => {

    if (!previousRates.value[code]) {
      previousRates.value[code] = ratesObj[code];
    }


    const trend = previousRates.value[code] !== ratesObj[code]
        ? ((ratesObj[code] - previousRates.value[code]) / previousRates.value[code]) * 100
        : 0;

    return {
      code,
      rate: ratesObj[code],
      previousRate: previousRates.value[code],
      trend: trend
    };
  });
});


const filteredCurrencies = computed(() => {
  let filtered = currencyArray.value;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(currency => {
      return currency.code.toLowerCase().includes(query) ||
          getCurrencyName(currency.code).toLowerCase().includes(query);
    });
  }


  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filtered.slice(startIndex, startIndex + itemsPerPage);
});


const totalPages = computed(() => {
  const filtered = currencyArray.value.filter(currency => {
    if (!searchQuery.value.trim()) return true;
    const query = searchQuery.value.toLowerCase();
    return currency.code.toLowerCase().includes(query) ||
        getCurrencyName(currency.code).toLowerCase().includes(query);
  });

  return Math.ceil(filtered.length / itemsPerPage);
});


const getCurrencyName = (code) => {
  const names = {
    'USD': 'Amerikan Doları',
    'EUR': 'Euro',
    'GBP': 'İngiliz Sterlini',
    'JPY': 'Japon Yeni',
    'CHF': 'İsviçre Frangı',
    'CAD': 'Kanada Doları',
    'AUD': 'Avustralya Doları',
    'CNY': 'Çin Yuanı',
    'TRY': 'Türk Lirası',
    'RUB': 'Rus Rublesi',
    'INR': 'Hint Rupisi',

  };

  return names[code] || `${code} Para Birimi`;
};


const getCurrencyFlag = (code) => {
  const flags = {
    'USD': '🇺🇸',
    'EUR': '🇪🇺',
    'GBP': '🇬🇧',
    'JPY': '🇯🇵',
    'CHF': '🇨🇭',
    'CAD': '🇨🇦',
    'AUD': '🇦🇺',
    'CNY': '🇨🇳',
    'TRY': '🇹🇷',
    'RUB': '🇷🇺',
    'INR': '🇮🇳',

  };

  return flags[code] || '🏳️';
};


const formatRate = (rate) => {
  return parseFloat(rate).toFixed(4);
};


const isUpdated = (code) => {
  return updatedCurrencies.value.has(code);
};


const formatTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};


const fetchRates = async () => {
  if (isUpdating.value) return;

  isUpdating.value = true;

  try {

    const currentRates = store.state.currency.rates;
    Object.keys(currentRates).forEach(code => {
      previousRates.value[code] = currentRates[code];
    });


    await store.dispatch('currency/fetchRates');


    updatedCurrencies.value.clear();
    const newRates = store.state.currency.rates;
    Object.keys(newRates).forEach(code => {
      if (previousRates.value[code] !== newRates[code]) {
        updatedCurrencies.value.add(code);
      }
    });


    lastUpdateTime.value = formatTime();


    setTimeout(() => {
      updatedCurrencies.value.clear();
    }, 3000);
  } catch (error) {
    console.error('Döviz kurları güncellenirken hata oluştu:', error);
  } finally {
    isUpdating.value = false;
    isLoading.value = false;
  }
};


const manualRefresh = () => {
  fetchRates();
  resetCountdown();
};


const resetCountdown = () => {
  nextUpdateCountdown.value = 5;
};


const setupAutoUpdate = () => {
  clearInterval(timer);
  clearInterval(countdownTimer);

  if (autoUpdate.value) {

    timer = setInterval(() => {
      fetchRates();
      resetCountdown();
    }, updateInterval);


    countdownTimer = setInterval(() => {
      if (nextUpdateCountdown.value > 0) {
        nextUpdateCountdown.value -= 1;
      }
    }, 1000);
  }
};


watch(autoUpdate, setupAutoUpdate);


watch([currentPage, searchQuery], () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0;
  }
});

onMounted(async () => {
  await fetchRates();
  setupAutoUpdate();
});

onUnmounted(() => {
  clearInterval(timer);
  clearInterval(countdownTimer);
});
</script>

<style scoped>
.currency-container {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 100vh;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.header-section {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

h2 {
  font-size: 2rem;
  color: #2c3e50;
  font-weight: 700;
  margin: 0;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.update-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auto-update-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.auto-update-label {
  font-size: 0.85rem;
  color: #6c757d;
}

.next-update {
  font-size: 0.85rem;
  font-weight: 600;
  color: #42b983;
  min-width: 2rem;
  text-align: center;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #42b983;
}

input:focus + .slider {
  box-shadow: 0 0 1px #42b983;
}

input:checked + .slider:before {
  transform: translateX(16px);
}

.status-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.last-update {
  font-size: 0.85rem;
  color: #6c757d;
}

.search-filter {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: white;
}

.search-input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.view-toggles {
  display: flex;
  background-color: #e9ecef;
  border-radius: 8px;
  padding: 0.25rem;
}

.toggle-btn {
  padding: 0.5rem 0.75rem;
  background-color: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  color: #6c757d;
  transition: all 0.2s ease;
}

.toggle-btn.active {
  background-color: #42b983;
  color: white;
}

.toggle-btn .icon {
  font-size: 1.25rem;
}

.update-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.update-button:hover:not(:disabled) {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.25);
}

.update-button:active:not(:disabled) {
  transform: translateY(0);
}

.update-button:disabled {
  background-color: #a8d5c3;
  cursor: not-allowed;
}

.update-button .icon {
  font-size: 1.25rem;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.currency-wrapper {
  position: relative;
  width: 100%;
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(66, 185, 131, 0.2);
  border-radius: 50%;
  border-top-color: #42b983;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.currency-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  width: 100%;
  min-height: 200px;
}

.currency-card {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.currency-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  border-color: #42b983;
}

.currency-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.currency-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.currency-list-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #42b983;
}

.currency-list-item.updated {
  animation: highlight 3s ease;
}

@keyframes highlight {
  0% { background-color: rgba(66, 185, 131, 0.3); }
  100% { background-color: white; }
}

.currency-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.currency-flag {
  font-size: 1.75rem;
}

.currency-details {
  display: flex;
  flex-direction: column;
}

.currency-code {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2c3e50;
}

.currency-name {
  font-size: 0.85rem;
  color: #6c757d;
}

.currency-rate {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.rate-value {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2c3e50;
}

.trend-indicator {
  font-size: 0.85rem;
}

.up {
  color: #28a745;
}

.down {
  color: #dc3545;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
}

.pagination {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.page-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn.active {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

@media (max-width: 1200px) {
  .currency-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .currency-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .controls {
    width: 100%;
    justify-content: space-between;
  }

  .status-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .search-filter {
    width: 100%;
    max-width: none;
  }
}

@media (max-width: 768px) {
  .currency-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .update-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 576px) {
  .currency-grid {
    grid-template-columns: 1fr;
  }

  .currency-container {
    padding: 1rem;
  }
}
</style>