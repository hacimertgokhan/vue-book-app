<template>
  <div class="account-switch" :class="{ 'dark-theme': isDarkTheme }">
    <div class="container">
      <h1>Hesap Geçişi İçin Şifre Doğrulama</h1>
      <div class="form-group">
        <label for="password">Şifrenizi Girin:</label>
        <input type="password" id="password" v-model="password" placeholder="Şifrenizi girin" />
      </div>
      <button @click="verifyPassword" class="submit-button">Doğrula ve Geçiş Yap</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";

const toast = useToast();
const store = useStore();
const router = useRouter();
const password = ref('');
const error = ref('');

const isDarkTheme = computed(() => store.state.ui.theme === 'dark');

const verifyPassword = async () => {
  const selectedAccount = store.state.user.selectedAccount;
  if (!selectedAccount) {
    error.value = "Seçilen hesap bulunamadı.";
    toast.error("Seçilen hesap bulunamadı!", { position: "top-right" });
    return;
  }

  // LocalStorage'dan tüm kullanıcıları al
  const allUsers = JSON.parse(localStorage.getItem('users')) || [];

  // Seçilen hesaba ait kullanıcıyı bul
  const user = allUsers.find(u => u.email === selectedAccount.email);

  if (!user) {
    error.value = "Kullanıcı bulunamadı.";
    toast.error("Kullanıcı bulunamadı!", { position: "top-right" });
    return;
  }

  console.log(user)
  console.log(user.password)
  console.log(password.value)
  if (password.value === user.password) {
    const success = await store.dispatch('user/switchAccount', selectedAccount);
    if (success) {
      toast.success("Hesap geçişi başarılı!", { position: "top-right" });
      router.push('/');
    } else {
      error.value = "Hesap geçişi başarısız oldu.";
      toast.error("Hesap geçişi başarısız!", { position: "top-right" });
    }
  } else {
    error.value = "Yanlış şifre.";
    toast.error("Yanlış şifre!", { position: "top-right" });
  }
};
</script>

<style scoped>
/* Genel Tasarım */
.account-switch {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f8;
  color: #333;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.account-switch.dark-theme {
  background-color: #121212; /* Koyu arka plan */
  color: #eee; /* Açık renkli yazı */
}

.container {
  width: 100%;
  max-width: 500px;
  padding: 40px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.account-switch.dark-theme .container {
  background-color: #242424; /* Koyu arkaplan */
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.1);
}

/* Başlık */
h1 {
  font-size: 28px;
  margin-bottom: 30px;
  color: #42b983;
}

.account-switch.dark-theme h1 {
  color: #a3e4ba; /* Açık yeşil başlık */
}

/* Form Elemanları */
.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  font-size: 16px;
  margin-bottom: 8px;
  color: #555;
}

.account-switch.dark-theme label {
  color: #ddd;
}

input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  color: #333;
  transition: border-color 0.3s ease;
}

.account-switch.dark-theme input[type="password"] {
  background-color: #333;
  color: #eee;
  border-color: #555;
}

input[type="password"]:focus {
  border-color: #42b983;
  outline: none;
}

.account-switch.dark-theme input[type="password"]:focus {
  border-color: #a3e4ba;
}

/* Buton */
.submit-button {
  background-color: #42b983;
  color: white;
  padding: 14px 30px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #348865;
}

/* Hata Mesajı */
.error-message {
  color: #e44d26;
  margin-top: 20px;
  font-size: 16px;
}

/* Tema Butonu */
.theme-button {
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.theme-button:hover {
  background-color: #5a6268;
}
</style>