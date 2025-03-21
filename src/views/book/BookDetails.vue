<template>
  <Layout>
    <div
        class="fullscreen"
        :style="{
      backgroundColor: getThemeStyles.backgroundColor,
      color: getThemeStyles.textColor,
    }"
    >
      <div
          class="book-detail-container"
          :style="{
        backgroundColor: getThemeStyles.backgroundColor,
        color: getThemeStyles.textColor,
      }"
      >
        <div
            v-if="book"
            class="book-main-section"
            :style="{ backgroundColor: getThemeStyles.inputBackgroundColor }"
        >
          <div class="book-image-container">
            <img
                :src="book.coverImage || '/default-book-cover.jpg'"
                alt="Kitap Kapağı"
                class="book-cover"
            />
            <div class="book-actions">
              <button
                  class="action-button primary"
                  :style="{
                backgroundColor: getThemeStyles.accentColor,
                color: getThemeStyles.buttonTextColor,
              }"
                  @click="toggleFavorite"
              >
                <i class="fas fa-bookmark"></i>
                {{ isFavorite ? "Kitaplıktan Çıkar" : "Kitaplığıma Ekle" }}
              </button>
              <button
                  class="action-button secondary"
                  :style="{
                backgroundColor: getThemeStyles.backgroundColor,
                color: getThemeStyles.textColor,
                borderColor: getThemeStyles.borderColor,
              }"
                  @click="shareBook"
              >
                <i class="fas fa-share-alt"></i> Paylaş
              </button>
            </div>
          </div>

          <div class="book-info">
            <div
                class="book-category"
                :style="{ color: getThemeStyles.accentColor }"
            >
              {{ book.category }}
            </div>
            <h1 class="book-title" :style="{ color: getThemeStyles.textColor }">
              {{ book.title }}
            </h1>
            <div class="book-author" :style="{ color: getThemeStyles.labelColor }">
              {{ book.author }}
            </div>

            <div class="book-stats">
              <div
                  class="stat-item"
                  :style="{ borderColor: getThemeStyles.borderColor }"
              >
                <div
                    class="stat-value"
                    :style="{ color: getThemeStyles.accentColor }"
                >
                  {{ book.rating }}
                </div>
                <div
                    class="stat-label"
                    :style="{ color: getThemeStyles.labelColor }"
                >
                  Puan
                </div>
              </div>
              <div
                  class="stat-item"
                  :style="{ borderColor: getThemeStyles.borderColor }"
              >
                <div class="stat-value">{{ book.reviewCount }}</div>
                <div
                    class="stat-label"
                    :style="{ color: getThemeStyles.labelColor }"
                >
                  Değerlendirme
                </div>
              </div>
              <div
                  class="stat-item"
                  :style="{ borderColor: getThemeStyles.borderColor }"
              >
                <div class="stat-value">{{ book.pageCount }}</div>
                <div
                    class="stat-label"
                    :style="{ color: getThemeStyles.labelColor }"
                >
                  Sayfa
                </div>
              </div>
            </div>

            <div class="book-description" :style="{ color: getThemeStyles.textColor }">
              <h3>Kitap Hakkında</h3>
              <p>{{ book.description }}</p>
            </div>

            <div class="book-details">
              <div
                  class="detail-row"
                  :style="{ borderColor: getThemeStyles.borderColor }"
              >
                <div
                    class="detail-label"
                    :style="{ color: getThemeStyles.labelColor }"
                >
                  Yayınevi:
                </div>
                <div class="detail-value">{{ book.publisher }}</div>
              </div>
              <div
                  class="detail-row"
                  :style="{ borderColor: getThemeStyles.borderColor }"
              >
                <div
                    class="detail-label"
                    :style="{ color: getThemeStyles.labelColor }"
                >
                  Yayın Tarihi:
                </div>
                <div class="detail-value">{{ book.publishDate }}</div>
              </div>
              <div
                  class="detail-row"
                  :style="{ borderColor: getThemeStyles.borderColor }"
              >
                <div
                    class="detail-label"
                    :style="{ color: getThemeStyles.labelColor }"
                >
                  ISBN:
                </div>
                <div class="detail-value">{{ book.isbn }}</div>
              </div>
              <div
                  class="detail-row"
                  :style="{ borderColor: getThemeStyles.borderColor }"
              >
                <div
                    class="detail-label"
                    :style="{ color: getThemeStyles.labelColor }"
                >
                  Dil:
                </div>
                <div class="detail-value">{{ book.language }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Yorum Bölümü -->
        <div
            class="comments-section"
            :style="{ backgroundColor: getThemeStyles.inputBackgroundColor }"
        >
          <div class="comments-header">
            <h2 :style="{ color: getThemeStyles.textColor }">
              Yorumlar
              <span
                  class="comment-count"
                  :style="{ backgroundColor: getThemeStyles.accentColor }"
              >
              {{ comments.length }}
            </span>
            </h2>
            <div class="comments-filter">
              <button
                  class="filter-button"
                  :style="{
                backgroundColor: getThemeStyles.backgroundColor,
                color: getThemeStyles.textColor,
                borderColor: getThemeStyles.borderColor,
              }"
              >
                En Yeniler
                <span class="filter-icon">↓</span>
              </button>
            </div>
          </div>

          <div v-if="currentUser?.valueOf()" class="comment-form">
            <div
                class="comment-input-wrapper"
                :style="{ backgroundColor: getThemeStyles.backgroundColor }"
            >
              <div class="comment-avatar">
                <img
                    :src="currentUser.valueOf().avatar || 'https://i.pravatar.cc/48?img=1'"
                    alt="Profil Fotoğrafı"
                />
              </div>
              <textarea
                  v-model="newCommentText"
                  placeholder="Bu kitap hakkında ne düşünüyorsunuz?"
                  :style="{
                backgroundColor: getThemeStyles.backgroundColor,
                color: getThemeStyles.textColor,
                borderColor: getThemeStyles.borderColor,
              }"
              ></textarea>
            </div>
            <div class="comment-actions">
              <button
                  class="cancel-button"
                  :style="{
                backgroundColor: getThemeStyles.backgroundColor,
                color: getThemeStyles.textColor,
                borderColor: getThemeStyles.borderColor,
              }"
                  @click="cancelComment"
              >
                İptal
              </button>
              <button
                  @click="addComment"
                  class="submit-button"
                  :style="{
                backgroundColor: getThemeStyles.accentColor,
                color: getThemeStyles.buttonTextColor,
              }"
              >
                Yorum Ekle
              </button>
            </div>
          </div>

          <div v-if="comments && comments.length > 0" class="comment-list">
            <div
                v-for="comment in comments"
                :key="comment.id"
                class="comment-item"
                :style="{
              backgroundColor: getThemeStyles.backgroundColor,
              borderColor: getThemeStyles.borderColor,
            }"
            >
              <div class="comment-main">
                <div class="comment-avatar">
                  <img :src="comment.avatar" alt="Kullanıcı Avatarı" />
                </div>
                <div class="comment-content">
                  <div class="comment-header">
                    <div class="user-info">
                    <span
                        class="comment-username"
                        :style="{ color: getThemeStyles.accentColor }"
                    >
                      {{ comment.username }}
                    </span>
                      <span
                          class="user-badge"
                          :style="{ backgroundColor: getThemeStyles.accentColor + '20' }"
                      >
                      Okuyucu
                    </span>
                    </div>
                    <span
                        class="comment-date"
                        :style="{ color: getThemeStyles.labelColor }"
                    >
                    {{ formatDate(comment.id) }}
                  </span>
                  </div>
                  <p class="comment-text">{{ comment.text }}</p>
                  <div class="comment-actions">
                    <button
                        class="action-btn"
                        :style="{ color: getThemeStyles.labelColor }"
                    >
                      <span class="action-icon">👍</span>
                      Beğen ({{ comment.likes || 0 }})
                    </button>
                    <button
                        class="action-btn"
                        :style="{ color: getThemeStyles.labelColor }"
                        @click="replyToComment(comment)"
                    >
                      <span class="action-icon">💬</span>
                      Yanıtla
                    </button>
                    <button
                        v-if="currentUser?.valueOf().user?.username === comment.username"
                        class="action-btn"
                        :style="{ color: getThemeStyles.labelColor }"
                        @click="editComment(comment)"
                    >
                      <span class="action-icon">✍️</span>
                      Düzenle
                    </button>
                    <button
                        v-if="currentUser?.valueOf().user?.username === comment.username"
                        class="action-btn"
                        :style="{ color: getThemeStyles.labelColor }"
                        @click="deleteComment(comment)"
                    >
                      <span class="action-icon">🗑️</span>
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="login-prompt" :style="{ color: getThemeStyles.textColor }">
            Yorum yapmak için lütfen
            <a href="/login" :style="{ color: getThemeStyles.accentColor }">giriş yapın</a>.
          </div>
          <div
              v-if="!currentUser?.valueOf()"
              class="no-comments"
              :style="{
            backgroundColor: getThemeStyles.backgroundColor,
            color: getThemeStyles.labelColor,
          }"
          >
            <span class="no-comments-icon">💭</span>
            <p>Yorumları görmek için lütfen giriş yapın!</p>
          </div>
        </div>

        <!-- Benzer Kitaplar Bölümü -->
        <div
            class="similar-books-section"
            :style="{ backgroundColor: getThemeStyles.inputBackgroundColor }"
        >
          <h2 :style="{ color: getThemeStyles.textColor }">Benzer Kitaplar</h2>

          <div class="similar-books-grid">
            <div
                v-for="similarBook in similarBooks"
                :key="similarBook.id"
                class="similar-book-card"
                :style="{
              backgroundColor: getThemeStyles.backgroundColor,
              borderColor: getThemeStyles.borderColor,
            }"
                @click="navigateToBook(similarBook.id)"
            >
              <img
                  :src="similarBook.coverImage"
                  alt="Kitap Kapağı"
                  class="similar-book-cover"
              />
              <div class="similar-book-info">
                <h4 :style="{ color: getThemeStyles.textColor }">
                  {{ similarBook.title }}
                </h4>
                <p :style="{ color: getThemeStyles.labelColor }">
                  {{ similarBook.author }}
                </p>
                <div
                    class="similar-book-rating"
                    :style="{ color: getThemeStyles.accentColor }"
                >
                  <span class="rating-stars">★★★★☆</span>
                  <span>{{ similarBook.rating }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
            class="return-home-button"
            @click="returnToHomePage"
            :style="{
              backgroundColor: getThemeStyles.backgroundColor,
              color: getThemeStyles.textColor,
              borderColor: getThemeStyles.borderColor,
          }"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    </div>

  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";
