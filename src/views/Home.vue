<template>
  <Layout>
    <div class="main-container">
      <header class="welcome-section">
        <h1 class="greeting">Merhaba, {{ store.state.user.username }}</h1>
        <h2 class="subheading">Bu gün hangi kitaplara göz gezdirmek istersin?</h2>
      </header>

      <!-- Kitap Karüseli (Slider) -->
      <section class="featured-books">
        <h3 class="section-title">Öne Çıkan Kitaplar</h3>
        <div class="carousel-container">
          <button class="carousel-btn left" @click="prevSlide">
            <span class="icon">‹</span>
          </button>
          <div class="carousel" ref="carouselRef" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">
            <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * slideWidth}px)` }">
              <div v-for="(book, index) in featuredBooks" :key="`featured-${book.id}`"
                   class="carousel-item" :class="{ 'active': index === currentIndex }">
                <div class="book-card featured">
                  <div class="book-image-container">
                    <img :src="book.image" :alt="book.title" class="book-image" />
                    <div class="book-overlay">
                      <button class="quick-view-btn" @click="openBookDetails(book)">Hızlı Bakış</button>
                      <button class="favorite-btn" @click="toggleFavorite(book)">
                        <span class="favorite-icon" :class="{ 'favorited': isFavorite(book.id) }">
                          ♥
                        </span>
                      </button>
                    </div>
                  </div>
                  <div class="book-info">
                    <h4 class="book-title">{{ book.title }}</h4>
                    <p class="book-author">{{ book.author }}</p>
                    <div class="book-price">
                      <span style="display: flex; flex-direction: row; justify-content: space-between" v-if="book.discountedPrice">
                        <span class="original-price" style="text-decoration: line-through">{{ formatPrice(book.price) }}</span>
                        <span class="discounted-price">{{ formatPrice(book.discountedPrice) }}</span>
                      </span>
                      <span v-else>{{ formatPrice(book.price) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="carousel-btn right" @click="nextSlide">
            <span class="icon">›</span>
          </button>
          <div class="carousel-indicators">
            <span v-for="(_, index) in featuredBooks" :key="`indicator-${index}`"
                  class="indicator" :class="{ 'active': index === currentIndex }"
                  @click="goToSlide(index)"></span>
          </div>
        </div>
      </section>

      <!-- Filtreleme ve Kontrol Paneli -->
      <section class="controls-section">
        <div class="filter-controls">
          <div class="search-box">
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Kitap veya yazar ara..."
                class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>

          <div class="filters">
            <div class="filter-group">
              <select v-model="filters.category" class="filter-select">
                <option value="">Tüm Kategoriler</option>
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>

            <div class="filter-group">
              <select v-model="filters.language" class="filter-select">
                <option value="">Tüm Diller</option>
                <option v-for="language in languages" :key="language" :value="language">{{ language }}</option>
              </select>
            </div>

            <div class="filter-group">
              <div class="range-filter">
                <span>Fiyat: {{ formatPrice(filters.priceRange[0]) }} - {{ formatPrice(filters.priceRange[1]) }}</span>
                <input type="range" v-model="filters.priceRange[0]" :min="priceMin" :max="priceMax" class="range-input" />
                <input type="range" v-model="filters.priceRange[1]" :min="priceMin" :max="priceMax" class="range-input" />
              </div>
            </div>

            <div class="filter-group">
              <div class="range-filter">
                <span>Yayın Yılı: {{ filters.yearRange[0] }} - {{ filters.yearRange[1] }}</span>
                <input type="range" v-model="filters.yearRange[0]" :min="yearMin" :max="yearMax" class="range-input" />
                <input type="range" v-model="filters.yearRange[1]" :min="yearMin" :max="yearMax" class="range-input" />
              </div>
            </div>

            <div class="filter-group">
              <div class="range-filter">
                <span>Sayfa Sayısı: {{ filters.pageRange[0] }} - {{ filters.pageRange[1] }}</span>
                <input type="range" v-model="filters.pageRange[0]" :min="pageMin" :max="pageMax" class="range-input" />
                <input type="range" v-model="filters.pageRange[1]" :min="pageMin" :max="pageMax" class="range-input" />
              </div>
            </div>

            <div class="filter-group">
              <label class="checkbox-filter">
                <input type="checkbox" v-model="filters.onlyFree" />
                <span>Sadece Ücretsiz</span>
              </label>
            </div>

            <button class="clear-filters-btn" @click="clearFilters">Filtreleri Temizle</button>
          </div>
        </div>

        <div class="view-controls">
          <div class="sort-controls">
            <select v-model="sortBy" class="sort-select">
              <option value="releaseDate">Yayın Tarihi</option>
              <option value="priceAsc">Fiyat (Artan)</option>
              <option value="priceDesc">Fiyat (Azalan)</option>
              <option value="name">İsim</option>
            </select>
          </div>

          <div class="currency-selector">
            <select v-model="selectedCurrency" class="currency-select">
              <option value="TRY">TRY (₺)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div class="view-mode-toggle">
            <button class="view-btn" :class="{ 'active': viewMode === 'grid' }" @click="viewMode = 'grid'">
              <span class="grid-icon">▦</span>
            </button>
            <button class="view-btn" :class="{ 'active': viewMode === 'list' }" @click="viewMode = 'list'">
              <span class="list-icon">≡</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Tüm Kitaplar (Grid veya List görünümünde) -->
      <section class="all-books">
        <h3 class="section-title">Tüm Kitaplar</h3>
        <div class="book-display" :class="viewMode">
          <div v-for="book in filteredBooks" :key="`book-${book.id}`"
               class="book-item" :class="{ 'list-item': viewMode === 'list' }">
            <div class="book-card" :class="{ 'list-card': viewMode === 'list' }">
              <div class="book-image-container">
                <img :src="book.image" :alt="book.title" class="book-image" />
                <div class="book-overlay">
                  <button class="quick-view-btn" @click="openBookDetails(book)">Hızlı Bakış</button>
                  <button class="favorite-btn" @click="toggleFavorite(book)">
                    <span class="favorite-icon" :class="{ 'favorited': isFavorite(book.id) }">
                      ♥
                    </span>
                  </button>
                </div>
              </div>
              <div class="book-info">
                <h4 class="book-title">{{ book.title }}</h4>
                <p class="book-author">{{ book.author }}</p>
                <p v-if="viewMode === 'list'" class="book-description">{{ book.description }}</p>
                <div class="book-details" v-if="viewMode === 'list'">
                  <span class="book-language">{{ book.language }}</span>
                  <span class="book-pages">{{ book.pages }} sayfa</span>
                  <span class="book-year">{{ book.year }}</span>
                </div>
                <div class="book-price">
                  <span style="display: flex; flex-direction: row; justify-content: space-between" v-if="book.discountedPrice">
                    <span class="original-price" style="text-decoration: line-through">{{ formatPrice(book.price) }}</span>
                    <span class="discounted-price">{{ formatPrice(book.discountedPrice) }}</span>
                  </span>
                  <span v-else>{{ formatPrice(book.price) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sonsuz Scroll için Yükleniyor göstergesi -->
        <div v-if="isLoading" class="loading-indicator">
          <span class="loading-spinner"></span>
          <span>Daha fazla kitap yükleniyor...</span>
        </div>
      </section>
    </div>
    <GridBackground />
  </Layout>
</template>

<script setup>
import Layout from "../components/Layout.vue";
import { useStore } from "vuex";
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { debounce } from 'lodash';
import {featuredBooks} from "@/utils/customDatas.js";

// Store ve state tanımlamaları
const store = useStore();
const currentIndex = ref(0);
const slideWidth = ref(320); // Her slide'ın genişliği
const viewMode = ref('grid'); // 'grid' veya 'list'
const searchQuery = ref('');
const isLoading = ref(false);
const page = ref(1);
const totalPages = ref(10); // Varsayılan değer

// Para birimi ve dönüşüm oranları
const selectedCurrency = ref('TRY');
const currencyRates = ref({
  TRY: 1,
  USD: 0.033, // 1 TRY = 0.033 USD
  EUR: 0.030, // 1 TRY = 0.030 EUR
  GBP: 0.026  // 1 TRY = 0.026 GBP
});

// Carousel referansı
const carouselRef = ref(null);

// Sıralama seçeneği
const sortBy = ref('releaseDate');

// Filtre değerleri
const priceMin = ref(0);
const priceMax = ref(1000);
const yearMin = ref(1900);
const yearMax = ref(2025);
const pageMin = ref(0);
const pageMax = ref(1000);

const filters = ref({
  category: '',
  language: '',
  priceRange: [0, 1000],
  yearRange: [1900, 2025],
  pageRange: [0, 1000],
  onlyFree: false
});

// Örnek kategori ve dil verileri
const categories = ref([
  'Roman', 'Bilim Kurgu', 'Tarih', 'Felsefe', 'Biyografi',
  'Psikoloji', 'Çocuk Kitapları', 'Bilim', 'İş', 'Teknoloji'
]);

const languages = ref([
  'Türkçe', 'İngilizce', 'Fransızca', 'Almanca', 'İspanyolca'
]);

const favorites = ref([]);

const allBooks = ref([
  ...featuredBooks.value,
  {
    id: 7,
    title: "Güneşin Altında",
    author: "Mehmet Kara",
    image: "https://picsum.photos/300/450?random=7",
    price: 85,
    discountedPrice: null,
    isFree: false,
    category: "Roman",
    language: "Türkçe",
    year: 2022,
    pages: 240,
    description: "Anadolu'da geçen etkileyici bir hikaye..."
  },
  {
    id: 8,
    title: "Yapay Zeka Temelleri",
    author: "Ali Tekin",
    image: "https://picsum.photos/300/450?random=8",
    price: 160,
    discountedPrice: 120,
    isFree: false,
    category: "Teknoloji",
    language: "Türkçe",
    year: 2024,
    pages: 380,
    description: "Yapay zeka ve makine öğrenimi konularında temel bilgiler..."
  },
]);

// Sonsuz scroll için daha fazla kitap yükleme fonksiyonu
const loadMoreBooks = async () => {
  if (isLoading.value || page.value >= totalPages.value) return;

  isLoading.value = true;
  // Simüle edilmiş API çağrısı
  setTimeout(() => {
    // Her yeni sayfada mevcut kitapların kopyalarını farklı ID'lerle ekleyelim
    const newBooks = allBooks.value.slice(0, 6).map(book => ({
      ...book,
      id: allBooks.value.length + Math.floor(Math.random() * 1000),
      title: `${book.title} - Kopya ${page.value}`,
      image: `https://picsum.photos/300/450?random=${allBooks.value.length + Math.floor(Math.random() * 100)}`
    }));

    allBooks.value = [...allBooks.value, ...newBooks];
    page.value++;
    isLoading.value = false;
  }, 1000);
};

