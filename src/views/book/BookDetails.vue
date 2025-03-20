<template>
  <div class="book-detail-container">
    <div v-if="book" class="book-content">
      <div class="book-image-section">
        <img :src="book.image" :alt="book.title" class="book-cover" />
        <div class="book-actions">
          <button class="action-button primary">Satın Al</button>
          <button class="action-button secondary">
            <span class="heart-icon">♥</span> Favorilere Ekle
          </button>
        </div>
      </div>

      <div style="position:relative;" class="book-info-section">
        <h1 class="book-title">{{ book.title }}</h1>

        <div class="book-meta">
          <div class="meta-item">
            <span class="label">Yazar</span>
            <span class="value">{{ book.author }}</span>
          </div>

          <div class="meta-item">
            <span class="label">Kategori</span>
            <span class="value category-tag">{{ book.category }}</span>
          </div>

          <div class="meta-item">
            <span class="label">Yayın Yılı</span>
            <span class="value">{{ book.year }}</span>
          </div>

          <div class="meta-item">
            <span class="label">Sayfa Sayısı</span>
            <span class="value">{{ book.pages }}</span>
          </div>
        </div>

        <div class="book-description">
          <h2>Kitap Hakkında</h2>
          <p>{{ book.description }}</p>
        </div>

        <div class="price-section" v-if="book.price">
          <div class="price-tag" v-if="book.discountedPrice">
            <span class="original-price">{{ book.price }}₺</span>
            <span class="discounted-price">{{ book.discountedPrice }}₺</span>
            <span class="discount-percentage">
              {{ Math.round((1 - book.discountedPrice/book.price) * 100) }}% İndirim
            </span>
          </div>
          <div class="price-tag" v-else>
            <span class="current-price">{{ book.price }}₺</span>
          </div>
        </div>
        <a style="position:absolute;bottom: 0; right: 0;" href="/public">Ana sayfaya dön</a>
      </div>
    </div>

    <div v-else class="not-found">
      <h2>Kitap bulunamadı.</h2>
      <p>Aradığınız kitap mevcut değil veya kaldırılmış olabilir.</p>
      <a href="/public">Ana sayfaya dön</a>
    </div>
  </div>
</template>

<style scoped>
.book-detail-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #09090b;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.book-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 3rem;
  color: #e2e2e2;
}

.book-image-section {
  position: sticky;
  top: 2rem;
}

.book-cover {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.book-actions {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-button {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button.primary {
  background-color: #3b82f6;
  color: white;
}

.action-button.primary:hover {
  background-color: #2563eb;
}

.action-button.secondary {
  background-color: #202020;
  color: #e2e2e2;
  border: 1px solid #404040;
}

.action-button.secondary:hover {
  background-color: #101010;
}

.heart-icon {
  color: #ff4d4d;
  margin-right: 0.5rem;
}

.book-info-section {
  padding: 1rem 0;
}

.book-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2rem;
}

.book-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #101010;
  border-radius: 12px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.9rem;
  color: #909090;
}

.value {
  font-size: 1.1rem;
  font-weight: 500;
}

.category-tag {
  display: inline-block;
  padding: 0.3rem 1rem;
  background-color: #202020;
  border-radius: 20px;
  font-size: 0.9rem;
}

.book-description {
  margin: 2rem 0;
  line-height: 1.6;
}

.book-description h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.price-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #101010;
  border-radius: 12px;
}

.price-tag {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.original-price {
  font-size: 1.2rem;
  text-decoration: line-through;
  color: #909090;
}

.discounted-price, .current-price {
  font-size: 2rem;
  font-weight: 700;
  color: #4ade80;
}

.discount-percentage {
  padding: 0.3rem 0.8rem;
  background-color: #4ade80;
  color: #101010;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
  color: #e2e2e2;
}

.not-found h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .book-content {
    grid-template-columns: 1fr;
  }

  .book-image-section {
    position: static;
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { featuredBooks } from '../../utils/customDatas.js';

export default {
  setup() {
    const route = useRoute();
    const book = ref(null);

    onMounted(() => {
      const bookId = parseInt(route.params.id);
      book.value = featuredBooks.value.find((b) => b.id === bookId);
      console.log(book.value);
    });

    return {
      book,
    };
  },
};
</script>