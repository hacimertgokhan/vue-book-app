<template>
  <div class="currency-card">
    <h3>{{ currency }}: {{ rate }}</h3>
  </div>
</template>

<script setup>
defineProps(['currency', 'rate']);
</script>
