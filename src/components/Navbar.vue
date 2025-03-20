<template>
  <nav class="navigation" :style="themedStyles.nav">
    <router-link to="/" class="brand-link" :style="themedStyles.brandLink">Virtara Group</router-link>
    <input type="search" placeholder="Genel arama yapın..." :style="themedStyles.searchInput" />
    <span class="sub">
      <div v-if="currentUser.valueOf().user.role === '1'">
        <router-link to="/manage" :style="themedStyles.link">Yönet</router-link>
      </div>

      <div class="dropdown">
        <button class="dropdown-button" @click="toggleDropdown" :style="themedStyles.dropdownButton">
          {{ currentUser.valueOf().user ? currentUser.valueOf().user.email : 'Hesap' }}
          <span class="dropdown-icon">▼</span>
        </button>
        <div class="dropdown-menu" v-if="isDropdownOpen" :style="themedStyles.dropdownMenu">
          <div class="dropdown-header" :style="themedStyles.dropdownHeader">Hesaplar</div>
          <div
              v-for="(account, index) in accounts"
              :key="index"
              class="account-item"
              :class="{ 'active': currentUser && account.email === currentUser.valueOf().user.email }"
              @click="switchAccount(account)"
              :style="themedStyles.dropdownItem"
          >
            {{ account.email }}
          </div>
          <div class="dropdown-divider" :style="themedStyles.dropdownDivider"></div>
          <div class="dropdown-item" @click="goToProfile" :style="themedStyles.dropdownItem">Profilim</div>
          <div class="dropdown-item" @click="goToSettings" :style="themedStyles.dropdownItem">Ayarlar</div>
          <div class="dropdown-item" @click="logout" :style="themedStyles.dropdownItem">Çıkış Yap</div>
        </div>
      </div>

      <button @click="toggleTheme" :style="themedStyles.themeButton">
        {{ theme === 'light' ? '🌙' : '☀️' }}
      </button>
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
const accounts = computed(() => store.state.user.accounts || []);
const currentUser = computed(() => store.state.user);
const theme = computed(() => store.state.ui.theme);
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
  store.dispatch('user/loadAccounts');
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});

const switchAccount = (account) => {
  if (requirePasswordForSwitch.value) {
    store.commit('setSelectedAccount', account);
    router.push('/account-switch');
  } else {
    store.dispatch('user/switchAccount', account);
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

const toggleTheme = () => {
  store.dispatch('ui/toggleTheme');
};

const themedStyles = computed(() => {
  const isDarkTheme = theme.value === 'dark';

  return {
    nav: {
      backgroundColor: isDarkTheme ? '#09090b' : '#ffffff',
      color: isDarkTheme ? '#e2e2e2' : '#333',
    },
    brandLink: {
      color: isDarkTheme ? '#e2e2e2' : '#333',
      borderRight: isDarkTheme ? '2px solid #202020' : '2px solid #ddd',
    },
    searchInput: {
      backgroundColor: isDarkTheme ? '#09090b' : '#ffffff',
      color: isDarkTheme ? '#e2e2e2' : '#333',
      borderBottom: isDarkTheme ? '1px solid #202020' : '1px solid #ddd',
    },
    link: {
      color: isDarkTheme ? '#e2e2e2' : '#333',
    },
    themeButton: {
      backgroundColor: isDarkTheme ? '#202020' : '#333',
      color: isDarkTheme ? '#333' : '#333',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '400',
    },
    dropdownButton: {
      backgroundColor: isDarkTheme ? '#09090b' : '#ffffff',
      color: isDarkTheme ? '#e2e2e2' : '#333',
    },
    dropdownMenu: {
      backgroundColor: isDarkTheme ? 'rgba(9, 9, 11, 0.466)' : 'rgba(255, 255, 255, 0.75)',
      border: isDarkTheme ? '1px solid #202020' : '1px solid #ddd',
      boxShadow: isDarkTheme ? '0 2px 10px rgba(255,255,255,0.1)' : '0 2px 10px rgba(0,0,0,0.1)',
    },
    dropdownHeader: {
      color: isDarkTheme ? '#e2e2e2' : '#333',
      borderBottom: isDarkTheme ? '1px solid #202020' : '1px solid #ddd',
    },
    dropdownItem: {
      color: isDarkTheme ? '#e2e2e2' : '#333',
    },
    dropdownDivider: {
      borderTop: isDarkTheme ? '1px solid #202020' : '1px solid #ddd',
    },
  };
});
</script>

<style scoped>
.navigation {
  display: flex;
  flex-direction: row;
  max-width: 1200px;
  width: 100%;
  margin: auto;
  gap: 1rem;
  padding: 12px 24px;
  align-items: center;
  justify-content: space-between;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.brand-link {
  font-size: 24px;
  text-decoration: none;
  padding: 0 12px;
  transition: border-color 0.3s ease, color 0.3s ease;
}

.navigation input {
  outline: none;
  border: none;
  width: 256px;
  transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
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
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dropdown-icon {
  font-size: 10px;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  min-width: 200px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 100;
  margin-top: 5px;
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.dropdown-header {
  padding: 10px;
  transition: border-color 0.3s ease, color 0.3s ease;
}

.account-item {
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s, color 0.3s ease;
}

.account-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.dropdown-divider {
  margin: 5px 0;
  transition: border-color 0.3s ease;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s, color 0.3s ease;
}

.dropdown-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>