// Sonsuz scroll için observer
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      loadMoreBooks();
    }
  }, { threshold: 0.1 });

  if (document.querySelector('.loading-indicator')) {
    observer.observe(document.querySelector('.loading-indicator'));
  }

  // Carousel genişliğini hesapla
  if (carouselRef.value) {
    nextTick(() => {
      slideWidth.value = carouselRef.value.offsetWidth * 0.8;
    });
  }

  // Window boyut değişikliğini dinle
  window.addEventListener('resize', handleResize);

  // Karüselin otomatik kaydırmasını başlat
  startAutoSlide();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  stopAutoSlide();
});

// Window boyut değişikliği için handler
const handleResize = debounce(() => {
  if (carouselRef.value) {
    slideWidth.value = carouselRef.value.offsetWidth * 0.8;
  }
}, 200);

// Carousel fonksiyonları
let interval;
const startAutoSlide = () => {
  interval = setInterval(() => {
    nextSlide();
  }, 5000);
};

const stopAutoSlide = () => {
  clearInterval(interval);
};

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % featuredBooks.value.length;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + featuredBooks.value.length) % featuredBooks.value.length;
};

const goToSlide = (index) => {
  currentIndex.value = index;
};

// Debounce ile arama fonksiyonu
const debouncedSearch = debounce(() => {
  // Burada API çağrısı yapılabilir
  console.log("Arama yapılıyor:", searchQuery.value);
}, 200);

