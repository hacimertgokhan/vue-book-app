<template>
  <div class="forgot-password-container">
    <p><strong>Şifremi Unuttum</strong>,<br/>Yeni şifrenizi almak için e-posta adresinizi giriniz.</p>
    <form class="forgot-password-page" @submit.prevent="handlePasswordReset">
      <input v-model="email" type="email" placeholder="E-Posta" required />
      <button type="submit">E-Posta Gönder</button>
      <div class="forgot-password-page-bottom-place">
        <a href="/login">Geri dön</a>
      </div>
    </form>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default {
  data() {
    return {
      email: "",
      errorMessage: "",
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    handlePasswordReset() {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(user => user.email === this.email);

      if (!user) {
        this.errorMessage = "Bu e-posta adresi ile kayıtlı bir hesap bulunmamaktadır.";
        this.toast.error(this.errorMessage);
        return;
      }

      this.toast.success("E-posta adresinize sıfırlama bağlantısı gönderildi.");
      // Burada kullanıcıya şifre sıfırlama e-postası göndermeyi simüle edebilirsiniz
    },
  },
};
</script>

<style scoped>
.forgot-password-container {
  margin: auto;
  z-index: 10;
  padding: 50px;
  border-radius: 6px;
  background: #09090b90;
  border: 1px solid #202020;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  height: fit-content;
  text-align: left;
  width: 350px;
}

.forgot-password-page {
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.forgot-password-page input {
  outline: none;
  background: transparent;
  border: none;
  border-bottom: 1px solid #e2e2e2;
  padding: 2px;
}

.forgot-password-page button {
  background: transparent;
  margin-top: 5px;
  padding: 6px 12px;
  border: 1.5px solid #e2e2e2;
  border-radius: 12px;
}

.forgot-password-page-bottom-place {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.forgot-password-container p {
  strong {
    background: transparent;
  }
  background: transparent;
}
</style>
