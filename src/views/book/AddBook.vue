<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import Layout from "@/components/Layout.vue";
import { useRouter } from 'vue-router';
import axios from 'axios';
import {useToast} from "vue-toastification";
import { useStore } from "vuex";
const toast = useToast();

const currentStep = ref(1);
const totalSteps = 4;

const router = useRouter();
const store = useStore();

const bookForm = reactive({
  id: null,
  title: '',
  author: '',
  publisher: '',
  publishDate: '',
  isbn: '',
  pageCount: null,
  language: 'tr',
  bookType: 'fiction',
  genre: [],
  summary: '',
  price: null,
  currency: 'TRY',
  coverImage: null,
  fiction: {
    characters: [],
    series: '',
    seriesNumber: null,
  },
  nonFiction: {
    subjectArea: '',
    academicLevel: '',
    citations: [],
  },
  children: {
    ageRange: '',
    illustrations: false,
    educationalValue: '',
  }
});

const exchangeRates = ref({});
const currencies = ['TRY', 'USD', 'EUR', 'GBP'];
const loading = ref(false);
const formErrors = ref({});

const summaryContent = ref('');

const imagePreview = ref(null);

const bookTypeFields = computed(() => {
  return bookForm.bookType === 'fiction' ? bookForm.fiction :
      bookForm.bookType === 'nonFiction' ? bookForm.nonFiction :
          bookForm.bookType === 'children' ? bookForm.children : {};
});

const convertedPrices = computed(() => {
  if (!bookForm.price || !exchangeRates.value || Object.keys(exchangeRates.value).length === 0) {
    return {};
  }

  const result = {};
  const baseCurrency = bookForm.currency;
  const basePrice = bookForm.price;

  currencies.forEach(currency => {
    if (currency === baseCurrency) {
      result[currency] = basePrice;
    } else if (baseCurrency === 'TRY') {
      result[currency] = (basePrice / exchangeRates.value[currency]).toFixed(2);
    } else if (currency === 'TRY') {
      result[currency] = (basePrice * exchangeRates.value[baseCurrency]).toFixed(2);
    } else {
      const priceInTRY = basePrice * exchangeRates.value[baseCurrency];
      result[currency] = (priceInTRY / exchangeRates.value[currency]).toFixed(2);
    }
  });

  return result;
});