// SearchQuery değiştiğinde debounce ile arama yap
watch(searchQuery, () => {
  debouncedSearch();
});

// Filtreleri temizleme fonksiyonu
const clearFilters = () => {
  filters.value = {
    category: '',
    language: '',
    priceRange: [priceMin.value, priceMax.value],
    yearRange: [yearMin.value, yearMax.value],
    pageRange: [pageMin.value, pageMax.value],
    onlyFree: false
  };
  searchQuery.value = '';
};

// Favorilere ekleme/çıkarma fonksiyonu
const toggleFavorite = (book) => {
  const index = favorites.value.findIndex(id => id === book.id);
  if (index === -1) {
    favorites.value.push(book.id);
  } else {
    favorites.value.splice(index, 1);
  }
};

// Favorilerde olup olmadığını kontrol etme
const isFavorite = (id) => {
  return favorites.value.includes(id);
};

// Kitap detaylarını açma
const openBookDetails = (book) => {
  console.log("Kitap detayları açılıyor:", book);
  // Burada kitap detay sayfasına yönlendirme veya modal açma işlemi yapılabilir
};

// Fiyat formatı (para birime göre)
const formatPrice = (price) => {
  if (price === 0) return "Ücretsiz";

  const currencySymbols = {
    TRY: "₺",
    USD: "$",
    EUR: "€",
    GBP: "£"
  };

  // Fiyatı seçilen para birimine çevir
  const convertedPrice = price * currencyRates.value[selectedCurrency.value];

  return `${currencySymbols[selectedCurrency.value]}${convertedPrice.toFixed(2)}`;
};