import Layout from "@/components/Layout.vue";

const toast = useToast();
const router = useRouter();
const route = useRoute();
const store = useStore();

const theme = computed(() => store.state.ui.theme);
const bookStore = computed(() => store.state.books);

const bookId = route.params.id;
const book = ref(null);

const similarBooks = ref([]);

const currentUser = computed(() => store.state.user.user || { user: null });

const newCommentText = ref("");
const isFavorite = ref(false);

const editingComment = ref(null);
const replyingToComment = ref(null);

const getThemeStyles = computed(() => {
  const isDarkTheme = theme.value === "dark";
  return {
    backgroundColor: isDarkTheme ? "#09090b" : "#FFFFFF",
    textColor: isDarkTheme ? "#e2e2e2" : "#333333",
    borderColor: isDarkTheme ? "#202020" : "#DDDDDD",
    accentColor: "#007bff",
    buttonTextColor: "#FFFFFF",
    labelColor: isDarkTheme ? "#a0a0a0" : "#777",
    boxShadow: isDarkTheme
        ? "0 4px 12px rgba(255, 255, 255, 0.1)"
        : "0 4px 12px rgba(0, 0, 0, 0.2)",
    inputBackgroundColor: isDarkTheme ? "#101010" : "#f9f9f9",
    selectBackgroundColor: isDarkTheme ? "#101010" : "#f9f9f9",
  };
});

