<template>
  <div class="login-container">
    <p><strong>Merhaba</strong>,<br/>Devam etmek için istenilen bilgileri doldurunuz.</p>
    <form class="login-page" @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="E-Posta" required />
      <input v-model="password" type="password" placeholder="Şifreniz" required />
      <button type="submit">Giriş Yap</button>
      <div class="login-page-bottom-place">
        <a href="/forgot-password">Şifremi unuttum.</a>
        <a href="/register">Kayıt Ol.</a>
      </div>
    </form>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { mapActions } from "vuex";

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
    return { toast };
  },
  methods: {
    ...mapActions(["login"]),
    handleLogin() { // Renamed the method to handleLogin
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(user => user.email === this.email);

      if (!user || user.password !== this.password) {
        this.errorMessage = "E-posta veya şifre hatalı!";
        this.toast.error("E-posta veya şifre hatalı!");
        return;
      }

      this.login(user);  // Calls vuex action for login
      this.toast.success("Giriş başarılı !");
      this.$router.push("/");
    },
  },
};
</script>
<style scoped>
.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 2px;
  outline: none;
  background: transparent;
  border: none;
  border-bottom: 1px solid #e2e2e2;
}

.login-page {
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  input {
    outline: none;
    background: transparent;
    border: none;
    border-bottom: 1px solid #e2e2e2;
  }
  button {
    background: transparent;
    margin-top: 5px;
    padding: 6px 12px;
    border: 1.5px solid #e2e2e2;
    border-radius: 12px;
  }

}
.login-container {
  margin: auto;
  z-index: 10;
  padding: 50px;
  border-radius: 6px;
  background: #09090b90;
  border: 1px solid #202020;
  position: absolute;
  left: 0; right: 0;
  bottom: 0; top: 0;
  height: fit-content;
  text-align: left;
  width: 350px;
  p {
    strong {
      background: transparent;
    }
    background: transparent;
  }
}
.login-page-bottom-place {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;

}
</style>

