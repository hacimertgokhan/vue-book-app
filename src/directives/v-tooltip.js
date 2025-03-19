export default {
    beforeMount(el, binding) {
        el.setAttribute('title', binding.value);
    }
};