const comments = computed(() => store.state.comments.comments[bookId] || []);

const addComment = async () => {
  if (newCommentText.value.trim() === "") return;

  const comment = {
    id: Date.now(),
    username: currentUser.value.user?.username || "Misafir",
    avatar: currentUser.value.user?.avatar || "https://i.pravatar.cc/48?img=1",
    text: newCommentText.value,
    likes: 0,
  };

  await store.dispatch("comments/addComment", { bookId: parseInt(bookId), comment });
  newCommentText.value = "";
  toast.success("Yorumunuz başarıyla eklendi!");
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const navigateToBook = (bookId) => {
  router.push(`/book/${bookId}`);
};

const returnToHomePage = () => {
  router.push("/");
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
  toast.success(
      isFavorite.value
          ? "Kitap favorilerinize eklendi!"
          : "Kitap favorilerinizden çıkarıldı!"
  );
};

const shareBook = () => {
  const shareUrl = `${window.location.origin}/book/${bookId}`;

  navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast.success("Kitap bağlantısı panoya kopyalandı!");
      })
      .catch((err) => {
        console.error("Panoya kopyalama başarısız oldu: ", err);
        toast.error("Kitap bağlantısı kopyalanamadı.");
      });
};

const cancelComment = () => {
  newCommentText.value = "";
};

const editComment = (comment) => {
  editingComment.value = comment;
  newCommentText.value = comment.text;
};

const deleteComment = (commentToDelete) => {

  toast.success("Yorum başarıyla silindi!");
};

