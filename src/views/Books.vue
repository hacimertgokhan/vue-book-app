<template>
  <Layout>
    <div class="book-list-container" :class="theme" :style="{ backgroundColor: getThemeStyles.backgroundColor, color: getThemeStyles.textColor }">
      <!-- Controls Section -->
      <div class="controls-section" :style="{ backgroundColor: getThemeStyles.borderColor, boxShadow: getThemeStyles.boxShadow }">
        <div class="filter-controls">
          <!-- Arama Kutusu -->
          <div class="search-box">
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Kitap veya yazar ara..."
                class="search-input"
                :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
            />
            <i class="fas fa-search search-icon" :style="{ color: getThemeStyles.textColor }"></i>
          </div>

          <!-- Filtreler -->
          <div class="filters">
            <div class="filter-group">
              <label :style="{color: getThemeStyles.textColor}">Kategori:</label>
              <select v-model="filters.category" class="filter-select" :style="{ backgroundColor: getThemeStyles.selectBackgroundColor, color: getThemeStyles.textColor, borderColor: getThemeStyles.borderColor }">
                <option value="">Tüm Kategoriler</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label :style="{color: getThemeStyles.textColor}">Dil:</label>
              <select v-model="filters.language" class="filter-select" :style="{ backgroundColor: getThemeStyles.selectBackgroundColor, color: getThemeStyles.textColor, borderColor: getThemeStyles.borderColor }">
                <option value="">Tüm Diller</option>
                <option v-for="language in languages" :key="language" :value="language">
                  {{ language }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label :style="{color: getThemeStyles.textColor}">Fiyat Aralığı:</label>
              <div class="range-filter">
                <span :style="{color: getThemeStyles.textColor}">{{ formatPrice(filters.priceRange[0]) }} - {{ formatPrice(filters.priceRange[1]) }}</span>
                <input type="range" v-model="filters.priceRange[0]" :min="priceMin" :max="priceMax" class="range-input" :style="{backgroundColor: getThemeStyles.accentColor}"/>
                <input type="range" v-model="filters.priceRange[1]" :min="priceMin" :max="priceMax" class="range-input" :style="{backgroundColor: getThemeStyles.accentColor}"/>
              </div>
            </div>

            <div class="filter-group">
              <label :style="{color: getThemeStyles.textColor}">Yayın Yılı Aralığı:</label>
              <div class="range-filter">
                <span :style="{color: getThemeStyles.textColor}">{{ filters.yearRange[0] }} - {{ filters.yearRange[1] }}</span>
                <input type="range" v-model="filters.yearRange[0]" :min="yearMin" :max="yearMax" class="range-input" :style="{backgroundColor: getThemeStyles.accentColor}"/>
                <input type="range" v-model="filters.yearRange[1]" :min="yearMin" :max="yearMax" class="range-input" :style="{backgroundColor: getThemeStyles.accentColor}"/>
              </div>
            </div>

            <div class="filter-group">
              <label :style="{color: getThemeStyles.textColor}">Sayfa Sayısı Aralığı:</label>
              <div class="range-filter">
                <span :style="{color: getThemeStyles.textColor}">{{ filters.pageRange[0] }} - {{ filters.pageRange[1] }}</span>
                <input type="range" v-model="filters.pageRange[0]" :min="pageMin" :max="pageMax" class="range-input" :style="{backgroundColor: getThemeStyles.accentColor}"/>
                <input type="range" v-model="filters.pageRange[1]" :min="pageMin" :max="pageMax" class="range-input" :style="{backgroundColor: getThemeStyles.accentColor}"/>
              </div>
            </div>

            <div class="filter-group">
              <label class="checkbox-label" :style="{color: getThemeStyles.textColor}">
                <input type="checkbox" v-model="filters.onlyFree" class="checkbox-input" />
                <span class="checkbox-text">Sadece Ücretsiz</span>
              </label>
            </div>
          </div>

          <button class="clear-filters-btn" @click="clearFilters" :style="{ backgroundColor: getThemeStyles.accentColor, color: 'white' }">Filtreleri Temizle</button>

          <!-- Görünüm Kontrolleri -->
          <div class="view-controls" :style="{ borderColor: getThemeStyles.borderColor }">
            <div class="sort-controls">
              <select v-model="sortBy" class="sort-select" :style="{ backgroundColor: getThemeStyles.selectBackgroundColor, color: getThemeStyles.textColor, borderColor: getThemeStyles.borderColor }">
                <option value="releaseDate">Yayın Tarihi</option>
                <option value="priceAsc">Fiyat (Artan)</option>
                <option value="priceDesc">Fiyat (Azalan)</option>
                <option value="name">İsim</option>
              </select>
            </div>

            <div class="view-mode-toggle">
              <button
                  class="view-btn"
                  :class="{ active: viewMode === 'grid' }"
                  @click="setViewMode('grid')"
                  :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor, borderColor: getThemeStyles.borderColor }"
              >
                <i class="fas fa-th" :style="{color: getThemeStyles.textColor}"></i>
              </button>
              <button
                  class="view-btn"
                  :class="{ active: viewMode === 'list' }"
                  @click="setViewMode('list')"
                  :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor, borderColor: getThemeStyles.borderColor }"
              >
                <i class="fas fa-list" :style="{color: getThemeStyles.textColor}"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Kitap Listesi -->
      <div
          class="book-display"
          :class="viewMode"
      >
        <div
            v-for="book in paginatedBooks"
            :key="book.id"
            class="book-item"
            :class="{ 'list-item': viewMode === 'list' }"
        >
          <div class="book-card" :style="{ borderColor: getThemeStyles.borderColor, boxShadow: getThemeStyles.boxShadow, backgroundColor: getThemeStyles.inputBackgroundColor }">
            <div class="book-image-container">
              <img :src="book.coverImage" :alt="book.title" class="book-image" />
              <div class="book-overlay">
                <button class="quick-view-btn" @click="openBookDetails(book)" :style="{ backgroundColor: getThemeStyles.accentColor, color: 'white' }">
                  Hızlı Bakış
                </button>
                <button
                    class="favorite-btn"
                    @click="toggleFavorite(book)"
                    :class="{ favorited: isFavorite(book.id) }"
                >
                  <i class="fas fa-heart"  :style="{ color: isFavorite(book.id) ? getThemeStyles.accentColor : 'white' }"></i>
                </button>
              </div>
            </div>
            <div class="book-info" :style="{ color: getThemeStyles.textColor }">
              <h3 class="book-title">{{ book.title }}</h3>
              <p class="book-author">{{ book.author }}</p>
              <div class="book-details" v-if="viewMode === 'list'">
                <span class="book-language">{{ book.language }}</span>
                <span class="book-pages">{{ book.pages }} sayfa</span>
                <span class="book-year">{{ book.year }}</span>
              </div>
              <div class="book-price">
              <span v-if="book.discountedPrice" class="price-container">
                <span class="original-price" style="text-decoration: line-through">{{ formatPrice(book.price) }}</span>
                <span class="discounted-price">{{ formatPrice(book.discountedPrice) }}</span>
              </span>
                <span v-else>{{ formatPrice(book.price) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Yükleniyor Göstergesi -->
      <div v-if="isLoading" class="loading-container" :style="{color: getThemeStyles.textColor}">
        <div class="loading-spinner"></div>
        <span>Kitaplar yükleniyor...</span>
      </div>

      <!-- Pagination -->
      <div class="pagination" :style="{ backgroundColor: getThemeStyles.borderColor, boxShadow: getThemeStyles.boxShadow }">
        <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
            :style="{ backgroundColor: getThemeStyles.accentColor, color: 'white' }"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <span :style="{color: getThemeStyles.textColor}">Sayfa {{ currentPage }} / {{ totalPages }}</span>
        <button
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            :style="{ backgroundColor: getThemeStyles.accentColor, color: 'white' }"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
/* Tema Değişkenleri */
.book-list-container {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --accent-color: #e74c3c;
  --background-color: #f5f6fa;
  --surface-color: #ffffff;
  --text-primary: #2c3e50;
  --text-secondary: #7f8c8d;
  --border-color: #dcdde1;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --transition-speed: 0.3s;
}

/* Karanlık Tema */
.book-list-container.dark {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --accent-color: #e74c3c;
  --background-color: #1a1a1a;
  --surface-color: #2d2d2d;
  --text-primary: #ecf0f1;
  --text-secondary: #bdc3c7;
  --border-color: #34495e;
  --shadow-color: rgba(255, 255, 255, 0.1);
}

/* Ana Container */
.book-list-container {
  padding: 2rem;
  min-height: 100vh;
  transition: all var(--transition-speed) ease;
}

/* Kontrol Bölümü */
.controls-section {
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  transition: all var(--transition-speed) ease;
}

/* Arama Kutusu */
.search-box {
  display: flex;
  align-items: center;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  position: relative;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  padding: 0.5rem;
  transition: box-shadow 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.search-input::placeholder {
  font-size: 1rem;
  padding: 0.5rem;
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

/* Filtreler */
.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.filter-select {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  transition: all var(--transition-speed) ease;
}

/* Range Slider Stilleri */
.range-filter {
  display: flex;
  flex-direction: column;
}

.range-filter span {
  margin-bottom: 0.5rem;
}

.range-input {
  width: 100%;
  margin-bottom: 0.75rem;
  height: 5px;
  border-radius: 5px;
  background: var(--accent-color);
  outline: none;
  transition: background-color 0.3s ease;
  -webkit-appearance: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  border: none;
}

.range-input::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  border: none;
}

/* Checkbox Stilleri */
.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0.75rem;
}

.checkbox-input {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
}

/* Filtreleri Temizle Butonu */
.clear-filters-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  border: none;
}

.clear-filters-btn:hover {
  opacity: 0.9;
}

/* Görünüm Kontrolleri */
.view-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.sort-controls {
  flex: 1;
  margin-right: 1rem;
}

.sort-select {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  transition: all var(--transition-speed) ease;
}

.view-mode-toggle {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  background: transparent;
  border: none;
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.view-btn:hover,
.view-btn.active {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Kitap Kartları */
.book-display {
  display: grid;
  gap: 2rem;
  margin-top: 15px;
}

.book-display.grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.book-display.list {
  grid-template-columns: 1fr;
}

.book-card {
  border-radius: 1rem;
  overflow: hidden;
  transition: all var(--transition-speed) ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-5px);
}

/* Kitap Görseli */
.book-image-container {
  position: relative;
  padding-top: 150%;
  overflow: hidden;
}

.book-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-speed) ease;
}