// Methods
const nextStep = () => {
  if (validateCurrentStep()) {
    if (currentStep.value < totalSteps) {
      currentStep.value++;
      saveFormState();
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const validateCurrentStep = () => {
  formErrors.value = {};
  let isValid = true;

  if (currentStep.value === 1) {
    if (!bookForm.title) {
      formErrors.value.title = 'Kitap başlığı gereklidir';
      isValid = false;
    }
    if (!bookForm.author) {
      formErrors.value.author = 'Yazar adı gereklidir';
      isValid = false;
    }
    if (!bookForm.bookType) {
      formErrors.value.bookType = 'Kitap türü seçilmelidir';
      isValid = false;
    }
  } else if (currentStep.value === 2) {
    if (!bookForm.isbn) {
      formErrors.value.isbn = 'ISBN numarası gereklidir';
      isValid = false;
    } else if (!/^(?:\d{10}|\d{13})$/.test(bookForm.isbn)) {
      formErrors.value.isbn = 'ISBN 10 veya 13 haneli olmalıdır';
      isValid = false;
    }

    if (!bookForm.pageCount || bookForm.pageCount <= 0) {
      formErrors.value.pageCount = 'Geçerli bir sayfa sayısı giriniz';
      isValid = false;
    }
  } else if (currentStep.value === 3) {
    if (!bookForm.price || bookForm.price <= 0) {
      formErrors.value.price = 'Geçerli bir fiyat giriniz';
      isValid = false;
    }
    if (!bookForm.currency) {
      formErrors.value.currency = 'Para birimi seçiniz';
      isValid = false;
    }
    if (!summaryContent.value.trim()) {
      formErrors.value.summary = 'Kitap özeti gereklidir';
      isValid = false;
    }
  }

  return isValid;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      bookForm.coverImage = e.target.result;
      imagePreview.value = e.target.result;
      saveFormState();
    };
    reader.readAsDataURL(file);
  }
};

const fetchExchangeRates = async () => {
  try {
    loading.value = true;
    // Replace with your API key and actual API endpoint
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/TRY');
    exchangeRates.value = response.data.rates;
    loading.value = false;
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    loading.value = false;
  }
};

const saveFormState = () => {
  bookForm.summary = summaryContent.value;
  localStorage.setItem('bookFormState', JSON.stringify({
    formData: bookForm,
    currentStep: currentStep.value,
    summaryContent: summaryContent.value
  }));
};

const loadFormState = () => {
  const savedState = localStorage.getItem('bookFormState');
  if (savedState) {
    const { formData, currentStep: savedStep, summaryContent: savedSummary } = JSON.parse(savedState);
    Object.assign(bookForm, formData);
    currentStep.value = savedStep || 1;
    summaryContent.value = savedSummary || '';
    if (bookForm.coverImage) {
      imagePreview.value = bookForm.coverImage;
    }
  }
};

const submitForm = () => {
  if (validateCurrentStep()) {
    bookForm.summary = summaryContent.value;
    const booksInStorage = JSON.parse(localStorage.getItem('books') || '[]');

    bookForm.id = Date.now(); // Simple ID generation
    booksInStorage.push({ ...bookForm });
    toast.success('Kitap başarıyla eklendi!');

    localStorage.setItem('books', JSON.stringify(booksInStorage));
    localStorage.removeItem('bookFormState');
    router.push('/'); // Kitap listesine geri dön
  }
};

// Reset form
const resetForm = () => {
  Object.keys(bookForm).forEach(key => {
    if (typeof bookForm[key] === 'string') {
      bookForm[key] = '';
    } else if (Array.isArray(bookForm[key])) {
      bookForm[key] = [];
    } else if (typeof bookForm[key] === 'object' && bookForm[key] !== null) {
      Object.keys(bookForm[key]).forEach(subKey => {
        if (typeof bookForm[key][subKey] === 'string') {
          bookForm[key][subKey] = '';
        } else if (Array.isArray(bookForm[key][subKey])) {
          bookForm[key][subKey] = [];
        } else if (typeof bookForm[key][subKey] === 'boolean') {
          bookForm[key][subKey] = false;
        } else {
          bookForm[key][subKey] = null;
        }
      });
    } else {
      bookForm[key] = null;
    }
  });

  bookForm.language = 'tr';
  bookForm.bookType = 'fiction';
  bookForm.currency = 'TRY';
  summaryContent.value = '';
  imagePreview.value = null;
  currentStep.value = 1;
  localStorage.removeItem('bookFormState');
};

const theme = computed(() => store.state.ui.theme);

// Stil fonksiyonları
const getThemeStyles = computed(() => {
  const isDarkTheme = theme.value === 'dark';
  return {
    backgroundColor: isDarkTheme ? '#09090b' : '#FFFFFF',
    textColor: isDarkTheme ? '#e2e2e2' : '#333333',
    borderColor: isDarkTheme ? '#202020' : '#DDDDDD',
    accentColor: '#007bff', // Mavi vurgu rengi, değişebilir
    boxShadow: isDarkTheme ? '0 4px 12px rgba(255, 255, 255, 0.1)' : '0 4px 12px rgba(0, 0, 0, 0.2)',
    inputBackgroundColor: isDarkTheme ? '#101010' : '#f9f9f9',
    selectBackgroundColor: isDarkTheme ? '#101010' : '#f9f9f9',
  };
});

// Lifecycle hooks
onMounted(() => {
  fetchExchangeRates();
  loadFormState();
});
</script>

<template>
  <Layout>
    <div class="form-container" :style="{ backgroundColor: getThemeStyles.backgroundColor, color: getThemeStyles.textColor, boxShadow: getThemeStyles.boxShadow }">
      <h1>Yeni Kitap Ekle</h1>

      <div class="form-content">
        <!-- Progress bar -->
        <div class="progress-bar">
          <div class="progress-labels" :style="{color: getThemeStyles.textColor}">
            <span>Adım {{ currentStep }} / {{ totalSteps }}</span>
            <span>{{ Math.round((currentStep / totalSteps) * 100) }}% Tamamlandı</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
          </div>
        </div>

        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 1" class="form-step">
          <h2 :style="{color: getThemeStyles.textColor}">Temel Bilgiler</h2>

          <div class="form-group">
            <label for="title" :style="{color: getThemeStyles.textColor}">Kitap Başlığı*</label>
            <input
                id="title"
                v-model="bookForm.title"
                type="text"
                :class="{ 'error': formErrors.title }"
                :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
            />
            <p v-if="formErrors.title" class="error-message">{{ formErrors.title }}</p>
          </div>

          <div class="form-group">
            <label for="author" :style="{color: getThemeStyles.textColor}">Yazar*</label>
            <input
                id="author"
                v-model="bookForm.author"
                type="text"
                :class="{ 'error': formErrors.author }"
                :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
            />
            <p v-if="formErrors.author" class="error-message">{{ formErrors.author }}</p>
          </div>

          <div class="form-group">
            <label for="publisher" :style="{color: getThemeStyles.textColor}">Yayınevi</label>
            <input
                id="publisher"
                v-model="bookForm.publisher"
                type="text"
                :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
            />
          </div>

          <div class="form-group">
            <label for="publishDate" :style="{color: getThemeStyles.textColor}">Yayın Tarihi</label>
            <input
                id="publishDate"
                v-model="bookForm.publishDate"
                type="date"
                :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
            />
          </div>

          <div class="form-group">
            <label for="language" :style="{color: getThemeStyles.textColor}">Dil</label>
            <select
                id="language"
                v-model="bookForm.language"
                :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
            >
              <option value="tr">Türkçe</option>
              <option value="en">İngilizce</option>
              <option value="fr">Fransızca</option>
              <option value="de">Almanca</option>
              <option value="es">İspanyolca</option>
            </select>
          </div>

          <div class="form-group">
            <label for="bookType" :style="{color: getThemeStyles.textColor}">Kitap Türü*</label>
            <select
                id="bookType"
                v-model="bookForm.bookType"
                :class="{ 'error': formErrors.bookType }"
                :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
            >
              <option value="fiction">Kurgu</option>
              <option value="nonFiction">Kurgu Olmayan</option>
              <option value="children">Çocuk Kitabı</option>
            </select>
            <p v-if="formErrors.bookType" class="error-message">{{ formErrors.bookType }}</p>
          </div>
        </div>

        <!-- Step 2: Additional Information (Dynamic based on book type) -->
        <div v-if="currentStep === 2" class="form-step">
          <h2 :style="{color: getThemeStyles.textColor}">Detaylı Bilgiler</h2>

          <div class="form-group">
            <label for="isbn" :style="{color: getThemeStyles.textColor}">ISBN*</label>
            <input
                id="isbn"
                v-model="bookForm.isbn"
                type="text"
                :class="{ 'error': formErrors.isbn }"
                :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
            />
            <p v-if="formErrors.isbn" class="error-message">{{ formErrors.isbn }}</p>
          </div>

          <div class="form-group">
            <label for="pageCount" :style="{color: getThemeStyles.textColor}">Sayfa Sayısı*</label>
            <input
                id="pageCount"
                v-model="bookForm.pageCount"
                type="number"
                min="1"
                :class="{ 'error': formErrors.pageCount }"
                :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
            />
            <p v-if="formErrors.pageCount" class="error-message">{{ formErrors.pageCount }}</p>
          </div>

          <!-- Dynamic fields based on book type -->
          <!-- Fiction Fields -->
          <template v-if="bookForm.bookType === 'fiction'">
            <div class="form-group">
              <label for="series" :style="{color: getThemeStyles.textColor}">Seri</label>
              <input
                  id="series"
                  v-model="bookForm.fiction.series"
                  type="text"
                  :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
              />
            </div>

            <div class="form-group">
              <label for="seriesNumber" :style="{color: getThemeStyles.textColor}">Seri Numarası</label>
              <input
                  id="seriesNumber"
                  v-model="bookForm.fiction.seriesNumber"
                  type="number"
                  min="1"
                  :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
              />
            </div>

            <div class="form-group">
              <label :style="{color: getThemeStyles.textColor}">Karakterler</label>
              <div class="character-tags">
                <div
                    v-for="(character, index) in bookForm.fiction.characters"
                    :key="index"
                    class="character-tag"
                >
                  <span>{{ character }}</span>
                  <button
                      @click="bookForm.fiction.characters.splice(index, 1)"
                      class="remove-character"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div class="add-character">
                <input
                    id="character"
                    v-model="newCharacter"
                    type="text"
                    placeholder="Karakter adı"
                    :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
                />
                <button
                    @click="if(newCharacter) { bookForm.fiction.characters.push(newCharacter); newCharacter = ''; }"
                    class="add-character-button"
                >
                  Ekle
                </button>
              </div>
            </div>
          </template>

          <!-- Non-Fiction Fields -->
          <template v-if="bookForm.bookType === 'nonFiction'">
            <div class="form-group">
              <label for="subjectArea" :style="{color: getThemeStyles.textColor}">Konu Alanı</label>
              <input
                  id="subjectArea"
                  v-model="bookForm.nonFiction.subjectArea"
                  type="text"
                  :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
              />
            </div>

            <div class="form-group">
              <label for="academicLevel" :style="{color: getThemeStyles.textColor}">Akademik Seviye</label>
              <select
                  id="academicLevel"
                  v-model="bookForm.nonFiction.academicLevel"
                  :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
              >
                <option value="">Seçiniz</option>
                <option value="elementary">İlkokul</option>
                <option value="middle">Ortaokul</option>
                <option value="high">Lise</option>
                <option value="undergraduate">Lisans</option>
                <option value="graduate">Lisansüstü</option>
                <option value="professional">Genel Okuyucu</option>
              </select>
            </div>
          </template>

          <!-- Children's Book Fields -->
          <template v-if="bookForm.bookType === 'children'">
            <div class="form-group">
              <label for="ageRange" :style="{color: getThemeStyles.textColor}">Yaş Aralığı</label>
              <select
                  id="ageRange"
                  v-model="bookForm.children.ageRange"
                  :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
              >
                <option value="">Seçiniz</option>
                <option value="0-2">0-2 yaş</option>
                <option value="3-5">3-5 yaş</option>
                <option value="6-8">6-8 yaş</option>
                <option value="9-12">9-12 yaş</option>
                <option value="13-18">13-18 yaş</option>
              </select>
            </div>

            <div class="form-group">
              <label :style="{color: getThemeStyles.textColor}">
                <input
                    type="checkbox"
                    v-model="bookForm.children.illustrations"
                    class="mr-2"
                />
                Resimli Kitap
              </label>
            </div>

            <div class="form-group">
              <label for="educationalValue" :style="{color: getThemeStyles.textColor}">Eğitsel Değer</label>
              <textarea
                  id="educationalValue"
                  v-model="bookForm.children.educationalValue"
                  rows="3"
                  :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
              ></textarea>
            </div>
          </template>
        </div>
        <!-- Step 3: Price and Summary -->
        <div v-if="currentStep === 3" class="form-step">
          <h2 :style="{color: getThemeStyles.textColor}">Fiyat ve Özet</h2>

          <div class="form-group">
            <label :style="{color: getThemeStyles.textColor}">Fiyat ve Para Birimi*</label>
            <div class="price-input-group">
              <input
                  v-model="bookForm.price"
                  type="number"
                  min="0"
                  step="0.01"
                  :class="{ 'error': formErrors.price }"
                  :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
              />
              <select
                  v-model="bookForm.currency"
                  :class="{ 'error': formErrors.currency }"
                  :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
              >
                <option v-for="currency in currencies" :key="currency" :value="currency">
                  {{ currency }}
                </option>
              </select>
            </div>
            <p v-if="formErrors.price || formErrors.currency" class="error-message">{{ formErrors.price || formErrors.currency }}</p>
          </div>

          <!-- Exchange rate information -->
          <div v-if="bookForm.price && Object.keys(exchangeRates).length > 0" class="exchange-rates" :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }">
            <h3 :style="{color: getThemeStyles.textColor}">Diğer Para Birimlerinde:</h3>
            <div v-if="loading" class="loading" :style="{color: getThemeStyles.textColor}">Döviz kurları yükleniyor...</div>
            <ul v-else>
              <li v-for="currency in currencies" :key="currency" :style="{color: getThemeStyles.textColor}">
                <span>{{ currency }}:</span> {{ convertedPrices[currency] }}
              </li>
            </ul>
          </div>

          <div class="form-group">
            <label for="summary" :style="{color: getThemeStyles.textColor}">Kitap Özeti*</label>
            <textarea
                id="summary"
                v-model="summaryContent"
                :class="{ 'error': formErrors.summary }"
                rows="6"
                :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }"
            ></textarea>
            <p v-if="formErrors.summary" class="error-message">{{ formErrors.summary }}</p>
          </div>
        </div>

        <!-- Step 4: Cover Image -->
        <div v-if="currentStep === 4" class="form-step">
          <h2 :style="{color: getThemeStyles.textColor}">Kapak Görseli</h2>

          <div class="form-group">
            <label for="coverImage" :style="{color: getThemeStyles.textColor}">Kapak Görseli Yükle</label>
            <input
                id="coverImage"
                type="file"
                accept="image/*"
                @change="handleImageUpload"
            />
            <p class="note" :style="{color: getThemeStyles.textColor}">PNG, JPG veya GIF, max 5MB</p>
          </div>

          <!-- Image preview -->
          <div v-if="imagePreview" class="image-preview">
            <h3 :style="{color: getThemeStyles.textColor}">Görsel Önizleme:</h3>
            <div class="preview-container" :style="{ borderColor: getThemeStyles.borderColor }">
              <img :src="imagePreview" alt="Kapak önizleme" />
            </div>
          </div>

          <div v-else class="no-image" :style="{ backgroundColor: getThemeStyles.inputBackgroundColor, color: getThemeStyles.textColor }">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p :style="{color: getThemeStyles.textColor}">Henüz görsel yüklenmedi</p>
            <p class="note" :style="{color: getThemeStyles.textColor}">Görsel yüklemek için yukarıdaki butonu kullanın</p>
          </div>
        </div>

        <!-- Navigation buttons -->
        <div class="navigation-buttons">
          <button
              v-if="currentStep > 1"
              @click="prevStep"
              class="nav-button prev-button"
              :style="{ backgroundColor: getThemeStyles.borderColor, color: getThemeStyles.textColor }"
          >
            Geri
          </button>
          <div v-else></div>

          <div class="action-buttons">
            <button
                @click="resetForm"
                class="nav-button reset-button"
            >
              Sıfırla
            </button>

            <button
                v-if="currentStep < totalSteps"
                @click="nextStep"
                class="nav-button next-button"
                :style="{ backgroundColor: getThemeStyles.accentColor, color: getThemeStyles.textColor }"
            >
              Sonraki
            </button>

            <button
                v-else
                @click="submitForm"
                class="nav-button submit-button"
                :style="{ backgroundColor: getThemeStyles.accentColor, color: getThemeStyles.textColor }"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.form-container {
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}

