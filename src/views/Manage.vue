<script setup>
import Layout from "../components/Layout.vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const viewMode = ref('grid'); // Varsayılan görünüm: grid
const books = ref([]); // Kitapları tutacak reaktif bir dizi
const searchQuery = ref('');

onMounted(() => {
  loadBooks(); // Sayfa yüklendiğinde kitapları yükle
});

const loadBooks = () => {
  try {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      books.value = JSON.parse(storedBooks).map(book => ({ ...book, showEdit: false }));
    } else {
      books.value = []; // Eğer hiç kitap yoksa boş bir dizi ata
    }
  } catch (error) {
    console.error("Kitaplar yüklenirken bir hata oluştu:", error);
    books.value = []; // Hata durumunda da boş bir dizi ata ki uygulama çökmesin
  }
};

const filteredBooks = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return books.value.filter(book =>
      book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
  );
});

const switchViewMode = (mode) => {
  viewMode.value = mode; // Görünüm modunu güncelle
};

const navigateToEdit = (bookId) => {
  router.push(`/edit-book/${bookId}`); // Düzenleme sayfasına yönlendir
};

const navigateToAdd = () => {
  router.push('/add-book'); // Ekleme sayfasına yönlendir
};

</script>

<template>
  <Layout>
    <div class="main-container">
      <header class="welcome-section">
        <h1 class="greeting">Merhaba!</h1>
        <h2 class="subheading">Bu gün hangi kitaplara göz gezdirmek istersin?</h2>
      </header>

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
        </div>

        <div class="view-controls">
          <div class="view-mode-toggle">
            <button class="view-btn" :class="{ 'active': viewMode === 'grid' }" @click="switchViewMode('grid')">
              <span class="grid-icon">▦</span>
            </button>
            <button class="view-btn" :class="{ 'active': viewMode === 'list' }" @click="switchViewMode('list')">
              <span class="list-icon">≡</span>
            </button>
          </div>

          <button class="add-book-button" @click="navigateToAdd">Kitap Ekle</button>
        </div>
      </section>

      <section class="all-books">
        <h3 class="section-title">Tüm Kitaplar</h3>
        <div v-if="!filteredBooks.length" class="no-books-message">
          Kriterlere uygun kitap bulunamadı.
        </div>
        <div v-else class="book-display" :class="viewMode">
          <div v-for="book in filteredBooks" :key="book.id" class="book-item"
               @mouseover="book.showEdit = true"
               @mouseleave="book.showEdit = false">
            <div class="book-card" :class="{ 'list-card': viewMode === 'list' }">
              <div class="book-image-container">
                <img :src="book.coverImage" :alt="book.title" class="book-image" />
              </div>
              <div class="book-info">
                <h4 class="book-title">{{ book.title }}</h4>
                <p class="book-author">{{ book.author }}</p>
                <p v-if="viewMode === 'list'" class="book-description">{{ book.summary }}</p>
              </div>
              <div class="book-overlay" v-if="book.showEdit">
                <button class="quick-view-btn" @click="navigateToEdit(book.id)">Düzenle</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </Layout>
</template>

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

/* Filtreleme ve Kontrol Paneli */
.controls-section {
  background: #202020;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-controls {
  display: flex;
  align-items: center;
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

.view-controls {
  display: flex;
  align-items: center;
  gap: 20px;
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

.add-book-button {
  background-color: #4caf50;
  color: #e2e2e2;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.add-book-button:hover {
  background-color: #388e3c;
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

.no-books-message {
  padding: 20px;
  font-size: 16px;
  color: #e2e2e2;
}
</style>