const replyToComment = (comment) => {
  replyingToComment.value = comment;
  toast.info(`@${comment.username} kullanıcısına yanıt veriyorsunuz.`);
};

onMounted(async () => {
  try {
    await store.dispatch("books/fetchBooks");
    book.value = store.getters["books/getBookById"](parseInt(bookId));

    if (!book.value) {
      toast.error("Kitap bulunamadı!");
      router.push("/");
      return;
    }

    await store.dispatch("comments/fetchComments", parseInt(bookId));

    similarBooks.value = bookStore.value.books
        .filter((b) => b.category === book.value.category && b.id !== book.value.id)
        .slice(0, 4);
  } catch (error) {
    console.error("Kitap verileri yüklenirken hata oluştu:", error);
    toast.error("Kitap bilgileri yüklenirken bir hata oluştu.");
  }
});
</script>

<style scoped>
.fullscreen {
  min-height: 100vh;
  padding: 20px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.book-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.book-main-section {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  border-radius: 24px;
}

.book-image-container {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.book-cover {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.book-actions {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.action-button {
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.action-button.secondary {
  border: 1px solid;
}

.book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.book-category {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
}

.book-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.book-author {
  font-size: 1.3rem;
  font-weight: 500;
}

.book-stats {
  display: flex;
  gap: 2rem;
  margin: 1rem 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.8rem 1.5rem;
  border-right: 1px solid;
}

.stat-item:last-child {
  border-right: none;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.9rem;
}

.book-description h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.book-description p {
  line-height: 1.7;
  font-size: 1.05rem;
}

.book-details {
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
}

.detail-row {
  display: flex;
  padding: 0.8rem 0;
  border-bottom: 1px solid;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  flex: 0 0 150px;
  font-weight: 600;
}

.detail-value {
  flex: 1;
}

/* Yorum Bölümü */
.comments-section {
  margin-top: 1rem;
  padding: 2rem;
  border-radius: 24px;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.comments-header h2 {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.8rem;
  font-weight: 700;
}

.comment-count {
  font-size: 0.9rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  color: white;
}

.comments-filter {
  display: flex;
  gap: 1rem;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  border: 1px solid;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.comment-input-wrapper {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 1rem;
}

.comment-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

textarea {
  flex: 1;
  min-height: 100px;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid;
  resize: vertical;
  font-size: 1rem;
  line-height: 1.5;
  transition: all 0.3s ease;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.submit-button,
.cancel-button {
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button {
  border: 1px solid;
}

.comment-item {
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 1rem;
  border: 1px solid;
  transition: all 0.2s ease;
}

.comment-main {
  display: flex;
  gap: 1rem;
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

.user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.comment-username {
  font-weight: 600;
  font-size: 1rem;
}

.user-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.comment-date {
  font-size: 0.85rem;
}

.comment-text {
  margin: 0.8rem 0;
  line-height: 1.6;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.action-icon {
  font-size: 1.1rem;
}

.no-comments {
  text-align: center;
  padding: 3rem 2rem;
  border-radius: 16px;
}

.no-comments-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
}

.login-prompt {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.login-prompt a {
  text-decoration: none;
  font-weight: 600;
}

/* Benzer Kitaplar Bölümü */
.similar-books-section {
  padding: 2rem;
  border-radius: 24px;
}

.similar-books-section h2 {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 700;
}

.similar-books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.similar-book-card {
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid;
}

.similar-book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.similar-book-cover {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.similar-book-info {
  padding: 1rem;
}

.similar-book-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
}

.similar-book-info p {
  margin: 0 0 0.8rem 0;
  font-size: 0.9rem;
}

.similar-book-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.return-home-button {
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  border: 1px solid;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  margin: 20px auto;
  display: block;
  max-width: 200px;
}

/* Responsive Tasarım */
@media (max-width: 1024px) {
  .book-main-section {
    flex-direction: column;
  }

  .book-image-container {
    flex: 0 0 auto;
    max-width: 300px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .comments-section,
  .similar-books-section,
  .book-main-section {
    padding: 1.5rem;
  }

  .comments-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .comment-main {
    flex-direction: column;
  }

  .book-stats {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .stat-item {
    flex: 1 0 calc(50% - 1rem);
    border-right: none;
    border-bottom: 1px solid;
    margin-bottom: 0.5rem;
  }

  .similar-books-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  @media (max-width: 480px) {
    .book-title {
      font-size: 1.8rem;
    }

    .similar-books-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .detail-row {
      flex-direction: column;
      gap: 0.3rem;
    }

    .detail-label {
      flex: 0 0 auto;
    }
  }
}
</style>