<template>
  <div class="currency-card">
    <span class="currency-symbol">{{ currency }}</span>
    <span class="currency-rate">{{ rate ? rate.toFixed(2) : 'Veri Yok' }}</span>
  </div>
</template>

<script setup>
defineProps({
  currency: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    default: null,
  },
});
</script>

<style scoped>
.currency-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 400px; /* Kartların genişliğini sınırlayın */
}

.currency-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.currency-symbol {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.currency-rate {
  font-size: 1.2rem;
  color: #555;
}
</style>