h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

/* Progress Bar */
.progress-bar {
  margin-bottom: 20px;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.progress-track {
  width: 100%;
  height: 8px;
  background-color: #202020;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Form Grupları */
.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #202020;
  border-radius: 4px;
  background-color: #101010;
  color: #e2e2e2;
  font-size: 14px;
}

input.error,
select.error,
textarea.error {
  border-color: #ff4444;
}

.error-message {
  font-size: 12px;
  color: #ff4444;
  margin-top: 4px;
}

.note {
  font-size: 12px;
  color: #a0a0a0;
  margin-top: 4px;
}

/* Karakter Etiketleri */
.character-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.character-tag {
  display: flex;
  align-items: center;
  background-color: #202020;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 14px;
}

.remove-character {
  margin-left: 4px;
  color: #ff4444;
  cursor: pointer;
}

.add-character {
  display: flex;
  gap: 8px;
}

.add-character-button {
  background-color: #4caf50;
  color: #e2e2e2;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Döviz Kurları */
.exchange-rates {
  background-color: #101010;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.exchange-rates ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.exchange-rates li {
  font-size: 14px;
  margin-bottom: 4px;
}

.loading {
  font-size: 14px;
  color: #a0a0a0;
}

/* Görsel Yükleme */
.image-preview {
  margin-top: 16px;
}

.preview-container {
  border: 1px solid #202020;
  border-radius: 4px;
  padding: 8px;
  display: flex;
  justify-content: center;
}

.preview-container img {
  max-height: 200px;
  border-radius: 4px;
}

.no-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #101010;
  border: 2px dashed #202020;
  border-radius: 4px;
  color: #a0a0a0;
}

.no-image .icon {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
}

/* Navigasyon Butonları */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.nav-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.prev-button {
  background-color: #202020;
  color: #e2e2e2;
}

.prev-button:hover {
  background-color: #303030;
}

.reset-button {
  background-color: #ff4444;
  color: #e2e2e2;
}

.reset-button:hover {
  background-color: #cc0000;
}

.next-button {
  background-color: #4caf50;
  color: #e2e2e2;
}

.next-button:hover {
  background-color: #388e3c;
}

.submit-button {
  background-color: #2196f3;
  color: #e2e2e2;
}

.submit-button:hover {
  background-color: #1976d2;
}
/*Tema*/
.form-container {
  background-color: var(--backgroundColor);
  color: var(--textColor);
}
h1, h2, h3, label {
  color: var(--textColor);
}
input,
select,
textarea {
  background-color: var(--inputBackgroundColor);
  color: var(--textColor);
}
.note, .loading {
  color: var(--textColor);
}
.preview-container {
  border-color: var(--borderColor);
}
.nav-button.prev-button {
  background-color: var(--borderColor);
  color: var(--textColor);
}
.nav-button.next-button,
.nav-button.submit-button {
  background-color: var(--accentColor);
  color: #e2e2e2;
}
</style>