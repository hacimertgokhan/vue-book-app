<template>
  <div class="fullscreen" :style="{ backgroundColor: getThemeStyles.backgroundColor, color: getThemeStyles.textColor }">
    <div class="book-detail-container" :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }">
      <div v-if="book" class="book-content">
        <div class="book-image-section">
          <img :src="book.coverImage" height="350" :alt="book.title" class="book-cover" />
          <div class="book-actions">
            <button class="action-button primary" :style="{ backgroundColor: getThemeStyles.accentColor, color: getThemeStyles.buttonTextColor }">
              Satın Al
            </button>
            <button class="action-button secondary" :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor, borderColor: getThemeStyles.borderColor }">
              <span class="heart-icon">♥</span> Favorilere Ekle
            </button>
            <router-link to="/" class="back-button" :style="{ color: getThemeStyles.accentColor }">
              <span class="back-icon">←</span> Ana Sayfaya Dön
            </router-link>
          </div>
        </div>

        <div class="book-info-section">
          <h1 class="book-title" :style="{ color: getThemeStyles.textColor }">{{ book.title }}</h1>

          <div class="book-meta" :style="{ backgroundColor: getThemeStyles.inputBackgroundColor }">
            <div class="meta-item" :style="{ color: getThemeStyles.textColor }">
              <span class="label" :style="{ color: getThemeStyles.labelColor }">Yazar</span>
              <span class="value">{{ book.author }}</span>
            </div>
            <div class="meta-item" :style="{ color: getThemeStyles.textColor }">
              <span class="label" :style="{ color: getThemeStyles.labelColor }">Kategori</span>
              <span class="value category-tag">{{ book.category }}</span>
            </div>
            <div class="meta-item" :style="{ color: getThemeStyles.textColor }">
              <span class="label" :style="{ color: getThemeStyles.labelColor }">Yayın Yılı</span>
              <span class="value">{{ book.year }}</span>
            </div>
            <div class="meta-item" :style="{ color: getThemeStyles.textColor }">
              <span class="label" :style="{ color: getThemeStyles.labelColor }">Sayfa Sayısı</span>
              <span class="value">{{ book.pageCount }}</span>
            </div>
          </div>

          <div class="book-description" :style="{ color: getThemeStyles.textColor }">
            <h2 :style="{ color: getThemeStyles.textColor }">Kitap Hakkında</h2>
            <p>{{ book.summary }}</p>
          </div>

          <div class="price-section" v-if="book.price" :style="{ backgroundColor: getThemeStyles.inputBackgroundColor }">
            <div class="price-tag" v-if="book.discountedPrice">
              <span class="original-price">{{ book.price }}₺</span>
              <span class="discounted-price">{{ book.discountedPrice }}₺</span>
              <span class="discount-badge">
                %{{ Math.round((1 - book.discountedPrice/book.price) * 100) }} İndirim
              </span>
            </div>
            <div class="price-tag" v-else>
              <span class="current-price">{{ book.price }}₺</span>
            </div>
          </div>
        </div>

        <!-- Yorum Bölümü -->
        <div class="comments-section" :style="{ backgroundColor: getThemeStyles.inputBackgroundColor }">
          <h2 :style="{ color: getThemeStyles.textColor }">Yorumlar</h2>
          <div v-if="currentUser" class="comment-form">
            <div class="comment-avatar">
              <img :src="currentUser.avatar || ''" alt="Profil Fotoğrafı">
            </div>
            <textarea v-model="newCommentText" placeholder="Yorumunuzu buraya yazın..." :style="{ backgroundColor: getThemeStyles.backgroundColor, color: getThemeStyles.textColor }"></textarea>
            <button @click="addComment" :style="{ backgroundColor: getThemeStyles.accentColor, color: getThemeStyles.buttonTextColor }">Yorum Ekle</button>
          </div>
          <p v-else :style="{ color: getThemeStyles.textColor }">Yorum yapmak için lütfen giriş yapın.</p>

          <div v-if="comments && comments.length > 0" class="comment-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item" :style="{ backgroundColor: getThemeStyles.backgroundColor, color: getThemeStyles.textColor }">
              <div class="comment-avatar">
                <img :src="comment.avatar" alt="Kullanıcı Avatarı">
              </div>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-username" :style="{ color: getThemeStyles.accentColor }">{{ comment.username }}</span>
                  <span class="comment-date">{{ formatDate(comment.id) }}</span>
                </div>
                <p class="comment-text">
                  {{ comment.text }}
                </p>
              </div>
            </div>
          </div>
          <p v-else :style="{ color: getThemeStyles.textColor }">Bu kitap için henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
        </div>
      </div>

      <div v-else class="not-found">
        <h2>Kitap Bulunamadı</h2>
        <p>Aradığınız kitap mevcut değil veya kaldırılmış olabilir.</p>
        <router-link to="/" class="back-button not-found-back" :style="{ color: getThemeStyles.accentColor }">
          <span class="back-icon">←</span> Ana Sayfaya Dön
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fullscreen {
  width: 100%;
  height: 100%;
  position: absolute;
}

