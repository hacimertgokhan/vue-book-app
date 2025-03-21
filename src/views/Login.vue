<template>
  <div class="fullscreen" :style="{ backgroundColor: getThemeStyles.inputBackgroundColor}">
    <div class="login-container" :style="{ backgroundColor: getThemeStyles.containerBackgroundColor, borderColor: getThemeStyles.borderColor, color: getThemeStyles.textColor }">
      <p :style="{ color: getThemeStyles.textColor }"><strong>Merhaba</strong>,<br/>Devam etmek için istenilen bilgileri doldurunuz.</p>
      <form class="login-page" @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="E-Posta" required :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor, borderColor: getThemeStyles.inputBorderColor }" />
        <input v-model="password" type="password" placeholder="Şifreniz" required :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor, borderColor: getThemeStyles.inputBorderColor }" />
        <button type="submit" :style="{ backgroundColor: getThemeStyles.accentColor, color: getThemeStyles.buttonTextColor, borderColor: getThemeStyles.accentColor }">Giriş Yap</button>
        <div class="login-page-bottom-place">
          <a href="/forgot-password" :style="{ color: getThemeStyles.textColor }">Şifremi unuttum.</a>
          <a href="/register" :style="{ color: getThemeStyles.textColor }">Kayıt Ol.</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { mapActions } from "vuex";
import { computed } from 'vue';
import { useStore } from 'vuex';
import bcrypt from 'bcryptjs';

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  setup() {
    const toast = useToast();
    const store = useStore();

    const theme = computed(() => store.state.ui.theme);

    const getThemeStyles = computed(() => {
      const isDarkTheme = theme.value === 'dark';
      return {
        containerBackgroundColor: isDarkTheme ? 'rgba(9, 9, 11, 0.90)' : 'rgba(240, 240, 240, 0.90)',
        textColor: isDarkTheme ? '#e2e2e2' : '#333333',
        borderColor: isDarkTheme ? '#202020' : '#CCCCCC',
        inputBackgroundColor: isDarkTheme ? '#101010' : '#FFFFFF',
        inputBorderColor: isDarkTheme ? (isDarkTheme ? '#555555' : '#999999') : '#999999',
        buttonTextColor: isDarkTheme ? '#e2e2e2' : '#FFFFFF',
        accentColor: isDarkTheme ? '#1976d2' : '#007bff',
      };
    });

    return { toast, getThemeStyles };
  },
  methods: {
    ...mapActions("user", ["login"]),
    handleLogin() {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(user => user.email === this.email);

      if (!user) {
        this.errorMessage = "E-Posta veya şifre hatalı!";
        this.toast.error("E-Posta veya şifre hatalı!");
        return;
      }


      const passwordMatch = bcrypt.compareSync(this.password, user.password);

      if (!passwordMatch) {
        this.errorMessage = "E-Posta veya şifre hatalı!";
        this.toast.error("E-Posta veya şifre hatalı!");
        return;
      }

      console.log(user);
      this.login(user);
      this.toast.success("Giriş başarılı !");
      this.$router.push("/");
    }
  },
};
</script>

<style scoped>
.fullscreen {
  width: 100%;
  height: 100%;
  position: absolute;
}
.login-container {
  margin: auto;
  z-index: 10;
  padding: 50px;
  border-radius: 6px;
  position: absolute;
  left: 0; right: 0;
  bottom: 0; top: 0;
  height: fit-content;
  text-align: left;
  width: 350px;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.login-container p {
  transition: color 0.3s ease;
}

.login-page {
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.login-page input {
  outline: none;
  border: none;
  border-radius: 4px;
  padding: 3px;
  border-bottom: 1px solid #e2e2e2;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.login-page button {
  margin-top: 5px;
  padding: 6px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  border: none;
}

.login-page-bottom-place {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
}

.login-page-bottom-place a {
  transition: color 0.3s ease;
}

@media (max-width: 480px) {
  .login-container {
    padding: 20px;
    width: 90%;
    margin: 0 auto;
    position: static;
    transform: none;
  }
}
</style>