.book-card:hover .book-image {
  transform: scale(1.05);
}

/* Overlay */
.book-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity var(--transition-speed) ease;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

/* Kitap Bilgileri */
.book-info {
  padding: 1.5rem;
}

.book-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.book-author {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.book-details {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

/* Fiyatlandırma */
.book-price {
  font-size: 1.25rem;
  font-weight: 600;
}

.price-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.original-price {
  text-decoration: line-through;
  font-size: 1rem;
}

.discounted-price {
}

/* Butonlar */
.quick-view-btn {
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.quick-view-btn:hover {
  transform: scale(1.05);
}

.favorite-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all var(--transition-speed) ease;
}

.favorite-btn.favorited {
}

/* Yükleniyor Animasyonu */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Duyarlı Tasarım */
@media (max-width: 768px) {
  .book-display.grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .controls-section {
    padding: 1rem;
  }

  .filters {
    grid-template-columns: 1fr;
  }

  .view-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .sort-controls {
    margin-right: 0;
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .book-list-container {
    padding: 1rem;
  }

  .book-display.grid {
    grid-template-columns: 1fr;
  }

  .filter-group {
    flex: 1 1 100%;
  }
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.page-btn {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<script setup>
import { useStore } from "vuex";
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { debounce } from 'lodash';
import router from "@/router/index.js";
import Layout from "@/components/Layout.vue";


const store = useStore();


const theme = computed(() => store.state.ui.theme);
const viewMode = computed(() => store.state.ui.viewMode);
const isLoading = computed(() => store.state.books.loading);


const searchQuery = ref('');
const filters = ref({
  category: '',
  language: '',
  priceRange: [0, 1000],
  yearRange: [1900, 2025],
  pageRange: [0, 1000],
  onlyFree: false
});

const categories = ref([
  'Roman', 'Bilim Kurgu', 'Tarih', 'Felsefe', 'Biyografi',
  'Psikoloji', 'Çocuk Kitapları', 'Bilim', 'İş', 'Teknoloji'
]);

const languages = ref([
  'Türkçe', 'İngilizce', 'Fransızca', 'Almanca', 'İspanyolca'
]);


const priceMin = ref(0);
const priceMax = ref(1000);
const yearMin = ref(1900);
const yearMax = ref(2025);
const pageMin = ref(0);
const pageMax = ref(1000);


const favorites = ref([]);


const allBooks = computed(() => store.state.books.books || []);
const booksPerPage = ref(20);
const currentPage = ref(1);


const selectedCurrency = computed(() => store.state.currency.selectedCurrency);
const getRate = computed(() => store.getters['currency/getRate']);


const sortBy = ref('releaseDate');


const getThemeStyles = computed(() => {
  const isDarkTheme = theme.value === 'dark';
  return {
    backgroundColor: isDarkTheme ? '#09090b' : '#FFFFFF',
    textColor: isDarkTheme ? '#e2e2e2' : '#333333',
    borderColor: isDarkTheme ? '#202020' : '#DDDDDD',
    accentColor: '#007bff',
    boxShadow: isDarkTheme ? '0 4px 12px rgba(255, 255, 255, 0.1)' : '0 4px 12px rgba(0, 0, 0, 0.2)',
    inputBackgroundColor: isDarkTheme ? '#101010' : '#f9f9f9',
    selectBackgroundColor: isDarkTheme ? '#101010' : '#f9f9f9',
  };
});




const debouncedSearch = debounce(() => {
  console.log("Arama yapılıyor:", searchQuery.value);
}, 200);

watch(searchQuery, () => {
  debouncedSearch();
});


const clearFilters = () => {
  filters.value = {
    category: '',
    language: '',
    priceRange: [priceMin.value, priceMax.value],
    yearRange: [yearMin.value, yearMax.value],
    onlyFree: false
  };
  searchQuery.value = '';
  currentPage.value = 1;
};


const toggleFavorite = (book) => {
  const index = favorites.value.findIndex(id => id === book.id);
  if (index === -1) {
    favorites.value.push(book.id);
  } else {
    favorites.value.splice(index, 1);
  }
};

const isFavorite = (id) => {
  return favorites.value.includes(id);
};


const openBookDetails = (book) => {
  store.dispatch('books/selectBook', book.id);
  router.push('/book/' + book.id);
};


const formatPrice = (price) => {
  if (price === 0) return "Ücretsiz";

  const rate = getRate.value(selectedCurrency.value);
  if (!rate) return 'Döviz Kuru Bulunamadı';

  const convertedPrice = price * rate;
  const currencySymbols = {
    TRY: "₺",
    USD: "$",
    EUR: "€",
    GBP: "£"
  };

  return `${currencySymbols[selectedCurrency.value]}${convertedPrice.toFixed(2)}`;
};


const filteredBooks = computed(() => {
  let result = allBooks.value.filter(book => {
    if (searchQuery.value && !book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
        !book.author.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false;
    }

    if (filters.value.category && book.category !== filters.value.category) {
      return false;
    }

    if (filters.value.language && book.language !== filters.value.language) {
      return false;
    }

    const bookPrice = book.discountedPrice || book.price;
    if (bookPrice < filters.value.priceRange[0] || bookPrice > filters.value.priceRange[1]) {
      return false;
    }

    if (book.year < filters.value.yearRange[0] || book.year > filters.value.yearRange[1]) {
      return false;
    }

    if (book.pages < filters.value.pageRange[0] || book.pages > filters.value.pageRange[1]) {
      return false;
    }

    if (filters.value.onlyFree && !book.isFree) {
      return false;
    }

    return true;
  });


  if (sortBy.value === 'priceAsc') {
    result.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
  } else if (sortBy.value === 'priceDesc') {
    result.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
  } else if (sortBy.value === 'name') {
    result.sort((a, b) => a.title.localeCompare(b.title));
  }

  return result;
});


const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / booksPerPage.value);
});


const paginatedBooks = computed(() => {
  const startIndex = (currentPage.value - 1) * booksPerPage.value;
  const endIndex = startIndex + booksPerPage.value;
  return filteredBooks.value.slice(startIndex, endIndex);
});


const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};


onMounted(async () => {
  await store.dispatch('books/fetchBooks');
});
</script>