.book-detail-container {
  max-width: 1280px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.book-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  align-items: start;
}

.book-image-section {
  padding: 1rem;
}

.book-cover {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.book-cover:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
}

.book-actions {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-button {
  padding: 1rem;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button.primary {
  box-shadow: 0 4px 14px rgba(0, 123, 255, 0.3);
}

.action-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.action-button.secondary {
  border: 1px solid;
  background-clip: padding-box;
}

.action-button.secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.heart-icon {
  color: #ff4d4d;
  margin-right: 0.5rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  margin-top: 1.5rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateX(-5px);
}

.back-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.book-info-section {
  padding: 1rem;
}

.book-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  line-height: 1.2;
}

.book-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: 1.1rem;
  font-weight: 500;
}

.category-tag {
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  font-size: 0.95rem;
}

.book-description {
  margin: 2rem 0;
  line-height: 1.8;
}

.book-description h2 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.price-section {
  padding: 1.5rem;
  border-radius: 16px;
  margin-top: 2rem;
}

.price-tag {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.original-price {
  font-size: 1.2rem;
  text-decoration: line-through;
  opacity: 0.7;
}

.discounted-price, .current-price {
  font-size: 2rem;
  font-weight: 700;
  color: #4ade80;
}

.discount-badge {
  padding: 0.5rem 1rem;
  background: #4ade80;
  color: white;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 600;
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.not-found h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.not-found-back {
  margin-top: 2rem;
}

/* Yorumlar Bölümü */
.comments-section {
  margin-top: 3rem;
  padding: 2rem;
  border-radius: 16px;
}

.comments-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

/* Yorum Formu */
.comment-form {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comment-form textarea {
  flex: 1;
  padding: 1rem;
  border-radius: 12px;
  border: none;
  resize: vertical;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.comment-form textarea:focus {
  outline: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.comment-form button {
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap; /* Butonun içeriği kaydırmasını engeller */
}

/* Yorum Listesi */
.comment-list {
  margin-top: 2rem;
}

.comment-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.comment-item:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.comment-username {
  font-weight: 600;
  margin-right: 0.5rem;
  font-size: 1rem;
}

.comment-date {
  font-size: 0.8rem;
  color: #999;
}

.comment-text {
  font-size: 1rem;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .book-content {
    grid-template-columns: 1fr 1.5fr;
    gap: 2rem;
  }

  .book-title {
    font-size: 2rem;
  }

  .comments-section {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .book-detail-container {
    margin: 1rem;
    padding: 1.5rem;
  }

  .book-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .book-image-section {
    max-width: 320px;
    margin: 0 auto;
  }

  .book-title {
    font-size: 1.8rem;
  }

  .book-meta {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

@media (max-width: 480px) {
  .book-detail-container {
    padding: 1rem;
  }

  .action-button {
    padding: 0.8rem;
    font-size: 0.9rem;
  }

  .book-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .price-tag {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .comments-section {
    padding: 1rem;
  }
}
</style>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
  setup() {
    const route = useRoute();
    const store = useStore();
    const book = ref(null);
    const newCommentText = ref('');

    const theme = computed(() => store.state.ui.theme);
    const currentUser = computed(() => store.state.user.user);

    const getThemeStyles = computed(() => {
      const isDarkTheme = theme.value === 'dark';
      return {
        backgroundColor: isDarkTheme ? '#09090b' : '#FFFFFF',
        textColor: isDarkTheme ? '#e2e2e2' : '#333333',
        borderColor: isDarkTheme ? '#202020' : '#DDDDDD',
        accentColor: '#007bff',
        inputBackgroundColor: isDarkTheme ? '#101010' : '#f9f9f9',
        buttonTextColor: '#FFFFFF',
        labelColor: isDarkTheme ? '#909090' : '#777777',
      };
    });

    const bookId = computed(() => parseInt(route.params.id));
    const comments = computed(() => store.state.comments.comments[bookId.value] || []);

    onMounted(() => {
      const storedBooks = localStorage.getItem('books');
      if (storedBooks) {
        const books = JSON.parse(storedBooks);
        book.value = books.find((b) => b.id === bookId.value);
      }
      store.dispatch('comments/fetchComments', bookId.value);
    });

    const addComment = () => {
      if (!currentUser.value) {
        alert('Yorum yapmak için lütfen giriş yapın.');
        return;
      }

      if (newCommentText.value.trim() === '') {
        alert('Lütfen yorumunuzu yazın.');
        return;
      }

      const comment = {
        id: Date.now(),
        text: newCommentText.value,
        userId: currentUser.value.id,
        username: currentUser.value.username,
        avatar: currentUser.value.avatar // Kullanıcının avatarını da ekleyelim
      };

      store.dispatch('comments/addComment', { bookId: bookId.value, comment });
      newCommentText.value = '';
    };

    // Tarih formatlama fonksiyonu
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    return {
      book,
      newCommentText,
      comments,
      currentUser,
      getThemeStyles,
      addComment,
      formatDate //fonksiyonu export ettik
    };
  },
};
</script>