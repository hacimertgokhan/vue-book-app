## 🌟 Temel Özellikler

### 1. Kimlik Doğrulama & Kullanıcı Yönetimi
- Kullanıcı giriş ve kayıt sistemi
- Şifre kurtarma işlevi
- Hesap değiştirme özelliği
- Profil yönetimi

### 2. Kitap Yönetimi
- Kapsamlı kitap listeleme (ızgara ve liste görünümleriyle)
- Kitap detayları (şunlar dahil):
    - Başlık
    - Yazar
    - Kapak resmi
    - Fiyat
    - Açıklama
    - Dil
    - Sayfa sayısı
    - Yayın yılı
- Yeni kitap ekleme
- Mevcut kitapları düzenleme
- Hızlı bakış işlevi
- Favori kitaplar sistemi

### 3. Gelişmiş Filtreleme & Arama
- Gerçek zamanlı arama işlevi
- Çoklu filtre seçenekleri:
    - Kategoriye göre filtreleme
    - Dile göre filtreleme
    - Fiyat aralığı
    - Yayın yılı aralığı
    - Sayfa sayısı aralığı
    - Ücretsiz kitaplar filtresi
- Sıralama seçenekleri:
    - Yayın tarihi
    - Fiyat (artan/azalan)
    - İsim

### 4. Para Birimi Yönetimi
- Çoklu para birimi desteği (TRY, USD, EUR, GBP)
- Gerçek zamanlı döviz kuru çevrimi
- Dinamik fiyat gösterimi

### 5. Arayüz/Kullanıcı Deneyimi (UI/UX) Özellikleri
- Karanlık/Aydınlık tema desteği
- Öne çıkan kitaplar için duyarlı (responsive) carousel
- Izgara/Liste görünümü geçişi
- Sonsuz kaydırma uygulaması
- Yükleme durumları ve göstergeleri
- Duyarlı (responsive) tasarım

### 6. Özel Bölümler
- Öne Çıkan Kitaplar carousel'i
- İndirimli Kitaplar bölümü
- Ücretsiz Kitaplar bölümü

## 🏗 Proje Yapısı

### Temel Bileşenler
1. **Yerleşim Sistemi**
    - `Layout.vue`: Ana yerleşim sarmalayıcısı

2. **Görünümler (Views)**
    - `Home.vue`: Ana kontrol paneli
    - `Login.vue`: Kimlik doğrulama
    - `Register.vue`: Kullanıcı kaydı
    - `ForgotPassword.vue`: Şifre kurtarma
    - `Profile.vue`: Kullanıcı profili
    - `Settings.vue`: Uygulama ayarları
    - `Manage.vue`: Yönetim arayüzü
    - `ExchangeRates.vue`: Döviz kurları

3. **Kitap Yönetimi Görünümleri**
    - `BookDetails.vue`: Detaylı kitap görünümü
    - `EditBook.vue`: Kitap düzenleme arayüzü
    - `AddBook.vue`: Yeni kitap oluşturma

### Durum Yönetimi
- Vuex store modülleri:
    - `books`: Kitap yönetimi
    - `user`: Kullanıcı kimlik doğrulaması ve tercihleri
    - `ui`: Arayüz durumu
    - `favorites`: Favori kitaplar
    - `comments`: Kitap yorumları
    - `currency`: Para birimi yönetimi

### Router Yapılandırması
- Korumalı rotalar (requiresAuth)
- Herkese açık rotalar
- Yönlendirme işleme
- Navigasyon korumaları

## 🎨 Stil
- Duyarlı (responsive) tasarım
- Tema desteği (Karanlık/Aydınlık)
- CSS geçişleri ve animasyonları
- Esnek ızgara sistemi
- Özel arayüz bileşenleri

## 💡 Teknik Özellikler
1. Sekmeli arama (debounced search) uygulaması
2. Tembel yükleme (lazy loading) ile sonsuz kaydırma
3. Kalıcı durum yönetimi
4. Gerçek zamanlı döviz kuru çevrimi
5. Dinamik resim işleme
6. Duyarlı carousel uygulaması

## 🛡 Güvenlik Özellikleri
- Kimlik doğrulama korumaları
- Korumalı rotalar
- Oturum yönetimi
- Güvenli durum kalıcılığı

## 🔄 Durum Kalıcılığı
- Şunlar için kalıcı depolama:
    - Kullanıcı kimlik doğrulaması
    - Favoriler
    - Tema tercihleri
    - Para birimi tercihleri
