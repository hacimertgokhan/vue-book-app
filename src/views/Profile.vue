<template>
  <Layout>
    <div class="profile-container">
      <section class="profile-section">
        <h2>Kullanıcı Bilgileri</h2>
        <form @submit.prevent="updateUserInfo">
          <label>Ad:</label>
          <input v-model="editableUser.name" type="text" />

          <label>E-posta:</label>
          <input v-model="editableUser.email" type="email" />

          <button type="submit">Kaydet</button>
        </form>
      </section>
      <section class="profile-section">
        <h2>Favori Kitaplar</h2>
        <ul v-if="favorites.length">
          <li v-for="book in favorites" :key="book.id">{{ book.title }}</li>
        </ul>
        <p v-else>Favori kitap yok.</p>
      </section>
      <section class="profile-section">
        <h2>Eklenen / Düzenlenen Kitaplar</h2>
        <ul v-if="userBooks.length">
          <li v-for="book in userBooks" :key="book.id">{{ book.title }}</li>
        </ul>
        <p v-else>Henüz kitap eklemediniz.</p>
      </section>
      <section class="profile-section">
        <h2>Yorumlarınız</h2>
        <ul v-if="userComments.length">
          <li v-for="comment in userComments" :key="comment.id">
            "{{ comment.text }}" - {{ comment.bookTitle }}
          </li>
        </ul>
        <p v-else>Yorumunuz yok.</p>
      </section>
      <section class="profile-section">
        <h2>İstatistikler</h2>
        <p>Toplam Favori Kitap: {{ favorites.length }}</p>
        <p>Toplam Yorum Sayısı: {{ userComments.length }}</p>
        <p>Favori Kategori: {{ favoriteCategory || "Bilinmiyor" }}</p>
      </section>
    </div>

  </Layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Layout from "@/components/Layout.vue";

export default {
  components: {Layout},
  data() {
    return {
      editableUser: {
        name: "",
        email: ""
      }
    };
  },
  computed: {
    ...mapState("user", ["user"]),
    ...mapState("favorites", ["favorites"]),
    ...mapState("books", ["books"]),
    ...mapState("comments", ["comments"]),

    userBooks() {
      return this.books.filter(book => book.addedBy === this.user.id);
    },
    userComments() {
      return Array.isArray(this.comments)
          ? this.comments.filter(comment => comment.userId === this.user.id)
          : [];
    },
    favoriteCategory() {
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
  },
  methods: {
    ...mapActions("user", ["updateUser"]),
    updateUserInfo() {
      this.updateUser({
        name: this.editableUser.name,
        email: this.editableUser.email
      });
    }
  },
  mounted() {
    if (this.user) {
      this.editableUser.name = this.user.name;
      this.editableUser.email = this.user.email;
    }
    this.$store.dispatch("comments/fetchComments");
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 1140px;
  width: 100%;
  margin: auto;
  padding: 20px;
  background-color: #09090b;
  color: #e2e2e2;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.profile-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #101010;
  border: 1px solid #202020;
  border-radius: 8px;
}

h1, h2 {
  color: #e2e2e2;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 10px;
  font-size: 1.25rem;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #e2e2e2;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  background-color: #202020;
  border: 1px solid #101010;
  border-radius: 4px;
  color: #e2e2e2;
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #202020;
  color: #e2e2e2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #101010;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 8px;
  background-color: #202020;
  margin-bottom: 5px;
  border-radius: 4px;
}

p {
  color: #e2e2e2;
  margin: 0;
}
</style>