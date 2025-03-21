<template>
  <nav class="navigation" :style="themedStyles.nav">
    <router-link to="/" class="brand-link" :style="themedStyles.brandLink">Virtara Group</router-link>

    <!-- Hamburger menü butonu (mobil için) -->
    <div class="hamburger-menu" @click="toggleMobileMenu" :class="{ 'active': isMobileMenuOpen }" :style="themedStyles.hamburgerMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <!-- Navigasyon linkleri ve kullanıcı menüsü -->
    <div class="nav-links" :class="{ 'active': isMobileMenuOpen }" :style="themedStyles.navLinks">
      <div class="links-section">
        <router-link v-if="currentUser.user?.role === '1'" to="/manage" :style="themedStyles.link" @click="closeMobileMenu">Yönet</router-link>
        <router-link to="/books" :style="themedStyles.link" @click="closeMobileMenu">Kitaplar</router-link>
      </div>

      <div class="user-section">
        <div class="dropdown">
          <button class="dropdown-button" @click="toggleDropdown" :style="themedStyles.dropdownButton">
            {{ currentUser.user ? currentUser.user.email : 'Hesap' }}
            <span class="dropdown-icon">▼</span>
          </button>
          <div class="dropdown-menu" v-if="isDropdownOpen" :style="themedStyles.dropdownMenu">
            <div class="dropdown-header" :style="themedStyles.dropdownHeader">Hesaplar</div>
            <div
                v-for="(account, index) in accounts"
                :key="index"
                class="account-item"
                :class="{ 'active': currentUser.user && account.email === currentUser.user.email }"
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
      </div>
    </div>

    <!-- Overlay - mobil menü açıkken arka planı koyulaştırır -->
    <div class="nav-overlay" v-if="isMobileMenuOpen" @click="closeMobileMenu"></div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const isDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
const accounts = computed(() => store.state.user.accounts || []);
const currentUser = computed(() => store.state.user);
const theme = computed(() => store.state.ui.theme);
const requirePasswordForSwitch = computed(() => store.state.user.settings?.requirePasswordForSwitch || false);

const toggleDropdown = (event) => {
  event.stopPropagation();
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  // Mobil menü açıkken scroll'u engelle
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = '';
};

const closeDropdown = (event) => {
  if (!event.target.closest('.dropdown')) {
    isDropdownOpen.value = false;
  }
};

const closeMenusOnResize = () => {
  const windowWidth = window.innerWidth;
  if (windowWidth > 768 && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
  store.dispatch('user/loadAccounts');
  window.addEventListener('resize', closeMenusOnResize);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
  window.removeEventListener('resize', closeMenusOnResize);
  // Sayfadan çıkarken scroll'u eski haline getir
  document.body.style.overflow = '';
});

const switchAccount = (account) => {
  if (requirePasswordForSwitch.value) {
    store.dispatch('user/setSelectedAccount', account);
    router.push('/account-switch');
  } else {
    store.dispatch('user/switchAccount', account);
    isDropdownOpen.value = false;
  }
};

const logout = () => {
  store.dispatch('user/logout');
  router.push('/login');
  isDropdownOpen.value = false;
  closeMobileMenu();
};

const goToSettings = () => {
  router.push('/settings');
  isDropdownOpen.value = false;
  closeMobileMenu();
};

const goToProfile = () => {
  router.push('/profile');
  isDropdownOpen.value = false;
  closeMobileMenu();
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
    },
    link: {
      color: isDarkTheme ? '#e2e2e2' : '#333',
    },
    themeButton: {
      backgroundColor: isDarkTheme ? '#202020' : '#eee',
      color: isDarkTheme ? '#e2e2e2' : '#333',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '400',
    },
    dropdownButton: {
      backgroundColor: 'transparent',
      color: isDarkTheme ? '#e2e2e2' : '#333',
    },
    dropdownMenu: {
      backgroundColor: isDarkTheme ? '#1a1a1a' : '#ffffff',
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
    hamburgerMenu: {
      color: isDarkTheme ? '#e2e2e2' : '#333',
    },
    navLinks: {
      backgroundColor: isDarkTheme ? '#09090b' : '#ffffff',
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
  position: relative;
}

.nav-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
}

.links-section {
  display: flex;
  gap: 1em;
  align-items: center;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-link {
  font-size: 24px;
  text-decoration: none;
  transition: color 0.3s ease;
  z-index: 11;
  white-space: nowrap;
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
  font-weight: bold;
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

.account-item.active {
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.05);
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

/* Hamburger menü stili */
.hamburger-menu {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 24px;
  cursor: pointer;
  z-index: 11;
}

.hamburger-menu span {
  display: block;
  height: 3px;
  width: 100%;
  background-color: currentColor;
  border-radius: 3px;
  transition: all 0.3s ease;
}

/* Hamburger menü aktif durum animasyonu */
.hamburger-menu.active span:nth-child(1) {
  transform: translateY(10.5px) rotate(45deg);
}

.hamburger-menu.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active span:nth-child(3) {
  transform: translateY(-10.5px) rotate(-45deg);
}

/* Overlay stil */
.nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9;
  display: none;
}

/* Responsive tasarım */
@media (max-width: 768px) {
  .hamburger-menu {
    display: flex;
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: -300px;
    height: 100vh;
    width: 80%;
    max-width: 300px;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 70px;
    gap: 2rem;
    z-index: 10;
    transition: right 0.3s ease;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  }

  .nav-links.active {
    right: 0;
  }

  .nav-overlay {
    display: block;
  }

  .links-section, .user-section {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding: 0 20px;
  }

  .links-section {
    gap: 1rem;
  }

  .links-section a {
    display: block;
    width: 100%;
    padding: 12px 0;
    border-bottom: 1px solid rgba(128, 128, 128, 0.2);
    font-size: 16px;
  }

  .dropdown {
    width: 100%;
  }

  .dropdown-button {
    width: 100%;
    justify-content: space-between;
    padding: 12px 0;
    font-size: 16px;
  }

  .dropdown-menu {
    position: relative;
    width: 100%;
    margin-top: 10px;
  }

  .user-section {
    margin-top: 20px;
  }

  .themeButton {
    margin-top: 15px;
    align-self: center;
  }
}

/* Daha küçük mobil cihazlar için ek düzenlemeler */
@media (max-width: 480px) {
  .navigation {
    padding: 12px 16px;
  }

  .brand-link {
    font-size: 20px;
  }
}

/* Tema geçişi için animasyon */
@media (prefers-reduced-motion: no-preference) {
  .navigation,
  .nav-links,
  .dropdown-menu,
  .hamburger-menu span {
    transition-duration: 0.3s;
  }
}
</style>