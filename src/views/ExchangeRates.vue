<template>
  <Layout>
    <h2>Döviz Kurları</h2>
    <button @click="fetchRates">Güncelle</button>
    <CurrencyCard v-for="(rate, currency) in store.state.rates" :key="currency" :currency="currency" :rate="rate" />
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import Layout from '../components/Layout.vue';
import CurrencyCard from '../components/CurrencyCard.vue';

const store = useStore();

const fetchRates = () => {
  store.dispatch('fetchRates');
};

onMounted(fetchRates);
</script>
