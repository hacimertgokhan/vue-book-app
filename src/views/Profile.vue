<template>
  <Layout>
    <div class="profile-container" :class="theme">
      <!-- User Information Card -->
      <section class="profile-card">
        <div class="profile-header">
          <h2>Kullanıcı Bilgileri</h2>
        </div>
        <div class="profile-avatar">
          <div class="avatar-circle">
            {{ userInitials }}
          </div>
        </div>
        <form @submit.prevent="saveUserInfo" class="profile-form">
          <div class="form-group">
            <label for="userName">Ad</label>
            <input
                id="userName"
                v-model="profileData.name"
                type="text"
                placeholder="Adınızı girin"
            />
          </div>

          <div class="form-group">
            <label for="userEmail">E-posta</label>
            <input
                id="userEmail"
                v-model="profileData.email"
                type="email"
                placeholder="E-posta adresinizi girin"
            />
          </div>

          <div class="form-group">
            <label for="userUsername">Kullanıcı Adı</label>
            <input
                id="userUsername"
                v-model="profileData.username"
                type="text"
                placeholder="Kullanıcı adınızı girin"
            />
          </div>

          <div class="form-actions">
            <button type="button" @click="resetForm" class="btn-cancel">
              İptal
            </button>
            <button type="submit" class="btn-save" :disabled="!formChanged">
              Kaydet
            </button>
          </div>
        </form>
      </section>

      <!-- Account Statistics -->
      <section class="profile-card">
        <div class="profile-header">
          <h2>Hesap İstatistikleri</h2>
        </div>
        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-value">{{ favorites?.length || 0 }}</div>
            <div class="stat-label">Favori Kitap</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userBooks?.length || 0 }}</div>
            <div class="stat-label">Eklenen Kitap</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userComments?.length || 0 }}</div>
            <div class="stat-label">Yorum</div>
          </div>
          <div class="stat-item-wide">
            <div class="stat-label">Favori Kategori</div>
            <div class="stat-value">{{ favoriteCategory || "Henüz Yok" }}</div>
          </div>
        </div>
      </section>

      <!-- Favorite Books -->
      <section class="profile-card">
        <div class="profile-header">
          <h2>Favori Kitaplar</h2>
        </div>
        <div class="content-list">
          <div v-if="favorites?.length" class="list-container">
            <div v-for="book in favorites" :key="book.id" class="list-item">
              <span>{{ book.title }}</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>Henüz favori kitap eklemediniz.</p>
          </div>
        </div>
      </section>

      <!-- User Books -->
      <section class="profile-card">
        <div class="profile-header">
          <h2>Eklediğiniz Kitaplar</h2>
        </div>
        <div class="content-list">
          <div v-if="userBooks?.length" class="list-container">
            <div v-for="book in userBooks" :key="book.id" class="list-item">
              <span>{{ book.title }}</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>Henüz kitap eklemediniz.</p>
          </div>
        </div>
      </section>

      <!-- User Comments -->
      <section class="profile-card">
        <div class="profile-header">
          <h2>Yorumlarınız</h2>
        </div>
        <div class="content-list">
          <div v-if="userComments?.length" class="list-container">
            <div v-for="comment in userComments" :key="comment.id" class="list-item comment-item">
              <div class="comment-book">{{ comment.bookTitle }}</div>
              <div class="comment-text">"{{ comment.text }}"</div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>Henüz yorum yapmadınız.</p>
          </div>
        </div>
      </section>
    </div>
  </Layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Layout from "@/components/Layout.vue";
