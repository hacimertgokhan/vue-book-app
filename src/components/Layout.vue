<template>
  <Navbar />
  <slot></slot>
  <Footer/>
</template>

<script setup>
import Navbar from './Navbar.vue';
import Footer from "./Footer.vue";
</script>
