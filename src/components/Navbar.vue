<!-- Güncellenen Navbar Bileşeni -->
<template>
  <nav class="navigation">
    <router-link to="/" class="border" style="font-size: 24px">Virtara Group</router-link>
    <input type="search" placeholder="Genel arama yapın..." />
    <span class="sub">
      <router-link to="/books">Kitaplar</router-link>
      <router-link to="/favorites">Favorilerim</router-link>
      <div v-if="currentUser.role === '1'">
        <router-link to="/manage">Yönet</router-link>
      </div>
      <div class="dropdown">
        <button class="dropdown-button" @click="toggleDropdown">
          {{ currentUser ? currentUser.email : 'Hesap' }}
          <span class="dropdown-icon">▼</span>
        </button>
        <div class="dropdown-menu" v-if="isDropdownOpen">
          <div class="dropdown-header">Hesaplar</div>
          <div
              v-for="(account, index) in accounts"
              :key="index"
              class="account-item"
              :class="{ 'active': currentUser && account.email === currentUser.email }"
              @click="switchAccount(account)"
          >
            {{ account.email }}
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" @click="goToProfile">Profilim</div>
          <div class="dropdown-item" @click="goToSettings">Ayarlar</div>
          <div class="dropdown-item" @click="logout">Çıkış Yap</div>
        </div>
      </div>
    </span>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const isDropdownOpen = ref(false);
const accounts = computed(() => store.state.accounts || []);
const currentUser = computed(() => store.state.user);
const requirePasswordForSwitch = computed(() => store.state.settings?.requirePasswordForSwitch || false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = (event) => {
  if (!event.target.closest('.dropdown')) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
  // Hesaplar listesini yükle
  store.dispatch('loadAccounts');
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});

const switchAccount = (account) => {
  if (requirePasswordForSwitch.value) {
    store.commit('setSelectedAccount', account);
    router.push('/account-switch');
  } else {
    store.dispatch('switchAccount', account);
    isDropdownOpen.value = false;
  }
};

const logout = () => {
  store.dispatch('logout');
  router.push('/login');
  isDropdownOpen.value = false;
};

const goToSettings = () => {
  router.push('/settings');
  isDropdownOpen.value = false;
};

const goToProfile = () => {
  router.push('/profile');
  isDropdownOpen.value = false;
};
</script>

<style>
.navigation {
  display: flex;
  flex-direction: row;
  max-width: 1200px;
  margin: auto;
  gap: 1rem;
  padding: 12px 24px;
  align-items: center;
  justify-content: space-between;
}

.navigation .border {
  border-right: #202020 solid 2px;
  padding: 0 12px;
}

.navigation input {
  outline: none;
  border: none;
  width: 256px;
  border-bottom: 1px solid #202020;
}

.navigation .sub {
  flex-direction: row;
  gap: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.dropdown {
  font-size: 14px;
  position: relative;
  font-weight: 400;
  display: inline-block;
}

.dropdown-button {
  border: none;
  cursor: pointer;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
}

.dropdown-icon {
  font-size: 10px;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  min-width: 200px;
  background-color: #09090b75;
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 100;
  margin-top: 5px;
}

.dropdown-header {
  padding: 10px;
  border-bottom: 1px solid #e2e2e2;
}

.account-item {
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-divider {
  border-top: 1px solid #e2e2e2;
  margin: 5px 0;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

</style>