// Filtrelenmiş ve sıralanmış kitaplar
const filteredBooks = computed(() => {
  let result = allBooks.value.filter(book => {
    // Arama filtreleme
    if (searchQuery.value && !book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
        !book.author.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false;
    }

    // Kategori filtreleme
    if (filters.value.category && book.category !== filters.value.category) {
      return false;
    }

    // Dil filtreleme
    if (filters.value.language && book.language !== filters.value.language) {
      return false;
    }

    // Fiyat aralığı filtreleme
    const bookPrice = book.discountedPrice || book.price;
    if (bookPrice < filters.value.priceRange[0] || bookPrice > filters.value.priceRange[1]) {
      return false;
    }

    // Yayın yılı filtreleme
    if (book.year < filters.value.yearRange[0] || book.year > filters.value.yearRange[1]) {
      return false;
    }

    // Sayfa sayısı filtreleme
    if (book.pages < filters.value.pageRange[0] || book.pages > filters.value.pageRange[1]) {
      return false;
    }

    // Sadece ücretsiz filtreleme
    if (filters.value.onlyFree && !book.isFree) {
      return false;
    }

    return true;
  });

  // Sıralama
  switch (sortBy.value) {
    case 'releaseDate':
      result.sort((a, b) => b.year - a.year);
      break;
    case 'priceAsc':
      result.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
      break;
    case 'priceDesc':
      result.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
      break;
    case 'name':
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  return result;
});
</script>

<style scoped>
/* Ana container */
.main-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin: 40px auto;
  width: 90%;
  max-width: 1200px;
  background: #09090b;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Welcome Section */
.welcome-section {
  margin-bottom: 20px;
}

.book-info {
  padding: 12px;
}

.greeting {
  font-weight: 400;
  font-size: 20px;
  margin-bottom: 5px;
  color: #e2e2e2;
}

.subheading {
  font-weight: 400;
  font-size: 35px;
  margin-top: 0;
  color: #e2e2e2;
}

/* Section başlıkları */
.section-title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 20px;
  border-bottom: 2px solid #202020;
  padding-bottom: 10px;
  color: #e2e2e2;
}

/* Kitap Karüseli */
.featured-books {
  margin-bottom: 40px;
}

.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  margin: 0 auto;
}

.carousel {
  display: flex;
  overflow: hidden;
  border-radius: 10px;
  padding: 20px 0;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.carousel-item {
  min-width: 300px;
  padding: 0 10px;
  transform: scale(0.9);
  transition: transform 0.3s ease;
}

.carousel-item.active {
  transform: scale(1);
}

/* Genel Renkler ve Temalar */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-color: #e2e2e2;
  --dark-color: #101010;
  --background-color: #09090b;
  --text-color: #e2e2e2;
  --border-color: #202020;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
}

.section-title {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
}

.book-card {
  background: #202020;
  border: 1px solid var(--border-color);
}

.book-card:hover {
  border-color: var(--primary-color);
}

.book-overlay {
  background: rgba(0, 123, 255, 0.8);
}

.quick-view-btn {
  background: #fff;
  color: var(--primary-color);
}

.quick-view-btn:hover {
  background: var(--primary-color);
  color: #fff;
}

.favorite-icon {
  color: #fff;
}

.favorite-icon.favorited {
  color: #ff4d4d;
}

.favorite-icon:hover {
  color: #ff4d4d;
}

.clear-filters-btn {
  background: var(--danger-color);
  color: #fff;
}

.clear-filters-btn:hover {
  background: #c82333;
}

.view-btn.active {
  background: var(--primary-color);
  color: #fff;
}

