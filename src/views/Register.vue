<template>
  <div class="register-container">
    <p><strong>Merhaba</strong>,<br/>Kayıt olmak için lütfen istenilen bilgileri doldurunuz.</p>
    <form @submit.prevent="register">
      <div class="input-group">
        <label for="username">Kullanıcı Adı:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="input-group">
        <label for="email">E-Posta:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="input-group">
        <label for="password">Şifre:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Kayıt Ol</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    ...mapActions(["user/login"]),
    register() {
      const userData = {
        username: this.username,
        email: this.email,
        password: this.password,
        role: "0",
      };
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userExists = users.some(user => user.email === this.email);
      if (userExists) {
        this.errorMessage = "Bu e-posta ile kayıtlı bir kullanıcı zaten var!";
        return;
      }
      users.push(userData);
      localStorage.setItem("users", JSON.stringify(users));
      this.login(userData);
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.register-container {
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
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #e2e2e2;
}

input {
  width: 100%;
  padding: 6px;
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
  margin-top: 5px;
  border: 1.5px solid #e2e2e2;
  border-radius: 12px;
  color: #e2e2e2;
  cursor: pointer;
}

button:hover {
  background-color: #1c1c1e;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
