<template>
  <Layout>
    <div class="settings-container">
      <h1>Ayarlar</h1>

      <div class="settings-section">
        <h2>Hesap Güvenliği</h2>

        <div class="setting-item">
          <div class="setting-info">
            <h3>Hesap Değiştirme Güvenliği</h3>
            <p>Hesaplar arasında geçiş yaparken şifre sorulsun mu?</p>
          </div>
          <div class="setting-control">
            <label class="switch">
              <input type="checkbox" v-model="requirePasswordForSwitch" @change="saveSettings">
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <h3>Kayıtlı Hesaplar</h3>
            <p>Sisteme giriş yapmış hesapların listesi</p>
          </div>
        </div>

        <div class="accounts-list">
          <div v-for="(account, index) in accounts" :key="index" class="account-list-item">
            <div class="account-info">
              <strong>{{ account.username }}</strong>
              <span>{{ account.email }}</span>
            </div>
            <button @click="removeAccount(index)" class="remove-btn">Kaldır</button>
          </div>
          <p v-if="accounts.length === 0" class="no-accounts">Henüz kayıtlı hesap bulunmuyor.</p>
        </div>
      </div>

      <div class="button-group">
        <button @click="goBack" class="secondary-button">Geri Dön</button>
      </div>
    </div>
  </Layout>
</template>

<script>
import { mapState } from "vuex";
import Layout from "@/components/Layout.vue";

export default {
  components: {Layout},
  data() {
    return {
      requirePasswordForSwitch: false,
    };
  },
  computed: {
    ...mapState(["user/accounts"]),
    accounts() {
      return this.$store.state.user.accounts;
    }
  },
  methods: {
    saveSettings() {
      this.$store.dispatch("updateAccountSettings", {
        requirePasswordForSwitch: this.requirePasswordForSwitch
      });
    },
    removeAccount(index) {
      const updatedAccounts = [...this.accounts];
      const removedAccount = updatedAccounts.splice(index, 1)[0];

      this.$store.commit("setAccounts", updatedAccounts);

      if (this.$store.state.user && this.$store.state.user.email === removedAccount.email) {
        this.$store.dispatch("user/logout");
        this.$router.push("/login");
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  created() {
    if (this.settings) {
      this.requirePasswordForSwitch = this.settings.requirePasswordForSwitch;
    }
  }
};
</script>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
}

.settings-section {
  background: #202020;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.setting-info {
  flex: 1;
}

.setting-info h3 {
  margin: 0 0 5px;
  font-size: 16px;
}

.setting-info p {
  margin: 0;
  font-size: 14px;
}

/* Toggle switch */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.accounts-list {
  margin-top: 15px;
}

.account-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #09090b;
  border-radius: 4px;
  margin-bottom: 8px;
}

.account-info {
  display: flex;
  flex-direction: column;
}

.account-info strong {
  font-size: 14px;
}

.account-info span {
  font-size: 12px;
}

.remove-btn {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s;
}

.remove-btn:hover {
  background: #e04343;
}

.no-accounts {
  font-style: italic;
  color: #666;
  text-align: center;
  padding: 15px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.secondary-button {
  background: transparent;
  border: 1px solid #333;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}
</style>