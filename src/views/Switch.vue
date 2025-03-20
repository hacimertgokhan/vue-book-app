<template>
  <div class="account-switch-container">
    <h2>Hesap Değiştirme</h2>
    <p>
      <strong>{{ selectedAccount.email }}</strong> hesabına geçiş yapmak için lütfen şifrenizi girin.
    </p>
    <form @submit.prevent="verifyAndSwitch">
      <div class="input-group">
        <label for="password">Şifre:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Hesaba Geç</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p class="back-link">
      <a href="#" @click.prevent="goBack">Geri Dön</a>
    </p>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  props: {
    selectedAccount: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      password: "",
      errorMessage: ""
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user  // Mapping Vuex user state
    })
  },
  methods: {
    ...mapActions(["user/switchAccount"]),

    verifyAndSwitch() {
      // Şifre doğrulaması
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.email === this.selectedAccount.email);

      if (user && user.password === this.password) {
        this.switchAccount(this.selectedAccount);
        this.$router.push("/");
      } else {
        this.errorMessage = "Geçersiz şifre!";
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  created() {
    // Eğer seçili hesap yoksa ana sayfaya yönlendir
    if (!this.selectedAccount) {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.account-switch-container {
  margin: auto;
  z-index: 10;
  padding: 40px;
  border-radius: 6px;
  background: #09090b90;
  border: 1px solid #202020;
  position: absolute;
  left: 0; right: 0;
  bottom: 0; top: 0;
  height: fit-content;
  text-align: left;
  width: 350px;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #e2e2e2;
}

.input-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #e2e2e2;
}

input {
  width: 100%;
  padding: 8px;
  outline: none;
  background: transparent;
  border: none;
  border-bottom: 1px solid #e2e2e2;
  color: #e2e2e2;
}

button {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1.5px solid #e2e2e2;
  border-radius: 12px;
  color: #e2e2e2;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #1c1c1e;
}

.error {
  color: #ff4d4d;
  margin-top: 10px;
}

.back-link {
  margin-top: 15px;
  text-align: center;
}

.back-link a {
  color: #e2e2e2;
  text-decoration: none;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>
