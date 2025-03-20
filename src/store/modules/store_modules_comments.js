const safeGetItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage:`, e)
    return defaultValue
  }
}

const saveCommentsToStorage = (comments) => {
  localStorage.setItem("comments", JSON.stringify(comments))
}

export default {
  namespaced: true,
  state: {
    comments: safeGetItem("comments", {})
  },
  mutations: {
    SET_COMMENTS(state, { bookId, comments }) {
      state.comments[bookId] = comments
      saveCommentsToStorage(state.comments)
    },
    ADD_COMMENT(state, { bookId, comment }) {
      if (!state.comments[bookId]) {
        state.comments[bookId] = []
      }
      state.comments[bookId].push(comment)
      saveCommentsToStorage(state.comments)
    }
  },
  actions: {
    async fetchComments({ commit, state }, bookId) {
      try {
        let comments = state.comments[bookId] || []
        if (!comments.length) {
          comments = safeGetItem("comments", {})[bookId] || []
        }
        commit("SET_COMMENTS", { bookId, comments })
      } catch (error) {
        console.error("Failed to fetch comments:", error)
      }
    },
    async addComment({ commit }, { bookId, comment }) {
      try {
        commit("ADD_COMMENT", { bookId, comment })
      } catch (error) {
        console.error("Failed to add comment:", error)
      }
    }
  }
}
