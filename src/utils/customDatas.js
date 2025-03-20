import { ref } from "vue";

const storedBooks = localStorage.getItem("featuredBooks");
export const featuredBooks = ref(storedBooks ? JSON.parse(storedBooks) : []);

const updateLocalStorage = () => {
    localStorage.setItem("featuredBooks", JSON.stringify(featuredBooks.value));
};
