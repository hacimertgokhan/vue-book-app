<template>
  <div class="fullscreen" :style="{ backgroundColor: getThemeStyles.inputBackgroundColor }">
    <div class="register-container" :style="{ backgroundColor: getThemeStyles.containerBackgroundColor, borderColor: getThemeStyles.borderColor, color: getThemeStyles.textColor }">
      <p :style="{ color: getThemeStyles.textColor }"><strong>Merhaba</strong>,<br/>Kayıt olmak için lütfen istenilen bilgileri doldurunuz.</p>
      <form @submit.prevent="register">
        <div class="input-group">
          <label for="username" :style="{ color: getThemeStyles.textColor }">Kullanıcı Adı:</label>
          <input type="text" id="username" v-model="username" required :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor, borderColor: getThemeStyles.inputBorderColor }" />
        </div>
        <div class="input-group">
          <label for="email" :style="{ color: getThemeStyles.textColor }">E-Posta:</label>
          <input type="email" id="email" v-model="email" required :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor, borderColor: getThemeStyles.inputBorderColor }" />
        </div>
        <div class="input-group">
          <label for="password" :style="{ color: getThemeStyles.textColor }">Şifre:</label>
          <input type="password" id="password" v-model="password" required :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor, borderColor: getThemeStyles.inputBorderColor }" />
        </div>
        <button type="submit" :style="{ backgroundColor: getThemeStyles.accentColor, color: getThemeStyles.buttonTextColor, borderColor: getThemeStyles.accentColor }">Kayıt Ol</button>
      </form>
      <p v-if="errorMessage" class="error" :style="{ color: getThemeStyles.errorTextColor }">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import bcrypt from 'bcryptjs';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  setup() {
    const store = useStore();
    const theme = computed(() => store.state.ui.theme);

    const getThemeStyles = computed(() => {
      const isDarkTheme = theme.value === 'dark';
      return {
        containerBackgroundColor: isDarkTheme ? 'rgba(9, 9, 11, 0.90)' : 'rgba(240, 240, 240, 0.90)',
        textColor: isDarkTheme ? '#e2e2e2' : '#333333',
        borderColor: isDarkTheme ? '#202020' : '#CCCCCC',
        inputBackgroundColor: isDarkTheme ? '#101010' : '#FFFFFF',
        inputBorderColor: isDarkTheme ? '#555555' : '#999999',
        buttonTextColor: isDarkTheme ? '#e2e2e2' : '#FFFFFF',
        accentColor: isDarkTheme ? '#1976d2' : '#007bff',
        errorTextColor: isDarkTheme ? '#ff5555' : '#ff0000',
      };
    });

    return { getThemeStyles };
  },
  methods: {
    ...mapActions("user", ["login"]),
    async register() {
      const userData = {
        username: this.username,
        email: this.email,
        role: "0",
      };

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userExists = users.some(user => user.email === this.email);
      if (userExists) {
        this.errorMessage = "Bu e-posta ile kayıtlı bir kullanıcı zaten var!";
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(this.password, salt);

      userData.password = hashedPassword;

      users.push(userData);
      localStorage.setItem("users", JSON.stringify(users));
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.fullscreen {
  width: 100%;
  height: 100%;
  position: absolute;
}

.register-container {
  margin: auto;
  z-index: 10;
  padding: 50px;
  border-radius: 6px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  height: fit-content;
  text-align: left;
  width: 350px;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  transition: color 0.3s ease;
}

input {
  width: 100%;
  padding: 6px;
  outline: none;
  border: none;
  border-bottom: 1px solid #e2e2e2;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

button {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1.5px solid #e2e2e2;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  border: none;
}

button:hover {
  background-color: #1c1c1e;
}

.error {
  margin-top: 10px;
  transition: color 0.3s ease;
}
</style>