/* Responsive Tasarım */
@media (max-width: 768px) {
  .main-container {
    width: 95%;
    margin: 20px auto;
  }

  .carousel-item {
    min-width: 250px;
  }

  .filters {
    flex-direction: column;
  }

  .filter-group {
    flex: 1 1 100%;
  }

  .view-controls {
    flex-direction: column;
    gap: 15px;
  }

  .book-display.grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .book-card.list-card {
    flex-direction: column;
    height: auto;
  }

  .book-card.list-card .book-image-container {
    width: 100%;
    height: 200px;
  }

  .book-card.list-card .book-info {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .carousel-item {
    min-width: 200px;
  }

  .book-display.grid {
    grid-template-columns: 1fr;
  }
}

/* Carousel navigation butonları */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.carousel-btn .icon {
  font-size: 24px;
}

.carousel-btn.left {
  left: 10px;
}

.carousel-btn.right {
  right: 10px;
}

.carousel-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

/* Carousel indicators */
.carousel-indicators {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* Tüm Kitaplar Bölümü */
.all-books {
  margin-bottom: 40px;
}

.book-display {
  display: grid;
  gap: 20px;
}

.book-display.grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.book-display.list {
  grid-template-columns: 1fr;
}

.book-item {
  background: #202020;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.book-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.book-card.list-card {
  display: flex;
  flex-direction: row;
  height: 200px;
}

.book-card.list-card .book-image-container {
  width: 150px;
  min-width: 150px;
}

.book-card.list-card .book-image {
  height: 100%;
  object-fit: cover;
}

.book-card.list-card .book-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.book-card.list-card .book-title {
  font-size: 18px;
  margin-bottom: 10px;
  color: #e2e2e2;
}

.book-card.list-card .book-author {
  font-size: 14px;
  color: #a0a0a0;
  margin-bottom: 10px;
}

.book-card.list-card .book-description {
  font-size: 14px;
  color: #a0a0a0;
  margin-bottom: 10px;
}

.book-card.list-card .book-details {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #777;
}

.book-card.list-card .book-price {
  font-size: 16px;
  font-weight: 500;
  color: #007bff;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 20px;
  font-size: 16px;
  color: #e2e2e2;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.indicator {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
}

.indicator.active {
  background: rgba(255, 255, 255, 0.6);
}

/* Kitap kartları */
.book-card {
  border-radius: 8px;
  overflow: hidden;
  background: #202020;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.book-card.list-card {
  display: flex;
  flex-direction: row;
  height: 200px;
}

.book-image-container {
  position: relative;
  overflow: hidden;
}

.book-card.list-card .book-image-container {
  width: 130px;
  min-width: 130px;
}

.book-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
}

.book-card.list-card .book-image {
  height: 100%;
  object-fit: cover;
}

.book-card:hover .book-image {
  transform: scale(1.05);
}

.book-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.quick-view-btn {
  background: #fff;
  color: #333;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 10px;
  transition: background 0.3s ease;
}

.quick-view-btn:hover {
  background: #f0f0f0;
}

.favorite-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.favorite-icon {
  transition: transform 0.3s ease, color 0.3s ease;
}

.favorite-icon:hover {
  transform: scale(1.2);
}

/* Filtreleme ve Kontrol Paneli */
.controls-section {
  background: #202020;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-bottom: 40px;
}

.filter-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  background: #101010;
  border-radius: 25px;
  padding: 10px 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 5px;
  background: transparent;
  color: #e2e2e2;
}

.search-icon {
  font-size: 20px;
  color: #e2e2e2;
  cursor: pointer;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.filter-group {
  flex: 1 1 200px;
}

.filter-select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #202020;
  font-size: 14px;
  background: #101010;
  color: #e2e2e2;
  outline: none;
  transition: border-color 0.3s ease;
}

.filter-select:focus {
  border-color: #007bff;
}

.range-filter {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.range-filter span {
  font-size: 14px;
  color: #e2e2e2;
}

.range-input {
  width: 100%;
  accent-color: #007bff;
}

.checkbox-filter {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #e2e2e2;
}

.checkbox-filter input {
  accent-color: #007bff;
}

.clear-filters-btn {
  background: #ff4d4d;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.clear-filters-btn:hover {
  background: #ff1a1a;
}

.view-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.sort-controls {
  flex: 1;
}

.sort-select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #202020;
  font-size: 14px;
  background: #101010;
  color: #e2e2e2;
  outline: none;
  transition: border-color 0.3s ease;
}

.sort-select:focus {
  border-color: #007bff;
}

.currency-selector {
  margin-left: 20px;
}

.currency-select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #202020;
  font-size: 14px;
  background: #101010;
  color: #e2e2e2;
  outline: none;
  transition: border-color 0.3s ease;
}

.currency-select:focus {
  border-color: #007bff;
}

.view-mode-toggle {
  display: flex;
  gap: 10px;
}

.view-btn {
  background: #101010;
  border: 1px solid #202020;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.view-btn.active {
  background: #007bff;
  border-color: #007bff;
  color: #fff;
}

.view-btn .grid-icon,
.view-btn .list-icon {
  font-size: 18px;
  color: #e2e2e2;
}
</style>