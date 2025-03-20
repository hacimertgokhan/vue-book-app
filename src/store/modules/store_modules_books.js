import {featuredBooks} from "@/utils/customDatas.js";

const safeGetItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage:`, e);
    return defaultValue;
  }
};

const saveBooksToStorage = (books) => {
  localStorage.setItem("books", JSON.stringify(books));
};

export default {
  namespaced: true,
  state: {
    books: safeGetItem("books", featuredBooks.value), // Başlangıçta featuredBooks'u kullan
    selectedBook: safeGetItem("selectedBook", null),
    loading: false,
    error: null,
  },
  mutations: {
    SET_BOOKS(state, books) {
      state.books = books;
      saveBooksToStorage(books); // Her değişiklikte localStorage'a kaydet
    },
    SET_SELECTED_BOOK(state, book) {
      state.selectedBook = book;
      localStorage.setItem("selectedBook", JSON.stringify(book)); // Seçilen kitabı kaydet
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchBooks({ commit }) {
      try {
        commit("SET_LOADING", true);
        let books = safeGetItem("books", featuredBooks.value); // localStorage'dan yoksa featuredBooks
        if (books.length === 0) {
          books = featuredBooks.value; // Eğer localStorage boşsa başlangıç verisini kullan
        }
        commit("SET_BOOKS", books);
      } catch (error) {
        commit("SET_ERROR", error.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async selectBook({ commit, state }, bookId) {
      try {
        commit("SET_LOADING", true);
        const book = state.books.find((b) => b.id === bookId);
        if (!book) {
          throw new Error("Kitap bulunamadı");
        }
        commit("SET_SELECTED_BOOK", book);
      } catch (error) {
        commit("SET_ERROR", error.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },
    // Yeni bir kitap eklemek için ek bir action
    async addBook({ commit, state }, newBook) {
      try {
        commit("SET_LOADING", true);
        const updatedBooks = [...state.books, { ...newBook, id: Date.now() }]; // Benzersiz ID
        commit("SET_BOOKS", updatedBooks);
      } catch (error) {
        commit("SET_ERROR", error.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
  getters: {
    getBookById: (state) => (id) => {
      return state.books.find((book) => book.id === id);
    },
    freeBooks: (state) => {
      return state.books.filter((book) => book.isFree);
    },
    discountedBooks: (state) => {
      return state.books.filter((book) => book.discountedPrice !== null);
    },
  },
};