import { computed, ref, reactive, onMounted, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  name: "UserProfile",
  components: { Layout },
  setup() {
    const store = useStore();
    const theme = computed(() => store.state.ui.theme || 'light');

    // User data form
    const profileData = reactive({
      name: "",
      email: "",
      username: ""
    });

    const originalData = ref({});
    const formChanged = computed(() => {
      return profileData.name !== originalData.value.name ||
          profileData.email !== originalData.value.email ||
          profileData.username !== originalData.value.username;
    });

    const userInitials = computed(() => {
      const name = profileData.name || '';
      if (!name) return '?';

      return name.split(' ')
          .map(part => part.charAt(0).toUpperCase())
          .slice(0, 2)
          .join('');
    });

    // Load user data
    onMounted(() => {
      const user = store.state.user.user;
      if (user) {
        profileData.name = user.name || '';
        profileData.email = user.email || '';
        profileData.username = user.username || '';

        // Store original values
        originalData.value = { ...profileData };
      }

      // Fetch comments
      store.dispatch("comments/fetchComments");
    });

    // Watch for user changes
    watch(() => store.state.user.user, (newUser) => {
      if (newUser) {
        profileData.name = newUser.name || '';
        profileData.email = newUser.email || '';
        profileData.username = newUser.username || '';
        originalData.value = { ...profileData };
      }
    });

    const saveUserInfo = () => {
      store.dispatch("user/updateUser", {
        name: profileData.name,
        email: profileData.email,
        username: profileData.username
      });

      // Update original data after save
      originalData.value = { ...profileData };
    };

    const resetForm = () => {
      profileData.name = originalData.value.name || '';
      profileData.email = originalData.value.email || '';
      profileData.username = originalData.value.username || '';
    };

    return {
      theme,
      profileData,
      formChanged,
      userInitials,
      saveUserInfo,
      resetForm
    };
  },
  computed: {
    ...mapState("user", ["user"]),
    ...mapState("favorites", ["favorites"]),
    ...mapState("books", ["books"]),
    ...mapState("comments", ["comments"]),

    userBooks() {
      return this.books?.filter(book => book.addedBy === this.user?.id) || [];
    },

    userComments() {
      return Array.isArray(this.comments)
          ? this.comments.filter(comment => comment.userId === this.user?.id)
          : [];
    },

    favoriteCategory() {
      if (!this.favorites || !Array.isArray(this.favorites) || this.favorites.length === 0) {
        return null;
      }

      const categories = {};
      this.favorites.forEach(book => {
        if (book.category) {
          categories[book.category] = (categories[book.category] || 0) + 1;
        }
      });

      return Object.keys(categories).reduce((a, b) =>
              categories[a] > categories[b] ? a : b
          , null);
    }
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 1160px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.profile-card {
  background-color: var(--color-card-bg, #ffffff);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.profile-header {
  padding: 15px;
  border-bottom: 1px solid var(--color-border, #eaeaea);
}

.profile-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-heading, #333333);
}

.profile-avatar {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--color-primary, #1976d2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
}

.profile-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--color-text, #333333);
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-border, #cccccc);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--color-input-bg, #ffffff);
  color: var(--color-text, #333333);
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: var(--color-primary, #1976d2);
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

button {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save {
  background-color: var(--color-primary, #1976d2);
  color: white;
  border: none;
}

.btn-save:hover {
  background-color: var(--color-primary-dark, #1565c0);
}

.btn-save:disabled {
  background-color: var(--color-disabled, #cccccc);
  cursor: not-allowed;
}

.btn-cancel {
  background-color: transparent;
  color: var(--color-text, #333333);
  border: 1px solid var(--color-border, #cccccc);
}

.btn-cancel:hover {
  background-color: var(--color-gray-light, #f5f5f5);
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  padding: 20px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  background-color: var(--color-stat-bg, rgba(25, 118, 210, 0.1));
}

.stat-item-wide {
  grid-column: span 3;
  text-align: center;
  padding: 15px;
  margin-top: 10px;
  border-radius: 8px;
  background-color: var(--color-stat-bg, rgba(25, 118, 210, 0.1));
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary, #1976d2);
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary, #666666);
}

.stat-item-wide .stat-value {
  font-size: 1.25rem;
}

.content-list {
  padding: 15px;
}

.list-container {
  max-height: 250px;
  overflow-y: auto;
}

.list-item {
  padding: 12px 15px;
  border-radius: 6px;
  background-color: var(--color-list-item-bg, #f9f9f9);
  margin-bottom: 8px;
  font-size: 0.95rem;
  color: var(--color-text, #333333);
}

.comment-item {
  padding: 15px;
}

.comment-book {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 1rem;
}

.comment-text {
  font-style: italic;
  color: var(--color-text-secondary, #666666);
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: var(--color-text-secondary, #666666);
}

/* Dark theme */
.dark {
  --color-card-bg: #1e1e1e;
  --color-border: #333333;
  --color-text-heading: #ffffff;
  --color-text: #e2e2e2;
  --color-text-secondary: #a0a0a0;
  --color-input-bg: #2d2d2d;
  --color-primary: #1976d2;
  --color-primary-dark: #1565c0;
  --color-disabled: #444444;
  --color-gray-light: #333333;
  --color-stat-bg: rgba(25, 118, 210, 0.15);
  --color-list-item-bg: #2d2d2d;
}

/* Light theme */
.light {
  --color-card-bg: #ffffff;
  --color-border: #eaeaea;
  --color-text-heading: #333333;
  --color-text: #333333;
  --color-text-secondary: #666666;
  --color-input-bg: #ffffff;
  --color-primary: #1976d2;
  --color-primary-dark: #1565c0;
  --color-disabled: #cccccc;
  --color-gray-light: #f5f5f5;
  --color-stat-bg: rgba(25, 118, 210, 0.1);
  --color-list-item-bg: #f9f9f9;
}

/* Media query for smaller screens */
@media (max-width: 768px) {
  .profile-container {
    grid-template-columns: 1fr;
  }
}
</style>